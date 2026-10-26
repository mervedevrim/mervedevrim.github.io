/* Merve Devrim — portfolio behaviour
   1. Visual / Code view: the code is generated from this page's own HTML.
   2. Live measurements: frame sizes and ruler numbers.
   3. Layers panel + Selection panel follow the section you clicked or scrolled to.
   4. Copy e-mail button.
   5. Mobile menu (the Layers panel opens as a drawer). */
(function () {
  "use strict";

  var lang = (document.documentElement.lang || "en").slice(0, 2);
  var T = {
    en: { source: "HTML source of the {name} section", frames: "frames", copy: "Copy", copied: "Copied", openMenu: "Open menu", closeMenu: "Close menu" },
    tr: { source: "{name} bölümünün HTML kaynağı", frames: "çerçeve", copy: "Kopyala", copied: "Kopyalandı", openMenu: "Menüyü aç", closeMenu: "Menüyü kapat" }
  }[lang === "tr" ? "tr" : "en"];

  var frames = [].slice.call(document.querySelectorAll(".frame"));
  if (!frames.length) return;

  /* ---------- 1. Code view ---------- */
  var VOID = { br: 1, img: 1, meta: 1, link: 1, input: 1, hr: 1 };
  function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function clean(t) { return t.replace(/\s+/g, " ").trim(); }
  function skip(n) { return n.nodeType === 1 && n.classList.contains("handles"); }
  function render(node, depth, out) {
    var pad = new Array(depth + 1).join("  ");
    if (node.nodeType === 3) { var t = clean(node.textContent); if (t) out.push(pad + '<span class="t-text">' + esc(t) + "</span>"); return; }
    if (node.nodeType !== 1 || skip(node)) return;
    var tag = node.tagName.toLowerCase(), attrs = "";
    for (var i = 0; i < node.attributes.length; i++) {
      var a = node.attributes[i];
      attrs += ' <span class="t-attr">' + a.name + '</span><span class="t-p">="</span><span class="t-val">' + esc(a.value) + '</span><span class="t-p">"</span>';
    }
    var open = '<span class="t-p">&lt;</span><span class="t-tag">' + tag + "</span>" + attrs + '<span class="t-p">&gt;</span>';
    var close = '<span class="t-p">&lt;/</span><span class="t-tag">' + tag + '</span><span class="t-p">&gt;</span>';
    if (VOID[tag]) { out.push(pad + open); return; }
    var kids = [].filter.call(node.childNodes, function (n) { return n.nodeType === 1 ? !skip(n) : (n.nodeType === 3 && clean(n.textContent)); });
    if (!kids.length) { out.push(pad + open + close); return; }
    if (kids.length === 1 && kids[0].nodeType === 3) { out.push(pad + open + '<span class="t-text">' + esc(clean(kids[0].textContent)) + "</span>" + close); return; }
    out.push(pad + open);
    kids.forEach(function (k) { render(k, depth + 1, out); });
    out.push(pad + close);
  }
  function addHandles(el) {
    var h = document.createElement("span");
    h.className = "handles"; h.setAttribute("aria-hidden", "true");
    h.innerHTML = "<i></i><i></i><i></i><i></i>";
    el.appendChild(h);
  }
  function setView(frame, v) {
    frame.dataset.view = v;
    frame.querySelector(".flip").setAttribute("aria-pressed", v === "code" ? "true" : "false");
  }
  frames.forEach(function (frame) {
    var visual = frame.querySelector(".visual"), board = frame.querySelector(".board");
    var lines = [];
    [].forEach.call(visual.childNodes, function (n) { render(n, 0, lines); });
    var pre = document.createElement("pre");
    pre.className = "code";
    pre.tabIndex = 0;
    pre.setAttribute("aria-label", T.source.replace("{name}", frame.getAttribute("aria-label")));
    pre.innerHTML = "<code>" + lines.map(function (l) { return '<span class="line">' + l + "</span>"; }).join("") + "</code>";
    board.appendChild(pre);
    addHandles(board);
    setView(frame, "visual");
    frame.querySelector(".flip").addEventListener("click", function () {
      setView(frame, frame.dataset.view === "visual" ? "code" : "visual");
      measure();
    });
  });

  var btnVisual = document.getElementById("mode-visual"), btnCode = document.getElementById("mode-code");
  function setAll(v) {
    frames.forEach(function (f) { setView(f, v); });
    btnVisual.setAttribute("aria-pressed", v === "visual" ? "true" : "false");
    btnCode.setAttribute("aria-pressed", v === "code" ? "true" : "false");
    measure();
  }
  btnVisual.addEventListener("click", function () { setAll("visual"); });
  btnCode.addEventListener("click", function () { setAll("code"); });

  /* ---------- 2. Measurements ---------- */
  var ruler = document.querySelector(".ruler");
  var selName = document.getElementById("sel-name"), selDims = document.getElementById("sel-dims");
  function dims(frame) { var r = frame.querySelector(".board").getBoundingClientRect(); return Math.round(r.width) + " × " + Math.round(r.height); }
  var shown = null;            // frame shown in the Selection panel
  function showSelection(f) {
    shown = f;
    if (selName) selName.textContent = f.querySelector(".name").textContent;
    if (selDims) selDims.textContent = dims(f) + " px";
  }
  function measure() {
    frames.forEach(function (f) { f.querySelector(".dims").textContent = dims(f); });
    if (ruler) {
      var w = ruler.getBoundingClientRect().width, html = "";
      for (var x = 100; x < w - 40; x += 100) html += '<span style="left:' + (x + 3) + 'px">' + x + "</span>";
      ruler.innerHTML = html;
    }
    if (shown) showSelection(shown);
  }

  /* ---------- 3. Layers + Selection follow the active section ---------- */
  var links = [].slice.call(document.querySelectorAll(".layer-list a"));
  var active = null, hovered = null, lockUntil = 0;
  function setActive(frame) {
    if (!frame) return;
    active = frame;
    links.forEach(function (a) {
      var on = a.getAttribute("href") === "#" + frame.id;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
    if (!hovered) showSelection(frame);
  }
  function frameFromScroll() {
    var bar = document.querySelector(".toolbar").getBoundingClientRect().bottom;
    var line = bar + 90;                      // a frame becomes active once its top passes this line
    var current = frames[0];
    frames.forEach(function (f) { if (f.getBoundingClientRect().top <= line) current = f; });
    // at the very end of the page the last section counts as active, even if it is short
    var doc = document.documentElement;
    if (window.innerHeight + window.scrollY >= doc.scrollHeight - 4) current = frames[frames.length - 1];
    return current;
  }
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      if (Date.now() < lockUntil) return;     // a layer was just clicked: keep that one
      setActive(frameFromScroll());
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("scrollend", function () { lockUntil = 0; });
  links.forEach(function (a) {
    a.addEventListener("click", function () {
      var target = document.getElementById(a.getAttribute("href").slice(1));
      if (!target) return;
      setMenu(false);
      lockUntil = Date.now() + 1200;           // smooth scroll in progress
      setActive(target);
    });
  });
  frames.forEach(function (f) {
    f.addEventListener("mouseenter", function () { hovered = f; showSelection(f); });
    f.addEventListener("mouseleave", function () { hovered = null; if (active) showSelection(active); });
    f.addEventListener("focusin", function () { showSelection(f); });
  });
  // opened with a #section link: start from that section
  var start = location.hash ? document.getElementById(location.hash.slice(1)) : null;
  setActive(start && start.classList.contains("frame") ? start : frameFromScroll());

  window.addEventListener("resize", measure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  measure();
  var count = document.getElementById("frame-count");
  if (count) count.textContent = frames.length + " " + T.frames;

  /* ---------- 5. Mobile menu ---------- */
  var toggle = document.getElementById("menu-toggle"), drawer = document.getElementById("layers"), scrim = document.getElementById("menu-scrim");
  var small = window.matchMedia("(max-width: 900px)");
  function setMenu(open) {
    if (!toggle || !drawer) return;
    open = !!open && small.matches;
    drawer.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? T.closeMenu : T.openMenu);
    if (scrim) scrim.hidden = !open;
    document.documentElement.classList.toggle("menu-open", open);
    if (open) {
      var current = drawer.querySelector("a.is-active") || drawer.querySelector("a");
      if (current) current.focus({ preventScroll: true });
    }
  }
  if (toggle && drawer) {
    toggle.addEventListener("click", function () { setMenu(toggle.getAttribute("aria-expanded") !== "true"); });
    if (scrim) scrim.addEventListener("click", function () { setMenu(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { setMenu(false); toggle.focus(); }
    });
    var onBreakpoint = function () { if (!small.matches) setMenu(false); };
    if (small.addEventListener) small.addEventListener("change", onBreakpoint); else small.addListener(onBreakpoint);
  }

  /* ---------- 4. Copy e-mail ---------- */
  var copyBtn = document.getElementById("copy-email"), email = document.getElementById("email");
  if (copyBtn && email) {
    copyBtn.textContent = T.copy;
    var selectText = function () {
      var r = document.createRange(); r.selectNodeContents(email);
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
    };
    copyBtn.addEventListener("click", function () {
      var done = function () { copyBtn.textContent = T.copied; setTimeout(function () { copyBtn.textContent = T.copy; }, 2000); };
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(email.textContent).then(done, selectText);
        else selectText();
      } catch (e) { selectText(); }
    });
  }
})();
