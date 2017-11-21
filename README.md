# UX Kitchen Sink documentation

## Authors

[Francisco Guilherme](https://github.com/francisco-guilherme) and [Hugo Figueira](https://github.com/hfigueira)


## Summary

This project was created as POC for a UI Kitchen Sink documentation website, showcasing elements that are part of the visual library used by the Hitachi Vantara UX group. It started as a simple and static website but it has evolved over time into a more dynamic and easy-to-use project.


## Why should I use this tool?

* It has a dynamic workflow with a single source of truth - the base theme.
* All the main specifications are defined on the base theme and organised on separated domain files (variables, generic and components).
* All the other themes inherit from the base theme. This gives great flexibility, since it inherits all the main specifications, can override the ones needed and create others.
* There is a separation between theme specifications and visual components documentation. Each visual component have their own files (implementation and documentation).
* The build workflow dynamically creates the documentation site based on the existent themes, components and page templates. 
* It will also create a distribution version of the multiple themes that the developer can import on their projects (framework).


***


## Installation

Clone the project from GitHub into a local folder. Then go to the folder and run the following command:

	npm install

After the installation of the dependencies, run the following command:

	npm run dev

This will run locally and makes usage of watchers that will look into the changes you are making. As soon as you do some changes to your code and save, the browser will be automatically updated.

**Note:** Since the project has no index, you should open an existing file, in order to see it run, like:

	localhost:3002/doc/components/buttons.html


***


## First steps

One thing to consider is the fact that we are using a build system, so there are some folders we need to know and understand at the beginning:

- The `src` folder - this is the source of our project and where we are going to create our *components*, *theme* and *documentation*;

- Inside `src` folder, we have two other folders, `doc` and `themes`:
  - The `doc` folder is where we will add the documentation to each of the components;
  - The `themes` folder is where we are going to add our themes - and add the styling that will overwrite the default styles to the components;
			
	Inside this last one, we have two main `.scss` files:
  	- `_variables.scss` - this is where we will add our main color palette and our functional variables using that same palette;
  	- `_generic.scss` - this is where we will add the generic variables, that will be overwritten by our themes.

- Inside the `doc` folder we are going to see two other folders, `_components` and `static`:
	- The `_components` folder is where all of our components will be, divided by folders for each component;
	- The `static` folder is where our documentation site layout lives - the structure of the page - in this case, it’s the same page for all components.

- The `dist` folder is our output, or the final product, lets say. We don’t need to change anything here, since it’s dynamic and automatically built.
This last one is the folder that we are going to use to make it “live” if we want to publish it to a server and where all the compiled CSS files are (base stylesheet, themes and documentation).

**Note:** Since we are using watchers to the build, every time we save a file, the project will be reloaded on the browser with the last changes.


***


## How to add a new component?

Lets say, for instance, that you want to add a new **buttons** component to the project:

- Go to `_components` folder and create a new folder named “buttons”;
- Then, create a `buttons.html` file inside that same folder - this file will be the structure of the component you will create;
- Finally, create a `buttons.md` file that same folder - this will be the file that feeds the documentation page on the website, using **Markdown**. I will cover that on another chapter.

(To be easier, you can also copy one other component folder and rename the folders and files in it).

**Note:** Don’t forget to wrap your components inside `{#impl-name-of-component}` to then call this inside your Markdown file. This will be used to show your components structure in the documentation pages.

These steps will add a new component to the components list (left menu) on the documentation page, but the styling is still missing.

Let’s learn how to add the styling to the new component on the next chapter.


***


## How to style a component?

Now that we have the new component added to the components list we need to add the styling to this new component. 

Go to the `themes` folder. Inside you will see two folders, one for the `_base` and the other for `themes`. Since we still don’t have the new component in our default styling guide, we need to add the new component to the `_base` folder first (and keep the theming for later), doing this:

- Add a new file named `buttons.scss` to the `_base` folder - this file will include the styling for the button components - you can (should) use **sass** pre-processing for this;
- Import this new stylesheet in the `_.scss` file by adding `@import "buttons.scss";` to the file.
	
This will include the component styling when building the project, mixing all the stylesheets into a single CSS file.


With this two last steps, you will be able to start styling your new component. 

Since we are using **sass** to style the components, we can take into account that some values might change, depending on the theme we are using.

For that, we need to take into account two more things:

- The `_generic.scss` file is where all my variables for all my components will live and might change depending on the theme - might be overwritten using the theme stylesheet files;
- The `_variables.scss` file is where I will add my color palette variables and functional variables - variables that will be used as values on the `_generic.scss` file.

**Note:** As an example and to be easier to understand, I added some components, themes and documentation to the project.

For instance, I know that my primary-buttons might change its background color depending on the theme I’m using. Then, I just need to be sure that I will add a variable to be changed with that new theme. 

So, I will do something like this on my `buttons.scss` file:
```sass
.primary-buttons {
  background-color: $primary-buttons-background-color;
}
```

Then, I just need to add the value to the `_generic.scss` file in my `_base` folder, like:

```sass
$primary-buttons-background-color: $primary-color !default;
```

Note that I added a `!default;` flag after the value. This indicates that this is my default value and that can be changed by the theme styling - think of this as the inverse of what `!important` does in CSS. Just remember to add this flag to all variable values inside `_generic.scss` file.

Last but not least, I will need to be sure that the `$primary-color` exists in the `_variables.scss` file (something I need to specify when creating the default theme):
```sass
// Default color palette
$red: #cc0000 !default;
(…)	

// Functional variables
$primary-color: $red !default;
(…)
```

With this I’m making sure my project is built in a way that it’s easy to maintain and to change some default variables in a single spot that will then be updated in the whole project.


***


## How to document a component?

Now let’s learn how to write the documentation for the new component.

Since we take advantage of [Markdown](https://github.com/adam-p/markdown-here), it’s quite easy to understand and write the documentation of each component - learn how [here](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet).

To add the descriptions to the new component, go back to your `buttons.md` file you created on the first chapter. Then add the following:

```markdown
---
title: Buttons
description: Buttons specs
---

# Primary button
---
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 

{#impl-primary-buttons}
```


You are free to change it as you wish, with the many details you want. 

Remember, if you want to show the structure of the component in your documentation page, don’t forget to add the last line of code that’s being shown there - that’s being included in the `buttons.html` as well, wrapping the component with <div id=“impl-primary-buttons”>


***


## How to add and style a new theme?

Finally, this is how we add a new theme to the project.

As you saw, inside the `src` folder we had a folder called `themes`. Imagine that you want to create a new theme, this one using a different color palette than the base theme (or maybe some fonts or spacing, everything is possible to be changed thanks to **sass** variables).

Let’s call this new theme *"sapphire"*. 

- Go to `themes` folder and add a new folder named **sapphire**;
- Inside this folder, add two new files:
  - `custom.scss` - where we will include the variables and values that will overwrite the default ones in the `_base` folder;
  - `_.scss` - this is where we will include our base (default) `_.scss` file and import our `custom.scss` file to overwrite the default variables, like:
	
	@import "custom.scss";
	@import "../_base/_.scss";

The `custom.scss` is where we will add our variables and its new values.

For instance, I want to change the default `background-color` for all my primary buttons in this new theme. 

Remember how we did it at the beginning, using the primary-color as red in the `_variables.scss` file? 

Now we will change the **primary-color** to **blue**, by simply adding the **blue** as **primary-color** in our `custom.scss` file:

```sass
// Sapphire custom.scss file

// Sapphire color palette
$blue: #005DA6;
(…)	
	
// Functional variables
$primary-color: $blue !default;
(…)
```

Now, every component that uses the `$primary-blue` as variable will show the **blue** as its primary-color.

***

## Technologies used in this project:

This project is built using some awesome technologies like [SASS](http://sass-lang.com) and [Markdown](https://github.com/adam-p/markdown-here).
