import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec, spawn } from 'node:child_process';
import util from 'node:util';
import fs from 'node:fs/promises';

const execAsync = util.promisify(exec);

// Manual hack to fix process.env.PATH on macOS GUI apps
async function ensurePath() {
    if (process.platform === 'darwin') {
        try {
            const shell = process.env.SHELL || '/bin/zsh';
            const { stdout } = await execAsync(`"${shell}" -ilc 'echo -n "_SEPARATOR_"; env; echo -n "_SEPARATOR_"'`);
            const envVars = stdout.split('_SEPARATOR_')[1].split('\n');
            const pathLine = envVars.find(line => line.startsWith('PATH='));
            if (pathLine) {
                const userPath = pathLine.replace('PATH=', '').trim();
            }
        } catch (error) {
            console.error('Could not fix PATH:', error);
        }
    }
}

// Synchronously inject standard Homebrew / global node bin paths immediately
process.env.PATH = `/opt/homebrew/bin:/usr/local/bin:${process.env.PATH || ''}`;

// Execute it early but don't block window creation immediately
ensurePath();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, '..');
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST;

let win;
let managerWin = null;

// Helper to broadcast debug logs to the renderer UI
function sendLog(msg) {
    console.log(msg); // Keep terminal logging just in case
    if (win && win.webContents) {
        win.webContents.send('debug-log', msg);
    }
}

function createWindow() {
    win = new BrowserWindow({
        width: 1000,
        height: 850,
        titleBarStyle: 'hiddenInset',
        webPreferences: {
            // NOTE: vite-plugin-electron changes preload output to .mjs
            preload: path.join(__dirname, 'preload.mjs'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL);
    } else {
        win.loadFile(path.join(RENDERER_DIST, 'index.html'));
    }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Helper for commands where we want to wait, but stream the logs live
function runCommandStreaming(cmd, args, cwd) {
    return new Promise((resolve, reject) => {
        if (cmd === 'openclaw') {
            args = ['/opt/homebrew/lib/node_modules/openclaw/openclaw.mjs', ...args];
            cmd = '/opt/homebrew/bin/node';
        }
        
        sendLog(`> [EXEC] ${cmd} ${args.join(' ')}`);
        
        const child = spawn(cmd, args, { cwd, shell: true });
        
        child.stdout.on('data', (data) => sendLog(data.toString().trim()));
        child.stderr.on('data', (data) => sendLog(data.toString().trim()));
        
        child.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`Command failed with code ${code}`));
        });
        child.on('error', (err) => reject(err));
    });
}

ipcMain.handle('check-prerequisites', async () => {
    const result = { git: false, python: false, npm: false };
    
    sendLog('> [SYSTEM] Checking System Prerequisites...');
    try { 
        sendLog('> [EXEC] git --version');
        const { stdout } = await execAsync('git --version'); 
        sendLog(stdout.trim());
        result.git = true; 
    } catch (e) { sendLog(`> [SYSTEM] [ERROR] Git not found: ${e.message}`); }
    
    try { 
        sendLog('> [EXEC] python3 --version');
        const { stdout } = await execAsync('python3 --version'); 
        sendLog(stdout.trim());
        result.python = true; 
    } catch (e) { sendLog(`> [SYSTEM] [ERROR] Python3 not found: ${e.message}`); }
    
    try { 
        sendLog('> [EXEC] npm --version');
        const { stdout } = await execAsync('npm --version'); 
        sendLog(stdout.trim());
        result.npm = true; 
    } catch (e) { sendLog(`> [SYSTEM] [ERROR] NPM not found: ${e.message}`); }
    
    return result;
});

