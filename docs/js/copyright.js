// Keeps the footer year current so it never needs an annual edit.
//
// The markup still carries a literal year, and that is what shows with JS
// disabled — so it is a fallback, not dead weight. This only overwrites it.
const COPYRIGHT = (() => {
  const SELECTOR = '.copyright-year';

  function stamp(year=new Date().getFullYear()) {
    const spans = document.querySelectorAll(SELECTOR);
    for (const span of spans) {
      span.textContent = `${year}`;
    }
    return spans.length;
  }

  return { SELECTOR, stamp };
})();

document.addEventListener('DOMContentLoaded', () => COPYRIGHT.stamp());
