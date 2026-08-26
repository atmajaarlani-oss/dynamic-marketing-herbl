### Start Platform Tests

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/contribute/01-development/04-author-patch.md

Command to start the platform tests development server.

```bash
npm run dev -w platform-tests
```

--------------------------------

### Run Documentation Website Locally

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/contribute/01-development/04-author-patch.md

Command to start the documentation website development server.

```bash
npm run dev -w website
```

--------------------------------

### Run Development Server

Source: https://github.com/react/react-strict-dom/blob/main/apps/nextjs-app/README.md

Execute this command to start the Next.js development server. Open http://localhost:3000 in your browser to view the application.

```bash
npm run dev
```

--------------------------------

### Install Dependencies for Vite 7

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/learn/environment-setup/03-vite.md

Install necessary packages for Vite 7 setup, including vite-plugin-babel and vite-tsconfig-paths.

```bash
npm install vite-plugin-babel vite-tsconfig-paths
```

--------------------------------

### Install Web Peer Dependencies

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/learn/01-installation.md

For web support, ensure these React and ReactDOM packages are installed as peer dependencies.

```bash
npm install react react-dom
```

--------------------------------

### Install vite-plugin-babel

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/learn/environment-setup/03-vite.md

Install the necessary plugin for Vite 8 to enable Babel transformations.

```bash
npm install vite-plugin-babel
```

--------------------------------

### Install React Strict DOM

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/learn/01-installation.md

Run this command to install the main React Strict DOM package in your React project.

```bash
npm install react-strict-dom
```

--------------------------------

### Complete React Strict DOM Example with Theming

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/static/llms.txt

Demonstrates a complete React Strict DOM component using `css.defineVars` for theming and `css.create` for component styles. Includes responsive styles and pseudo-states.

```jsx
// tokens.css.js
import { css } from 'react-strict-dom';
export const colors = css.defineVars({
  primary: { default: 'blue', '@media (prefers-color-scheme: dark)': 'lightblue' },
  text: { default: 'black', '@media (prefers-color-scheme: dark)': 'white' },
  background: { default: 'white', '@media (prefers-color-scheme: dark)': '#222' }
});

// Component.js
import { html, css } from 'react-strict-dom';
import { colors } from './tokens.css.js';

const styles = css.create({
  container: {
    padding: 16,
    backgroundColor: colors.background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16
  },
  button: {
    padding: 12,
    backgroundColor: {
      default: colors.primary,
      ':hover': 'darkblue',
      ':active': 'navy'
    },
    color: 'white',
    borderRadius: 8,
    borderWidth: 0
  }
});

function Card({ title, onPress, style }) {
  return (
    <html.div style={[styles.container, style]}>
      <html.h1 style={styles.title}>{title}</html.h1>
      <html.button style={styles.button} onClick={onPress}>
        Click me
      </html.button>
    </html.div>
  );
}
```

--------------------------------

### Verify Node.js PATH

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/contribute/01-development/01-install-node.md

Confirm that the installed Node.js executable is accessible in your system's PATH.

```bash
$ which node
/usr/local/bin/node
```

--------------------------------

### Check Node.js Version

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/contribute/01-development/01-install-node.md

Verify your current Node.js installation version. Ensure it meets the `>=20.11` requirement.

```bash
$ node --version
v20.17.0
```

--------------------------------

### Check npm Version

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/contribute/01-development/01-install-node.md

Verify your current npm installation version. Ensure it meets the `>=10` requirement.

```bash
$ npm --version
10.8.2
```

--------------------------------

### Generate Static CSS with Babel Preset

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/01-babel/01-preset.md

Illustrative example showing how to collect style rules during Babel transformation and then generate a static CSS string using the preset's generateStyles method. This is a web-only feature.

```js
import reactStrictBabelPreset from 'react-strict-dom/babel-preset';

const styleRules = {};

function transform() {
  const { code, metadata } = await babel.transformAsync(sourceCode, babelConfig);
  if (metadata.stylex != null && metadata.stylex.length > 0) {
    // collect styles from files
    styleRules[id] = metadata.stylex;
  }
  // ...
}

function bundle() {
  const rules = Object.values(styleRules).flat();
  // generate CSS string from all collected styles
  const css = reactStrictBabelPreset.generateStyles(rules);
  // ...write css to file
}
```

--------------------------------

### Install Native Peer Dependencies

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/learn/01-installation.md

For native support, ensure these React and React Native packages are installed as peer dependencies.

```bash
npm install react react-native
```

--------------------------------

### HTML Input Element Example

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/static/llms.txt

Renders an HTML input element for text entry. Shows how to manage input values with onChange and set attributes like type, value, placeholder, and maxLength.

```jsx
// Input
<html.input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Text" maxLength={100} />
```

--------------------------------

### HTML Image Element Example

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/static/llms.txt

Renders an HTML image element. Demonstrates setting the src, alt text, width, and height attributes for an image.

```jsx
// Image
<html.img src="/image.jpg" alt="Description" width={300} height={200} />
```

--------------------------------

### HTML Link Element Example

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/static/llms.txt

Renders an HTML anchor (link) element. Shows how to specify the destination URL using the href attribute.

```jsx
// Link
<html.a href="https://example.com">Link</html.a>
```

--------------------------------

### HTML Button Element Example

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/static/llms.txt

Renders a basic HTML button element using React Strict DOM. Demonstrates the use of the html.button tag and common props like disabled and onClick.

```jsx
// Button
<html.button disabled={false} onClick={(e) => {}}>Click</html.button>
```

--------------------------------

