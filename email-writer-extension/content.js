
// Configuration:
// For local development, use: "http://localhost:8080"
// For production (Render), use: "https://<your-app-name>.onrender.com"
const API_URL = "http://localhost:8080"; 

console.log("Draft AI - Email Writer Extension Loaded");

/* ===============================
   CSS INJECTION
   Distinct Brand Identity & Responsive Menu
================================= */
const style = document.createElement('style');
style.textContent = `
    .ai-reply-container {
        display: inline-flex !important;
        align-items: center !important;
        margin-right: 12px !important;
        font-family: 'Google Sans', Roboto, sans-serif !important;
        height: 36px !important;
        vertical-align: middle !important;
        transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
    
    .ai-reply-container:active {
        transform: scale(0.96);
    }

    .ai-main-btn {
        background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) !important;
        color: white !important;
        padding: 0 16px 0 12px !important;
        height: 100% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 8px !important;
        cursor: pointer !important;
        border-radius: 24px 0 0 24px !important;
        font-weight: 700 !important;
        font-size: 12px !important;
        text-transform: uppercase !important;
        letter-spacing: 0.8px !important;
        user-select: none !important;
        border: none !important;
        box-shadow: 0 2px 6px rgba(99, 102, 241, 0.3) !important;
        transition: all 0.3s ease !important;
    }

    .ai-logo-icon {
        width: 18px !important;
        height: 18px !important;
        flex-shrink: 0 !important;
    }

    .ai-main-btn:hover {
        background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%) !important;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.5) !important;
    }

    .ai-dropdown-btn {
        background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) !important;
        color: white !important;
        width: 32px !important;
        height: 100% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
        border-radius: 0 24px 24px 0 !important;
        border: none !important;
        border-left: 1px solid rgba(255,255,255,0.1) !important;
        transition: all 0.3s ease !important;
        box-shadow: 2px 2px 6px rgba(99, 102, 241, 0.2) !important;
    }

    .ai-dropdown-btn:hover {
        background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%) !important;
    }

    .ai-tone-menu {
        position: fixed !important;
        background: rgba(255, 255, 255, 0.98) !important;
        backdrop-filter: blur(10px) !important;
        border-radius: 12px !important;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15), 0 0 1px rgba(0,0,0,0.1) !important;
        padding: 6px !important;
        z-index: 2147483647 !important;
        min-width: 160px !important;
        border: 1px solid rgba(0,0,0,0.05) !important;
        overflow: hidden !important;
        transition: opacity 0.2s ease !important;
    }

    .ai-menu-item {
        padding: 10px 14px !important;
        cursor: pointer !important;
        font-size: 13px !important;
        font-weight: 500 !important;
        color: #1f2937 !important;
        border-radius: 8px !important;
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
        transition: background-color 0.2s !important;
    }

    .ai-menu-item:hover {
        background-color: #f3f4f6 !important;
        color: #4f46e5 !important;
    }
    
    .ai-menu-item.active {
        background-color: #eef2ff !important;
        color: #4f46e5 !important;
    }

    @keyframes ai-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    .animate-spin {
        animation: ai-spin 1s linear infinite !important;
    }
`;
document.head.appendChild(style);

/* ===============================
   LOGO ASSET
================================= */
const DRAFT_AI_LOGO = `
<svg class="ai-logo-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 25V75C30 77.7614 32.2386 80 35 80H55C68.8071 80 80 68.8071 80 55V45C80 31.1929 68.8071 20 55 20H35C32.2386 20 30 22.2386 30 25Z" stroke="white" stroke-width="6" stroke-linecap="round"/>
    <path d="M30 45L45 55L30 65" stroke="#a5b4fc" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="55" cy="50" r="8" fill="#a5b4fc"/>
</svg>`;

/* ===============================
   GET EMAIL CONTENT
================================= */
function getEmailContent() {
  const selectors = [".h7", ".a3s.aiL", ".gmail_quote", '[role="presentation"]'];
  for (const selector of selectors) {
    const content = document.querySelector(selector);
    if (content) return content.innerText.trim();
  }
  return "";
}

