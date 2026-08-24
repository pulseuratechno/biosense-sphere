/**
 * PULSEura - BioSense Sphere Interactive Scripts
 * Handling Canvas Particles, Layer Model Explorer, Telemetry Simulator, and UI Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // 1. Mobile Menu Toggle
  initMobileMenu();

  // 2. Ambient Molecular Particles Canvas Background
  initAmbientCanvas();

  // 3. Interactive Conceptual Sphere Model Layer Inspector
  initSphereModelInspector();

  // 4. Live Biomarker & Telemetry Simulator
  initTelemetrySimulator();

  // 5. Contact & Collaboration Form Handling
  initContactForm();

  // 6. Smooth Scroll Spy for Active Navigation Links
  initScrollSpy();
});

/* ==========================================================================
   1. Mobile Navigation Menu
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });
}

/* ==========================================================================
   2. Ambient Molecular Particles Canvas
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor(window.innerWidth / 25), 50);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 1;
      this.alpha = Math.random() * 0.4 + 0.1;
      this.color = Math.random() > 0.5 ? 'rgba(56, 189, 248,' : 'rgba(0, 210, 255,';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color} ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.12 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(render);
  }

  render();

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
}

/* ==========================================================================
   3. Interactive Conceptual Sphere Model Inspector
   ========================================================================== */
function initSphereModelInspector() {
  const layerData = {
    outer: {
      tag: 'LAYER 01 / 05',
      title: 'Outer Biocompatible / Protective Layer',
      desc: 'Transient outer matrix designed to interface safely with biological tissues while shielding active sensing mechanisms, preventing cellular biofouling, and regulating analyte diffusion.',
      spec: 'Under screening: Biodegradable polymers & biocompatible hydrogels',
      targetId: 'layer-outer'
    },
    sensing: {
      tag: 'LAYER 02 / 05',
      title: 'Selective Sensing Layer',
      desc: 'Functionalized chemical matrix containing responsive dyes, ionophores, or receptor-specific recognition elements tuned to detect pH shifts, enzymes (e.g. MMP-9), or inflammatory biomarkers.',
      spec: 'Chemistry: Protease-cleavable substrates & pH-responsive fluorescent/potentiometric elements',
      targetId: 'layer-sensing'
    },
    transduction: {
      tag: 'LAYER 03 / 05',
      title: 'Signal Transduction Component',
      desc: 'Converts chemical or enzymatic binding reactions into measurable electrochemical, optical, or resonant physical changes without requiring internal battery power.',
      spec: 'Mechanism: Passive resonant / near-field coupling transduction',
      targetId: 'layer-transduction'
    },
    core: {
      tag: 'LAYER 04 / 05',
      title: 'Internal Support / Structural Core',
      desc: 'Provides mechanical integrity during handling and deployment. Formulated with biodegradable transient material designed to safely dissolve over a predetermined lifecycle.',
      spec: 'Material: Biodegradable micro-carrier substrate with zero permanent implant waste',
      targetId: 'layer-core'
    },
    reader: {
      tag: 'EXTERNAL COMPONENT',
      title: 'External Reusable Reader & Telemetry',
      desc: 'Noninvasive external hardware unit positioned adjacent to the wound site to wirelessly query the sensing sphere, acquire analog signals, digitize data, and stream metrics to clinical software.',
      spec: 'Hardware: Low-noise analog front-end, Bluetooth / BLE microcontroller, rechargeable cell',
      targetId: null
    }
  };

  const buttons = document.querySelectorAll('.layer-tab-btn');
  const svgNodes = document.querySelectorAll('.sphere-layer-node');
  const tagEl = document.getElementById('layer-tag');
  const titleEl = document.getElementById('layer-title');
  const descEl = document.getElementById('layer-desc');
  const specEl = document.getElementById('layer-spec');

  function selectLayer(key) {
    const data = layerData[key];
    if (!data) return;

    // Update Text Content
    tagEl.textContent = data.tag;
    titleEl.textContent = data.title;
    descEl.textContent = data.desc;
    specEl.textContent = data.spec;

    // Update Tab Buttons
    buttons.forEach(btn => {
      if (btn.dataset.layer === key) {
        btn.classList.add('glass-navy-card-active', 'text-cyan-300');
      } else {
        btn.classList.remove('glass-navy-card-active', 'text-cyan-300');
      }
    });

    // Update SVG Circles
    svgNodes.forEach(node => {
      if (node.dataset.layer === key) {
        node.classList.add('active-layer');
      } else {
        node.classList.remove('active-layer');
      }
    });
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      selectLayer(btn.dataset.layer);
    });
  });

  svgNodes.forEach(node => {
    node.addEventListener('click', () => {
      selectLayer(node.dataset.layer);
    });
  });

  // Default to outer layer
  selectLayer('outer');
}

/* ==========================================================================
   4. Live Biomarker & Telemetry Simulator
   ========================================================================== */
