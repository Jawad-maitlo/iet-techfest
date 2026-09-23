/* ============================================================
   REGISTRATION.JS
   - Reads SITE_DATA.registration
   - Auto-generates QR code from formUrl
   - Wires up ALL register buttons on the page
   - Shows "Coming Soon" state if isOpen = false
============================================================ */
(function () {
  const reg = SITE_DATA.registration;
  const formUrl = reg.formUrl;
  const isOpen  = reg.isOpen;

  /* ── 1. Wire up ALL register buttons ── */
  const allRegBtns = document.querySelectorAll(
    "#nav-register-btn, #mobile-register-btn, .hero-register-btn, .hackathon-register-btn, .cta-register-btn, .pricing-btn"
  );

  allRegBtns.forEach(btn => {
    if (isOpen) {
      btn.href   = formUrl;
      btn.target = "_blank";
      btn.rel    = "noopener noreferrer";
      btn.textContent = "Register Now →";
    } else {
      btn.href   = document.getElementById("register") ? "#register" : "index.html#register";
      btn.classList.add("registration-pending");
      btn.style.cursor  = "default";
      // Keep text but show coming soon badge
      if (!btn.textContent.includes("Coming Soon")) {
        btn.textContent = "Registration soon";
      }
      btn.addEventListener("click", e => {
        // Still scroll to the register section so they see the QR / form link
        const section = document.getElementById("register");
        if (section) { e.preventDefault(); section.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }); }
      });
    }
  });

  /* ── 2. Inject the big Register button inside the section ── */
  const btnWrap = document.getElementById("register-btn-wrap");
  if (btnWrap) {
    if (isOpen) {
      btnWrap.innerHTML = `
        <a href="${formUrl}" target="_blank" rel="noopener noreferrer"
           class="btn btn-primary btn-lg reg-main-btn">
          Register Now →
        </a>
      `;
    } else {
      btnWrap.innerHTML = `
        <div class="reg-coming-soon">
          <span class="reg-coming-badge">⏳ Registration Opening Soon</span>
          <p>Stay tuned — the form link will appear here once registration opens.</p>
        </div>
      `;
    }
  }

  /* ── 3. Show form URL as text link ── */
  const linkText = document.getElementById("reg-form-link-text");
  if (linkText) {
    if (isOpen) {
      linkText.innerHTML = `
        Or open directly: 
        <a href="${formUrl}" target="_blank" rel="noopener noreferrer"
           class="reg-direct-link">${formUrl}</a>
      `;
    } else {
      linkText.innerHTML = `Form link will be shared once registration opens.`;
    }
  }

  /* ── 4. Generate QR code ── */
  const qrWrapper = document.getElementById("qr-wrapper");
  if (!qrWrapper) return;

  if (!isOpen) {
    qrWrapper.innerHTML = '<div class="qr-fallback"><p>Registration QR<br>available soon</p></div>';
    return;
  }

  // If a custom QR image is provided, use it
  if (reg.qrImage) {
    qrWrapper.innerHTML = `<img src="${reg.qrImage}" alt="Registration QR Code" class="qr-img-custom" />`;
    return;
  }

  // Otherwise auto-generate QR from formUrl using QRCode.js
  const qrUrl = isOpen ? formUrl : window.location.href;

  if (typeof QRCode !== "undefined") {
    // Clear placeholder
    qrWrapper.innerHTML = "";

    const qr = new QRCode(qrWrapper, {
      text:          qrUrl,
      width:         200,
      height:        200,
      colorDark:     "#030d2c",
      colorLight:    "#ffffff",
      correctLevel:  QRCode.CorrectLevel.H,
    });

    // Style the canvas/img QRCode.js creates
    setTimeout(() => {
      const canvas = qrWrapper.querySelector("canvas");
      const img    = qrWrapper.querySelector("img");
      const target = canvas || img;
      if (target) {
        target.style.borderRadius = "12px";
        target.style.background   = "rgba(255,255,255,0.05)";
      }
    }, 100);

    if (!isOpen) {
      // Show a subtle overlay on the QR saying "Coming Soon"
      const overlay = document.createElement("div");
      overlay.className = "qr-overlay";
      overlay.innerHTML = `<span>Form link<br>coming soon</span>`;
      qrWrapper.style.position = "relative";
      qrWrapper.appendChild(overlay);
    }
  } else {
    // Fallback if library didn't load
    qrWrapper.innerHTML = `
      <div class="qr-fallback">
        <div style="font-size:3rem;margin-bottom:12px">📋</div>
        <p style="font-size:0.8rem;color:var(--c-muted)">
          ${isOpen
            ? `<a href="${formUrl}" target="_blank" class="reg-direct-link">Open Form →</a>`
            : "QR code will appear<br>once registration opens"
          }
        </p>
      </div>
    `;
  }
})();
