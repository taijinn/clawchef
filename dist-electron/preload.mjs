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
	testMessage: (workspacePath, phone, msg) => electron.ipcRenderer.invoke("test-message", workspacePath, phone, msg),
	onDebugLog: (callback) => electron.ipcRenderer.on("debug-log", (_event, value) => callback(value))
});
//#endregion
