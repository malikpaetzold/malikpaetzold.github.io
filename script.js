const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

const state = {
  cart: [],
  discount: 0,
};

const toast = (msg) => {
  const el = qs('#toast');
  el.textContent = msg;
  el.classList.add('show');
  window.clearTimeout(window.__toastTimer);
  window.__toastTimer = window.setTimeout(() => el.classList.remove('show'), 2600);
};

const formatEuro = (n) => n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

function renderCart() {
  qs('#cartCount').textContent = state.cart.length;
  const items = qs('#cartItems');
  items.innerHTML = '';
  if (!state.cart.length) {
    items.innerHTML = '<p>Ihr Warenkorb ist leer. Ihr Gewissen leider auch.</p>';
  } else {
    state.cart.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `<span>${item.name}</span><span>${formatEuro(item.price)}</span>`;
      row.addEventListener('click', () => {
        state.cart.splice(index, 1);
        renderCart();
        toast('Zertifikat entfernt. Die Emissionen sind wieder da.');
      });
      items.appendChild(row);
    });
  }
  const subtotal = state.cart.reduce((sum, item) => sum + item.price, 0);
  const total = Math.max(0, subtotal * (1 - state.discount));
  qs('#cartTotal').textContent = formatEuro(total);
}

qsa('.add-to-cart').forEach((button) => {
  button.addEventListener('click', () => {
    const product = button.closest('.product');
    state.cart.push({ name: product.dataset.product, price: Number(product.dataset.price) });
    renderCart();
    toast(`${product.dataset.product} hinzugefügt. Verantwortung erfolgreich delegiert.`);
  });
});

qs('#cartButton').addEventListener('click', () => {
  renderCart();
  qs('#cartModal').showModal();
});
qs('#closeCart').addEventListener('click', () => qs('#cartModal').close());

function applyCoupon(codeRaw) {
  const code = codeRaw.trim().toUpperCase();
  const msg = qs('#couponMessage');
  if (code === 'KATHERINA') {
    state.discount = 0.15;
    msg.textContent = 'Rabatt aktiviert: 15% auf fossile Zukunftsgewissheit.';
    toast('Rabattcode KATHERINA: mehr Gas, weniger Kostenwahrheit.');
  } else if (code === 'RWE') {
    state.discount = 0.10;
    msg.textContent = 'RWE weiß es besser™: 10% Lobby-Synergie angewendet.';
  } else if (code === '1,5GRAD') {
    state.discount = 0.015;
    msg.textContent = '1,5% Rabatt. Wir nehmen das Ziel sehr symbolisch.';
  } else {
    state.discount = 0;
    msg.textContent = 'Code unbekannt. Vielleicht erst eine Kommission einsetzen?';
  }
  renderCart();
}

qs('#applyCoupon').addEventListener('click', () => applyCoupon(qs('#couponInput').value));
qsa('.coupon-inline').forEach(btn => btn.addEventListener('click', () => {
  qs('#couponInput').value = btn.dataset.code;
  qs('#cartModal').showModal();
  applyCoupon(btn.dataset.code);
}));

qs('#checkout').addEventListener('click', () => {
  if (!state.cart.length) return toast('Bitte erst Gewissen in den Warenkorb legen.');
  toast('Zahlung simuliert. Sie sind nun gefühlt klimaneutral.');
  confettiBurst();
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      if (entry.target.classList.contains('metrics')) animateCounters();
    }
  });
}, { threshold: 0.15 });
qsa('.reveal').forEach(el => observer.observe(el));
observer.observe(qs('.metrics'));

let countersAnimated = false;
function animateCounters() {
  if (countersAnimated) return;
  countersAnimated = true;
  qsa('[data-counter]').forEach((el) => {
    const end = Number(el.dataset.counter);
    let current = 0;
    const step = Math.max(1, Math.ceil(end / 45));
    const timer = setInterval(() => {
      current = Math.min(end, current + step);
      el.textContent = current;
      if (current >= end) clearInterval(timer);
    }, 22);
  });
}

