import fs from "fs-extra";
import path from "path";
import pug from "pug";
import frontMatter from "front-matter";
import markDown from "markdown-it";
import config from "../config.json";

const componentsOutputPath = config.components.outputPath;
const componentsPath = config.components.path;
const themesOutputPath = config.themes.outputPath;
const templatePath = config.templates.path;
const templateRenderer = pug.compileFile(`${templatePath}/component.pug`);

const build = () => {
  const components = getFiles(componentsPath)
    .filter(validateSpecs)
    .map(processComponent)
    .map(parseComponent);

  const componentsList = components.map(processComponentList);
  const themesList = getFiles(themesOutputPath).map(processThemeList);

  renderComponents(components, componentsList, themesList).map(writeComponent);
};

const getFiles = path => {
  return fs.readdirSync(path);
};

const validateSpecs = file => {
  const specs = getComponentSpecs(file);
  const hasImpl = fs.existsSync(specs.impl);
  const hasDef = fs.existsSync(specs.def);
  return hasImpl && hasDef;
};

const processComponent = file => {
  const specs = getComponentSpecs(file);
  return {
    name: file,
    impl: fs.readFileSync(specs.impl).toString(),
    def: fs.readFileSync(specs.def).toString()
  };
};

const getComponentSpecs = name => {
  return {
    impl: `${componentsPath}/${name}/${name}.html`,
    def: `${componentsPath}/${name}/${name}.md`
  };
};

const parseComponent = component => {
  const parsedMetadata = frontMatter(component.def);
  const parsedMarkdown = markDown("commonmark").render(parsedMetadata.body);

  return Object.assign({}, parsedMetadata.attributes, {
    name: component.name,
    impl: component.impl,
    content: parsedMarkdown
  });
};

const processComponentList = component => {
  return {
    label: component.name,
    link: `${component.name}.html`
  };
};

const processThemeList = theme => {
  return {
    label: theme.split(".").shift()
  };
};

const renderComponents = (components, componentsList, themesList) => {
  return components.map(component => {
    const toRender = Object.assign({}, component, {
      componentsList: componentsList,
      themesList: themesList
    });
    return {
      name: component.name,
      content: templateRenderer(toRender)
    };
  });
};

const writeComponent = component => {
  fs.ensureDirSync(componentsOutputPath);
  fs.writeFileSync(
    componentsOutputPath + "/" + component.name + ".html",
    component.content
  );
};

build();
