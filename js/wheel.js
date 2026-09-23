// The project wheel on the home page. With a mouse or trackpad, the section pins
// while you scroll down and the projects slide sideways, so the scroll wheel moves
// through them. On touch screens, with reduced motion, or in a window too short to
// pin it, it's a strip you swipe or scroll sideways. Either way the project nearest
// the centre is highlighted and the line underneath shows how far along you are.
// Without JS it's a plain sideways-scrolling list.
(function () {
  var canPin = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");

  document.querySelectorAll(".wheel-section").forEach(function (section) {
    var stage = section.querySelector(".wheel-stage");
    var inner = section.querySelector(".wheel-inner");
    var wheel = section.querySelector(".wheel");
    var track = section.querySelector(".wheel-track");
    var fill = section.querySelector(".wheel-progress span");
    var items = Array.prototype.slice.call(track.children);
    var pinned = false;
    var distance = 0;
    var active = -1;

    // How far the strip has to move for this item to sit in the centre.
    function offsetFor(item) {
      return item.offsetLeft + item.offsetWidth / 2 - wheel.clientWidth / 2;
    }

    function update() {
      var position, progress;
      if (pinned) {
        progress = distance ? Math.min(1, Math.max(0, -section.getBoundingClientRect().top / distance)) : 0;
        position = progress * distance;
        track.style.transform = "translate3d(" + -position + "px, 0, 0)";
        if (wheel.scrollLeft) wheel.scrollLeft = 0;
      } else {
        var max = wheel.scrollWidth - wheel.clientWidth;
        position = wheel.scrollLeft;
        progress = max > 0 ? position / max : 0;
      }
      if (fill) fill.style.transform = "scaleX(" + progress + ")";

      var best = 0;
      var bestGap = Infinity;
      items.forEach(function (item, i) {
        var gap = Math.abs(offsetFor(item) - position);
        if (gap < bestGap) { bestGap = gap; best = i; }
      });
      if (best !== active) {
        active = best;
        items.forEach(function (item, i) { item.classList.toggle("is-active", i === best); });
      }
    }

    function layout() {
      distance = Math.max(0, track.offsetWidth - wheel.clientWidth);
      var pin = canPin.matches && distance > 0 && inner.offsetHeight <= window.innerHeight;
      if (pin !== pinned) {
        pinned = pin;
        wheel.scrollLeft = 0;
        section.classList.toggle("is-pinned", pin);
        if (!pin) {
          section.style.height = "";
          track.style.transform = "";
        }
      }
      // The pinned stage is one screen tall; the extra height is the sideways distance.
      if (pinned) section.style.height = stage.offsetHeight + distance + "px";
      update();
    }

    var queued = false;
    function queue() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () {
        queued = false;
        update();
      });
    }

    window.addEventListener("scroll", function () { if (pinned) queue(); }, { passive: true });
    wheel.addEventListener("scroll", function () { if (!pinned) queue(); }, { passive: true });
    window.addEventListener("resize", layout);
    window.addEventListener("load", layout);
    if (canPin.addEventListener) canPin.addEventListener("change", layout);

    // Tabbing onto a project scrolls the page to where that project is centred.
    items.forEach(function (item) {
      item.addEventListener("focusin", function () {
        if (!pinned) return;
        var target = Math.min(distance, Math.max(0, offsetFor(item)));
        setTimeout(function () {
          window.scrollTo(0, section.getBoundingClientRect().top + window.scrollY + target);
        }, 0);
      });
    });

    wheel.classList.add("ready");
    layout();
  });
})();
