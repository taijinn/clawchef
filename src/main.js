import './style.css'

const i18n = {
  en: {
    title: "OpenClaw Manager",
    subtitle: "Configure your local AI agent. Powerful, private, and fully yours.",
    step0: "Welcome",
    step1: "Prerequisites",
    step2: "Workspace",
    step3: "API Key",
    step4: "Channels",
    step5: "Control Panel",
    debug: "🛠️ Live Debug Log",
    btn_next: "Next",
    btn_back: "Back",
    btn_accept: "Accept Risk & Begin",
    btn_install: "Install & Continue",
    btn_save: "Save & Next",
    btn_finish: "Save & Finish",
    btn_start: "▶️ Start OpenClaw",
    btn_stop: "⏹️ Stop OpenClaw",
    btn_kill: "⚠️ Kill All Tasks",
    btn_uninstall: "🗑️ Uninstall Everything",
    welcome_title: "Security warning — please read.",
    prereq_title: "System Requirements",
    prereq_sub: "We need a few tools installed on your Mac before we can run OpenClaw locally.",
    work_title: "Environment Setup",
    work_sub: "Choose where to install OpenClaw.",
    api_title: "AI Configuration",
    api_sub: "OpenClaw supports multiple LLM providers. Configure as many as you need.",
    channel_title: "Channel Setup",
    channel_sub: "Configure where OpenClaw will listen and respond. You can add bots for multiple chat platforms.",
    control_title: "OpenClaw Ready 🎉",
    control_sub: "Your local agent is configured at"
  },
  zh: {
    title: "OpenClaw 管理器",
    subtitle: "配置您的本地 AI 代理。强大、私密，完全归您所有。",
    step0: "欢迎",
    step1: "前置条件",
    step2: "工作区",
    step3: "API 密钥",
    step4: "系统集成",
    step5: "控制面板",
    debug: "🛠️ 实时调试日志",
    btn_next: "下一步",
    btn_back: "返回",
    btn_accept: "接受风险并开始",
    btn_install: "安装并继续",
    btn_save: "保存并继续",
    btn_finish: "保存并完成",
    btn_start: "▶️ 启动 OpenClaw",
    btn_stop: "⏹️ 停止 OpenClaw",
    btn_kill: "⚠️ 终止所有任务",
    btn_uninstall: "🗑️ 卸载全部",
    welcome_title: "安全警告 — 请阅读。",
    prereq_title: "系统要求",
    prereq_sub: "我们需要在您的 Mac 上安装一些工具，才能在本地运行 OpenClaw。",
    work_title: "环境设置",
    work_sub: "选择安装 OpenClaw 的位置。",
    api_title: "AI 配置",
    api_sub: "OpenClaw 支持多个 LLM 提供商。您可以根据需要配置任意数量的提供商。",
    channel_title: "频道设置",
    channel_sub: "配置 OpenClaw 监听和响应的位置。您可以为多个聊天平台添加机器人。",
    control_title: "OpenClaw 已准备就绪 🎉",
    control_sub: "您的本地代理已配置在"
  },
  ja: {
    title: "OpenClaw マネージャー",
    subtitle: "ローカルAIエージェントの構成。強力でプライベート、完全にあなたのものです。",
    step0: "ようこそ",
    step1: "前提条件",
    step2: "ワークスペース",
    step3: "APIキー",
    step4: "チャネル",
    step5: "コントロールパネル",
    debug: "🛠️ ライブデバッグログ",
    btn_next: "次へ",
    btn_back: "戻る",
    btn_accept: "リスクを承諾して開始",
    btn_install: "インストールして続行",
    btn_save: "保存して次へ",
    btn_finish: "保存して完了",
    btn_start: "▶️ OpenClaw を起動",
    btn_stop: "⏹️ OpenClaw を停止",
    btn_kill: "⚠️ すべてのタスクを終了",
    btn_uninstall: "🗑️ すべてアンインストール",
    welcome_title: "セキュリティ警告 — お読みください。",
    prereq_title: "システム要件",
    prereq_sub: "OpenClaw をローカルで実行する前に、Mac にいくつかのツールをインストールする必要があります。",
    work_title: "環境設定",
    work_sub: "OpenClaw をインストールする場所を選択してください。",
    api_title: "AI 設定",
    api_sub: "OpenClaw は複数の LLM プロバイダーをサポートしています。必要な数だけ構成できます。",
    channel_title: "チャネル設定",
    channel_sub: "OpenClaw がリッスンおよび応答する場所を構成します。複数のチャット プラットフォーム用のボットを追加できます。",
    control_title: "OpenClaw 準備完了 🎉",
    control_sub: "ローカル エージェントが次の場所に構成されました: "
  }
};

