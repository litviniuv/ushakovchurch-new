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
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.focus();
      }
    });
  }
})();
