import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    'api', {
        checkPrerequisites: () => ipcRenderer.invoke('check-prerequisites'),
        installDependency: (depName) => ipcRenderer.invoke('install-dependency', depName),
        setupWorkspace: (workspacePath) => ipcRenderer.invoke('setup-workspace', workspacePath),
        saveApiKey: (config) => ipcRenderer.invoke('save-api-key', config),
        saveChannels: (config) => ipcRenderer.invoke('save-channels', config),
        startClaw: (config) => ipcRenderer.invoke('start-claw', config),
        stopClaw: () => ipcRenderer.invoke('stop-claw'),
        killAllTasks: () => ipcRenderer.invoke('kill-all-tasks'),
        uninstallClaw: (workspacePath) => ipcRenderer.invoke('uninstall-claw', workspacePath),
        generateWhatsAppQR: (workspacePath) => ipcRenderer.invoke('generate-whatsapp-qr', workspacePath),
        cancelWhatsAppQR: () => ipcRenderer.invoke('cancel-whatsapp-qr'),
        loginCodex: () => ipcRenderer.invoke('login-codex'),
        loginGemini: () => ipcRenderer.invoke('login-gemini'),
        testMessage: (workspacePath, channel, phone, msg) => ipcRenderer.invoke('test-message', workspacePath, channel, phone, msg),
        approvePairing: (workspacePath, channel, code) => ipcRenderer.invoke('approve-pairing', workspacePath, channel, code),
        onDebugLog: (callback) => ipcRenderer.on('debug-log', (_event, value) => callback(value))
    }
);
