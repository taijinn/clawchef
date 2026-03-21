import { BrowserWindow as e, app as t, dialog as n, ipcMain as r, shell as i } from "electron";
import a from "node:path";
import { fileURLToPath as o } from "node:url";
import { exec as s, spawn as c } from "node:child_process";
import l from "node:util";
import u from "node:fs/promises";
import d from "node:crypto";
import f from "node:http";
//#region electron/main.js
var p = l.promisify(s);
async function m() {
	if (process.platform === "darwin") try {
		let { stdout: e } = await p(`"${process.env.SHELL || "/bin/zsh"}" -ilc 'echo -n "_SEPARATOR_"; env; echo -n "_SEPARATOR_"'`), t = e.split("_SEPARATOR_")[1].split("\n").find((e) => e.startsWith("PATH="));
		t && t.replace("PATH=", "").trim();
	} catch (e) {
		console.error("Could not fix PATH:", e);
	}
}
process.env.PATH = `/opt/homebrew/bin:/usr/local/bin:${process.env.PATH || ""}`, m();
var h = a.dirname(o(import.meta.url));
process.env.APP_ROOT = a.join(h, "..");
var g = process.env.VITE_DEV_SERVER_URL, _ = a.join(process.env.APP_ROOT, "dist-electron"), v = a.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = g ? a.join(process.env.APP_ROOT, "public") : v;
var y, b = null;
function x(e) {
	console.log(e), y && y.webContents && y.webContents.send("debug-log", e);
}
function S() {
	y = new e({
		width: 1e3,
		height: 850,
		titleBarStyle: "hiddenInset",
		webPreferences: {
			preload: a.join(h, "preload.mjs"),
			nodeIntegration: !1,
			contextIsolation: !0
		}
	}), g ? y.loadURL(g) : y.loadFile(a.join(v, "index.html"));
}
t.whenReady().then(S), t.on("window-all-closed", () => {
	process.platform !== "darwin" && t.quit();
}), t.on("activate", () => {
	e.getAllWindows().length === 0 && S();
});
function C(e, t, n) {
	return new Promise((r, i) => {
		e === "openclaw" ? (t = ["/opt/homebrew/lib/node_modules/openclaw/openclaw.mjs", ...t], e = "/opt/homebrew/bin/node") : e === "brew" ? e = process.arch === "arm64" ? "/opt/homebrew/bin/brew" : "/usr/local/bin/brew" : e === "git" ? e = process.arch === "arm64" ? "/opt/homebrew/bin/git" : "/usr/bin/git" : e === "npm" && (e = process.arch === "arm64" ? "/opt/homebrew/bin/npm" : "/usr/local/bin/npm"), x(`> [EXEC] ${e} ${t.join(" ")}`);
		let a = c(e, t, {
			cwd: n,
			shell: !0
		}), o = "";
		a.stdout.on("data", (e) => {
			let t = e.toString();
			o += t, x(t.trim());
		}), a.stderr.on("data", (e) => {
			let t = e.toString();
			o += t, x(t.trim());
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
	x("> [SYSTEM] Checking System Prerequisites...");
	try {
		x("> [EXEC] git --version");
		let { stdout: t } = await p("git --version");
		x(t.trim()), e.git = !0;
	} catch (e) {
		x(`> [SYSTEM] [ERROR] Git not found: ${e.message}`);
	}
	try {
		x("> [EXEC] python3 --version");
		let { stdout: t } = await p("python3 --version");
		x(t.trim()), e.python = !0;
	} catch (e) {
		x(`> [SYSTEM] [ERROR] Python3 not found: ${e.message}`);
	}
	try {
		x("> [EXEC] npm --version");
		let { stdout: t } = await p("npm --version");
		x(t.trim()), e.npm = !0;
	} catch (e) {
		x(`> [SYSTEM] [ERROR] NPM not found: ${e.message}`);
	}
	return e;
});
async function w() {
	try {
		return await p("brew --version"), x("> [SYSTEM] Homebrew is already installed."), !0;
	} catch {
		x("> [SYSTEM] Homebrew not found. Attempting installation...");
		try {
			x("> [SYSTEM] Checking/Installing Xcode Command Line Tools..."), x("> [EXEC] xcode-select --install"), await C("xcode-select", ["--install"], process.env.APP_ROOT);
		} catch {
			x("> [SYSTEM] Xcode Command Line Tools already installed or user prompted.");
		}
		x("> [SYSTEM] Downloading and running Homebrew installer script...");
		try {
			return await C("bash", ["-c", "NONINTERACTIVE=1 /bin/bash -c \"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""], t.getPath("home")), process.arch === "arm64" ? process.env.PATH = `/opt/homebrew/bin:/opt/homebrew/sbin:${process.env.PATH}` : process.env.PATH = `/usr/local/bin:/usr/local/sbin:${process.env.PATH}`, x("> [SYSTEM] Homebrew installation complete."), !0;
		} catch (e) {
			throw x(`> [SYSTEM] [ERROR] Failed to install Homebrew automatically: ${e.message}`), e;
		}
	}
}
r.handle("install-dependency", async (e, n) => {
	x(`> [SYSTEM] Requested auto-installation for missing dependency: ${n}`);
	try {
		await w();
		let e = "", r = "";
		if (n === "git") e = "git", r = "git --version";
		else if (n === "python") e = "python", r = "python3 --version";
		else if (n === "npm") e = "node", r = "npm --version";
		else throw Error("Unknown dependency requested");
		x(`> [SYSTEM] Installing ${e} via Homebrew...`), await C("brew", ["install", e], t.getPath("home")), x(`> [SYSTEM] Verifying installation of ${n}...`), x(`> [EXEC] ${r}`);
		let { stdout: i } = await p(r);
		return x(i.trim()), x(`> [SYSTEM] ${n} installed successfully!`), { success: !0 };
	} catch (e) {
		return x(`> [SYSTEM] [ERROR] Installation pipeline failed: ${e.message}`), {
			success: !1,
			error: e.message
		};
	}
});
var T = null, E = null;
r.handle("setup-workspace", async (e, n) => {
	let r = n.replace("~", t.getPath("home"));
	x(`> [SYSTEM] Setting up workspace at: ${r}`);
	try {
		x(`> [EXEC] openclaw onboard --workspace "${r}" --non-interactive --accept-risk`), await C("openclaw", [
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
		], t.getPath("home")), x(`> [EXEC] openclaw config set gateway.bind lan (cwd: ${r})`), await C("openclaw", [
			"config",
			"set",
			"gateway.bind",
			"lan"
		], r), x("> [SYSTEM] Workspace setup complete.");
	} catch (e) {
		throw x(`> [SYSTEM] [ERROR] Setup failed: ${e.message}`), e;
	}
	return { success: !0 };
}), r.handle("save-api-key", async (e, n) => {
	let r = n.workspacePath.replace("~", t.getPath("home"));
	x("> [SYSTEM] Applying API keys via `openclaw onboard`...");
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
			let n = "";
			if (e.provider === "OpenAI") n = "--openai-api-key";
			else if (e.provider === "Anthropic") n = "--anthropic-api-key";
			else if (e.provider === "Anthropic Token") {
				try {
					let n = a.join(t.getPath("home"), ".openclaw", "credentials", "anthropic.json");
					await u.mkdir(a.dirname(n), { recursive: !0 });
					let r = {
						type: "token",
						provider: "anthropic",
						token: e.key.trim()
					};
					await u.writeFile(n, JSON.stringify(r, null, 2), { mode: 384 }), x("> [SYSTEM] Saved Anthropic Setup Token to credentials store natively.");
				} catch (e) {
					x(`> [SYSTEM] [ERROR] Failed saving Anthropic Token to credentials: ${e.message}`);
				}
				continue;
			} else if (e.provider === "Google Gemini") n = "--gemini-api-key";
			else if (e.provider === "ByteDance Doubao") n = "--volcengine-api-key";
			else if (e.provider === "xAI (Grok)") n = "--xai-api-key";
			else if (e.provider === "Together AI") n = "--together-api-key";
			else continue;
			i.push(n, e.key.trim());
		}
	} else n.apiKey && i.push("--openai-api-key", n.apiKey);
	try {
		return x(`> [EXEC] openclaw ${i.join(" ")}`), await C("openclaw", i, t.getPath("home")), x("> [SYSTEM] API Configuration applied successfully."), { success: !0 };
	} catch (e) {
		throw x(`> [SYSTEM] [ERROR] Onboard config failed: ${e.message}`), e;
	}
}), r.handle("save-channels", async (e, n) => {
	if (x("> [SYSTEM] Configuring Channels via native CLI commands..."), n.channels && Array.isArray(n.channels)) for (let e of n.channels) {
		let r = e.provider.toLowerCase();
		if (r.includes("lark")) {
			let r = "feishu";
			try {
				try {
					x("> [EXEC] openclaw plugins install @openclaw/feishu"), await C("openclaw", [
						"plugins",
						"install",
						"@openclaw/feishu"
					], t.getPath("home"));
				} catch (e) {
					x(`> [SYSTEM] Feishu plugin already installed or failed to install: ${e.message}`);
				}
				let i = n.workspacePath.replace("~", t.getPath("home"));
				x(`> [EXEC] openclaw config set channels.${r}.enabled true`), await C("openclaw", [
					"config",
					"set",
					`channels.${r}.enabled`,
					"true"
				], i), x("> [SYSTEM] Bypassing CLI to write Feishu credentials directly to openclaw.json...");
				let o = a.join(t.getPath("home"), ".openclaw", "openclaw.json");
				try {
					await u.access(o);
					let t = await u.readFile(o, "utf8"), n = JSON.parse(t);
					n.channels ||= {}, n.channels[r] || (n.channels[r] = { enabled: !0 }), n.channels[r].accounts || (n.channels[r].accounts = {}), n.channels[r].accounts[r] || (n.channels[r].accounts[r] = { enabled: !0 }), e.appId && (n.channels[r].accounts[r].appId = e.appId.trim()), e.appSecret && (n.channels[r].accounts[r].appSecret = e.appSecret.trim()), e.encryptKey && (n.channels[r].accounts[r].encryptKey = e.encryptKey.trim()), e.verificationToken && (n.channels[r].accounts[r].verificationToken = e.verificationToken.trim()), e.domain && (n.channels[r].accounts[r].domain = e.domain.trim()), e.dmPolicy && (n.channels[r].accounts[r].dmPolicy = e.dmPolicy.trim()), await u.writeFile(o, JSON.stringify(n, null, 2)), x("> [SYSTEM] Feishu credentials written directly to openclaw.json.");
				} catch (e) {
					x(`> [SYSTEM] openclaw.json not found or unreadable: ${e.message}`);
				}
			} catch (e) {
				x(`> [SYSTEM] [ERROR] Failed to add Lark channel: ${e.message}`);
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
				x(`> [EXEC] openclaw config set channels.${r}.enabled true`), await C("openclaw", [
					"config",
					"set",
					`channels.${r}.enabled`,
					"true"
				], e), x(`> [EXEC] openclaw ${a.join(" ")}`), await C("openclaw", a, e);
			} catch (e) {
				x(`> [SYSTEM] [ERROR] Failed to add channel ${r}: ${e.message}`);
			}
		}
	}
	return x("> [SYSTEM] Channel setup sequence finished."), { success: !0 };
}), r.handle("login-codex", async () => {
	x("> [SYSTEM] Launching Native PKCE OpenAI Codex OAuth Login...");
	try {
		let { loginOpenAICodex: e } = await import("./oauth-DzFh8ffL.js"), n = await e({
			onAuth: (e) => {
				x("> [SYSTEM] Opening Browser to OpenAI Consent Screen natively..."), i.openExternal(e.url);
			},
			onPrompt: async (e) => {
				throw x(`> [SYSTEM] Manual Prompt Fallback: ${e.message}`), Error("Manual fallback not supported by the frontend. Please authorize via the browser.");
			},
			originator: "clawchef"
		}), r = a.join(t.getPath("home"), ".openclaw", "credentials", "openai-codex.json");
		await u.mkdir(a.dirname(r), { recursive: !0 });
		let o = {
			access_token: n.access,
			refresh_token: n.refresh,
			expiration: n.expires,
			email: n.accountId || "unknown",
			access: n.access,
			refresh: n.refresh,
			expires: n.expires,
			accountId: n.accountId
		};
		return await u.writeFile(r, JSON.stringify(o, null, 2), { mode: 384 }), x("> [SYSTEM] OpenAI Codex OAuth Login Successful through native @mariozechner library!"), { success: !0 };
	} catch (e) {
		return x(`> [SYSTEM] [ERROR] OpenAI Codex Login failed: ${e.message}`), {
			success: !1,
			error: e.message
		};
	}
});
async function D() {
	try {
		let e = (await p("which gemini")).stdout.trim();
		if (e) {
			let t = (await p(`realpath ${e}`)).stdout.trim(), n = a.join(a.dirname(t), ".."), r = a.join(n, "node_modules", "@google", "gemini-cli-core", "dist", "src", "code_assist", "oauth2.js"), i = await u.readFile(r, "utf8"), o = i.match(/OAUTH_CLIENT_ID\s*=\s*['"]([^'"]+)['"]/), s = i.match(/OAUTH_CLIENT_SECRET\s*=\s*['"]([^'"]+)['"]/);
			if (o && s) return {
				clientId: o[1],
				clientSecret: s[1]
			};
		}
	} catch {}
	return {
		clientId: "681255809395-oo8ft2oprdrnp9e3aqf6av3hmdib135j.apps.googleusercontent.com",
		clientSecret: "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"
	};
}
r.handle("login-gemini", async () => {
	x("> [SYSTEM] Launching Native PKCE Google Gemini OAuth Login...");
	try {
		let e = await D(), n = d.randomBytes(32).toString("base64url"), r = d.createHash("sha256").update(n).digest("base64url"), o = 8085, s = `http://127.0.0.1:${o}/oauth2callback`, c = d.randomBytes(32).toString("hex"), l = [
			"https://www.googleapis.com/auth/cloud-platform",
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile"
		].join(" "), p = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${e.clientId}&redirect_uri=${encodeURIComponent(s)}&response_type=code&scope=${encodeURIComponent(l)}&code_challenge=${r}&code_challenge_method=S256&state=${c}&access_type=offline`, m = f.createServer(), h = new Promise((r, i) => {
			let l = setTimeout(() => {
				m.close(), i(/* @__PURE__ */ Error("OAuth timeout after 5 minutes"));
			}, 3e5);
			m.on("request", async (d, f) => {
				try {
					if (d.url.startsWith("/oauth2callback")) {
						let l = new URL(d.url, `http://127.0.0.1:${o}`).searchParams;
						if (l.get("error")) f.writeHead(301, { Location: "https://developers.google.com/gemini-code-assist/auth_failure_gemini" }), f.end(), i(/* @__PURE__ */ Error(`OAuth error: ${l.get("error")}`));
						else if (l.get("state") !== c) f.writeHead(400), f.end("State mismatch"), i(/* @__PURE__ */ Error("State mismatch, possible CSRF"));
						else if (l.get("code")) {
							let i = l.get("code"), o = await fetch("https://oauth2.googleapis.com/token", {
								method: "POST",
								headers: { "Content-Type": "application/x-www-form-urlencoded" },
								body: new URLSearchParams({
									code: i,
									client_id: e.clientId,
									client_secret: e.clientSecret,
									redirect_uri: s,
									grant_type: "authorization_code",
									code_verifier: n
								})
							});
							if (!o.ok) throw Error(await o.text());
							let c = await o.json();
							f.writeHead(301, { Location: "https://developers.google.com/gemini-code-assist/auth_success_gemini" }), f.end();
							let d = a.join(t.getPath("home"), ".openclaw", "credentials", "google-gemini-cli.json");
							await u.mkdir(a.dirname(d), { recursive: !0 }), await u.writeFile(d, JSON.stringify(c, null, 2), { mode: 384 }), r(c);
						} else f.writeHead(400), f.end("Missing code"), i(/* @__PURE__ */ Error("Missing authorization code"));
					} else f.writeHead(404), f.end();
				} catch (e) {
					i(e);
				} finally {
					clearTimeout(l), m.close();
				}
			}), m.on("error", i);
		});
		return m.listen(o, "127.0.0.1", () => {
			x("> [SYSTEM] Opening Browser to Google Consent Screen natively..."), i.openExternal(p);
		}), await h, x("> [SYSTEM] Google Gemini OAuth Login Successful through PKCE Server!"), { success: !0 };
	} catch (e) {
		return x(`> [SYSTEM] [ERROR] Google Gemini Login failed: ${e.message}`), {
			success: !1,
			error: e.message
		};
	}
}), r.handle("generate-whatsapp-qr", async (e, n) => {
	x("> [SYSTEM] Launching native WhatsApp Web Linker..."), x("> [SYSTEM] Look at the Debug Log below to scan the Terminal ASCII QR Code.");
	try {
		let e = n.replace("~", t.getPath("home"));
		return x("> [EXEC] openclaw config set channels.whatsapp.enabled true"), await C("openclaw", [
			"config",
			"set",
			"channels.whatsapp.enabled",
			"true"
		], e), x(`> [EXEC] openclaw channels login --channel whatsapp (cwd: ${e})`), await C("openclaw", [
			"channels",
			"login",
			"--channel",
			"whatsapp"
		], e), x("> [SYSTEM] WhatsApp Session Linked Successfully!"), {
			success: !0,
			qrDataUrl: null
		};
	} catch (e) {
		return x(`> [SYSTEM] [ERROR] WhatsApp QR Generation failed: ${e.message}`), {
			success: !1,
			error: e.message
		};
	}
}), r.handle("test-message", async (e, n, r, i, a) => {
	x(`> [SYSTEM] Initiating Test Message dispatch to ${i} via ${r}...`);
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
		]), x(`> [EXEC] openclaw ${s.join(" ")} (cwd: ${e})`), await C("openclaw", s, e), x("> [SYSTEM] Test Message dispatched successfully."), { success: !0 };
	} catch (e) {
		return x(`> [SYSTEM] [ERROR] Message dispatch failed: ${e.message}`), {
			success: !1,
			error: e.message
		};
	}
}), r.handle("approve-pairing", async (e, n, r, i) => {
	x(`> [SYSTEM] Initiating Pairing Approval for ${r} with code ${i}...`);
	try {
		let e = n.replace("~", t.getPath("home")), a = [
			"pairing",
			"approve",
			r,
			i
		];
		return x(`> [EXEC] openclaw ${a.join(" ")} (cwd: ${e})`), await C("openclaw", a, e), x("> [SYSTEM] Pairing approved successfully."), { success: !0 };
	} catch (e) {
		return x(`> [SYSTEM] [ERROR] Pairing approval failed: ${e.message}`), {
			success: !1,
			error: e.message
		};
	}
}), r.handle("start-claw", async (n, r) => {
	if (T) return x("> [SYSTEM] OpenClaw is already running."), { success: !0 };
	let i = r.workspacePath.replace("~", t.getPath("home"));
	E = i, x("> [SYSTEM] Requesting daemon installation configuration...");
	let o = [
		"onboard",
		"--install-daemon",
		"--non-interactive",
		"--accept-risk",
		"--workspace",
		i
	];
	try {
		x(`> [EXEC] openclaw ${o.join(" ")}`), await C("openclaw", o, t.getPath("home")), x("> [SYSTEM] Waiting 3 seconds for daemon to initialize its web server..."), await new Promise((e) => setTimeout(e, 3e3)), T = !0, x("> [SYSTEM] Fetching Manager Dashboard URL...");
		try {
			let { stdout: n } = await p("/opt/homebrew/bin/node /opt/homebrew/lib/node_modules/openclaw/openclaw.mjs dashboard --no-open", { cwd: t.getPath("home") }), i = n.match(/Dashboard URL:\s*(https?:\/\/[^\s]+)/);
			if (i && i[1]) {
				let t = i[1];
				x(`> [SYSTEM] Opening Manager at: ${t}`), b = new e({
					width: 1200,
					height: 800,
					title: "OpenClaw Manager",
					webPreferences: {
						nodeIntegration: !1,
						contextIsolation: !0,
						preload: a.join(h, "preload.mjs")
					}
				}), b.loadURL(t);
				let n = !1;
				b.webContents.on("did-finish-load", async () => {
					!n && r.lang && (n = !0, await b.webContents.executeJavaScript(`try { localStorage.setItem('openclaw.i18n.locale', '${r.lang}'); } catch(e) {}`), b.webContents.reload());
				}), b.on("closed", () => {
					b = null;
				});
			} else x("> [SYSTEM] Could not parse Dashboard URL from stdout.");
		} catch (e) {
			x(`> [SYSTEM] Failed to load dashboard: ${e.message}`);
		}
		return { success: !0 };
	} catch (e) {
		return x(`> [SYSTEM] [ERROR] Failed to start OpenClaw daemon: ${e.message}`), {
			success: !1,
			error: e.message
		};
	}
}), r.handle("stop-claw", async () => {
	if (x("> [SYSTEM] Stop button pressed. Sending kill signal to active process."), T) {
		x("> [EXEC] openclaw daemon stop");
		try {
			await C("openclaw", ["daemon", "stop"], t.getPath("home"));
		} catch (e) {
			x(`> [SYSTEM] (daemon stop returned error: ${e.message})`), x("> [EXEC] pkill -f \"node.*openclaw\""), await p("pkill -f \"node.*openclaw\"").catch(() => {});
		}
		return T = null, b &&= (b.close(), null), x("> [SYSTEM] Active OpenClaw process terminated gracefully."), { success: !0 };
	}
	return x("> [SYSTEM] No active process found to stop."), {
		success: !1,
		message: "OpenClaw is not currently running."
	};
}), r.handle("kill-all-tasks", async () => {
	x("> [SYSTEM] WARNING: Kill All Tasks initiated.");
	try {
		x("> [EXEC] pkill -f \"python3.*openclaw\"");
		try {
			let { stdout: e, stderr: t } = await p("pkill -f \"python3.*openclaw\"");
			e && x(e.trim()), t && x(t.trim());
		} catch (e) {
			x(`> [SYSTEM] (pkill returned error, likely no tasks found tracking openclaw string: ${e.message})`);
		}
		x("> [EXEC] pkill -f \"node.*openclaw\"");
		try {
			await p("pkill -f \"node.*openclaw\"");
		} catch {}
		return T &&= (x("> [SYSTEM] Nullifying internal process tracking handle."), null), b &&= (b.close(), null), x("> [SYSTEM] Purge complete."), { success: !0 };
	} catch (e) {
		return x(`> [SYSTEM] [ERROR] Kill task sequence failed: ${e.message}`), {
			success: !1,
			error: e.message
		};
	}
}), r.handle("uninstall-claw", async (r, i) => {
	x("> [SYSTEM] Uninstall sequence initiated.");
	try {
		let r = (i || E || "").replace("~", t.getPath("home")), o = a.join(r, "openclaw"), s = a.join(t.getPath("home"), ".openclaw");
		if (T) {
			x("> [SYSTEM] Stopping active daemon before directory removal...");
			try {
				await C("openclaw", ["daemon", "stop"], t.getPath("home"));
			} catch {}
			await p("pkill -f \"node.*openclaw\"").catch(() => {}), await p("pkill -f \"python3.*openclaw\"").catch(() => {}), T = null;
		}
		b &&= (b.close(), null);
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
		], l = !1, d = e.getFocusedWindow() || y;
		for (let e of c) try {
			await u.stat(e.path);
			let { response: t } = await n.showMessageBox(d, {
				type: "warning",
				title: "Approve Deletion",
				message: `Do you want to permanently delete the following path?\n\n${e.name}\n${e.path}`,
				buttons: ["Approve Deletion", "Skip"],
				defaultId: 1,
				cancelId: 1
			});
			t === 0 ? (x(`> [SYSTEM] User APPROVED deletion of ${e.path}`), x(`> [EXEC] rm -rf ${e.path}`), await u.rm(e.path, {
				recursive: !0,
				force: !0
			}), x(`> [SYSTEM] ${e.name} successfully deleted.`), l = !0) : x(`> [SYSTEM] User SKIPPED deletion of ${e.path}`);
		} catch (t) {
			t.code === "ENOENT" ? x(`> [SYSTEM] Path not found on system: ${e.path}. Skipping.`) : x(`> [SYSTEM] [ERROR] Failed to access ${e.path}: ${t.message}`);
		}
		return x(l ? "> [SYSTEM] Uninstall sequence completed successfully." : "> [SYSTEM] Uninstall sequence completed. No files were removed."), { success: !0 };
	} catch (e) {
		return x(`> [SYSTEM] [ERROR] Uninstall sequence encountered a critical error: ${e.message}`), {
			success: !1,
			error: e.message
		};
	}
});
//#endregion
export { _ as MAIN_DIST, v as RENDERER_DIST, g as VITE_DEV_SERVER_URL };