### Configure Vite 7 for React Strict DOM

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/learn/environment-setup/03-vite.md

Configure vite.config.ts for Vite 7, including plugins, resolve extensions, and optimizeDeps. This setup uses vite-tsconfig-paths and configures viteReact with Babel.

```typescript
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import viteReact from "@vitejs/plugin-react";
import viteBabel from "vite-plugin-babel";

const webOnlyExtensions = [".web.js", ".web.jsx", ".web.ts", ".web.tsx"];

export default defineConfig(() => ({
  plugins: [
    tsConfigPaths(),
    viteReact({
      // plugin-react@5 applies the preset to your source through Babel.
      babel: { configFile: true },
    }),
    // No include needed: viteReact handles source, and the default
    // include (/".jsx?$/) covers node_modules that ship compiled UI.
    viteBabel(),
  ],
  resolve: {
    extensions: [
      ...webOnlyExtensions,
      ".mjs",
      ".js",
      ".mts",
      ".ts",
      ".jsx",
      ".tsx",
      ".json",
    ],
  },
}));
```

--------------------------------

### Configure Metro Bundler for Expo

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/learn/environment-setup/01-expo.md

This Metro configuration is for Expo projects and ensures support for package exports in React Native. It uses `expo/metro-config` to get default settings.

```javascript
// Learn more https://docs.expo.dev/guides/monorepos
const { getDefaultConfig } = require('expo/metro-config');

// Find the project and workspace directories
const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

module.exports = config;
```

--------------------------------

### Fixing Props for HTML Elements in RSD

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/static/llms.txt

Adjust HTML element props for compatibility with React Strict DOM. For example, change `htmlFor` to `for` and `role="presentation"` to `role="none"`.

```jsx
// Before: <label htmlFor="id"> <div role="presentation">
// After:
<html.label for="id"> <html.div role="none">
```

--------------------------------

### Create and Apply a Theme

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/02-css/02-createTheme.md

Demonstrates how to create theme objects for colors and spacing, combine them, and apply them to a div element.

```jsx
import { css } from 'react-strict-dom';
import { colors, spacing } from './vars.css.js';

const themeColors = css.createTheme(colors, {
  accent: 'red',
  textPrimary: 'black',
  textSecondary: 'brown',
});

const themeSpacing = css.createTheme(spacing, {
  small: '0.25rem',
  large: '0.5rem'
});

const theme = [ themeColors, themeSpacing ];

const Theme = (props) => <html.div {...props} style={theme} />
```

--------------------------------

### Styling with Media Queries

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/static/llms.txt

Demonstrates how to apply responsive styles using media queries within the css.create() object. Supports dimension queries and color scheme preferences.

```jsx
const styles = css.create({
  container: {
    width: {
      default: 320,
      '@media (min-width: 768px)': 600,
      '@media (min-width: 1024px)': 800
    },
    color: {
      default: 'black',
      '@media (prefers-color-scheme: dark)': 'white'
    }
  }
});
```

--------------------------------

### css overview

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/index.md

An overview of working with styles.

```APIDOC
## css overview

### Description
An overview of working with styles.

### Endpoint
/api/css/
```

--------------------------------

### css.createTheme

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/index.md

How to create themes.

```APIDOC
## css.createTheme

### Description
How to create themes.

### Endpoint
/api/css/createTheme
```

--------------------------------

### css.create

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/index.md

How to create styles.

```APIDOC
## css.create

### Description
How to create styles.

### Endpoint
/api/css/create
```

--------------------------------

### Create Theme with Overrides

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/02-css/02-createTheme.md

Illustrates creating a theme object by providing the defined variables and an object of overrides.

```js
import { colors } from './vars.css.js';

const themeColors = css.createTheme(colors, {
  accent: 'red',
  textPrimary: 'black',
  textSecondary: 'brown',
})
```

--------------------------------

### html overview

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/index.md

An overview of working with components.

```APIDOC
## html overview

### Description
An overview of working with components.

### Endpoint
/api/html/
```

--------------------------------

### Run Performance Benchmarks

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/contribute/01-development/04-author-patch.md

Commands to run performance and size benchmarks.

```bash
npm run perf -w benchmarks
```

```bash
npm run size -w benchmarks
```

--------------------------------

### Define Variables for Theming

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/02-css/02-createTheme.md

Shows how to define style variables using css.defineVars, which can later be overridden by createTheme.

```js
export const colors = css.defineVars({
  accent: 'blue',
  textPrimary: 'black',
  textSecondary: '#333',
});
```

--------------------------------

### Basic Styling with css.create()

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/static/llms.txt

Demonstrates how to apply basic styles to an HTML element using the css.create() function and the style prop in React Strict DOM. Styles are defined in a JavaScript object.

```jsx
import { css, html } from 'react-strict-dom';

const styles = css.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8
  }
});

<html.div style={styles.container}>Content</html.div>
```

--------------------------------

### Run All Tests

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/contribute/01-development/04-author-patch.md

Command to execute all tests in the project.

```bash
npm test
```

--------------------------------

### html.*

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/index.md

Common components and props.

```APIDOC
## html.*

### Description
Common components and props.

### Endpoint
/api/html/common
```

--------------------------------

### Create a Custom Theme

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/learn/05-theming-components.md

Create a new theme by overriding default variable values using `css.createTheme`. This allows for multiple theme configurations.

