import { BrowserWindow as e, app as t, dialog as n, ipcMain as r } from "electron";
import i from "node:path";
import { fileURLToPath as a } from "node:url";
import { exec as o, spawn as s } from "node:child_process";
import c from "node:util";
import l from "node:fs/promises";
//#region electron/main.js
var u = c.promisify(o);
async function d() {
	if (process.platform === "darwin") try {
		let { stdout: e } = await u(`"${process.env.SHELL || "/bin/zsh"}" -ilc 'echo -n "_SEPARATOR_"; env; echo -n "_SEPARATOR_"'`), t = e.split("_SEPARATOR_")[1].split("\n").find((e) => e.startsWith("PATH="));
		t && t.replace("PATH=", "").trim();
	} catch (e) {
		console.error("Could not fix PATH:", e);
	}
}
process.env.PATH = `/opt/homebrew/bin:/usr/local/bin:${process.env.PATH || ""}`, d();
var f = i.dirname(a(import.meta.url));
process.env.APP_ROOT = i.join(f, "..");
var p = process.env.VITE_DEV_SERVER_URL, m = i.join(process.env.APP_ROOT, "dist-electron"), h = i.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = p ? i.join(process.env.APP_ROOT, "public") : h;
var g, _ = null;
function v(e) {
	console.log(e), g && g.webContents && g.webContents.send("debug-log", e);
}
function y() {
	g = new e({
		width: 1e3,
		height: 850,
		titleBarStyle: "hiddenInset",
		webPreferences: {
			preload: i.join(f, "preload.mjs"),
			nodeIntegration: !1,
			contextIsolation: !0
		}
	}), p ? g.loadURL(p) : g.loadFile(i.join(h, "index.html"));
}
t.whenReady().then(y), t.on("window-all-closed", () => {
	process.platform !== "darwin" && t.quit();
}), t.on("activate", () => {
	e.getAllWindows().length === 0 && y();
});
function b(e, t, n) {
	return new Promise((r, i) => {
		e === "openclaw" ? (t = ["/opt/homebrew/lib/node_modules/openclaw/openclaw.mjs", ...t], e = "/opt/homebrew/bin/node") : e === "brew" ? e = process.arch === "arm64" ? "/opt/homebrew/bin/brew" : "/usr/local/bin/brew" : e === "git" ? e = process.arch === "arm64" ? "/opt/homebrew/bin/git" : "/usr/bin/git" : e === "npm" && (e = process.arch === "arm64" ? "/opt/homebrew/bin/npm" : "/usr/local/bin/npm"), v(`> [EXEC] ${e} ${t.join(" ")}`);
		let a = s(e, t, {
			cwd: n,
			shell: !0
		}), o = "";
		a.stdout.on("data", (e) => {
			let t = e.toString();
			o += t, v(t.trim());
		}), a.stderr.on("data", (e) => {
			let t = e.toString();
			o += t, v(t.trim());
		}), a.on("close", (e) => {
			if (e === 0) r();
			else {
				let t = o.match(/Error: (.+)/), n = t ? t[1] : o.slice(-200).trim() || `Command failed with code ${e}`;
				i(Error(n));
			}
		}), a.on("error", (e) => i(e));
	});
}
r.handle("check-prerequisites", async () => {
	let e = {
		git: !1,
		python: !1,
		npm: !1
	};
	v("> [SYSTEM] Checking System Prerequisites...");
	try {
		v("> [EXEC] git --version");
		let { stdout: t } = await u("git --version");
		v(t.trim()), e.git = !0;
	} catch (e) {
		v(`> [SYSTEM] [ERROR] Git not found: ${e.message}`);
	}
	try {
		v("> [EXEC] python3 --version");
		let { stdout: t } = await u("python3 --version");
		v(t.trim()), e.python = !0;
	} catch (e) {
		v(`> [SYSTEM] [ERROR] Python3 not found: ${e.message}`);
	}
	try {
		v("> [EXEC] npm --version");
		let { stdout: t } = await u("npm --version");
		v(t.trim()), e.npm = !0;
	} catch (e) {
		v(`> [SYSTEM] [ERROR] NPM not found: ${e.message}`);
	}
	return e;
});
async function x() {
	try {
		return await u("brew --version"), v("> [SYSTEM] Homebrew is already installed."), !0;
	} catch {
		v("> [SYSTEM] Homebrew not found. Attempting installation...");
		try {
			v("> [SYSTEM] Checking/Installing Xcode Command Line Tools..."), v("> [EXEC] xcode-select --install"), await b("xcode-select", ["--install"], process.env.APP_ROOT);
		} catch {
			v("> [SYSTEM] Xcode Command Line Tools already installed or user prompted.");
		}
		v("> [SYSTEM] Downloading and running Homebrew installer script...");
		try {
			return await b("bash", ["-c", "NONINTERACTIVE=1 /bin/bash -c \"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""], t.getPath("home")), process.arch === "arm64" ? process.env.PATH = `/opt/homebrew/bin:/opt/homebrew/sbin:${process.env.PATH}` : process.env.PATH = `/usr/local/bin:/usr/local/sbin:${process.env.PATH}`, v("> [SYSTEM] Homebrew installation complete."), !0;
		} catch (e) {
			throw v(`> [SYSTEM] [ERROR] Failed to install Homebrew automatically: ${e.message}`), e;
		}
	}
}
r.handle("install-dependency", async (e, n) => {
	v(`> [SYSTEM] Requested auto-installation for missing dependency: ${n}`);
	try {
		await x();
		let e = "", r = "";
		if (n === "git") e = "git", r = "git --version";
		else if (n === "python") e = "python", r = "python3 --version";
		else if (n === "npm") e = "node", r = "npm --version";
		else throw Error("Unknown dependency requested");
		v(`> [SYSTEM] Installing ${e} via Homebrew...`), await b("brew", ["install", e], t.getPath("home")), v(`> [SYSTEM] Verifying installation of ${n}...`), v(`> [EXEC] ${r}`);
		let { stdout: i } = await u(r);
		return v(i.trim()), v(`> [SYSTEM] ${n} installed successfully!`), { success: !0 };
	} catch (e) {
		return v(`> [SYSTEM] [ERROR] Installation pipeline failed: ${e.message}`), {
			success: !1,
			error: e.message
		};
	}
});
var S = null, C = null;
r.handle("setup-workspace", async (e, n) => {
	let r = n.replace("~", t.getPath("home"));
	v(`> [SYSTEM] Setting up workspace at: ${r}`);
	try {
		v(`> [EXEC] openclaw onboard --workspace "${r}" --non-interactive --accept-risk`), await b("openclaw", [
			"onboard",
			"--workspace",
			r,
			"--non-interactive",
			"--accept-risk",
			"--skip-daemon",
			"--skip-channels",
			"--skip-search",
			"--skip-skills",
			"--skip-ui",
			"--skip-health"
		], t.getPath("home")), v(`> [EXEC] openclaw config set gateway.bind lan (cwd: ${r})`), await b("openclaw", [
			"config",
			"set",
			"gateway.bind",
			"lan"
		], r), v("> [SYSTEM] Workspace setup complete.");
	} catch (e) {
		throw v(`> [SYSTEM] [ERROR] Setup failed: ${e.message}`), e;
	}
	return { success: !0 };
}), r.handle("save-api-key", async (e, n) => {
	let r = n.workspacePath.replace("~", t.getPath("home"));
	v("> [SYSTEM] Applying API keys via `openclaw onboard`...");
	let i = [
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
		r
	];
	if (n.apiKeys && Array.isArray(n.apiKeys)) {
		for (let e of n.apiKeys) if (e.key && e.key.trim() !== "") {
			let t = "";
			if (e.provider === "OpenAI") t = "--openai-api-key";
			else if (e.provider === "Anthropic") t = "--anthropic-api-key";
			else if (e.provider === "Anthropic Token") {
				i.push("--auth-choice", "token", "--token-provider", "anthropic", "--token", e.key.trim());
				continue;
			} else if (e.provider === "Google Gemini") t = "--gemini-api-key";
			else if (e.provider === "ByteDance Doubao") t = "--volcengine-api-key";
			else if (e.provider === "xAI (Grok)") t = "--xai-api-key";
			else if (e.provider === "Together AI") t = "--together-api-key";
			else continue;
			i.push(t, e.key.trim());
		}
	} else n.apiKey && i.push("--openai-api-key", n.apiKey);
	try {
		return v(`> [EXEC] openclaw ${i.join(" ")}`), await b("openclaw", i, t.getPath("home")), v("> [SYSTEM] API Configuration applied successfully."), { success: !0 };
	} catch (e) {
		throw v(`> [SYSTEM] [ERROR] Onboard config failed: ${e.message}`), e;
	}
}), r.handle("save-channels", async (e, n) => {
	if (v("> [SYSTEM] Configuring Channels via native CLI commands..."), n.channels && Array.isArray(n.channels)) for (let e of n.channels) {
		let r = e.provider.toLowerCase();
		if (r.includes("lark")) {
			let r = "feishu";
			try {
				try {
					v("> [EXEC] openclaw plugins install @openclaw/feishu"), await b("openclaw", [
						"plugins",
						"install",
						"@openclaw/feishu"
					], t.getPath("home"));
				} catch (e) {
					v(`> [SYSTEM] Feishu plugin already installed or failed to install: ${e.message}`);
				}
				let a = n.workspacePath.replace("~", t.getPath("home"));
				v(`> [EXEC] openclaw config set channels.${r}.enabled true`), await b("openclaw", [
					"config",
					"set",
					`channels.${r}.enabled`,
					"true"
				], a), v("> [SYSTEM] Bypassing CLI to write Feishu credentials directly to openclaw.json...");
				let o = i.join(t.getPath("home"), ".openclaw", "openclaw.json");
				try {
					await l.access(o);
					let t = await l.readFile(o, "utf8"), n = JSON.parse(t);
					n.channels ||= {}, n.channels[r] || (n.channels[r] = { enabled: !0 }), n.channels[r].accounts || (n.channels[r].accounts = {}), n.channels[r].accounts[r] || (n.channels[r].accounts[r] = { enabled: !0 }), e.appId && (n.channels[r].accounts[r].appId = e.appId.trim()), e.appSecret && (n.channels[r].accounts[r].appSecret = e.appSecret.trim()), e.encryptKey && (n.channels[r].accounts[r].encryptKey = e.encryptKey.trim()), e.verificationToken && (n.channels[r].accounts[r].verificationToken = e.verificationToken.trim()), e.domain && (n.channels[r].accounts[r].domain = e.domain.trim()), e.dmPolicy && (n.channels[r].accounts[r].dmPolicy = e.dmPolicy.trim()), await l.writeFile(o, JSON.stringify(n, null, 2)), v("> [SYSTEM] Feishu credentials written directly to openclaw.json.");
				} catch (e) {
					v(`> [SYSTEM] openclaw.json not found or unreadable: ${e.message}`);
				}
			} catch (e) {
				v(`> [SYSTEM] [ERROR] Failed to add Lark channel: ${e.message}`);
			}
			continue;
		}
		if (e.key && e.key.trim() !== "") {
			let i = r === "slack" ? "--bot-token" : "--token";
			if (r === "webhook" || r === "whatsapp") continue;
			let a = [
				"channels",
				"add",
				"--channel",
				r,
				i,
				e.key.trim()
			];
			try {
				let e = n.workspacePath.replace("~", t.getPath("home"));
				v(`> [EXEC] openclaw config set channels.${r}.enabled true`), await b("openclaw", [
					"config",
					"set",
					`channels.${r}.enabled`,
					"true"
				], e), v(`> [EXEC] openclaw ${a.join(" ")}`), await b("openclaw", a, e);
			} catch (e) {
				v(`> [SYSTEM] [ERROR] Failed to add channel ${r}: ${e.message}`);
			}
		}
	}
	return v("> [SYSTEM] Channel setup sequence finished."), { success: !0 };
}), r.handle("login-codex", async () => {
	v("> [SYSTEM] Launching OpenAI Codex OAuth Login...");
	try {
		let e = i.join(t.getPath("home"), ".openclaw", "codex-login.mjs");
		return await l.mkdir(i.join(t.getPath("home"), ".openclaw"), { recursive: !0 }), await l.writeFile(e, "Object.defineProperty(process.stdin, 'isTTY', {value: true}); Object.defineProperty(process.stdout, 'isTTY', {value: true}); process.argv.splice(1, 0, 'openclaw'); import('/opt/homebrew/lib/node_modules/openclaw/openclaw.mjs');", "utf-8"), v("> [EXEC] openclaw models auth login --provider openai-codex"), await b("node", [
			e,
			"--",
			"models",
			"auth",
			"login",
			"--provider",
			"openai-codex"
		], t.getPath("home")), await l.rm(e, { force: !0 }).catch(() => {}), v("> [SYSTEM] OpenAI Codex OAuth Login Successful!"), { success: !0 };
	} catch (e) {
		return v(`> [SYSTEM] [ERROR] OpenAI Codex Login failed: ${e.message}`), {
			success: !1,
			error: e.message
		};
	}
}), r.handle("login-gemini", async () => {
	v("> [SYSTEM] Launching Google Gemini OAuth Login...");
	try {
		let e = i.join(t.getPath("home"), ".openclaw", "gemini-login.mjs");
		return await l.mkdir(i.join(t.getPath("home"), ".openclaw"), { recursive: !0 }), await l.writeFile(e, "Object.defineProperty(process.stdin, 'isTTY', {value: true}); Object.defineProperty(process.stdout, 'isTTY', {value: true}); process.argv.splice(1, 0, 'openclaw'); import('/opt/homebrew/lib/node_modules/openclaw/openclaw.mjs');", "utf-8"), v("> [EXEC] openclaw models auth login --provider google-gemini-cli"), await b("node", [
			e,
			"--",
			"models",
			"auth",
			"login",
			"--provider",
			"google-gemini-cli"
		], t.getPath("home")), await l.rm(e, { force: !0 }).catch(() => {}), v("> [SYSTEM] Google Gemini OAuth Login Successful!"), { success: !0 };
	} catch (e) {
		return v(`> [SYSTEM] [ERROR] Google Gemini Login failed: ${e.message}`), {
			success: !1,
			error: e.message
		};
	}
}), r.handle("generate-whatsapp-qr", async (e, n) => {
	v("> [SYSTEM] Launching native WhatsApp Web Linker..."), v("> [SYSTEM] Look at the Debug Log below to scan the Terminal ASCII QR Code.");
	try {
		let e = n.replace("~", t.getPath("home"));
		return v("> [EXEC] openclaw config set channels.whatsapp.enabled true"), await b("openclaw", [
			"config",
			"set",
			"channels.whatsapp.enabled",
			"true"
		], e), v(`> [EXEC] openclaw channels login --channel whatsapp (cwd: ${e})`), await b("openclaw", [
			"channels",
			"login",
			"--channel",
			"whatsapp"
		], e), v("> [SYSTEM] WhatsApp Session Linked Successfully!"), {
			success: !0,
			qrDataUrl: null
		};
	} catch (e) {
		return v(`> [SYSTEM] [ERROR] WhatsApp QR Generation failed: ${e.message}`), {
			success: !1,
			error: e.message
		};
	}
}), r.handle("test-message", async (e, n, r, i, a) => {
	v(`> [SYSTEM] Initiating Test Message dispatch to ${i} via ${r}...`);
	try {
		let e = n.replace("~", t.getPath("home")), o = i;
		if (r === "telegram" && o.startsWith("@")) {
			let e = o.substring(1);
			/^\d+$/.test(e) && (o = e);
		} else (r === "feishu" || r === "lark") && (r = "feishu", o.startsWith("@") ? o = "user:" + o.substring(1) : o.includes(":") || (o = "user:" + o));
		let s = [
			"message",
			"send",
			"--channel",
			r,
			"-t",
			o,
			"-m",
			a
		];
		return r === "feishu" && (s = [
			"message",
			"send",
			"--channel",
			r,
			"--account",
			"feishu",
			"-t",
			o,
			"-m",
			a
		]), v(`> [EXEC] openclaw ${s.join(" ")} (cwd: ${e})`), await b("openclaw", s, e), v("> [SYSTEM] Test Message dispatched successfully."), { success: !0 };
	} catch (e) {
		return v(`> [SYSTEM] [ERROR] Message dispatch failed: ${e.message}`), {
			success: !1,
			error: e.message
		};
	}
}), r.handle("approve-pairing", async (e, n, r, i) => {
	v(`> [SYSTEM] Initiating Pairing Approval for ${r} with code ${i}...`);
	try {
		let e = n.replace("~", t.getPath("home")), a = [
			"pairing",
			"approve",
			r,
			i
		];
		return v(`> [EXEC] openclaw ${a.join(" ")} (cwd: ${e})`), await b("openclaw", a, e), v("> [SYSTEM] Pairing approved successfully."), { success: !0 };
	} catch (e) {
		return v(`> [SYSTEM] [ERROR] Pairing approval failed: ${e.message}`), {
			success: !1,
			error: e.message
		};
	}
}), r.handle("start-claw", async (n, r) => {
	if (S) return v("> [SYSTEM] OpenClaw is already running."), { success: !0 };
	let a = r.workspacePath.replace("~", t.getPath("home"));
	C = a, v("> [SYSTEM] Requesting daemon installation configuration...");
	let o = [
		"onboard",
		"--install-daemon",
		"--non-interactive",
		"--accept-risk",
		"--workspace",
		a
	];
	try {
		v(`> [EXEC] openclaw ${o.join(" ")}`), await b("openclaw", o, t.getPath("home")), v("> [SYSTEM] Waiting 3 seconds for daemon to initialize its web server..."), await new Promise((e) => setTimeout(e, 3e3)), S = !0, v("> [SYSTEM] Fetching Manager Dashboard URL...");
		try {
			let { stdout: n } = await u("/opt/homebrew/bin/node /opt/homebrew/lib/node_modules/openclaw/openclaw.mjs dashboard --no-open", { cwd: t.getPath("home") }), a = n.match(/Dashboard URL:\s*(https?:\/\/[^\s]+)/);
			if (a && a[1]) {
				let t = a[1];
				v(`> [SYSTEM] Opening Manager at: ${t}`), _ = new e({
					width: 1200,
					height: 800,
					title: "OpenClaw Manager",
					webPreferences: {
						nodeIntegration: !1,
						contextIsolation: !0,
						preload: i.join(f, "preload.mjs")
					}
				}), _.loadURL(t);
				let n = !1;
				_.webContents.on("did-finish-load", async () => {
					!n && r.lang && (n = !0, await _.webContents.executeJavaScript(`try { localStorage.setItem('openclaw.i18n.locale', '${r.lang}'); } catch(e) {}`), _.webContents.reload());
				}), _.on("closed", () => {
					_ = null;
				});
			} else v("> [SYSTEM] Could not parse Dashboard URL from stdout.");
		} catch (e) {
			v(`> [SYSTEM] Failed to load dashboard: ${e.message}`);
		}
		return { success: !0 };
	} catch (e) {
		return v(`> [SYSTEM] [ERROR] Failed to start OpenClaw daemon: ${e.message}`), {
			success: !1,
			error: e.message
		};
	}
}), r.handle("stop-claw", async () => {
	if (v("> [SYSTEM] Stop button pressed. Sending kill signal to active process."), S) {
		v("> [EXEC] openclaw daemon stop");
		try {
			await b("openclaw", ["daemon", "stop"], t.getPath("home"));
		} catch (e) {
			v(`> [SYSTEM] (daemon stop returned error: ${e.message})`), v("> [EXEC] pkill -f \"node.*openclaw\""), await u("pkill -f \"node.*openclaw\"").catch(() => {});
		}
		return S = null, _ &&= (_.close(), null), v("> [SYSTEM] Active OpenClaw process terminated gracefully."), { success: !0 };
	}
	return v("> [SYSTEM] No active process found to stop."), {
		success: !1,
		message: "OpenClaw is not currently running."
	};
}), r.handle("kill-all-tasks", async () => {
	v("> [SYSTEM] WARNING: Kill All Tasks initiated.");
	try {
		v("> [EXEC] pkill -f \"python3.*openclaw\"");
		try {
			let { stdout: e, stderr: t } = await u("pkill -f \"python3.*openclaw\"");
			e && v(e.trim()), t && v(t.trim());
		} catch (e) {
			v(`> [SYSTEM] (pkill returned error, likely no tasks found tracking openclaw string: ${e.message})`);
		}
		v("> [EXEC] pkill -f \"node.*openclaw\"");
		try {
			await u("pkill -f \"node.*openclaw\"");
		} catch {}
		return S &&= (v("> [SYSTEM] Nullifying internal process tracking handle."), null), _ &&= (_.close(), null), v("> [SYSTEM] Purge complete."), { success: !0 };
	} catch (e) {
		return v(`> [SYSTEM] [ERROR] Kill task sequence failed: ${e.message}`), {
			success: !1,
			error: e.message
		};
	}
}), r.handle("uninstall-claw", async (r, a) => {
	v("> [SYSTEM] Uninstall sequence initiated.");
	try {
		let r = (a || C || "").replace("~", t.getPath("home")), o = i.join(r, "openclaw"), s = i.join(t.getPath("home"), ".openclaw");
		if (S) {
			v("> [SYSTEM] Stopping active daemon before directory removal...");
			try {
				await b("openclaw", ["daemon", "stop"], t.getPath("home"));
			} catch {}
			await u("pkill -f \"node.*openclaw\"").catch(() => {}), await u("pkill -f \"python3.*openclaw\"").catch(() => {}), S = null;
		}
		_ &&= (_.close(), null);
		let c = [
			{
				path: o,
				name: "OpenClaw Workspace Repository"
			},
			{
				path: s,
				name: "Global ~/.openclaw Config Directory"
			},
			{
				path: "/opt/homebrew/bin/openclaw",
				name: "Apple Silicon Executable (/opt/homebrew/bin)"
			},
			{
				path: "/usr/local/bin/openclaw",
				name: "Intel Mac Executable (/usr/local/bin)"
			}
		], d = !1, f = e.getFocusedWindow() || g;
		for (let e of c) try {
			await l.stat(e.path);
			let { response: t } = await n.showMessageBox(f, {
				type: "warning",
				title: "Approve Deletion",
				message: `Do you want to permanently delete the following path?\n\n${e.name}\n${e.path}`,
				buttons: ["Approve Deletion", "Skip"],
				defaultId: 1,
				cancelId: 1
			});
			t === 0 ? (v(`> [SYSTEM] User APPROVED deletion of ${e.path}`), v(`> [EXEC] rm -rf ${e.path}`), await l.rm(e.path, {
				recursive: !0,
				force: !0
			}), v(`> [SYSTEM] ${e.name} successfully deleted.`), d = !0) : v(`> [SYSTEM] User SKIPPED deletion of ${e.path}`);
		} catch (t) {
			t.code === "ENOENT" ? v(`> [SYSTEM] Path not found on system: ${e.path}. Skipping.`) : v(`> [SYSTEM] [ERROR] Failed to access ${e.path}: ${t.message}`);
		}
		return v(d ? "> [SYSTEM] Uninstall sequence completed successfully." : "> [SYSTEM] Uninstall sequence completed. No files were removed."), { success: !0 };
	} catch (e) {
		return v(`> [SYSTEM] [ERROR] Uninstall sequence encountered a critical error: ${e.message}`), {
			success: !1,
			error: e.message
		};
	}
});
//#endregion
export { m as MAIN_DIST, h as RENDERER_DIST, p as VITE_DEV_SERVER_URL };
