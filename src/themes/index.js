import fs from "fs-extra";
import sass from "node-sass";
import config from "../config.json";

const themesPath = config.themes.path;
const themesOutputPath = config.themes.outputPath;

const build = () => {
  getThemes(themesPath).map(processTheme);
};

const getThemes = path => {
  const themes = [];

  fs.readdirSync(path).forEach(file => {
    const subPath = path + "/" + file;
    const themeEntry = subPath + "/_.scss";
    const isTheme = fs.existsSync(themeEntry);

    if (isTheme) {
      themes.push({
        name: file,
        entry: themeEntry
      });
    }
  });

  return themes;
};

const processTheme = theme => {
  const isBaseTheme = theme.name.match(/base/);
  const themeOutputName = theme.name + ".css";
  const themeRendered = sass.renderSync({ file: theme.entry });
  const themeCSS = themeRendered.css.toString();

  if (!isBaseTheme) {
    fs.ensureDirSync(themesOutputPath);
    fs.writeFileSync(themesOutputPath + "/" + themeOutputName, themeCSS);
  }
};

build();