```javascript
import { css } from 'react-strict-dom';
import { colors, spacing } from './tokens.css.js';

const darkMode = '@media (prefers-color-scheme: dark)';

const themeColors = css.createTheme(colors, {
  primaryText: {default: 'purple', [darkMode]: 'lightpurple'},
  secondaryText: {default: 'pink', [darkMode]: 'hotpink'},
  accent: 'red',
  background: {default: '#555', [darkMode]: 'black'},
  lineColor: 'red',
});

const themeSpacing = css.createTheme(spacing, {
  ...
});

export const theme = [ themeColors, themeSpacing ];
```

--------------------------------

### Referencing Style Rules

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/02-css/01-create.md

Shows how to create styles and then reference a specific style rule by its key name.

```javascript
const styles = css.create({
  foo: {
    backgroundColor: 'red'
  }
});

export const foo = styles.foo;
```

--------------------------------

### Create and Apply Themes

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/static/llms.txt

Creates a theme using css.createTheme() with custom variable values and applies it to a root element. All child components within the themed element will inherit these variable values.

```jsx
// theme.js
export const darkTheme = css.createTheme(colors, {
  primary: 'purple',
  background: '#222'
});

// App.js
<html.div style={darkTheme}>
  {/* All children use themed variables */}
</html.div>
```

--------------------------------

### compat

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/index.md

Compatibility documentation.

```APIDOC
## compat

### Description
Compatibility documentation.

### Endpoint
/api/other/compat
```

--------------------------------

### Build and Watch Workspace

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/contribute/01-development/03-workspaces-and-tasks.md

Build the 'react-strict-dom' package and continuously watch for file changes to recompile. This is useful during development.

```bash
npm run dev -w react-strict-dom
```

--------------------------------

### Create and Update Branch

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/contribute/01-development/04-author-patch.md

Commands to checkout main, pull latest changes, and create a new branch for development.

```bash
git checkout main
git pull <remote> main
git checkout -b <branch-name>
```

--------------------------------

### Rendering a List Item with html.li

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/03-html/07-li.md

Demonstrates how to render a basic list item using the html.li component within an unordered list.

```jsx
import { html } from 'react-strict-dom';

const Foo = () => (
  <html.ul>
    <html.li />
  </html.ul>
);
```

--------------------------------

### Dynamic Styles with Functions

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/static/llms.txt

Shows how to create dynamic styles using arrow functions within css.create(). These functions can accept parameters to generate style objects. Limitations apply to arrow function syntax and parameters.

```jsx
const styles = css.create({
  dynamicSize: (height, width) => ({
    height: height * 0.9,
    width
  })
});

<html.div style={styles.dynamicSize(100, 200)} />
```

--------------------------------

### html.select

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/index.md

Option select component.

```APIDOC
## html.select

### Description
Option select component.

### Endpoint
/api/html/select
```

--------------------------------

### Basic Usage of html.optgroup

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/03-html/08-optgroup.md

Demonstrates how to render an option group with a label and an option within a select element. Ensure html is imported from 'react-strict-dom'.

```jsx
import { html } from 'react-strict-dom';

const Foo = () => (
  <html.select>
    <html.optgroup label="Colors">
      <html.option>Red</html.option>
    </html.optgroup>
  </html.select>
);
```

--------------------------------

### babel preset

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/index.md

Configure babel for web builds.

```APIDOC
## babel preset

### Description
Configure babel for web builds.

### Endpoint
/api/babel-preset
```

--------------------------------

### css.defineConsts

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/index.md

How to define constants.

```APIDOC
## css.defineConsts

### Description
How to define constants.

### Endpoint
/api/css/defineConsts
```

--------------------------------

### Compare Benchmark Results

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/contribute/01-development/04-author-patch.md

Command to compare benchmark results between two sets of files.

```bash
npm run compare -w benchmarks -- <path-to-base.json> <path-to-patch.json>
```

--------------------------------

### window

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/index.md

Documentation related to the window object.

```APIDOC
## window

### Description
Documentation related to the window object.

### Endpoint
/api/other/window
```

--------------------------------

### Style with Media Queries

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/learn/04-styling-components.md

Apply styles based on media states by nesting them within a property using a valid Media Query as the key.

```js
import { css } from 'react-strict-dom';

const styles = css.create({
  base: {
    width: {
      default: 800,
      '@media (max-width: 800px)': '100%',
      '@media (min-width: 1540px)': 1366,
    },
  },
});
```

--------------------------------

### html.img Component Usage

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/03-html/04-img.md

Demonstrates how to render an image using the html.img component with common attributes like loading, onLoad, and srcSet.

```APIDOC
## html.img Component

### Description

The `<html.img>` component is used to render an image element on the web page. It supports various standard HTML image attributes.

### Props

*   **alt** (string) - Description for the image, used for accessibility.
*   **crossOrigin** (string) - Specifies how the image should be treated regarding CORS.
*   **decoding** (string) - Hints at the type of decoding that should be used for the image.
*   **draggable** (boolean) - Indicates whether the element can be dragged.
*   **fetchPriority** (string) - Specifies the priority with which to fetch the resource.
*   **height** (number) - The intrinsic height of the image in pixels.
*   **loading** (string) - Specifies if the image should be loaded lazily or eagerly.
*   **onError** (function) - Callback function invoked when an error occurs during image loading.
*   **onLoad** (function) - Callback function invoked when the image has successfully loaded.
*   **referrerPolicy** (string) - Specifies the referrer policy for the image.
*   **src** (string) - The URL of the image to display.
*   **srcSet** (string) - A set of image sources to use for different screen resolutions or sizes.
*   **width** (number) - The intrinsic width of the image in pixels.

### Request Example

```jsx
import { html } from 'react-strict-dom';

