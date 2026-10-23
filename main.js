/* ============================================================
   Quizly — interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Sticky header ---------- */
  var header = document.querySelector(".header");
  function onScroll() {
    if (window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById("burger");
  var mobileMenu = document.getElementById("mobileMenu");
  burger.addEventListener("click", function () {
    var open = mobileMenu.classList.toggle("open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });
  mobileMenu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { mobileMenu.classList.remove("open"); });
  });

  /* ---------- Smooth-scroll for in-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        var y = el.getBoundingClientRect().top + window.scrollY - 64;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    });
  });

  /* ---------- Scroll reveal ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add("in");
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    q.addEventListener("click", function () {
      var open = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(function (other) {
        if (other !== item) {
          other.classList.remove("open");
          other.querySelector(".faq-a").style.maxHeight = null;
        }
      });
      if (open) {
        item.classList.remove("open");
        a.style.maxHeight = null;
      } else {
        item.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* ---------- Instagram carousel arrows ---------- */
  var rail = document.getElementById("igRail");
  if (rail) {
    var prev = document.getElementById("igPrev");
    var next = document.getElementById("igNext");
    var step = function () { return Math.min(rail.clientWidth * 0.85, 320); };
    if (prev) prev.addEventListener("click", function () { rail.scrollBy({ left: -step(), behavior: "smooth" }); });
    if (next) next.addEventListener("click", function () { rail.scrollBy({ left: step(), behavior: "smooth" }); });
  }

  /* ---------- Contact form (demo submit) ---------- */
  var form = document.getElementById("leadForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.querySelector("#name");
      var phone = form.querySelector("#phone");
      var digits = (phone.value || "").replace(/\D/g, "");
      if (!name.value.trim() || !phone.value.trim()) {
        flash("Please fill in the required fields", true);
        return;
      }
      if (digits.length < 7 || digits.length > 15) {
        flash("Enter a valid phone number (e.g. +380 XX XXX XX XX)", true);
        return;
      }
      var card = document.getElementById("formCard");
      card.innerHTML =
        '<div class="form-ok">' +
        '<div class="em float">🦊</div>' +
        '<h3>Thank you! Your request is in.</h3>' +
        "<p>We'll reach out shortly to arrange a convenient time for a call. Get ready to play!</p>" +
        "</div>";
      burstConfetti();
    });
  }

  function flash(msg, isError) {
    var t = document.getElementById("toast");
    t.textContent = msg;
    t.style.background = isError ? "hsl(0 84% 60%)" : "hsl(150 70% 45%)";
    t.classList.add("show");
    clearTimeout(t._t);
    t._t = setTimeout(function () { t.classList.remove("show"); }, 3200);
  }

  /* ---------- tiny confetti burst ---------- */
  function burstConfetti() {
    var colors = ["#FFC61A", "#FF6B1A", "#ED3B7B", "#9B3FD4", "#36B3E6", "#2BC48A"];
    var n = 90;
    var frag = document.createElement("div");
    frag.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden";
    document.body.appendChild(frag);
    for (var i = 0; i < n; i++) {
      (function () {
        var p = document.createElement("div");
        var size = 8 + Math.random() * 8;
        var left = Math.random() * 100;
        var dur = 1800 + Math.random() * 1400;
        var rot = Math.random() * 360;
        p.style.cssText =
          "position:absolute;top:-20px;left:" + left + "%;width:" + size + "px;height:" + size * 0.6 +
          "px;background:" + colors[i % colors.length] +
          ";border-radius:2px;transform:rotate(" + rot + "deg);opacity:1;";
        frag.appendChild(p);
        var fall = p.animate(
          [
            { transform: "translateY(0) rotate(" + rot + "deg)", opacity: 1 },
            { transform: "translateY(105vh) rotate(" + (rot + 540) + "deg)", opacity: 0.9 }
          ],
          { duration: dur, easing: "cubic-bezier(.3,.6,.4,1)" }
        );
        fall.onfinish = function () { p.remove(); };
      })();
    }
    setTimeout(function () { frag.remove(); }, 3600);
  }

  /* ---------- current year ---------- */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
