let electron = require("electron");
//#region electron/preload.js
electron.contextBridge.exposeInMainWorld("api", {
	checkPrerequisites: () => electron.ipcRenderer.invoke("check-prerequisites"),
	installDependency: (depName) => electron.ipcRenderer.invoke("install-dependency", depName),
	setupWorkspace: (workspacePath) => electron.ipcRenderer.invoke("setup-workspace", workspacePath),
	saveApiKey: (config) => electron.ipcRenderer.invoke("save-api-key", config),
	saveChannels: (config) => electron.ipcRenderer.invoke("save-channels", config),
	startClaw: (config) => electron.ipcRenderer.invoke("start-claw", config),
	stopClaw: () => electron.ipcRenderer.invoke("stop-claw"),
	killAllTasks: () => electron.ipcRenderer.invoke("kill-all-tasks"),
	uninstallClaw: (workspacePath) => electron.ipcRenderer.invoke("uninstall-claw", workspacePath),
	generateWhatsAppQR: (workspacePath) => electron.ipcRenderer.invoke("generate-whatsapp-qr", workspacePath),
	cancelWhatsAppQR: () => electron.ipcRenderer.invoke("cancel-whatsapp-qr"),
	loginCodex: () => electron.ipcRenderer.invoke("login-codex"),
	loginGemini: () => electron.ipcRenderer.invoke("login-gemini"),
	testMessage: (workspacePath, channel, phone, msg) => electron.ipcRenderer.invoke("test-message", workspacePath, channel, phone, msg),
	approvePairing: (workspacePath, channel, code) => electron.ipcRenderer.invoke("approve-pairing", workspacePath, channel, code),
	onDebugLog: (callback) => electron.ipcRenderer.on("debug-log", (_event, value) => callback(value))
});
//#endregion