let currentLang = localStorage.getItem('manager-lang') || 'en';
function t(key) { return i18n[currentLang][key] || key; }

function renderShell() {
  document.querySelector('#app').innerHTML = `
    <div class="titlebar"></div>
    <div class="app-container">
      <div class="glass-panel animate-fade-in-up">
        <h1 id="i18n-title" class="text-gradient" style="font-size: 2.5rem; margin-bottom: 0.5rem;">${t('title')}</h1>
        <p id="i18n-subtitle" class="text-secondary" style="margin-bottom: 2rem;">${t('subtitle')}</p>
        
        <div class="stepper animate-fade-in-up delay-100" id="stepper">
          <div class="step-item active" id="i18n-step0" data-step="0">${t('step0')}</div>
          <div class="step-item" id="i18n-step1" data-step="1">${t('step1')}</div>
          <div class="step-item" id="i18n-step2" data-step="2">${t('step2')}</div>
          <div class="step-item" id="i18n-step3" data-step="3">${t('step3')}</div>
          <div class="step-item" id="i18n-step4" data-step="4">${t('step4')}</div>
          <div class="step-item" id="i18n-step5" data-step="5">${t('step5')}</div>
        </div>
        
        <div id="step-content" class="animate-fade-in-up delay-200" style="min-height: 250px;">
          <!-- Content gets injected here -->
        </div>
      </div>
      
      <div id="debug-console-container" class="animate-fade-in-up delay-200">
        <div id="i18n-debug" class="debug-header">${t('debug')}</div>
        <div id="debug-console"></div>
      </div>
    </div>
  `;
}
renderShell();

document.getElementById('lang-select').value = currentLang;
document.getElementById('lang-select').addEventListener('change', (e) => {
  currentLang = e.target.value;
  localStorage.setItem('manager-lang', currentLang);
  document.getElementById('i18n-title').innerText = t('title');
  document.getElementById('i18n-subtitle').innerText = t('subtitle');
  document.getElementById('i18n-step0').innerText = t('step0');
  document.getElementById('i18n-step1').innerText = t('step1');
  document.getElementById('i18n-step2').innerText = t('step2');
  document.getElementById('i18n-step3').innerText = t('step3');
  document.getElementById('i18n-step4').innerText = t('step4');
  document.getElementById('i18n-step5').innerText = t('step5');
  document.getElementById('i18n-debug').innerText = t('debug');
  
  // Re-render the current step so its text also translates
  if (currentStep === 0) renderWelcome();
  else if (currentStep === 1) renderPrerequisites();
  else if (currentStep === 2) renderWorkspace();
  else if (currentStep === 3) renderApiKey();
  else if (currentStep === 4) renderChannelSetup();
  else if (currentStep === 5) renderControlPanel();
});

// Global Debug Logger Listener
if (window.api && window.api.onDebugLog) {
  window.api.onDebugLog((msg) => {
    const consoleEl = document.getElementById('debug-console');
    if (!consoleEl) return;
    
    const line = document.createElement('div');
    line.className = 'debug-line';
    line.innerText = String(msg);
    
    // Highlight lines that look like commands
    if (msg.startsWith('>')) {
      line.style.color = '#56B6C2'; // Cyan
    } else if (msg.includes('[ERROR]')) {
      line.style.color = '#E06C75'; // Red
    }
    
    consoleEl.appendChild(line);
    
    // Auto-scroll to bottom
    consoleEl.scrollTop = consoleEl.scrollHeight;
  });
}

let currentStep = 0;
const configData = {
  apiKey: '',
  apiKeys: [{ id: Date.now(), provider: 'OpenAI', key: '' }],
  channels: [{ id: Date.now(), provider: 'Slack', key: '' }],
  workspacePath: '~/openclaw-workspace'
};

function updateStepper() {
  const steps = document.querySelectorAll('.step-item');
  steps.forEach((step, index) => {
    step.classList.remove('active', 'completed');
    if (index < currentStep) step.classList.add('completed');
    if (index === currentStep) step.classList.add('active');
  });
}

const stepContent = document.getElementById('step-content');

