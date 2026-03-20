import { BrowserWindow, app, dialog, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { exec, spawn } from "node:child_process";
import util from "node:util";
import fs from "node:fs/promises";
//#region electron/main.js
var execAsync = util.promisify(exec);
async function ensurePath() {
	if (process.platform === "darwin") try {
		const { stdout } = await execAsync(`"${process.env.SHELL || "/bin/zsh"}" -ilc 'echo -n "_SEPARATOR_"; env; echo -n "_SEPARATOR_"'`);
		const pathLine = stdout.split("_SEPARATOR_")[1].split("\n").find((line) => line.startsWith("PATH="));
		if (pathLine) pathLine.replace("PATH=", "").trim();
	} catch (error) {
		console.error("Could not fix PATH:", error);
	}
}
process.env.PATH = `/opt/homebrew/bin:/usr/local/bin:${process.env.PATH || ""}`;
ensurePath();
var __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
var VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
var MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
var RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
var win;
var managerWin = null;
function sendLog(msg) {
	console.log(msg);
	if (win && win.webContents) win.webContents.send("debug-log", msg);
}
function createWindow() {
	win = new BrowserWindow({
		width: 1e3,
		height: 850,
		titleBarStyle: "hiddenInset",
		webPreferences: {
			preload: path.join(__dirname, "preload.mjs"),
			nodeIntegration: false,
			contextIsolation: true
		}
	});
	if (VITE_DEV_SERVER_URL) win.loadURL(VITE_DEV_SERVER_URL);
	else win.loadFile(path.join(RENDERER_DIST, "index.html"));
}
app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});
app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
function runCommandStreaming(cmd, args, cwd) {
	return new Promise((resolve, reject) => {
		if (cmd === "openclaw") {
			args = ["/opt/homebrew/lib/node_modules/openclaw/openclaw.mjs", ...args];
			cmd = "/opt/homebrew/bin/node";
		} else if (cmd === "brew") cmd = process.arch === "arm64" ? "/opt/homebrew/bin/brew" : "/usr/local/bin/brew";
		else if (cmd === "git") cmd = process.arch === "arm64" ? "/opt/homebrew/bin/git" : "/usr/bin/git";
		else if (cmd === "npm") cmd = process.arch === "arm64" ? "/opt/homebrew/bin/npm" : "/usr/local/bin/npm";
		sendLog(`> [EXEC] ${cmd} ${args.join(" ")}`);
		const child = spawn(cmd, args, {
			cwd,
			shell: true
		});
		let outputBuffer = "";
		child.stdout.on("data", (data) => {
			const str = data.toString();
			outputBuffer += str;
			sendLog(str.trim());
		});
		child.stderr.on("data", (data) => {
			const str = data.toString();
			outputBuffer += str;
			sendLog(str.trim());
		});
		child.on("close", (code) => {
			if (code === 0) resolve();
			else {
				const match = outputBuffer.match(/Error: (.+)/);
				const cause = match ? match[1] : outputBuffer.slice(-200).trim() || `Command failed with code ${code}`;
				reject(new Error(cause));
			}
		});
		child.on("error", (err) => reject(err));
	});
}
ipcMain.handle("check-prerequisites", async () => {
	const result = {
		git: false,
		python: false,
		npm: false
	};
	sendLog("> [SYSTEM] Checking System Prerequisites...");
	try {
		sendLog("> [EXEC] git --version");
		const { stdout } = await execAsync("git --version");
		sendLog(stdout.trim());
		result.git = true;
	} catch (e) {
		sendLog(`> [SYSTEM] [ERROR] Git not found: ${e.message}`);
	}
	try {
		sendLog("> [EXEC] python3 --version");
		const { stdout } = await execAsync("python3 --version");
		sendLog(stdout.trim());
		result.python = true;
	} catch (e) {
		sendLog(`> [SYSTEM] [ERROR] Python3 not found: ${e.message}`);
	}
	try {
		sendLog("> [EXEC] npm --version");
		const { stdout } = await execAsync("npm --version");
		sendLog(stdout.trim());
		result.npm = true;
	} catch (e) {
		sendLog(`> [SYSTEM] [ERROR] NPM not found: ${e.message}`);
	}
	return result;
});
async function ensureHomebrew() {
	try {
		await execAsync("brew --version");
		sendLog("> [SYSTEM] Homebrew is already installed.");
		return true;
	} catch (e) {
		sendLog("> [SYSTEM] Homebrew not found. Attempting installation...");
		try {
			sendLog("> [SYSTEM] Checking/Installing Xcode Command Line Tools...");
			sendLog("> [EXEC] xcode-select --install");
			await runCommandStreaming("xcode-select", ["--install"], process.env.APP_ROOT);
		} catch (xcodeErr) {
			sendLog("> [SYSTEM] Xcode Command Line Tools already installed or user prompted.");
		}
		sendLog("> [SYSTEM] Downloading and running Homebrew installer script...");
		try {
			await runCommandStreaming("bash", ["-c", "NONINTERACTIVE=1 /bin/bash -c \"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""], app.getPath("home"));
			if (process.arch === "arm64") process.env.PATH = `/opt/homebrew/bin:/opt/homebrew/sbin:${process.env.PATH}`;
			else process.env.PATH = `/usr/local/bin:/usr/local/sbin:${process.env.PATH}`;
			sendLog("> [SYSTEM] Homebrew installation complete.");
			return true;
		} catch (brewErr) {
			sendLog(`> [SYSTEM] [ERROR] Failed to install Homebrew automatically: ${brewErr.message}`);
			throw brewErr;
		}
	}
}
ipcMain.handle("install-dependency", async (event, dependencyName) => {
	sendLog(`> [SYSTEM] Requested auto-installation for missing dependency: ${dependencyName}`);
	try {
		await ensureHomebrew();
		let brewPackageName = "";
		let verifyCommand = "";
		if (dependencyName === "git") {
			brewPackageName = "git";
			verifyCommand = "git --version";
		} else if (dependencyName === "python") {
			brewPackageName = "python";
			verifyCommand = "python3 --version";
		} else if (dependencyName === "npm") {
			brewPackageName = "node";
			verifyCommand = "npm --version";
		} else throw new Error("Unknown dependency requested");
		sendLog(`> [SYSTEM] Installing ${brewPackageName} via Homebrew...`);
		await runCommandStreaming("brew", ["install", brewPackageName], app.getPath("home"));
		sendLog(`> [SYSTEM] Verifying installation of ${dependencyName}...`);
		sendLog(`> [EXEC] ${verifyCommand}`);
		const { stdout } = await execAsync(verifyCommand);
		sendLog(stdout.trim());
		sendLog(`> [SYSTEM] ${dependencyName} installed successfully!`);
		return { success: true };
	} catch (error) {
		sendLog(`> [SYSTEM] [ERROR] Installation pipeline failed: ${error.message}`);
		return {
			success: false,
			error: error.message
		};
	}
});
var openclawProcess = null;
var activeWorkspacePath = null;
ipcMain.handle("setup-workspace", async (event, workspacePathInput) => {
	const workspacePath = workspacePathInput.replace("~", app.getPath("home"));
	sendLog(`> [SYSTEM] Setting up workspace at: ${workspacePath}`);
	try {
		sendLog(`> [EXEC] openclaw onboard --workspace "${workspacePath}" --non-interactive --accept-risk`);
		await runCommandStreaming("openclaw", [
			"onboard",
			"--workspace",
			workspacePath,
			"--non-interactive",
			"--accept-risk",
			"--skip-daemon",
			"--skip-channels",
			"--skip-search",
			"--skip-skills",
			"--skip-ui",
			"--skip-health"
		], app.getPath("home"));
		sendLog(`> [EXEC] openclaw config set gateway.bind lan (cwd: ${workspacePath})`);
		await runCommandStreaming("openclaw", [
			"config",
			"set",
			"gateway.bind",
			"lan"
		], workspacePath);
		sendLog("> [SYSTEM] Workspace setup complete.");
	} catch (e) {
		sendLog(`> [SYSTEM] [ERROR] Setup failed: ${e.message}`);
		throw e;
	}
	return { success: true };
});
ipcMain.handle("save-api-key", async (event, config) => {
	const workspacePath = config.workspacePath.replace("~", app.getPath("home"));
	sendLog("> [SYSTEM] Applying API keys via `openclaw onboard`...");
	let args = [
		"onboard",
		"--non-interactive",
		"--accept-risk",
		"--skip-daemon",
		"--skip-channels",
		"--skip-search",
		"--skip-skills",
		"--skip-ui",
		"--skip-health",
		"--workspace",
		workspacePath
	];
	if (config.apiKeys && Array.isArray(config.apiKeys)) {
		for (const item of config.apiKeys) if (item.key && item.key.trim() !== "") {
			let providerArg = "";
			if (item.provider === "OpenAI") providerArg = "--openai-api-key";
			else if (item.provider === "Anthropic") providerArg = "--anthropic-api-key";
			else if (item.provider === "Google Gemini") providerArg = "--gemini-api-key";
			else if (item.provider === "ByteDance Doubao") providerArg = "--volcengine-api-key";
			else if (item.provider === "xAI (Grok)") providerArg = "--xai-api-key";
			else if (item.provider === "Together AI") providerArg = "--together-api-key";
			else continue;
			args.push(providerArg, item.key.trim());
		}
	} else if (config.apiKey) args.push("--openai-api-key", config.apiKey);
	try {
		sendLog(`> [EXEC] openclaw ${args.join(" ")}`);
		await runCommandStreaming("openclaw", args, app.getPath("home"));
		sendLog("> [SYSTEM] API Configuration applied successfully.");
		return { success: true };
	} catch (e) {
		sendLog(`> [SYSTEM] [ERROR] Onboard config failed: ${e.message}`);
		throw e;
	}
});
ipcMain.handle("save-channels", async (event, config) => {
	sendLog("> [SYSTEM] Configuring Channels via native CLI commands...");
	if (config.channels && Array.isArray(config.channels)) for (const item of config.channels) {
		let provider = item.provider.toLowerCase();
		if (provider.includes("lark")) {
			const pName = "feishu";
			try {
				try {
					sendLog(`> [EXEC] openclaw plugins install @openclaw/feishu`);
					await runCommandStreaming("openclaw", [
						"plugins",
						"install",
						"@openclaw/feishu"
					], app.getPath("home"));
				} catch (installErr) {
					sendLog(`> [SYSTEM] Feishu plugin already installed or failed to install: ${installErr.message}`);
				}
				const workspacePath = config.workspacePath.replace("~", app.getPath("home"));
				sendLog(`> [EXEC] openclaw config set channels.${pName}.enabled true`);
				await runCommandStreaming("openclaw", [
					"config",
					"set",
					`channels.${pName}.enabled`,
					"true"
				], workspacePath);
				sendLog(`> [SYSTEM] Bypassing CLI to write Feishu credentials directly to openclaw.json...`);
				const cfgPath = path.join(app.getPath("home"), ".openclaw", "openclaw.json");
				try {
					await fs.access(cfgPath);
					const rawCfg = await fs.readFile(cfgPath, "utf8");
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
		if (item.key && item.key.trim() !== "") {
			let tokenArg = provider === "slack" ? "--bot-token" : "--token";
			if (provider === "webhook" || provider === "whatsapp") continue;
			let args = [
				"channels",
				"add",
				"--channel",
				provider,
				tokenArg,
				item.key.trim()
			];
			try {
				const workspacePath = config.workspacePath.replace("~", app.getPath("home"));
				sendLog(`> [EXEC] openclaw config set channels.${provider}.enabled true`);
				await runCommandStreaming("openclaw", [
					"config",
					"set",
					`channels.${provider}.enabled`,
					"true"
				], workspacePath);
				sendLog(`> [EXEC] openclaw ${args.join(" ")}`);
				await runCommandStreaming("openclaw", args, workspacePath);
			} catch (e) {
				sendLog(`> [SYSTEM] [ERROR] Failed to add channel ${provider}: ${e.message}`);
			}
		}
	}
	sendLog("> [SYSTEM] Channel setup sequence finished.");
	return { success: true };
});
ipcMain.handle("generate-whatsapp-qr", async (event, workspacePathInput) => {
	sendLog("> [SYSTEM] Launching native WhatsApp Web Linker...");
	sendLog("> [SYSTEM] Look at the Debug Log below to scan the Terminal ASCII QR Code.");
	try {
		const workspacePath = workspacePathInput.replace("~", app.getPath("home"));
		sendLog(`> [EXEC] openclaw config set channels.whatsapp.enabled true`);
		await runCommandStreaming("openclaw", [
			"config",
			"set",
			"channels.whatsapp.enabled",
			"true"
		], workspacePath);
		sendLog(`> [EXEC] openclaw channels login --channel whatsapp (cwd: ${workspacePath})`);
		await runCommandStreaming("openclaw", [
			"channels",
			"login",
			"--channel",
			"whatsapp"
		], workspacePath);
		sendLog("> [SYSTEM] WhatsApp Session Linked Successfully!");
		return {
			success: true,
			qrDataUrl: null
		};
	} catch (error) {
		sendLog(`> [SYSTEM] [ERROR] WhatsApp QR Generation failed: ${error.message}`);
		return {
			success: false,
			error: error.message
		};
	}
});
ipcMain.handle("test-message", async (event, workspacePathInput, channel, phone, msg) => {
	sendLog(`> [SYSTEM] Initiating Test Message dispatch to ${phone} via ${channel}...`);
	try {
		const repoPath = workspacePathInput.replace("~", app.getPath("home"));
		let targetId = phone;
		if (channel === "telegram" && targetId.startsWith("@")) {
			const possibleNumeric = targetId.substring(1);
			if (/^\d+$/.test(possibleNumeric)) targetId = possibleNumeric;
		} else if (channel === "feishu" || channel === "lark") {
			channel = "feishu";
			if (targetId.startsWith("@")) targetId = "user:" + targetId.substring(1);
			else if (!targetId.includes(":")) targetId = "user:" + targetId;
		}
		let cmdArgs = [
			"message",
			"send",
			"--channel",
			channel,
			"-t",
			targetId,
			"-m",
			msg
		];
		if (channel === "feishu") cmdArgs = [
			"message",
			"send",
			"--channel",
			channel,
			"--account",
			"feishu",
			"-t",
			targetId,
			"-m",
			msg
		];
		sendLog(`> [EXEC] openclaw ${cmdArgs.join(" ")} (cwd: ${repoPath})`);
		await runCommandStreaming("openclaw", cmdArgs, repoPath);
		sendLog("> [SYSTEM] Test Message dispatched successfully.");
		return { success: true };
	} catch (error) {
		sendLog(`> [SYSTEM] [ERROR] Message dispatch failed: ${error.message}`);
		return {
			success: false,
			error: error.message
		};
	}
});
ipcMain.handle("approve-pairing", async (event, workspacePathInput, channel, code) => {
	sendLog(`> [SYSTEM] Initiating Pairing Approval for ${channel} with code ${code}...`);
	try {
		const repoPath = workspacePathInput.replace("~", app.getPath("home"));
		let cmdArgs = [
			"pairing",
			"approve",
			channel,
			code
		];
		sendLog(`> [EXEC] openclaw ${cmdArgs.join(" ")} (cwd: ${repoPath})`);
		await runCommandStreaming("openclaw", cmdArgs, repoPath);
		sendLog("> [SYSTEM] Pairing approved successfully.");
		return { success: true };
	} catch (error) {
		sendLog(`> [SYSTEM] [ERROR] Pairing approval failed: ${error.message}`);
		return {
			success: false,
			error: error.message
		};
	}
});
ipcMain.handle("start-claw", async (event, config) => {
	if (openclawProcess) {
		sendLog("> [SYSTEM] OpenClaw is already running.");
		return { success: true };
	}
	const workspacePath = config.workspacePath.replace("~", app.getPath("home"));
	activeWorkspacePath = workspacePath;
	sendLog("> [SYSTEM] Requesting daemon installation configuration...");
	const args = [
		"onboard",
		"--install-daemon",
		"--non-interactive",
		"--accept-risk",
		"--workspace",
		workspacePath
	];
	try {
		sendLog(`> [EXEC] openclaw ${args.join(" ")}`);
		await runCommandStreaming("openclaw", args, app.getPath("home"));
		sendLog("> [SYSTEM] Waiting 3 seconds for daemon to initialize its web server...");
		await new Promise((resolve) => setTimeout(resolve, 3e3));
		openclawProcess = true;
		sendLog("> [SYSTEM] Fetching Manager Dashboard URL...");
		try {
			const { stdout } = await execAsync("/opt/homebrew/bin/node /opt/homebrew/lib/node_modules/openclaw/openclaw.mjs dashboard --no-open", { cwd: app.getPath("home") });
			const match = stdout.match(/Dashboard URL:\s*(https?:\/\/[^\s]+)/);
			if (match && match[1]) {
				const dashboardUrl = match[1];
				sendLog(`> [SYSTEM] Opening Manager at: ${dashboardUrl}`);
				managerWin = new BrowserWindow({
					width: 1200,
					height: 800,
					title: "OpenClaw Manager",
					webPreferences: {
						nodeIntegration: false,
						contextIsolation: true,
						preload: path.join(__dirname, "preload.mjs")
					}
				});
				managerWin.loadURL(dashboardUrl);
				let __langInjected = false;
				managerWin.webContents.on("did-finish-load", async () => {
					if (!__langInjected && config.lang) {
						__langInjected = true;
						await managerWin.webContents.executeJavaScript(`try { localStorage.setItem('openclaw.i18n.locale', '${config.lang}'); } catch(e) {}`);
						managerWin.webContents.reload();
					}
				});
				managerWin.on("closed", () => {
					managerWin = null;
				});
			} else sendLog("> [SYSTEM] Could not parse Dashboard URL from stdout.");
		} catch (dashboardErr) {
			sendLog(`> [SYSTEM] Failed to load dashboard: ${dashboardErr.message}`);
		}
		return { success: true };
	} catch (error) {
		sendLog(`> [SYSTEM] [ERROR] Failed to start OpenClaw daemon: ${error.message}`);
		return {
			success: false,
			error: error.message
		};
	}
});
ipcMain.handle("stop-claw", async () => {
	sendLog("> [SYSTEM] Stop button pressed. Sending kill signal to active process.");
	if (openclawProcess) {
		sendLog(`> [EXEC] openclaw daemon stop`);
		try {
			await runCommandStreaming("openclaw", ["daemon", "stop"], app.getPath("home"));
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
		sendLog("> [SYSTEM] Active OpenClaw process terminated gracefully.");
		return { success: true };
	}
	sendLog("> [SYSTEM] No active process found to stop.");
	return {
		success: false,
		message: "OpenClaw is not currently running."
	};
});
ipcMain.handle("kill-all-tasks", async () => {
	sendLog("> [SYSTEM] WARNING: Kill All Tasks initiated.");
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
			sendLog("> [SYSTEM] Nullifying internal process tracking handle.");
			openclawProcess = null;
		}
		if (managerWin) {
			managerWin.close();
			managerWin = null;
		}
		sendLog("> [SYSTEM] Purge complete.");
		return { success: true };
	} catch (error) {
		sendLog(`> [SYSTEM] [ERROR] Kill task sequence failed: ${error.message}`);
		return {
			success: false,
			error: error.message
		};
	}
});
ipcMain.handle("uninstall-claw", async (event, workspacePathInput) => {
	sendLog("> [SYSTEM] Uninstall sequence initiated.");
	try {
		const workspacePath = (workspacePathInput || activeWorkspacePath || "").replace("~", app.getPath("home"));
		const repoPath = path.join(workspacePath, "openclaw");
		const configPath = path.join(app.getPath("home"), ".openclaw");
		const asBinary = "/opt/homebrew/bin/openclaw";
		const intelBinary = "/usr/local/bin/openclaw";
		if (openclawProcess) {
			sendLog("> [SYSTEM] Stopping active daemon before directory removal...");
			try {
				await runCommandStreaming("openclaw", ["daemon", "stop"], app.getPath("home"));
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
			{
				path: repoPath,
				name: "OpenClaw Workspace Repository"
			},
			{
				path: configPath,
				name: "Global ~/.openclaw Config Directory"
			},
			{
				path: asBinary,
				name: "Apple Silicon Executable (/opt/homebrew/bin)"
			},
			{
				path: intelBinary,
				name: "Intel Mac Executable (/usr/local/bin)"
			}
		];
		let anyDeleted = false;
		const currentWindow = BrowserWindow.getFocusedWindow() || win;
		for (const target of targets) try {
			await fs.stat(target.path);
			const { response } = await dialog.showMessageBox(currentWindow, {
				type: "warning",
				title: "Approve Deletion",
				message: `Do you want to permanently delete the following path?\n\n${target.name}\n${target.path}`,
				buttons: ["Approve Deletion", "Skip"],
				defaultId: 1,
				cancelId: 1
			});
			if (response === 0) {
				sendLog(`> [SYSTEM] User APPROVED deletion of ${target.path}`);
				sendLog(`> [EXEC] rm -rf ${target.path}`);
				await fs.rm(target.path, {
					recursive: true,
					force: true
				});
				sendLog(`> [SYSTEM] ${target.name} successfully deleted.`);
				anyDeleted = true;
			} else sendLog(`> [SYSTEM] User SKIPPED deletion of ${target.path}`);
		} catch (err) {
			if (err.code === "ENOENT") sendLog(`> [SYSTEM] Path not found on system: ${target.path}. Skipping.`);
			else sendLog(`> [SYSTEM] [ERROR] Failed to access ${target.path}: ${err.message}`);
		}
		if (anyDeleted) sendLog("> [SYSTEM] Uninstall sequence completed successfully.");
		else sendLog("> [SYSTEM] Uninstall sequence completed. No files were removed.");
		return { success: true };
	} catch (error) {
		sendLog(`> [SYSTEM] [ERROR] Uninstall sequence encountered a critical error: ${error.message}`);
		return {
			success: false,
			error: error.message
		};
	}
});
//#endregion
export { MAIN_DIST, RENDERER_DIST, VITE_DEV_SERVER_URL };
