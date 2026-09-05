/* bottle-emitter.js — play a bottle's QR droplet loop from its sprite sheet.
 *
 * The source is a single PNG holding every frame at ONE PIXEL PER MODULE, and
 * the element says so out loud: data-sprite is the file, data-frames/-cols/-cell
 * are its geometry. Read the markup and you know exactly what is on screen; you
 * do not have to fetch a manifest or read this file to find out.
 *
 * No time is baked into the sheet. data-fps decides the rate here, which is why
 * the same source can drive a 4fps bake and a 30fps page without re-rendering.
 *
 * Scaling is nearest-neighbour, always: imageSmoothingEnabled = false. A QR that
 * has been smoothly resampled is a QR that stops reading — soft edges plus small
 * modules is exactly the pair that defeats a decoder.
 *
 * Motion ladder (docs: the loops must not be a seizure risk):
 *   full      flashing loop at data-fps
 *   reduced   a slow crawl rather than a halt — prefers-reduced-motion
 *   none      one static frame, still scannable by sweeping a phone across it
 */
(function () {
  "use strict";

  // A code is dead below ~3.2 device pixels per module (measured against
  // anecdote.channel's own decoder). 69 modules across => 221px. Never render
  // one smaller than that and call it scannable.
  var MIN_PX_PER_MODULE = 3.2;

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");

  function Emitter(el) {
    this.el = el;
    this.src = el.getAttribute("data-sprite");
    this.frames = +el.getAttribute("data-frames");
    this.cols = +el.getAttribute("data-cols");
    this.cell = +el.getAttribute("data-cell");
    this.fps = +el.getAttribute("data-fps") || 15;
    if (!this.src || !this.frames || !this.cols || !this.cell) return;

    this.canvas = el.querySelector("canvas.slot-emitter");
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d", { alpha: false });
    this.i = 0;
    this.img = new Image();
    this.img.decoding = "async";
    this.img.addEventListener("load", this.start.bind(this));
    this.img.addEventListener("error", this.fail.bind(this));
    this.img.src = this.src;
  }

  Emitter.prototype.fail = function () {
    var s = this.el.querySelector(".slot-state");
    if (s) s.textContent = "sprite did not load — " + this.src;
  };

  Emitter.prototype.size = function () {
    // Render at a whole multiple of the cell so every module stays square.
    var want = this.canvas.clientWidth || this.cell * 4;
    var zoom = Math.max(1, Math.round(want / this.cell));
    var px = this.cell * zoom;
    if (this.canvas.width !== px) { this.canvas.width = px; this.canvas.height = px; }
    this.ctx.imageSmoothingEnabled = false;
    var perModule = px / this.cell;
    this.el.classList.toggle("too-small-to-scan", perModule < MIN_PX_PER_MODULE);
  };

  Emitter.prototype.draw = function (n) {
    this.size();
    var c = this.cell, sx = (n % this.cols) * c, sy = Math.floor(n / this.cols) * c;
    this.ctx.drawImage(this.img, sx, sy, c, c, 0, 0, this.canvas.width, this.canvas.height);
  };

  Emitter.prototype.start = function () {
    var self = this;
    this.el.classList.add("live");
    var s = this.el.querySelector(".slot-state");

    if (reduce && reduce.matches) {
      // reduce, do not halt: one frame every couple of seconds still delivers
      if (s) s.textContent = this.frames + " frames · crawling (reduced motion)";
      this.draw(0);
      this.timer = setInterval(function () {
        self.i = (self.i + 1) % self.frames; self.draw(self.i);
      }, 2000);
      return;
    }

    if (s) s.textContent = this.frames + " frames · " + this.fps + "fps · " +
      (this.frames / this.fps).toFixed(1) + "s loop";

    var last = 0, step = 1000 / this.fps;
    (function tick(t) {
      self.raf = requestAnimationFrame(tick);
      if (t - last < step) return;
      last = t;
      self.draw(self.i);
      self.i = (self.i + 1) % self.frames;
    })(0);
  };

  function init() {
    var slots = document.querySelectorAll(".qr-slot[data-sprite]");
    for (var i = 0; i < slots.length; i++) new Emitter(slots[i]);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