/* -- Step 0: Welcome -- */
function renderWelcome() {
  stepContent.innerHTML = `
    <div class="animate-fade-in-up">
      <h2 class="mb-lg" style="color: var(--error-color);">${t('welcome_title')}</h2>
      <div style="background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.3); padding: 1.2rem; border-radius: var(--radius-md); font-size: 0.85rem; line-height: 1.6; color: var(--text-primary); max-height: 300px; overflow-y: auto; margin-bottom: 1.5rem; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; white-space: pre-wrap;">OpenClaw is a hobby project and still in beta. Expect sharp edges.
By default, OpenClaw is a personal agent: one trusted operator boundary.
This bot can read files and run actions if tools are enabled.
A bad prompt can trick it into doing unsafe things.

OpenClaw is not a hostile multi-tenant boundary by default.
If multiple users can message one tool-enabled agent, they share that delegated tool
authority.

If you’re not comfortable with security hardening and access control, don’t run
OpenClaw.
Ask someone experienced to help before enabling tools or exposing it to the internet.

Recommended baseline:
- Pairing/allowlists + mention gating.
- Multi-user/shared inbox: split trust boundaries (separate gateway/credentials, ideally
  separate OS users/hosts).
- Sandbox + least-privilege tools.
- Shared inboxes: isolate DM sessions (\`session.dmScope: per-channel-peer\`) and keep
  tool access minimal.
- Keep secrets out of the agent’s reachable filesystem.
- Use the strongest available model for any bot with tools or untrusted inboxes.

Run regularly:
openclaw security audit --deep
openclaw security audit --fix

Must read: https://docs.openclaw.ai/gateway/security</div>
      
      <div class="input-group" style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 2rem;">
        <input type="checkbox" id="accept-risk-cb" style="margin-top: 4px; width: 16px; height: 16px; cursor: pointer;">
        <label for="accept-risk-cb" style="font-size: 0.9rem; cursor: pointer; user-select: none;">
          I understand this is personal-by-default and shared/multi-user use requires lock-down. Continue?
        </label>
      </div>

      <div class="flex justify-end gap-md">
        <button class="btn btn-primary" id="btn-next" disabled style="opacity: 0.5; cursor: not-allowed;">${t('btn_accept')}</button>
      </div>
    </div>
  `;

  document.getElementById('accept-risk-cb').addEventListener('change', (e) => {
    const btn = document.getElementById('btn-next');
    if (e.target.checked) {
      btn.disabled = false;
      btn.style.opacity = '1';
      btn.style.cursor = 'pointer';
    } else {
      btn.disabled = true;
      btn.style.opacity = '0.5';
      btn.style.cursor = 'not-allowed';
    }
  });

  document.getElementById('btn-next').addEventListener('click', () => {
    currentStep = 1;
    updateStepper();
    renderPrerequisites();
  });
}