// Helper function to conditionally install Homebrew
async function ensureHomebrew() {
    try {
        await execAsync('brew --version');
        sendLog('> [SYSTEM] Homebrew is already installed.');
        return true;
    } catch (e) {
        sendLog('> [SYSTEM] Homebrew not found. Attempting installation...');
        // Install Xcode Command Line Tools first quietly
        try {
            sendLog('> [SYSTEM] Checking/Installing Xcode Command Line Tools...');
            sendLog('> [EXEC] xcode-select --install');
            await runCommandStreaming('xcode-select', ['--install'], process.env.APP_ROOT);
        } catch (xcodeErr) {
            // xcode-select exits with error if already installed, which is fine
            sendLog('> [SYSTEM] Xcode Command Line Tools already installed or user prompted.');
        }

        // Running the automated, non-interactive brew install script
        sendLog('> [SYSTEM] Downloading and running Homebrew installer script...');
        try {
            await runCommandStreaming('bash', ['-c', 'NONINTERACTIVE=1 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'], app.getPath('home'));
            
            // On Apple Silicon, we must manually add brew to the PATH for this session
            if (process.arch === 'arm64') {
                process.env.PATH = `/opt/homebrew/bin:/opt/homebrew/sbin:${process.env.PATH}`;
            } else {
                 process.env.PATH = `/usr/local/bin:/usr/local/sbin:${process.env.PATH}`;
            }
            sendLog('> [SYSTEM] Homebrew installation complete.');
            return true;
        } catch (brewErr) {
            sendLog(`> [SYSTEM] [ERROR] Failed to install Homebrew automatically: ${brewErr.message}`);
            throw brewErr;
        }
    }
}

ipcMain.handle('install-dependency', async (event, dependencyName) => {
    sendLog(`> [SYSTEM] Requested auto-installation for missing dependency: ${dependencyName}`);
    try {
        // Ensure Homebrew mechanism is available
        await ensureHomebrew();

        let brewPackageName = '';
        let verifyCommand = '';

        if (dependencyName === 'git') {
            brewPackageName = 'git';
            verifyCommand = 'git --version';
        } else if (dependencyName === 'python') {
            brewPackageName = 'python';
            verifyCommand = 'python3 --version';
        } else if (dependencyName === 'npm') {
            brewPackageName = 'node'; // npm is bundled with node
            verifyCommand = 'npm --version';
        } else {
             throw new Error('Unknown dependency requested');
        }

        sendLog(`> [SYSTEM] Installing ${brewPackageName} via Homebrew...`);
        await runCommandStreaming('brew', ['install', brewPackageName], app.getPath('home'));
        
        sendLog(`> [SYSTEM] Verifying installation of ${dependencyName}...`);
        sendLog(`> [EXEC] ${verifyCommand}`);
        const { stdout } = await execAsync(verifyCommand);
        sendLog(stdout.trim());
        sendLog(`> [SYSTEM] ${dependencyName} installed successfully!`);
        
        return { success: true };
    } catch (error) {
        sendLog(`> [SYSTEM] [ERROR] Installation pipeline failed: ${error.message}`);
        return { success: false, error: error.message };
    }
});

let openclawProcess = null;
let activeWorkspacePath = null;

ipcMain.handle('setup-workspace', async (event, workspacePathInput) => {
    const workspacePath = workspacePathInput.replace('~', app.getPath('home'));
    sendLog(`> [SYSTEM] Setting up workspace at: ${workspacePath}`);

    try {
        sendLog(`> [EXEC] openclaw onboard --workspace "${workspacePath}" --non-interactive --accept-risk`);
        await runCommandStreaming('openclaw', ['onboard', '--workspace', workspacePath, '--non-interactive', '--accept-risk', '--skip-daemon', '--skip-channels', '--skip-search', '--skip-skills', '--skip-ui', '--skip-health'], app.getPath('home'));
        
        sendLog(`> [EXEC] openclaw config set gateway.bind lan (cwd: ${workspacePath})`);
        await runCommandStreaming('openclaw', ['config', 'set', 'gateway.bind', 'lan'], workspacePath);
        
        sendLog('> [SYSTEM] Workspace setup complete.');
    } catch (e) {
        sendLog(`> [SYSTEM] [ERROR] Setup failed: ${e.message}`);
        throw e;
    }

    return { success: true };
});

