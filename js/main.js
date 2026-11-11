// main.js - opens and closes the menu on small screens

var menuButton = document.getElementById("menu-button");
var menuList = document.getElementById("menu-list");

// When the button is clicked, add or remove the "open" class
menuButton.addEventListener("click", function () {
  var isOpen = menuList.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", isOpen);
});