/* -- Step 1: Prerequisites -- */
function renderPrerequisites() {
  const renderItem = (title, depName, isInstalled) => `
    <div class="loader-container pr-item" id="pr-${depName}">
      ${isInstalled === undefined ? `<div class="loader"></div>` : `<div class="status-icon ${isInstalled ? 'success' : 'error'}">${isInstalled ? '✓' : '✗'}</div>`}
      <div style="flex: 1;">
        <div style="font-weight: 500;">${title}</div>
        <div class="text-secondary" style="font-size: 0.875rem;">
          ${depName === 'git' ? 'Required for cloning the repository' : ''}
          ${depName === 'python' ? 'Required for running openclaw backend' : ''}
          ${depName === 'npm' ? 'Required for installing dependencies' : ''}
        </div>
      </div>
      ${isInstalled === false ? `<button class="btn btn-secondary install-dep-btn" data-dep="${depName}" style="padding: 0.25rem 0.75rem; font-size: 0.75rem;">Auto-Install</button>` : ''}
    </div>
  `;

  const checkPrereqs = async () => {
    try {
      const results = await window.api.checkPrerequisites();
      
      stepContent.innerHTML = `
        <div class="animate-fade-in-up">
            <h2 class="mb-lg">${t('prereq_title')}</h2>
            <p class="text-secondary mb-lg">${t('prereq_sub')}</p>
            
            ${renderItem('Git (Version Control)', 'git', results.git)}
            ${renderItem('Python 3.10+', 'python', results.python)}
            ${renderItem('Node.js & npm', 'npm', results.npm)}
            
            <div style="margin-top: 2rem; display: flex; justify-content: space-between;">
              <button id="btn-back" class="btn btn-secondary">${t('btn_back')}</button>
              <button id="btn-next" class="btn btn-primary" ${!(results.git && results.python && results.npm) ? 'disabled' : ''}>${t('btn_next')} ➔</button>
            </div>
        </div>
      `;

      document.getElementById('btn-back').addEventListener('click', () => {
        currentStep = 0;
        updateStepper();
        renderWelcome();
      });

      const nextBtn = document.getElementById('btn-next');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          currentStep = 2;
          updateStepper();
          renderWorkspace();
        });
      }
      
      // Attach auto-install listeners
      document.querySelectorAll('.install-dep-btn').forEach(btn => {
          btn.addEventListener('click', async (e) => {
              const depName = e.target.getAttribute('data-dep');
              
              // Set button to loading state
              e.target.innerText = 'Installing...';
              e.target.disabled = true;
              
              try {
                  const installResult = await window.api.installDependency(depName);
                  if (installResult.success) {
                      // Re-run checks to verify and update UI
                      checkPrereqs();
                  } else {
                      e.target.innerText = 'Failed';
                      e.target.classList.replace('btn-secondary', 'btn-error');
                      alert(`Failed to install ${depName}. See the Debug Console for details.`);
                  }
              } catch (err) {
                 e.target.innerText = 'Error';
                 alert("Installation exception: " + err.message);
              }
          });
      });

    } catch (e) {
      stepContent.innerHTML = `<p class="text-error">Error checking prerequisites: ${e.message}</p>`;
    }
  };

  stepContent.innerHTML = `
    <div class="animate-fade-in-up">
      <h2 class="mb-lg">Checking System Requirements</h2>
      ${renderItem('Git (Version Control)', 'git', undefined)}
      ${renderItem('Python 3.10+', 'python', undefined)}
      ${renderItem('Node.js & npm', 'npm', undefined)}
    </div>
  `;
  checkPrereqs();
}

/* -- Step 2: Workspace Configuration -- */
function renderWorkspace() {
  stepContent.innerHTML = `
    <div class="animate-fade-in-up">
      <h2 class="mb-lg">${t('work_title')}</h2>
      <p class="text-secondary mb-md">${t('work_sub')}</p>

      <div class="input-group">
        <label class="input-label">Workspace Directory</label>
        <input type="text" class="input-field" id="input-workspace" value="${configData.workspacePath}" />
      </div>
      
      <div id="setup-status" class="mt-4 text-secondary" style="display: none; height: 1.5rem; color: var(--primary-color);"></div>

      <div class="flex justify-between gap-md" style="margin-top: 2rem;">
        <button class="btn btn-secondary" id="btn-back">${t('btn_back')}</button>
        <button class="btn btn-primary" id="btn-next">${t('btn_install')}</button>
      </div>
    </div>
  `;

  document.getElementById('btn-back').addEventListener('click', () => {
    configData.workspacePath = document.getElementById('input-workspace').value;
    currentStep = 1;
    updateStepper();
    renderPrerequisites();
  });

  document.getElementById('btn-next').addEventListener('click', async () => {
    const btnNext = document.getElementById('btn-next');
    const statusDiv = document.getElementById('setup-status');
    
    configData.workspacePath = document.getElementById('input-workspace').value;
    btnNext.disabled = true;
    btnNext.innerText = 'Installing...';
    statusDiv.style.display = 'block';
    statusDiv.innerText = 'Creating directory and cloning repository...';

    try {
      if (window.api && window.api.setupWorkspace) {
        await window.api.setupWorkspace(configData.workspacePath);
      }
      
      currentStep = 3;
      updateStepper();
      renderApiKey();
    } catch (e) {
      statusDiv.style.color = 'var(--error-color)';
      statusDiv.innerText = 'Error: ' + e.message;
      btnNext.disabled = false;
      btnNext.innerText = 'Retry Install';
    }
  });
}

