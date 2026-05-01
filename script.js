document.addEventListener('DOMContentLoaded', () => {
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

  const state = { cart: [], discount: 0 };

  const toast = (msg) => {
    const el = qs('#toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    window.clearTimeout(window.__toastTimer);
    window.__toastTimer = window.setTimeout(() => el.classList.remove('show'), 2600);
  };

  const formatEuro = (n) => n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

  function renderCart() {
    const count = qs('#cartCount');
    const items = qs('#cartItems');
    const totalEl = qs('#cartTotal');
    if (!count || !items || !totalEl) return;

    count.textContent = state.cart.length;
    items.innerHTML = '';

    if (!state.cart.length) {
      items.innerHTML = '<p>Ihr Warenkorb ist leer. Ihr Gewissen arbeitet noch im Probebetrieb.</p>';
    } else {
      state.cart.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML = `<span>${item.name}</span><span>${formatEuro(item.price)}</span>`;
        row.addEventListener('click', () => {
          state.cart.splice(index, 1);
          renderCart();
          toast('Zertifikat entfernt. Die Realität versucht ein Comeback.');
        });
        items.appendChild(row);
      });
    }

    const subtotal = state.cart.reduce((sum, item) => sum + item.price, 0);
    const total = Math.max(0, subtotal * (1 - state.discount));
    totalEl.textContent = formatEuro(total);
  }

  function applyCoupon(codeRaw = '') {
    const code = codeRaw.trim().toUpperCase();
    const msg = qs('#couponMessage');

    if (code === 'KATHERINA') {
      state.discount = 0.15;
      if (msg) msg.textContent = 'Rabatt aktiviert: 15% auf fossile Zukunftsgewissheit.';
      toast('Rabattcode KATHERINA: mehr Gas, weniger Gegenwart.');
    } else if (code === 'RWE') {
      state.discount = 0.10;
      if (msg) msg.textContent = 'RWE weiß es besser™: 10% Lobby-Synergie angewendet.';
      toast('Lobby-Synergie aktiviert. Bitte ernst schauen.');
    } else if (code === '1,5GRAD') {
      state.discount = 0.015;
      if (msg) msg.textContent = '1,5% Rabatt. Wir nehmen das Ziel sehr symbolisch.';
      toast('1,5 Grad erkannt. Inhaltlich knapp, kommunikativ wertvoll.');
    } else {
      state.discount = 0;
      if (msg) msg.textContent = 'Code unbekannt. Vielleicht erst eine Kommission einsetzen?';
    }
    renderCart();
  }

  qsa('.add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      const product = button.closest('.product');
      if (!product) return;
      state.cart.push({ name: product.dataset.product, price: Number(product.dataset.price) });
      renderCart();
      toast(`${product.dataset.product} hinzugefügt. Verantwortung erfolgreich delegiert.`);
    });
  });

  qs('#cartButton')?.addEventListener('click', () => {
    renderCart();
    qs('#cartModal')?.showModal();
  });
  qs('#closeCart')?.addEventListener('click', () => qs('#cartModal')?.close());
  qs('#applyCoupon')?.addEventListener('click', () => applyCoupon(qs('#couponInput')?.value || ''));
  qsa('.coupon-inline').forEach(btn => btn.addEventListener('click', () => {
    const code = btn.dataset.code || '';
    const input = qs('#couponInput');
    if (input) input.value = code;
    qs('#cartModal')?.showModal();
    applyCoupon(code);
  }));

  function playToroSound() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  
    const notes = [
      { freq: 392, start: 0.00, duration: 0.16 },
      { freq: 523, start: 0.14, duration: 0.20 },
      { freq: 659, start: 0.30, duration: 0.28 },
      { freq: 523, start: 0.56, duration: 0.22 }
    ];
  
    notes.forEach(({ freq, start, duration }) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
  
      osc.type = "square";
      osc.frequency.value = freq;
  
      gain.gain.setValueAtTime(0.0001, audioCtx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + start + duration);
  
      osc.connect(gain);
      gain.connect(audioCtx.destination);
  
      osc.start(audioCtx.currentTime + start);
      osc.stop(audioCtx.currentTime + start + duration + 0.05);
    });
  }

  qs('#checkout').addEventListener('click', () => {
    if (!state.cart.length) return toast('Bitte erst Gewissen in den Warenkorb legen.');
  
    toast('Zahlung simuliert. Sie sind nun gefühlt klimaneutral.');
    confettiBurst();
    playToroSound();
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12 });
  qsa('.reveal').forEach(el => observer.observe(el));

  qsa('.tilt').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      if (window.matchMedia('(pointer: coarse)').matches) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - .5;
      const y = (e.clientY - rect.top) / rect.height - .5;
      card.style.transform = `rotateX(${y * -5}deg) rotateY(${x * 6}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });

  const excuses = [
    'Wir lösen das Problem mit einem marktwirtschaftlichen Instrument, das zufällig niemand kontrolliert.',
    'Klimaschutz darf die Wirtschaft nicht überfordern, außer er findet nicht statt.',
    'Die Emissionen sinken perspektivisch, sobald die Perspektive weit genug weg ist.',
    'Wir setzen auf Technologieoffenheit: offen für Gas, offen für Ausreden, offen bis 2045.',
    'Das ist kein Rückschritt, das ist eine rückwärtsgewandte Vorwärtsstrategie.',
    'Wir prüfen ambitioniert, ob andere handeln könnten.',
    'Die Bundesregierung bleibt auf Kurs. Der Kurs wurde nur nicht öffentlich beschriftet.',
    'Die Klimaziele bleiben bestehen. Wir entfernen lediglich den Teil mit dem Erreichen.'
  ];

  qs('#generateExcuse')?.addEventListener('click', () => {
    const terminal = qs('#terminalBody');
    if (!terminal) return;
    const line = document.createElement('p');
    line.textContent = '> ' + excuses[Math.floor(Math.random() * excuses.length)];
    terminal.appendChild(line);
    line.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  const calcInputs = ['#carRange', '#flightRange', '#policyRange'].map(sel => qs(sel)).filter(Boolean);
  function updateCalc() {
    if (!calcInputs.length) return;
    const score = calcInputs.reduce((sum, input) => sum + Number(input.value), 0) / calcInputs.length;
    const recommendation = qs('#recommendation');
    const copy = qs('#calcCopy');
    if (!recommendation || !copy) return;

    if (score < 35) {
      recommendation.textContent = 'Basis-Ausgleich';
      copy.textContent = 'Ein kleines Zertifikat reicht, um die innere Pressemitteilung zu beruhigen.';
    } else if (score < 70) {
      recommendation.textContent = 'Reiche Reserve';
      copy.textContent = 'Mit 1,5-fachem Gewissenshebel sieht das schon fast nach Plan aus.';
    } else {
      recommendation.textContent = 'Lobby Platinum';
      copy.textContent = 'Wir empfehlen zusätzlich eine Taskforce, drei Panels und sehr viele Verben im Futur.';
    }
  }
  calcInputs.forEach(input => input.addEventListener('input', updateCalc));
  updateCalc();

  qs('#panicButton')?.addEventListener('click', () => {
    document.body.animate([
      { filter: 'contrast(1)' },
      { filter: 'contrast(1.4) saturate(.6)' },
      { filter: 'contrast(1)' }
    ], { duration: 420, iterations: 1 });
    toast('Krisenmodus aktiv: Alle Probleme werden in Zertifikate umgewandelt.');
  });

  qs('#printCert')?.addEventListener('click', () => {
    const template = qs('#certificateTemplate');
    if (!template) return;
    const clone = template.content.cloneNode(true);
    const wrapper = document.createElement('div');
    wrapper.className = 'print-only';
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);
    window.print();
    setTimeout(() => wrapper.remove(), 500);
  });

  const prices = ['symbolisch', 'moralisch günstig', 'politisch volatil', 'nur heute seriös', 'nach Gefühl', 'extern geprüft*'];
  if (qs('#livePrice')) {
    setInterval(() => { qs('#livePrice').textContent = prices[Math.floor(Math.random() * prices.length)]; }, 1600);
  }

  document.addEventListener('mousemove', (e) => {
    const dot = qs('.cursor-dot');
    if (!dot) return;
    dot.style.left = `${e.clientX}px`;
    dot.style.top = `${e.clientY}px`;
  });

  setupCo2Vanisher();
  setupMagicChart();
  renderCart();

  function setupCo2Vanisher() {
    const co2Input = qs('#co2Input');
    const vanishCo2Btn = qs('#vanishCo2Btn');
    const co2Amount = qs('#co2Amount');
    const co2Cloud = qs('#co2Cloud');
    const co2Result = qs('#co2Result');
    const co2DisplayWrap = qs('.co2-display-wrap');
    const fakeProgressBar = qs('#fakeProgressBar');
    const bureaucracyStamp = qs('#bureaucracyStamp');
    const vanisherCard = qs('.vanisher-card');

    if (!co2Input || !vanishCo2Btn || !co2Amount || !co2Result || !co2DisplayWrap) return;

    const compensationMessages = [
      'Erledigt. Das CO₂ wurde erfolgreich in eine PowerPoint-Folie verschoben.',
      'Kompensiert. Die Atmosphäre wurde aus dem Verteiler genommen.',
      'Weg. Der Markt hat geregelt, was die Physik unnötig kompliziert gemacht hat.',
      'Neutralisiert. Dank Gewissenshebel sogar moralisch überkompensiert.',
      'Gelöst. Die Emissionen befinden sich jetzt außerhalb des Zuständigkeitsbereichs.',
      'Ausgeglichen. Bitte ab jetzt nur noch von Restverantwortung sprechen.',
      'Verschwunden. Ein sehr seriöses Zertifikat hat kurz genickt.',
      'Kompensiert. Zukunftskosten wurden automatisch an spätere Generationen weitergeleitet.',
      'Erfolg: Die Zahl ist weg. Die Moleküle äußern sich nicht zu laufenden Verfahren.'
    ];

    const formatKg = (value) => `${value.toLocaleString('de-DE', { maximumFractionDigits: 1 })} kg CO₂`;

    function spawnPuffs(amount) {
      const rect = co2DisplayWrap.getBoundingClientRect();
      const count = window.matchMedia('(max-width: 620px)').matches ? 11 : 18;
      for (let i = 0; i < count; i++) {
        const puff = document.createElement('span');
        puff.className = 'co2-particle';
        puff.textContent = ['CO₂', '€', 'PDF', 'puff', '✓'][i % 5];
        puff.style.left = `${35 + Math.random() * 30}%`;
        puff.style.top = `${38 + Math.random() * 25}%`;
        puff.style.setProperty('--tx', `${(Math.random() - 0.5) * rect.width * 0.75}px`);
        puff.style.setProperty('--ty', `${-30 - Math.random() * rect.height * 0.38}px`);
        puff.style.setProperty('--rot', `${-40 + Math.random() * 80}deg`);
        co2DisplayWrap.appendChild(puff);
        puff.addEventListener('animationend', () => puff.remove(), { once: true });
      }
    }

    function vanishCO2() {
      const rawValue = Number(co2Input.value);
      const value = Number.isFinite(rawValue) && rawValue > 0 ? rawValue : 0;

      co2DisplayWrap.classList.remove('vanishing');
      bureaucracyStamp?.classList.remove('show');
      vanisherCard?.classList.remove('shake');
      qsa('.co2-particle', co2DisplayWrap).forEach(p => p.remove());
      if (fakeProgressBar) fakeProgressBar.style.width = '0%';

      co2Amount.style.opacity = '1';
      co2Amount.style.transform = 'scale(1)';
      co2Amount.style.filter = 'none';
      co2Amount.textContent = formatKg(value);
      if (co2Cloud) co2Cloud.textContent = value > 999 ? 'sehr viel CO₂' : 'CO₂';

      if (value <= 0) {
        co2Result.textContent = 'Keine Emissionen? Verdächtig. Wir verkaufen dir vorsorglich ein Zertifikat.';
      } else if (value < 10) {
        co2Result.textContent = 'Kleinemission erkannt. Wird erst bürokratisch vergrößert und dann heldenhaft gelöst.';
      } else if (value < 100) {
        co2Result.textContent = 'Mittlere Gewissensbelastung erkannt. Starte Sofort-Kompensation™.';
      } else {
        co2Result.textContent = 'Großemission erkannt. Aktiviere Sondervermögen Gutes Gewissen.';
      }

      window.setTimeout(() => {
        if (fakeProgressBar) fakeProgressBar.style.width = '115%';
        co2DisplayWrap.classList.add('vanishing');
        vanisherCard?.classList.add('shake');
        spawnPuffs(value);
      }, 40);

      window.setTimeout(() => {
        co2Amount.textContent = '0 kg CO₂';
        co2Amount.style.opacity = '1';
        co2Amount.style.transform = 'scale(1)';
        co2Amount.style.filter = 'none';
        co2Result.textContent = compensationMessages[Math.floor(Math.random() * compensationMessages.length)];
        bureaucracyStamp?.classList.add('show');
      }, 1040);
    }

    vanishCo2Btn.addEventListener('click', vanishCO2);
    co2Input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') vanishCO2();
    });
  }

  function setupMagicChart() {
    const solveEmissionsBtn = qs('#solveEmissionsBtn');
    const magicChartCard = qs('.magic-chart-card');
    const chartCommentary = qs('#chartCommentary');
    const emissionsLine = qs('#emissionsLine');
    const chartStage = qs('.chart-stage');
    if (!solveEmissionsBtn || !magicChartCard || !chartCommentary || !emissionsLine) return;

    const originalLine = 'M100 85 C220 100, 270 130, 340 128 C430 126, 450 160, 500 170 C590 190, 620 260, 690 305 C740 335, 790 345, 830 348';
    const solvedLine = 'M100 85 C190 150, 260 220, 350 270 C460 328, 560 345, 660 350 C730 354, 790 352, 830 350';
    const chaosLine = 'M100 85 C190 70, 245 135, 315 120 C390 108, 455 190, 520 168 C590 142, 640 285, 700 250 C760 226, 790 336, 830 348';

    const chartMessages = [
      'Update: Emissionen sinken jetzt, weil die Linie sinkt. So einfach kann Politik sein.',
      'Problem gelöst: Die Achsen wurden so lange nicht beschriftet, bis es gut aussah.',
      'Klimaziel erreicht: zumindest im Präsentationsmodus und auf kleinen Displays.',
      'Die Kurve wurde erfolgreich von der Realität entkoppelt.',
      'Ministerieller Hinweis: Was unten ist, kann nicht mehr emittieren.',
      'BREAKING: Durch beherztes Diagramm-Management wurden 97% der Sorgen eingespart.',
      'Seriöse Analyse: Ab jetzt geht alles nach unten, außer die Stromrechnung.',
      'Sondervermögen aktiviert: Die Zukunft wurde auf nach der Legislaturperiode verschoben.'
    ];

    function solveChart() {
      magicChartCard.classList.remove('solved');
      emissionsLine.setAttribute('d', chaosLine);

      window.setTimeout(() => {
        magicChartCard.classList.add('solved');
        emissionsLine.setAttribute('d', solvedLine);
      }, 80);

      chartCommentary.textContent = chartMessages[Math.floor(Math.random() * chartMessages.length)];
      solveEmissionsBtn.textContent = 'Noch weiter runterwischen';
      window.setTimeout(() => { solveEmissionsBtn.textContent = 'Emissionen erneut wegerklären'; }, 1400);
    }

    solveEmissionsBtn.addEventListener('click', solveChart);

    let touchStartY = null;
    chartStage?.addEventListener('touchstart', (event) => {
      touchStartY = event.touches[0]?.clientY ?? null;
    }, { passive: true });
    chartStage?.addEventListener('touchend', (event) => {
      if (touchStartY === null) return;
      const endY = event.changedTouches[0]?.clientY ?? touchStartY;
      if (endY - touchStartY > 32) solveChart();
      touchStartY = null;
    }, { passive: true });

    // Reset once on load so the first animation is always visible.
    emissionsLine.setAttribute('d', originalLine);
  }

  function confettiBurst() {
    let layer = document.querySelector(".confetti-layer");
  
    if (!layer) {
      layer = document.createElement("div");
      layer.className = "confetti-layer";
      document.body.appendChild(layer);
    }
  
    const pieces = ["€", "CO₂", "✓", "Gas", "1,5×", "🌱", "💸", "📄"];
  
    for (let i = 0; i < 70; i++) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.textContent = pieces[Math.floor(Math.random() * pieces.length)];
  
      piece.style.left = Math.random() * 100 + "vw";
  
      layer.appendChild(piece);
  
      piece.animate(
        [
          {
            transform: `translateY(-5vh) translateX(0) rotate(0deg)`,
            opacity: 1
          },
          {
            transform: `translateY(${85 + Math.random() * 20}vh) translateX(${(Math.random() - 0.5) * 120}px) rotate(${Math.random() * 900}deg)`,
            opacity: 0
          }
        ],
        {
          duration: 1200 + Math.random() * 1200,
          easing: "cubic-bezier(.2,.8,.2,1)"
        }
      ).onfinish = () => piece.remove();
    }
  
    setTimeout(() => {
      if (!layer.children.length) layer.remove();
    }, 2600);
  }
});