const MyImage = () => (
  <html.img
    alt="A descriptive text for the image"
    loading="lazy"
    onLoad={() => console.log('Image loaded')}
    src="https://example.com/image.jpg"
    srcSet="https://example.com/image-2x.jpg 2x, https://example.com/image-1x.jpg 1x"
    width={300}
    height={200}
  />
);
```

### Response

This component renders a standard HTML `<img>` tag. The response is the rendered HTML element itself.
```

--------------------------------

### Styling with Pseudo-states

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/static/llms.txt

Shows how to define styles for pseudo-states like :hover, :focus, and :active by nesting them within the style object. The 'default' state is required.

```jsx
const styles = css.create({
  button: {
    backgroundColor: {
      default: 'lightblue',
      ':hover': 'blue',
      ':focus': 'darkblue',
      ':active': 'navy'
    }
  }
});
```

--------------------------------

### Defining a Static Style Rule

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/02-css/01-create.md

Illustrates a basic style rule with a static declaration object.

```javascript
const styles = css.create({
  // style rule's name is "foo"
  foo: {
    // declaration
    backgroundColor: 'red'
  }
});
```

--------------------------------

### html.option

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/index.md

Option component.

```APIDOC
## html.option

### Description
Option component.

### Endpoint
/api/html/option
```

--------------------------------

### Rendering a Basic Input

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/03-html/05-input.md

Use the html.input component to render a standard text input. It accepts an onInput handler and a placeholder.

```jsx
import { html } from 'react-strict-dom';

const Foo = () => (
  <html.input
    onInput={() => {}}
    placeholder="Placeholder text"
  />
);
```

--------------------------------

### Using Various Style Value Types

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/02-css/01-create.md

Shows the use of different types for style values, including strings, numbers, objects, css.firstThatWorks, and null.

```javascript
const styles = css.create({
  foo: {
    backgroundColor: 'white',
    borderWidth: 10,
    color: {
      default: 'gray',
      ':hover': 'black'
    },
    position: css.firstThatWorks('sticky', 'absolute'),
    textDecorationLine: null
  }
});
```

--------------------------------

### Checkout Release Branch

Source: https://github.com/react/react-strict-dom/blob/main/tools/README.md

Use this command to create a new release branch from the latest main branch. Ensure you have pulled the latest changes from origin main before branching.

```shell
git checkout main
git pull origin main
git checkout -b release/<version>
```

--------------------------------

### Creating a Profile Component

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/learn/03-creating-components.md

Define a custom component that renders a cross-platform image element using the imported `html` object.

```jsx
import { html } from 'react-strict-dom';

export function Profile() {
  return (
    <html.img
      alt={user.name}
      src={user.avatarSrc}
    />
  );
}
```

--------------------------------

### Platform-Specific Extensions Configuration

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/learn/environment-setup/02-next.md

Configure next.config.js to handle platform-specific file extensions like .web.js for web builds in Next.js.

```javascript
const webOnlyExtensions = ['.web.js', '.web.jsx', '.web.ts', '.web.tsx'];

const nextConfig: NextConfig = {
  // ...
  turbopack: {
    // ...
    resolveExtensions: [ ...webOnlyExtensions, ".tsx", ".ts", ".jsx", ".js", ".mjs", ".json"],
  },
  webpack: (config, { webpack }) => {
    // ...
    config.resolve.extensions = [ ...webOnlyExtensions, ...config.resolve.extensions];
    return config;
  },
};

export default nextConfig;
```

--------------------------------

### css.createTheme

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/02-css/02-createTheme.md

Creates a style theme by overriding variables defined with `defineVars`. The returned theme object can be passed to the `style` prop of any `html.*` element to apply styles to its subtree. Themes can also be combined using an array.

```APIDOC
## css.createTheme

### Description

Creates a style theme by overriding variables defined with `defineVars`. The returned theme object can be passed to the `style` prop of any `html.*` element to apply styles to its subtree. Themes can also be combined using an array.

### Parameters

#### First Argument: Vars

The first argument to `createTheme` must be the return value of a `defineVars` call. This determines which variables can be overridden.

```js
import { colors } from './vars.css.js';

const themeColors = css.createTheme(colors, { ... })
```

#### Second Argument: Overrides

The second argument is an object of variable value overrides. Each key must match a key from the object provided to `defineVars`.

```js
import { colors } from './vars.css.js';

const themeColors = css.createTheme(colors, {
  accent: 'red',
  textPrimary: 'black',
  textSecondary: 'brown',
})
```

### Example Usage

```jsx
import { css } from 'react-strict-dom';
import { colors, spacing } from './vars.css.js';

const themeColors = css.createTheme(colors, {
  accent: 'red',
  textPrimary: 'black',
  textSecondary: 'brown',
});

const themeSpacing = css.createTheme(spacing, {
  small: '0.25rem',
  large: '0.5rem'
});

const theme = [ themeColors, themeSpacing ];

const Theme = (props) => <html.div {...props} style={theme} />
```
```

--------------------------------

### Watch Unit Tests

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/contribute/01-development/04-author-patch.md

Command to run and continuously watch unit tests during development.

```bash
npm run jest -- --watch
```

--------------------------------

### css.firstThatWorks

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/index.md

How to declare fallback values.

```APIDOC
## css.firstThatWorks

### Description
How to declare fallback values.

### Endpoint
/api/css/firstThatWorks
```

--------------------------------

### Perform Dry Run for Release

Source: https://github.com/react/react-strict-dom/blob/main/tools/README.md

Execute a dry run of the release script by specifying only the new package version. This allows you to preview the release process without making actual changes.