/* -- Step 3: API Key Configuration -- */
function renderApiKey() {
  if (!configData.apiKeys || configData.apiKeys.length === 0) {
    configData.apiKeys = [{ id: Date.now(), provider: 'OpenAI', key: '' }];
  }

  const providers = [
    'OpenAI', 'Anthropic', 'Google Gemini', 'Amazon Bedrock', 'ByteDance Doubao',
    'Cloudflare AI Gateway', 'Claude Max API Proxy', 'Deepgram', 'DeepSeek',
    'GitHub Copilot', 'GLM Models', 'Hugging Face', 'Kilocode', 'Litellm',
    'MiniMax', 'Mistral', 'Moonshot AI', 'NVIDIA', 'Ollama', 'OpenCode Go',
    'OpenCode', 'OpenRouter', 'Qianfan', 'Qwen', 'Synthetic', 'Together',
    'Vercel AI Gateway', 'Venice AI', 'vLLM', 'Xiaomi MiMo', 'Z.AI', 'Custom...'
  ];

  const renderRows = () => {
    const container = document.getElementById('api-keys-container');
    if (!container) return;
    
    container.innerHTML = configData.apiKeys.map((item) => `
      <div class="input-group" style="display: flex; gap: 10px; margin-bottom: 1rem; align-items: flex-end;">
        <div style="flex: 1;">
          <label class="input-label" style="font-size: 0.75rem;">Provider</label>
          <select class="input-field provider-select" data-id="${item.id}" style="padding: 0.6rem; background: var(--bg-tertiary);">
            ${providers.map(p => `<option value="${p}" ${item.provider === p ? 'selected' : ''}>${p}</option>`).join('')}
          </select>
        </div>
        <div style="flex: 2;">
          <label class="input-label" style="font-size: 0.75rem;">Your Secret Key</label>
          <input type="password" class="input-field key-input" data-id="${item.id}" placeholder="Enter Key..." value="${item.key}" />
        </div>
        <button class="btn btn-secondary remove-key-btn" data-id="${item.id}" style="padding: 0.6rem 0.8rem; height: 40px; color: var(--error-color); border: 1px solid var(--error-color); background: transparent;" ${configData.apiKeys.length === 1 ? 'disabled' : ''}>✕</button>
      </div>
    `).join('');

    document.querySelectorAll('.provider-select').forEach(el => {
      el.addEventListener('change', (e) => {
        const id = parseInt(e.target.getAttribute('data-id'));
        const row = configData.apiKeys.find(r => r.id === id);
        if (row) row.provider = e.target.value;
      });
    });

    document.querySelectorAll('.key-input').forEach(el => {
      el.addEventListener('input', (e) => {
        const id = parseInt(e.target.getAttribute('data-id'));
        const row = configData.apiKeys.find(r => r.id === id);
        if (row) row.key = e.target.value;
      });
    });

    document.querySelectorAll('.remove-key-btn').forEach(el => {
      el.addEventListener('click', (e) => {
        if (configData.apiKeys.length <= 1) return;
        const id = parseInt(e.target.getAttribute('data-id'));
        configData.apiKeys = configData.apiKeys.filter(r => r.id !== id);
        renderRows(); // re-render list
      });
    });
  };

  stepContent.innerHTML = `
    <div class="animate-fade-in-up">
      <h2 class="mb-lg">${t('api_title')}</h2>
      <p class="text-secondary mb-md">${t('api_sub')}</p>
      
      <div id="api-keys-container"></div>
      
      <button class="btn btn-secondary mt-2" id="btn-add-key" style="width: 100%; border-style: dashed; padding: 0.5rem;">+ Add Another Key</button>

      <div id="key-status" class="mt-4 text-secondary" style="display: none; height: 1.5rem; color: var(--primary-color);"></div>

      <div class="flex justify-between gap-md" style="margin-top: 2rem;">
        <button class="btn btn-secondary" id="btn-back">${t('btn_back')}</button>
        <button class="btn btn-primary" id="btn-next">${t('btn_save')}</button>
      </div>
    </div>
  `;

  renderRows(); // initial render

  document.getElementById('btn-add-key').addEventListener('click', () => {
    configData.apiKeys.push({ id: Date.now(), provider: 'Anthropic', key: '' });
    renderRows();
  });

  document.getElementById('btn-back').addEventListener('click', () => {
    currentStep = 2;
    updateStepper();
    renderWorkspace();
  });

  document.getElementById('btn-next').addEventListener('click', async () => {
    const btnNext = document.getElementById('btn-next');
    const statusDiv = document.getElementById('key-status');

    btnNext.disabled = true;
    btnNext.innerText = 'Saving...';
    statusDiv.style.display = 'block';
    statusDiv.innerText = 'Writing configuration...';

    try {
      if (window.api && window.api.saveApiKey) {
        await window.api.saveApiKey(configData);
      }
      currentStep = 4;
      updateStepper();
      renderChannelSetup();
    } catch (e) {
      statusDiv.style.color = 'var(--error-color)';
      statusDiv.innerText = 'Error: ' + e.message;
      btnNext.disabled = false;
      btnNext.innerText = 'Retry Save';
    }
  });
}

