const defaultTheme = "ruby";
const activeTheme = localStorage.getItem("activeTheme") || defaultTheme;
const themeSelector = document.getElementsByClassName("theme-selector")[0];

const init = () => {
  const activeComponent = document.location.pathname.split("/").pop();
  const activeContent = document.location.hash;
  setListState(".components-list li", activeComponent);
  setListState(".contents-list li", activeContent);

  setActiveTheme(activeTheme);
  loadTheme(activeTheme);

  window.onbeforeunload = () => {
    window.scrollTo(0, 0);
  };
};

const setActiveTheme = theme => {
  themeSelector.value = theme;
  localStorage.setItem("activeTheme", theme);
};

const loadTheme = theme => {
  const element = document.createElement("link");
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

const setListState = (selector, active) => {
  const list = document.querySelectorAll(selector);

  list.forEach(elem => {
    const link = elem.getElementsByTagName("a")[0].getAttribute("href");

    elem.addEventListener("click", e => {
      e.preventDefault();
      updateListState(list, link);
      window.open(link, "_self");
    });
  });

  updateListState(list, active);
};

const updateListState = (list, active) => {
  list.forEach(elem => {
    const link = elem.getElementsByTagName("a")[0].getAttribute("href");

    elem.classList.remove("active");
    if (active === link) {
      elem.classList.add("active");
    }
  });
};

init();
