const defaultTheme = "ruby";
const activeTheme = localStorage.getItem("activeTheme") || defaultTheme;
const themeSelector = document.getElementsByClassName("theme-selector")[0];

const init = () => {
  setActiveTheme(activeTheme);
  loadTheme(activeTheme);
};

const setActiveTheme = theme => {
  themeSelector.value = theme;
  localStorage.setItem("activeTheme", theme);
};

const loadTheme = theme => {
  var element = document.createElement("link");
  element.setAttribute("rel", "stylesheet");
  element.setAttribute("type", "text/css");
  element.setAttribute("href", "../../themes/" + theme + ".css");
  document.getElementsByTagName("head")[0].appendChild(element);
};

export const changeTheme = () => {
  const theme = themeSelector.options[themeSelector.selectedIndex].value;
  setActiveTheme(theme);
  location.reload();
};

init();