qsa('.tilt').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - .5;
    const y = (e.clientY - rect.top) / rect.height - .5;
    card.style.transform = `rotateX(${y * -5}deg) rotateY(${x * 6}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => card.style.transform = '');
});

const excuses = [
  'Wir beschleunigen den Hochlauf von allem, was später vielleicht hilft.',
  'Klimaschutz darf die Wirtschaft nicht überfordern, außer er findet nicht statt.',
  'Die Emissionen sinken perspektivisch, sobald die Perspektive groß genug ist.',
  'Wir setzen auf Technologieoffenheit: offen für Gas, offen für Ausreden, offen für 2045.',
  'Das ist kein Rückschritt, das ist eine rückwärtsgewandte Vorwärtsstrategie.',
  'Wir prüfen ambitioniert, ob andere handeln könnten.',
  'Die Bundesregierung bleibt auf Kurs. Der Kurs wurde nur nicht veröffentlicht.'
];
qs('#generateExcuse').addEventListener('click', () => {
  const line = document.createElement('p');
  line.textContent = '> ' + excuses[Math.floor(Math.random() * excuses.length)];
  qs('#terminalBody').appendChild(line);
  line.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

const calcInputs = ['#carRange', '#flightRange', '#policyRange'].map(qs);
function updateCalc() {
  const score = calcInputs.reduce((sum, input) => sum + Number(input.value), 0) / 3;
  const recommendation = qs('#recommendation');
  const copy = qs('#calcCopy');
  if (score < 35) {
    recommendation.textContent = 'Basis-Ausgleich';
    copy.textContent = 'Ein kleines Zertifikat reicht, um die innere Pressemitteilung zu beruhigen.';
  } else if (score < 70) {
    recommendation.textContent = 'Reiche Reserve';
    copy.textContent = 'Mit 1,5-fachem Hebel sieht das schon fast nach Plan aus.';
  } else {
    recommendation.textContent = 'Lobby Platinum';
    copy.textContent = 'Wir empfehlen zusätzlich eine Taskforce und drei sehr ernste Panels.';
  }
}
calcInputs.forEach(input => input.addEventListener('input', updateCalc));
updateCalc();

qs('#panicButton').addEventListener('click', () => {
  document.body.animate([
    { filter: 'contrast(1)' },
    { filter: 'contrast(1.4) saturate(.6)' },
    { filter: 'contrast(1)' }
  ], { duration: 420, iterations: 1 });
  toast('Krisenmodus aktiv: Alle Probleme werden in Zertifikate umgewandelt.');
});

qs('#printCert').addEventListener('click', () => {
  const clone = qs('#certificateTemplate').content.cloneNode(true);
  const wrapper = document.createElement('div');
  wrapper.className = 'print-only';
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);
  window.print();
  setTimeout(() => wrapper.remove(), 500);
});

const prices = ['symbolisch', 'moralisch günstig', 'politisch volatil', 'nur heute seriös', 'nach Gefühl'];
setInterval(() => { qs('#livePrice').textContent = prices[Math.floor(Math.random() * prices.length)]; }, 1600);

document.addEventListener('mousemove', (e) => {
  const dot = qs('.cursor-dot');
  dot.style.left = `${e.clientX}px`;
  dot.style.top = `${e.clientY}px`;
});

renderCart();

function confettiBurst() {
  for (let i = 0; i < 48; i++) {
    const piece = document.createElement('span');
    piece.textContent = ['€', 'CO₂', '✓', 'Gas', '1,5×'][Math.floor(Math.random() * 5)];
    piece.style.position = 'fixed';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.top = '-2rem';
    piece.style.zIndex = 200;
    piece.style.fontWeight = 950;
    piece.style.pointerEvents = 'none';
    document.body.appendChild(piece);
    piece.animate([
      { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
      { transform: `translateY(${80 + Math.random() * 25}vh) rotate(${Math.random() * 720}deg)`, opacity: 0 }
    ], { duration: 1100 + Math.random() * 1400, easing: 'cubic-bezier(.2,.8,.2,1)' }).onfinish = () => piece.remove();
  }
}

const co2Input = document.getElementById("co2Input");
const vanishCo2Btn = document.getElementById("vanishCo2Btn");
const co2Amount = document.getElementById("co2Amount");
const co2Result = document.getElementById("co2Result");
const co2DisplayWrap = document.querySelector(".co2-display-wrap");
const fakeProgressBar = document.getElementById("fakeProgressBar");
const bureaucracyStamp = document.getElementById("bureaucracyStamp");
const vanisherCard = document.querySelector(".vanisher-card");

const compensationMessages = [
  "Erledigt. Das CO₂ wurde erfolgreich in eine PowerPoint-Folie verschoben.",
  "Kompensiert. Die Atmosphäre wurde nicht informiert.",
  "Weg. Der Markt hat geregelt, was die Physik unnötig kompliziert gemacht hat.",
  "Neutralisiert. Dank 1,5-fachem Hebel sogar moralisch überkompensiert.",
  "Gelöst. Die Emissionen befinden sich jetzt außerhalb des Zuständigkeitsbereichs.",
  "Ausgeglichen. Bitte ab jetzt nur noch von Restverantwortung sprechen.",
  "Verschwunden. Ein sehr seriöses Zertifikat hat kurz genickt.",
  "Kompensiert. Rabattcode KATHERINA wurde automatisch angewendet: Zukunft später zahlen."
];

function formatKg(value) {
  return `${value.toLocaleString("de-DE", {
    maximumFractionDigits: 1
  })} kg CO₂`;
}

function vanishCO2() {
  const rawValue = Number(co2Input.value);
  const value = Number.isFinite(rawValue) && rawValue > 0 ? rawValue : 0;

  co2DisplayWrap.classList.remove("vanishing");
  bureaucracyStamp.classList.remove("show");
  vanisherCard.classList.remove("shake");
  fakeProgressBar.style.width = "0%";

  co2Amount.style.opacity = "1";
  co2Amount.style.transform = "scale(1)";
  co2Amount.style.filter = "none";
  co2Amount.textContent = formatKg(value);

  if (value <= 0) {
    co2Result.textContent = "Keine Emissionen? Verdächtig. Wir verkaufen dir trotzdem ein Zertifikat.";
  } else if (value < 10) {
    co2Result.textContent = "Kleinemission erkannt. Wird bürokratisch aufgeblasen und dann gelöst.";
  } else if (value < 100) {
    co2Result.textContent = "Mittlere Gewissensbelastung erkannt. Starte Sofort-Kompensation™.";
  } else {
    co2Result.textContent = "Großemission erkannt. Aktiviere Sondervermögen Gutes Gewissen.";
  }

  requestAnimationFrame(() => {
    fakeProgressBar.style.width = "115%";
    co2DisplayWrap.classList.add("vanishing");
    vanisherCard.classList.add("shake");
  });

  setTimeout(() => {
    co2Amount.textContent = "0 kg CO₂";
    co2Amount.style.opacity = "1";
    co2Amount.style.transform = "scale(1)";
    co2Amount.style.filter = "none";

    const randomMessage = compensationMessages[
      Math.floor(Math.random() * compensationMessages.length)
    ];

    co2Result.textContent = randomMessage;
    bureaucracyStamp.classList.add("show");
  }, 1150);
}

vanishCo2Btn?.addEventListener("click", vanishCO2);

co2Input?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") vanishCO2();
});

const solveEmissionsBtn = document.getElementById("solveEmissionsBtn");
const magicChartCard = document.querySelector(".magic-chart-card");
const chartCommentary = document.getElementById("chartCommentary");

const chartMessages = [
  "Update: Emissionen sinken jetzt, weil die Linie sinkt.",
  "Problem gelöst: Die Achsen wurden so lange nicht beschriftet, bis es gut aussah.",
  "Klimaziel erreicht: zumindest im Präsentationsmodus.",
  "Die Kurve wurde erfolgreich von der Realität entkoppelt.",
  "Ministerieller Hinweis: Was unten ist, kann nicht mehr emittieren.",
  "BREAKING: Durch beherztes Diagramm-Management wurden 97% der Sorgen eingespart.",
  "Seriöse Analyse: Ab jetzt geht alles nach unten, außer die Stromrechnung.",
  "Sondervermögen aktiviert: Die Zukunft wurde auf nach der Legislaturperiode verschoben."
];

solveEmissionsBtn?.addEventListener("click", () => {
  magicChartCard.classList.remove("solved");

  requestAnimationFrame(() => {
    magicChartCard.classList.add("solved");
  });

  chartCommentary.textContent =
    chartMessages[Math.floor(Math.random() * chartMessages.length)];

  solveEmissionsBtn.textContent = "Noch magischer lösen";

  setTimeout(() => {
    solveEmissionsBtn.textContent = "Emissionen erneut wegerklären";
  }, 1400);
});