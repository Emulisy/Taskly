export function initNav() {
  const navItems = document.querySelectorAll(".nav__item");
  const mainTabs = document.querySelectorAll(".main__tab");

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      navItems.forEach((i) => i.classList.remove("nav__item--active"));
      item.classList.add("nav__item--active");

      const tab = item.dataset.tab;
      mainTabs.forEach(
        (section) =>
          (section.style.display =
            section.dataset.tab === tab ? "block" : "none")
      );
    });
  });
}