```shell
npm run release -- --pkg-version <version>
```

--------------------------------

### html.input

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/index.md

Input component.

```APIDOC
## html.input

### Description
Input component.

### Endpoint
/api/html/input
```

--------------------------------

### Common Web API

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/index.md

Documentation for common web APIs.

```APIDOC
## Common Web API

### Description
Documentation for common web APIs.

### Endpoint
/api/other/common-min-api
```

--------------------------------

### css.defineVars

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/index.md

How to define variables.

```APIDOC
## css.defineVars

### Description
How to define variables.

### Endpoint
/api/css/defineVars
```

--------------------------------

### Configure Babel for Web

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/01-babel/01-preset.md

Import and configure the react-strict-dom/babel-preset for web builds. Enable debug mode for additional information.

```js
import reactStrictBabelPreset from 'react-strict-dom/babel-preset';

export default function babelConfig() {
  return {
    presets: [
      [reactStrictBabelPreset, { debug: true }]
    ]
  }
};
```

--------------------------------

### Interactive Rebase

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/contribute/01-development/04-author-patch.md

Command to perform an interactive rebase for a specified number of commits.

```bash
git rebase -i HEAD~5
```

--------------------------------

### Create Base and Highlighted Styles

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/learn/04-styling-components.md

Define named style rules using `css.create` for base and highlighted states. These constants capture the style objects for later use.

```js
import { css } from 'react-strict-dom';

const styles = css.create({
  base: {
    fontSize: 16,
    lineHeight: 1.5,
    color: 'rgb(60,60,60)',
  },
  highlighted: {
    color: 'rebeccapurple',
  },
});
```

--------------------------------

### html.button

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/index.md

Button component.

```APIDOC
## html.button

### Description
Button component.

### Endpoint
/api/html/button
```

--------------------------------

### Apply Styles to HTML Elements

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/learn/04-styling-components.md

Pass defined styles directly to the `style` prop on `html.*` elements to render them. Styles can also be imported from other files.

```jsx
import { css, html } from 'react-strict-dom';

const styles = css.create({
  root: { ... }
});

const Foo = () => (
  <html.div style={styles.root} />
);
```

--------------------------------

### Basic HTML Structure with Common Components

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/03-html/01-common.md

Demonstrates the usage of common HTML components like main, h1, div, p, and span within a React Strict DOM component.

```jsx
import { html } from 'react-strict-dom';

const Foo = () => {
  return (
    <html.main>
      <html.h1>Title</html.h1>
      <html.div>
        <html.p>
          Paragraph of <html.span>text</html.span> element
        </html.p>
      </html.div>
    </html.main>
  )
}
```

--------------------------------

### Publish Release

Source: https://github.com/react/react-strict-dom/blob/main/tools/README.md

Publish the release to the npm registry. This requires specifying the package version, the --publish flag, and a one-time password (OTP) for authentication.

```shell
npm run release -- --pkg-version <version> --publish --otp 123456
```

--------------------------------

### html.li

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/index.md

List item component.

```APIDOC
## html.li

### Description
List item component.

### Endpoint
/api/html/li
```

--------------------------------

### Clone React Strict DOM Repository

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/contribute/01-development/02-clone-repo.md

Use this command to clone the main React Strict DOM repository directly. This is typically for Meta employees.

```bash
git clone git@github.com:facebook/react-strict-dom.git
cd react-strict-dom
```

--------------------------------

### Dynamic Style Rule with Arrow Function Syntax

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/02-css/01-create.md

Demonstrates the required arrow function syntax for dynamic styles, accepting simple identifiers and returning an object literal.

```jsx
import { css } from 'react-strict-dom';

const styles = css.create({
  dynamic: (r, g, b) => ({
    color: `rgb(${r}, ${g}, ${b})`,
  }),
});

// in a component render
const { red, green, blue } = getColorsFromData(props.data)
styles.dynamic(red, green, blue)
```

--------------------------------

### html.optgroup

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/index.md

Option group component.

```APIDOC
## html.optgroup

### Description
Option group component.

### Endpoint
/api/html/optgroup
```

--------------------------------

### html.textarea

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/index.md

Textarea component.

```APIDOC
## html.textarea

### Description
Textarea component.

### Endpoint
/api/html/textarea
```

--------------------------------

### Configure ESLint for Type-Aware Linting

Source: https://github.com/react/react-strict-dom/blob/main/apps/vite-app/README.md

Expand ESLint configuration to enable type-aware lint rules for TypeScript files. Ensure to replace the default recommended configuration with the type-checked alternatives.

```javascript
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}']
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

--------------------------------

### Creating Static and Dynamic Styles

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/02-css/01-create.md

Defines static styles and dynamic styles using a function. The returned objects are opaque and should not be modified.

```javascript
import { css } from 'react-strict-dom';

const styles = css.create({
  foo: {
    backgroundColor: 'red'
  },
  bar: (color, padding) => ({
    color: color,
    padding: padding
  })
});
```

--------------------------------

### Render a Basic Textarea

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/03-html/11-textarea.md

Renders a multiline text input with placeholder and row configuration. Use this for standard text area inputs.

```jsx
import { html } from 'react-strict-dom';

