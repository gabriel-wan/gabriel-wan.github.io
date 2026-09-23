// Page titles, section headings and intro text slide up out of a mask, word by
// word, the first time they scroll into view. Everything else stays still.
// If this script doesn't run, the CSS failsafe shows everything after 1.5s.
(function () {
  var SELECTOR = "main h1, main h2:not(.item), .lede, .dek";
  var STEP = 24;       // ms between words
  var MAX_DELAY = 650; // cap, so long paragraphs don't take forever
  var DURATION = 750;

  var targets = document.querySelectorAll(SELECTOR);
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("split", "in", "revealed"); });
    return;
  }

  function mask(inner, index) {
    var outer = document.createElement("span");
    outer.className = "rw";
    inner.classList.add("rw-i");
    inner.style.transitionDelay = Math.min(index * STEP, MAX_DELAY) + "ms";
    outer.appendChild(inner);
    return outer;
  }

  // Split text nodes into words. Links inside paragraphs and inline code move as
  // one piece, so underlines and code backgrounds stay intact.
  function split(el) {
    var count = 0;
    var isHeading = /^H[1-6]$/.test(el.tagName);

    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var parts = child.nodeValue.split(/(\s+)/);
          var frag = document.createDocumentFragment();
          parts.forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              frag.appendChild(document.createTextNode(part));
            } else {
              var word = document.createElement("span");
              word.textContent = part;
              frag.appendChild(mask(word, count++));
            }
          });
          child.parentNode.replaceChild(frag, child);
        } else if (child.nodeType === 1) {
          var atomic = child.tagName === "CODE" || (child.tagName === "A" && !isHeading);
          if (atomic) {
            var placeholder = document.createComment("");
            child.parentNode.replaceChild(placeholder, child);
            placeholder.parentNode.replaceChild(mask(child, count++), placeholder);
          } else {
            walk(child);
          }
        }
      });
    })(el);

    el.classList.add("split");
    return Math.min(count * STEP, MAX_DELAY) + DURATION;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      observer.unobserve(el);
      el.classList.add("in");
      setTimeout(function () { el.classList.add("revealed"); }, el._revealTime || 1400);
    });
  });

  targets.forEach(function (el) {
    el._revealTime = split(el);
    observer.observe(el);
  });
})();