/* ===============================
   CREATE DYNAMIC CONTROLS
================================= */
function createAIControls() {
  const container = document.createElement("div");
  container.className = "ai-reply-container";

  let selectedTone = "professional";

  /* MAIN BUTTON (Icon Integrated) */
  const mainButton = document.createElement("button");
  mainButton.className = "ai-main-btn";
  mainButton.innerHTML = `${DRAFT_AI_LOGO} <span>AI Reply</span>`;

  /* DROPDOWN ARROW */
  const dropdownButton = document.createElement("button");
  dropdownButton.className = "ai-dropdown-btn";
  dropdownButton.innerHTML = `<svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  /* TONE MENU */
  const toneMenu = document.createElement("div");
  toneMenu.className = "ai-tone-menu";
  toneMenu.style.display = "none";
  toneMenu.style.opacity = "0";

  const tones = ["Professional", "Friendly", "Concise", "Kind"];
  tones.forEach((tone) => {
    const item = document.createElement("div");
    item.className = "ai-menu-item";
    if (tone.toLowerCase() === selectedTone) item.classList.add('active');
    item.innerHTML = `<span>${tone}</span>`;
    
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      selectedTone = tone.toLowerCase();
      toneMenu.style.opacity = "0";
      setTimeout(() => toneMenu.style.display = "none", 200);
      
      Array.from(toneMenu.children).forEach(child => child.classList.remove('active'));
      item.classList.add('active');
    });
    toneMenu.appendChild(item);
  });

  /* RESPONSIVE POSITIONING LOGIC */
  const updateMenuPosition = () => {
    const rect = dropdownButton.getBoundingClientRect();
    const menuWidth = 160;
    const menuHeight = toneMenu.offsetHeight || 160;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = rect.bottom + 8;
    let left = rect.right - menuWidth;

    if (top + menuHeight > viewportHeight) {
      top = rect.top - menuHeight - 8;
    }

    if (left < 0) {
      left = 8;
    }

    toneMenu.style.top = `${top}px`;
    toneMenu.style.left = `${left}px`;
  };

  dropdownButton.addEventListener("click", (e) => {
    e.stopPropagation();
    const isVisible = toneMenu.style.display === "block";
    
    document.querySelectorAll('.ai-tone-menu').forEach(m => {
        m.style.opacity = "0";
        m.style.display = 'none';
    });
    
    if (!isVisible) {
      toneMenu.style.display = "block";
      updateMenuPosition();
      requestAnimationFrame(() => {
        toneMenu.style.opacity = "1";
      });
    }
  });

  document.addEventListener("click", () => {
    toneMenu.style.opacity = "0";
    setTimeout(() => toneMenu.style.display = "none", 200);
  });

  window.addEventListener('resize', () => {
    if (toneMenu.style.display === 'block') updateMenuPosition();
  });

  container.appendChild(mainButton);
  container.appendChild(dropdownButton);
  document.body.appendChild(toneMenu);

  return { container, mainButton, getTone: () => selectedTone };
}

/* ===============================
   INJECT INTO GMAIL UI
================================= */
function injectButton() {
  const toolbar = document.querySelector(".btC");
  if (!toolbar || toolbar.querySelector(".ai-reply-container")) return;

  const { container, mainButton, getTone } = createAIControls();

  mainButton.addEventListener("click", async () => {
    const originalContent = mainButton.innerHTML;
    try {
      mainButton.innerHTML = `<div class="animate-spin" style="width:16px;height:16px;border:2px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%"></div> <span>Drafting...</span>`;
      mainButton.style.pointerEvents = "none";

      const emailContent = getEmailContent();
      if (!emailContent) {
        alert("Email context not detected. Please open an email thread first.");
        return;
      }

      const response = await fetch(`${API_URL}/api/email/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailContent: emailContent,
          tone: getTone(),
        }),
      });

      if (!response.ok) throw new Error("API Failed");
      const generatedReply = await response.text();

      const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');
      if (composeBox) {
        composeBox.focus();
        document.execCommand("insertText", false, generatedReply);
      }
    } catch (error) {
      console.error(error);
    } finally {
      mainButton.innerHTML = originalContent;
      mainButton.style.pointerEvents = "auto";
    }
  });

  toolbar.insertBefore(container, toolbar.firstChild);
}

setInterval(injectButton, 1500);