/* -- Step 4: Channel Setup -- */
function renderChannelSetup() {
  if (!configData.channels || configData.channels.length === 0) {
    configData.channels = [{ id: Date.now(), provider: 'Slack', key: '' }];
  }

  const defaultProviders = ['Slack', 'Discord', 'Telegram', 'Viber', 'WhatsApp', 'Webhook', 'Terminal', 'Custom...'];

  const renderRows = () => {
    const container = document.getElementById('channels-container');
    if (!container) return;
    
    container.innerHTML = configData.channels.map((item) => `
      <div class="input-group" style="display: flex; gap: 10px; margin-bottom: 1rem; align-items: flex-end;">
        <div style="flex: 1;">
          <label class="input-label" style="font-size: 0.75rem;">Platform</label>
          <select class="input-field channel-select" data-id="${item.id}" style="padding: 0.6rem; background: var(--bg-tertiary);">
            ${defaultProviders.map(p => `<option value="${p}" ${item.provider === p ? 'selected' : ''}>${p}</option>`).join('')}
          </select>
        </div>
        <div style="flex: 2;">
          <label class="input-label" style="font-size: 0.75rem;">${item.provider === 'WhatsApp' ? 'WhatsApp Authorization' : 'Bot Token / Webhook URL'}</label>
          ${item.provider === 'WhatsApp' ? (
            item.key === 'linked' ? 
              `<div style="height: 48px; border: 1px solid var(--success-color); border-radius: var(--radius-md); background: rgba(16, 185, 129, 0.1); display: flex; align-items: center; justify-content: center; color: var(--success-color); font-weight: 600;">✅ WhatsApp Linked</div>` 
            : item.scanning ? 
              `<div style="display: flex; flex-direction: column; justify-content: center; align-items: center; background: rgba(255,159,28,0.1); padding: 0.5rem; border: 1px dashed var(--accent-primary); border-radius: var(--radius-md); width: 100%; height: 48px; margin-top: 5px; color: var(--accent-primary); font-size: 0.85rem; font-weight: 500;"><div>👀 Scan the QR Code from the Debug Log below</div></div>`
            : 
              `<button class="btn btn-secondary btn-generate-wa" data-id="${item.id}" style="width: 100%; height: 48px; border: 1px dashed var(--accent-primary); color: var(--text-primary);">Generate QR Code</button>`
          ) : (
            `<input type="password" class="input-field channel-input" data-id="${item.id}" placeholder="Enter connection string..." value="${item.key}" />`
          )}
        </div>
        <button class="btn btn-secondary remove-channel-btn" data-id="${item.id}" style="padding: 0.6rem 0.8rem; height: 40px; color: var(--error-color); border: 1px solid var(--error-color); background: transparent;" ${configData.channels.length === 1 ? 'disabled' : ''}>✕</button>
      </div>
    `).join('');

    document.querySelectorAll('.channel-select').forEach(el => {
      el.addEventListener('change', (e) => {
        const id = parseInt(e.target.getAttribute('data-id'));
        const row = configData.channels.find(r => r.id === id);
        if (row) {
          row.provider = e.target.value;
          if (row.provider === 'WhatsApp') row.key = '';
          renderRows();
        }
      });
    });

    document.querySelectorAll('.channel-input').forEach(el => {
      el.addEventListener('input', (e) => {
        const id = parseInt(e.target.getAttribute('data-id'));
        const row = configData.channels.find(r => r.id === id);
        if (row) row.key = e.target.value;
      });
    });

    document.querySelectorAll('.remove-channel-btn').forEach(el => {
      el.addEventListener('click', (e) => {
        if (configData.channels.length <= 1) return;
        const id = parseInt(e.target.getAttribute('data-id'));
        configData.channels = configData.channels.filter(r => r.id !== id);
        renderRows();
      });
    });

    document.querySelectorAll('.btn-generate-wa').forEach(el => {
      el.addEventListener('click', async (e) => {
        const id = parseInt(e.target.getAttribute('data-id'));
        const row = configData.channels.find(r => r.id === id);
        if (!row) return;

        row.scanning = true;
        renderRows();

        try {
           const res = await window.api.generateWhatsAppQR(configData.workspacePath);
           if (res.success) {
               row.key = 'linked';
               row.scanning = false;
               renderRows();
           } else {
               row.scanning = false;
               renderRows();
               alert("Failed to link WhatsApp: " + res.error);
           }
        } catch(err) {
           row.scanning = false;
           renderRows();
           alert("Error linking WhatsApp.");
        }
      });
    });
  };

  stepContent.innerHTML = `
    <div class="animate-fade-in-up">
      <h2 class="mb-lg">${t('channel_title')}</h2>
      <p class="text-secondary mb-md">${t('channel_sub')}</p>
      
      <div id="channels-container"></div>
      
      <button class="btn btn-secondary mt-2" id="btn-add-channel" style="width: 100%; border-style: dashed; padding: 0.5rem;">+ Add Another Channel</button>

      <div id="channel-status" class="mt-4 text-secondary" style="display: none; height: 1.5rem; color: var(--primary-color);"></div>

      <div class="flex justify-between gap-md" style="margin-top: 2rem;">
        <button class="btn btn-secondary" id="btn-back">${t('btn_back')}</button>
        <button class="btn btn-primary" id="btn-next">${t('btn_finish')}</button>
      </div>
    </div>
  `;

  renderRows();

  document.getElementById('btn-add-channel').addEventListener('click', () => {
    configData.channels.push({ id: Date.now(), provider: 'Discord', key: '' });
    renderRows();
  });

  document.getElementById('btn-back').addEventListener('click', () => {
    currentStep = 3;
    updateStepper();
    renderApiKey();
  });

  document.getElementById('btn-next').addEventListener('click', async () => {
    const btnNext = document.getElementById('btn-next');
    const statusDiv = document.getElementById('channel-status');

    btnNext.disabled = true;
    btnNext.innerText = 'Connecting...';
    statusDiv.style.display = 'block';
    statusDiv.innerText = 'Writing channel configuration...';

    try {
      if (window.api && window.api.saveChannels) {
        await window.api.saveChannels(configData);
      }
      currentStep = 5;
      updateStepper();
      renderControlPanel();
    } catch (e) {
      statusDiv.style.color = 'var(--error-color)';
      statusDiv.innerText = 'Error: ' + e.message;
      btnNext.disabled = false;
      btnNext.innerText = 'Retry Save';
    }
  });
}