const Foo = () => (
  <html.textarea
    onInput={() => {}}
    placeholder="Placeholder text"
    rows={3}
  />
);
```

--------------------------------

### Commit Release

Source: https://github.com/react/react-strict-dom/blob/main/tools/README.md

Commit the release changes by specifying the package version and the --commit flag. This prepares the release for publishing.

```shell
npm run release -- --pkg-version <version> --commit
```

--------------------------------

### Push Branch to GitHub

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/contribute/01-development/04-author-patch.md

Command to push a local branch to a remote repository.

```bash
git push <remote> <branch>
```

--------------------------------

### Run Root Tasks

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/contribute/01-development/03-workspaces-and-tasks.md

Execute tasks defined at the monorepo root that apply to all workspaces. This is the general approach for repository-wide checks.

```bash
npm run flow
```

--------------------------------

### html.img

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/index.md

Image component.

```APIDOC
## html.img

### Description
Image component.

### Endpoint
/api/html/img
```

--------------------------------

### Render an Image with Attributes

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/03-html/04-img.md

Use the html.img component to display an image. Supports standard attributes like loading, onLoad, and srcSet. Ensure necessary imports are included.

```jsx
import { html } from 'react-strict-dom';

const Foo = () => (
  <html.img
    loading="lazy"
    onLoad={() => {}}
    srcSet="https://srcSet-2x.jpg 2x"
  />
);
```

--------------------------------

### Applying Styles with CSS Export

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/03-html/01-common.md

Shows how to apply styles to an HTML image component using the 'css' export and conditionally merging styles using an array. Styles are applied in order, with later declarations overriding earlier ones.

```jsx
import { css, html } from 'react-strict-dom';

const styles = css.create({
  avatar: {...},
  highlighted: {...}
});

<html.img
  style={[
    styles.avatar,
    highlighted && styles.highlighted
  ]}
/>
```

--------------------------------

### Use Defined Constants in Styles

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/02-css/03-defineConsts.md

Import and use the defined breakpoint constants within css.create to apply styles conditionally based on screen size.

```javascript
import { breakpoints } from './constants.css.js';

const styles = css.create({
  box: {
    padding: {
      default: '10px',,
      [breakpoints.medium]: '15px',
      [breakpoints.large]: '20px',
    },
  },
});
```

--------------------------------

### Merging and Conditional Styles

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/static/llms.txt

Illustrates how to apply multiple styles to an element, including base styles, conditional styles based on state (e.g., isActive), variant styles, and external styles. Styles are passed as an array.

```jsx
<html.div
  style={[
    styles.base,
    isActive && styles.active,
    variant === 'primary' && styles.primary,
    style  // External styles
  ]}
/>
```

--------------------------------

### Create Dynamic Styles

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/learn/04-styling-components.md

Define styles as functions that can be dynamically calculated at runtime. These styles accept parameters for dynamic values but are less optimized.

```js
import { css, html } from 'react-strict-dom';

const styles = css.create({
  size: (height: number, width: number) => ({
    height: height * 0.9,
    width
  })
});

function MyComponent() {
  const {height, width} = useContainerSize();

  return <html.div style={styles.size(height, width))} />;
}
```

--------------------------------

### css.create Function

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/02-css/01-create.md

The css.create function accepts a map of style objects and returns optimized JavaScript objects for the style prop. It supports static style rules and dynamic function rules.

```APIDOC
## css.create

### Description
Accepts an object of named style rules and returns opaque JavaScript objects to be used with the `style` prop. The return value should not be introspected or modified.

### Usage
```javascript
import { css } from 'react-strict-dom';

const styles = css.create({
  foo: {
    backgroundColor: 'red'
  },
  bar: (color, padding) => ({
    color: color,
    padding: padding
  })
});

export const foo = styles.foo;
```

### Style Rule
A style rule is a name paired with a declaration object or a function returning a declaration object.

### Declaration Object
Contains style property-value pairs.

```javascript
const styles = css.create({
  foo: {
    backgroundColor: 'red'
  }
});
```

### Function Rule
Returns a declaration object, used for dynamic styles based on runtime data. Must use arrow syntax and return an object literal. Arguments must be simple identifiers.

```javascript
const styles = css.create({
  bar: (color: string, padding: number) => ({
    color: color,
    padding: padding
  })
});

// Usage in a component:
styles.bar(color, padding)
```

### Style Value
Can be a string, number, object, the result of `css.firstThatWorks()`, or `null`.

### Style Value (Object)
Defines stateful conditions for a property. Supported keys include `default`, `:hover`, `:focus`, `:active`, `::placeholder`, and `@media (...)`.

**Pseudo-state Precedence:** `active` > `focus` > `hover`.

**Example (Pseudo-states):**
```javascript
const styles = css.create({
  root: {
    color: {
      default: 'black',
      ':hover': 'red',
      ':focus': 'green',
      ':active': 'blue'
    }
  }
});
```

**Example (Media Queries):**
```javascript
const styles = css.create({
  root: {
    color: {
      default: 'black',
      '@media (prefers-color-scheme:dark)': 'white'
    }
  }
});
```

**Example (Nested Media Queries and Pseudo-states):**
```javascript
const styles = css.create({
  root: {
    color: {
      default: 'black',
      ':hover': 'darkgray',
      '@media (prefers-color-scheme:dark)': {
        default: 'white',
        ':hover': 'lightgray'
      }
    }
  }
});
```
```

--------------------------------

### Using Theme Component in App

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/learn/05-theming-components.md

Wrap a component tree with the `Theme` component to apply a specific theme. This ensures that the selected theme's variable values are used throughout the wrapped components.

```jsx
import { ProfilePage } from './ProfilePage';
import { Theme } from './Theme';

const App = () => (
  <Theme name={app.activeTheme}>
    <ProfilePage user={user} />
  </Theme>
);
```

--------------------------------

### Next.js Configuration for Turbopack and Webpack

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/learn/environment-setup/02-next.md

Configure next.config.js to transpile react-strict-dom and set up Babel loader for both Turbopack and Webpack build tools.

```javascript
import type { NextConfig } from "next";

