/* =========================================================
   1. HAMBURGER MENU
   Toggles a class that CSS uses to show/hide the nav,
   and keeps aria-expanded in sync for screen readers.
   ========================================================= */
const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primaryNav');

navToggle.addEventListener('click', () => {
  const isOpen = primaryNav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// If someone taps a link inside the mobile menu, close the menu after.
primaryNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    primaryNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});


/* =========================================================
   2. LIVE "kWh GENERATED TODAY" COUNTER
   Purely cosmetic: counts up to a target number once the
   page loads, just to make the hero feel alive.
   ========================================================= */
const liveKwhEl = document.getElementById('liveKwh');
const targetKwh = 48210; // pretend running total across all customer systems

function animateCounter(el, target, duration) {
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(progress * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
animateCounter(liveKwhEl, targetKwh, 1800);


/* =========================================================
   3. SAVINGS CALCULATOR
   Simple, transparent math so it's easy to follow:
   - assume solar covers about 85% of the current bill
   - estimate panel count from bill size
   - project 25 years with a small yearly utility-rate rise
   ========================================================= */
const billRange = document.getElementById('billRange');
const billValueEl = document.getElementById('billValue');
const panelsNeededEl = document.getElementById('panelsNeeded');
const monthlySavingsEl = document.getElementById('monthlySavings');
const yearSavingsEl = document.getElementById('yearSavings');
const co2OffsetEl = document.getElementById('co2Offset');

function updateCalculator() {
  const monthlyBill = Number(billRange.value);
  billValueEl.textContent = '$' + monthlyBill;

  // Roughly: every $35/month of bill needs about 1 panel to offset.
  const panels = Math.max(4, Math.round(monthlyBill / 35));

  // Solar typically offsets ~85% of the bill once sized correctly.
  const monthlySavings = Math.round(monthlyBill * 0.85);

  // Simple 25-year projection with a 3% average yearly rate increase,
  // so the savings grow a little each year rather than staying flat.
  let total = 0;
  let yearlyAmount = monthlySavings * 12;
  for (let year = 0; year < 25; year++) {
    total += yearlyAmount;
    yearlyAmount *= 1.03;
  }

  // Rough CO2 offset: about 0.0007 tons of CO2 per kWh avoided,
  // and each panel produces roughly 550 kWh a year.
  const co2Tons = ((panels * 550) * 0.0007).toFixed(1);

  panelsNeededEl.textContent = panels;
  monthlySavingsEl.textContent = '$' + monthlySavings;
  yearSavingsEl.textContent = '$' + Math.round(total).toLocaleString();
  co2OffsetEl.textContent = co2Tons;
}

billRange.addEventListener('input', updateCalculator);
updateCalculator(); // run once on page load so the numbers aren't blank


/* =========================================================
   4. CONTACT FORM
   No backend here — this just shows how you'd stop the page
   from reloading and give the visitor feedback instead.
   Swap this for a real fetch() call to your server or form
   service (e.g. Formspree) when you're ready to go live.
   ========================================================= */
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('name').value.trim();
  formStatus.textContent = `Thanks${name ? ', ' + name : ''} — we'll be in touch within one business day.`;
  contactForm.reset();
});
