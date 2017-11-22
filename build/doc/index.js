import fs from "fs-extra";
import path from "path";
import pug from "pug";
import $ from "cheerio";
import frontMatter from "front-matter";
import markDown from "markdown-it";
import attrs from "markdown-it-attrs";
import htmlencode from "htmlencode";

import config from "../config.json";

const componentsOutputPath = config.components.outputPath;
const componentsPath = config.components.srcPath;
const themesOutputPath = config.themes.outputPath;
const templatePath = config.templates.srcPath;
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
  const hasDoc = fs.existsSync(specs.doc);
  return hasImpl && hasDoc;
};

const processComponent = file => {
  const specs = getComponentSpecs(file);
  return {
    name: file,
    impl: fs.readFileSync(specs.impl).toString(),
    doc: fs.readFileSync(specs.doc).toString()
  };
};

const getComponentSpecs = name => {
  return {
    impl: `${componentsPath}/${name}/${name}.html`,
    doc: `${componentsPath}/${name}/${name}.md`
  };
};

const parseComponent = component => {
  const parsedMetadata = frontMatter(component.doc);
  const parsedMarkdown = markDown("commonmark")
    .use(attrs)
    .render(parsedMetadata.body);

  const content = getContent(parsedMarkdown, component.impl);
  const contentsList = getContentsList(content);

  return Object.assign({}, parsedMetadata.attributes, {
    name: component.name,
    content,
    contentsList
  });
};

const getContent = (doc, impl) => {
  const base = fs.readFileSync(`${componentsPath}/base.html`).toString();
  const content = $.load(doc);

  $("[id^=impl]", impl).each((i, elem) => {
    const loadedBase = $.load(base);
    const implElems = $.load(elem.children).html();

    loadedBase(".content-placeholder").each((i, elem) => {
      const dom = i > 0 ? htmlencode.htmlEncode(implElems) : implElems;
      $(elem).replaceWith(dom);
    });

    content("h1").each((i, elem) => {
      const heading = $(elem);
      const anchor = heading
        .text()
        .toLowerCase()
        .replace(/\s+/g, "-");

      heading.replaceWith(`<h1><a name=${anchor}>${heading.text()}</a></h1>`);
    });

    content("#" + elem.attribs.id).replaceWith(loadedBase.html());
  });

  return content.html();
};

const getContentsList = content => {
  const loadedContent = $.load(content);
  let list = [];

  loadedContent("h1").each((i, elem) => {
    var label = $(elem)
      .text()
      .toLowerCase();
    var link = label.replace(/\s+/g, "-");

    list.push({
      label: label,
      link: `#${link}`
    });
  });

  return list;
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
