import { BrowserWindow, app, dialog, ipcMain, shell } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { exec, spawn } from "node:child_process";
import util from "node:util";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import http from "node:http";
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
	sendLog("> [SYSTEM] Applying API keys via direct filesystem credentials integration...");
	const writeCredential = async (providerId, key) => {
		try {
			const targetPath = path.join(app.getPath("home"), ".openclaw", "credentials", `${providerId}.json`);
			await fs.mkdir(path.dirname(targetPath), { recursive: true });
			const payload = {
				type: providerId === "anthropic" ? "token" : "api_key",
				provider: providerId,
				[providerId === "anthropic" ? "token" : "key"]: key
			};
			await fs.writeFile(targetPath, JSON.stringify(payload, null, 2), { mode: 384 });
			sendLog(`> [SYSTEM] API Key stored natively at ${targetPath}`);
			try {
				const authPath = path.join(app.getPath("home"), ".openclaw", "agents", "main", "agent", "auth-profiles.json");
				await fs.mkdir(path.dirname(authPath), { recursive: true });
				let profilesData = {
					version: 1,
					profiles: {}
				};
				try {
					profilesData = JSON.parse(await fs.readFile(authPath, "utf8"));
				} catch (e) {}
				profilesData.profiles[`${providerId}:manual`] = {
					type: "token",
					provider: providerId,
					token: key
				};
				await fs.writeFile(authPath, JSON.stringify(profilesData, null, 2), { mode: 384 });
				sendLog(`> [SYSTEM] Merged key into agent profile: ${authPath}`);
			} catch (e) {
				sendLog(`> [SYSTEM] [ERROR] Could not construct main agent auth profile: ${e.message}`);
			}
			sendLog(`> [SYSTEM] Saved ${providerId} API Key successfully.`);
		} catch (err) {
			sendLog(`> [SYSTEM] [ERROR] Failed saving ${providerId} API Key: ${err.message}`);
		}
	};
	if (config.apiKeys && Array.isArray(config.apiKeys)) {
		for (const item of config.apiKeys) if (item.key && item.key.trim() !== "") {
			const key = item.key.trim();
			if (item.provider === "OpenAI") await writeCredential("openai", key);
			else if (item.provider === "Anthropic") await writeCredential("anthropic", key);
			else if (item.provider === "Google Gemini") await writeCredential("google-gemini", key);
			else if (item.provider === "Anthropic Token") try {
				const targetPath = path.join(app.getPath("home"), ".openclaw", "credentials", "anthropic.json");
				await fs.mkdir(path.dirname(targetPath), { recursive: true });
				const payload = {
					type: "token",
					provider: "anthropic",
					token: key
				};
				await fs.writeFile(targetPath, JSON.stringify(payload, null, 2), { mode: 384 });
				sendLog("> [SYSTEM] Saved Anthropic Setup Token to credentials store natively.");
			} catch (err) {
				sendLog(`> [SYSTEM] [ERROR] Failed saving Anthropic Token to credentials: ${err.message}`);
			}
		}
	} else if (config.apiKey) await writeCredential("openai", config.apiKey.trim());
	try {
		const cfgPath = path.join(app.getPath("home"), ".openclaw", "openclaw.json");
		let cfgObj = {};
		try {
			const rawCfg = await fs.readFile(cfgPath, "utf8");
			cfgObj = JSON.parse(rawCfg);
		} catch (e) {}
		if (!cfgObj.agents) cfgObj.agents = {};
		if (!cfgObj.agents.defaults) cfgObj.agents.defaults = {};
		if (config.defaultModel && config.defaultModel !== "auto") {
			let modelStr = config.defaultModel;
			if (modelStr.startsWith("m:")) {
				const parts = modelStr.split(":");
				if (parts.length >= 3) modelStr = parts[1] + "/" + parts.slice(2).join(":");
			}
			cfgObj.agents.defaults.model = modelStr;
		} else {
			let autoModel = "anthropic/claude-3-5-sonnet-latest";
			if (config.apiKeys && Array.isArray(config.apiKeys)) {
				const providers = config.apiKeys.filter((k) => k.key && k.key.trim() !== "" && !k.scanning).map((k) => k.provider);
				if (providers.includes("Anthropic") || providers.includes("Anthropic Token")) autoModel = "anthropic/claude-3-5-sonnet-latest";
				else if (providers.includes("OpenAI") || providers.includes("OpenAI Codex")) autoModel = "openai/gpt-4o";
				else if (providers.includes("Google Gemini") || providers.includes("Google Gemini OAuth")) autoModel = "google-gemini/gemini-1.5-pro";
			}
			cfgObj.agents.defaults.model = autoModel;
		}
		await fs.writeFile(cfgPath, JSON.stringify(cfgObj, null, 2));
		sendLog(`> [SYSTEM] Default model preferences updated in openclaw.json.`);
	} catch (err) {
		sendLog(`> [SYSTEM] [ERROR] Failed to update default model preferences: ${err.message}`);
	}
	sendLog("> [SYSTEM] API Configuration applied successfully.");
	return { success: true };
});
ipcMain.handle("save-channels", async (event, config) => {
	sendLog("> [SYSTEM] Configuring Channels via native CLI commands...");
	if (config.channels && Array.isArray(config.channels)) for (const item of config.channels) {
		let provider = item.provider.toLowerCase();
		if (provider.includes("lark")) {
			const pName = "feishu";
			try {
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
ipcMain.handle("login-codex", async () => {
	sendLog("> [SYSTEM] Launching Native PKCE OpenAI Codex OAuth Login...");
	try {
		const { loginOpenAICodex } = await import("./oauth-DeEK2U0c.js");
		const credentials = await loginOpenAICodex({
			onAuth: (info) => {
				sendLog(`> [SYSTEM] Opening Browser to OpenAI Consent Screen natively...`);
				shell.openExternal(info.url);
			},
			onPrompt: async (prompt) => {
				sendLog(`> [SYSTEM] Manual Prompt Fallback: ${prompt.message}`);
				throw new Error("Manual fallback not supported by the frontend. Please authorize via the browser.");
			},
			originator: "clawchef"
		});
		const payload = {
			access_token: credentials.access,
			refresh_token: credentials.refresh,
			expiration: credentials.expires,
			email: credentials.accountId || "unknown",
			access: credentials.access,
			refresh: credentials.refresh,
			expires: credentials.expires,
			accountId: credentials.accountId
		};
		const targetPath = path.join(app.getPath("home"), ".openclaw", "credentials", "openai.json");
		await fs.mkdir(path.dirname(targetPath), { recursive: true });
		await fs.writeFile(targetPath, JSON.stringify(payload, null, 2), { mode: 384 });
		try {
			const authPath = path.join(app.getPath("home"), ".openclaw", "agents", "main", "agent", "auth-profiles.json");
			await fs.mkdir(path.dirname(authPath), { recursive: true });
			let profilesData = {
				version: 1,
				profiles: {}
			};
			try {
				profilesData = JSON.parse(await fs.readFile(authPath, "utf8"));
			} catch (e) {}
			profilesData.profiles["openai:manual"] = {
				type: "token",
				provider: "openai",
				token: credentials.access
			};
			await fs.writeFile(authPath, JSON.stringify(profilesData, null, 2), { mode: 384 });
			sendLog(`> [SYSTEM] Merged OAuth Bearer into agent profile: ${authPath}`);
		} catch (e) {
			sendLog(`> [SYSTEM] [ERROR] Could not construct main agent auth: ${e.message}`);
		}
		sendLog("> [SYSTEM] OpenAI Codex OAuth Login Successful through native @mariozechner library!");
		return { success: true };
	} catch (error) {
		sendLog(`> [SYSTEM] [ERROR] OpenAI Codex Login failed: ${error.message}`);
		return {
			success: false,
			error: error.message
		};
	}
});
async function extractGeminiCliCredentials() {
	try {
		const geminiBin = (await execAsync("which gemini")).stdout.trim();
		if (geminiBin) {
			const realGeminiBin = (await execAsync(`realpath ${geminiBin}`)).stdout.trim();
			const pkgBase = path.join(path.dirname(realGeminiBin), "..");
			const oauth2JsPath = path.join(pkgBase, "node_modules", "@google", "gemini-cli-core", "dist", "src", "code_assist", "oauth2.js");
			const data = await fs.readFile(oauth2JsPath, "utf8");
			const clientIdMatch = data.match(/OAUTH_CLIENT_ID\s*=\s*['"]([^'"]+)['"]/);
			const clientSecretMatch = data.match(/OAUTH_CLIENT_SECRET\s*=\s*['"]([^'"]+)['"]/);
			if (clientIdMatch && clientSecretMatch) return {
				clientId: clientIdMatch[1],
				clientSecret: clientSecretMatch[1]
			};
		}
	} catch (e) {}
	return {
		clientId: "681255809395-oo8ft2oprdrnp9e3aqf6av3hmdib135j.apps.googleusercontent.com",
		clientSecret: "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"
	};
}
ipcMain.handle("login-gemini", async () => {
	sendLog("> [SYSTEM] Launching Native PKCE Google Gemini OAuth Login...");
	try {
		const creds = await extractGeminiCliCredentials();
		const codeVerifier = crypto.randomBytes(32).toString("base64url");
		const codeChallenge = crypto.createHash("sha256").update(codeVerifier).digest("base64url");
		const port = 8085;
		const redirectUri = `http://127.0.0.1:${port}/oauth2callback`;
		const state = crypto.randomBytes(32).toString("hex");
		const scopes = [
			"https://www.googleapis.com/auth/cloud-platform",
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile"
		].join(" ");
		const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${creds.clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scopes)}&code_challenge=${codeChallenge}&code_challenge_method=S256&state=${state}&access_type=offline`;
		const server = http.createServer();
		const loginPromise = new Promise((resolve, reject) => {
			let timeout = setTimeout(() => {
				server.close();
				reject(/* @__PURE__ */ new Error("OAuth timeout after 5 minutes"));
			}, 3e5);
			server.on("request", async (req, res) => {
				try {
					if (req.url.startsWith("/oauth2callback")) {
						const qs = new URL(req.url, `http://127.0.0.1:${port}`).searchParams;
						if (qs.get("error")) {
							res.writeHead(301, { Location: "https://developers.google.com/gemini-code-assist/auth_failure_gemini" });
							res.end();
							reject(/* @__PURE__ */ new Error(`OAuth error: ${qs.get("error")}`));
						} else if (qs.get("state") !== state) {
							res.writeHead(400);
							res.end("State mismatch");
							reject(/* @__PURE__ */ new Error("State mismatch, possible CSRF"));
						} else if (qs.get("code")) {
							const code = qs.get("code");
							const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
								method: "POST",
								headers: { "Content-Type": "application/x-www-form-urlencoded" },
								body: new URLSearchParams({
									code,
									client_id: creds.clientId,
									client_secret: creds.clientSecret,
									redirect_uri: redirectUri,
									grant_type: "authorization_code",
									code_verifier: codeVerifier
								})
							});
							if (!tokenRes.ok) throw new Error(await tokenRes.text());
							const tokens = await tokenRes.json();
							res.writeHead(301, { Location: "https://developers.google.com/gemini-code-assist/auth_success_gemini" });
							res.end();
							const targetPath = path.join(app.getPath("home"), ".openclaw", "credentials", "google-gemini-cli.json");
							await fs.mkdir(path.dirname(targetPath), { recursive: true });
							await fs.writeFile(targetPath, JSON.stringify(tokens, null, 2), { mode: 384 });
							resolve(tokens);
						} else {
							res.writeHead(400);
							res.end("Missing code");
							reject(/* @__PURE__ */ new Error("Missing authorization code"));
						}
					} else {
						res.writeHead(404);
						res.end();
					}
				} catch (e) {
					reject(e);
				} finally {
					clearTimeout(timeout);
					server.close();
				}
			});
			server.on("error", reject);
		});
		server.listen(port, "127.0.0.1", () => {
			sendLog(`> [SYSTEM] Opening Browser to Google Consent Screen natively...`);
			shell.openExternal(authUrl);
		});
		await loginPromise;
		sendLog("> [SYSTEM] Google Gemini OAuth Login Successful through PKCE Server!");
		return { success: true };
	} catch (error) {
		sendLog(`> [SYSTEM] [ERROR] Google Gemini Login failed: ${error.message}`);
		return {
			success: false,
			error: error.message
		};
	}
});
ipcMain.handle("cancel-whatsapp-qr", async () => {
	sendLog("> [SYSTEM] Cancelling WhatsApp QR generation...");
	try {
		await execAsync(`pkill -f "channels login --channel whatsapp"`);
		return { success: true };
	} catch (e) {
		return { success: true };
	}
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
