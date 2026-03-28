//#region ../../../../opt/homebrew/lib/node_modules/openclaw/node_modules/@mariozechner/pi-ai/dist/utils/oauth/oauth-page.js
var e = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 800 800\" aria-hidden=\"true\"><path fill=\"#fff\" fill-rule=\"evenodd\" d=\"M165.29 165.29 H517.36 V400 H400 V517.36 H282.65 V634.72 H165.29 Z M282.65 282.65 V400 H400 V282.65 Z\"/><path fill=\"#fff\" d=\"M517.36 400 H634.72 V634.72 H517.36 Z\"/></svg>";
function t(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
function n(n) {
	let r = t(n.title), i = t(n.heading), a = t(n.message), o = n.details ? t(n.details) : void 0;
	return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${r}</title>
  <style>
    :root {
      --text: #fafafa;
      --text-dim: #a1a1aa;
      --page-bg: #09090b;
      --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
      --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    }
    * { box-sizing: border-box; }
    html { color-scheme: dark; }
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: var(--page-bg);
      color: var(--text);
      font-family: var(--font-sans);
      text-align: center;
    }
    main {
      width: 100%;
      max-width: 560px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .logo {
      width: 72px;
      height: 72px;
      display: block;
      margin-bottom: 24px;
    }
    h1 {
      margin: 0 0 10px;
      font-size: 28px;
      line-height: 1.15;
      font-weight: 650;
      color: var(--text);
    }
    p {
      margin: 0;
      line-height: 1.7;
      color: var(--text-dim);
      font-size: 15px;
    }
    .details {
      margin-top: 16px;
      font-family: var(--font-mono);
      font-size: 13px;
      color: var(--text-dim);
      white-space: pre-wrap;
      word-break: break-word;
    }
  </style>
</head>
<body>
  <main>
    <div class="logo">${e}</div>
    <h1>${i}</h1>
    <p>${a}</p>
    ${o ? `<div class="details">${o}</div>` : ""}
  </main>
</body>
</html>`;
}
function r(e) {
	return n({
		title: "Authentication successful",
		heading: "Authentication successful",
		message: e
	});
}
function i(e, t) {
	return n({
		title: "Authentication failed",
		heading: "Authentication failed",
		message: e,
		details: t
	});
}
//#endregion
//#region ../../../../opt/homebrew/lib/node_modules/openclaw/node_modules/@mariozechner/pi-ai/dist/utils/oauth/pkce.js
function a(e) {
	let t = "";
	for (let n of e) t += String.fromCharCode(n);
	return btoa(t).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
async function o() {
	let e = new Uint8Array(32);
	crypto.getRandomValues(e);
	let t = a(e), n = new TextEncoder().encode(t), r = await crypto.subtle.digest("SHA-256", n);
	return {
		verifier: t,
		challenge: a(new Uint8Array(r))
	};
}
//#endregion
//#region ../../../../opt/homebrew/lib/node_modules/openclaw/node_modules/@mariozechner/pi-ai/dist/utils/oauth/anthropic.js
var s = null, c = null, l = ((e) => atob(e))("OWQxYzI1MGEtZTYxYi00NGQ5LTg4ZWQtNTk0NGQxOTYyZjVl"), u = "https://claude.ai/oauth/authorize", d = "https://platform.claude.com/v1/oauth/token", ee = "127.0.0.1", f = 53692, p = "/callback", m = `http://localhost:${f}${p}`, te = "org:create_api_key user:profile user:inference user:sessions:claude_code user:mcp_servers user:file_upload";
async function ne() {
	if (s) return s;
	if (!c) {
		if (typeof process > "u" || !process.versions?.node && !process.versions?.bun) throw Error("Anthropic OAuth is only available in Node.js environments");
		c = import("node:http").then((e) => ({ createServer: e.createServer }));
	}
	return s = await c, s;
}
function h(e) {
	let t = e.trim();
	if (!t) return {};
	try {
		let e = new URL(t);
		return {
			code: e.searchParams.get("code") ?? void 0,
			state: e.searchParams.get("state") ?? void 0
		};
	} catch {}
	if (t.includes("#")) {
		let [e, n] = t.split("#", 2);
		return {
			code: e,
			state: n
		};
	}
	if (t.includes("code=")) {
		let e = new URLSearchParams(t);
		return {
			code: e.get("code") ?? void 0,
			state: e.get("state") ?? void 0
		};
	}
	return { code: t };
}
function g(e) {
	if (e instanceof Error) {
		let t = [`${e.name}: ${e.message}`], n = e;
		return n.code && t.push(`code=${n.code}`), n.errno !== void 0 && t.push(`errno=${String(n.errno)}`), e.cause !== void 0 && t.push(`cause=${g(e.cause)}`), e.stack && t.push(`stack=${e.stack}`), t.join("; ");
	}
	return String(e);
}
async function re(e) {
	let { createServer: t } = await ne();
	return new Promise((n, a) => {
		let o, s = new Promise((e) => {
			let t = !1;
			o = (n) => {
				t || (t = !0, e(n));
			};
		}), c = t((t, n) => {
			try {
				let a = new URL(t.url || "", "http://localhost");
				if (a.pathname !== p) {
					n.writeHead(404, { "Content-Type": "text/html; charset=utf-8" }), n.end(i("Callback route not found."));
					return;
				}
				let s = a.searchParams.get("code"), c = a.searchParams.get("state"), l = a.searchParams.get("error");
				if (l) {
					n.writeHead(400, { "Content-Type": "text/html; charset=utf-8" }), n.end(i("Anthropic authentication did not complete.", `Error: ${l}`));
					return;
				}
				if (!s || !c) {
					n.writeHead(400, { "Content-Type": "text/html; charset=utf-8" }), n.end(i("Missing code or state parameter."));
					return;
				}
				if (c !== e) {
					n.writeHead(400, { "Content-Type": "text/html; charset=utf-8" }), n.end(i("State mismatch."));
					return;
				}
				n.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }), n.end(r("Anthropic authentication completed. You can close this window.")), o?.({
					code: s,
					state: c
				});
			} catch {
				n.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" }), n.end("Internal error");
			}
		});
		c.on("error", (e) => {
			a(e);
		}), c.listen(f, ee, () => {
			n({
				server: c,
				redirectUri: m,
				cancelWait: () => {
					o?.(null);
				},
				waitForCode: () => s
			});
		});
	});
}
async function _(e, t) {
	let n = await fetch(e, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify(t),
		signal: AbortSignal.timeout(3e4)
	}), r = await n.text();
	if (!n.ok) throw Error(`HTTP request failed. status=${n.status}; url=${e}; body=${r}`);
	return r;
}
async function ie(e, t, n, r) {
	let i;
	try {
		i = await _(d, {
			grant_type: "authorization_code",
			client_id: l,
			code: e,
			state: t,
			redirect_uri: r,
			code_verifier: n
		});
	} catch (e) {
		throw Error(`Token exchange request failed. url=${d}; redirect_uri=${r}; response_type=authorization_code; details=${g(e)}`);
	}
	let a;
	try {
		a = JSON.parse(i);
	} catch (e) {
		throw Error(`Token exchange returned invalid JSON. url=${d}; body=${i}; details=${g(e)}`);
	}
	return {
		refresh: a.refresh_token,
		access: a.access_token,
		expires: Date.now() + a.expires_in * 1e3 - 300 * 1e3
	};
}
async function ae(e) {
	let { verifier: t, challenge: n } = await o(), r = await re(t), i, a, s = m;
	try {
		let o = new URLSearchParams({
			code: "true",
			client_id: l,
			response_type: "code",
			redirect_uri: m,
			scope: te,
			code_challenge: n,
			code_challenge_method: "S256",
			state: t
		});
		if (e.onAuth({
			url: `${u}?${o.toString()}`,
			instructions: "Complete login in your browser. If the browser is on another machine, paste the final redirect URL here."
		}), e.onManualCodeInput) {
			let n, o, c = e.onManualCodeInput().then((e) => {
				n = e, r.cancelWait();
			}).catch((e) => {
				o = e instanceof Error ? e : Error(String(e)), r.cancelWait();
			}), l = await r.waitForCode();
			if (o) throw o;
			if (l?.code) i = l.code, a = l.state, s = m;
			else if (n) {
				let e = h(n);
				if (e.state && e.state !== t) throw Error("OAuth state mismatch");
				i = e.code, a = e.state ?? t;
			}
			if (!i) {
				if (await c, o) throw o;
				if (n) {
					let e = h(n);
					if (e.state && e.state !== t) throw Error("OAuth state mismatch");
					i = e.code, a = e.state ?? t;
				}
			}
		} else {
			let e = await r.waitForCode();
			e?.code && (i = e.code, a = e.state, s = m);
		}
		if (!i) {
			let n = h(await e.onPrompt({
				message: "Paste the authorization code or full redirect URL:",
				placeholder: m
			}));
			if (n.state && n.state !== t) throw Error("OAuth state mismatch");
			i = n.code, a = n.state ?? t;
		}
		if (!i) throw Error("Missing authorization code");
		if (!a) throw Error("Missing OAuth state");
		return e.onProgress?.("Exchanging authorization code for tokens..."), ie(i, a, t, s);
	} finally {
		r.server.close();
	}
}
async function oe(e) {
	let t;
	try {
		t = await _(d, {
			grant_type: "refresh_token",
			client_id: l,
			refresh_token: e
		});
	} catch (e) {
		throw Error(`Anthropic token refresh request failed. url=${d}; details=${g(e)}`);
	}
	let n;
	try {
		n = JSON.parse(t);
	} catch (e) {
		throw Error(`Anthropic token refresh returned invalid JSON. url=${d}; body=${t}; details=${g(e)}`);
	}
	return {
		refresh: n.refresh_token,
		access: n.access_token,
		expires: Date.now() + n.expires_in * 1e3 - 300 * 1e3
	};
}
var se = {
	id: "anthropic",
	name: "Anthropic (Claude Pro/Max)",
	usesCallbackServer: !0,
	async login(e) {
		return ae({
			onAuth: e.onAuth,
			onPrompt: e.onPrompt,
			onProgress: e.onProgress,
			onManualCodeInput: e.onManualCodeInput
		});
	},
	async refreshToken(e) {
		return oe(e.refresh);
	},
	getApiKey(e) {
		return e.access;
	}
}, ce = {
	"amazon-bedrock": {
		"amazon.nova-2-lite-v1:0": {
			id: "amazon.nova-2-lite-v1:0",
			name: "Nova 2 Lite",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .33,
				output: 2.75,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4096
		},
		"amazon.nova-lite-v1:0": {
			id: "amazon.nova-lite-v1:0",
			name: "Nova Lite",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .06,
				output: .24,
				cacheRead: .015,
				cacheWrite: 0
			},
			contextWindow: 3e5,
			maxTokens: 8192
		},
		"amazon.nova-micro-v1:0": {
			id: "amazon.nova-micro-v1:0",
			name: "Nova Micro",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .035,
				output: .14,
				cacheRead: .00875,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 8192
		},
		"amazon.nova-premier-v1:0": {
			id: "amazon.nova-premier-v1:0",
			name: "Nova Premier",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 2.5,
				output: 12.5,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 1e6,
			maxTokens: 16384
		},
		"amazon.nova-pro-v1:0": {
			id: "amazon.nova-pro-v1:0",
			name: "Nova Pro",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .8,
				output: 3.2,
				cacheRead: .2,
				cacheWrite: 0
			},
			contextWindow: 3e5,
			maxTokens: 8192
		},
		"anthropic.claude-3-5-haiku-20241022-v1:0": {
			id: "anthropic.claude-3-5-haiku-20241022-v1:0",
			name: "Claude Haiku 3.5",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .8,
				output: 4,
				cacheRead: .08,
				cacheWrite: 1
			},
			contextWindow: 2e5,
			maxTokens: 8192
		},
		"anthropic.claude-3-5-sonnet-20240620-v1:0": {
			id: "anthropic.claude-3-5-sonnet-20240620-v1:0",
			name: "Claude Sonnet 3.5",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 2e5,
			maxTokens: 8192
		},
		"anthropic.claude-3-5-sonnet-20241022-v2:0": {
			id: "anthropic.claude-3-5-sonnet-20241022-v2:0",
			name: "Claude Sonnet 3.5 v2",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 2e5,
			maxTokens: 8192
		},
		"anthropic.claude-3-7-sonnet-20250219-v1:0": {
			id: "anthropic.claude-3-7-sonnet-20250219-v1:0",
			name: "Claude Sonnet 3.7",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 2e5,
			maxTokens: 8192
		},
		"anthropic.claude-3-haiku-20240307-v1:0": {
			id: "anthropic.claude-3-haiku-20240307-v1:0",
			name: "Claude Haiku 3",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .25,
				output: 1.25,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 4096
		},
		"anthropic.claude-haiku-4-5-20251001-v1:0": {
			id: "anthropic.claude-haiku-4-5-20251001-v1:0",
			name: "Claude Haiku 4.5",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1,
				output: 5,
				cacheRead: .1,
				cacheWrite: 1.25
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"anthropic.claude-opus-4-1-20250805-v1:0": {
			id: "anthropic.claude-opus-4-1-20250805-v1:0",
			name: "Claude Opus 4.1",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 15,
				output: 75,
				cacheRead: 1.5,
				cacheWrite: 18.75
			},
			contextWindow: 2e5,
			maxTokens: 32e3
		},
		"anthropic.claude-opus-4-20250514-v1:0": {
			id: "anthropic.claude-opus-4-20250514-v1:0",
			name: "Claude Opus 4",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 15,
				output: 75,
				cacheRead: 1.5,
				cacheWrite: 18.75
			},
			contextWindow: 2e5,
			maxTokens: 32e3
		},
		"anthropic.claude-opus-4-5-20251101-v1:0": {
			id: "anthropic.claude-opus-4-5-20251101-v1:0",
			name: "Claude Opus 4.5",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 5,
				output: 25,
				cacheRead: .5,
				cacheWrite: 6.25
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"anthropic.claude-opus-4-6-v1": {
			id: "anthropic.claude-opus-4-6-v1",
			name: "Claude Opus 4.6",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 5,
				output: 25,
				cacheRead: .5,
				cacheWrite: 6.25
			},
			contextWindow: 1e6,
			maxTokens: 128e3
		},
		"anthropic.claude-sonnet-4-20250514-v1:0": {
			id: "anthropic.claude-sonnet-4-20250514-v1:0",
			name: "Claude Sonnet 4",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"anthropic.claude-sonnet-4-5-20250929-v1:0": {
			id: "anthropic.claude-sonnet-4-5-20250929-v1:0",
			name: "Claude Sonnet 4.5",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"anthropic.claude-sonnet-4-6": {
			id: "anthropic.claude-sonnet-4-6",
			name: "Claude Sonnet 4.6",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 1e6,
			maxTokens: 64e3
		},
		"deepseek.r1-v1:0": {
			id: "deepseek.r1-v1:0",
			name: "DeepSeek-R1",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 1.35,
				output: 5.4,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 32768
		},
		"deepseek.v3-v1:0": {
			id: "deepseek.v3-v1:0",
			name: "DeepSeek-V3.1",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .58,
				output: 1.68,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 163840,
			maxTokens: 81920
		},
		"deepseek.v3.2": {
			id: "deepseek.v3.2",
			name: "DeepSeek-V3.2",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .62,
				output: 1.85,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 163840,
			maxTokens: 81920
		},
		"eu.anthropic.claude-haiku-4-5-20251001-v1:0": {
			id: "eu.anthropic.claude-haiku-4-5-20251001-v1:0",
			name: "Claude Haiku 4.5 (EU)",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1,
				output: 5,
				cacheRead: .1,
				cacheWrite: 1.25
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"eu.anthropic.claude-opus-4-5-20251101-v1:0": {
			id: "eu.anthropic.claude-opus-4-5-20251101-v1:0",
			name: "Claude Opus 4.5 (EU)",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 5,
				output: 25,
				cacheRead: .5,
				cacheWrite: 6.25
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"eu.anthropic.claude-opus-4-6-v1": {
			id: "eu.anthropic.claude-opus-4-6-v1",
			name: "Claude Opus 4.6 (EU)",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 5,
				output: 25,
				cacheRead: .5,
				cacheWrite: 6.25
			},
			contextWindow: 1e6,
			maxTokens: 128e3
		},
		"eu.anthropic.claude-sonnet-4-20250514-v1:0": {
			id: "eu.anthropic.claude-sonnet-4-20250514-v1:0",
			name: "Claude Sonnet 4 (EU)",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"eu.anthropic.claude-sonnet-4-5-20250929-v1:0": {
			id: "eu.anthropic.claude-sonnet-4-5-20250929-v1:0",
			name: "Claude Sonnet 4.5 (EU)",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"eu.anthropic.claude-sonnet-4-6": {
			id: "eu.anthropic.claude-sonnet-4-6",
			name: "Claude Sonnet 4.6 (EU)",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 1e6,
			maxTokens: 64e3
		},
		"global.anthropic.claude-haiku-4-5-20251001-v1:0": {
			id: "global.anthropic.claude-haiku-4-5-20251001-v1:0",
			name: "Claude Haiku 4.5 (Global)",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1,
				output: 5,
				cacheRead: .1,
				cacheWrite: 1.25
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"global.anthropic.claude-opus-4-5-20251101-v1:0": {
			id: "global.anthropic.claude-opus-4-5-20251101-v1:0",
			name: "Claude Opus 4.5 (Global)",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 5,
				output: 25,
				cacheRead: .5,
				cacheWrite: 6.25
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"global.anthropic.claude-opus-4-6-v1": {
			id: "global.anthropic.claude-opus-4-6-v1",
			name: "Claude Opus 4.6 (Global)",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 5,
				output: 25,
				cacheRead: .5,
				cacheWrite: 6.25
			},
			contextWindow: 1e6,
			maxTokens: 128e3
		},
		"global.anthropic.claude-sonnet-4-20250514-v1:0": {
			id: "global.anthropic.claude-sonnet-4-20250514-v1:0",
			name: "Claude Sonnet 4 (Global)",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"global.anthropic.claude-sonnet-4-5-20250929-v1:0": {
			id: "global.anthropic.claude-sonnet-4-5-20250929-v1:0",
			name: "Claude Sonnet 4.5 (Global)",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"global.anthropic.claude-sonnet-4-6": {
			id: "global.anthropic.claude-sonnet-4-6",
			name: "Claude Sonnet 4.6 (Global)",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 1e6,
			maxTokens: 64e3
		},
		"google.gemma-3-27b-it": {
			id: "google.gemma-3-27b-it",
			name: "Google Gemma 3 27B Instruct",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .12,
				output: .2,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 202752,
			maxTokens: 8192
		},
		"google.gemma-3-4b-it": {
			id: "google.gemma-3-4b-it",
			name: "Gemma 3 4B IT",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .04,
				output: .08,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4096
		},
		"meta.llama3-1-405b-instruct-v1:0": {
			id: "meta.llama3-1-405b-instruct-v1:0",
			name: "Llama 3.1 405B Instruct",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 2.4,
				output: 2.4,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4096
		},
		"meta.llama3-1-70b-instruct-v1:0": {
			id: "meta.llama3-1-70b-instruct-v1:0",
			name: "Llama 3.1 70B Instruct",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .72,
				output: .72,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4096
		},
		"meta.llama3-1-8b-instruct-v1:0": {
			id: "meta.llama3-1-8b-instruct-v1:0",
			name: "Llama 3.1 8B Instruct",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .22,
				output: .22,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4096
		},
		"meta.llama3-2-11b-instruct-v1:0": {
			id: "meta.llama3-2-11b-instruct-v1:0",
			name: "Llama 3.2 11B Instruct",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .16,
				output: .16,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4096
		},
		"meta.llama3-2-1b-instruct-v1:0": {
			id: "meta.llama3-2-1b-instruct-v1:0",
			name: "Llama 3.2 1B Instruct",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .1,
				output: .1,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131e3,
			maxTokens: 4096
		},
		"meta.llama3-2-3b-instruct-v1:0": {
			id: "meta.llama3-2-3b-instruct-v1:0",
			name: "Llama 3.2 3B Instruct",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .15,
				output: .15,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131e3,
			maxTokens: 4096
		},
		"meta.llama3-2-90b-instruct-v1:0": {
			id: "meta.llama3-2-90b-instruct-v1:0",
			name: "Llama 3.2 90B Instruct",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .72,
				output: .72,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4096
		},
		"meta.llama3-3-70b-instruct-v1:0": {
			id: "meta.llama3-3-70b-instruct-v1:0",
			name: "Llama 3.3 70B Instruct",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .72,
				output: .72,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4096
		},
		"meta.llama4-maverick-17b-instruct-v1:0": {
			id: "meta.llama4-maverick-17b-instruct-v1:0",
			name: "Llama 4 Maverick 17B Instruct",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .24,
				output: .97,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 1e6,
			maxTokens: 16384
		},
		"meta.llama4-scout-17b-instruct-v1:0": {
			id: "meta.llama4-scout-17b-instruct-v1:0",
			name: "Llama 4 Scout 17B Instruct",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .17,
				output: .66,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 35e5,
			maxTokens: 16384
		},
		"minimax.minimax-m2": {
			id: "minimax.minimax-m2",
			name: "MiniMax M2",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .3,
				output: 1.2,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 204608,
			maxTokens: 128e3
		},
		"minimax.minimax-m2.1": {
			id: "minimax.minimax-m2.1",
			name: "MiniMax M2.1",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .3,
				output: 1.2,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 204800,
			maxTokens: 131072
		},
		"mistral.devstral-2-123b": {
			id: "mistral.devstral-2-123b",
			name: "Devstral 2 123B",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .4,
				output: 2,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 256e3,
			maxTokens: 8192
		},
		"mistral.magistral-small-2509": {
			id: "mistral.magistral-small-2509",
			name: "Magistral Small 1.2",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .5,
				output: 1.5,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4e4
		},
		"mistral.ministral-3-14b-instruct": {
			id: "mistral.ministral-3-14b-instruct",
			name: "Ministral 14B 3.0",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .2,
				output: .2,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4096
		},
		"mistral.ministral-3-3b-instruct": {
			id: "mistral.ministral-3-3b-instruct",
			name: "Ministral 3 3B",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .1,
				output: .1,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 256e3,
			maxTokens: 8192
		},
		"mistral.ministral-3-8b-instruct": {
			id: "mistral.ministral-3-8b-instruct",
			name: "Ministral 3 8B",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .15,
				output: .15,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4096
		},
		"mistral.mistral-large-3-675b-instruct": {
			id: "mistral.mistral-large-3-675b-instruct",
			name: "Mistral Large 3",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .5,
				output: 1.5,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 256e3,
			maxTokens: 8192
		},
		"mistral.pixtral-large-2502-v1:0": {
			id: "mistral.pixtral-large-2502-v1:0",
			name: "Pixtral Large (25.02)",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 2,
				output: 6,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 8192
		},
		"mistral.voxtral-mini-3b-2507": {
			id: "mistral.voxtral-mini-3b-2507",
			name: "Voxtral Mini 3B 2507",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .04,
				output: .04,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4096
		},
		"mistral.voxtral-small-24b-2507": {
			id: "mistral.voxtral-small-24b-2507",
			name: "Voxtral Small 24B 2507",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .15,
				output: .35,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 32e3,
			maxTokens: 8192
		},
		"moonshot.kimi-k2-thinking": {
			id: "moonshot.kimi-k2-thinking",
			name: "Kimi K2 Thinking",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .6,
				output: 2.5,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 256e3,
			maxTokens: 256e3
		},
		"moonshotai.kimi-k2.5": {
			id: "moonshotai.kimi-k2.5",
			name: "Kimi K2.5",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .6,
				output: 3,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 256e3,
			maxTokens: 256e3
		},
		"nvidia.nemotron-nano-12b-v2": {
			id: "nvidia.nemotron-nano-12b-v2",
			name: "NVIDIA Nemotron Nano 12B v2 VL BF16",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .2,
				output: .6,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4096
		},
		"nvidia.nemotron-nano-3-30b": {
			id: "nvidia.nemotron-nano-3-30b",
			name: "NVIDIA Nemotron Nano 3 30B",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .06,
				output: .24,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4096
		},
		"nvidia.nemotron-nano-9b-v2": {
			id: "nvidia.nemotron-nano-9b-v2",
			name: "NVIDIA Nemotron Nano 9B v2",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .06,
				output: .23,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4096
		},
		"openai.gpt-oss-120b-1:0": {
			id: "openai.gpt-oss-120b-1:0",
			name: "gpt-oss-120b",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .15,
				output: .6,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4096
		},
		"openai.gpt-oss-20b-1:0": {
			id: "openai.gpt-oss-20b-1:0",
			name: "gpt-oss-20b",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .07,
				output: .3,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4096
		},
		"openai.gpt-oss-safeguard-120b": {
			id: "openai.gpt-oss-safeguard-120b",
			name: "GPT OSS Safeguard 120B",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .15,
				output: .6,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4096
		},
		"openai.gpt-oss-safeguard-20b": {
			id: "openai.gpt-oss-safeguard-20b",
			name: "GPT OSS Safeguard 20B",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .07,
				output: .2,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4096
		},
		"qwen.qwen3-235b-a22b-2507-v1:0": {
			id: "qwen.qwen3-235b-a22b-2507-v1:0",
			name: "Qwen3 235B A22B 2507",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .22,
				output: .88,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 131072
		},
		"qwen.qwen3-32b-v1:0": {
			id: "qwen.qwen3-32b-v1:0",
			name: "Qwen3 32B (dense)",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .15,
				output: .6,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 16384,
			maxTokens: 16384
		},
		"qwen.qwen3-coder-30b-a3b-v1:0": {
			id: "qwen.qwen3-coder-30b-a3b-v1:0",
			name: "Qwen3 Coder 30B A3B Instruct",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .15,
				output: .6,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 131072
		},
		"qwen.qwen3-coder-480b-a35b-v1:0": {
			id: "qwen.qwen3-coder-480b-a35b-v1:0",
			name: "Qwen3 Coder 480B A35B Instruct",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .22,
				output: 1.8,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 65536
		},
		"qwen.qwen3-next-80b-a3b": {
			id: "qwen.qwen3-next-80b-a3b",
			name: "Qwen/Qwen3-Next-80B-A3B-Instruct",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .14,
				output: 1.4,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 262e3,
			maxTokens: 262e3
		},
		"qwen.qwen3-vl-235b-a22b": {
			id: "qwen.qwen3-vl-235b-a22b",
			name: "Qwen/Qwen3-VL-235B-A22B-Instruct",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .3,
				output: 1.5,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 262e3,
			maxTokens: 262e3
		},
		"us.anthropic.claude-haiku-4-5-20251001-v1:0": {
			id: "us.anthropic.claude-haiku-4-5-20251001-v1:0",
			name: "Claude Haiku 4.5 (US)",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1,
				output: 5,
				cacheRead: .1,
				cacheWrite: 1.25
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"us.anthropic.claude-opus-4-1-20250805-v1:0": {
			id: "us.anthropic.claude-opus-4-1-20250805-v1:0",
			name: "Claude Opus 4.1 (US)",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 15,
				output: 75,
				cacheRead: 1.5,
				cacheWrite: 18.75
			},
			contextWindow: 2e5,
			maxTokens: 32e3
		},
		"us.anthropic.claude-opus-4-20250514-v1:0": {
			id: "us.anthropic.claude-opus-4-20250514-v1:0",
			name: "Claude Opus 4 (US)",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 15,
				output: 75,
				cacheRead: 1.5,
				cacheWrite: 18.75
			},
			contextWindow: 2e5,
			maxTokens: 32e3
		},
		"us.anthropic.claude-opus-4-5-20251101-v1:0": {
			id: "us.anthropic.claude-opus-4-5-20251101-v1:0",
			name: "Claude Opus 4.5 (US)",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 5,
				output: 25,
				cacheRead: .5,
				cacheWrite: 6.25
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"us.anthropic.claude-opus-4-6-v1": {
			id: "us.anthropic.claude-opus-4-6-v1",
			name: "Claude Opus 4.6 (US)",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 5,
				output: 25,
				cacheRead: .5,
				cacheWrite: 6.25
			},
			contextWindow: 1e6,
			maxTokens: 128e3
		},
		"us.anthropic.claude-sonnet-4-20250514-v1:0": {
			id: "us.anthropic.claude-sonnet-4-20250514-v1:0",
			name: "Claude Sonnet 4 (US)",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"us.anthropic.claude-sonnet-4-5-20250929-v1:0": {
			id: "us.anthropic.claude-sonnet-4-5-20250929-v1:0",
			name: "Claude Sonnet 4.5 (US)",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"us.anthropic.claude-sonnet-4-6": {
			id: "us.anthropic.claude-sonnet-4-6",
			name: "Claude Sonnet 4.6 (US)",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 1e6,
			maxTokens: 64e3
		},
		"writer.palmyra-x4-v1:0": {
			id: "writer.palmyra-x4-v1:0",
			name: "Palmyra X4",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 2.5,
				output: 10,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 122880,
			maxTokens: 8192
		},
		"writer.palmyra-x5-v1:0": {
			id: "writer.palmyra-x5-v1:0",
			name: "Palmyra X5",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .6,
				output: 6,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 104e4,
			maxTokens: 8192
		},
		"zai.glm-4.7": {
			id: "zai.glm-4.7",
			name: "GLM-4.7",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .6,
				output: 2.2,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 204800,
			maxTokens: 131072
		},
		"zai.glm-4.7-flash": {
			id: "zai.glm-4.7-flash",
			name: "GLM-4.7-Flash",
			api: "bedrock-converse-stream",
			provider: "amazon-bedrock",
			baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .07,
				output: .4,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 131072
		}
	},
	anthropic: {
		"claude-3-5-haiku-20241022": {
			id: "claude-3-5-haiku-20241022",
			name: "Claude Haiku 3.5",
			api: "anthropic-messages",
			provider: "anthropic",
			baseUrl: "https://api.anthropic.com",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .8,
				output: 4,
				cacheRead: .08,
				cacheWrite: 1
			},
			contextWindow: 2e5,
			maxTokens: 8192
		},
		"claude-3-5-haiku-latest": {
			id: "claude-3-5-haiku-latest",
			name: "Claude Haiku 3.5 (latest)",
			api: "anthropic-messages",
			provider: "anthropic",
			baseUrl: "https://api.anthropic.com",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .8,
				output: 4,
				cacheRead: .08,
				cacheWrite: 1
			},
			contextWindow: 2e5,
			maxTokens: 8192
		},
		"claude-3-5-sonnet-20240620": {
			id: "claude-3-5-sonnet-20240620",
			name: "Claude Sonnet 3.5",
			api: "anthropic-messages",
			provider: "anthropic",
			baseUrl: "https://api.anthropic.com",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 2e5,
			maxTokens: 8192
		},
		"claude-3-5-sonnet-20241022": {
			id: "claude-3-5-sonnet-20241022",
			name: "Claude Sonnet 3.5 v2",
			api: "anthropic-messages",
			provider: "anthropic",
			baseUrl: "https://api.anthropic.com",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 2e5,
			maxTokens: 8192
		},
		"claude-3-7-sonnet-20250219": {
			id: "claude-3-7-sonnet-20250219",
			name: "Claude Sonnet 3.7",
			api: "anthropic-messages",
			provider: "anthropic",
			baseUrl: "https://api.anthropic.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"claude-3-7-sonnet-latest": {
			id: "claude-3-7-sonnet-latest",
			name: "Claude Sonnet 3.7 (latest)",
			api: "anthropic-messages",
			provider: "anthropic",
			baseUrl: "https://api.anthropic.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"claude-3-haiku-20240307": {
			id: "claude-3-haiku-20240307",
			name: "Claude Haiku 3",
			api: "anthropic-messages",
			provider: "anthropic",
			baseUrl: "https://api.anthropic.com",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .25,
				output: 1.25,
				cacheRead: .03,
				cacheWrite: .3
			},
			contextWindow: 2e5,
			maxTokens: 4096
		},
		"claude-3-opus-20240229": {
			id: "claude-3-opus-20240229",
			name: "Claude Opus 3",
			api: "anthropic-messages",
			provider: "anthropic",
			baseUrl: "https://api.anthropic.com",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 15,
				output: 75,
				cacheRead: 1.5,
				cacheWrite: 18.75
			},
			contextWindow: 2e5,
			maxTokens: 4096
		},
		"claude-3-sonnet-20240229": {
			id: "claude-3-sonnet-20240229",
			name: "Claude Sonnet 3",
			api: "anthropic-messages",
			provider: "anthropic",
			baseUrl: "https://api.anthropic.com",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: .3
			},
			contextWindow: 2e5,
			maxTokens: 4096
		},
		"claude-haiku-4-5": {
			id: "claude-haiku-4-5",
			name: "Claude Haiku 4.5 (latest)",
			api: "anthropic-messages",
			provider: "anthropic",
			baseUrl: "https://api.anthropic.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1,
				output: 5,
				cacheRead: .1,
				cacheWrite: 1.25
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"claude-haiku-4-5-20251001": {
			id: "claude-haiku-4-5-20251001",
			name: "Claude Haiku 4.5",
			api: "anthropic-messages",
			provider: "anthropic",
			baseUrl: "https://api.anthropic.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1,
				output: 5,
				cacheRead: .1,
				cacheWrite: 1.25
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"claude-opus-4-0": {
			id: "claude-opus-4-0",
			name: "Claude Opus 4 (latest)",
			api: "anthropic-messages",
			provider: "anthropic",
			baseUrl: "https://api.anthropic.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 15,
				output: 75,
				cacheRead: 1.5,
				cacheWrite: 18.75
			},
			contextWindow: 2e5,
			maxTokens: 32e3
		},
		"claude-opus-4-1": {
			id: "claude-opus-4-1",
			name: "Claude Opus 4.1 (latest)",
			api: "anthropic-messages",
			provider: "anthropic",
			baseUrl: "https://api.anthropic.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 15,
				output: 75,
				cacheRead: 1.5,
				cacheWrite: 18.75
			},
			contextWindow: 2e5,
			maxTokens: 32e3
		},
		"claude-opus-4-1-20250805": {
			id: "claude-opus-4-1-20250805",
			name: "Claude Opus 4.1",
			api: "anthropic-messages",
			provider: "anthropic",
			baseUrl: "https://api.anthropic.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 15,
				output: 75,
				cacheRead: 1.5,
				cacheWrite: 18.75
			},
			contextWindow: 2e5,
			maxTokens: 32e3
		},
		"claude-opus-4-20250514": {
			id: "claude-opus-4-20250514",
			name: "Claude Opus 4",
			api: "anthropic-messages",
			provider: "anthropic",
			baseUrl: "https://api.anthropic.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 15,
				output: 75,
				cacheRead: 1.5,
				cacheWrite: 18.75
			},
			contextWindow: 2e5,
			maxTokens: 32e3
		},
		"claude-opus-4-5": {
			id: "claude-opus-4-5",
			name: "Claude Opus 4.5 (latest)",
			api: "anthropic-messages",
			provider: "anthropic",
			baseUrl: "https://api.anthropic.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 5,
				output: 25,
				cacheRead: .5,
				cacheWrite: 6.25
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"claude-opus-4-5-20251101": {
			id: "claude-opus-4-5-20251101",
			name: "Claude Opus 4.5",
			api: "anthropic-messages",
			provider: "anthropic",
			baseUrl: "https://api.anthropic.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 5,
				output: 25,
				cacheRead: .5,
				cacheWrite: 6.25
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"claude-opus-4-6": {
			id: "claude-opus-4-6",
			name: "Claude Opus 4.6",
			api: "anthropic-messages",
			provider: "anthropic",
			baseUrl: "https://api.anthropic.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 5,
				output: 25,
				cacheRead: .5,
				cacheWrite: 6.25
			},
			contextWindow: 1e6,
			maxTokens: 128e3
		},
		"claude-sonnet-4-0": {
			id: "claude-sonnet-4-0",
			name: "Claude Sonnet 4 (latest)",
			api: "anthropic-messages",
			provider: "anthropic",
			baseUrl: "https://api.anthropic.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"claude-sonnet-4-20250514": {
			id: "claude-sonnet-4-20250514",
			name: "Claude Sonnet 4",
			api: "anthropic-messages",
			provider: "anthropic",
			baseUrl: "https://api.anthropic.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"claude-sonnet-4-5": {
			id: "claude-sonnet-4-5",
			name: "Claude Sonnet 4.5 (latest)",
			api: "anthropic-messages",
			provider: "anthropic",
			baseUrl: "https://api.anthropic.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"claude-sonnet-4-5-20250929": {
			id: "claude-sonnet-4-5-20250929",
			name: "Claude Sonnet 4.5",
			api: "anthropic-messages",
			provider: "anthropic",
			baseUrl: "https://api.anthropic.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"claude-sonnet-4-6": {
			id: "claude-sonnet-4-6",
			name: "Claude Sonnet 4.6",
			api: "anthropic-messages",
			provider: "anthropic",
			baseUrl: "https://api.anthropic.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 1e6,
			maxTokens: 64e3
		}
	},
	"azure-openai-responses": {
		"codex-mini-latest": {
			id: "codex-mini-latest",
			name: "Codex Mini",
			api: "azure-openai-responses",
			provider: "azure-openai-responses",
			baseUrl: "",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 1.5,
				output: 6,
				cacheRead: .375,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 1e5
		},
		"gpt-4": {
			id: "gpt-4",
			name: "GPT-4",
			api: "azure-openai-responses",
			provider: "azure-openai-responses",
			baseUrl: "",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 30,
				output: 60,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 8192,
			maxTokens: 8192
		},
		"gpt-4-turbo": {
			id: "gpt-4-turbo",
			name: "GPT-4 Turbo",
			api: "azure-openai-responses",
			provider: "azure-openai-responses",
			baseUrl: "",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 10,
				output: 30,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4096
		},
		"gpt-4.1": {
			id: "gpt-4.1",
			name: "GPT-4.1",
			api: "azure-openai-responses",
			provider: "azure-openai-responses",
			baseUrl: "",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 2,
				output: 8,
				cacheRead: .5,
				cacheWrite: 0
			},
			contextWindow: 1047576,
			maxTokens: 32768
		},
		"gpt-4.1-mini": {
			id: "gpt-4.1-mini",
			name: "GPT-4.1 mini",
			api: "azure-openai-responses",
			provider: "azure-openai-responses",
			baseUrl: "",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .4,
				output: 1.6,
				cacheRead: .1,
				cacheWrite: 0
			},
			contextWindow: 1047576,
			maxTokens: 32768
		},
		"gpt-4.1-nano": {
			id: "gpt-4.1-nano",
			name: "GPT-4.1 nano",
			api: "azure-openai-responses",
			provider: "azure-openai-responses",
			baseUrl: "",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .1,
				output: .4,
				cacheRead: .03,
				cacheWrite: 0
			},
			contextWindow: 1047576,
			maxTokens: 32768
		},
		"gpt-4o": {
			id: "gpt-4o",
			name: "GPT-4o",
			api: "azure-openai-responses",
			provider: "azure-openai-responses",
			baseUrl: "",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 2.5,
				output: 10,
				cacheRead: 1.25,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 16384
		},
		"gpt-4o-2024-05-13": {
			id: "gpt-4o-2024-05-13",
			name: "GPT-4o (2024-05-13)",
			api: "azure-openai-responses",
			provider: "azure-openai-responses",
			baseUrl: "",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 5,
				output: 15,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4096
		},
		"gpt-4o-2024-08-06": {
			id: "gpt-4o-2024-08-06",
			name: "GPT-4o (2024-08-06)",
			api: "azure-openai-responses",
			provider: "azure-openai-responses",
			baseUrl: "",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 2.5,
				output: 10,
				cacheRead: 1.25,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 16384
		},
		"gpt-4o-2024-11-20": {
			id: "gpt-4o-2024-11-20",
			name: "GPT-4o (2024-11-20)",
			api: "azure-openai-responses",
			provider: "azure-openai-responses",
			baseUrl: "",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 2.5,
				output: 10,
				cacheRead: 1.25,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 16384
		},
		"gpt-4o-mini": {
			id: "gpt-4o-mini",
			name: "GPT-4o mini",
			api: "azure-openai-responses",
			provider: "azure-openai-responses",
			baseUrl: "",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .15,
				output: .6,
				cacheRead: .08,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 16384
		},
		"gpt-5": {
			id: "gpt-5",
			name: "GPT-5",
			api: "azure-openai-responses",
			provider: "azure-openai-responses",
			baseUrl: "",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.25,
				output: 10,
				cacheRead: .125,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5-chat-latest": {
			id: "gpt-5-chat-latest",
			name: "GPT-5 Chat Latest",
			api: "azure-openai-responses",
			provider: "azure-openai-responses",
			baseUrl: "",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 1.25,
				output: 10,
				cacheRead: .125,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 16384
		},
		"gpt-5-codex": {
			id: "gpt-5-codex",
			name: "GPT-5-Codex",
			api: "azure-openai-responses",
			provider: "azure-openai-responses",
			baseUrl: "",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.25,
				output: 10,
				cacheRead: .125,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5-mini": {
			id: "gpt-5-mini",
			name: "GPT-5 Mini",
			api: "azure-openai-responses",
			provider: "azure-openai-responses",
			baseUrl: "",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .25,
				output: 2,
				cacheRead: .025,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5-nano": {
			id: "gpt-5-nano",
			name: "GPT-5 Nano",
			api: "azure-openai-responses",
			provider: "azure-openai-responses",
			baseUrl: "",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .05,
				output: .4,
				cacheRead: .005,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5-pro": {
			id: "gpt-5-pro",
			name: "GPT-5 Pro",
			api: "azure-openai-responses",
			provider: "azure-openai-responses",
			baseUrl: "",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 15,
				output: 120,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 272e3
		},
		"gpt-5.1": {
			id: "gpt-5.1",
			name: "GPT-5.1",
			api: "azure-openai-responses",
			provider: "azure-openai-responses",
			baseUrl: "",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.25,
				output: 10,
				cacheRead: .13,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5.1-chat-latest": {
			id: "gpt-5.1-chat-latest",
			name: "GPT-5.1 Chat",
			api: "azure-openai-responses",
			provider: "azure-openai-responses",
			baseUrl: "",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.25,
				output: 10,
				cacheRead: .125,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 16384
		},
		"gpt-5.1-codex": {
			id: "gpt-5.1-codex",
			name: "GPT-5.1 Codex",
			api: "azure-openai-responses",
			provider: "azure-openai-responses",
			baseUrl: "",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.25,
				output: 10,
				cacheRead: .125,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5.1-codex-max": {
			id: "gpt-5.1-codex-max",
			name: "GPT-5.1 Codex Max",
			api: "azure-openai-responses",
			provider: "azure-openai-responses",
			baseUrl: "",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.25,
				output: 10,
				cacheRead: .125,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5.1-codex-mini": {
			id: "gpt-5.1-codex-mini",
			name: "GPT-5.1 Codex mini",
			api: "azure-openai-responses",
			provider: "azure-openai-responses",
			baseUrl: "",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .25,
				output: 2,
				cacheRead: .025,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5.2": {
			id: "gpt-5.2",
			name: "GPT-5.2",
			api: "azure-openai-responses",
			provider: "azure-openai-responses",
			baseUrl: "",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.75,
				output: 14,
				cacheRead: .175,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5.2-chat-latest": {
			id: "gpt-5.2-chat-latest",
			name: "GPT-5.2 Chat",
			api: "azure-openai-responses",
			provider: "azure-openai-responses",
			baseUrl: "",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.75,
				output: 14,
				cacheRead: .175,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 16384
		},
		"gpt-5.2-codex": {
			id: "gpt-5.2-codex",
			name: "GPT-5.2 Codex",
			api: "azure-openai-responses",
			provider: "azure-openai-responses",
			baseUrl: "",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.75,
				output: 14,
				cacheRead: .175,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5.2-pro": {
			id: "gpt-5.2-pro",
			name: "GPT-5.2 Pro",
			api: "azure-openai-responses",
			provider: "azure-openai-responses",
			baseUrl: "",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 21,
				output: 168,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5.3-codex": {
			id: "gpt-5.3-codex",
			name: "GPT-5.3 Codex",
			api: "azure-openai-responses",
			provider: "azure-openai-responses",
			baseUrl: "",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.75,
				output: 14,
				cacheRead: .175,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5.3-codex-spark": {
			id: "gpt-5.3-codex-spark",
			name: "GPT-5.3 Codex Spark",
			api: "azure-openai-responses",
			provider: "azure-openai-responses",
			baseUrl: "",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.75,
				output: 14,
				cacheRead: .175,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 32e3
		},
		"gpt-5.4": {
			id: "gpt-5.4",
			name: "GPT-5.4",
			api: "azure-openai-responses",
			provider: "azure-openai-responses",
			baseUrl: "",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 2.5,
				output: 15,
				cacheRead: .25,
				cacheWrite: 0
			},
			contextWindow: 272e3,
			maxTokens: 128e3
		},
		"gpt-5.4-mini": {
			id: "gpt-5.4-mini",
			name: "GPT-5.4 mini",
			api: "azure-openai-responses",
			provider: "azure-openai-responses",
			baseUrl: "",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .75,
				output: 4.5,
				cacheRead: .075,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5.4-nano": {
			id: "gpt-5.4-nano",
			name: "GPT-5.4 nano",
			api: "azure-openai-responses",
			provider: "azure-openai-responses",
			baseUrl: "",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .2,
				output: 1.25,
				cacheRead: .02,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5.4-pro": {
			id: "gpt-5.4-pro",
			name: "GPT-5.4 Pro",
			api: "azure-openai-responses",
			provider: "azure-openai-responses",
			baseUrl: "",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 30,
				output: 180,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 105e4,
			maxTokens: 128e3
		},
		o1: {
			id: "o1",
			name: "o1",
			api: "azure-openai-responses",
			provider: "azure-openai-responses",
			baseUrl: "",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 15,
				output: 60,
				cacheRead: 7.5,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 1e5
		},
		"o1-pro": {
			id: "o1-pro",
			name: "o1-pro",
			api: "azure-openai-responses",
			provider: "azure-openai-responses",
			baseUrl: "",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 150,
				output: 600,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 1e5
		},
		o3: {
			id: "o3",
			name: "o3",
			api: "azure-openai-responses",
			provider: "azure-openai-responses",
			baseUrl: "",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 2,
				output: 8,
				cacheRead: .5,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 1e5
		},
		"o3-deep-research": {
			id: "o3-deep-research",
			name: "o3-deep-research",
			api: "azure-openai-responses",
			provider: "azure-openai-responses",
			baseUrl: "",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 10,
				output: 40,
				cacheRead: 2.5,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 1e5
		},
		"o3-mini": {
			id: "o3-mini",
			name: "o3-mini",
			api: "azure-openai-responses",
			provider: "azure-openai-responses",
			baseUrl: "",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 1.1,
				output: 4.4,
				cacheRead: .55,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 1e5
		},
		"o3-pro": {
			id: "o3-pro",
			name: "o3-pro",
			api: "azure-openai-responses",
			provider: "azure-openai-responses",
			baseUrl: "",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 20,
				output: 80,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 1e5
		},
		"o4-mini": {
			id: "o4-mini",
			name: "o4-mini",
			api: "azure-openai-responses",
			provider: "azure-openai-responses",
			baseUrl: "",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.1,
				output: 4.4,
				cacheRead: .28,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 1e5
		},
		"o4-mini-deep-research": {
			id: "o4-mini-deep-research",
			name: "o4-mini-deep-research",
			api: "azure-openai-responses",
			provider: "azure-openai-responses",
			baseUrl: "",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 2,
				output: 8,
				cacheRead: .5,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 1e5
		}
	},
	cerebras: {
		"gpt-oss-120b": {
			id: "gpt-oss-120b",
			name: "GPT OSS 120B",
			api: "openai-completions",
			provider: "cerebras",
			baseUrl: "https://api.cerebras.ai/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .25,
				output: .69,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 32768
		},
		"llama3.1-8b": {
			id: "llama3.1-8b",
			name: "Llama 3.1 8B",
			api: "openai-completions",
			provider: "cerebras",
			baseUrl: "https://api.cerebras.ai/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .1,
				output: .1,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 32e3,
			maxTokens: 8e3
		},
		"qwen-3-235b-a22b-instruct-2507": {
			id: "qwen-3-235b-a22b-instruct-2507",
			name: "Qwen 3 235B Instruct",
			api: "openai-completions",
			provider: "cerebras",
			baseUrl: "https://api.cerebras.ai/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .6,
				output: 1.2,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131e3,
			maxTokens: 32e3
		},
		"zai-glm-4.7": {
			id: "zai-glm-4.7",
			name: "Z.AI GLM-4.7",
			api: "openai-completions",
			provider: "cerebras",
			baseUrl: "https://api.cerebras.ai/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 2.25,
				output: 2.75,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 4e4
		}
	},
	"github-copilot": {
		"claude-haiku-4.5": {
			id: "claude-haiku-4.5",
			name: "Claude Haiku 4.5",
			api: "anthropic-messages",
			provider: "github-copilot",
			baseUrl: "https://api.individual.githubcopilot.com",
			headers: {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 32e3
		},
		"claude-opus-4.5": {
			id: "claude-opus-4.5",
			name: "Claude Opus 4.5",
			api: "anthropic-messages",
			provider: "github-copilot",
			baseUrl: "https://api.individual.githubcopilot.com",
			headers: {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 32e3
		},
		"claude-opus-4.6": {
			id: "claude-opus-4.6",
			name: "Claude Opus 4.6",
			api: "anthropic-messages",
			provider: "github-copilot",
			baseUrl: "https://api.individual.githubcopilot.com",
			headers: {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 1e6,
			maxTokens: 64e3
		},
		"claude-sonnet-4": {
			id: "claude-sonnet-4",
			name: "Claude Sonnet 4",
			api: "anthropic-messages",
			provider: "github-copilot",
			baseUrl: "https://api.individual.githubcopilot.com",
			headers: {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 16e3
		},
		"claude-sonnet-4.5": {
			id: "claude-sonnet-4.5",
			name: "Claude Sonnet 4.5",
			api: "anthropic-messages",
			provider: "github-copilot",
			baseUrl: "https://api.individual.githubcopilot.com",
			headers: {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 32e3
		},
		"claude-sonnet-4.6": {
			id: "claude-sonnet-4.6",
			name: "Claude Sonnet 4.6",
			api: "anthropic-messages",
			provider: "github-copilot",
			baseUrl: "https://api.individual.githubcopilot.com",
			headers: {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 1e6,
			maxTokens: 32e3
		},
		"gemini-2.5-pro": {
			id: "gemini-2.5-pro",
			name: "Gemini 2.5 Pro",
			api: "openai-completions",
			provider: "github-copilot",
			baseUrl: "https://api.individual.githubcopilot.com",
			headers: {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			compat: {
				supportsStore: !1,
				supportsDeveloperRole: !1,
				supportsReasoningEffort: !1
			},
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 64e3
		},
		"gemini-3-flash-preview": {
			id: "gemini-3-flash-preview",
			name: "Gemini 3 Flash",
			api: "openai-completions",
			provider: "github-copilot",
			baseUrl: "https://api.individual.githubcopilot.com",
			headers: {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			compat: {
				supportsStore: !1,
				supportsDeveloperRole: !1,
				supportsReasoningEffort: !1
			},
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 64e3
		},
		"gemini-3-pro-preview": {
			id: "gemini-3-pro-preview",
			name: "Gemini 3 Pro Preview",
			api: "openai-completions",
			provider: "github-copilot",
			baseUrl: "https://api.individual.githubcopilot.com",
			headers: {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			compat: {
				supportsStore: !1,
				supportsDeveloperRole: !1,
				supportsReasoningEffort: !1
			},
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 64e3
		},
		"gemini-3.1-pro-preview": {
			id: "gemini-3.1-pro-preview",
			name: "Gemini 3.1 Pro Preview",
			api: "openai-completions",
			provider: "github-copilot",
			baseUrl: "https://api.individual.githubcopilot.com",
			headers: {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			compat: {
				supportsStore: !1,
				supportsDeveloperRole: !1,
				supportsReasoningEffort: !1
			},
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 64e3
		},
		"gpt-4.1": {
			id: "gpt-4.1",
			name: "GPT-4.1",
			api: "openai-completions",
			provider: "github-copilot",
			baseUrl: "https://api.individual.githubcopilot.com",
			headers: {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			compat: {
				supportsStore: !1,
				supportsDeveloperRole: !1,
				supportsReasoningEffort: !1
			},
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 64e3,
			maxTokens: 16384
		},
		"gpt-4o": {
			id: "gpt-4o",
			name: "GPT-4o",
			api: "openai-completions",
			provider: "github-copilot",
			baseUrl: "https://api.individual.githubcopilot.com",
			headers: {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			compat: {
				supportsStore: !1,
				supportsDeveloperRole: !1,
				supportsReasoningEffort: !1
			},
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 64e3,
			maxTokens: 16384
		},
		"gpt-5": {
			id: "gpt-5",
			name: "GPT-5",
			api: "openai-responses",
			provider: "github-copilot",
			baseUrl: "https://api.individual.githubcopilot.com",
			headers: {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 128e3
		},
		"gpt-5-mini": {
			id: "gpt-5-mini",
			name: "GPT-5-mini",
			api: "openai-responses",
			provider: "github-copilot",
			baseUrl: "https://api.individual.githubcopilot.com",
			headers: {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 64e3
		},
		"gpt-5.1": {
			id: "gpt-5.1",
			name: "GPT-5.1",
			api: "openai-responses",
			provider: "github-copilot",
			baseUrl: "https://api.individual.githubcopilot.com",
			headers: {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 64e3
		},
		"gpt-5.1-codex": {
			id: "gpt-5.1-codex",
			name: "GPT-5.1-Codex",
			api: "openai-responses",
			provider: "github-copilot",
			baseUrl: "https://api.individual.githubcopilot.com",
			headers: {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 128e3
		},
		"gpt-5.1-codex-max": {
			id: "gpt-5.1-codex-max",
			name: "GPT-5.1-Codex-max",
			api: "openai-responses",
			provider: "github-copilot",
			baseUrl: "https://api.individual.githubcopilot.com",
			headers: {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 128e3
		},
		"gpt-5.1-codex-mini": {
			id: "gpt-5.1-codex-mini",
			name: "GPT-5.1-Codex-mini",
			api: "openai-responses",
			provider: "github-copilot",
			baseUrl: "https://api.individual.githubcopilot.com",
			headers: {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 128e3
		},
		"gpt-5.2": {
			id: "gpt-5.2",
			name: "GPT-5.2",
			api: "openai-responses",
			provider: "github-copilot",
			baseUrl: "https://api.individual.githubcopilot.com",
			headers: {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 264e3,
			maxTokens: 64e3
		},
		"gpt-5.2-codex": {
			id: "gpt-5.2-codex",
			name: "GPT-5.2-Codex",
			api: "openai-responses",
			provider: "github-copilot",
			baseUrl: "https://api.individual.githubcopilot.com",
			headers: {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5.3-codex": {
			id: "gpt-5.3-codex",
			name: "GPT-5.3-Codex",
			api: "openai-responses",
			provider: "github-copilot",
			baseUrl: "https://api.individual.githubcopilot.com",
			headers: {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5.4": {
			id: "gpt-5.4",
			name: "GPT-5.4",
			api: "openai-responses",
			provider: "github-copilot",
			baseUrl: "https://api.individual.githubcopilot.com",
			headers: {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5.4-mini": {
			id: "gpt-5.4-mini",
			name: "GPT-5.4 mini",
			api: "openai-responses",
			provider: "github-copilot",
			baseUrl: "https://api.individual.githubcopilot.com",
			headers: {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"grok-code-fast-1": {
			id: "grok-code-fast-1",
			name: "Grok Code Fast 1",
			api: "openai-completions",
			provider: "github-copilot",
			baseUrl: "https://api.individual.githubcopilot.com",
			headers: {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			compat: {
				supportsStore: !1,
				supportsDeveloperRole: !1,
				supportsReasoningEffort: !1
			},
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 64e3
		}
	},
	google: {
		"gemini-1.5-flash": {
			id: "gemini-1.5-flash",
			name: "Gemini 1.5 Flash",
			api: "google-generative-ai",
			provider: "google",
			baseUrl: "https://generativelanguage.googleapis.com/v1beta",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .075,
				output: .3,
				cacheRead: .01875,
				cacheWrite: 0
			},
			contextWindow: 1e6,
			maxTokens: 8192
		},
		"gemini-1.5-flash-8b": {
			id: "gemini-1.5-flash-8b",
			name: "Gemini 1.5 Flash-8B",
			api: "google-generative-ai",
			provider: "google",
			baseUrl: "https://generativelanguage.googleapis.com/v1beta",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .0375,
				output: .15,
				cacheRead: .01,
				cacheWrite: 0
			},
			contextWindow: 1e6,
			maxTokens: 8192
		},
		"gemini-1.5-pro": {
			id: "gemini-1.5-pro",
			name: "Gemini 1.5 Pro",
			api: "google-generative-ai",
			provider: "google",
			baseUrl: "https://generativelanguage.googleapis.com/v1beta",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 1.25,
				output: 5,
				cacheRead: .3125,
				cacheWrite: 0
			},
			contextWindow: 1e6,
			maxTokens: 8192
		},
		"gemini-2.0-flash": {
			id: "gemini-2.0-flash",
			name: "Gemini 2.0 Flash",
			api: "google-generative-ai",
			provider: "google",
			baseUrl: "https://generativelanguage.googleapis.com/v1beta",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .1,
				output: .4,
				cacheRead: .025,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 8192
		},
		"gemini-2.0-flash-lite": {
			id: "gemini-2.0-flash-lite",
			name: "Gemini 2.0 Flash Lite",
			api: "google-generative-ai",
			provider: "google",
			baseUrl: "https://generativelanguage.googleapis.com/v1beta",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .075,
				output: .3,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 8192
		},
		"gemini-2.5-flash": {
			id: "gemini-2.5-flash",
			name: "Gemini 2.5 Flash",
			api: "google-generative-ai",
			provider: "google",
			baseUrl: "https://generativelanguage.googleapis.com/v1beta",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .3,
				output: 2.5,
				cacheRead: .075,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 65536
		},
		"gemini-2.5-flash-lite": {
			id: "gemini-2.5-flash-lite",
			name: "Gemini 2.5 Flash Lite",
			api: "google-generative-ai",
			provider: "google",
			baseUrl: "https://generativelanguage.googleapis.com/v1beta",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .1,
				output: .4,
				cacheRead: .025,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 65536
		},
		"gemini-2.5-flash-lite-preview-06-17": {
			id: "gemini-2.5-flash-lite-preview-06-17",
			name: "Gemini 2.5 Flash Lite Preview 06-17",
			api: "google-generative-ai",
			provider: "google",
			baseUrl: "https://generativelanguage.googleapis.com/v1beta",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .1,
				output: .4,
				cacheRead: .025,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 65536
		},
		"gemini-2.5-flash-lite-preview-09-2025": {
			id: "gemini-2.5-flash-lite-preview-09-2025",
			name: "Gemini 2.5 Flash Lite Preview 09-25",
			api: "google-generative-ai",
			provider: "google",
			baseUrl: "https://generativelanguage.googleapis.com/v1beta",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .1,
				output: .4,
				cacheRead: .025,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 65536
		},
		"gemini-2.5-flash-preview-04-17": {
			id: "gemini-2.5-flash-preview-04-17",
			name: "Gemini 2.5 Flash Preview 04-17",
			api: "google-generative-ai",
			provider: "google",
			baseUrl: "https://generativelanguage.googleapis.com/v1beta",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .15,
				output: .6,
				cacheRead: .0375,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 65536
		},
		"gemini-2.5-flash-preview-05-20": {
			id: "gemini-2.5-flash-preview-05-20",
			name: "Gemini 2.5 Flash Preview 05-20",
			api: "google-generative-ai",
			provider: "google",
			baseUrl: "https://generativelanguage.googleapis.com/v1beta",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .15,
				output: .6,
				cacheRead: .0375,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 65536
		},
		"gemini-2.5-flash-preview-09-2025": {
			id: "gemini-2.5-flash-preview-09-2025",
			name: "Gemini 2.5 Flash Preview 09-25",
			api: "google-generative-ai",
			provider: "google",
			baseUrl: "https://generativelanguage.googleapis.com/v1beta",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .3,
				output: 2.5,
				cacheRead: .075,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 65536
		},
		"gemini-2.5-pro": {
			id: "gemini-2.5-pro",
			name: "Gemini 2.5 Pro",
			api: "google-generative-ai",
			provider: "google",
			baseUrl: "https://generativelanguage.googleapis.com/v1beta",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.25,
				output: 10,
				cacheRead: .31,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 65536
		},
		"gemini-2.5-pro-preview-05-06": {
			id: "gemini-2.5-pro-preview-05-06",
			name: "Gemini 2.5 Pro Preview 05-06",
			api: "google-generative-ai",
			provider: "google",
			baseUrl: "https://generativelanguage.googleapis.com/v1beta",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.25,
				output: 10,
				cacheRead: .31,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 65536
		},
		"gemini-2.5-pro-preview-06-05": {
			id: "gemini-2.5-pro-preview-06-05",
			name: "Gemini 2.5 Pro Preview 06-05",
			api: "google-generative-ai",
			provider: "google",
			baseUrl: "https://generativelanguage.googleapis.com/v1beta",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.25,
				output: 10,
				cacheRead: .31,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 65536
		},
		"gemini-3-flash-preview": {
			id: "gemini-3-flash-preview",
			name: "Gemini 3 Flash Preview",
			api: "google-generative-ai",
			provider: "google",
			baseUrl: "https://generativelanguage.googleapis.com/v1beta",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .5,
				output: 3,
				cacheRead: .05,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 65536
		},
		"gemini-3-pro-preview": {
			id: "gemini-3-pro-preview",
			name: "Gemini 3 Pro Preview",
			api: "google-generative-ai",
			provider: "google",
			baseUrl: "https://generativelanguage.googleapis.com/v1beta",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 2,
				output: 12,
				cacheRead: .2,
				cacheWrite: 0
			},
			contextWindow: 1e6,
			maxTokens: 64e3
		},
		"gemini-3.1-flash-lite-preview": {
			id: "gemini-3.1-flash-lite-preview",
			name: "Gemini 3.1 Flash Lite Preview",
			api: "google-generative-ai",
			provider: "google",
			baseUrl: "https://generativelanguage.googleapis.com/v1beta",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .25,
				output: 1.5,
				cacheRead: .025,
				cacheWrite: 1
			},
			contextWindow: 1048576,
			maxTokens: 65536
		},
		"gemini-3.1-pro-preview": {
			id: "gemini-3.1-pro-preview",
			name: "Gemini 3.1 Pro Preview",
			api: "google-generative-ai",
			provider: "google",
			baseUrl: "https://generativelanguage.googleapis.com/v1beta",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 2,
				output: 12,
				cacheRead: .2,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 65536
		},
		"gemini-3.1-pro-preview-customtools": {
			id: "gemini-3.1-pro-preview-customtools",
			name: "Gemini 3.1 Pro Preview Custom Tools",
			api: "google-generative-ai",
			provider: "google",
			baseUrl: "https://generativelanguage.googleapis.com/v1beta",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 2,
				output: 12,
				cacheRead: .2,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 65536
		},
		"gemini-flash-latest": {
			id: "gemini-flash-latest",
			name: "Gemini Flash Latest",
			api: "google-generative-ai",
			provider: "google",
			baseUrl: "https://generativelanguage.googleapis.com/v1beta",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .3,
				output: 2.5,
				cacheRead: .075,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 65536
		},
		"gemini-flash-lite-latest": {
			id: "gemini-flash-lite-latest",
			name: "Gemini Flash-Lite Latest",
			api: "google-generative-ai",
			provider: "google",
			baseUrl: "https://generativelanguage.googleapis.com/v1beta",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .1,
				output: .4,
				cacheRead: .025,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 65536
		},
		"gemini-live-2.5-flash": {
			id: "gemini-live-2.5-flash",
			name: "Gemini Live 2.5 Flash",
			api: "google-generative-ai",
			provider: "google",
			baseUrl: "https://generativelanguage.googleapis.com/v1beta",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .5,
				output: 2,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 8e3
		},
		"gemini-live-2.5-flash-preview-native-audio": {
			id: "gemini-live-2.5-flash-preview-native-audio",
			name: "Gemini Live 2.5 Flash Preview Native Audio",
			api: "google-generative-ai",
			provider: "google",
			baseUrl: "https://generativelanguage.googleapis.com/v1beta",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .5,
				output: 2,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 65536
		}
	},
	"google-antigravity": {
		"claude-opus-4-5-thinking": {
			id: "claude-opus-4-5-thinking",
			name: "Claude Opus 4.5 Thinking (Antigravity)",
			api: "google-gemini-cli",
			provider: "google-antigravity",
			baseUrl: "https://daily-cloudcode-pa.sandbox.googleapis.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 5,
				output: 25,
				cacheRead: .5,
				cacheWrite: 6.25
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"claude-opus-4-6-thinking": {
			id: "claude-opus-4-6-thinking",
			name: "Claude Opus 4.6 Thinking (Antigravity)",
			api: "google-gemini-cli",
			provider: "google-antigravity",
			baseUrl: "https://daily-cloudcode-pa.sandbox.googleapis.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 5,
				output: 25,
				cacheRead: .5,
				cacheWrite: 6.25
			},
			contextWindow: 2e5,
			maxTokens: 128e3
		},
		"claude-sonnet-4-5": {
			id: "claude-sonnet-4-5",
			name: "Claude Sonnet 4.5 (Antigravity)",
			api: "google-gemini-cli",
			provider: "google-antigravity",
			baseUrl: "https://daily-cloudcode-pa.sandbox.googleapis.com",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"claude-sonnet-4-5-thinking": {
			id: "claude-sonnet-4-5-thinking",
			name: "Claude Sonnet 4.5 Thinking (Antigravity)",
			api: "google-gemini-cli",
			provider: "google-antigravity",
			baseUrl: "https://daily-cloudcode-pa.sandbox.googleapis.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"claude-sonnet-4-6": {
			id: "claude-sonnet-4-6",
			name: "Claude Sonnet 4.6 (Antigravity)",
			api: "google-gemini-cli",
			provider: "google-antigravity",
			baseUrl: "https://daily-cloudcode-pa.sandbox.googleapis.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"gemini-3-flash": {
			id: "gemini-3-flash",
			name: "Gemini 3 Flash (Antigravity)",
			api: "google-gemini-cli",
			provider: "google-antigravity",
			baseUrl: "https://daily-cloudcode-pa.sandbox.googleapis.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .5,
				output: 3,
				cacheRead: .5,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 65535
		},
		"gemini-3.1-pro-high": {
			id: "gemini-3.1-pro-high",
			name: "Gemini 3.1 Pro High (Antigravity)",
			api: "google-gemini-cli",
			provider: "google-antigravity",
			baseUrl: "https://daily-cloudcode-pa.sandbox.googleapis.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 2,
				output: 12,
				cacheRead: .2,
				cacheWrite: 2.375
			},
			contextWindow: 1048576,
			maxTokens: 65535
		},
		"gemini-3.1-pro-low": {
			id: "gemini-3.1-pro-low",
			name: "Gemini 3.1 Pro Low (Antigravity)",
			api: "google-gemini-cli",
			provider: "google-antigravity",
			baseUrl: "https://daily-cloudcode-pa.sandbox.googleapis.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 2,
				output: 12,
				cacheRead: .2,
				cacheWrite: 2.375
			},
			contextWindow: 1048576,
			maxTokens: 65535
		},
		"gpt-oss-120b-medium": {
			id: "gpt-oss-120b-medium",
			name: "GPT-OSS 120B Medium (Antigravity)",
			api: "google-gemini-cli",
			provider: "google-antigravity",
			baseUrl: "https://daily-cloudcode-pa.sandbox.googleapis.com",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .09,
				output: .36,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 32768
		}
	},
	"google-gemini-cli": {
		"gemini-2.0-flash": {
			id: "gemini-2.0-flash",
			name: "Gemini 2.0 Flash (Cloud Code Assist)",
			api: "google-gemini-cli",
			provider: "google-gemini-cli",
			baseUrl: "https://cloudcode-pa.googleapis.com",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 8192
		},
		"gemini-2.5-flash": {
			id: "gemini-2.5-flash",
			name: "Gemini 2.5 Flash (Cloud Code Assist)",
			api: "google-gemini-cli",
			provider: "google-gemini-cli",
			baseUrl: "https://cloudcode-pa.googleapis.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 65535
		},
		"gemini-2.5-pro": {
			id: "gemini-2.5-pro",
			name: "Gemini 2.5 Pro (Cloud Code Assist)",
			api: "google-gemini-cli",
			provider: "google-gemini-cli",
			baseUrl: "https://cloudcode-pa.googleapis.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 65535
		},
		"gemini-3-flash-preview": {
			id: "gemini-3-flash-preview",
			name: "Gemini 3 Flash Preview (Cloud Code Assist)",
			api: "google-gemini-cli",
			provider: "google-gemini-cli",
			baseUrl: "https://cloudcode-pa.googleapis.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 65535
		},
		"gemini-3-pro-preview": {
			id: "gemini-3-pro-preview",
			name: "Gemini 3 Pro Preview (Cloud Code Assist)",
			api: "google-gemini-cli",
			provider: "google-gemini-cli",
			baseUrl: "https://cloudcode-pa.googleapis.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 65535
		},
		"gemini-3.1-pro-preview": {
			id: "gemini-3.1-pro-preview",
			name: "Gemini 3.1 Pro Preview (Cloud Code Assist)",
			api: "google-gemini-cli",
			provider: "google-gemini-cli",
			baseUrl: "https://cloudcode-pa.googleapis.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 65535
		}
	},
	"google-vertex": {
		"gemini-1.5-flash": {
			id: "gemini-1.5-flash",
			name: "Gemini 1.5 Flash (Vertex)",
			api: "google-vertex",
			provider: "google-vertex",
			baseUrl: "https://{location}-aiplatform.googleapis.com",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .075,
				output: .3,
				cacheRead: .01875,
				cacheWrite: 0
			},
			contextWindow: 1e6,
			maxTokens: 8192
		},
		"gemini-1.5-flash-8b": {
			id: "gemini-1.5-flash-8b",
			name: "Gemini 1.5 Flash-8B (Vertex)",
			api: "google-vertex",
			provider: "google-vertex",
			baseUrl: "https://{location}-aiplatform.googleapis.com",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .0375,
				output: .15,
				cacheRead: .01,
				cacheWrite: 0
			},
			contextWindow: 1e6,
			maxTokens: 8192
		},
		"gemini-1.5-pro": {
			id: "gemini-1.5-pro",
			name: "Gemini 1.5 Pro (Vertex)",
			api: "google-vertex",
			provider: "google-vertex",
			baseUrl: "https://{location}-aiplatform.googleapis.com",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 1.25,
				output: 5,
				cacheRead: .3125,
				cacheWrite: 0
			},
			contextWindow: 1e6,
			maxTokens: 8192
		},
		"gemini-2.0-flash": {
			id: "gemini-2.0-flash",
			name: "Gemini 2.0 Flash (Vertex)",
			api: "google-vertex",
			provider: "google-vertex",
			baseUrl: "https://{location}-aiplatform.googleapis.com",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .15,
				output: .6,
				cacheRead: .0375,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 8192
		},
		"gemini-2.0-flash-lite": {
			id: "gemini-2.0-flash-lite",
			name: "Gemini 2.0 Flash Lite (Vertex)",
			api: "google-vertex",
			provider: "google-vertex",
			baseUrl: "https://{location}-aiplatform.googleapis.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .075,
				output: .3,
				cacheRead: .01875,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 65536
		},
		"gemini-2.5-flash": {
			id: "gemini-2.5-flash",
			name: "Gemini 2.5 Flash (Vertex)",
			api: "google-vertex",
			provider: "google-vertex",
			baseUrl: "https://{location}-aiplatform.googleapis.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .3,
				output: 2.5,
				cacheRead: .03,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 65536
		},
		"gemini-2.5-flash-lite": {
			id: "gemini-2.5-flash-lite",
			name: "Gemini 2.5 Flash Lite (Vertex)",
			api: "google-vertex",
			provider: "google-vertex",
			baseUrl: "https://{location}-aiplatform.googleapis.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .1,
				output: .4,
				cacheRead: .01,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 65536
		},
		"gemini-2.5-flash-lite-preview-09-2025": {
			id: "gemini-2.5-flash-lite-preview-09-2025",
			name: "Gemini 2.5 Flash Lite Preview 09-25 (Vertex)",
			api: "google-vertex",
			provider: "google-vertex",
			baseUrl: "https://{location}-aiplatform.googleapis.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .1,
				output: .4,
				cacheRead: .01,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 65536
		},
		"gemini-2.5-pro": {
			id: "gemini-2.5-pro",
			name: "Gemini 2.5 Pro (Vertex)",
			api: "google-vertex",
			provider: "google-vertex",
			baseUrl: "https://{location}-aiplatform.googleapis.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.25,
				output: 10,
				cacheRead: .125,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 65536
		},
		"gemini-3-flash-preview": {
			id: "gemini-3-flash-preview",
			name: "Gemini 3 Flash Preview (Vertex)",
			api: "google-vertex",
			provider: "google-vertex",
			baseUrl: "https://{location}-aiplatform.googleapis.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .5,
				output: 3,
				cacheRead: .05,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 65536
		},
		"gemini-3-pro-preview": {
			id: "gemini-3-pro-preview",
			name: "Gemini 3 Pro Preview (Vertex)",
			api: "google-vertex",
			provider: "google-vertex",
			baseUrl: "https://{location}-aiplatform.googleapis.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 2,
				output: 12,
				cacheRead: .2,
				cacheWrite: 0
			},
			contextWindow: 1e6,
			maxTokens: 64e3
		},
		"gemini-3.1-pro-preview": {
			id: "gemini-3.1-pro-preview",
			name: "Gemini 3.1 Pro Preview (Vertex)",
			api: "google-vertex",
			provider: "google-vertex",
			baseUrl: "https://{location}-aiplatform.googleapis.com",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 2,
				output: 12,
				cacheRead: .2,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 65536
		}
	},
	groq: {
		"deepseek-r1-distill-llama-70b": {
			id: "deepseek-r1-distill-llama-70b",
			name: "DeepSeek R1 Distill Llama 70B",
			api: "openai-completions",
			provider: "groq",
			baseUrl: "https://api.groq.com/openai/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .75,
				output: .99,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 8192
		},
		"gemma2-9b-it": {
			id: "gemma2-9b-it",
			name: "Gemma 2 9B",
			api: "openai-completions",
			provider: "groq",
			baseUrl: "https://api.groq.com/openai/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .2,
				output: .2,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 8192,
			maxTokens: 8192
		},
		"llama-3.1-8b-instant": {
			id: "llama-3.1-8b-instant",
			name: "Llama 3.1 8B Instant",
			api: "openai-completions",
			provider: "groq",
			baseUrl: "https://api.groq.com/openai/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .05,
				output: .08,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 131072
		},
		"llama-3.3-70b-versatile": {
			id: "llama-3.3-70b-versatile",
			name: "Llama 3.3 70B Versatile",
			api: "openai-completions",
			provider: "groq",
			baseUrl: "https://api.groq.com/openai/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .59,
				output: .79,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 32768
		},
		"llama3-70b-8192": {
			id: "llama3-70b-8192",
			name: "Llama 3 70B",
			api: "openai-completions",
			provider: "groq",
			baseUrl: "https://api.groq.com/openai/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .59,
				output: .79,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 8192,
			maxTokens: 8192
		},
		"llama3-8b-8192": {
			id: "llama3-8b-8192",
			name: "Llama 3 8B",
			api: "openai-completions",
			provider: "groq",
			baseUrl: "https://api.groq.com/openai/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .05,
				output: .08,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 8192,
			maxTokens: 8192
		},
		"meta-llama/llama-4-maverick-17b-128e-instruct": {
			id: "meta-llama/llama-4-maverick-17b-128e-instruct",
			name: "Llama 4 Maverick 17B",
			api: "openai-completions",
			provider: "groq",
			baseUrl: "https://api.groq.com/openai/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .2,
				output: .6,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 8192
		},
		"meta-llama/llama-4-scout-17b-16e-instruct": {
			id: "meta-llama/llama-4-scout-17b-16e-instruct",
			name: "Llama 4 Scout 17B",
			api: "openai-completions",
			provider: "groq",
			baseUrl: "https://api.groq.com/openai/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .11,
				output: .34,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 8192
		},
		"mistral-saba-24b": {
			id: "mistral-saba-24b",
			name: "Mistral Saba 24B",
			api: "openai-completions",
			provider: "groq",
			baseUrl: "https://api.groq.com/openai/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .79,
				output: .79,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 32768,
			maxTokens: 32768
		},
		"moonshotai/kimi-k2-instruct": {
			id: "moonshotai/kimi-k2-instruct",
			name: "Kimi K2 Instruct",
			api: "openai-completions",
			provider: "groq",
			baseUrl: "https://api.groq.com/openai/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 1,
				output: 3,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 16384
		},
		"moonshotai/kimi-k2-instruct-0905": {
			id: "moonshotai/kimi-k2-instruct-0905",
			name: "Kimi K2 Instruct 0905",
			api: "openai-completions",
			provider: "groq",
			baseUrl: "https://api.groq.com/openai/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 1,
				output: 3,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 16384
		},
		"openai/gpt-oss-120b": {
			id: "openai/gpt-oss-120b",
			name: "GPT OSS 120B",
			api: "openai-completions",
			provider: "groq",
			baseUrl: "https://api.groq.com/openai/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .15,
				output: .6,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 65536
		},
		"openai/gpt-oss-20b": {
			id: "openai/gpt-oss-20b",
			name: "GPT OSS 20B",
			api: "openai-completions",
			provider: "groq",
			baseUrl: "https://api.groq.com/openai/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .075,
				output: .3,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 65536
		},
		"qwen-qwq-32b": {
			id: "qwen-qwq-32b",
			name: "Qwen QwQ 32B",
			api: "openai-completions",
			provider: "groq",
			baseUrl: "https://api.groq.com/openai/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .29,
				output: .39,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 16384
		},
		"qwen/qwen3-32b": {
			id: "qwen/qwen3-32b",
			name: "Qwen3 32B",
			api: "openai-completions",
			provider: "groq",
			baseUrl: "https://api.groq.com/openai/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .29,
				output: .59,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 16384
		}
	},
	huggingface: {
		"MiniMaxAI/MiniMax-M2.1": {
			id: "MiniMaxAI/MiniMax-M2.1",
			name: "MiniMax-M2.1",
			api: "openai-completions",
			provider: "huggingface",
			baseUrl: "https://router.huggingface.co/v1",
			compat: { supportsDeveloperRole: !1 },
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .3,
				output: 1.2,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 204800,
			maxTokens: 131072
		},
		"MiniMaxAI/MiniMax-M2.5": {
			id: "MiniMaxAI/MiniMax-M2.5",
			name: "MiniMax-M2.5",
			api: "openai-completions",
			provider: "huggingface",
			baseUrl: "https://router.huggingface.co/v1",
			compat: { supportsDeveloperRole: !1 },
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .3,
				output: 1.2,
				cacheRead: .03,
				cacheWrite: 0
			},
			contextWindow: 204800,
			maxTokens: 131072
		},
		"Qwen/Qwen3-235B-A22B-Thinking-2507": {
			id: "Qwen/Qwen3-235B-A22B-Thinking-2507",
			name: "Qwen3-235B-A22B-Thinking-2507",
			api: "openai-completions",
			provider: "huggingface",
			baseUrl: "https://router.huggingface.co/v1",
			compat: { supportsDeveloperRole: !1 },
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .3,
				output: 3,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 131072
		},
		"Qwen/Qwen3-Coder-480B-A35B-Instruct": {
			id: "Qwen/Qwen3-Coder-480B-A35B-Instruct",
			name: "Qwen3-Coder-480B-A35B-Instruct",
			api: "openai-completions",
			provider: "huggingface",
			baseUrl: "https://router.huggingface.co/v1",
			compat: { supportsDeveloperRole: !1 },
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 2,
				output: 2,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 66536
		},
		"Qwen/Qwen3-Coder-Next": {
			id: "Qwen/Qwen3-Coder-Next",
			name: "Qwen3-Coder-Next",
			api: "openai-completions",
			provider: "huggingface",
			baseUrl: "https://router.huggingface.co/v1",
			compat: { supportsDeveloperRole: !1 },
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .2,
				output: 1.5,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 65536
		},
		"Qwen/Qwen3-Next-80B-A3B-Instruct": {
			id: "Qwen/Qwen3-Next-80B-A3B-Instruct",
			name: "Qwen3-Next-80B-A3B-Instruct",
			api: "openai-completions",
			provider: "huggingface",
			baseUrl: "https://router.huggingface.co/v1",
			compat: { supportsDeveloperRole: !1 },
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .25,
				output: 1,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 66536
		},
		"Qwen/Qwen3-Next-80B-A3B-Thinking": {
			id: "Qwen/Qwen3-Next-80B-A3B-Thinking",
			name: "Qwen3-Next-80B-A3B-Thinking",
			api: "openai-completions",
			provider: "huggingface",
			baseUrl: "https://router.huggingface.co/v1",
			compat: { supportsDeveloperRole: !1 },
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .3,
				output: 2,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 131072
		},
		"Qwen/Qwen3.5-397B-A17B": {
			id: "Qwen/Qwen3.5-397B-A17B",
			name: "Qwen3.5-397B-A17B",
			api: "openai-completions",
			provider: "huggingface",
			baseUrl: "https://router.huggingface.co/v1",
			compat: { supportsDeveloperRole: !1 },
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .6,
				output: 3.6,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 32768
		},
		"XiaomiMiMo/MiMo-V2-Flash": {
			id: "XiaomiMiMo/MiMo-V2-Flash",
			name: "MiMo-V2-Flash",
			api: "openai-completions",
			provider: "huggingface",
			baseUrl: "https://router.huggingface.co/v1",
			compat: { supportsDeveloperRole: !1 },
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .1,
				output: .3,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 4096
		},
		"deepseek-ai/DeepSeek-R1-0528": {
			id: "deepseek-ai/DeepSeek-R1-0528",
			name: "DeepSeek-R1-0528",
			api: "openai-completions",
			provider: "huggingface",
			baseUrl: "https://router.huggingface.co/v1",
			compat: { supportsDeveloperRole: !1 },
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 3,
				output: 5,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 163840,
			maxTokens: 163840
		},
		"deepseek-ai/DeepSeek-V3.2": {
			id: "deepseek-ai/DeepSeek-V3.2",
			name: "DeepSeek-V3.2",
			api: "openai-completions",
			provider: "huggingface",
			baseUrl: "https://router.huggingface.co/v1",
			compat: { supportsDeveloperRole: !1 },
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .28,
				output: .4,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 163840,
			maxTokens: 65536
		},
		"moonshotai/Kimi-K2-Instruct": {
			id: "moonshotai/Kimi-K2-Instruct",
			name: "Kimi-K2-Instruct",
			api: "openai-completions",
			provider: "huggingface",
			baseUrl: "https://router.huggingface.co/v1",
			compat: { supportsDeveloperRole: !1 },
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 1,
				output: 3,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 16384
		},
		"moonshotai/Kimi-K2-Instruct-0905": {
			id: "moonshotai/Kimi-K2-Instruct-0905",
			name: "Kimi-K2-Instruct-0905",
			api: "openai-completions",
			provider: "huggingface",
			baseUrl: "https://router.huggingface.co/v1",
			compat: { supportsDeveloperRole: !1 },
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 1,
				output: 3,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 16384
		},
		"moonshotai/Kimi-K2-Thinking": {
			id: "moonshotai/Kimi-K2-Thinking",
			name: "Kimi-K2-Thinking",
			api: "openai-completions",
			provider: "huggingface",
			baseUrl: "https://router.huggingface.co/v1",
			compat: { supportsDeveloperRole: !1 },
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .6,
				output: 2.5,
				cacheRead: .15,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 262144
		},
		"moonshotai/Kimi-K2.5": {
			id: "moonshotai/Kimi-K2.5",
			name: "Kimi-K2.5",
			api: "openai-completions",
			provider: "huggingface",
			baseUrl: "https://router.huggingface.co/v1",
			compat: { supportsDeveloperRole: !1 },
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .6,
				output: 3,
				cacheRead: .1,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 262144
		},
		"zai-org/GLM-4.7": {
			id: "zai-org/GLM-4.7",
			name: "GLM-4.7",
			api: "openai-completions",
			provider: "huggingface",
			baseUrl: "https://router.huggingface.co/v1",
			compat: { supportsDeveloperRole: !1 },
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .6,
				output: 2.2,
				cacheRead: .11,
				cacheWrite: 0
			},
			contextWindow: 204800,
			maxTokens: 131072
		},
		"zai-org/GLM-4.7-Flash": {
			id: "zai-org/GLM-4.7-Flash",
			name: "GLM-4.7-Flash",
			api: "openai-completions",
			provider: "huggingface",
			baseUrl: "https://router.huggingface.co/v1",
			compat: { supportsDeveloperRole: !1 },
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 128e3
		},
		"zai-org/GLM-5": {
			id: "zai-org/GLM-5",
			name: "GLM-5",
			api: "openai-completions",
			provider: "huggingface",
			baseUrl: "https://router.huggingface.co/v1",
			compat: { supportsDeveloperRole: !1 },
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 1,
				output: 3.2,
				cacheRead: .2,
				cacheWrite: 0
			},
			contextWindow: 202752,
			maxTokens: 131072
		}
	},
	"kimi-coding": {
		k2p5: {
			id: "k2p5",
			name: "Kimi K2.5",
			api: "anthropic-messages",
			provider: "kimi-coding",
			baseUrl: "https://api.kimi.com/coding",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 32768
		},
		"kimi-k2-thinking": {
			id: "kimi-k2-thinking",
			name: "Kimi K2 Thinking",
			api: "anthropic-messages",
			provider: "kimi-coding",
			baseUrl: "https://api.kimi.com/coding",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 32768
		}
	},
	minimax: {
		"MiniMax-M2": {
			id: "MiniMax-M2",
			name: "MiniMax-M2",
			api: "anthropic-messages",
			provider: "minimax",
			baseUrl: "https://api.minimax.io/anthropic",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .3,
				output: 1.2,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 204800,
			maxTokens: 131072
		},
		"MiniMax-M2.1": {
			id: "MiniMax-M2.1",
			name: "MiniMax-M2.1",
			api: "anthropic-messages",
			provider: "minimax",
			baseUrl: "https://api.minimax.io/anthropic",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .3,
				output: 1.2,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 204800,
			maxTokens: 131072
		},
		"MiniMax-M2.1-highspeed": {
			id: "MiniMax-M2.1-highspeed",
			name: "MiniMax-M2.1-highspeed",
			api: "anthropic-messages",
			provider: "minimax",
			baseUrl: "https://api.minimax.io/anthropic",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .6,
				output: 2.4,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 204800,
			maxTokens: 131072
		},
		"MiniMax-M2.5": {
			id: "MiniMax-M2.5",
			name: "MiniMax-M2.5",
			api: "anthropic-messages",
			provider: "minimax",
			baseUrl: "https://api.minimax.io/anthropic",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .3,
				output: 1.2,
				cacheRead: .03,
				cacheWrite: .375
			},
			contextWindow: 204800,
			maxTokens: 131072
		},
		"MiniMax-M2.5-highspeed": {
			id: "MiniMax-M2.5-highspeed",
			name: "MiniMax-M2.5-highspeed",
			api: "anthropic-messages",
			provider: "minimax",
			baseUrl: "https://api.minimax.io/anthropic",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .6,
				output: 2.4,
				cacheRead: .06,
				cacheWrite: .375
			},
			contextWindow: 204800,
			maxTokens: 131072
		},
		"MiniMax-M2.7": {
			id: "MiniMax-M2.7",
			name: "MiniMax-M2.7",
			api: "anthropic-messages",
			provider: "minimax",
			baseUrl: "https://api.minimax.io/anthropic",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .3,
				output: 1.2,
				cacheRead: .06,
				cacheWrite: .375
			},
			contextWindow: 204800,
			maxTokens: 131072
		},
		"MiniMax-M2.7-highspeed": {
			id: "MiniMax-M2.7-highspeed",
			name: "MiniMax-M2.7-highspeed",
			api: "anthropic-messages",
			provider: "minimax",
			baseUrl: "https://api.minimax.io/anthropic",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .6,
				output: 2.4,
				cacheRead: .06,
				cacheWrite: .375
			},
			contextWindow: 204800,
			maxTokens: 131072
		}
	},
	"minimax-cn": {
		"MiniMax-M2": {
			id: "MiniMax-M2",
			name: "MiniMax-M2",
			api: "anthropic-messages",
			provider: "minimax-cn",
			baseUrl: "https://api.minimaxi.com/anthropic",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .3,
				output: 1.2,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 204800,
			maxTokens: 131072
		},
		"MiniMax-M2.1": {
			id: "MiniMax-M2.1",
			name: "MiniMax-M2.1",
			api: "anthropic-messages",
			provider: "minimax-cn",
			baseUrl: "https://api.minimaxi.com/anthropic",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .3,
				output: 1.2,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 204800,
			maxTokens: 131072
		},
		"MiniMax-M2.1-highspeed": {
			id: "MiniMax-M2.1-highspeed",
			name: "MiniMax-M2.1-highspeed",
			api: "anthropic-messages",
			provider: "minimax-cn",
			baseUrl: "https://api.minimaxi.com/anthropic",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .6,
				output: 2.4,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 204800,
			maxTokens: 131072
		},
		"MiniMax-M2.5": {
			id: "MiniMax-M2.5",
			name: "MiniMax-M2.5",
			api: "anthropic-messages",
			provider: "minimax-cn",
			baseUrl: "https://api.minimaxi.com/anthropic",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .3,
				output: 1.2,
				cacheRead: .03,
				cacheWrite: .375
			},
			contextWindow: 204800,
			maxTokens: 131072
		},
		"MiniMax-M2.5-highspeed": {
			id: "MiniMax-M2.5-highspeed",
			name: "MiniMax-M2.5-highspeed",
			api: "anthropic-messages",
			provider: "minimax-cn",
			baseUrl: "https://api.minimaxi.com/anthropic",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .6,
				output: 2.4,
				cacheRead: .06,
				cacheWrite: .375
			},
			contextWindow: 204800,
			maxTokens: 131072
		},
		"MiniMax-M2.7": {
			id: "MiniMax-M2.7",
			name: "MiniMax-M2.7",
			api: "anthropic-messages",
			provider: "minimax-cn",
			baseUrl: "https://api.minimaxi.com/anthropic",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .3,
				output: 1.2,
				cacheRead: .06,
				cacheWrite: .375
			},
			contextWindow: 204800,
			maxTokens: 131072
		},
		"MiniMax-M2.7-highspeed": {
			id: "MiniMax-M2.7-highspeed",
			name: "MiniMax-M2.7-highspeed",
			api: "anthropic-messages",
			provider: "minimax-cn",
			baseUrl: "https://api.minimaxi.com/anthropic",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .6,
				output: 2.4,
				cacheRead: .06,
				cacheWrite: .375
			},
			contextWindow: 204800,
			maxTokens: 131072
		}
	},
	mistral: {
		"codestral-latest": {
			id: "codestral-latest",
			name: "Codestral (latest)",
			api: "mistral-conversations",
			provider: "mistral",
			baseUrl: "https://api.mistral.ai",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .3,
				output: .9,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 256e3,
			maxTokens: 4096
		},
		"devstral-2512": {
			id: "devstral-2512",
			name: "Devstral 2",
			api: "mistral-conversations",
			provider: "mistral",
			baseUrl: "https://api.mistral.ai",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .4,
				output: 2,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 262144
		},
		"devstral-medium-2507": {
			id: "devstral-medium-2507",
			name: "Devstral Medium",
			api: "mistral-conversations",
			provider: "mistral",
			baseUrl: "https://api.mistral.ai",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .4,
				output: 2,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 128e3
		},
		"devstral-medium-latest": {
			id: "devstral-medium-latest",
			name: "Devstral 2 (latest)",
			api: "mistral-conversations",
			provider: "mistral",
			baseUrl: "https://api.mistral.ai",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .4,
				output: 2,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 262144
		},
		"devstral-small-2505": {
			id: "devstral-small-2505",
			name: "Devstral Small 2505",
			api: "mistral-conversations",
			provider: "mistral",
			baseUrl: "https://api.mistral.ai",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .1,
				output: .3,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 128e3
		},
		"devstral-small-2507": {
			id: "devstral-small-2507",
			name: "Devstral Small",
			api: "mistral-conversations",
			provider: "mistral",
			baseUrl: "https://api.mistral.ai",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .1,
				output: .3,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 128e3
		},
		"labs-devstral-small-2512": {
			id: "labs-devstral-small-2512",
			name: "Devstral Small 2",
			api: "mistral-conversations",
			provider: "mistral",
			baseUrl: "https://api.mistral.ai",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 256e3,
			maxTokens: 256e3
		},
		"magistral-medium-latest": {
			id: "magistral-medium-latest",
			name: "Magistral Medium (latest)",
			api: "mistral-conversations",
			provider: "mistral",
			baseUrl: "https://api.mistral.ai",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 2,
				output: 5,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 16384
		},
		"magistral-small": {
			id: "magistral-small",
			name: "Magistral Small",
			api: "mistral-conversations",
			provider: "mistral",
			baseUrl: "https://api.mistral.ai",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .5,
				output: 1.5,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 128e3
		},
		"ministral-3b-latest": {
			id: "ministral-3b-latest",
			name: "Ministral 3B (latest)",
			api: "mistral-conversations",
			provider: "mistral",
			baseUrl: "https://api.mistral.ai",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .04,
				output: .04,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 128e3
		},
		"ministral-8b-latest": {
			id: "ministral-8b-latest",
			name: "Ministral 8B (latest)",
			api: "mistral-conversations",
			provider: "mistral",
			baseUrl: "https://api.mistral.ai",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .1,
				output: .1,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 128e3
		},
		"mistral-large-2411": {
			id: "mistral-large-2411",
			name: "Mistral Large 2.1",
			api: "mistral-conversations",
			provider: "mistral",
			baseUrl: "https://api.mistral.ai",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 2,
				output: 6,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 16384
		},
		"mistral-large-2512": {
			id: "mistral-large-2512",
			name: "Mistral Large 3",
			api: "mistral-conversations",
			provider: "mistral",
			baseUrl: "https://api.mistral.ai",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .5,
				output: 1.5,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 262144
		},
		"mistral-large-latest": {
			id: "mistral-large-latest",
			name: "Mistral Large (latest)",
			api: "mistral-conversations",
			provider: "mistral",
			baseUrl: "https://api.mistral.ai",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .5,
				output: 1.5,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 262144
		},
		"mistral-medium-2505": {
			id: "mistral-medium-2505",
			name: "Mistral Medium 3",
			api: "mistral-conversations",
			provider: "mistral",
			baseUrl: "https://api.mistral.ai",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .4,
				output: 2,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 131072
		},
		"mistral-medium-2508": {
			id: "mistral-medium-2508",
			name: "Mistral Medium 3.1",
			api: "mistral-conversations",
			provider: "mistral",
			baseUrl: "https://api.mistral.ai",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .4,
				output: 2,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 262144
		},
		"mistral-medium-latest": {
			id: "mistral-medium-latest",
			name: "Mistral Medium (latest)",
			api: "mistral-conversations",
			provider: "mistral",
			baseUrl: "https://api.mistral.ai",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .4,
				output: 2,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 16384
		},
		"mistral-nemo": {
			id: "mistral-nemo",
			name: "Mistral Nemo",
			api: "mistral-conversations",
			provider: "mistral",
			baseUrl: "https://api.mistral.ai",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .15,
				output: .15,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 128e3
		},
		"mistral-small-2506": {
			id: "mistral-small-2506",
			name: "Mistral Small 3.2",
			api: "mistral-conversations",
			provider: "mistral",
			baseUrl: "https://api.mistral.ai",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .1,
				output: .3,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 16384
		},
		"mistral-small-latest": {
			id: "mistral-small-latest",
			name: "Mistral Small (latest)",
			api: "mistral-conversations",
			provider: "mistral",
			baseUrl: "https://api.mistral.ai",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .1,
				output: .3,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 16384
		},
		"open-mistral-7b": {
			id: "open-mistral-7b",
			name: "Mistral 7B",
			api: "mistral-conversations",
			provider: "mistral",
			baseUrl: "https://api.mistral.ai",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .25,
				output: .25,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 8e3,
			maxTokens: 8e3
		},
		"open-mixtral-8x22b": {
			id: "open-mixtral-8x22b",
			name: "Mixtral 8x22B",
			api: "mistral-conversations",
			provider: "mistral",
			baseUrl: "https://api.mistral.ai",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 2,
				output: 6,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 64e3,
			maxTokens: 64e3
		},
		"open-mixtral-8x7b": {
			id: "open-mixtral-8x7b",
			name: "Mixtral 8x7B",
			api: "mistral-conversations",
			provider: "mistral",
			baseUrl: "https://api.mistral.ai",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .7,
				output: .7,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 32e3,
			maxTokens: 32e3
		},
		"pixtral-12b": {
			id: "pixtral-12b",
			name: "Pixtral 12B",
			api: "mistral-conversations",
			provider: "mistral",
			baseUrl: "https://api.mistral.ai",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .15,
				output: .15,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 128e3
		},
		"pixtral-large-latest": {
			id: "pixtral-large-latest",
			name: "Pixtral Large (latest)",
			api: "mistral-conversations",
			provider: "mistral",
			baseUrl: "https://api.mistral.ai",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 2,
				output: 6,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 128e3
		}
	},
	openai: {
		"codex-mini-latest": {
			id: "codex-mini-latest",
			name: "Codex Mini",
			api: "openai-responses",
			provider: "openai",
			baseUrl: "https://api.openai.com/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 1.5,
				output: 6,
				cacheRead: .375,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 1e5
		},
		"gpt-4": {
			id: "gpt-4",
			name: "GPT-4",
			api: "openai-responses",
			provider: "openai",
			baseUrl: "https://api.openai.com/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 30,
				output: 60,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 8192,
			maxTokens: 8192
		},
		"gpt-4-turbo": {
			id: "gpt-4-turbo",
			name: "GPT-4 Turbo",
			api: "openai-responses",
			provider: "openai",
			baseUrl: "https://api.openai.com/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 10,
				output: 30,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4096
		},
		"gpt-4.1": {
			id: "gpt-4.1",
			name: "GPT-4.1",
			api: "openai-responses",
			provider: "openai",
			baseUrl: "https://api.openai.com/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 2,
				output: 8,
				cacheRead: .5,
				cacheWrite: 0
			},
			contextWindow: 1047576,
			maxTokens: 32768
		},
		"gpt-4.1-mini": {
			id: "gpt-4.1-mini",
			name: "GPT-4.1 mini",
			api: "openai-responses",
			provider: "openai",
			baseUrl: "https://api.openai.com/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .4,
				output: 1.6,
				cacheRead: .1,
				cacheWrite: 0
			},
			contextWindow: 1047576,
			maxTokens: 32768
		},
		"gpt-4.1-nano": {
			id: "gpt-4.1-nano",
			name: "GPT-4.1 nano",
			api: "openai-responses",
			provider: "openai",
			baseUrl: "https://api.openai.com/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .1,
				output: .4,
				cacheRead: .03,
				cacheWrite: 0
			},
			contextWindow: 1047576,
			maxTokens: 32768
		},
		"gpt-4o": {
			id: "gpt-4o",
			name: "GPT-4o",
			api: "openai-responses",
			provider: "openai",
			baseUrl: "https://api.openai.com/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 2.5,
				output: 10,
				cacheRead: 1.25,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 16384
		},
		"gpt-4o-2024-05-13": {
			id: "gpt-4o-2024-05-13",
			name: "GPT-4o (2024-05-13)",
			api: "openai-responses",
			provider: "openai",
			baseUrl: "https://api.openai.com/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 5,
				output: 15,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4096
		},
		"gpt-4o-2024-08-06": {
			id: "gpt-4o-2024-08-06",
			name: "GPT-4o (2024-08-06)",
			api: "openai-responses",
			provider: "openai",
			baseUrl: "https://api.openai.com/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 2.5,
				output: 10,
				cacheRead: 1.25,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 16384
		},
		"gpt-4o-2024-11-20": {
			id: "gpt-4o-2024-11-20",
			name: "GPT-4o (2024-11-20)",
			api: "openai-responses",
			provider: "openai",
			baseUrl: "https://api.openai.com/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 2.5,
				output: 10,
				cacheRead: 1.25,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 16384
		},
		"gpt-4o-mini": {
			id: "gpt-4o-mini",
			name: "GPT-4o mini",
			api: "openai-responses",
			provider: "openai",
			baseUrl: "https://api.openai.com/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .15,
				output: .6,
				cacheRead: .08,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 16384
		},
		"gpt-5": {
			id: "gpt-5",
			name: "GPT-5",
			api: "openai-responses",
			provider: "openai",
			baseUrl: "https://api.openai.com/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.25,
				output: 10,
				cacheRead: .125,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5-chat-latest": {
			id: "gpt-5-chat-latest",
			name: "GPT-5 Chat Latest",
			api: "openai-responses",
			provider: "openai",
			baseUrl: "https://api.openai.com/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 1.25,
				output: 10,
				cacheRead: .125,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 16384
		},
		"gpt-5-codex": {
			id: "gpt-5-codex",
			name: "GPT-5-Codex",
			api: "openai-responses",
			provider: "openai",
			baseUrl: "https://api.openai.com/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.25,
				output: 10,
				cacheRead: .125,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5-mini": {
			id: "gpt-5-mini",
			name: "GPT-5 Mini",
			api: "openai-responses",
			provider: "openai",
			baseUrl: "https://api.openai.com/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .25,
				output: 2,
				cacheRead: .025,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5-nano": {
			id: "gpt-5-nano",
			name: "GPT-5 Nano",
			api: "openai-responses",
			provider: "openai",
			baseUrl: "https://api.openai.com/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .05,
				output: .4,
				cacheRead: .005,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5-pro": {
			id: "gpt-5-pro",
			name: "GPT-5 Pro",
			api: "openai-responses",
			provider: "openai",
			baseUrl: "https://api.openai.com/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 15,
				output: 120,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 272e3
		},
		"gpt-5.1": {
			id: "gpt-5.1",
			name: "GPT-5.1",
			api: "openai-responses",
			provider: "openai",
			baseUrl: "https://api.openai.com/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.25,
				output: 10,
				cacheRead: .13,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5.1-chat-latest": {
			id: "gpt-5.1-chat-latest",
			name: "GPT-5.1 Chat",
			api: "openai-responses",
			provider: "openai",
			baseUrl: "https://api.openai.com/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.25,
				output: 10,
				cacheRead: .125,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 16384
		},
		"gpt-5.1-codex": {
			id: "gpt-5.1-codex",
			name: "GPT-5.1 Codex",
			api: "openai-responses",
			provider: "openai",
			baseUrl: "https://api.openai.com/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.25,
				output: 10,
				cacheRead: .125,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5.1-codex-max": {
			id: "gpt-5.1-codex-max",
			name: "GPT-5.1 Codex Max",
			api: "openai-responses",
			provider: "openai",
			baseUrl: "https://api.openai.com/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.25,
				output: 10,
				cacheRead: .125,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5.1-codex-mini": {
			id: "gpt-5.1-codex-mini",
			name: "GPT-5.1 Codex mini",
			api: "openai-responses",
			provider: "openai",
			baseUrl: "https://api.openai.com/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .25,
				output: 2,
				cacheRead: .025,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5.2": {
			id: "gpt-5.2",
			name: "GPT-5.2",
			api: "openai-responses",
			provider: "openai",
			baseUrl: "https://api.openai.com/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.75,
				output: 14,
				cacheRead: .175,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5.2-chat-latest": {
			id: "gpt-5.2-chat-latest",
			name: "GPT-5.2 Chat",
			api: "openai-responses",
			provider: "openai",
			baseUrl: "https://api.openai.com/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.75,
				output: 14,
				cacheRead: .175,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 16384
		},
		"gpt-5.2-codex": {
			id: "gpt-5.2-codex",
			name: "GPT-5.2 Codex",
			api: "openai-responses",
			provider: "openai",
			baseUrl: "https://api.openai.com/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.75,
				output: 14,
				cacheRead: .175,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5.2-pro": {
			id: "gpt-5.2-pro",
			name: "GPT-5.2 Pro",
			api: "openai-responses",
			provider: "openai",
			baseUrl: "https://api.openai.com/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 21,
				output: 168,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5.3-codex": {
			id: "gpt-5.3-codex",
			name: "GPT-5.3 Codex",
			api: "openai-responses",
			provider: "openai",
			baseUrl: "https://api.openai.com/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.75,
				output: 14,
				cacheRead: .175,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5.3-codex-spark": {
			id: "gpt-5.3-codex-spark",
			name: "GPT-5.3 Codex Spark",
			api: "openai-responses",
			provider: "openai",
			baseUrl: "https://api.openai.com/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.75,
				output: 14,
				cacheRead: .175,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 32e3
		},
		"gpt-5.4": {
			id: "gpt-5.4",
			name: "GPT-5.4",
			api: "openai-responses",
			provider: "openai",
			baseUrl: "https://api.openai.com/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 2.5,
				output: 15,
				cacheRead: .25,
				cacheWrite: 0
			},
			contextWindow: 272e3,
			maxTokens: 128e3
		},
		"gpt-5.4-mini": {
			id: "gpt-5.4-mini",
			name: "GPT-5.4 mini",
			api: "openai-responses",
			provider: "openai",
			baseUrl: "https://api.openai.com/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .75,
				output: 4.5,
				cacheRead: .075,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5.4-nano": {
			id: "gpt-5.4-nano",
			name: "GPT-5.4 nano",
			api: "openai-responses",
			provider: "openai",
			baseUrl: "https://api.openai.com/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .2,
				output: 1.25,
				cacheRead: .02,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5.4-pro": {
			id: "gpt-5.4-pro",
			name: "GPT-5.4 Pro",
			api: "openai-responses",
			provider: "openai",
			baseUrl: "https://api.openai.com/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 30,
				output: 180,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 105e4,
			maxTokens: 128e3
		},
		o1: {
			id: "o1",
			name: "o1",
			api: "openai-responses",
			provider: "openai",
			baseUrl: "https://api.openai.com/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 15,
				output: 60,
				cacheRead: 7.5,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 1e5
		},
		"o1-pro": {
			id: "o1-pro",
			name: "o1-pro",
			api: "openai-responses",
			provider: "openai",
			baseUrl: "https://api.openai.com/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 150,
				output: 600,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 1e5
		},
		o3: {
			id: "o3",
			name: "o3",
			api: "openai-responses",
			provider: "openai",
			baseUrl: "https://api.openai.com/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 2,
				output: 8,
				cacheRead: .5,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 1e5
		},
		"o3-deep-research": {
			id: "o3-deep-research",
			name: "o3-deep-research",
			api: "openai-responses",
			provider: "openai",
			baseUrl: "https://api.openai.com/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 10,
				output: 40,
				cacheRead: 2.5,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 1e5
		},
		"o3-mini": {
			id: "o3-mini",
			name: "o3-mini",
			api: "openai-responses",
			provider: "openai",
			baseUrl: "https://api.openai.com/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 1.1,
				output: 4.4,
				cacheRead: .55,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 1e5
		},
		"o3-pro": {
			id: "o3-pro",
			name: "o3-pro",
			api: "openai-responses",
			provider: "openai",
			baseUrl: "https://api.openai.com/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 20,
				output: 80,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 1e5
		},
		"o4-mini": {
			id: "o4-mini",
			name: "o4-mini",
			api: "openai-responses",
			provider: "openai",
			baseUrl: "https://api.openai.com/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.1,
				output: 4.4,
				cacheRead: .28,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 1e5
		},
		"o4-mini-deep-research": {
			id: "o4-mini-deep-research",
			name: "o4-mini-deep-research",
			api: "openai-responses",
			provider: "openai",
			baseUrl: "https://api.openai.com/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 2,
				output: 8,
				cacheRead: .5,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 1e5
		}
	},
	"openai-codex": {
		"gpt-5.1": {
			id: "gpt-5.1",
			name: "GPT-5.1",
			api: "openai-codex-responses",
			provider: "openai-codex",
			baseUrl: "https://chatgpt.com/backend-api",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.25,
				output: 10,
				cacheRead: .125,
				cacheWrite: 0
			},
			contextWindow: 272e3,
			maxTokens: 128e3
		},
		"gpt-5.1-codex-max": {
			id: "gpt-5.1-codex-max",
			name: "GPT-5.1 Codex Max",
			api: "openai-codex-responses",
			provider: "openai-codex",
			baseUrl: "https://chatgpt.com/backend-api",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.25,
				output: 10,
				cacheRead: .125,
				cacheWrite: 0
			},
			contextWindow: 272e3,
			maxTokens: 128e3
		},
		"gpt-5.1-codex-mini": {
			id: "gpt-5.1-codex-mini",
			name: "GPT-5.1 Codex Mini",
			api: "openai-codex-responses",
			provider: "openai-codex",
			baseUrl: "https://chatgpt.com/backend-api",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .25,
				output: 2,
				cacheRead: .025,
				cacheWrite: 0
			},
			contextWindow: 272e3,
			maxTokens: 128e3
		},
		"gpt-5.2": {
			id: "gpt-5.2",
			name: "GPT-5.2",
			api: "openai-codex-responses",
			provider: "openai-codex",
			baseUrl: "https://chatgpt.com/backend-api",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.75,
				output: 14,
				cacheRead: .175,
				cacheWrite: 0
			},
			contextWindow: 272e3,
			maxTokens: 128e3
		},
		"gpt-5.2-codex": {
			id: "gpt-5.2-codex",
			name: "GPT-5.2 Codex",
			api: "openai-codex-responses",
			provider: "openai-codex",
			baseUrl: "https://chatgpt.com/backend-api",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.75,
				output: 14,
				cacheRead: .175,
				cacheWrite: 0
			},
			contextWindow: 272e3,
			maxTokens: 128e3
		},
		"gpt-5.3-codex": {
			id: "gpt-5.3-codex",
			name: "GPT-5.3 Codex",
			api: "openai-codex-responses",
			provider: "openai-codex",
			baseUrl: "https://chatgpt.com/backend-api",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.75,
				output: 14,
				cacheRead: .175,
				cacheWrite: 0
			},
			contextWindow: 272e3,
			maxTokens: 128e3
		},
		"gpt-5.3-codex-spark": {
			id: "gpt-5.3-codex-spark",
			name: "GPT-5.3 Codex Spark",
			api: "openai-codex-responses",
			provider: "openai-codex",
			baseUrl: "https://chatgpt.com/backend-api",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 128e3
		},
		"gpt-5.4": {
			id: "gpt-5.4",
			name: "GPT-5.4",
			api: "openai-codex-responses",
			provider: "openai-codex",
			baseUrl: "https://chatgpt.com/backend-api",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 2.5,
				output: 15,
				cacheRead: .25,
				cacheWrite: 0
			},
			contextWindow: 272e3,
			maxTokens: 128e3
		},
		"gpt-5.4-mini": {
			id: "gpt-5.4-mini",
			name: "GPT-5.4 Mini",
			api: "openai-codex-responses",
			provider: "openai-codex",
			baseUrl: "https://chatgpt.com/backend-api",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .75,
				output: 4.5,
				cacheRead: .075,
				cacheWrite: 0
			},
			contextWindow: 272e3,
			maxTokens: 128e3
		}
	},
	opencode: {
		"big-pickle": {
			id: "big-pickle",
			name: "Big Pickle",
			api: "anthropic-messages",
			provider: "opencode",
			baseUrl: "https://opencode.ai/zen",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 128e3
		},
		"claude-3-5-haiku": {
			id: "claude-3-5-haiku",
			name: "Claude Haiku 3.5",
			api: "anthropic-messages",
			provider: "opencode",
			baseUrl: "https://opencode.ai/zen",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .8,
				output: 4,
				cacheRead: .08,
				cacheWrite: 1
			},
			contextWindow: 2e5,
			maxTokens: 8192
		},
		"claude-haiku-4-5": {
			id: "claude-haiku-4-5",
			name: "Claude Haiku 4.5",
			api: "anthropic-messages",
			provider: "opencode",
			baseUrl: "https://opencode.ai/zen",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1,
				output: 5,
				cacheRead: .1,
				cacheWrite: 1.25
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"claude-opus-4-1": {
			id: "claude-opus-4-1",
			name: "Claude Opus 4.1",
			api: "anthropic-messages",
			provider: "opencode",
			baseUrl: "https://opencode.ai/zen",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 15,
				output: 75,
				cacheRead: 1.5,
				cacheWrite: 18.75
			},
			contextWindow: 2e5,
			maxTokens: 32e3
		},
		"claude-opus-4-5": {
			id: "claude-opus-4-5",
			name: "Claude Opus 4.5",
			api: "anthropic-messages",
			provider: "opencode",
			baseUrl: "https://opencode.ai/zen",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 5,
				output: 25,
				cacheRead: .5,
				cacheWrite: 6.25
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"claude-opus-4-6": {
			id: "claude-opus-4-6",
			name: "Claude Opus 4.6",
			api: "anthropic-messages",
			provider: "opencode",
			baseUrl: "https://opencode.ai/zen",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 5,
				output: 25,
				cacheRead: .5,
				cacheWrite: 6.25
			},
			contextWindow: 1e6,
			maxTokens: 128e3
		},
		"claude-sonnet-4": {
			id: "claude-sonnet-4",
			name: "Claude Sonnet 4",
			api: "anthropic-messages",
			provider: "opencode",
			baseUrl: "https://opencode.ai/zen",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"claude-sonnet-4-5": {
			id: "claude-sonnet-4-5",
			name: "Claude Sonnet 4.5",
			api: "anthropic-messages",
			provider: "opencode",
			baseUrl: "https://opencode.ai/zen",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"claude-sonnet-4-6": {
			id: "claude-sonnet-4-6",
			name: "Claude Sonnet 4.6",
			api: "anthropic-messages",
			provider: "opencode",
			baseUrl: "https://opencode.ai/zen",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 1e6,
			maxTokens: 64e3
		},
		"gemini-3-flash": {
			id: "gemini-3-flash",
			name: "Gemini 3 Flash",
			api: "google-generative-ai",
			provider: "opencode",
			baseUrl: "https://opencode.ai/zen/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .5,
				output: 3,
				cacheRead: .05,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 65536
		},
		"gemini-3.1-pro": {
			id: "gemini-3.1-pro",
			name: "Gemini 3.1 Pro Preview",
			api: "google-generative-ai",
			provider: "opencode",
			baseUrl: "https://opencode.ai/zen/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 2,
				output: 12,
				cacheRead: .2,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 65536
		},
		"glm-5": {
			id: "glm-5",
			name: "GLM-5",
			api: "openai-completions",
			provider: "opencode",
			baseUrl: "https://opencode.ai/zen/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 1,
				output: 3.2,
				cacheRead: .2,
				cacheWrite: 0
			},
			contextWindow: 204800,
			maxTokens: 131072
		},
		"gpt-5": {
			id: "gpt-5",
			name: "GPT-5",
			api: "openai-responses",
			provider: "opencode",
			baseUrl: "https://opencode.ai/zen/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.07,
				output: 8.5,
				cacheRead: .107,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5-codex": {
			id: "gpt-5-codex",
			name: "GPT-5 Codex",
			api: "openai-responses",
			provider: "opencode",
			baseUrl: "https://opencode.ai/zen/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.07,
				output: 8.5,
				cacheRead: .107,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5-nano": {
			id: "gpt-5-nano",
			name: "GPT-5 Nano",
			api: "openai-responses",
			provider: "opencode",
			baseUrl: "https://opencode.ai/zen/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5.1": {
			id: "gpt-5.1",
			name: "GPT-5.1",
			api: "openai-responses",
			provider: "opencode",
			baseUrl: "https://opencode.ai/zen/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.07,
				output: 8.5,
				cacheRead: .107,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5.1-codex": {
			id: "gpt-5.1-codex",
			name: "GPT-5.1 Codex",
			api: "openai-responses",
			provider: "opencode",
			baseUrl: "https://opencode.ai/zen/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.07,
				output: 8.5,
				cacheRead: .107,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5.1-codex-max": {
			id: "gpt-5.1-codex-max",
			name: "GPT-5.1 Codex Max",
			api: "openai-responses",
			provider: "opencode",
			baseUrl: "https://opencode.ai/zen/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.25,
				output: 10,
				cacheRead: .125,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5.1-codex-mini": {
			id: "gpt-5.1-codex-mini",
			name: "GPT-5.1 Codex Mini",
			api: "openai-responses",
			provider: "opencode",
			baseUrl: "https://opencode.ai/zen/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .25,
				output: 2,
				cacheRead: .025,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5.2": {
			id: "gpt-5.2",
			name: "GPT-5.2",
			api: "openai-responses",
			provider: "opencode",
			baseUrl: "https://opencode.ai/zen/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.75,
				output: 14,
				cacheRead: .175,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5.2-codex": {
			id: "gpt-5.2-codex",
			name: "GPT-5.2 Codex",
			api: "openai-responses",
			provider: "opencode",
			baseUrl: "https://opencode.ai/zen/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.75,
				output: 14,
				cacheRead: .175,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5.3-codex": {
			id: "gpt-5.3-codex",
			name: "GPT-5.3 Codex",
			api: "openai-responses",
			provider: "opencode",
			baseUrl: "https://opencode.ai/zen/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.75,
				output: 14,
				cacheRead: .175,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5.4": {
			id: "gpt-5.4",
			name: "GPT-5.4",
			api: "openai-responses",
			provider: "opencode",
			baseUrl: "https://opencode.ai/zen/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 2.5,
				output: 15,
				cacheRead: .25,
				cacheWrite: 0
			},
			contextWindow: 272e3,
			maxTokens: 128e3
		},
		"gpt-5.4-mini": {
			id: "gpt-5.4-mini",
			name: "GPT-5.4 Mini",
			api: "openai-responses",
			provider: "opencode",
			baseUrl: "https://opencode.ai/zen/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .75,
				output: 4.5,
				cacheRead: .075,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5.4-nano": {
			id: "gpt-5.4-nano",
			name: "GPT-5.4 Nano",
			api: "openai-responses",
			provider: "opencode",
			baseUrl: "https://opencode.ai/zen/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .2,
				output: 1.25,
				cacheRead: .02,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"gpt-5.4-pro": {
			id: "gpt-5.4-pro",
			name: "GPT-5.4 Pro",
			api: "openai-responses",
			provider: "opencode",
			baseUrl: "https://opencode.ai/zen/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 30,
				output: 180,
				cacheRead: 30,
				cacheWrite: 0
			},
			contextWindow: 105e4,
			maxTokens: 128e3
		},
		"kimi-k2.5": {
			id: "kimi-k2.5",
			name: "Kimi K2.5",
			api: "openai-completions",
			provider: "opencode",
			baseUrl: "https://opencode.ai/zen/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .6,
				output: 3,
				cacheRead: .08,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 65536
		},
		"mimo-v2-omni-free": {
			id: "mimo-v2-omni-free",
			name: "MiMo V2 Omni Free",
			api: "openai-completions",
			provider: "opencode",
			baseUrl: "https://opencode.ai/zen/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 64e3
		},
		"mimo-v2-pro-free": {
			id: "mimo-v2-pro-free",
			name: "MiMo V2 Pro Free",
			api: "openai-completions",
			provider: "opencode",
			baseUrl: "https://opencode.ai/zen/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 64e3
		},
		"minimax-m2.5": {
			id: "minimax-m2.5",
			name: "MiniMax M2.5",
			api: "openai-completions",
			provider: "opencode",
			baseUrl: "https://opencode.ai/zen/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .3,
				output: 1.2,
				cacheRead: .06,
				cacheWrite: 0
			},
			contextWindow: 204800,
			maxTokens: 131072
		},
		"minimax-m2.5-free": {
			id: "minimax-m2.5-free",
			name: "MiniMax M2.5 Free",
			api: "anthropic-messages",
			provider: "opencode",
			baseUrl: "https://opencode.ai/zen",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 204800,
			maxTokens: 131072
		},
		"nemotron-3-super-free": {
			id: "nemotron-3-super-free",
			name: "Nemotron 3 Super Free",
			api: "openai-completions",
			provider: "opencode",
			baseUrl: "https://opencode.ai/zen/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 1e6,
			maxTokens: 128e3
		}
	},
	"opencode-go": {
		"glm-5": {
			id: "glm-5",
			name: "GLM-5",
			api: "openai-completions",
			provider: "opencode-go",
			baseUrl: "https://opencode.ai/zen/go/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 1,
				output: 3.2,
				cacheRead: .2,
				cacheWrite: 0
			},
			contextWindow: 204800,
			maxTokens: 131072
		},
		"kimi-k2.5": {
			id: "kimi-k2.5",
			name: "Kimi K2.5",
			api: "openai-completions",
			provider: "opencode-go",
			baseUrl: "https://opencode.ai/zen/go/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .6,
				output: 3,
				cacheRead: .1,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 65536
		},
		"minimax-m2.5": {
			id: "minimax-m2.5",
			name: "MiniMax M2.5",
			api: "anthropic-messages",
			provider: "opencode-go",
			baseUrl: "https://opencode.ai/zen/go",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .3,
				output: 1.2,
				cacheRead: .03,
				cacheWrite: 0
			},
			contextWindow: 204800,
			maxTokens: 131072
		},
		"minimax-m2.7": {
			id: "minimax-m2.7",
			name: "MiniMax M2.7",
			api: "anthropic-messages",
			provider: "opencode-go",
			baseUrl: "https://opencode.ai/zen/go",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .3,
				output: 1.2,
				cacheRead: .06,
				cacheWrite: 0
			},
			contextWindow: 204800,
			maxTokens: 131072
		}
	},
	openrouter: {
		"ai21/jamba-large-1.7": {
			id: "ai21/jamba-large-1.7",
			name: "AI21: Jamba Large 1.7",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 2,
				output: 8,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 256e3,
			maxTokens: 4096
		},
		"alibaba/tongyi-deepresearch-30b-a3b": {
			id: "alibaba/tongyi-deepresearch-30b-a3b",
			name: "Tongyi DeepResearch 30B A3B",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .09,
				output: .44999999999999996,
				cacheRead: .09,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 131072
		},
		"allenai/olmo-3.1-32b-instruct": {
			id: "allenai/olmo-3.1-32b-instruct",
			name: "AllenAI: Olmo 3.1 32B Instruct",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .19999999999999998,
				output: .6,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 65536,
			maxTokens: 4096
		},
		"amazon/nova-2-lite-v1": {
			id: "amazon/nova-2-lite-v1",
			name: "Amazon: Nova 2 Lite",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .3,
				output: 2.5,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 1e6,
			maxTokens: 65535
		},
		"amazon/nova-lite-v1": {
			id: "amazon/nova-lite-v1",
			name: "Amazon: Nova Lite 1.0",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .06,
				output: .24,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 3e5,
			maxTokens: 5120
		},
		"amazon/nova-micro-v1": {
			id: "amazon/nova-micro-v1",
			name: "Amazon: Nova Micro 1.0",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .035,
				output: .14,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 5120
		},
		"amazon/nova-premier-v1": {
			id: "amazon/nova-premier-v1",
			name: "Amazon: Nova Premier 1.0",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 2.5,
				output: 12.5,
				cacheRead: .625,
				cacheWrite: 0
			},
			contextWindow: 1e6,
			maxTokens: 32e3
		},
		"amazon/nova-pro-v1": {
			id: "amazon/nova-pro-v1",
			name: "Amazon: Nova Pro 1.0",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .7999999999999999,
				output: 3.1999999999999997,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 3e5,
			maxTokens: 5120
		},
		"anthropic/claude-3-haiku": {
			id: "anthropic/claude-3-haiku",
			name: "Anthropic: Claude 3 Haiku",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .25,
				output: 1.25,
				cacheRead: .03,
				cacheWrite: .3
			},
			contextWindow: 2e5,
			maxTokens: 4096
		},
		"anthropic/claude-3.5-haiku": {
			id: "anthropic/claude-3.5-haiku",
			name: "Anthropic: Claude 3.5 Haiku",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .7999999999999999,
				output: 4,
				cacheRead: .08,
				cacheWrite: 1
			},
			contextWindow: 2e5,
			maxTokens: 8192
		},
		"anthropic/claude-3.5-sonnet": {
			id: "anthropic/claude-3.5-sonnet",
			name: "Anthropic: Claude 3.5 Sonnet",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 6,
				output: 30,
				cacheRead: .6,
				cacheWrite: 7.5
			},
			contextWindow: 2e5,
			maxTokens: 8192
		},
		"anthropic/claude-3.7-sonnet": {
			id: "anthropic/claude-3.7-sonnet",
			name: "Anthropic: Claude 3.7 Sonnet",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"anthropic/claude-3.7-sonnet:thinking": {
			id: "anthropic/claude-3.7-sonnet:thinking",
			name: "Anthropic: Claude 3.7 Sonnet (thinking)",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"anthropic/claude-haiku-4.5": {
			id: "anthropic/claude-haiku-4.5",
			name: "Anthropic: Claude Haiku 4.5",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1,
				output: 5,
				cacheRead: .09999999999999999,
				cacheWrite: 1.25
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"anthropic/claude-opus-4": {
			id: "anthropic/claude-opus-4",
			name: "Anthropic: Claude Opus 4",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 15,
				output: 75,
				cacheRead: 1.5,
				cacheWrite: 18.75
			},
			contextWindow: 2e5,
			maxTokens: 32e3
		},
		"anthropic/claude-opus-4.1": {
			id: "anthropic/claude-opus-4.1",
			name: "Anthropic: Claude Opus 4.1",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 15,
				output: 75,
				cacheRead: 1.5,
				cacheWrite: 18.75
			},
			contextWindow: 2e5,
			maxTokens: 32e3
		},
		"anthropic/claude-opus-4.5": {
			id: "anthropic/claude-opus-4.5",
			name: "Anthropic: Claude Opus 4.5",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 5,
				output: 25,
				cacheRead: .5,
				cacheWrite: 6.25
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"anthropic/claude-opus-4.6": {
			id: "anthropic/claude-opus-4.6",
			name: "Anthropic: Claude Opus 4.6",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 5,
				output: 25,
				cacheRead: .5,
				cacheWrite: 6.25
			},
			contextWindow: 1e6,
			maxTokens: 128e3
		},
		"anthropic/claude-sonnet-4": {
			id: "anthropic/claude-sonnet-4",
			name: "Anthropic: Claude Sonnet 4",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"anthropic/claude-sonnet-4.5": {
			id: "anthropic/claude-sonnet-4.5",
			name: "Anthropic: Claude Sonnet 4.5",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 1e6,
			maxTokens: 64e3
		},
		"anthropic/claude-sonnet-4.6": {
			id: "anthropic/claude-sonnet-4.6",
			name: "Anthropic: Claude Sonnet 4.6",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 1e6,
			maxTokens: 128e3
		},
		"arcee-ai/trinity-large-preview:free": {
			id: "arcee-ai/trinity-large-preview:free",
			name: "Arcee AI: Trinity Large Preview (free)",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131e3,
			maxTokens: 4096
		},
		"arcee-ai/trinity-mini": {
			id: "arcee-ai/trinity-mini",
			name: "Arcee AI: Trinity Mini",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .045,
				output: .15,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 131072
		},
		"arcee-ai/trinity-mini:free": {
			id: "arcee-ai/trinity-mini:free",
			name: "Arcee AI: Trinity Mini (free)",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 4096
		},
		"arcee-ai/virtuoso-large": {
			id: "arcee-ai/virtuoso-large",
			name: "Arcee AI: Virtuoso Large",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .75,
				output: 1.2,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 64e3
		},
		auto: {
			id: "auto",
			name: "Auto",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 2e6,
			maxTokens: 3e4
		},
		"baidu/ernie-4.5-21b-a3b": {
			id: "baidu/ernie-4.5-21b-a3b",
			name: "Baidu: ERNIE 4.5 21B A3B",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .07,
				output: .28,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 12e4,
			maxTokens: 8e3
		},
		"baidu/ernie-4.5-vl-28b-a3b": {
			id: "baidu/ernie-4.5-vl-28b-a3b",
			name: "Baidu: ERNIE 4.5 VL 28B A3B",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .14,
				output: .56,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 3e4,
			maxTokens: 8e3
		},
		"bytedance-seed/seed-1.6": {
			id: "bytedance-seed/seed-1.6",
			name: "ByteDance Seed: Seed 1.6",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .25,
				output: 2,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 32768
		},
		"bytedance-seed/seed-1.6-flash": {
			id: "bytedance-seed/seed-1.6-flash",
			name: "ByteDance Seed: Seed 1.6 Flash",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .075,
				output: .3,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 32768
		},
		"bytedance-seed/seed-2.0-lite": {
			id: "bytedance-seed/seed-2.0-lite",
			name: "ByteDance Seed: Seed-2.0-Lite",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .25,
				output: 2,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 131072
		},
		"bytedance-seed/seed-2.0-mini": {
			id: "bytedance-seed/seed-2.0-mini",
			name: "ByteDance Seed: Seed-2.0-Mini",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .09999999999999999,
				output: .39999999999999997,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 131072
		},
		"cohere/command-r-08-2024": {
			id: "cohere/command-r-08-2024",
			name: "Cohere: Command R (08-2024)",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .15,
				output: .6,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4e3
		},
		"cohere/command-r-plus-08-2024": {
			id: "cohere/command-r-plus-08-2024",
			name: "Cohere: Command R+ (08-2024)",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 2.5,
				output: 10,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4e3
		},
		"deepseek/deepseek-chat": {
			id: "deepseek/deepseek-chat",
			name: "DeepSeek: DeepSeek V3",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .32,
				output: .8899999999999999,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 163840,
			maxTokens: 163840
		},
		"deepseek/deepseek-chat-v3-0324": {
			id: "deepseek/deepseek-chat-v3-0324",
			name: "DeepSeek: DeepSeek V3 0324",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .19999999999999998,
				output: .77,
				cacheRead: .135,
				cacheWrite: 0
			},
			contextWindow: 163840,
			maxTokens: 4096
		},
		"deepseek/deepseek-chat-v3.1": {
			id: "deepseek/deepseek-chat-v3.1",
			name: "DeepSeek: DeepSeek V3.1",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .15,
				output: .75,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 32768,
			maxTokens: 7168
		},
		"deepseek/deepseek-r1": {
			id: "deepseek/deepseek-r1",
			name: "DeepSeek: R1",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .7,
				output: 2.5,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 64e3,
			maxTokens: 16e3
		},
		"deepseek/deepseek-r1-0528": {
			id: "deepseek/deepseek-r1-0528",
			name: "DeepSeek: R1 0528",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .44999999999999996,
				output: 2.1500000000000004,
				cacheRead: .22499999999999998,
				cacheWrite: 0
			},
			contextWindow: 163840,
			maxTokens: 65536
		},
		"deepseek/deepseek-v3.1-terminus": {
			id: "deepseek/deepseek-v3.1-terminus",
			name: "DeepSeek: DeepSeek V3.1 Terminus",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .21,
				output: .78,
				cacheRead: .105,
				cacheWrite: 0
			},
			contextWindow: 163840,
			maxTokens: 65536
		},
		"deepseek/deepseek-v3.2": {
			id: "deepseek/deepseek-v3.2",
			name: "DeepSeek: DeepSeek V3.2",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .26,
				output: .38,
				cacheRead: .13,
				cacheWrite: 0
			},
			contextWindow: 163840,
			maxTokens: 4096
		},
		"deepseek/deepseek-v3.2-exp": {
			id: "deepseek/deepseek-v3.2-exp",
			name: "DeepSeek: DeepSeek V3.2 Exp",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .27,
				output: .41,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 163840,
			maxTokens: 65536
		},
		"essentialai/rnj-1-instruct": {
			id: "essentialai/rnj-1-instruct",
			name: "EssentialAI: Rnj 1 Instruct",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .15,
				output: .15,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 32768,
			maxTokens: 4096
		},
		"google/gemini-2.0-flash-001": {
			id: "google/gemini-2.0-flash-001",
			name: "Google: Gemini 2.0 Flash",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .09999999999999999,
				output: .39999999999999997,
				cacheRead: .024999999999999998,
				cacheWrite: .08333333333333334
			},
			contextWindow: 1048576,
			maxTokens: 8192
		},
		"google/gemini-2.0-flash-lite-001": {
			id: "google/gemini-2.0-flash-lite-001",
			name: "Google: Gemini 2.0 Flash Lite",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .075,
				output: .3,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 8192
		},
		"google/gemini-2.5-flash": {
			id: "google/gemini-2.5-flash",
			name: "Google: Gemini 2.5 Flash",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .3,
				output: 2.5,
				cacheRead: .03,
				cacheWrite: .08333333333333334
			},
			contextWindow: 1048576,
			maxTokens: 65535
		},
		"google/gemini-2.5-flash-lite": {
			id: "google/gemini-2.5-flash-lite",
			name: "Google: Gemini 2.5 Flash Lite",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .09999999999999999,
				output: .39999999999999997,
				cacheRead: .01,
				cacheWrite: .08333333333333334
			},
			contextWindow: 1048576,
			maxTokens: 65535
		},
		"google/gemini-2.5-flash-lite-preview-09-2025": {
			id: "google/gemini-2.5-flash-lite-preview-09-2025",
			name: "Google: Gemini 2.5 Flash Lite Preview 09-2025",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .09999999999999999,
				output: .39999999999999997,
				cacheRead: .01,
				cacheWrite: .08333333333333334
			},
			contextWindow: 1048576,
			maxTokens: 65536
		},
		"google/gemini-2.5-pro": {
			id: "google/gemini-2.5-pro",
			name: "Google: Gemini 2.5 Pro",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.25,
				output: 10,
				cacheRead: .125,
				cacheWrite: .375
			},
			contextWindow: 1048576,
			maxTokens: 65536
		},
		"google/gemini-2.5-pro-preview": {
			id: "google/gemini-2.5-pro-preview",
			name: "Google: Gemini 2.5 Pro Preview 06-05",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.25,
				output: 10,
				cacheRead: .125,
				cacheWrite: .375
			},
			contextWindow: 1048576,
			maxTokens: 65536
		},
		"google/gemini-2.5-pro-preview-05-06": {
			id: "google/gemini-2.5-pro-preview-05-06",
			name: "Google: Gemini 2.5 Pro Preview 05-06",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.25,
				output: 10,
				cacheRead: .125,
				cacheWrite: .375
			},
			contextWindow: 1048576,
			maxTokens: 65535
		},
		"google/gemini-3-flash-preview": {
			id: "google/gemini-3-flash-preview",
			name: "Google: Gemini 3 Flash Preview",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .5,
				output: 3,
				cacheRead: .049999999999999996,
				cacheWrite: .08333333333333334
			},
			contextWindow: 1048576,
			maxTokens: 65536
		},
		"google/gemini-3-pro-preview": {
			id: "google/gemini-3-pro-preview",
			name: "Google: Gemini 3 Pro Preview",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 2,
				output: 12,
				cacheRead: .19999999999999998,
				cacheWrite: .375
			},
			contextWindow: 1048576,
			maxTokens: 65536
		},
		"google/gemini-3.1-flash-lite-preview": {
			id: "google/gemini-3.1-flash-lite-preview",
			name: "Google: Gemini 3.1 Flash Lite Preview",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .25,
				output: 1.5,
				cacheRead: .024999999999999998,
				cacheWrite: .08333333333333334
			},
			contextWindow: 1048576,
			maxTokens: 65536
		},
		"google/gemini-3.1-pro-preview": {
			id: "google/gemini-3.1-pro-preview",
			name: "Google: Gemini 3.1 Pro Preview",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 2,
				output: 12,
				cacheRead: .19999999999999998,
				cacheWrite: .375
			},
			contextWindow: 1048576,
			maxTokens: 65536
		},
		"google/gemini-3.1-pro-preview-customtools": {
			id: "google/gemini-3.1-pro-preview-customtools",
			name: "Google: Gemini 3.1 Pro Preview Custom Tools",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 2,
				output: 12,
				cacheRead: .19999999999999998,
				cacheWrite: .375
			},
			contextWindow: 1048576,
			maxTokens: 65536
		},
		"inception/mercury": {
			id: "inception/mercury",
			name: "Inception: Mercury",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .25,
				output: .75,
				cacheRead: .024999999999999998,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 32e3
		},
		"inception/mercury-2": {
			id: "inception/mercury-2",
			name: "Inception: Mercury 2",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .25,
				output: .75,
				cacheRead: .024999999999999998,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 5e4
		},
		"inception/mercury-coder": {
			id: "inception/mercury-coder",
			name: "Inception: Mercury Coder",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .25,
				output: .75,
				cacheRead: .024999999999999998,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 32e3
		},
		"kwaipilot/kat-coder-pro": {
			id: "kwaipilot/kat-coder-pro",
			name: "Kwaipilot: KAT-Coder-Pro V1",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .207,
				output: .828,
				cacheRead: .0414,
				cacheWrite: 0
			},
			contextWindow: 256e3,
			maxTokens: 128e3
		},
		"meituan/longcat-flash-chat": {
			id: "meituan/longcat-flash-chat",
			name: "Meituan: LongCat Flash Chat",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .19999999999999998,
				output: .7999999999999999,
				cacheRead: .19999999999999998,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 131072
		},
		"meta-llama/llama-3-8b-instruct": {
			id: "meta-llama/llama-3-8b-instruct",
			name: "Meta: Llama 3 8B Instruct",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .03,
				output: .04,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 8192,
			maxTokens: 16384
		},
		"meta-llama/llama-3.1-70b-instruct": {
			id: "meta-llama/llama-3.1-70b-instruct",
			name: "Meta: Llama 3.1 70B Instruct",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .39999999999999997,
				output: .39999999999999997,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 4096
		},
		"meta-llama/llama-3.1-8b-instruct": {
			id: "meta-llama/llama-3.1-8b-instruct",
			name: "Meta: Llama 3.1 8B Instruct",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .02,
				output: .049999999999999996,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 16384,
			maxTokens: 16384
		},
		"meta-llama/llama-3.3-70b-instruct": {
			id: "meta-llama/llama-3.3-70b-instruct",
			name: "Meta: Llama 3.3 70B Instruct",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .09999999999999999,
				output: .32,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 16384
		},
		"meta-llama/llama-3.3-70b-instruct:free": {
			id: "meta-llama/llama-3.3-70b-instruct:free",
			name: "Meta: Llama 3.3 70B Instruct (free)",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 65536,
			maxTokens: 4096
		},
		"meta-llama/llama-4-maverick": {
			id: "meta-llama/llama-4-maverick",
			name: "Meta: Llama 4 Maverick",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .15,
				output: .6,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 16384
		},
		"meta-llama/llama-4-scout": {
			id: "meta-llama/llama-4-scout",
			name: "Meta: Llama 4 Scout",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .08,
				output: .3,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 327680,
			maxTokens: 16384
		},
		"minimax/minimax-m1": {
			id: "minimax/minimax-m1",
			name: "MiniMax: MiniMax M1",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .39999999999999997,
				output: 2.2,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 1e6,
			maxTokens: 4e4
		},
		"minimax/minimax-m2": {
			id: "minimax/minimax-m2",
			name: "MiniMax: MiniMax M2",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .255,
				output: 1,
				cacheRead: .03,
				cacheWrite: 0
			},
			contextWindow: 196608,
			maxTokens: 196608
		},
		"minimax/minimax-m2.1": {
			id: "minimax/minimax-m2.1",
			name: "MiniMax: MiniMax M2.1",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .27,
				output: .95,
				cacheRead: .0290000007,
				cacheWrite: 0
			},
			contextWindow: 196608,
			maxTokens: 4096
		},
		"minimax/minimax-m2.5": {
			id: "minimax/minimax-m2.5",
			name: "MiniMax: MiniMax M2.5",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .19999999999999998,
				output: 1.17,
				cacheRead: .09999999999999999,
				cacheWrite: 0
			},
			contextWindow: 196608,
			maxTokens: 65536
		},
		"minimax/minimax-m2.5:free": {
			id: "minimax/minimax-m2.5:free",
			name: "MiniMax: MiniMax M2.5 (free)",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 196608,
			maxTokens: 196608
		},
		"minimax/minimax-m2.7": {
			id: "minimax/minimax-m2.7",
			name: "MiniMax: MiniMax M2.7",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .3,
				output: 1.2,
				cacheRead: .06,
				cacheWrite: 0
			},
			contextWindow: 204800,
			maxTokens: 131072
		},
		"mistralai/codestral-2508": {
			id: "mistralai/codestral-2508",
			name: "Mistral: Codestral 2508",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .3,
				output: .8999999999999999,
				cacheRead: .03,
				cacheWrite: 0
			},
			contextWindow: 256e3,
			maxTokens: 4096
		},
		"mistralai/devstral-2512": {
			id: "mistralai/devstral-2512",
			name: "Mistral: Devstral 2 2512",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .39999999999999997,
				output: 2,
				cacheRead: .04,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 4096
		},
		"mistralai/devstral-medium": {
			id: "mistralai/devstral-medium",
			name: "Mistral: Devstral Medium",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .39999999999999997,
				output: 2,
				cacheRead: .04,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 4096
		},
		"mistralai/devstral-small": {
			id: "mistralai/devstral-small",
			name: "Mistral: Devstral Small 1.1",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .09999999999999999,
				output: .3,
				cacheRead: .01,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 4096
		},
		"mistralai/ministral-14b-2512": {
			id: "mistralai/ministral-14b-2512",
			name: "Mistral: Ministral 3 14B 2512",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .19999999999999998,
				output: .19999999999999998,
				cacheRead: .02,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 4096
		},
		"mistralai/ministral-3b-2512": {
			id: "mistralai/ministral-3b-2512",
			name: "Mistral: Ministral 3 3B 2512",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .09999999999999999,
				output: .09999999999999999,
				cacheRead: .01,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 4096
		},
		"mistralai/ministral-8b-2512": {
			id: "mistralai/ministral-8b-2512",
			name: "Mistral: Ministral 3 8B 2512",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .15,
				output: .15,
				cacheRead: .015,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 4096
		},
		"mistralai/mistral-large": {
			id: "mistralai/mistral-large",
			name: "Mistral Large",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 2,
				output: 6,
				cacheRead: .19999999999999998,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4096
		},
		"mistralai/mistral-large-2407": {
			id: "mistralai/mistral-large-2407",
			name: "Mistral Large 2407",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 2,
				output: 6,
				cacheRead: .19999999999999998,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 4096
		},
		"mistralai/mistral-large-2411": {
			id: "mistralai/mistral-large-2411",
			name: "Mistral Large 2411",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 2,
				output: 6,
				cacheRead: .19999999999999998,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 4096
		},
		"mistralai/mistral-large-2512": {
			id: "mistralai/mistral-large-2512",
			name: "Mistral: Mistral Large 3 2512",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .5,
				output: 1.5,
				cacheRead: .049999999999999996,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 4096
		},
		"mistralai/mistral-medium-3": {
			id: "mistralai/mistral-medium-3",
			name: "Mistral: Mistral Medium 3",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .39999999999999997,
				output: 2,
				cacheRead: .04,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 4096
		},
		"mistralai/mistral-medium-3.1": {
			id: "mistralai/mistral-medium-3.1",
			name: "Mistral: Mistral Medium 3.1",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .39999999999999997,
				output: 2,
				cacheRead: .04,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 4096
		},
		"mistralai/mistral-nemo": {
			id: "mistralai/mistral-nemo",
			name: "Mistral: Mistral Nemo",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .02,
				output: .04,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 16384
		},
		"mistralai/mistral-saba": {
			id: "mistralai/mistral-saba",
			name: "Mistral: Saba",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .19999999999999998,
				output: .6,
				cacheRead: .02,
				cacheWrite: 0
			},
			contextWindow: 32768,
			maxTokens: 4096
		},
		"mistralai/mistral-small-24b-instruct-2501": {
			id: "mistralai/mistral-small-24b-instruct-2501",
			name: "Mistral: Mistral Small 3",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .049999999999999996,
				output: .08,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 32768,
			maxTokens: 16384
		},
		"mistralai/mistral-small-2603": {
			id: "mistralai/mistral-small-2603",
			name: "Mistral: Mistral Small 4",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .15,
				output: .6,
				cacheRead: .015,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 4096
		},
		"mistralai/mistral-small-3.1-24b-instruct:free": {
			id: "mistralai/mistral-small-3.1-24b-instruct:free",
			name: "Mistral: Mistral Small 3.1 24B (free)",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4096
		},
		"mistralai/mistral-small-3.2-24b-instruct": {
			id: "mistralai/mistral-small-3.2-24b-instruct",
			name: "Mistral: Mistral Small 3.2 24B",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .075,
				output: .19999999999999998,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4096
		},
		"mistralai/mistral-small-creative": {
			id: "mistralai/mistral-small-creative",
			name: "Mistral: Mistral Small Creative",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .09999999999999999,
				output: .3,
				cacheRead: .01,
				cacheWrite: 0
			},
			contextWindow: 32768,
			maxTokens: 4096
		},
		"mistralai/mixtral-8x22b-instruct": {
			id: "mistralai/mixtral-8x22b-instruct",
			name: "Mistral: Mixtral 8x22B Instruct",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 2,
				output: 6,
				cacheRead: .19999999999999998,
				cacheWrite: 0
			},
			contextWindow: 65536,
			maxTokens: 4096
		},
		"mistralai/mixtral-8x7b-instruct": {
			id: "mistralai/mixtral-8x7b-instruct",
			name: "Mistral: Mixtral 8x7B Instruct",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .54,
				output: .54,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 32768,
			maxTokens: 16384
		},
		"mistralai/pixtral-large-2411": {
			id: "mistralai/pixtral-large-2411",
			name: "Mistral: Pixtral Large 2411",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 2,
				output: 6,
				cacheRead: .19999999999999998,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 4096
		},
		"mistralai/voxtral-small-24b-2507": {
			id: "mistralai/voxtral-small-24b-2507",
			name: "Mistral: Voxtral Small 24B 2507",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .09999999999999999,
				output: .3,
				cacheRead: .01,
				cacheWrite: 0
			},
			contextWindow: 32e3,
			maxTokens: 4096
		},
		"moonshotai/kimi-k2": {
			id: "moonshotai/kimi-k2",
			name: "MoonshotAI: Kimi K2 0711",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .55,
				output: 2.2,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131e3,
			maxTokens: 4096
		},
		"moonshotai/kimi-k2-0905": {
			id: "moonshotai/kimi-k2-0905",
			name: "MoonshotAI: Kimi K2 0905",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .39999999999999997,
				output: 2,
				cacheRead: .15,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 4096
		},
		"moonshotai/kimi-k2-thinking": {
			id: "moonshotai/kimi-k2-thinking",
			name: "MoonshotAI: Kimi K2 Thinking",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .47,
				output: 2,
				cacheRead: .14100000000000001,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 4096
		},
		"moonshotai/kimi-k2.5": {
			id: "moonshotai/kimi-k2.5",
			name: "MoonshotAI: Kimi K2.5",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .41,
				output: 2.06,
				cacheRead: .07,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 4096
		},
		"nex-agi/deepseek-v3.1-nex-n1": {
			id: "nex-agi/deepseek-v3.1-nex-n1",
			name: "Nex AGI: DeepSeek V3.1 Nex N1",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .27,
				output: 1,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 163840
		},
		"nvidia/llama-3.1-nemotron-70b-instruct": {
			id: "nvidia/llama-3.1-nemotron-70b-instruct",
			name: "NVIDIA: Llama 3.1 Nemotron 70B Instruct",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 1.2,
				output: 1.2,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 16384
		},
		"nvidia/llama-3.3-nemotron-super-49b-v1.5": {
			id: "nvidia/llama-3.3-nemotron-super-49b-v1.5",
			name: "NVIDIA: Llama 3.3 Nemotron Super 49B V1.5",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .09999999999999999,
				output: .39999999999999997,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 4096
		},
		"nvidia/nemotron-3-nano-30b-a3b": {
			id: "nvidia/nemotron-3-nano-30b-a3b",
			name: "NVIDIA: Nemotron 3 Nano 30B A3B",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .049999999999999996,
				output: .19999999999999998,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 4096
		},
		"nvidia/nemotron-3-nano-30b-a3b:free": {
			id: "nvidia/nemotron-3-nano-30b-a3b:free",
			name: "NVIDIA: Nemotron 3 Nano 30B A3B (free)",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 256e3,
			maxTokens: 4096
		},
		"nvidia/nemotron-3-super-120b-a12b": {
			id: "nvidia/nemotron-3-super-120b-a12b",
			name: "NVIDIA: Nemotron 3 Super",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .09999999999999999,
				output: .5,
				cacheRead: .04,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 4096
		},
		"nvidia/nemotron-3-super-120b-a12b:free": {
			id: "nvidia/nemotron-3-super-120b-a12b:free",
			name: "NVIDIA: Nemotron 3 Super (free)",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 262144
		},
		"nvidia/nemotron-nano-12b-v2-vl:free": {
			id: "nvidia/nemotron-nano-12b-v2-vl:free",
			name: "NVIDIA: Nemotron Nano 12B 2 VL (free)",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 128e3
		},
		"nvidia/nemotron-nano-9b-v2": {
			id: "nvidia/nemotron-nano-9b-v2",
			name: "NVIDIA: Nemotron Nano 9B V2",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .04,
				output: .16,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 4096
		},
		"nvidia/nemotron-nano-9b-v2:free": {
			id: "nvidia/nemotron-nano-9b-v2:free",
			name: "NVIDIA: Nemotron Nano 9B V2 (free)",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4096
		},
		"openai/gpt-3.5-turbo": {
			id: "openai/gpt-3.5-turbo",
			name: "OpenAI: GPT-3.5 Turbo",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .5,
				output: 1.5,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 16385,
			maxTokens: 4096
		},
		"openai/gpt-3.5-turbo-0613": {
			id: "openai/gpt-3.5-turbo-0613",
			name: "OpenAI: GPT-3.5 Turbo (older v0613)",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 1,
				output: 2,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 4095,
			maxTokens: 4096
		},
		"openai/gpt-3.5-turbo-16k": {
			id: "openai/gpt-3.5-turbo-16k",
			name: "OpenAI: GPT-3.5 Turbo 16k",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 3,
				output: 4,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 16385,
			maxTokens: 4096
		},
		"openai/gpt-4": {
			id: "openai/gpt-4",
			name: "OpenAI: GPT-4",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 30,
				output: 60,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 8191,
			maxTokens: 4096
		},
		"openai/gpt-4-0314": {
			id: "openai/gpt-4-0314",
			name: "OpenAI: GPT-4 (older v0314)",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 30,
				output: 60,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 8191,
			maxTokens: 4096
		},
		"openai/gpt-4-1106-preview": {
			id: "openai/gpt-4-1106-preview",
			name: "OpenAI: GPT-4 Turbo (older v1106)",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 10,
				output: 30,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4096
		},
		"openai/gpt-4-turbo": {
			id: "openai/gpt-4-turbo",
			name: "OpenAI: GPT-4 Turbo",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 10,
				output: 30,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4096
		},
		"openai/gpt-4-turbo-preview": {
			id: "openai/gpt-4-turbo-preview",
			name: "OpenAI: GPT-4 Turbo Preview",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 10,
				output: 30,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4096
		},
		"openai/gpt-4.1": {
			id: "openai/gpt-4.1",
			name: "OpenAI: GPT-4.1",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 2,
				output: 8,
				cacheRead: .5,
				cacheWrite: 0
			},
			contextWindow: 1047576,
			maxTokens: 32768
		},
		"openai/gpt-4.1-mini": {
			id: "openai/gpt-4.1-mini",
			name: "OpenAI: GPT-4.1 Mini",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .39999999999999997,
				output: 1.5999999999999999,
				cacheRead: .09999999999999999,
				cacheWrite: 0
			},
			contextWindow: 1047576,
			maxTokens: 32768
		},
		"openai/gpt-4.1-nano": {
			id: "openai/gpt-4.1-nano",
			name: "OpenAI: GPT-4.1 Nano",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .09999999999999999,
				output: .39999999999999997,
				cacheRead: .024999999999999998,
				cacheWrite: 0
			},
			contextWindow: 1047576,
			maxTokens: 32768
		},
		"openai/gpt-4o": {
			id: "openai/gpt-4o",
			name: "OpenAI: GPT-4o",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 2.5,
				output: 10,
				cacheRead: 1.25,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 16384
		},
		"openai/gpt-4o-2024-05-13": {
			id: "openai/gpt-4o-2024-05-13",
			name: "OpenAI: GPT-4o (2024-05-13)",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 5,
				output: 15,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4096
		},
		"openai/gpt-4o-2024-08-06": {
			id: "openai/gpt-4o-2024-08-06",
			name: "OpenAI: GPT-4o (2024-08-06)",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 2.5,
				output: 10,
				cacheRead: 1.25,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 16384
		},
		"openai/gpt-4o-2024-11-20": {
			id: "openai/gpt-4o-2024-11-20",
			name: "OpenAI: GPT-4o (2024-11-20)",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 2.5,
				output: 10,
				cacheRead: 1.25,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 16384
		},
		"openai/gpt-4o-audio-preview": {
			id: "openai/gpt-4o-audio-preview",
			name: "OpenAI: GPT-4o Audio",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 2.5,
				output: 10,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 16384
		},
		"openai/gpt-4o-mini": {
			id: "openai/gpt-4o-mini",
			name: "OpenAI: GPT-4o-mini",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .15,
				output: .6,
				cacheRead: .075,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 16384
		},
		"openai/gpt-4o-mini-2024-07-18": {
			id: "openai/gpt-4o-mini-2024-07-18",
			name: "OpenAI: GPT-4o-mini (2024-07-18)",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .15,
				output: .6,
				cacheRead: .075,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 16384
		},
		"openai/gpt-4o:extended": {
			id: "openai/gpt-4o:extended",
			name: "OpenAI: GPT-4o (extended)",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 6,
				output: 18,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 64e3
		},
		"openai/gpt-5": {
			id: "openai/gpt-5",
			name: "OpenAI: GPT-5",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.25,
				output: 10,
				cacheRead: .125,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"openai/gpt-5-codex": {
			id: "openai/gpt-5-codex",
			name: "OpenAI: GPT-5 Codex",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.25,
				output: 10,
				cacheRead: .125,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"openai/gpt-5-image": {
			id: "openai/gpt-5-image",
			name: "OpenAI: GPT-5 Image",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 10,
				output: 10,
				cacheRead: 1.25,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"openai/gpt-5-image-mini": {
			id: "openai/gpt-5-image-mini",
			name: "OpenAI: GPT-5 Image Mini",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 2.5,
				output: 2,
				cacheRead: .25,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"openai/gpt-5-mini": {
			id: "openai/gpt-5-mini",
			name: "OpenAI: GPT-5 Mini",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .25,
				output: 2,
				cacheRead: .024999999999999998,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"openai/gpt-5-nano": {
			id: "openai/gpt-5-nano",
			name: "OpenAI: GPT-5 Nano",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .049999999999999996,
				output: .39999999999999997,
				cacheRead: .005,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"openai/gpt-5-pro": {
			id: "openai/gpt-5-pro",
			name: "OpenAI: GPT-5 Pro",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 15,
				output: 120,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"openai/gpt-5.1": {
			id: "openai/gpt-5.1",
			name: "OpenAI: GPT-5.1",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.25,
				output: 10,
				cacheRead: .125,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"openai/gpt-5.1-chat": {
			id: "openai/gpt-5.1-chat",
			name: "OpenAI: GPT-5.1 Chat",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 1.25,
				output: 10,
				cacheRead: .125,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 16384
		},
		"openai/gpt-5.1-codex": {
			id: "openai/gpt-5.1-codex",
			name: "OpenAI: GPT-5.1-Codex",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.25,
				output: 10,
				cacheRead: .125,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"openai/gpt-5.1-codex-max": {
			id: "openai/gpt-5.1-codex-max",
			name: "OpenAI: GPT-5.1-Codex-Max",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.25,
				output: 10,
				cacheRead: .125,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"openai/gpt-5.1-codex-mini": {
			id: "openai/gpt-5.1-codex-mini",
			name: "OpenAI: GPT-5.1-Codex-Mini",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .25,
				output: 2,
				cacheRead: .024999999999999998,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 1e5
		},
		"openai/gpt-5.2": {
			id: "openai/gpt-5.2",
			name: "OpenAI: GPT-5.2",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.75,
				output: 14,
				cacheRead: .175,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"openai/gpt-5.2-chat": {
			id: "openai/gpt-5.2-chat",
			name: "OpenAI: GPT-5.2 Chat",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 1.75,
				output: 14,
				cacheRead: .175,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 16384
		},
		"openai/gpt-5.2-codex": {
			id: "openai/gpt-5.2-codex",
			name: "OpenAI: GPT-5.2-Codex",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.75,
				output: 14,
				cacheRead: .175,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"openai/gpt-5.2-pro": {
			id: "openai/gpt-5.2-pro",
			name: "OpenAI: GPT-5.2 Pro",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 21,
				output: 168,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"openai/gpt-5.3-chat": {
			id: "openai/gpt-5.3-chat",
			name: "OpenAI: GPT-5.3 Chat",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 1.75,
				output: 14,
				cacheRead: .175,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 16384
		},
		"openai/gpt-5.3-codex": {
			id: "openai/gpt-5.3-codex",
			name: "OpenAI: GPT-5.3-Codex",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.75,
				output: 14,
				cacheRead: .175,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"openai/gpt-5.4": {
			id: "openai/gpt-5.4",
			name: "OpenAI: GPT-5.4",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 2.5,
				output: 15,
				cacheRead: .25,
				cacheWrite: 0
			},
			contextWindow: 105e4,
			maxTokens: 128e3
		},
		"openai/gpt-5.4-mini": {
			id: "openai/gpt-5.4-mini",
			name: "OpenAI: GPT-5.4 Mini",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .75,
				output: 4.5,
				cacheRead: .075,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"openai/gpt-5.4-nano": {
			id: "openai/gpt-5.4-nano",
			name: "OpenAI: GPT-5.4 Nano",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .19999999999999998,
				output: 1.25,
				cacheRead: .02,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"openai/gpt-5.4-pro": {
			id: "openai/gpt-5.4-pro",
			name: "OpenAI: GPT-5.4 Pro",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 30,
				output: 180,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 105e4,
			maxTokens: 128e3
		},
		"openai/gpt-oss-120b": {
			id: "openai/gpt-oss-120b",
			name: "OpenAI: gpt-oss-120b",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .039,
				output: .19,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 4096
		},
		"openai/gpt-oss-120b:free": {
			id: "openai/gpt-oss-120b:free",
			name: "OpenAI: gpt-oss-120b (free)",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 131072
		},
		"openai/gpt-oss-20b": {
			id: "openai/gpt-oss-20b",
			name: "OpenAI: gpt-oss-20b",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .03,
				output: .14,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 4096
		},
		"openai/gpt-oss-20b:free": {
			id: "openai/gpt-oss-20b:free",
			name: "OpenAI: gpt-oss-20b (free)",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 131072
		},
		"openai/gpt-oss-safeguard-20b": {
			id: "openai/gpt-oss-safeguard-20b",
			name: "OpenAI: gpt-oss-safeguard-20b",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .075,
				output: .3,
				cacheRead: .037,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 65536
		},
		"openai/o1": {
			id: "openai/o1",
			name: "OpenAI: o1",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 15,
				output: 60,
				cacheRead: 7.5,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 1e5
		},
		"openai/o3": {
			id: "openai/o3",
			name: "OpenAI: o3",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 2,
				output: 8,
				cacheRead: .5,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 1e5
		},
		"openai/o3-deep-research": {
			id: "openai/o3-deep-research",
			name: "OpenAI: o3 Deep Research",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 10,
				output: 40,
				cacheRead: 2.5,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 1e5
		},
		"openai/o3-mini": {
			id: "openai/o3-mini",
			name: "OpenAI: o3 Mini",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 1.1,
				output: 4.4,
				cacheRead: .55,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 1e5
		},
		"openai/o3-mini-high": {
			id: "openai/o3-mini-high",
			name: "OpenAI: o3 Mini High",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 1.1,
				output: 4.4,
				cacheRead: .55,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 1e5
		},
		"openai/o3-pro": {
			id: "openai/o3-pro",
			name: "OpenAI: o3 Pro",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 20,
				output: 80,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 1e5
		},
		"openai/o4-mini": {
			id: "openai/o4-mini",
			name: "OpenAI: o4 Mini",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.1,
				output: 4.4,
				cacheRead: .275,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 1e5
		},
		"openai/o4-mini-deep-research": {
			id: "openai/o4-mini-deep-research",
			name: "OpenAI: o4 Mini Deep Research",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 2,
				output: 8,
				cacheRead: .5,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 1e5
		},
		"openai/o4-mini-high": {
			id: "openai/o4-mini-high",
			name: "OpenAI: o4 Mini High",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.1,
				output: 4.4,
				cacheRead: .275,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 1e5
		},
		"openrouter/auto": {
			id: "openrouter/auto",
			name: "Auto Router",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: -1e6,
				output: -1e6,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 2e6,
			maxTokens: 4096
		},
		"openrouter/free": {
			id: "openrouter/free",
			name: "Free Models Router",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 4096
		},
		"prime-intellect/intellect-3": {
			id: "prime-intellect/intellect-3",
			name: "Prime Intellect: INTELLECT-3",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .19999999999999998,
				output: 1.1,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 131072
		},
		"qwen/qwen-2.5-72b-instruct": {
			id: "qwen/qwen-2.5-72b-instruct",
			name: "Qwen2.5 72B Instruct",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .12,
				output: .39,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 32768,
			maxTokens: 16384
		},
		"qwen/qwen-2.5-7b-instruct": {
			id: "qwen/qwen-2.5-7b-instruct",
			name: "Qwen: Qwen2.5 7B Instruct",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .04,
				output: .09999999999999999,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 32768,
			maxTokens: 4096
		},
		"qwen/qwen-max": {
			id: "qwen/qwen-max",
			name: "Qwen: Qwen-Max ",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 1.04,
				output: 4.16,
				cacheRead: .20800000000000002,
				cacheWrite: 0
			},
			contextWindow: 32768,
			maxTokens: 8192
		},
		"qwen/qwen-plus": {
			id: "qwen/qwen-plus",
			name: "Qwen: Qwen-Plus",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .26,
				output: .78,
				cacheRead: .052000000000000005,
				cacheWrite: 0
			},
			contextWindow: 1e6,
			maxTokens: 32768
		},
		"qwen/qwen-plus-2025-07-28": {
			id: "qwen/qwen-plus-2025-07-28",
			name: "Qwen: Qwen Plus 0728",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .26,
				output: .78,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 1e6,
			maxTokens: 32768
		},
		"qwen/qwen-plus-2025-07-28:thinking": {
			id: "qwen/qwen-plus-2025-07-28:thinking",
			name: "Qwen: Qwen Plus 0728 (thinking)",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .26,
				output: .78,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 1e6,
			maxTokens: 32768
		},
		"qwen/qwen-turbo": {
			id: "qwen/qwen-turbo",
			name: "Qwen: Qwen-Turbo",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .0325,
				output: .13,
				cacheRead: .006500000000000001,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 8192
		},
		"qwen/qwen-vl-max": {
			id: "qwen/qwen-vl-max",
			name: "Qwen: Qwen VL Max",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .52,
				output: 2.08,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 32768
		},
		"qwen/qwen3-14b": {
			id: "qwen/qwen3-14b",
			name: "Qwen: Qwen3 14B",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .06,
				output: .24,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 40960,
			maxTokens: 40960
		},
		"qwen/qwen3-235b-a22b": {
			id: "qwen/qwen3-235b-a22b",
			name: "Qwen: Qwen3 235B A22B",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .45499999999999996,
				output: 1.8199999999999998,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 8192
		},
		"qwen/qwen3-235b-a22b-2507": {
			id: "qwen/qwen3-235b-a22b-2507",
			name: "Qwen: Qwen3 235B A22B Instruct 2507",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .071,
				output: .09999999999999999,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 4096
		},
		"qwen/qwen3-235b-a22b-thinking-2507": {
			id: "qwen/qwen3-235b-a22b-thinking-2507",
			name: "Qwen: Qwen3 235B A22B Thinking 2507",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .14950000000000002,
				output: 1.495,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 4096
		},
		"qwen/qwen3-30b-a3b": {
			id: "qwen/qwen3-30b-a3b",
			name: "Qwen: Qwen3 30B A3B",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .08,
				output: .28,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 40960,
			maxTokens: 40960
		},
		"qwen/qwen3-30b-a3b-instruct-2507": {
			id: "qwen/qwen3-30b-a3b-instruct-2507",
			name: "Qwen: Qwen3 30B A3B Instruct 2507",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .09,
				output: .3,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 262144
		},
		"qwen/qwen3-30b-a3b-thinking-2507": {
			id: "qwen/qwen3-30b-a3b-thinking-2507",
			name: "Qwen: Qwen3 30B A3B Thinking 2507",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .08,
				output: .39999999999999997,
				cacheRead: .08,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 131072
		},
		"qwen/qwen3-32b": {
			id: "qwen/qwen3-32b",
			name: "Qwen: Qwen3 32B",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .08,
				output: .24,
				cacheRead: .04,
				cacheWrite: 0
			},
			contextWindow: 40960,
			maxTokens: 40960
		},
		"qwen/qwen3-4b:free": {
			id: "qwen/qwen3-4b:free",
			name: "Qwen: Qwen3 4B (free)",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 40960,
			maxTokens: 4096
		},
		"qwen/qwen3-8b": {
			id: "qwen/qwen3-8b",
			name: "Qwen: Qwen3 8B",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .049999999999999996,
				output: .39999999999999997,
				cacheRead: .049999999999999996,
				cacheWrite: 0
			},
			contextWindow: 40960,
			maxTokens: 8192
		},
		"qwen/qwen3-coder": {
			id: "qwen/qwen3-coder",
			name: "Qwen: Qwen3 Coder 480B A35B",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .22,
				output: 1,
				cacheRead: .022,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 4096
		},
		"qwen/qwen3-coder-30b-a3b-instruct": {
			id: "qwen/qwen3-coder-30b-a3b-instruct",
			name: "Qwen: Qwen3 Coder 30B A3B Instruct",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .07,
				output: .27,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 16e4,
			maxTokens: 32768
		},
		"qwen/qwen3-coder-flash": {
			id: "qwen/qwen3-coder-flash",
			name: "Qwen: Qwen3 Coder Flash",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .195,
				output: .975,
				cacheRead: .039,
				cacheWrite: 0
			},
			contextWindow: 1e6,
			maxTokens: 65536
		},
		"qwen/qwen3-coder-next": {
			id: "qwen/qwen3-coder-next",
			name: "Qwen: Qwen3 Coder Next",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .12,
				output: .75,
				cacheRead: .06,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 65536
		},
		"qwen/qwen3-coder-plus": {
			id: "qwen/qwen3-coder-plus",
			name: "Qwen: Qwen3 Coder Plus",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .65,
				output: 3.25,
				cacheRead: .13,
				cacheWrite: 0
			},
			contextWindow: 1e6,
			maxTokens: 65536
		},
		"qwen/qwen3-coder:free": {
			id: "qwen/qwen3-coder:free",
			name: "Qwen: Qwen3 Coder 480B A35B (free)",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 262e3,
			maxTokens: 262e3
		},
		"qwen/qwen3-max": {
			id: "qwen/qwen3-max",
			name: "Qwen: Qwen3 Max",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .78,
				output: 3.9,
				cacheRead: .156,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 32768
		},
		"qwen/qwen3-max-thinking": {
			id: "qwen/qwen3-max-thinking",
			name: "Qwen: Qwen3 Max Thinking",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .78,
				output: 3.9,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 32768
		},
		"qwen/qwen3-next-80b-a3b-instruct": {
			id: "qwen/qwen3-next-80b-a3b-instruct",
			name: "Qwen: Qwen3 Next 80B A3B Instruct",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .09,
				output: 1.1,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 4096
		},
		"qwen/qwen3-next-80b-a3b-instruct:free": {
			id: "qwen/qwen3-next-80b-a3b-instruct:free",
			name: "Qwen: Qwen3 Next 80B A3B Instruct (free)",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 4096
		},
		"qwen/qwen3-next-80b-a3b-thinking": {
			id: "qwen/qwen3-next-80b-a3b-thinking",
			name: "Qwen: Qwen3 Next 80B A3B Thinking",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .0975,
				output: .78,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 32768
		},
		"qwen/qwen3-vl-235b-a22b-instruct": {
			id: "qwen/qwen3-vl-235b-a22b-instruct",
			name: "Qwen: Qwen3 VL 235B A22B Instruct",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .19999999999999998,
				output: .88,
				cacheRead: .11,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 4096
		},
		"qwen/qwen3-vl-235b-a22b-thinking": {
			id: "qwen/qwen3-vl-235b-a22b-thinking",
			name: "Qwen: Qwen3 VL 235B A22B Thinking",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .26,
				output: 2.6,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 32768
		},
		"qwen/qwen3-vl-30b-a3b-instruct": {
			id: "qwen/qwen3-vl-30b-a3b-instruct",
			name: "Qwen: Qwen3 VL 30B A3B Instruct",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .13,
				output: .52,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 32768
		},
		"qwen/qwen3-vl-30b-a3b-thinking": {
			id: "qwen/qwen3-vl-30b-a3b-thinking",
			name: "Qwen: Qwen3 VL 30B A3B Thinking",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .13,
				output: 1.56,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 32768
		},
		"qwen/qwen3-vl-32b-instruct": {
			id: "qwen/qwen3-vl-32b-instruct",
			name: "Qwen: Qwen3 VL 32B Instruct",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .10400000000000001,
				output: .41600000000000004,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 32768
		},
		"qwen/qwen3-vl-8b-instruct": {
			id: "qwen/qwen3-vl-8b-instruct",
			name: "Qwen: Qwen3 VL 8B Instruct",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .08,
				output: .5,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 32768
		},
		"qwen/qwen3-vl-8b-thinking": {
			id: "qwen/qwen3-vl-8b-thinking",
			name: "Qwen: Qwen3 VL 8B Thinking",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .117,
				output: 1.365,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 32768
		},
		"qwen/qwen3.5-122b-a10b": {
			id: "qwen/qwen3.5-122b-a10b",
			name: "Qwen: Qwen3.5-122B-A10B",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .26,
				output: 2.08,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 65536
		},
		"qwen/qwen3.5-27b": {
			id: "qwen/qwen3.5-27b",
			name: "Qwen: Qwen3.5-27B",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .195,
				output: 1.56,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 65536
		},
		"qwen/qwen3.5-35b-a3b": {
			id: "qwen/qwen3.5-35b-a3b",
			name: "Qwen: Qwen3.5-35B-A3B",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .1625,
				output: 1.3,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 65536
		},
		"qwen/qwen3.5-397b-a17b": {
			id: "qwen/qwen3.5-397b-a17b",
			name: "Qwen: Qwen3.5 397B A17B",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .39,
				output: 2.34,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 65536
		},
		"qwen/qwen3.5-9b": {
			id: "qwen/qwen3.5-9b",
			name: "Qwen: Qwen3.5-9B",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .049999999999999996,
				output: .15,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 256e3,
			maxTokens: 4096
		},
		"qwen/qwen3.5-flash-02-23": {
			id: "qwen/qwen3.5-flash-02-23",
			name: "Qwen: Qwen3.5-Flash",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .065,
				output: .26,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 1e6,
			maxTokens: 65536
		},
		"qwen/qwen3.5-plus-02-15": {
			id: "qwen/qwen3.5-plus-02-15",
			name: "Qwen: Qwen3.5 Plus 2026-02-15",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .26,
				output: 1.56,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 1e6,
			maxTokens: 65536
		},
		"qwen/qwq-32b": {
			id: "qwen/qwq-32b",
			name: "Qwen: QwQ 32B",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .15,
				output: .58,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 131072
		},
		"relace/relace-search": {
			id: "relace/relace-search",
			name: "Relace: Relace Search",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 1,
				output: 3,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 256e3,
			maxTokens: 128e3
		},
		"sao10k/l3-euryale-70b": {
			id: "sao10k/l3-euryale-70b",
			name: "Sao10k: Llama 3 Euryale 70B v2.1",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 1.48,
				output: 1.48,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 8192,
			maxTokens: 8192
		},
		"sao10k/l3.1-euryale-70b": {
			id: "sao10k/l3.1-euryale-70b",
			name: "Sao10K: Llama 3.1 Euryale 70B v2.2",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .85,
				output: .85,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 16384
		},
		"stepfun/step-3.5-flash": {
			id: "stepfun/step-3.5-flash",
			name: "StepFun: Step 3.5 Flash",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .09999999999999999,
				output: .3,
				cacheRead: .02,
				cacheWrite: 0
			},
			contextWindow: 256e3,
			maxTokens: 256e3
		},
		"stepfun/step-3.5-flash:free": {
			id: "stepfun/step-3.5-flash:free",
			name: "StepFun: Step 3.5 Flash (free)",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 256e3,
			maxTokens: 256e3
		},
		"thedrummer/rocinante-12b": {
			id: "thedrummer/rocinante-12b",
			name: "TheDrummer: Rocinante 12B",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .16999999999999998,
				output: .43,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 32768,
			maxTokens: 32768
		},
		"thedrummer/unslopnemo-12b": {
			id: "thedrummer/unslopnemo-12b",
			name: "TheDrummer: UnslopNemo 12B",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .39999999999999997,
				output: .39999999999999997,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 32768,
			maxTokens: 32768
		},
		"tngtech/deepseek-r1t2-chimera": {
			id: "tngtech/deepseek-r1t2-chimera",
			name: "TNG: DeepSeek R1T2 Chimera",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .25,
				output: .85,
				cacheRead: .125,
				cacheWrite: 0
			},
			contextWindow: 163840,
			maxTokens: 163840
		},
		"upstage/solar-pro-3": {
			id: "upstage/solar-pro-3",
			name: "Upstage: Solar Pro 3",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .15,
				output: .6,
				cacheRead: .015,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4096
		},
		"x-ai/grok-3": {
			id: "x-ai/grok-3",
			name: "xAI: Grok 3",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .75,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 4096
		},
		"x-ai/grok-3-beta": {
			id: "x-ai/grok-3-beta",
			name: "xAI: Grok 3 Beta",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .75,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 4096
		},
		"x-ai/grok-3-mini": {
			id: "x-ai/grok-3-mini",
			name: "xAI: Grok 3 Mini",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .3,
				output: .5,
				cacheRead: .075,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 4096
		},
		"x-ai/grok-3-mini-beta": {
			id: "x-ai/grok-3-mini-beta",
			name: "xAI: Grok 3 Mini Beta",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .3,
				output: .5,
				cacheRead: .075,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 4096
		},
		"x-ai/grok-4": {
			id: "x-ai/grok-4",
			name: "xAI: Grok 4",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .75,
				cacheWrite: 0
			},
			contextWindow: 256e3,
			maxTokens: 4096
		},
		"x-ai/grok-4-fast": {
			id: "x-ai/grok-4-fast",
			name: "xAI: Grok 4 Fast",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .19999999999999998,
				output: .5,
				cacheRead: .049999999999999996,
				cacheWrite: 0
			},
			contextWindow: 2e6,
			maxTokens: 3e4
		},
		"x-ai/grok-4.1-fast": {
			id: "x-ai/grok-4.1-fast",
			name: "xAI: Grok 4.1 Fast",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .19999999999999998,
				output: .5,
				cacheRead: .049999999999999996,
				cacheWrite: 0
			},
			contextWindow: 2e6,
			maxTokens: 3e4
		},
		"x-ai/grok-4.20-beta": {
			id: "x-ai/grok-4.20-beta",
			name: "xAI: Grok 4.20 Beta",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 2,
				output: 6,
				cacheRead: .19999999999999998,
				cacheWrite: 0
			},
			contextWindow: 2e6,
			maxTokens: 4096
		},
		"x-ai/grok-code-fast-1": {
			id: "x-ai/grok-code-fast-1",
			name: "xAI: Grok Code Fast 1",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .19999999999999998,
				output: 1.5,
				cacheRead: .02,
				cacheWrite: 0
			},
			contextWindow: 256e3,
			maxTokens: 1e4
		},
		"xiaomi/mimo-v2-flash": {
			id: "xiaomi/mimo-v2-flash",
			name: "Xiaomi: MiMo-V2-Flash",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .09,
				output: .29,
				cacheRead: .045,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 65536
		},
		"xiaomi/mimo-v2-omni": {
			id: "xiaomi/mimo-v2-omni",
			name: "Xiaomi: MiMo-V2-Omni",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .39999999999999997,
				output: 2,
				cacheRead: .08,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 65536
		},
		"xiaomi/mimo-v2-pro": {
			id: "xiaomi/mimo-v2-pro",
			name: "Xiaomi: MiMo-V2-Pro",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 1,
				output: 3,
				cacheRead: .19999999999999998,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 131072
		},
		"z-ai/glm-4-32b": {
			id: "z-ai/glm-4-32b",
			name: "Z.ai: GLM 4 32B ",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .09999999999999999,
				output: .09999999999999999,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4096
		},
		"z-ai/glm-4.5": {
			id: "z-ai/glm-4.5",
			name: "Z.ai: GLM 4.5",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .6,
				output: 2.2,
				cacheRead: .11,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 98304
		},
		"z-ai/glm-4.5-air": {
			id: "z-ai/glm-4.5-air",
			name: "Z.ai: GLM 4.5 Air",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .13,
				output: .85,
				cacheRead: .024999999999999998,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 98304
		},
		"z-ai/glm-4.5-air:free": {
			id: "z-ai/glm-4.5-air:free",
			name: "Z.ai: GLM 4.5 Air (free)",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 96e3
		},
		"z-ai/glm-4.5v": {
			id: "z-ai/glm-4.5v",
			name: "Z.ai: GLM 4.5V",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .6,
				output: 1.7999999999999998,
				cacheRead: .11,
				cacheWrite: 0
			},
			contextWindow: 65536,
			maxTokens: 16384
		},
		"z-ai/glm-4.6": {
			id: "z-ai/glm-4.6",
			name: "Z.ai: GLM 4.6",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .39,
				output: 1.9,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 204800,
			maxTokens: 204800
		},
		"z-ai/glm-4.6v": {
			id: "z-ai/glm-4.6v",
			name: "Z.ai: GLM 4.6V",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .3,
				output: .8999999999999999,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 131072
		},
		"z-ai/glm-4.7": {
			id: "z-ai/glm-4.7",
			name: "Z.ai: GLM 4.7",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .39,
				output: 1.75,
				cacheRead: .195,
				cacheWrite: 0
			},
			contextWindow: 202752,
			maxTokens: 65535
		},
		"z-ai/glm-4.7-flash": {
			id: "z-ai/glm-4.7-flash",
			name: "Z.ai: GLM 4.7 Flash",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .06,
				output: .39999999999999997,
				cacheRead: .0100000002,
				cacheWrite: 0
			},
			contextWindow: 202752,
			maxTokens: 4096
		},
		"z-ai/glm-5": {
			id: "z-ai/glm-5",
			name: "Z.ai: GLM 5",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .6,
				output: 1.9,
				cacheRead: .119,
				cacheWrite: 0
			},
			contextWindow: 8e4,
			maxTokens: 131072
		},
		"z-ai/glm-5-turbo": {
			id: "z-ai/glm-5-turbo",
			name: "Z.ai: GLM 5 Turbo",
			api: "openai-completions",
			provider: "openrouter",
			baseUrl: "https://openrouter.ai/api/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .96,
				output: 3.1999999999999997,
				cacheRead: .192,
				cacheWrite: 0
			},
			contextWindow: 202752,
			maxTokens: 131072
		}
	},
	"vercel-ai-gateway": {
		"alibaba/qwen-3-14b": {
			id: "alibaba/qwen-3-14b",
			name: "Qwen3-14B",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .12,
				output: .24,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 40960,
			maxTokens: 16384
		},
		"alibaba/qwen-3-235b": {
			id: "alibaba/qwen-3-235b",
			name: "Qwen3-235B-A22B",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .071,
				output: .463,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 40960,
			maxTokens: 16384
		},
		"alibaba/qwen-3-30b": {
			id: "alibaba/qwen-3-30b",
			name: "Qwen3-30B-A3B",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .08,
				output: .29,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 40960,
			maxTokens: 16384
		},
		"alibaba/qwen-3-32b": {
			id: "alibaba/qwen-3-32b",
			name: "Qwen 3 32B",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .29,
				output: .59,
				cacheRead: .145,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 40960
		},
		"alibaba/qwen3-235b-a22b-thinking": {
			id: "alibaba/qwen3-235b-a22b-thinking",
			name: "Qwen3 235B A22B Thinking 2507",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .22999999999999998,
				output: 2.3,
				cacheRead: .19999999999999998,
				cacheWrite: 0
			},
			contextWindow: 262114,
			maxTokens: 262114
		},
		"alibaba/qwen3-coder": {
			id: "alibaba/qwen3-coder",
			name: "Qwen3 Coder 480B A35B Instruct",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .39999999999999997,
				output: 1.5999999999999999,
				cacheRead: .022,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 66536
		},
		"alibaba/qwen3-coder-30b-a3b": {
			id: "alibaba/qwen3-coder-30b-a3b",
			name: "Qwen 3 Coder 30B A3B Instruct",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .15,
				output: .6,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 8192
		},
		"alibaba/qwen3-coder-next": {
			id: "alibaba/qwen3-coder-next",
			name: "Qwen3 Coder Next",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .5,
				output: 1.2,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 256e3,
			maxTokens: 256e3
		},
		"alibaba/qwen3-coder-plus": {
			id: "alibaba/qwen3-coder-plus",
			name: "Qwen3 Coder Plus",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 1,
				output: 5,
				cacheRead: .19999999999999998,
				cacheWrite: 0
			},
			contextWindow: 1e6,
			maxTokens: 65536
		},
		"alibaba/qwen3-max": {
			id: "alibaba/qwen3-max",
			name: "Qwen3 Max",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 1.2,
				output: 6,
				cacheRead: .24,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 32768
		},
		"alibaba/qwen3-max-preview": {
			id: "alibaba/qwen3-max-preview",
			name: "Qwen3 Max Preview",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 1.2,
				output: 6,
				cacheRead: .24,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 32768
		},
		"alibaba/qwen3-max-thinking": {
			id: "alibaba/qwen3-max-thinking",
			name: "Qwen 3 Max Thinking",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 1.2,
				output: 6,
				cacheRead: .24,
				cacheWrite: 0
			},
			contextWindow: 256e3,
			maxTokens: 65536
		},
		"alibaba/qwen3-vl-thinking": {
			id: "alibaba/qwen3-vl-thinking",
			name: "Qwen3 VL 235B A22B Thinking",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .22,
				output: .88,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 256e3,
			maxTokens: 256e3
		},
		"alibaba/qwen3.5-flash": {
			id: "alibaba/qwen3.5-flash",
			name: "Qwen 3.5 Flash",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .09999999999999999,
				output: .39999999999999997,
				cacheRead: .001,
				cacheWrite: .125
			},
			contextWindow: 1e6,
			maxTokens: 64e3
		},
		"alibaba/qwen3.5-plus": {
			id: "alibaba/qwen3.5-plus",
			name: "Qwen 3.5 Plus",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .39999999999999997,
				output: 2.4,
				cacheRead: .04,
				cacheWrite: .5
			},
			contextWindow: 1e6,
			maxTokens: 64e3
		},
		"anthropic/claude-3-haiku": {
			id: "anthropic/claude-3-haiku",
			name: "Claude 3 Haiku",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .25,
				output: 1.25,
				cacheRead: .03,
				cacheWrite: .3
			},
			contextWindow: 2e5,
			maxTokens: 4096
		},
		"anthropic/claude-3.5-haiku": {
			id: "anthropic/claude-3.5-haiku",
			name: "Claude 3.5 Haiku",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .7999999999999999,
				output: 4,
				cacheRead: .08,
				cacheWrite: 1
			},
			contextWindow: 2e5,
			maxTokens: 8192
		},
		"anthropic/claude-3.5-sonnet": {
			id: "anthropic/claude-3.5-sonnet",
			name: "Claude 3.5 Sonnet",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 2e5,
			maxTokens: 8192
		},
		"anthropic/claude-3.5-sonnet-20240620": {
			id: "anthropic/claude-3.5-sonnet-20240620",
			name: "Claude 3.5 Sonnet (2024-06-20)",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 2e5,
			maxTokens: 8192
		},
		"anthropic/claude-3.7-sonnet": {
			id: "anthropic/claude-3.7-sonnet",
			name: "Claude 3.7 Sonnet",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 2e5,
			maxTokens: 8192
		},
		"anthropic/claude-haiku-4.5": {
			id: "anthropic/claude-haiku-4.5",
			name: "Claude Haiku 4.5",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1,
				output: 5,
				cacheRead: .09999999999999999,
				cacheWrite: 1.25
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"anthropic/claude-opus-4": {
			id: "anthropic/claude-opus-4",
			name: "Claude Opus 4",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 15,
				output: 75,
				cacheRead: 1.5,
				cacheWrite: 18.75
			},
			contextWindow: 2e5,
			maxTokens: 32e3
		},
		"anthropic/claude-opus-4.1": {
			id: "anthropic/claude-opus-4.1",
			name: "Claude Opus 4.1",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 15,
				output: 75,
				cacheRead: 1.5,
				cacheWrite: 18.75
			},
			contextWindow: 2e5,
			maxTokens: 32e3
		},
		"anthropic/claude-opus-4.5": {
			id: "anthropic/claude-opus-4.5",
			name: "Claude Opus 4.5",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 5,
				output: 25,
				cacheRead: .5,
				cacheWrite: 6.25
			},
			contextWindow: 2e5,
			maxTokens: 64e3
		},
		"anthropic/claude-opus-4.6": {
			id: "anthropic/claude-opus-4.6",
			name: "Claude Opus 4.6",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 5,
				output: 25,
				cacheRead: .5,
				cacheWrite: 6.25
			},
			contextWindow: 1e6,
			maxTokens: 128e3
		},
		"anthropic/claude-sonnet-4": {
			id: "anthropic/claude-sonnet-4",
			name: "Claude Sonnet 4",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 1e6,
			maxTokens: 64e3
		},
		"anthropic/claude-sonnet-4.5": {
			id: "anthropic/claude-sonnet-4.5",
			name: "Claude Sonnet 4.5",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 1e6,
			maxTokens: 64e3
		},
		"anthropic/claude-sonnet-4.6": {
			id: "anthropic/claude-sonnet-4.6",
			name: "Claude Sonnet 4.6",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			contextWindow: 1e6,
			maxTokens: 128e3
		},
		"arcee-ai/trinity-large-preview": {
			id: "arcee-ai/trinity-large-preview",
			name: "Trinity Large Preview",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .25,
				output: 1,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131e3,
			maxTokens: 131e3
		},
		"bytedance/seed-1.6": {
			id: "bytedance/seed-1.6",
			name: "Seed 1.6",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .25,
				output: 2,
				cacheRead: .049999999999999996,
				cacheWrite: 0
			},
			contextWindow: 256e3,
			maxTokens: 32e3
		},
		"cohere/command-a": {
			id: "cohere/command-a",
			name: "Command A",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 2.5,
				output: 10,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 256e3,
			maxTokens: 8e3
		},
		"deepseek/deepseek-r1": {
			id: "deepseek/deepseek-r1",
			name: "DeepSeek-R1",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 1.35,
				output: 5.4,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 8192
		},
		"deepseek/deepseek-v3": {
			id: "deepseek/deepseek-v3",
			name: "DeepSeek V3 0324",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .77,
				output: .77,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 163840,
			maxTokens: 16384
		},
		"deepseek/deepseek-v3.1": {
			id: "deepseek/deepseek-v3.1",
			name: "DeepSeek-V3.1",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .5,
				output: 1.5,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 163840,
			maxTokens: 16384
		},
		"deepseek/deepseek-v3.1-terminus": {
			id: "deepseek/deepseek-v3.1-terminus",
			name: "DeepSeek V3.1 Terminus",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .27,
				output: 1,
				cacheRead: .135,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 65536
		},
		"deepseek/deepseek-v3.2": {
			id: "deepseek/deepseek-v3.2",
			name: "DeepSeek V3.2",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .28,
				output: .42,
				cacheRead: .028,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 8e3
		},
		"deepseek/deepseek-v3.2-thinking": {
			id: "deepseek/deepseek-v3.2-thinking",
			name: "DeepSeek V3.2 Thinking",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .28,
				output: .42,
				cacheRead: .028,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 64e3
		},
		"google/gemini-2.0-flash": {
			id: "google/gemini-2.0-flash",
			name: "Gemini 2.0 Flash",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .15,
				output: .6,
				cacheRead: .024999999999999998,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 8192
		},
		"google/gemini-2.0-flash-lite": {
			id: "google/gemini-2.0-flash-lite",
			name: "Gemini 2.0 Flash Lite",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .075,
				output: .3,
				cacheRead: .02,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 8192
		},
		"google/gemini-2.5-flash": {
			id: "google/gemini-2.5-flash",
			name: "Gemini 2.5 Flash",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .3,
				output: 2.5,
				cacheRead: .03,
				cacheWrite: 0
			},
			contextWindow: 1e6,
			maxTokens: 65536
		},
		"google/gemini-2.5-flash-lite": {
			id: "google/gemini-2.5-flash-lite",
			name: "Gemini 2.5 Flash Lite",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .09999999999999999,
				output: .39999999999999997,
				cacheRead: .01,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 65536
		},
		"google/gemini-2.5-pro": {
			id: "google/gemini-2.5-pro",
			name: "Gemini 2.5 Pro",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.25,
				output: 10,
				cacheRead: .125,
				cacheWrite: 0
			},
			contextWindow: 1048576,
			maxTokens: 65536
		},
		"google/gemini-3-flash": {
			id: "google/gemini-3-flash",
			name: "Gemini 3 Flash",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .5,
				output: 3,
				cacheRead: .049999999999999996,
				cacheWrite: 0
			},
			contextWindow: 1e6,
			maxTokens: 65e3
		},
		"google/gemini-3-pro-preview": {
			id: "google/gemini-3-pro-preview",
			name: "Gemini 3 Pro Preview",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 2,
				output: 12,
				cacheRead: .19999999999999998,
				cacheWrite: 0
			},
			contextWindow: 1e6,
			maxTokens: 64e3
		},
		"google/gemini-3.1-flash-lite-preview": {
			id: "google/gemini-3.1-flash-lite-preview",
			name: "Gemini 3.1 Flash Lite Preview",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .25,
				output: 1.5,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 1e6,
			maxTokens: 65e3
		},
		"google/gemini-3.1-pro-preview": {
			id: "google/gemini-3.1-pro-preview",
			name: "Gemini 3.1 Pro Preview",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 2,
				output: 12,
				cacheRead: .19999999999999998,
				cacheWrite: 0
			},
			contextWindow: 1e6,
			maxTokens: 64e3
		},
		"inception/mercury-2": {
			id: "inception/mercury-2",
			name: "Mercury 2",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .25,
				output: .75,
				cacheRead: .024999999999999998,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 128e3
		},
		"inception/mercury-coder-small": {
			id: "inception/mercury-coder-small",
			name: "Mercury Coder Small Beta",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .25,
				output: 1,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 32e3,
			maxTokens: 16384
		},
		"meituan/longcat-flash-chat": {
			id: "meituan/longcat-flash-chat",
			name: "LongCat Flash Chat",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 1e5
		},
		"meituan/longcat-flash-thinking": {
			id: "meituan/longcat-flash-thinking",
			name: "LongCat Flash Thinking",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .15,
				output: 1.5,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 8192
		},
		"meta/llama-3.1-70b": {
			id: "meta/llama-3.1-70b",
			name: "Llama 3.1 70B Instruct",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .72,
				output: .72,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 8192
		},
		"meta/llama-3.1-8b": {
			id: "meta/llama-3.1-8b",
			name: "Llama 3.1 8B Instruct",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .09999999999999999,
				output: .09999999999999999,
				cacheRead: .09999999999999999,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 16384
		},
		"meta/llama-3.2-11b": {
			id: "meta/llama-3.2-11b",
			name: "Llama 3.2 11B Vision Instruct",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .16,
				output: .16,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 8192
		},
		"meta/llama-3.2-90b": {
			id: "meta/llama-3.2-90b",
			name: "Llama 3.2 90B Vision Instruct",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .72,
				output: .72,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 8192
		},
		"meta/llama-3.3-70b": {
			id: "meta/llama-3.3-70b",
			name: "Llama 3.3 70B Instruct",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .72,
				output: .72,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 8192
		},
		"meta/llama-4-maverick": {
			id: "meta/llama-4-maverick",
			name: "Llama 4 Maverick 17B Instruct",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .24,
				output: .9700000000000001,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 8192
		},
		"meta/llama-4-scout": {
			id: "meta/llama-4-scout",
			name: "Llama 4 Scout 17B Instruct",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .16999999999999998,
				output: .66,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 8192
		},
		"minimax/minimax-m2": {
			id: "minimax/minimax-m2",
			name: "MiniMax M2",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .3,
				output: 1.2,
				cacheRead: .03,
				cacheWrite: .375
			},
			contextWindow: 205e3,
			maxTokens: 205e3
		},
		"minimax/minimax-m2.1": {
			id: "minimax/minimax-m2.1",
			name: "MiniMax M2.1",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .3,
				output: 1.2,
				cacheRead: .03,
				cacheWrite: .375
			},
			contextWindow: 204800,
			maxTokens: 131072
		},
		"minimax/minimax-m2.1-lightning": {
			id: "minimax/minimax-m2.1-lightning",
			name: "MiniMax M2.1 Lightning",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .3,
				output: 2.4,
				cacheRead: .03,
				cacheWrite: .375
			},
			contextWindow: 204800,
			maxTokens: 131072
		},
		"minimax/minimax-m2.5": {
			id: "minimax/minimax-m2.5",
			name: "MiniMax M2.5",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .3,
				output: 1.2,
				cacheRead: .03,
				cacheWrite: .375
			},
			contextWindow: 204800,
			maxTokens: 131e3
		},
		"minimax/minimax-m2.5-highspeed": {
			id: "minimax/minimax-m2.5-highspeed",
			name: "MiniMax M2.5 High Speed",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .6,
				output: 2.4,
				cacheRead: .03,
				cacheWrite: .375
			},
			contextWindow: 204800,
			maxTokens: 131e3
		},
		"minimax/minimax-m2.7": {
			id: "minimax/minimax-m2.7",
			name: "Minimax M2.7",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .3,
				output: 1.2,
				cacheRead: .06,
				cacheWrite: .375
			},
			contextWindow: 204800,
			maxTokens: 131e3
		},
		"minimax/minimax-m2.7-highspeed": {
			id: "minimax/minimax-m2.7-highspeed",
			name: "MiniMax M2.7 High Speed",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .6,
				output: 2.4,
				cacheRead: .06,
				cacheWrite: .375
			},
			contextWindow: 204800,
			maxTokens: 131100
		},
		"mistral/codestral": {
			id: "mistral/codestral",
			name: "Mistral Codestral",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .3,
				output: .8999999999999999,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4e3
		},
		"mistral/devstral-2": {
			id: "mistral/devstral-2",
			name: "Devstral 2",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .39999999999999997,
				output: 2,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 256e3,
			maxTokens: 256e3
		},
		"mistral/devstral-small": {
			id: "mistral/devstral-small",
			name: "Devstral Small 1.1",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .09999999999999999,
				output: .3,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 64e3
		},
		"mistral/devstral-small-2": {
			id: "mistral/devstral-small-2",
			name: "Devstral Small 2",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .09999999999999999,
				output: .3,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 256e3,
			maxTokens: 256e3
		},
		"mistral/ministral-3b": {
			id: "mistral/ministral-3b",
			name: "Ministral 3B",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .09999999999999999,
				output: .09999999999999999,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4e3
		},
		"mistral/ministral-8b": {
			id: "mistral/ministral-8b",
			name: "Ministral 8B",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .15,
				output: .15,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4e3
		},
		"mistral/mistral-medium": {
			id: "mistral/mistral-medium",
			name: "Mistral Medium 3.1",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .39999999999999997,
				output: 2,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 64e3
		},
		"mistral/mistral-small": {
			id: "mistral/mistral-small",
			name: "Mistral Small",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .09999999999999999,
				output: .3,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 32e3,
			maxTokens: 4e3
		},
		"mistral/pixtral-12b": {
			id: "mistral/pixtral-12b",
			name: "Pixtral 12B 2409",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .15,
				output: .15,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4e3
		},
		"mistral/pixtral-large": {
			id: "mistral/pixtral-large",
			name: "Pixtral Large",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 2,
				output: 6,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4e3
		},
		"moonshotai/kimi-k2": {
			id: "moonshotai/kimi-k2",
			name: "Kimi K2",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .6,
				output: 2.5,
				cacheRead: .15,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 16384
		},
		"moonshotai/kimi-k2-0905": {
			id: "moonshotai/kimi-k2-0905",
			name: "Kimi K2 0905",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .6,
				output: 2.5,
				cacheRead: .15,
				cacheWrite: 0
			},
			contextWindow: 256e3,
			maxTokens: 16384
		},
		"moonshotai/kimi-k2-thinking": {
			id: "moonshotai/kimi-k2-thinking",
			name: "Kimi K2 Thinking",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .6,
				output: 2.5,
				cacheRead: .15,
				cacheWrite: 0
			},
			contextWindow: 262114,
			maxTokens: 262114
		},
		"moonshotai/kimi-k2-thinking-turbo": {
			id: "moonshotai/kimi-k2-thinking-turbo",
			name: "Kimi K2 Thinking Turbo",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 1.15,
				output: 8,
				cacheRead: .15,
				cacheWrite: 0
			},
			contextWindow: 262114,
			maxTokens: 262114
		},
		"moonshotai/kimi-k2-turbo": {
			id: "moonshotai/kimi-k2-turbo",
			name: "Kimi K2 Turbo",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 1.15,
				output: 8,
				cacheRead: .15,
				cacheWrite: 0
			},
			contextWindow: 256e3,
			maxTokens: 16384
		},
		"moonshotai/kimi-k2.5": {
			id: "moonshotai/kimi-k2.5",
			name: "Kimi K2.5",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .6,
				output: 3,
				cacheRead: .09999999999999999,
				cacheWrite: 0
			},
			contextWindow: 262114,
			maxTokens: 262114
		},
		"nvidia/nemotron-nano-12b-v2-vl": {
			id: "nvidia/nemotron-nano-12b-v2-vl",
			name: "Nvidia Nemotron Nano 12B V2 VL",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .19999999999999998,
				output: .6,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 131072
		},
		"nvidia/nemotron-nano-9b-v2": {
			id: "nvidia/nemotron-nano-9b-v2",
			name: "Nvidia Nemotron Nano 9B V2",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .06,
				output: .22999999999999998,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 131072
		},
		"openai/gpt-4-turbo": {
			id: "openai/gpt-4-turbo",
			name: "GPT-4 Turbo",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 10,
				output: 30,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 4096
		},
		"openai/gpt-4.1": {
			id: "openai/gpt-4.1",
			name: "GPT-4.1",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 2,
				output: 8,
				cacheRead: .5,
				cacheWrite: 0
			},
			contextWindow: 1047576,
			maxTokens: 32768
		},
		"openai/gpt-4.1-mini": {
			id: "openai/gpt-4.1-mini",
			name: "GPT-4.1 mini",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .39999999999999997,
				output: 1.5999999999999999,
				cacheRead: .09999999999999999,
				cacheWrite: 0
			},
			contextWindow: 1047576,
			maxTokens: 32768
		},
		"openai/gpt-4.1-nano": {
			id: "openai/gpt-4.1-nano",
			name: "GPT-4.1 nano",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .09999999999999999,
				output: .39999999999999997,
				cacheRead: .024999999999999998,
				cacheWrite: 0
			},
			contextWindow: 1047576,
			maxTokens: 32768
		},
		"openai/gpt-4o": {
			id: "openai/gpt-4o",
			name: "GPT-4o",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 2.5,
				output: 10,
				cacheRead: 1.25,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 16384
		},
		"openai/gpt-4o-mini": {
			id: "openai/gpt-4o-mini",
			name: "GPT-4o mini",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .15,
				output: .6,
				cacheRead: .075,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 16384
		},
		"openai/gpt-5": {
			id: "openai/gpt-5",
			name: "GPT-5",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.25,
				output: 10,
				cacheRead: .125,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"openai/gpt-5-chat": {
			id: "openai/gpt-5-chat",
			name: "GPT 5 Chat",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.25,
				output: 10,
				cacheRead: .125,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 16384
		},
		"openai/gpt-5-codex": {
			id: "openai/gpt-5-codex",
			name: "GPT-5-Codex",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 1.25,
				output: 10,
				cacheRead: .125,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"openai/gpt-5-mini": {
			id: "openai/gpt-5-mini",
			name: "GPT-5 mini",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .25,
				output: 2,
				cacheRead: .024999999999999998,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"openai/gpt-5-nano": {
			id: "openai/gpt-5-nano",
			name: "GPT-5 nano",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .049999999999999996,
				output: .39999999999999997,
				cacheRead: .005,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"openai/gpt-5-pro": {
			id: "openai/gpt-5-pro",
			name: "GPT-5 pro",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 15,
				output: 120,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 272e3
		},
		"openai/gpt-5.1-codex": {
			id: "openai/gpt-5.1-codex",
			name: "GPT-5.1-Codex",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.25,
				output: 10,
				cacheRead: .125,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"openai/gpt-5.1-codex-max": {
			id: "openai/gpt-5.1-codex-max",
			name: "GPT 5.1 Codex Max",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.25,
				output: 10,
				cacheRead: .125,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"openai/gpt-5.1-codex-mini": {
			id: "openai/gpt-5.1-codex-mini",
			name: "GPT 5.1 Codex Mini",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .25,
				output: 2,
				cacheRead: .024999999999999998,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"openai/gpt-5.1-instant": {
			id: "openai/gpt-5.1-instant",
			name: "GPT-5.1 Instant",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.25,
				output: 10,
				cacheRead: .125,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 16384
		},
		"openai/gpt-5.1-thinking": {
			id: "openai/gpt-5.1-thinking",
			name: "GPT 5.1 Thinking",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.25,
				output: 10,
				cacheRead: .125,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"openai/gpt-5.2": {
			id: "openai/gpt-5.2",
			name: "GPT 5.2",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.75,
				output: 14,
				cacheRead: .175,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"openai/gpt-5.2-chat": {
			id: "openai/gpt-5.2-chat",
			name: "GPT 5.2 Chat",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.75,
				output: 14,
				cacheRead: .175,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 16384
		},
		"openai/gpt-5.2-codex": {
			id: "openai/gpt-5.2-codex",
			name: "GPT 5.2 Codex",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.75,
				output: 14,
				cacheRead: .175,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"openai/gpt-5.2-pro": {
			id: "openai/gpt-5.2-pro",
			name: "GPT 5.2 ",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 21,
				output: 168,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"openai/gpt-5.3-chat": {
			id: "openai/gpt-5.3-chat",
			name: "GPT-5.3 Chat",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.75,
				output: 14,
				cacheRead: .175,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 16384
		},
		"openai/gpt-5.3-codex": {
			id: "openai/gpt-5.3-codex",
			name: "GPT 5.3 Codex",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.75,
				output: 14,
				cacheRead: .175,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"openai/gpt-5.4": {
			id: "openai/gpt-5.4",
			name: "GPT 5.4",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 2.5,
				output: 15,
				cacheRead: .25,
				cacheWrite: 0
			},
			contextWindow: 105e4,
			maxTokens: 128e3
		},
		"openai/gpt-5.4-mini": {
			id: "openai/gpt-5.4-mini",
			name: "GPT 5.4 Mini",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .75,
				output: 4.5,
				cacheRead: .075,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"openai/gpt-5.4-nano": {
			id: "openai/gpt-5.4-nano",
			name: "GPT 5.4 Nano",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .19999999999999998,
				output: 1.25,
				cacheRead: .02,
				cacheWrite: 0
			},
			contextWindow: 4e5,
			maxTokens: 128e3
		},
		"openai/gpt-5.4-pro": {
			id: "openai/gpt-5.4-pro",
			name: "GPT 5.4 Pro",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 30,
				output: 180,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 105e4,
			maxTokens: 128e3
		},
		"openai/gpt-oss-20b": {
			id: "openai/gpt-oss-20b",
			name: "gpt-oss-20b",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .07,
				output: .3,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 8192
		},
		"openai/gpt-oss-safeguard-20b": {
			id: "openai/gpt-oss-safeguard-20b",
			name: "gpt-oss-safeguard-20b",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .075,
				output: .3,
				cacheRead: .037,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 65536
		},
		"openai/o1": {
			id: "openai/o1",
			name: "o1",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 15,
				output: 60,
				cacheRead: 7.5,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 1e5
		},
		"openai/o3": {
			id: "openai/o3",
			name: "o3",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 2,
				output: 8,
				cacheRead: .5,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 1e5
		},
		"openai/o3-deep-research": {
			id: "openai/o3-deep-research",
			name: "o3-deep-research",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 10,
				output: 40,
				cacheRead: 2.5,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 1e5
		},
		"openai/o3-mini": {
			id: "openai/o3-mini",
			name: "o3-mini",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 1.1,
				output: 4.4,
				cacheRead: .55,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 1e5
		},
		"openai/o3-pro": {
			id: "openai/o3-pro",
			name: "o3 Pro",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 20,
				output: 80,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 1e5
		},
		"openai/o4-mini": {
			id: "openai/o4-mini",
			name: "o4-mini",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 1.1,
				output: 4.4,
				cacheRead: .275,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 1e5
		},
		"perplexity/sonar": {
			id: "perplexity/sonar",
			name: "Sonar",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 1,
				output: 1,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 127e3,
			maxTokens: 8e3
		},
		"perplexity/sonar-pro": {
			id: "perplexity/sonar-pro",
			name: "Sonar Pro",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 8e3
		},
		"prime-intellect/intellect-3": {
			id: "prime-intellect/intellect-3",
			name: "INTELLECT 3",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .19999999999999998,
				output: 1.1,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 131072
		},
		"xai/grok-2-vision": {
			id: "xai/grok-2-vision",
			name: "Grok 2 Vision",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 2,
				output: 10,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 32768,
			maxTokens: 32768
		},
		"xai/grok-3": {
			id: "xai/grok-3",
			name: "Grok 3 Beta",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .75,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 131072
		},
		"xai/grok-3-fast": {
			id: "xai/grok-3-fast",
			name: "Grok 3 Fast Beta",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 5,
				output: 25,
				cacheRead: 1.25,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 131072
		},
		"xai/grok-3-mini": {
			id: "xai/grok-3-mini",
			name: "Grok 3 Mini Beta",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .3,
				output: .5,
				cacheRead: .075,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 131072
		},
		"xai/grok-3-mini-fast": {
			id: "xai/grok-3-mini-fast",
			name: "Grok 3 Mini Fast Beta",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .6,
				output: 4,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 131072
		},
		"xai/grok-4": {
			id: "xai/grok-4",
			name: "Grok 4",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .75,
				cacheWrite: 0
			},
			contextWindow: 256e3,
			maxTokens: 256e3
		},
		"xai/grok-4-fast-non-reasoning": {
			id: "xai/grok-4-fast-non-reasoning",
			name: "Grok 4 Fast Non-Reasoning",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .19999999999999998,
				output: .5,
				cacheRead: .049999999999999996,
				cacheWrite: 0
			},
			contextWindow: 2e6,
			maxTokens: 256e3
		},
		"xai/grok-4-fast-reasoning": {
			id: "xai/grok-4-fast-reasoning",
			name: "Grok 4 Fast Reasoning",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .19999999999999998,
				output: .5,
				cacheRead: .049999999999999996,
				cacheWrite: 0
			},
			contextWindow: 2e6,
			maxTokens: 256e3
		},
		"xai/grok-4.1-fast-non-reasoning": {
			id: "xai/grok-4.1-fast-non-reasoning",
			name: "Grok 4.1 Fast Non-Reasoning",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: .19999999999999998,
				output: .5,
				cacheRead: .049999999999999996,
				cacheWrite: 0
			},
			contextWindow: 2e6,
			maxTokens: 3e4
		},
		"xai/grok-4.1-fast-reasoning": {
			id: "xai/grok-4.1-fast-reasoning",
			name: "Grok 4.1 Fast Reasoning",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .19999999999999998,
				output: .5,
				cacheRead: .049999999999999996,
				cacheWrite: 0
			},
			contextWindow: 2e6,
			maxTokens: 3e4
		},
		"xai/grok-4.20-multi-agent-beta": {
			id: "xai/grok-4.20-multi-agent-beta",
			name: "Grok 4.20 Multi Agent Beta",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 2,
				output: 6,
				cacheRead: .19999999999999998,
				cacheWrite: 0
			},
			contextWindow: 2e6,
			maxTokens: 2e6
		},
		"xai/grok-4.20-non-reasoning-beta": {
			id: "xai/grok-4.20-non-reasoning-beta",
			name: "Grok 4.20 Beta Non-Reasoning",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 2,
				output: 6,
				cacheRead: .19999999999999998,
				cacheWrite: 0
			},
			contextWindow: 2e6,
			maxTokens: 2e6
		},
		"xai/grok-4.20-reasoning-beta": {
			id: "xai/grok-4.20-reasoning-beta",
			name: "Grok 4.20 Beta Reasoning",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 2,
				output: 6,
				cacheRead: .19999999999999998,
				cacheWrite: 0
			},
			contextWindow: 2e6,
			maxTokens: 2e6
		},
		"xai/grok-code-fast-1": {
			id: "xai/grok-code-fast-1",
			name: "Grok Code Fast 1",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .19999999999999998,
				output: 1.5,
				cacheRead: .02,
				cacheWrite: 0
			},
			contextWindow: 256e3,
			maxTokens: 256e3
		},
		"xiaomi/mimo-v2-flash": {
			id: "xiaomi/mimo-v2-flash",
			name: "MiMo V2 Flash",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .09999999999999999,
				output: .3,
				cacheRead: .02,
				cacheWrite: 0
			},
			contextWindow: 262144,
			maxTokens: 32e3
		},
		"xiaomi/mimo-v2-pro": {
			id: "xiaomi/mimo-v2-pro",
			name: "MiMo V2 Pro",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 1,
				output: 3,
				cacheRead: .19999999999999998,
				cacheWrite: 0
			},
			contextWindow: 1e6,
			maxTokens: 128e3
		},
		"zai/glm-4.5": {
			id: "zai/glm-4.5",
			name: "GLM-4.5",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .6,
				output: 2.2,
				cacheRead: .11,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 96e3
		},
		"zai/glm-4.5-air": {
			id: "zai/glm-4.5-air",
			name: "GLM 4.5 Air",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .19999999999999998,
				output: 1.1,
				cacheRead: .03,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 96e3
		},
		"zai/glm-4.5v": {
			id: "zai/glm-4.5v",
			name: "GLM 4.5V",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .6,
				output: 1.7999999999999998,
				cacheRead: .11,
				cacheWrite: 0
			},
			contextWindow: 66e3,
			maxTokens: 16e3
		},
		"zai/glm-4.6": {
			id: "zai/glm-4.6",
			name: "GLM 4.6",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .6,
				output: 2.2,
				cacheRead: .11,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 96e3
		},
		"zai/glm-4.6v": {
			id: "zai/glm-4.6v",
			name: "GLM-4.6V",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .3,
				output: .8999999999999999,
				cacheRead: .049999999999999996,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 24e3
		},
		"zai/glm-4.6v-flash": {
			id: "zai/glm-4.6v-flash",
			name: "GLM-4.6V-Flash",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 24e3
		},
		"zai/glm-4.7": {
			id: "zai/glm-4.7",
			name: "GLM 4.7",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .6,
				output: 2.2,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 12e4
		},
		"zai/glm-4.7-flash": {
			id: "zai/glm-4.7-flash",
			name: "GLM 4.7 Flash",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .07,
				output: .39999999999999997,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 131e3
		},
		"zai/glm-4.7-flashx": {
			id: "zai/glm-4.7-flashx",
			name: "GLM 4.7 FlashX",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .06,
				output: .39999999999999997,
				cacheRead: .01,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 128e3
		},
		"zai/glm-5": {
			id: "zai/glm-5",
			name: "GLM 5",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 1,
				output: 3.1999999999999997,
				cacheRead: .19999999999999998,
				cacheWrite: 0
			},
			contextWindow: 202800,
			maxTokens: 131100
		},
		"zai/glm-5-turbo": {
			id: "zai/glm-5-turbo",
			name: "GLM 5 Turbo",
			api: "anthropic-messages",
			provider: "vercel-ai-gateway",
			baseUrl: "https://ai-gateway.vercel.sh",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 1.2,
				output: 4,
				cacheRead: .24,
				cacheWrite: 0
			},
			contextWindow: 202800,
			maxTokens: 131100
		}
	},
	xai: {
		"grok-2": {
			id: "grok-2",
			name: "Grok 2",
			api: "openai-completions",
			provider: "xai",
			baseUrl: "https://api.x.ai/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 2,
				output: 10,
				cacheRead: 2,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 8192
		},
		"grok-2-1212": {
			id: "grok-2-1212",
			name: "Grok 2 (1212)",
			api: "openai-completions",
			provider: "xai",
			baseUrl: "https://api.x.ai/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 2,
				output: 10,
				cacheRead: 2,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 8192
		},
		"grok-2-latest": {
			id: "grok-2-latest",
			name: "Grok 2 Latest",
			api: "openai-completions",
			provider: "xai",
			baseUrl: "https://api.x.ai/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 2,
				output: 10,
				cacheRead: 2,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 8192
		},
		"grok-2-vision": {
			id: "grok-2-vision",
			name: "Grok 2 Vision",
			api: "openai-completions",
			provider: "xai",
			baseUrl: "https://api.x.ai/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 2,
				output: 10,
				cacheRead: 2,
				cacheWrite: 0
			},
			contextWindow: 8192,
			maxTokens: 4096
		},
		"grok-2-vision-1212": {
			id: "grok-2-vision-1212",
			name: "Grok 2 Vision (1212)",
			api: "openai-completions",
			provider: "xai",
			baseUrl: "https://api.x.ai/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 2,
				output: 10,
				cacheRead: 2,
				cacheWrite: 0
			},
			contextWindow: 8192,
			maxTokens: 4096
		},
		"grok-2-vision-latest": {
			id: "grok-2-vision-latest",
			name: "Grok 2 Vision Latest",
			api: "openai-completions",
			provider: "xai",
			baseUrl: "https://api.x.ai/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 2,
				output: 10,
				cacheRead: 2,
				cacheWrite: 0
			},
			contextWindow: 8192,
			maxTokens: 4096
		},
		"grok-3": {
			id: "grok-3",
			name: "Grok 3",
			api: "openai-completions",
			provider: "xai",
			baseUrl: "https://api.x.ai/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .75,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 8192
		},
		"grok-3-fast": {
			id: "grok-3-fast",
			name: "Grok 3 Fast",
			api: "openai-completions",
			provider: "xai",
			baseUrl: "https://api.x.ai/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 5,
				output: 25,
				cacheRead: 1.25,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 8192
		},
		"grok-3-fast-latest": {
			id: "grok-3-fast-latest",
			name: "Grok 3 Fast Latest",
			api: "openai-completions",
			provider: "xai",
			baseUrl: "https://api.x.ai/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 5,
				output: 25,
				cacheRead: 1.25,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 8192
		},
		"grok-3-latest": {
			id: "grok-3-latest",
			name: "Grok 3 Latest",
			api: "openai-completions",
			provider: "xai",
			baseUrl: "https://api.x.ai/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .75,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 8192
		},
		"grok-3-mini": {
			id: "grok-3-mini",
			name: "Grok 3 Mini",
			api: "openai-completions",
			provider: "xai",
			baseUrl: "https://api.x.ai/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .3,
				output: .5,
				cacheRead: .075,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 8192
		},
		"grok-3-mini-fast": {
			id: "grok-3-mini-fast",
			name: "Grok 3 Mini Fast",
			api: "openai-completions",
			provider: "xai",
			baseUrl: "https://api.x.ai/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .6,
				output: 4,
				cacheRead: .15,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 8192
		},
		"grok-3-mini-fast-latest": {
			id: "grok-3-mini-fast-latest",
			name: "Grok 3 Mini Fast Latest",
			api: "openai-completions",
			provider: "xai",
			baseUrl: "https://api.x.ai/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .6,
				output: 4,
				cacheRead: .15,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 8192
		},
		"grok-3-mini-latest": {
			id: "grok-3-mini-latest",
			name: "Grok 3 Mini Latest",
			api: "openai-completions",
			provider: "xai",
			baseUrl: "https://api.x.ai/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .3,
				output: .5,
				cacheRead: .075,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 8192
		},
		"grok-4": {
			id: "grok-4",
			name: "Grok 4",
			api: "openai-completions",
			provider: "xai",
			baseUrl: "https://api.x.ai/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .75,
				cacheWrite: 0
			},
			contextWindow: 256e3,
			maxTokens: 64e3
		},
		"grok-4-1-fast": {
			id: "grok-4-1-fast",
			name: "Grok 4.1 Fast",
			api: "openai-completions",
			provider: "xai",
			baseUrl: "https://api.x.ai/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .2,
				output: .5,
				cacheRead: .05,
				cacheWrite: 0
			},
			contextWindow: 2e6,
			maxTokens: 3e4
		},
		"grok-4-1-fast-non-reasoning": {
			id: "grok-4-1-fast-non-reasoning",
			name: "Grok 4.1 Fast (Non-Reasoning)",
			api: "openai-completions",
			provider: "xai",
			baseUrl: "https://api.x.ai/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .2,
				output: .5,
				cacheRead: .05,
				cacheWrite: 0
			},
			contextWindow: 2e6,
			maxTokens: 3e4
		},
		"grok-4-fast": {
			id: "grok-4-fast",
			name: "Grok 4 Fast",
			api: "openai-completions",
			provider: "xai",
			baseUrl: "https://api.x.ai/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .2,
				output: .5,
				cacheRead: .05,
				cacheWrite: 0
			},
			contextWindow: 2e6,
			maxTokens: 3e4
		},
		"grok-4-fast-non-reasoning": {
			id: "grok-4-fast-non-reasoning",
			name: "Grok 4 Fast (Non-Reasoning)",
			api: "openai-completions",
			provider: "xai",
			baseUrl: "https://api.x.ai/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: .2,
				output: .5,
				cacheRead: .05,
				cacheWrite: 0
			},
			contextWindow: 2e6,
			maxTokens: 3e4
		},
		"grok-4.20-beta-latest-non-reasoning": {
			id: "grok-4.20-beta-latest-non-reasoning",
			name: "Grok 4.20 Beta (Non-Reasoning)",
			api: "openai-completions",
			provider: "xai",
			baseUrl: "https://api.x.ai/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 2,
				output: 6,
				cacheRead: .2,
				cacheWrite: 0
			},
			contextWindow: 2e6,
			maxTokens: 3e4
		},
		"grok-4.20-beta-latest-reasoning": {
			id: "grok-4.20-beta-latest-reasoning",
			name: "Grok 4.20 Beta (Reasoning)",
			api: "openai-completions",
			provider: "xai",
			baseUrl: "https://api.x.ai/v1",
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: 2,
				output: 6,
				cacheRead: .2,
				cacheWrite: 0
			},
			contextWindow: 2e6,
			maxTokens: 3e4
		},
		"grok-beta": {
			id: "grok-beta",
			name: "Grok Beta",
			api: "openai-completions",
			provider: "xai",
			baseUrl: "https://api.x.ai/v1",
			reasoning: !1,
			input: ["text"],
			cost: {
				input: 5,
				output: 15,
				cacheRead: 5,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 4096
		},
		"grok-code-fast-1": {
			id: "grok-code-fast-1",
			name: "Grok Code Fast 1",
			api: "openai-completions",
			provider: "xai",
			baseUrl: "https://api.x.ai/v1",
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .2,
				output: 1.5,
				cacheRead: .02,
				cacheWrite: 0
			},
			contextWindow: 256e3,
			maxTokens: 1e4
		},
		"grok-vision-beta": {
			id: "grok-vision-beta",
			name: "Grok Vision Beta",
			api: "openai-completions",
			provider: "xai",
			baseUrl: "https://api.x.ai/v1",
			reasoning: !1,
			input: ["text", "image"],
			cost: {
				input: 5,
				output: 15,
				cacheRead: 5,
				cacheWrite: 0
			},
			contextWindow: 8192,
			maxTokens: 4096
		}
	},
	zai: {
		"glm-4.5": {
			id: "glm-4.5",
			name: "GLM-4.5",
			api: "openai-completions",
			provider: "zai",
			baseUrl: "https://api.z.ai/api/coding/paas/v4",
			compat: {
				supportsDeveloperRole: !1,
				thinkingFormat: "zai"
			},
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .6,
				output: 2.2,
				cacheRead: .11,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 98304
		},
		"glm-4.5-air": {
			id: "glm-4.5-air",
			name: "GLM-4.5-Air",
			api: "openai-completions",
			provider: "zai",
			baseUrl: "https://api.z.ai/api/coding/paas/v4",
			compat: {
				supportsDeveloperRole: !1,
				thinkingFormat: "zai"
			},
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .2,
				output: 1.1,
				cacheRead: .03,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 98304
		},
		"glm-4.5-flash": {
			id: "glm-4.5-flash",
			name: "GLM-4.5-Flash",
			api: "openai-completions",
			provider: "zai",
			baseUrl: "https://api.z.ai/api/coding/paas/v4",
			compat: {
				supportsDeveloperRole: !1,
				thinkingFormat: "zai"
			},
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 131072,
			maxTokens: 98304
		},
		"glm-4.5v": {
			id: "glm-4.5v",
			name: "GLM-4.5V",
			api: "openai-completions",
			provider: "zai",
			baseUrl: "https://api.z.ai/api/coding/paas/v4",
			compat: {
				supportsDeveloperRole: !1,
				thinkingFormat: "zai"
			},
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .6,
				output: 1.8,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 64e3,
			maxTokens: 16384
		},
		"glm-4.6": {
			id: "glm-4.6",
			name: "GLM-4.6",
			api: "openai-completions",
			provider: "zai",
			baseUrl: "https://api.z.ai/api/coding/paas/v4",
			compat: {
				supportsDeveloperRole: !1,
				thinkingFormat: "zai"
			},
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .6,
				output: 2.2,
				cacheRead: .11,
				cacheWrite: 0
			},
			contextWindow: 204800,
			maxTokens: 131072
		},
		"glm-4.6v": {
			id: "glm-4.6v",
			name: "GLM-4.6V",
			api: "openai-completions",
			provider: "zai",
			baseUrl: "https://api.z.ai/api/coding/paas/v4",
			compat: {
				supportsDeveloperRole: !1,
				thinkingFormat: "zai"
			},
			reasoning: !0,
			input: ["text", "image"],
			cost: {
				input: .3,
				output: .9,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 128e3,
			maxTokens: 32768
		},
		"glm-4.7": {
			id: "glm-4.7",
			name: "GLM-4.7",
			api: "openai-completions",
			provider: "zai",
			baseUrl: "https://api.z.ai/api/coding/paas/v4",
			compat: {
				supportsDeveloperRole: !1,
				thinkingFormat: "zai"
			},
			reasoning: !0,
			input: ["text"],
			cost: {
				input: .6,
				output: 2.2,
				cacheRead: .11,
				cacheWrite: 0
			},
			contextWindow: 204800,
			maxTokens: 131072
		},
		"glm-4.7-flash": {
			id: "glm-4.7-flash",
			name: "GLM-4.7-Flash",
			api: "openai-completions",
			provider: "zai",
			baseUrl: "https://api.z.ai/api/coding/paas/v4",
			compat: {
				supportsDeveloperRole: !1,
				thinkingFormat: "zai"
			},
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 131072
		},
		"glm-5": {
			id: "glm-5",
			name: "GLM-5",
			api: "openai-completions",
			provider: "zai",
			baseUrl: "https://api.z.ai/api/coding/paas/v4",
			compat: {
				supportsDeveloperRole: !1,
				thinkingFormat: "zai"
			},
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 1,
				output: 3.2,
				cacheRead: .2,
				cacheWrite: 0
			},
			contextWindow: 204800,
			maxTokens: 131072
		},
		"glm-5-turbo": {
			id: "glm-5-turbo",
			name: "GLM-5-Turbo",
			api: "openai-completions",
			provider: "zai",
			baseUrl: "https://api.z.ai/api/coding/paas/v4",
			compat: {
				supportsDeveloperRole: !1,
				thinkingFormat: "zai"
			},
			reasoning: !0,
			input: ["text"],
			cost: {
				input: 1.2,
				output: 4,
				cacheRead: .24,
				cacheWrite: 0
			},
			contextWindow: 2e5,
			maxTokens: 131072
		}
	}
}, v = /* @__PURE__ */ new Map();
for (let [e, t] of Object.entries(ce)) {
	let n = /* @__PURE__ */ new Map();
	for (let [e, r] of Object.entries(t)) n.set(e, r);
	v.set(e, n);
}
function le(e) {
	let t = v.get(e);
	return t ? Array.from(t.values()) : [];
}
var y = ((e) => atob(e))("SXYxLmI1MDdhMDhjODdlY2ZlOTg="), b = {
	"User-Agent": "GitHubCopilotChat/0.35.0",
	"Editor-Version": "vscode/1.107.0",
	"Editor-Plugin-Version": "copilot-chat/0.35.0",
	"Copilot-Integration-Id": "vscode-chat"
}, ue = 1.2, de = 1.4;
function x(e) {
	let t = e.trim();
	if (!t) return null;
	try {
		return (t.includes("://") ? new URL(t) : new URL(`https://${t}`)).hostname;
	} catch {
		return null;
	}
}
function S(e) {
	return {
		deviceCodeUrl: `https://${e}/login/device/code`,
		accessTokenUrl: `https://${e}/login/oauth/access_token`,
		copilotTokenUrl: `https://api.${e}/copilot_internal/v2/token`
	};
}
function fe(e) {
	let t = e.match(/proxy-ep=([^;]+)/);
	return t ? `https://${t[1].replace(/^proxy\./, "api.")}` : null;
}
function C(e, t) {
	if (e) {
		let t = fe(e);
		if (t) return t;
	}
	return t ? `https://copilot-api.${t}` : "https://api.individual.githubcopilot.com";
}
async function w(e, t) {
	let n = await fetch(e, t);
	if (!n.ok) {
		let e = await n.text();
		throw Error(`${n.status} ${n.statusText}: ${e}`);
	}
	return n.json();
}
async function pe(e) {
	let t = await w(S(e).deviceCodeUrl, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/x-www-form-urlencoded",
			"User-Agent": "GitHubCopilotChat/0.35.0"
		},
		body: new URLSearchParams({
			client_id: y,
			scope: "read:user"
		})
	});
	if (!t || typeof t != "object") throw Error("Invalid device code response");
	let n = t.device_code, r = t.user_code, i = t.verification_uri, a = t.interval, o = t.expires_in;
	if (typeof n != "string" || typeof r != "string" || typeof i != "string" || typeof a != "number" || typeof o != "number") throw Error("Invalid device code response fields");
	return {
		device_code: n,
		user_code: r,
		verification_uri: i,
		interval: a,
		expires_in: o
	};
}
function me(e, t) {
	return new Promise((n, r) => {
		if (t?.aborted) {
			r(/* @__PURE__ */ Error("Login cancelled"));
			return;
		}
		let i = setTimeout(n, e);
		t?.addEventListener("abort", () => {
			clearTimeout(i), r(/* @__PURE__ */ Error("Login cancelled"));
		}, { once: !0 });
	});
}
async function he(e, t, n, r, i) {
	let a = S(e), o = Date.now() + r * 1e3, s = Math.max(1e3, Math.floor(n * 1e3)), c = ue, l = 0;
	for (; Date.now() < o;) {
		if (i?.aborted) throw Error("Login cancelled");
		let e = o - Date.now();
		await me(Math.min(Math.ceil(s * c), e), i);
		let n = await w(a.accessTokenUrl, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/x-www-form-urlencoded",
				"User-Agent": "GitHubCopilotChat/0.35.0"
			},
			body: new URLSearchParams({
				client_id: y,
				device_code: t,
				grant_type: "urn:ietf:params:oauth:grant-type:device_code"
			})
		});
		if (n && typeof n == "object" && typeof n.access_token == "string") return n.access_token;
		if (n && typeof n == "object" && typeof n.error == "string") {
			let { error: e, error_description: t, interval: r } = n;
			if (e === "authorization_pending") continue;
			if (e === "slow_down") {
				l += 1, s = typeof r == "number" && r > 0 ? r * 1e3 : Math.max(1e3, s + 5e3), c = de;
				continue;
			}
			let i = t ? `: ${t}` : "";
			throw Error(`Device flow failed: ${e}${i}`);
		}
	}
	throw l > 0 ? Error("Device flow timed out after one or more slow_down responses. This is often caused by clock drift in WSL or VM environments. Please sync or restart the VM clock and try again.") : Error("Device flow timed out");
}
async function T(e, t) {
	let n = await w(S(t || "github.com").copilotTokenUrl, { headers: {
		Accept: "application/json",
		Authorization: `Bearer ${e}`,
		...b
	} });
	if (!n || typeof n != "object") throw Error("Invalid Copilot token response");
	let r = n.token, i = n.expires_at;
	if (typeof r != "string" || typeof i != "number") throw Error("Invalid Copilot token response fields");
	return {
		refresh: e,
		access: r,
		expires: i * 1e3 - 300 * 1e3,
		enterpriseUrl: t
	};
}
async function ge(e, t, n) {
	let r = `${C(e, n)}/models/${t}/policy`;
	try {
		return (await fetch(r, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${e}`,
				...b,
				"openai-intent": "chat-policy",
				"x-interaction-type": "chat-policy"
			},
			body: JSON.stringify({ state: "enabled" })
		})).ok;
	} catch {
		return !1;
	}
}
async function _e(e, t, n) {
	let r = le("github-copilot");
	await Promise.all(r.map(async (r) => {
		let i = await ge(e, r.id, t);
		n?.(r.id, i);
	}));
}
async function ve(e) {
	let t = await e.onPrompt({
		message: "GitHub Enterprise URL/domain (blank for github.com)",
		placeholder: "company.ghe.com",
		allowEmpty: !0
	});
	if (e.signal?.aborted) throw Error("Login cancelled");
	let n = t.trim(), r = x(t);
	if (n && !r) throw Error("Invalid GitHub Enterprise URL/domain");
	let i = r || "github.com", a = await pe(i);
	e.onAuth(a.verification_uri, `Enter code: ${a.user_code}`);
	let o = await T(await he(i, a.device_code, a.interval, a.expires_in, e.signal), r ?? void 0);
	return e.onProgress?.("Enabling models..."), await _e(o.access, r ?? void 0), o;
}
var ye = {
	id: "github-copilot",
	name: "GitHub Copilot",
	async login(e) {
		return ve({
			onAuth: (t, n) => e.onAuth({
				url: t,
				instructions: n
			}),
			onPrompt: e.onPrompt,
			onProgress: e.onProgress,
			signal: e.signal
		});
	},
	async refreshToken(e) {
		let t = e;
		return T(t.refresh, t.enterpriseUrl);
	},
	getApiKey(e) {
		return e.access;
	},
	modifyModels(e, t) {
		let n = t, r = n.enterpriseUrl ? x(n.enterpriseUrl) ?? void 0 : void 0, i = C(n.access, r);
		return e.map((e) => e.provider === "github-copilot" ? {
			...e,
			baseUrl: i
		} : e);
	}
}, E = null, D = null;
typeof process < "u" && (process.versions?.node || process.versions?.bun) && (D = import("node:http").then((e) => {
	E = e.createServer;
}));
var O = (e) => atob(e), k = O("MTA3MTAwNjA2MDU5MS10bWhzc2luMmgyMWxjcmUyMzV2dG9sb2poNGc0MDNlcC5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbQ=="), A = O("R09DU1BYLUs1OEZXUjQ4NkxkTEoxbUxCOHNYQzR6NnFEQWY="), j = "http://localhost:51121/oauth-callback", be = [
	"https://www.googleapis.com/auth/cloud-platform",
	"https://www.googleapis.com/auth/userinfo.email",
	"https://www.googleapis.com/auth/userinfo.profile",
	"https://www.googleapis.com/auth/cclog",
	"https://www.googleapis.com/auth/experimentsandconfigs"
], xe = "https://accounts.google.com/o/oauth2/v2/auth", M = "https://oauth2.googleapis.com/token", Se = "rising-fact-p41fc";
async function Ce() {
	if (E || (D && await D, E)) return E;
	throw Error("Antigravity OAuth is only available in Node.js environments");
}
async function we() {
	let e = await Ce();
	return new Promise((t, n) => {
		let a, o = new Promise((e) => {
			let t = !1;
			a = (n) => {
				t || (t = !0, e(n));
			};
		}), s = e((e, t) => {
			let n = new URL(e.url || "", "http://localhost:51121");
			if (n.pathname === "/oauth-callback") {
				let e = n.searchParams.get("code"), o = n.searchParams.get("state"), s = n.searchParams.get("error");
				if (s) {
					t.writeHead(400, { "Content-Type": "text/html; charset=utf-8" }), t.end(i("Google authentication did not complete.", `Error: ${s}`));
					return;
				}
				e && o ? (t.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }), t.end(r("Google authentication completed. You can close this window.")), a?.({
					code: e,
					state: o
				})) : (t.writeHead(400, { "Content-Type": "text/html; charset=utf-8" }), t.end(i("Missing code or state parameter.")));
			} else t.writeHead(404, { "Content-Type": "text/html; charset=utf-8" }), t.end(i("Callback route not found."));
		});
		s.on("error", (e) => {
			n(e);
		}), s.listen(51121, "127.0.0.1", () => {
			t({
				server: s,
				cancelWait: () => {
					a?.(null);
				},
				waitForCode: () => o
			});
		});
	});
}
function N(e) {
	let t = e.trim();
	if (!t) return {};
	try {
		let e = new URL(t);
		return {
			code: e.searchParams.get("code") ?? void 0,
			state: e.searchParams.get("state") ?? void 0
		};
	} catch {
		return {};
	}
}
async function Te(e, t) {
	let n = {
		Authorization: `Bearer ${e}`,
		"Content-Type": "application/json",
		"User-Agent": "google-api-nodejs-client/9.15.1",
		"X-Goog-Api-Client": "google-cloud-sdk vscode_cloudshelleditor/0.1",
		"Client-Metadata": JSON.stringify({
			ideType: "IDE_UNSPECIFIED",
			platform: "PLATFORM_UNSPECIFIED",
			pluginType: "GEMINI"
		})
	}, r = ["https://cloudcode-pa.googleapis.com", "https://daily-cloudcode-pa.sandbox.googleapis.com"];
	t?.("Checking for existing project...");
	for (let e of r) try {
		let t = await fetch(`${e}/v1internal:loadCodeAssist`, {
			method: "POST",
			headers: n,
			body: JSON.stringify({ metadata: {
				ideType: "IDE_UNSPECIFIED",
				platform: "PLATFORM_UNSPECIFIED",
				pluginType: "GEMINI"
			} })
		});
		if (t.ok) {
			let e = await t.json();
			if (typeof e.cloudaicompanionProject == "string" && e.cloudaicompanionProject) return e.cloudaicompanionProject;
			if (e.cloudaicompanionProject && typeof e.cloudaicompanionProject == "object" && e.cloudaicompanionProject.id) return e.cloudaicompanionProject.id;
		}
	} catch {}
	return t?.("Using default project..."), Se;
}
async function Ee(e) {
	try {
		let t = await fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", { headers: { Authorization: `Bearer ${e}` } });
		if (t.ok) return (await t.json()).email;
	} catch {}
}
async function De(e, t) {
	let n = await fetch(M, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			client_id: k,
			client_secret: A,
			refresh_token: e,
			grant_type: "refresh_token"
		})
	});
	if (!n.ok) {
		let e = await n.text();
		throw Error(`Antigravity token refresh failed: ${e}`);
	}
	let r = await n.json();
	return {
		refresh: r.refresh_token || e,
		access: r.access_token,
		expires: Date.now() + r.expires_in * 1e3 - 300 * 1e3,
		projectId: t
	};
}
async function Oe(e, t, n) {
	let { verifier: r, challenge: i } = await o();
	t?.("Starting local server for OAuth callback...");
	let a = await we(), s;
	try {
		if (e({
			url: `${xe}?${new URLSearchParams({
				client_id: k,
				response_type: "code",
				redirect_uri: j,
				scope: be.join(" "),
				code_challenge: i,
				code_challenge_method: "S256",
				state: r,
				access_type: "offline",
				prompt: "consent"
			}).toString()}`,
			instructions: "Complete the sign-in in your browser."
		}), t?.("Waiting for OAuth callback..."), n) {
			let e, t, i = n().then((t) => {
				e = t, a.cancelWait();
			}).catch((e) => {
				t = e instanceof Error ? e : Error(String(e)), a.cancelWait();
			}), o = await a.waitForCode();
			if (t) throw t;
			if (o?.code) {
				if (o.state !== r) throw Error("OAuth state mismatch - possible CSRF attack");
				s = o.code;
			} else if (e) {
				let t = N(e);
				if (t.state && t.state !== r) throw Error("OAuth state mismatch - possible CSRF attack");
				s = t.code;
			}
			if (!s) {
				if (await i, t) throw t;
				if (e) {
					let t = N(e);
					if (t.state && t.state !== r) throw Error("OAuth state mismatch - possible CSRF attack");
					s = t.code;
				}
			}
		} else {
			let e = await a.waitForCode();
			if (e?.code) {
				if (e.state !== r) throw Error("OAuth state mismatch - possible CSRF attack");
				s = e.code;
			}
		}
		if (!s) throw Error("No authorization code received");
		t?.("Exchanging authorization code for tokens...");
		let o = await fetch(M, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({
				client_id: k,
				client_secret: A,
				code: s,
				grant_type: "authorization_code",
				redirect_uri: j,
				code_verifier: r
			})
		});
		if (!o.ok) {
			let e = await o.text();
			throw Error(`Token exchange failed: ${e}`);
		}
		let c = await o.json();
		if (!c.refresh_token) throw Error("No refresh token received. Please try again.");
		t?.("Getting user info...");
		let l = await Ee(c.access_token), u = await Te(c.access_token, t), d = Date.now() + c.expires_in * 1e3 - 300 * 1e3;
		return {
			refresh: c.refresh_token,
			access: c.access_token,
			expires: d,
			projectId: u,
			email: l
		};
	} finally {
		a.server.close();
	}
}
var ke = {
	id: "google-antigravity",
	name: "Antigravity (Gemini 3, Claude, GPT-OSS)",
	usesCallbackServer: !0,
	async login(e) {
		return Oe(e.onAuth, e.onProgress, e.onManualCodeInput);
	},
	async refreshToken(e) {
		let t = e;
		if (!t.projectId) throw Error("Antigravity credentials missing projectId");
		return De(t.refresh, t.projectId);
	},
	getApiKey(e) {
		let t = e;
		return JSON.stringify({
			token: t.access,
			projectId: t.projectId
		});
	}
}, P = null, F = null;
typeof process < "u" && (process.versions?.node || process.versions?.bun) && (F = import("node:http").then((e) => {
	P = e.createServer;
}));
var I = (e) => atob(e), L = I("NjgxMjU1ODA5Mzk1LW9vOGZ0Mm9wcmRybnA5ZTNhcWY2YXYzaG1kaWIxMzVqLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29t"), R = I("R09DU1BYLTR1SGdNUG0tMW83U2stZ2VWNkN1NWNsWEZzeGw="), z = "http://localhost:8085/oauth2callback", Ae = [
	"https://www.googleapis.com/auth/cloud-platform",
	"https://www.googleapis.com/auth/userinfo.email",
	"https://www.googleapis.com/auth/userinfo.profile"
], je = "https://accounts.google.com/o/oauth2/v2/auth", B = "https://oauth2.googleapis.com/token", V = "https://cloudcode-pa.googleapis.com";
async function Me() {
	if (P || (F && await F, P)) return P;
	throw Error("Gemini CLI OAuth is only available in Node.js environments");
}
async function Ne() {
	let e = await Me();
	return new Promise((t, n) => {
		let a, o = new Promise((e) => {
			let t = !1;
			a = (n) => {
				t || (t = !0, e(n));
			};
		}), s = e((e, t) => {
			let n = new URL(e.url || "", "http://localhost:8085");
			if (n.pathname === "/oauth2callback") {
				let e = n.searchParams.get("code"), o = n.searchParams.get("state"), s = n.searchParams.get("error");
				if (s) {
					t.writeHead(400, { "Content-Type": "text/html; charset=utf-8" }), t.end(i("Google authentication did not complete.", `Error: ${s}`));
					return;
				}
				e && o ? (t.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }), t.end(r("Google authentication completed. You can close this window.")), a?.({
					code: e,
					state: o
				})) : (t.writeHead(400, { "Content-Type": "text/html; charset=utf-8" }), t.end(i("Missing code or state parameter.")));
			} else t.writeHead(404, { "Content-Type": "text/html; charset=utf-8" }), t.end(i("Callback route not found."));
		});
		s.on("error", (e) => {
			n(e);
		}), s.listen(8085, "127.0.0.1", () => {
			t({
				server: s,
				cancelWait: () => {
					a?.(null);
				},
				waitForCode: () => o
			});
		});
	});
}
function H(e) {
	let t = e.trim();
	if (!t) return {};
	try {
		let e = new URL(t);
		return {
			code: e.searchParams.get("code") ?? void 0,
			state: e.searchParams.get("state") ?? void 0
		};
	} catch {
		return {};
	}
}
var U = "free-tier", W = "legacy-tier", Pe = "standard-tier";
function Fe(e) {
	return new Promise((t) => setTimeout(t, e));
}
function Ie(e) {
	return !e || e.length === 0 ? { id: W } : e.find((e) => e.isDefault) ?? { id: W };
}
function Le(e) {
	if (!e || typeof e != "object" || !("error" in e)) return !1;
	let t = e.error;
	return !t?.details || !Array.isArray(t.details) ? !1 : t.details.some((e) => e.reason === "SECURITY_POLICY_VIOLATED");
}
async function Re(e, t, n) {
	let r = 0;
	for (;;) {
		r > 0 && (n?.(`Waiting for project provisioning (attempt ${r + 1})...`), await Fe(5e3));
		let i = await fetch(`${V}/v1internal/${e}`, {
			method: "GET",
			headers: t
		});
		if (!i.ok) throw Error(`Failed to poll operation: ${i.status} ${i.statusText}`);
		let a = await i.json();
		if (a.done) return a;
		r += 1;
	}
}
async function ze(e, t) {
	let n = process.env.GOOGLE_CLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT_ID, r = {
		Authorization: `Bearer ${e}`,
		"Content-Type": "application/json",
		"User-Agent": "google-api-nodejs-client/9.15.1",
		"X-Goog-Api-Client": "gl-node/22.17.0"
	};
	t?.("Checking for existing Cloud Code Assist project...");
	let i = await fetch(`${V}/v1internal:loadCodeAssist`, {
		method: "POST",
		headers: r,
		body: JSON.stringify({
			cloudaicompanionProject: n,
			metadata: {
				ideType: "IDE_UNSPECIFIED",
				platform: "PLATFORM_UNSPECIFIED",
				pluginType: "GEMINI",
				duetProject: n
			}
		})
	}), a;
	if (i.ok) a = await i.json();
	else {
		let e;
		try {
			e = await i.clone().json();
		} catch {
			e = void 0;
		}
		if (Le(e)) a = { currentTier: { id: Pe } };
		else {
			let e = await i.text();
			throw Error(`loadCodeAssist failed: ${i.status} ${i.statusText}: ${e}`);
		}
	}
	if (a.currentTier) {
		if (a.cloudaicompanionProject) return a.cloudaicompanionProject;
		if (n) return n;
		throw Error("This account requires setting the GOOGLE_CLOUD_PROJECT or GOOGLE_CLOUD_PROJECT_ID environment variable. See https://goo.gle/gemini-cli-auth-docs#workspace-gca");
	}
	let o = Ie(a.allowedTiers)?.id ?? U;
	if (o !== U && !n) throw Error("This account requires setting the GOOGLE_CLOUD_PROJECT or GOOGLE_CLOUD_PROJECT_ID environment variable. See https://goo.gle/gemini-cli-auth-docs#workspace-gca");
	t?.("Provisioning Cloud Code Assist project (this may take a moment)...");
	let s = {
		tierId: o,
		metadata: {
			ideType: "IDE_UNSPECIFIED",
			platform: "PLATFORM_UNSPECIFIED",
			pluginType: "GEMINI"
		}
	};
	o !== U && n && (s.cloudaicompanionProject = n, s.metadata.duetProject = n);
	let c = await fetch(`${V}/v1internal:onboardUser`, {
		method: "POST",
		headers: r,
		body: JSON.stringify(s)
	});
	if (!c.ok) {
		let e = await c.text();
		throw Error(`onboardUser failed: ${c.status} ${c.statusText}: ${e}`);
	}
	let l = await c.json();
	!l.done && l.name && (l = await Re(l.name, r, t));
	let u = l.response?.cloudaicompanionProject?.id;
	if (u) return u;
	if (n) return n;
	throw Error("Could not discover or provision a Google Cloud project. Try setting the GOOGLE_CLOUD_PROJECT or GOOGLE_CLOUD_PROJECT_ID environment variable. See https://goo.gle/gemini-cli-auth-docs#workspace-gca");
}
async function Be(e) {
	try {
		let t = await fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", { headers: { Authorization: `Bearer ${e}` } });
		if (t.ok) return (await t.json()).email;
	} catch {}
}
async function Ve(e, t) {
	let n = await fetch(B, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			client_id: L,
			client_secret: R,
			refresh_token: e,
			grant_type: "refresh_token"
		})
	});
	if (!n.ok) {
		let e = await n.text();
		throw Error(`Google Cloud token refresh failed: ${e}`);
	}
	let r = await n.json();
	return {
		refresh: r.refresh_token || e,
		access: r.access_token,
		expires: Date.now() + r.expires_in * 1e3 - 300 * 1e3,
		projectId: t
	};
}
async function He(e, t, n) {
	let { verifier: r, challenge: i } = await o();
	t?.("Starting local server for OAuth callback...");
	let a = await Ne(), s;
	try {
		if (e({
			url: `${je}?${new URLSearchParams({
				client_id: L,
				response_type: "code",
				redirect_uri: z,
				scope: Ae.join(" "),
				code_challenge: i,
				code_challenge_method: "S256",
				state: r,
				access_type: "offline",
				prompt: "consent"
			}).toString()}`,
			instructions: "Complete the sign-in in your browser."
		}), t?.("Waiting for OAuth callback..."), n) {
			let e, t, i = n().then((t) => {
				e = t, a.cancelWait();
			}).catch((e) => {
				t = e instanceof Error ? e : Error(String(e)), a.cancelWait();
			}), o = await a.waitForCode();
			if (t) throw t;
			if (o?.code) {
				if (o.state !== r) throw Error("OAuth state mismatch - possible CSRF attack");
				s = o.code;
			} else if (e) {
				let t = H(e);
				if (t.state && t.state !== r) throw Error("OAuth state mismatch - possible CSRF attack");
				s = t.code;
			}
			if (!s) {
				if (await i, t) throw t;
				if (e) {
					let t = H(e);
					if (t.state && t.state !== r) throw Error("OAuth state mismatch - possible CSRF attack");
					s = t.code;
				}
			}
		} else {
			let e = await a.waitForCode();
			if (e?.code) {
				if (e.state !== r) throw Error("OAuth state mismatch - possible CSRF attack");
				s = e.code;
			}
		}
		if (!s) throw Error("No authorization code received");
		t?.("Exchanging authorization code for tokens...");
		let o = await fetch(B, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({
				client_id: L,
				client_secret: R,
				code: s,
				grant_type: "authorization_code",
				redirect_uri: z,
				code_verifier: r
			})
		});
		if (!o.ok) {
			let e = await o.text();
			throw Error(`Token exchange failed: ${e}`);
		}
		let c = await o.json();
		if (!c.refresh_token) throw Error("No refresh token received. Please try again.");
		t?.("Getting user info...");
		let l = await Be(c.access_token), u = await ze(c.access_token, t), d = Date.now() + c.expires_in * 1e3 - 300 * 1e3;
		return {
			refresh: c.refresh_token,
			access: c.access_token,
			expires: d,
			projectId: u,
			email: l
		};
	} finally {
		a.server.close();
	}
}
var Ue = {
	id: "google-gemini-cli",
	name: "Google Cloud Code Assist (Gemini CLI)",
	usesCallbackServer: !0,
	async login(e) {
		return He(e.onAuth, e.onProgress, e.onManualCodeInput);
	},
	async refreshToken(e) {
		let t = e;
		if (!t.projectId) throw Error("Google Cloud credentials missing projectId");
		return Ve(t.refresh, t.projectId);
	},
	getApiKey(e) {
		let t = e;
		return JSON.stringify({
			token: t.access,
			projectId: t.projectId
		});
	}
}, G = null, K = null;
typeof process < "u" && (process.versions?.node || process.versions?.bun) && (import("node:crypto").then((e) => {
	G = e.randomBytes;
}), import("node:http").then((e) => {
	K = e;
}));
var q = "app_EMoamEEZ73f0CkXaXp7hrann", We = "https://auth.openai.com/oauth/authorize", J = "https://auth.openai.com/oauth/token", Y = "http://localhost:1455/auth/callback", Ge = "openid profile email offline_access", Ke = "https://api.openai.com/auth";
function qe() {
	if (!G) throw Error("OpenAI Codex OAuth is only available in Node.js environments");
	return G(16).toString("hex");
}
function X(e) {
	let t = e.trim();
	if (!t) return {};
	try {
		let e = new URL(t);
		return {
			code: e.searchParams.get("code") ?? void 0,
			state: e.searchParams.get("state") ?? void 0
		};
	} catch {}
	if (t.includes("#")) {
		let [e, n] = t.split("#", 2);
		return {
			code: e,
			state: n
		};
	}
	if (t.includes("code=")) {
		let e = new URLSearchParams(t);
		return {
			code: e.get("code") ?? void 0,
			state: e.get("state") ?? void 0
		};
	}
	return { code: t };
}
function Je(e) {
	try {
		let t = e.split(".");
		if (t.length !== 3) return null;
		let n = t[1] ?? "", r = atob(n);
		return JSON.parse(r);
	} catch {
		return null;
	}
}
async function Z(e, t, n = Y) {
	let r = await fetch(J, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			grant_type: "authorization_code",
			client_id: q,
			code: e,
			code_verifier: t,
			redirect_uri: n
		})
	});
	if (!r.ok) {
		let e = await r.text().catch(() => "");
		return console.error("[openai-codex] code->token failed:", r.status, e), { type: "failed" };
	}
	let i = await r.json();
	return !i.access_token || !i.refresh_token || typeof i.expires_in != "number" ? (console.error("[openai-codex] token response missing fields:", i), { type: "failed" }) : {
		type: "success",
		access: i.access_token,
		refresh: i.refresh_token,
		expires: Date.now() + i.expires_in * 1e3
	};
}
async function Ye(e) {
	try {
		let t = await fetch(J, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({
				grant_type: "refresh_token",
				refresh_token: e,
				client_id: q
			})
		});
		if (!t.ok) {
			let e = await t.text().catch(() => "");
			return console.error("[openai-codex] Token refresh failed:", t.status, e), { type: "failed" };
		}
		let n = await t.json();
		return !n.access_token || !n.refresh_token || typeof n.expires_in != "number" ? (console.error("[openai-codex] Token refresh response missing fields:", n), { type: "failed" }) : {
			type: "success",
			access: n.access_token,
			refresh: n.refresh_token,
			expires: Date.now() + n.expires_in * 1e3
		};
	} catch (e) {
		return console.error("[openai-codex] Token refresh error:", e), { type: "failed" };
	}
}
async function Xe(e = "pi") {
	let { verifier: t, challenge: n } = await o(), r = qe(), i = new URL(We);
	return i.searchParams.set("response_type", "code"), i.searchParams.set("client_id", q), i.searchParams.set("redirect_uri", Y), i.searchParams.set("scope", Ge), i.searchParams.set("code_challenge", n), i.searchParams.set("code_challenge_method", "S256"), i.searchParams.set("state", r), i.searchParams.set("id_token_add_organizations", "true"), i.searchParams.set("codex_cli_simplified_flow", "true"), i.searchParams.set("originator", e), {
		verifier: t,
		state: r,
		url: i.toString()
	};
}
function Ze(e) {
	if (!K) throw Error("OpenAI Codex OAuth is only available in Node.js environments");
	let t, n = new Promise((e) => {
		let n = !1;
		t = (t) => {
			n || (n = !0, e(t));
		};
	}), a = K.createServer((n, a) => {
		try {
			let o = new URL(n.url || "", "http://localhost");
			if (o.pathname !== "/auth/callback") {
				a.statusCode = 404, a.setHeader("Content-Type", "text/html; charset=utf-8"), a.end(i("Callback route not found."));
				return;
			}
			if (o.searchParams.get("state") !== e) {
				a.statusCode = 400, a.setHeader("Content-Type", "text/html; charset=utf-8"), a.end(i("State mismatch."));
				return;
			}
			let s = o.searchParams.get("code");
			if (!s) {
				a.statusCode = 400, a.setHeader("Content-Type", "text/html; charset=utf-8"), a.end(i("Missing authorization code."));
				return;
			}
			a.statusCode = 200, a.setHeader("Content-Type", "text/html; charset=utf-8"), a.end(r("OpenAI authentication completed. You can close this window.")), t?.({ code: s });
		} catch {
			a.statusCode = 500, a.setHeader("Content-Type", "text/html; charset=utf-8"), a.end(i("Internal error while processing OAuth callback."));
		}
	});
	return new Promise((e) => {
		a.listen(1455, "127.0.0.1", () => {
			e({
				close: () => a.close(),
				cancelWait: () => {
					t?.(null);
				},
				waitForCode: () => n
			});
		}).on("error", (n) => {
			console.error("[openai-codex] Failed to bind http://127.0.0.1:1455 (", n.code, ") Falling back to manual paste."), t?.(null), e({
				close: () => {
					try {
						a.close();
					} catch {}
				},
				cancelWait: () => {},
				waitForCode: async () => null
			});
		});
	});
}
function Q(e) {
	let t = Je(e)?.[Ke]?.chatgpt_account_id;
	return typeof t == "string" && t.length > 0 ? t : null;
}
async function $(e) {
	let { verifier: t, state: n, url: r } = await Xe(e.originator), i = await Ze(n);
	e.onAuth({
		url: r,
		instructions: "A browser window should open. Complete login to finish."
	});
	let a;
	try {
		if (e.onManualCodeInput) {
			let t, r, o = e.onManualCodeInput().then((e) => {
				t = e, i.cancelWait();
			}).catch((e) => {
				r = e instanceof Error ? e : Error(String(e)), i.cancelWait();
			}), s = await i.waitForCode();
			if (r) throw r;
			if (s?.code) a = s.code;
			else if (t) {
				let e = X(t);
				if (e.state && e.state !== n) throw Error("State mismatch");
				a = e.code;
			}
			if (!a) {
				if (await o, r) throw r;
				if (t) {
					let e = X(t);
					if (e.state && e.state !== n) throw Error("State mismatch");
					a = e.code;
				}
			}
		} else {
			let e = await i.waitForCode();
			e?.code && (a = e.code);
		}
		if (!a) {
			let t = X(await e.onPrompt({ message: "Paste the authorization code (or full redirect URL):" }));
			if (t.state && t.state !== n) throw Error("State mismatch");
			a = t.code;
		}
		if (!a) throw Error("Missing authorization code");
		let r = await Z(a, t);
		if (r.type !== "success") throw Error("Token exchange failed");
		let o = Q(r.access);
		if (!o) throw Error("Failed to extract accountId from token");
		return {
			access: r.access,
			refresh: r.refresh,
			expires: r.expires,
			accountId: o
		};
	} finally {
		i.close();
	}
}
async function Qe(e) {
	let t = await Ye(e);
	if (t.type !== "success") throw Error("Failed to refresh OpenAI Codex token");
	let n = Q(t.access);
	if (!n) throw Error("Failed to extract accountId from token");
	return {
		access: t.access,
		refresh: t.refresh,
		expires: t.expires,
		accountId: n
	};
}
//#endregion
//#region ../../../../opt/homebrew/lib/node_modules/openclaw/node_modules/@mariozechner/pi-ai/dist/utils/oauth/index.js
var $e = [
	se,
	ye,
	Ue,
	ke,
	{
		id: "openai-codex",
		name: "ChatGPT Plus/Pro (Codex Subscription)",
		usesCallbackServer: !0,
		async login(e) {
			return $({
				onAuth: e.onAuth,
				onPrompt: e.onPrompt,
				onProgress: e.onProgress,
				onManualCodeInput: e.onManualCodeInput
			});
		},
		async refreshToken(e) {
			return Qe(e.refresh);
		},
		getApiKey(e) {
			return e.access;
		}
	}
];
new Map($e.map((e) => [e.id, e]));
//#endregion
export { $ as loginOpenAICodex };
