var app = (function() {
  var defaultTheme = "ruby";
  var activeTheme = localStorage.getItem("activeTheme") || defaultTheme;
  var themeSelector = document.getElementsByClassName("theme-selector")[0];

  setActiveTheme(activeTheme);
  loadTheme(activeTheme);

  function changeTheme() {
    var theme = themeSelector.options[themeSelector.selectedIndex].value;
    setActiveTheme(theme);
    location.reload();
  }

  function setActiveTheme(theme) {
    themeSelector.value = theme;
    localStorage.setItem("activeTheme", theme);
  }

  function loadTheme(theme) {
    var element = document.createElement("link");
    element.setAttribute("rel", "stylesheet");
    element.setAttribute("type", "text/css");
    element.setAttribute("href", "styles/" + theme + ".css");
    document.getElementsByTagName("head")[0].appendChild(element);
  }

  return {
    changeTheme: changeTheme
  };
})();