function initTelemetrySimulator() {
  const phInput = document.getElementById('sim-ph');
  const tempInput = document.getElementById('sim-temp');
  const proteaseInput = document.getElementById('sim-protease');

  const phValEl = document.getElementById('sim-ph-val');
  const tempValEl = document.getElementById('sim-temp-val');
  const proteaseValEl = document.getElementById('sim-protease-val');

  const statusTitleEl = document.getElementById('sim-status-title');
  const statusDescEl = document.getElementById('sim-status-desc');
  const voltageEl = document.getElementById('sim-voltage');
  const snrEl = document.getElementById('sim-snr');
  const confEl = document.getElementById('sim-conf');

  if (!phInput || !tempInput || !proteaseInput) return;

  function updateSimulation() {
    const ph = parseFloat(phInput.value);
    const temp = parseFloat(tempInput.value);
    const protease = parseInt(proteaseInput.value, 10);

    // Update UI Labels
    let phLabel = `${ph.toFixed(1)} `;
    if (ph >= 7.0 && ph <= 7.4) phLabel += '(Neutral / Normal)';
    else if (ph > 7.4) phLabel += '(Alkaline Shift - Alert)';
    else phLabel += '(Acidic)';
    phValEl.textContent = phLabel;

    let tempLabel = `${temp.toFixed(1)} °C `;
    if (temp < 37.2) tempLabel += '(Normothermic)';
    else if (temp <= 38.0) tempLabel += '(Mild Elevation)';
    else tempLabel += '(Elevated / Inflammatory)';
    tempValEl.textContent = tempLabel;

    const proteaseLevels = ['Normal Basal', 'Low Active', 'Moderate Activity', 'High Expression', 'Severe Protease Surge'];
    proteaseValEl.textContent = proteaseLevels[protease - 1] || 'Normal';

    // Calculate Simulated Risk Index (0 - 100)
    let riskScore = 10;
    if (ph > 7.3) riskScore += (ph - 7.3) * 35;
    if (temp > 37.0) riskScore += (temp - 37.0) * 25;
    riskScore += (protease - 1) * 12;

    riskScore = Math.min(Math.max(Math.round(riskScore), 5), 98);

    // Compute Simulated Sensor Transduction Voltage (1.0V - 3.3V)
    const simulatedVoltage = (1.1 + (riskScore / 100) * 1.8).toFixed(2);
    const simulatedSnr = (22.0 - (riskScore / 100) * 8.5).toFixed(1);
    const simulatedConf = (98.5 - Math.abs(50 - riskScore) * 0.08).toFixed(1);

    voltageEl.textContent = `${simulatedVoltage} V`;
    snrEl.textContent = `${simulatedSnr} dB`;
    confEl.textContent = `${simulatedConf}%`;

    // Render Status Presentation
    if (riskScore < 35) {
      statusTitleEl.textContent = 'Baseline / Normal (Score: ' + riskScore + ')';
      statusTitleEl.className = 'text-3xl sm:text-4xl font-extrabold font-heading text-emerald-400 transition-colors';
      statusDescEl.textContent = 'Simulated biochemical telemetry indicates healthy tissue microenvironment without acute inflammatory deviation.';
    } else if (riskScore < 65) {
      statusTitleEl.textContent = 'Subtle Biochemical Shift (Score: ' + riskScore + ')';
      statusTitleEl.className = 'text-3xl sm:text-4xl font-extrabold font-heading text-sky-300 transition-colors';
      statusDescEl.textContent = 'Mild pH elevation or moderate protease activity detected. Early non-symptomatic physiological shift under observation.';
    } else {
      statusTitleEl.textContent = 'Elevated Risk Indication (Score: ' + riskScore + ')';
      statusTitleEl.className = 'text-3xl sm:text-4xl font-extrabold font-heading text-amber-400 transition-colors';
      statusDescEl.textContent = 'Significant concurrent elevation across pH, local temperature, and protease biomarkers. Cues early clinical assessment prior to visible signs.';
    }
  }

  phInput.addEventListener('input', updateSimulation);
  tempInput.addEventListener('input', updateSimulation);
  proteaseInput.addEventListener('input', updateSimulation);

  updateSimulation();
}

/* ==========================================================================
   5. Contact & Collaboration Form Handling
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');

  if (!form || !feedback) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const org = document.getElementById('contact-org').value.trim();
    const role = document.getElementById('contact-role').value;
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !role || !message) {
      feedback.className = 'p-4 rounded-xl text-xs font-mono bg-red-950/80 border border-red-500/40 text-red-200 block';
      feedback.textContent = 'Please complete all required fields (*) before submitting.';
      return;
    }

    // Success State
    feedback.className = 'p-4 rounded-xl text-xs font-mono bg-emerald-950/80 border border-emerald-400/40 text-emerald-200 block space-y-1.5';
    feedback.innerHTML = `
      <div class="font-bold flex items-center gap-1.5 text-emerald-300">
        <i data-lucide="check-circle" class="w-4 h-4 text-emerald-400"></i>
        <span>✓ Message Sent Successfully to Joshitha K</span>
      </div>
      <div>Thank you, <strong>${name}</strong>. Your message regarding the <strong>BioSense Sphere</strong> prototype has been recorded and delivered to <strong>pulseura.techno@gmail.com</strong>. We will reply to <strong>${email}</strong> shortly.</div>
    `;
    if (window.lucide) lucide.createIcons();

    form.reset();
  });
}

/* ==========================================================================
   6. Scroll Spy for Active Navigation
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('text-cyan-300', 'bg-sky-500/10');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('text-cyan-300', 'bg-sky-500/10');
      }
    });
  });
}
