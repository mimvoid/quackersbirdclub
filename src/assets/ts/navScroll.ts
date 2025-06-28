/**
 * Shows the navigation bar when scrolling up, and hides it when scrolling down.
 */

const navBar = document.querySelector("header");

if (navBar !== null) {
  const navBarHeight = navBar.offsetHeight + 8; // offset to hide shadow more
  let prevPos = window.scrollY;

  window.onscroll = () => {
    if (
      document.body.scrollTop > navBarHeight ||
      document.documentElement.scrollTop > navBarHeight
    ) {
      let currentPos = window.scrollY;
      navBar.style.top = prevPos > currentPos ? "0" : `-${navBarHeight}px`;
      prevPos = currentPos;
    }
  };
}
