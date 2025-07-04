(() => {
  const hamburgerButton = document.getElementById("hamburger");
  const mainMenu = document.getElementById("main-menu");
  const subMenus = document.getElementsByClassName("sub-menu");

  if (!hamburgerButton || !mainMenu) return;

  // Make sure the main menu appears right below the header
  mainMenu.style.top = `${document.querySelector("header").offsetHeight}px`;

  // Toggle .is-active CSS classes on click
  hamburgerButton.addEventListener("click", () => {
    if (hamburgerButton.classList.contains("is-active")) {
      hamburgerButton.classList.remove("is-active");
      mainMenu.classList.remove("is-active");
    } else {
      hamburgerButton.classList.add("is-active");
      mainMenu.classList.add("is-active"); // Open main menu
    }
  })

  for (let i = 0, len = subMenus.length; i < len; i++) {
    const topMenuItem = subMenus.item(i).parentElement;
    topMenuItem.addEventListener("click", () => {
      if (topMenuItem.classList.contains("is-open")) {
        topMenuItem.classList.remove("is-open");
      } else {
        topMenuItem.classList.add("is-open");
      }
    })
  }
})()
