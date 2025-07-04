/**
 * Shows the navigation bar when scrolling up, and hides it when scrolling down.
 */

(() => {
  const navBar = document.querySelector("header");
  const mainMenu = document.getElementById("main-menu");

  if (!navBar || !mainMenu) return;

  const navBarHeight = navBar.offsetHeight + 8; // offset to hide shadow more
  let prevPos = window.scrollY;

  window.addEventListener("scroll", () => {
    if (mainMenu.classList.contains("is-active")) {
      // Don't hide if the main menu is open on mobile
      navBar.style.top = "0";
    } else if (
      document.body.scrollTop > navBarHeight ||
      document.documentElement.scrollTop > navBarHeight
    ) {
      let currentPos = window.scrollY;
      navBar.style.top = prevPos > currentPos ? "0" : `-${navBarHeight}px`;
      prevPos = currentPos;
    }
  });
})();