ipcMain.handle('save-api-key', async (event, config) => {
    const workspacePath = config.workspacePath.replace('~', app.getPath('home'));
    
    sendLog('> [SYSTEM] Applying API keys via `openclaw onboard`...');
    let args = ['onboard', '--non-interactive', '--accept-risk', '--skip-daemon', '--skip-channels', '--skip-search', '--skip-skills', '--skip-ui', '--skip-health', '--workspace', workspacePath];
    
    if (config.apiKeys && Array.isArray(config.apiKeys)) {
        for (const item of config.apiKeys) {
            if (item.key && item.key.trim() !== '') {
                let providerArg = '';
                if (item.provider === 'OpenAI') providerArg = '--openai-api-key';
                else if (item.provider === 'Anthropic') providerArg = '--anthropic-api-key';
                else if (item.provider === 'Google Gemini') providerArg = '--gemini-api-key';
                else if (item.provider === 'ByteDance Doubao') providerArg = '--volcengine-api-key';
                else if (item.provider === 'xAI (Grok)') providerArg = '--xai-api-key';
                else if (item.provider === 'Together AI') providerArg = '--together-api-key';
                else { continue; }
                
                args.push(providerArg, item.key.trim());
            }
        }
    } else if (config.apiKey) {
        args.push('--openai-api-key', config.apiKey);
    }
    
    try {
        sendLog(`> [EXEC] openclaw ${args.join(' ')}`);
        await runCommandStreaming('openclaw', args, app.getPath('home'));
        sendLog('> [SYSTEM] API Configuration applied successfully.');
        return { success: true };
    } catch (e) {
        sendLog(`> [SYSTEM] [ERROR] Onboard config failed: ${e.message}`);
        throw e;
    }
});

ipcMain.handle('save-channels', async (event, config) => {
    sendLog('> [SYSTEM] Configuring Channels via native CLI commands...');
    
    if (config.channels && Array.isArray(config.channels)) {
        for (const item of config.channels) {
            let provider = item.provider.toLowerCase();
            
            if (provider.includes('lark')) {
                const pName = 'feishu';
                try {
                    try {
                        sendLog(`> [EXEC] openclaw plugins install @openclaw/feishu`);
                        await runCommandStreaming('openclaw', ['plugins', 'install', '@openclaw/feishu'], app.getPath('home'));
                    } catch (installErr) {
                        sendLog(`> [SYSTEM] Feishu plugin already installed or failed to install: ${installErr.message}`);
                        // Continue even if installation fails (it might already exist)
                    }
                    
                    const workspacePath = config.workspacePath.replace('~', app.getPath('home'));
                    sendLog(`> [EXEC] openclaw config set channels.${pName}.enabled true`);
                    await runCommandStreaming('openclaw', ['config', 'set', `channels.${pName}.enabled`, 'true'], workspacePath);
                    
                    sendLog(`> [SYSTEM] Bypassing CLI to write Feishu credentials directly to openclaw.json...`);
                    const cfgPath = path.join(workspacePath, 'openclaw.json');
                    try {
                        await fs.access(cfgPath);
                        const rawCfg = await fs.readFile(cfgPath, 'utf8');
                        const cfgObj = JSON.parse(rawCfg);
                        
                        if (!cfgObj.channels) cfgObj.channels = {};
                        if (!cfgObj.channels[pName]) cfgObj.channels[pName] = { enabled: true };
                        if (!cfgObj.channels[pName].accounts) cfgObj.channels[pName].accounts = {};
                        if (!cfgObj.channels[pName].accounts[pName]) cfgObj.channels[pName].accounts[pName] = { enabled: true };
                        
                        if (item.appId) cfgObj.channels[pName].accounts[pName].appId = item.appId.trim();
                        if (item.appSecret) cfgObj.channels[pName].accounts[pName].appSecret = item.appSecret.trim();
                        if (item.encryptKey) cfgObj.channels[pName].accounts[pName].encryptKey = item.encryptKey.trim();
                        if (item.verificationToken) cfgObj.channels[pName].accounts[pName].verificationToken = item.verificationToken.trim();
                        if (item.domain) cfgObj.channels[pName].accounts[pName].domain = item.domain.trim();
                        if (item.dmPolicy) cfgObj.channels[pName].accounts[pName].dmPolicy = item.dmPolicy.trim();
                        
                        await fs.writeFile(cfgPath, JSON.stringify(cfgObj, null, 2));
                        sendLog(`> [SYSTEM] Feishu credentials written directly to openclaw.json.`);
                    } catch (err) {
                        sendLog(`> [SYSTEM] openclaw.json not found or unreadable: ${err.message}`);
                    }
                } catch (e) {
                    sendLog(`> [SYSTEM] [ERROR] Failed to add Lark channel: ${e.message}`);
                }
                continue;
            }
            
            if (item.key && item.key.trim() !== '') {
                let tokenArg = provider === 'slack' ? '--bot-token' : '--token';
                if (provider === 'webhook' || provider === 'whatsapp') continue;
                
                let args = ['channels', 'add', '--channel', provider, tokenArg, item.key.trim()];
                try {
                    const workspacePath = config.workspacePath.replace('~', app.getPath('home'));
                    sendLog(`> [EXEC] openclaw config set channels.${provider}.enabled true`);
                    await runCommandStreaming('openclaw', ['config', 'set', `channels.${provider}.enabled`, 'true'], workspacePath);
                    
                    sendLog(`> [EXEC] openclaw ${args.join(' ')}`);
                    await runCommandStreaming('openclaw', args, workspacePath);
                } catch (e) {
                    sendLog(`> [SYSTEM] [ERROR] Failed to add channel ${provider}: ${e.message}`);
                }
            }
        }
    }
    
    sendLog('> [SYSTEM] Channel setup sequence finished.');
    return { success: true };
});