/* -- Step 5: Control Panel -- */
function renderControlPanel() {
  stepContent.innerHTML = `
    <div class="animate-fade-in-up" style="text-align: center; padding: 1rem 0;">
      <h2 id="control-title" class="text-gradient mb-md">${t('control_title')}</h2>
      <p id="control-subtitle" class="text-secondary mb-xl">${t('control_sub')} ${configData.workspacePath}</p>
      
      <div id="control-actions" class="flex justify-center gap-md mt-4" style="flex-direction: column; max-width: 300px; margin: 0 auto;">
        <button class="btn btn-primary" id="btn-start" style="width: 100%; margin-bottom: 0.5rem;">${t('btn_start')}</button>
        
        <div class="test-message-card" style="background: var(--bg-tertiary); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 0.5rem; text-align: left; border: 1px solid var(--border-color);">
           <label class="input-label" style="font-size: 0.75rem; margin-bottom: 4px;">Test Integration (Target Number)</label>
           <input type="text" id="test-phone" class="input-field" placeholder="+1234567890" style="margin-bottom: 8px; padding: 0.6rem; font-size: 0.85rem;" />
           
           <label class="input-label" style="font-size: 0.75rem; margin-bottom: 4px;">Message Body</label>
           <input type="text" id="test-msg" class="input-field" placeholder="Hello from OpenClaw" style="margin-bottom: 8px; padding: 0.6rem; font-size: 0.85rem;" />
           
           <button class="btn btn-secondary" id="btn-test-send" style="width: 100%; border: 1px dashed var(--accent-primary); color: var(--text-primary); margin-top: 4px;">Send Test Message</button>
        </div>

        <button class="btn btn-secondary" id="btn-stop" style="width: 100%; margin-bottom: 0.5rem;" disabled>${t('btn_stop')}</button>
        <button class="btn btn-secondary" id="btn-kill" style="width: 100%; margin-bottom: 1.5rem; color: #ff9f1c; border-color: #ff9f1c;">${t('btn_kill')}</button>
        
        <button class="btn" id="btn-uninstall" style="width: 100%; background: transparent; border: 1px solid var(--error-color); color: var(--error-color);">${t('btn_uninstall')}</button>
      </div>
      <div id="panel-status" class="mt-4" style="min-height: 1.5rem; font-size: 0.9rem;"></div>
    </div>
  `;

  const btnStart = document.getElementById('btn-start');
  const btnTestSend = document.getElementById('btn-test-send');
  const inputTestPhone = document.getElementById('test-phone');
  const inputTestMsg = document.getElementById('test-msg');
  const btnStop = document.getElementById('btn-stop');
  const btnKill = document.getElementById('btn-kill');
  const btnUninstall = document.getElementById('btn-uninstall');
  const statusDiv = document.getElementById('panel-status');

  const setStatus = (msg, isError = false) => {
    statusDiv.innerText = msg;
    statusDiv.style.color = isError ? 'var(--error-color)' : 'var(--primary-color)';
  };

  btnStart.addEventListener('click', async () => {
    setStatus('Starting OpenClaw...');
    btnStart.disabled = true;
    try {
      if (window.api && window.api.startClaw) {
        const res = await window.api.startClaw({ workspacePath: configData.workspacePath, lang: currentLang });
        if (!res.success) throw new Error(res.error || res.message);
      }
      setStatus('OpenClaw is running.');
      btnStop.disabled = false;
    } catch (e) {
      setStatus('Failed to start: ' + e.message, true);
      btnStart.disabled = false;
    }
  });

  btnStop.addEventListener('click', async () => {
    setStatus('Stopping OpenClaw...');
    btnStop.disabled = true;
    try {
      if (window.api && window.api.stopClaw) {
        const res = await window.api.stopClaw();
        if (!res.success) throw new Error(res.error || res.message);
      }
      setStatus('OpenClaw stopped.');
      btnStart.disabled = false;
    } catch (e) {
      setStatus('Failed to stop: ' + e.message, true);
      btnStop.disabled = false;
    }
  });

  btnTestSend.addEventListener('click', async () => {
    const phone = inputTestPhone.value.trim();
    const msg = inputTestMsg.value.trim();
    
    if (!phone || !msg) {
        setStatus('Please enter both number and message.', true);
        return;
    }

    setStatus('Dispatching test message...');
    btnTestSend.disabled = true;
    btnTestSend.innerText = 'Sending...';
    
    try {
      if (window.api && window.api.testMessage) {
        const res = await window.api.testMessage(configData.workspacePath, phone, msg);
        if (!res.success) throw new Error(res.error || res.message);
      }
      setStatus('Message command executed! Check log.');
      btnTestSend.innerText = 'Sent!';
      setTimeout(() => {
          btnTestSend.innerText = 'Send Test Message';
          btnTestSend.disabled = false;
      }, 3000);
    } catch (e) {
      setStatus('Dispatch failed: ' + e.message, true);
      btnTestSend.innerText = 'Error';
      setTimeout(() => {
          btnTestSend.innerText = 'Send Test Message';
          btnTestSend.disabled = false;
      }, 3000);
    }
  });

  btnKill.addEventListener('click', async () => {
    const confirmKill = confirm('Are you sure you want to forcibly kill all OpenClaw related tasks?');
    if (!confirmKill) return;

    setStatus('Killing tasks...');
    try {
      if (window.api && window.api.killAllTasks) {
        const res = await window.api.killAllTasks();
        if (!res.success) throw new Error(res.error || res.message);
      }
      setStatus('Tasks killed forcibly.');
      btnStart.disabled = false;
      btnStop.disabled = true;
    } catch (e) {
      setStatus('Failed to kill tasks: ' + e.message, true);
    }
  });

  btnUninstall.addEventListener('click', async () => {
    const confirmUninstall = confirm('WARNING: This will delete the OpenClaw workspace directory! Are you super sure?');
    if (!confirmUninstall) return;

    setStatus('Uninstalling...');
    btnUninstall.disabled = true;
    try {
      if (window.api && window.api.uninstallClaw) {
        const res = await window.api.uninstallClaw(configData.workspacePath);
        if (!res.success) throw new Error(res.error || res.message);
      }
      alert('Uninstalled successfully.');
      // Reset back to absolute beginning
      configData.apiKey = '';
      currentStep = 0;
      updateStepper();
      renderWelcome();
    } catch (e) {
      setStatus('Failed to uninstall: ' + e.message, true);
      btnUninstall.disabled = false;
    }
  });
}

// Initialize
renderWelcome();