import babelLoader from "./babelLoader.config.js";

function getBabelLoader() {
  return {
    loader: "babel-loader",
    options: babelLoader,
  };
}

const nextConfig: NextConfig = {
  transpilePackages: ["react-strict-dom"],

  turbopack: {
    rules: {
      "*.{js,jsx,ts,tsx}": {
        loaders: [getBabelLoader()],
      },
    },
  },

  webpack: (config, { webpack }) => {
    config.resolve.mainFields = ["module", "main"];
    config.module.rules.push({
      exclude: /node_modules(?!\/react-strict-dom)/,
      test: /\.(js|jsx|ts|tsx)$/,
      use: [getBabelLoader()],
    });
    return config;
  },
};

export default nextConfig;
```

--------------------------------

### html.a

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/index.md

Anchor component.

```APIDOC
## html.a

### Description
Anchor component.

### Endpoint
/api/html/a
```

--------------------------------

### Layout Component Import

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/learn/environment-setup/02-next.md

Import the strict.css file into your src/app/layout.tsx file to ensure CSS works correctly in Next.js.

```javascript
// Required for CSS to work on Next.js
import './strict.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

--------------------------------

### html.textarea

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/03-html/11-textarea.md

Renders a multiline text input element. It accepts standard HTML textarea attributes and event handlers.

```APIDOC
## html.textarea

### Description

The `<html.textarea>` component lets you render a multiline text input.

### Props

* [...Common props](/api/html/common/)
* `autoComplete`
* `defaultValue`
* `disabled`
* `maxLength`
* `minLength`
* `name`
* `onBeforeInput`
* `onChange`
* `onInput`
* `onInvalid`
* `onSelect`
* `onSelectionChange`
* `placeholder`
* `readOnly`
* `required`
* `rows`
* `value`

### Example

```jsx
import { html } from 'react-strict-dom';

const Foo = () => (
  <html.textarea
    onInput={() => {}}
    placeholder="Placeholder text"
    rows={3}
  />
);
```
```

--------------------------------

### Render a Basic Link

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/03-html/02-a.md

Use the html.a component with an href attribute to render a standard text link. Ensure you import html from 'react-strict-dom'.

```jsx
import { html } from 'react-strict-dom';

const Foo = () => <html.a href={...} />;
```

--------------------------------

### Run Task in Specific Workspace

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/contribute/01-development/03-workspaces-and-tasks.md

Execute a specific task within a targeted workspace. Use this to perform actions like builds or tests on individual packages.

```bash
npm run <task-name> -w <workspace-name>
```

--------------------------------

### Clone a Forked React Strict DOM Repository

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/contribute/01-development/02-clone-repo.md

Clone your personal fork of the React Strict DOM repository. Replace <username> with your GitHub username.

```bash
git clone git@github.com:<username>/react-strict-dom.git
cd react-strict-dom
```

--------------------------------

### Applying Styles with `style` Prop in React Strict DOM

Source: https://github.com/react/react-strict-dom/blob/main/packages/react-strict-dom/README.md

Demonstrates how to use the `style` prop with an array of static and dynamic styles, including conditional and dynamic styles, in React Strict DOM components. Ensure `css` and `html` are imported from 'react-strict-dom'.

```jsx
import { css, html } from 'react-strict-dom';

const styles = css.create({
  root: {
    marginBlock: '1rem'
  },
  cond: {
    borderWidth: '5px'
  },
  opacity: (value) => ({
    opacity: value
  })
})

export default function App(props) {
  const opacity = useOpacity();
  return (
    <html.div
      {...props}
      style={[
        styles.root,
        cond && styles.cond,
        styles.opacity(opacity)
      ]}
    />
  );
}
```

--------------------------------

### Handling Button Clicks

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/learn/03-creating-components.md

Implement event handlers for user interactions like clicks on cross-platform button elements.

```jsx
import { html } from 'react-strict-dom';

export function Button() {
  return (
    <html.button
      onClick={(e) => {}}
    />
  );
}
```

--------------------------------

### Wrapping React Native Components with compat.native

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/static/llms.txt

Use `compat.native` in `*.native.js` files to wrap React Native components, mapping RSD elements to their native counterparts. Ensure `nativeProps` are typed correctly and spread entirely.

```jsx
import type { TextProps } from 'react-native';
import { compat } from 'react-strict-dom';
import { Text } from 'react-native';

function CustomText(props) {
  return (
    <compat.native {...props} as="span">
      {(nativeProps: TextProps) => (
        <Text {...nativeProps}>{props.children}</Text>
      )}
    </compat.native>
  );
}
```

--------------------------------

### Theme Switcher Component

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/learn/05-theming-components.md

Create a reusable `Theme` component that allows selecting and applying different themes to its children. It uses a `style` prop to override variable values.

```jsx
import { css, html } from 'react-strict-dom';
import { marsTheme } from './marsTheme';
import { venusTheme } from './venusTheme';

const styles = css.create({
  displayContents: {
    display: 'contents'
  }
});

const Theme = (props) => {
  const theme = props.name === 'venus' ? venusTheme : marsTheme;
  return (
    <html.div
      children={props.children}
      style={[ theme, styles.displayContents ]}
    />
  );
}
```

--------------------------------

### Basic React DOM vs React Strict DOM Component

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/static/llms.txt

Illustrates the fundamental differences in component structure and styling between React DOM and React Strict DOM. RSD uses html.div and css.create() for styling.