ipcMain.handle('generate-whatsapp-qr', async (event, workspacePathInput) => {
    sendLog('> [SYSTEM] Launching native WhatsApp Web Linker...');
    sendLog('> [SYSTEM] Look at the Debug Log below to scan the Terminal ASCII QR Code.');
    try {
        const workspacePath = workspacePathInput.replace('~', app.getPath('home'));
        
        sendLog(`> [EXEC] openclaw config set channels.whatsapp.enabled true`);
        await runCommandStreaming('openclaw', ['config', 'set', 'channels.whatsapp.enabled', 'true'], workspacePath);
        
        sendLog(`> [EXEC] openclaw channels login --channel whatsapp (cwd: ${workspacePath})`);
        await runCommandStreaming('openclaw', ['channels', 'login', '--channel', 'whatsapp'], workspacePath);
        
        sendLog('> [SYSTEM] WhatsApp Session Linked Successfully!');
        return { success: true, qrDataUrl: null };
    } catch (error) {
        sendLog(`> [SYSTEM] [ERROR] WhatsApp QR Generation failed: ${error.message}`);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('test-message', async (event, workspacePathInput, channel, phone, msg) => {
    sendLog(`> [SYSTEM] Initiating Test Message dispatch to ${phone} via ${channel}...`);
    try {
        const workspacePath = workspacePathInput.replace('~', app.getPath('home'));
        const repoPath = workspacePath;
        
        let targetId = phone;
        if (channel === 'telegram' && targetId.startsWith('@')) {
            const possibleNumeric = targetId.substring(1);
            if (/^\d+$/.test(possibleNumeric)) {
                targetId = possibleNumeric;
            }
        } else if (channel === 'feishu' || channel === 'lark') {
            channel = 'feishu'; // Ensure we use 'feishu' for the CLI command
            if (targetId.startsWith('@')) {
                // Feishu expects user:openId or chat:chatId. We'll default to user for testing.
                targetId = 'user:' + targetId.substring(1);
            } else if (!targetId.includes(':')) {
                // If it's just a raw string like "taijin", make it "user:taijin" to avoid the Unknown target error.
                targetId = 'user:' + targetId;
            }
        }
        
        let cmdArgs = ['message', 'send', '--channel', channel, '-t', targetId, '-m', msg];
        if (channel === 'feishu') {
            cmdArgs = ['message', 'send', '--channel', channel, '--account', 'feishu', '-t', targetId, '-m', msg];
        }
        
        sendLog(`> [EXEC] openclaw ${cmdArgs.join(' ')} (cwd: ${repoPath})`);
        
        // Ensure we execute from inside the cloned repository to prevent ENOTDIR from ASAR roots.
        await runCommandStreaming('openclaw', cmdArgs, repoPath);
        
        sendLog('> [SYSTEM] Test Message dispatched successfully.');
        return { success: true };
    } catch (error) {
        sendLog(`> [SYSTEM] [ERROR] Message dispatch failed: ${error.message}`);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('approve-pairing', async (event, config) => {
    sendLog(`> [SYSTEM] Initiating Pairing Approval for ${config.channel} with code ${config.code}...`);
    try {
        const workspacePath = config.workspacePath.replace('~', app.getPath('home'));
        const repoPath = workspacePath;
        
        let cmdArgs = ['pairing', 'approve', config.channel, config.code];
        sendLog(`> [EXEC] openclaw ${cmdArgs.join(' ')} (cwd: ${repoPath})`);
        
        await runCommandStreaming('openclaw', cmdArgs, repoPath);
        
        sendLog('> [SYSTEM] Pairing approved successfully.');
        return { success: true };
    } catch (error) {
        sendLog(`> [SYSTEM] [ERROR] Pairing approval failed: ${error.message}`);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('start-claw', async (event, config) => {
    if (openclawProcess) {
        sendLog('> [SYSTEM] OpenClaw is already running.');
        return { success: true };
    }
    const workspacePath = config.workspacePath.replace('~', app.getPath('home'));
    activeWorkspacePath = workspacePath;
    sendLog('> [SYSTEM] Requesting daemon installation configuration...');
    const args = ['onboard', '--install-daemon', '--non-interactive', '--accept-risk', '--workspace', workspacePath];

    try {
        sendLog(`> [EXEC] openclaw ${args.join(' ')}`);
        await runCommandStreaming('openclaw', args, app.getPath('home'));
        
        sendLog('> [SYSTEM] Waiting 3 seconds for daemon to initialize its web server...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        openclawProcess = true; // Use boolean flag to mark daemon is active natively

        sendLog('> [SYSTEM] Fetching Manager Dashboard URL...');
        try {
            const { stdout } = await execAsync('/opt/homebrew/bin/node /opt/homebrew/lib/node_modules/openclaw/openclaw.mjs dashboard --no-open', { cwd: app.getPath('home') });
            const match = stdout.match(/Dashboard URL:\s*(https?:\/\/[^\s]+)/);
            if (match && match[1]) {
                const dashboardUrl = match[1];
                sendLog(`> [SYSTEM] Opening Manager at: ${dashboardUrl}`);
                
                managerWin = new BrowserWindow({
                    width: 1200,
                    height: 800,
                    title: 'OpenClaw Manager',
                    webPreferences: {
                        nodeIntegration: false,
                        contextIsolation: true,
                        preload: path.join(__dirname, 'preload.mjs')
                    }
                });
                managerWin.loadURL(dashboardUrl);
                
                let __langInjected = false;
                managerWin.webContents.on('did-finish-load', async () => {
                    if (!__langInjected && config.lang) {
                        __langInjected = true;
                        await managerWin.webContents.executeJavaScript(`try { localStorage.setItem('openclaw.i18n.locale', '${config.lang}'); } catch(e) {}`);
                        managerWin.webContents.reload();
                    }
                });
                
                managerWin.on('closed', () => {
                    managerWin = null;
                });
            } else {
                sendLog('> [SYSTEM] Could not parse Dashboard URL from stdout.');
            }
        } catch (dashboardErr) {
            sendLog(`> [SYSTEM] Failed to load dashboard: ${dashboardErr.message}`);
        }
        
        return { success: true };
    } catch (error) {
        sendLog(`> [SYSTEM] [ERROR] Failed to start OpenClaw daemon: ${error.message}`);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('stop-claw', async () => {
    sendLog('> [SYSTEM] Stop button pressed. Sending kill signal to active process.');
    if (openclawProcess) {
        sendLog(`> [EXEC] openclaw daemon stop`);
        try {
            await runCommandStreaming('openclaw', ['daemon', 'stop'], app.getPath('home'));
        } catch (e) {
            sendLog(`> [SYSTEM] (daemon stop returned error: ${e.message})`);
            sendLog(`> [EXEC] pkill -f "node.*openclaw"`);
            await execAsync(`pkill -f "node.*openclaw"`).catch(() => {});
        }
        openclawProcess = null;
        if (managerWin) {
            managerWin.close();
            managerWin = null;
        }
        sendLog('> [SYSTEM] Active OpenClaw process terminated gracefully.');
        return { success: true };
    }
    sendLog('> [SYSTEM] No active process found to stop.');
    return { success: false, message: 'OpenClaw is not currently running.' };
});

ipcMain.handle('kill-all-tasks', async () => {
    sendLog('> [SYSTEM] WARNING: Kill All Tasks initiated.');
    try {
        sendLog(`> [EXEC] pkill -f "python3.*openclaw"`);
        try {
            const { stdout, stderr } = await execAsync(`pkill -f "python3.*openclaw"`);
            if (stdout) sendLog(stdout.trim());
            if (stderr) sendLog(stderr.trim());
        } catch (e) {
             sendLog(`> [SYSTEM] (pkill returned error, likely no tasks found tracking openclaw string: ${e.message})`);
        }
        sendLog(`> [EXEC] pkill -f "node.*openclaw"`);
        try {
            await execAsync(`pkill -f "node.*openclaw"`);
        } catch (e) {}

        if (openclawProcess) {
            sendLog('> [SYSTEM] Nullifying internal process tracking handle.');
            openclawProcess = null;
        }
        if (managerWin) {
            managerWin.close();
            managerWin = null;
        }
        sendLog('> [SYSTEM] Purge complete.');
        return { success: true };
    } catch (error) {
         sendLog(`> [SYSTEM] [ERROR] Kill task sequence failed: ${error.message}`);
         return { success: false, error: error.message };
    }
});

ipcMain.handle('uninstall-claw', async (event, workspacePathInput) => {
    sendLog('> [SYSTEM] Uninstall sequence initiated.');
    try {
        const workspacePath = (workspacePathInput || activeWorkspacePath || '').replace('~', app.getPath('home'));
        const repoPath = path.join(workspacePath, 'openclaw');
        const configPath = path.join(app.getPath('home'), '.openclaw');
        const asBinary = '/opt/homebrew/bin/openclaw';
        const intelBinary = '/usr/local/bin/openclaw';
        
        if (openclawProcess) {
            sendLog('> [SYSTEM] Stopping active daemon before directory removal...');
            try {
                await runCommandStreaming('openclaw', ['daemon', 'stop'], app.getPath('home'));
            } catch (e) {}
            await execAsync(`pkill -f "node.*openclaw"`).catch(() => {});
            await execAsync(`pkill -f "python3.*openclaw"`).catch(() => {});
            openclawProcess = null;
        }
        if (managerWin) {
            managerWin.close();
            managerWin = null;
        }

        const targets = [
            { path: repoPath, name: 'OpenClaw Workspace Repository' },
            { path: configPath, name: 'Global ~/.openclaw Config Directory' },
            { path: asBinary, name: 'Apple Silicon Executable (/opt/homebrew/bin)' },
            { path: intelBinary, name: 'Intel Mac Executable (/usr/local/bin)' }
        ];

        let anyDeleted = false;
        const currentWindow = BrowserWindow.getFocusedWindow() || win;

        for (const target of targets) {
            try {
                // Check if the path exists
                await fs.stat(target.path);
                
                // Path exists, ask for approval
                const { response } = await dialog.showMessageBox(currentWindow, {
                    type: 'warning',
                    title: 'Approve Deletion',
                    message: `Do you want to permanently delete the following path?\n\n${target.name}\n${target.path}`,
                    buttons: ['Approve Deletion', 'Skip'],
                    defaultId: 1, // Default to Skip for safety
                    cancelId: 1
                });

                if (response === 0) { // Approved
                    sendLog(`> [SYSTEM] User APPROVED deletion of ${target.path}`);
                    sendLog(`> [EXEC] rm -rf ${target.path}`);
                    await fs.rm(target.path, { recursive: true, force: true });
                    sendLog(`> [SYSTEM] ${target.name} successfully deleted.`);
                    anyDeleted = true;
                } else {
                    sendLog(`> [SYSTEM] User SKIPPED deletion of ${target.path}`);
                }
            } catch (err) {
                if (err.code === 'ENOENT') {
                    // Silently ignore paths that aren't on this system
                    sendLog(`> [SYSTEM] Path not found on system: ${target.path}. Skipping.`);
                } else {
                    sendLog(`> [SYSTEM] [ERROR] Failed to access ${target.path}: ${err.message}`);
                }
            }
        }
        
        if (anyDeleted) {
            sendLog('> [SYSTEM] Uninstall sequence completed successfully.');
        } else {
            sendLog('> [SYSTEM] Uninstall sequence completed. No files were removed.');
        }
        
        return { success: true };
    } catch (error) {
        sendLog(`> [SYSTEM] [ERROR] Uninstall sequence encountered a critical error: ${error.message}`);
        return { success: false, error: error.message };
    }
});
