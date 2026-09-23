(function () {
  var root = document.documentElement;
  var key = "ushakov-a11y";
  var toggle = document.getElementById("a11y-toggle");
  var menuBtn = document.getElementById("menu-toggle");
  var nav = document.getElementById("site-nav");

  function applyA11y(on) {
    root.classList.toggle("a11y", on);
    if (!toggle) return;
    toggle.setAttribute("aria-pressed", on ? "true" : "false");
    toggle.textContent = on ? "Обычная версия" : "Версия для слабовидящих";
  }

  applyA11y(root.classList.contains("a11y"));

  if (toggle) {
    toggle.addEventListener("click", function () {
      var on = !root.classList.contains("a11y");
      applyA11y(on);
      try {
        localStorage.setItem(key, on ? "1" : "0");
      } catch (err) {}
    });
  }

  if (menuBtn && nav) {
    var lockedY = 0;
    var lastTouchY = null;
    var desktopNav = window.matchMedia("(min-width: 1024px)");

    function isOpen() {
      return nav.classList.contains("is-open");
    }

    function placePanel() {
      var bar = document.querySelector(".header-bar");
      if (!bar) return;
      var bottom = bar.getBoundingClientRect().bottom;
      nav.style.top = Math.max(0, Math.round(bottom)) + "px";
    }

    function openMenu() {
      if (isOpen()) return;
      lockedY = window.scrollY || window.pageYOffset || 0;
      nav.classList.add("is-open");
      root.classList.add("nav-open");
      document.body.style.top = "-" + lockedY + "px";
      menuBtn.setAttribute("aria-expanded", "true");
      placePanel();
    }

    function closeMenu(focusToggle) {
      if (!isOpen() && !root.classList.contains("nav-open")) return;
      var y = lockedY;
      nav.classList.remove("is-open");
      root.classList.remove("nav-open");
      nav.style.top = "";
      document.body.style.top = "";
      menuBtn.setAttribute("aria-expanded", "false");
      root.style.scrollBehavior = "auto";
      window.scrollTo(0, y);
      root.style.scrollBehavior = "";
      if (focusToggle) menuBtn.focus();
    }

    function navCanScroll() {
      return nav.scrollHeight > nav.clientHeight + 1;
    }

    menuBtn.addEventListener("click", function () {
      if (isOpen()) closeMenu(false);
      else openMenu();
    });

    nav.addEventListener("click", function (event) {
      var link = event.target.closest ? event.target.closest("a") : null;
      if (!link || !nav.contains(link) || desktopNav.matches) return;
      closeMenu(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isOpen()) closeMenu(true);
    });

    document.addEventListener(
      "touchstart",
      function (event) {
        if (event.touches && event.touches[0]) lastTouchY = event.touches[0].clientY;
      },
      { passive: true }
    );

    document.addEventListener(
      "touchmove",
      function (event) {
        if (!isOpen()) return;
        var touch = event.touches && event.touches[0];
        var dy = touch && lastTouchY != null ? lastTouchY - touch.clientY : 0;
        if (touch) lastTouchY = touch.clientY;
        if (nav.contains(event.target) && navCanScroll()) {
          var max = nav.scrollHeight - nav.clientHeight;
          if (dy > 0 && nav.scrollTop >= max - 1) event.preventDefault();
          else if (dy < 0 && nav.scrollTop <= 0) event.preventDefault();
          return;
        }
        event.preventDefault();
      },
      { passive: false }
    );

    document.addEventListener(
      "wheel",
      function (event) {
        if (!isOpen()) return;
        if (nav.contains(event.target) && navCanScroll()) {
          var max = nav.scrollHeight - nav.clientHeight;
          if (event.deltaY > 0 && nav.scrollTop >= max - 1) event.preventDefault();
          else if (event.deltaY < 0 && nav.scrollTop <= 0) event.preventDefault();
          return;
        }
        event.preventDefault();
      },
      { passive: false }
    );

    window.addEventListener("resize", function () {
      if (!isOpen()) return;
      if (desktopNav.matches) closeMenu(false);
      else placePanel();
    });
  }
})();