```jsx
// React DOM
import React from 'react';
function App() {
  return <div className={styles.root}>Hello</div>;
}

// React Strict DOM
import { html, css } from 'react-strict-dom';
const styles = css.create({
  root: { padding: 16, backgroundColor: 'white' }
});
function App() {
  return <html.div style={styles.root}>Hello</html.div>;
}
```

--------------------------------

### Converting Elements and Styles from CSS Modules to RSD CSS

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/static/llms.txt

Convert standard React elements and CSS Modules to use `react-strict-dom`'s `html` elements and `css.create` for styles. Apply styles using the `style` prop.

```jsx
// Before
import styles from './styles.module.css';
<div className={styles.container}>
  <span className={styles.text}>Text</span>
</div>

// After
const styles = css.create({
  container: { padding: 16 },
  text: { fontSize: 16 }
});
<html.div style={styles.container}>
  <html.span style={styles.text}>Text</html.span>
</html.div>
```

--------------------------------

### Merge Styles

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/learn/04-styling-components.md

The `style` prop accepts a list of styles to be merged. The order in the list determines the application order, not the final merged result.

```jsx
import { css, html } from 'react-strict-dom';

const styles = css.create({
  root: { ... }
});

const Foo = (props) => (
  <html.div style={[ props.style, styles.root ]} />
);
```

--------------------------------

### Import CSS in Main Application File

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/learn/environment-setup/03-vite.md

Import the CSS file containing the @react-strict-dom directive into your main application entry point (e.g., main.tsx) to ensure styles are processed correctly by Vite.

```typescript
// ...

// Required for CSS to work on Vite
import "./strict.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

--------------------------------

### Style Value Object with Media Queries

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/02-css/01-create.md

Applies styles conditionally based on media query conditions, such as color scheme and screen width.

```javascript
const styles = css.create({
  root: {
    color: {
      default: 'black',
      '@media (prefers-color-scheme:dark)': 'white'
    },
    width: {
      default: '100%',
      '@media (min-width:320px)': '800px',
    }
  }
});
```

--------------------------------

### Using css.firstThatWorks for Fallback Styles

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/02-css/05-firstThatWorks.md

Demonstrates how to use css.firstThatWorks to provide fallback values for the 'position' CSS property. The browser will use 'sticky' if supported, otherwise it will fall back to 'absolute'.

```javascript
import { css } from 'react-strict-dom';

const styles = css.create({
  header: {
    position: css.firstThatWorks('sticky', 'absolute'),
  },
});
```

--------------------------------

### html.label

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/index.md

Form label component.

```APIDOC
## html.label

### Description
Form label component.

### Endpoint
/api/html/label
```

--------------------------------

### Fallback Values with css.firstThatWorks

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/static/llms.txt

Demonstrates using css.firstThatWorks to provide fallback values for CSS properties, ensuring compatibility or graceful degradation if a primary value is not supported.

```jsx
const styles = css.create({
  header: {
    position: css.firstThatWorks('sticky', 'fixed')
  }
});
```

--------------------------------

### Nested Pseudo-States within Media Queries

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/api/02-css/01-create.md

Combines media queries with pseudo-states to apply conditional styling, including hover states within dark mode.

```javascript
const styles = css.create({
  root: {
    color: {
      default: 'black',
      ':hover': 'darkgray',
      '@media (prefers-color-scheme:dark)': {
        default: 'white',
        ':hover': 'lightgray'
      }
    }
  }
});
```

--------------------------------

### Variant Styles with Object Lookups

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/learn/04-styling-components.md

Implement variant styles by using object property lookups on style objects, allowing styles to be set based on prop values. This can be combined with conditional logic for complex styling.

```jsx
import { css, html } from 'react-strict-dom';

const colorVariantStyles = css.create({
  red: {
    color: 'rgb(200, 0, 0)',
  },
  green: {
    color: 'rgb(0, 200, 0)',
  }
});

const sizeVariantStyles = css.create({
  small: {
    fontSize: '0.75rem',
  },
  large: {
    fontSize: '1.5rem',
  }
});

export function Foo({ color, size, ...props }) {
  return (
    <html.span
      {...props}
      style={[
        colorVariantStyles[color]
        sizeVariantStyles[size]
      ]}
    />
  )
}
```

--------------------------------

### Style Pseudo-elements (Placeholder)

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/learn/04-styling-components.md

Target shadow elements within native elements using pseudo-elements. Currently, only `::placeholder` is supported for styling the color of placeholder text in inputs.

```js
import { css } from 'react-strict-dom';

const styles = css.create({
  input: {
    '::placeholder': {
      color: '#999',
    }
  },
});
```

--------------------------------

### PostCSS Configuration for CSS Extraction

Source: https://github.com/react/react-strict-dom/blob/main/packages/website/docs/learn/environment-setup/02-next.md

Configure PostCSS in Next.js to extract React Strict DOM styles to static CSS. Ensure Babel configuration is shared.

```javascript
// Be sure to share the babel configuration between Next.js and PostCS
import babelLoader from "./babelLoader.config.js";

const config = {
  plugins: {
    "react-strict-dom/postcss-plugin": {
      include: [
        // Include source files to watch for style changes
        // Be specific and avoid a non-specific glob like "**/*.{js,jsx}" which could cause major performance issues during build
        'src/**/*.{js,jsx,mjs,ts,tsx}',
        // List any installed node_modules that include UI built with React Strict DOM
        'node_modules/<package-name>/*.js'
      ],
      babelConfig: babelLoader,
      useLayers: true,
    }
  },
};

export default config;
```
