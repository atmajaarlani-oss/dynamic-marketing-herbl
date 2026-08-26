### Example of prefixed classes

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/upgrade-guide.mdx

HTML demonstrating how prefixes are now applied at the beginning of class names.

```html
<div class="tw:flex tw:bg-red-500 tw:hover:bg-red-600">
  <!-- ... -->
</div>
```

--------------------------------

### Start

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/align-content.mdx

Example demonstrating `content-start` to pack rows in a container against the start of the cross axis.

```html
<!-- [!code classes:content-start] -->
<div class="grid h-56 grid-cols-3 content-start gap-4 ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
  <div>04</div>
  <div>05</div>
</div>
```

--------------------------------

### Start

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/place-self.mdx

Example of using `place-self-start` to align an item to the start on both axes.

```html
<!-- [!code classes:place-self-start] -->
<div class="grid grid-cols-3 gap-4 ...">
  <div>01</div>
  <div class="place-self-start ...">02</div>
  <div>03</div>
  <div>04</div>
  <div>05</div>
  <div>06</div>
</div>
```

--------------------------------

### Basic example

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/touch-action.mdx

Example demonstrating different touch-action utilities.

```html
<!-- [!code classes:overflow-auto,touch-auto,touch-none,touch-pan-x,touch-pan-y] -->
<div class="h-48 w-full touch-auto overflow-auto ...">
  <img class="h-auto w-[150%] max-w-none" src="..." />
</div>
<div class="h-48 w-full touch-none overflow-auto ...">
  <img class="h-auto w-[150%] max-w-none" src="..." />
</div>
<div class="h-48 w-full touch-pan-x overflow-auto ...">
  <img class="h-auto w-[150%] max-w-none" src="..." />
</div>
<div class="h-48 w-full touch-pan-y overflow-auto ...">
  <img class="h-auto w-[150%] max-w-none" src="..." />
</div>
```

--------------------------------

### Basic example

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/transition-property.mdx

Example demonstrating the use of `transition` utility.

```html
<!-- [!code classes:transition] -->
<button class="bg-blue-500 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 ...">
  Save Changes
</button>
```

--------------------------------

### MDX Annotation Example

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/blog/2022-12-15-protocol-api-documentation-template/index.mdx

An example of passing props into tags in MDX content using annotations.

```mdx
## Create a message { tag: 'POST', label: '/v1/messages' }
```

--------------------------------

### Vue component using <script setup>

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/blog/2022-05-23-headless-ui-v1-6-tailwind-ui-team-management/index.mdx

Example of a Vue single-file component updated to use the new `<script setup>` syntax, demonstrating reduced boilerplate and automatic component registration.

```html
<template>
  <Listbox as="div" v-model="selected">
    <!-- ... -->
  </Listbox>
</template>

<script setup>
  import { ref } from "vue";
  import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from "@headlessui/vue";
  import { CheckIcon, SelectorIcon } from "@heroicons/vue/solid";

  const people = [
    { id: 1, name: "Wade Cooper" },
    // ...
  ];

  const selected = ref(people[3]);
</script>
```

--------------------------------

### Basic example

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/color.mdx

Example demonstrating how to use text color utilities.

```html
<!-- [!code classes:text-blue-600,dark:text-sky-400] -->
<p class="text-blue-600 dark:text-sky-400">The quick brown fox...</p>
```

--------------------------------

### Basic example

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/text-decoration-style.mdx

Example demonstrating how to use text decoration style utilities.

```html
<!-- [!code classes:decoration-solid,decoration-double,decoration-dotted,decoration-dashed,decoration-wavy] -->
<p class="underline decoration-solid">The quick brown fox...</p>
<p class="underline decoration-double">The quick brown fox...</p>
<p class="underline decoration-dotted">The quick brown fox...</p>
<p class="underline decoration-dashed">The quick brown fox...</p>
<p class="underline decoration-wavy">The quick brown fox...</p>
```

--------------------------------

### Basic example

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/transition-delay.mdx

Example demonstrating `delay-150`, `delay-300`, and `delay-700` utilities to set transition delay.

```html
<!-- [!code classes:delay-150,delay-300,delay-700] -->
<button class="transition delay-150 duration-300 ease-in-out ...">Button A</button>
<button class="transition delay-300 duration-300 ease-in-out ...">Button B</button>
<button class="transition delay-700 duration-300 ease-in-out ...">Button C</button>
```

--------------------------------

### Basic example

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/content.mdx

Example demonstrating setting content for the ::after pseudo-element.

```html
<!-- [!code classes:after:content-['_↗']] -->
<!-- prettier-ignore -->
<p>Higher resolution means more than just a better-quality image. With a
Retina 6K display, <a class="text-blue-600 after:content-['_↗']" href="...">
Pro Display XDR</a> gives you nearly 40 percent more screen real estate than
a 5K display.</p>
```

--------------------------------

### Using logical properties

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/border-width.mdx

Example demonstrating `border-bs-4` for block start width.

```html
<div class="border-bs-4 ..."></div>
```

--------------------------------

### Basic example

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/filter-contrast.mdx

Example showing different contrast utility classes.

```html
<!-- [!code classes:contrast-50,contrast-100,contrast-125,contrast-200] -->
<img class="contrast-50 ..." src="/img/mountains.jpg" />
<img class="contrast-100 ..." src="/img/mountains.jpg" />
<img class="contrast-125 ..." src="/img/mountains.jpg" />
<img class="contrast-200 ..." src="/img/mountains.jpg" />
```

--------------------------------

### Updated shadow, radius, and blur scales

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/upgrade-guide.mdx

Example showing how to update shadow utilities from v3 to v4, specifically `shadow-sm` to `shadow-xs` and `shadow` to `shadow-sm`.

```html
<input class="shadow-sm" />
<input class="shadow-xs" />

<input class="shadow" />
<input class="shadow-sm" />
```

--------------------------------

### Updating border color for v4

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/upgrade-guide.mdx

HTML example showing how to explicitly specify a border color in v4.

```html
<div class="border border-gray-200 px-2 py-3 ...">
  <!-- ... -->
</div>
```

--------------------------------

### Basic example

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/list-style-type.mdx

Example demonstrating `list-disc`, `list-decimal`, and `list-none` utilities.

```html
<!-- [!code classes:list-disc] -->
<ul class="list-disc">
  <li>Now this is a story all about how, my life got flipped-turned upside down</li>
  <!-- ... -->
</ul>

<!-- [!code classes:list-decimal] -->
<ol class="list-decimal">
  <li>Now this is a story all about how, my life got flipped-turned upside down</li>
  <!-- ... -->
</ol>

<!-- [!code classes:list-none] -->
<ul class="list-none">
  <li>Now this is a story all about how, my life got flipped-turned upside down</li>
  <!-- ... -->
</ul>
```

--------------------------------

### Basic example

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/mix-blend-mode.mdx

Example demonstrating basic mix-blend-mode usage.

```html
<!-- [!code classes:mix-blend-multiply] -->
<div class="flex justify-center -space-x-14">
  <div class="bg-blue-500 mix-blend-multiply ..."></div>
  <div class="bg-pink-500 mix-blend-multiply ..."></div>
</div>
```

--------------------------------

### Renamed outline utility

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/upgrade-guide.mdx

Example showing how to update `outline-none` to `outline-hidden` in v4.

```html
<input class="focus:outline-none" />
<input class="focus:outline-hidden" />
```

--------------------------------

### Starting and ending lines

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/grid-row.mdx

Example demonstrating `row-start-<number>` and `row-end-<number>` utilities.

```html
<!-- [!code classes:row-start-1,row-start-2,row-end-3,row-end-4] -->
<div class="grid grid-flow-col grid-rows-3 gap-4">
  <div class="row-span-2 row-start-2 ...">01</div>
  <div class="row-span-2 row-end-3 ...">02</div>
  <div class="row-start-1 row-end-4 ...">03</div>
</div>
```

--------------------------------

### Using logical properties

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/top-right-bottom-left.mdx

Example demonstrating the use of `inset-s-0` for logical inline start positioning, which adapts to text direction.

```html
<!-- [!code classes:inset-s-0] -->
<div dir="ltr">
  <div class="relative size-32 ...">
    <div class="absolute inset-s-0 top-0 size-14 ..."></div>
  </div>
  <div>
    <div dir="rtl">
      <div class="relative size-32 ...">
        <div class="absolute inset-s-0 top-0 size-14 ..."></div>
      </div>
      <div></div>
    </div>
  </div>
</div>
```

--------------------------------

### Customizing container utility in v4

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/upgrade-guide.mdx

CSS example showing how to customize the `container` utility using the `@utility` directive in v4.

```css
@utility container {
  margin-inline: auto;
  padding-inline: 2rem;
}
```

--------------------------------

### Basic example

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/transition-behavior.mdx

Example demonstrating the use of `transition-discrete` for properties with discrete values, like `hidden` to `block`.

```html
<!-- [!code classes:transition-discrete] -->
<label class="peer ...">
  <input type="checkbox" checked />
</label>
<button class="hidden transition-all not-peer-has-checked:opacity-0 peer-has-checked:block ...">
  <!-- prettier-ignore -->
  I hide
</button>

<label class="peer ...">
  <input type="checkbox" checked />
</label>
<button class="hidden transition-all transition-discrete not-peer-has-checked:opacity-0 peer-has-checked:block ...">
  I fade out
</button>
```

--------------------------------

### Renamed outline utility

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/upgrade-guide.mdx

Example showing how to update the `outline` utility usage from v3 to v4, specifically `outline outline-2` to `outline-2`.

```html
<input class="outline outline-2" />
<input class="outline-2" />
```

--------------------------------

### Default ring width change

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/upgrade-guide.mdx

Example showing how to update the `ring` utility from v3 to v4, specifically `ring` to `ring-3`.

```html
<input class="ring ring-blue-500" />
<input class="ring-3 ring-blue-500" />
```

--------------------------------

### Basic example

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/background-blend-mode.mdx

Example demonstrating how to use `bg-blend-multiply`, `bg-blend-soft-light`, and `bg-blend-overlay` utilities to blend background images and colors.

```html
<!-- [!code classes:bg-blend-multiply,bg-blend-soft-light,bg-blend-overlay] -->
<div class="bg-blue-500 bg-[url(/img/mountains.jpg)] bg-blend-multiply ..."></div>
<div class="bg-blue-500 bg-[url(/img/mountains.jpg)] bg-blend-soft-light ..."></div>
<div class="bg-blue-500 bg-[url(/img/mountains.jpg)] bg-blend-overlay ..."></div>
```

--------------------------------

### React component example

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/blog/heroicons-v1/index.mdx

Example of using a Heroicon as a React component after installing the official React library.

```jsx
import { BeakerIcon } from "@heroicons/react/solid";

function MyComponent() {
  return (
    <div>
      <BeakerIcon className="h-5 w-5 text-blue-500" />
      <p>...</p>
    </div>
  );
}
```

--------------------------------

### Basic example

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/filter.mdx

Example demonstrating how to apply blur and grayscale filters, and combine them.

```html
<!-- [!code classes:blur-xs,grayscale] -->
<img class="blur-xs" src="/img/mountains.jpg" />
<img class="grayscale" src="/img/mountains.jpg" />
<img class="blur-xs grayscale" src="/img/mountains.jpg" />
```

--------------------------------

### Basic example

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/filter-blur.mdx

Example HTML demonstrating different blur utilities.

```html
<!-- [!code classes:blur-none,blur-sm,blur-lg,blur-2xl] -->
<img class="blur-none" src="/img/mountains.jpg" />
<img class="blur-sm" src="/img/mountains.jpg" />
<img class="blur-lg" src="/img/mountains.jpg" />
<img class="blur-2xl" src="/img/mountains.jpg" />
```

--------------------------------

### Flex

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/display.mdx

Example of using the `flex` utility.

```html
<!-- [!code classes:flex] -->
<div class="flex items-center">
  <img src="path/to/image.jpg" />
  <div>
    <strong>Andrew Alfred</strong>
    <span>Technical advisor</span>
  </div>
</div>
```

--------------------------------

### Basic example

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/aspect-ratio.mdx

Example showing how to use `aspect-3/2` to give an element a specific aspect ratio.

```html
<!-- [!code classes:aspect-3/2] -->
<img class="aspect-3/2 object-cover ..." src="/img/villas.jpg" />
```

--------------------------------

### Basic example

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/filter-brightness.mdx

Example showing how to apply different brightness levels to images using utility classes.

```html
<img class="brightness-50 ..." src="/img/mountains.jpg" />
<img class="brightness-100 ..." src="/img/mountains.jpg" />
<img class="brightness-125 ..." src="/img/mountains.jpg" />
<img class="brightness-200 ..." src="/img/mountains.jpg" />
```

--------------------------------

### Prefers-contrast variants example

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/blog/tailwindcss-v3-1/index.mdx

Example demonstrating the use of `contrast-more` and `contrast-less` variants to adjust styling based on a user's operating system accessibility preference for contrast.

```html
<form>
  <label class="block">
    <span class="block text-sm font-medium text-slate-700">Social Security Number</span>
    <!-- [!code word:contrast-more\:border-slate-400] -->
    <!-- [!code word:contrast-more\:placeholder-slate-500] -->
    <!-- [!code word:contrast-more\:opacity-100] -->
    <input
      class="border-slate-200 placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500"
    />
    <p class="mt-2 text-sm text-slate-600 opacity-10 contrast-more:opacity-100">We need this to steal your identity.</p>
  </label>
</form>
```

--------------------------------

### Install Headless UI

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/blog/2024-06-21-headless-ui-v2-1/index.mdx

Install the latest version of Headless UI to use the new features.

```sh
npm i @headlessui/react@latest
```

--------------------------------

### Class sorting example

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/editor-setup.mdx

Demonstrates how the Prettier plugin for Tailwind CSS automatically sorts utility classes, showing the state before and after sorting.

```html
<!-- Before -->
<button class="text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800">Submit</button>

<!-- After -->
<button class="bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3">Submit</button>
```

--------------------------------

### Install latest version

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/blog/2024-05-30-prettier-plugin-collapse-whitespace/index.mdx

Install the latest version of prettier-plugin-tailwindcss to get the new improvements.

```sh
npm i prettier-plugin-tailwindcss@latest
```

--------------------------------

### Basic example

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/mask-position.mdx

Example demonstrating various mask position utilities.

```jsx
<div className="grid grid-cols-3 gap-y-8 p-8 text-center font-mono text-xs font-medium text-gray-500 max-sm:items-end max-sm:justify-between max-sm:px-2 dark:text-gray-400">
  <div className="flex flex-col items-center">
    <p className="mb-3">mask-top-left</p>
    <Stripes className="aspect-[1.333] w-32 rounded-lg max-sm:w-24" border>
      <div className="h-full rounded-lg bg-[url(https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=80)] mask-radial-from-70% mask-radial-to-70% bg-cover bg-center mask-size-[50%_66%] mask-top-left mask-no-repeat"></div>
    </Stripes>
  </div>
  <div className="flex flex-col items-center">
    <p className="mb-3">mask-top</p>
    <Stripes className="aspect-[1.333] w-32 rounded-lg max-sm:w-24" border>
      <div className="h-full rounded-lg bg-[url(https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=80)] mask-radial-from-70% mask-radial-to-70% bg-cover bg-center mask-size-[50%_66%] mask-top mask-no-repeat"></div>
    </Stripes>
  </div>
  <div className="flex flex-col items-center">
    <p className="mb-3">mask-top-right</p>
    <Stripes className="aspect-[1.333] w-32 rounded-lg max-sm:w-24" border>
      <div className="h-full rounded-lg bg-[url(https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=80)] mask-radial-from-70% mask-radial-to-70% bg-cover bg-center mask-size-[50%_66%] mask-top-right mask-no-repeat"></div>
    </Stripes>
  </div>
  <div className="flex flex-col items-center">
    <p className="mb-3">mask-left</p>
    <Stripes className="aspect-[1.333] w-32 rounded-lg max-sm:w-24" border>
      <div className="h-full rounded-lg bg-[url(https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=80)] mask-radial-from-70% mask-radial-to-70% bg-cover bg-center mask-size-[50%_66%] mask-left mask-no-repeat"></div>
    </Stripes>
  </div>
  <div className="flex flex-col items-center">
    <p className="mb-3">mask-center</p>
    <Stripes className="aspect-[1.333] w-32 rounded-lg max-sm:w-24" border>
      <div className="h-full rounded-lg bg-[url(https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=80)] mask-radial-from-70% mask-radial-to-70% bg-cover bg-center mask-size-[50%_66%] mask-center mask-no-repeat"></div>
    </Stripes>
  </div>
  <div className="flex flex-col items-center">
    <p className="mb-3">mask-right</p>
    <Stripes className="aspect-[1.333] w-32 rounded-lg max-sm:w-24" border>
      <div className="h-full rounded-lg bg-[url(https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=80)] mask-radial-from-70% mask-radial-to-70% bg-cover bg-center mask-size-[50%_66%] mask-right mask-no-repeat"></div>
    </Stripes>
  </div>
  <div className="flex flex-col items-center">
    <p className="mb-3">mask-bottom-left</p>
    <Stripes className="aspect-[1.333] w-32 rounded-lg max-sm:w-24" border>
      <div className="h-full rounded-lg bg-[url(https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=80)] mask-radial-from-70% mask-radial-to-70% bg-cover bg-center mask-size-[50%_66%] mask-bottom-left mask-no-repeat"></div>
    </Stripes>
  </div>
  <div className="flex flex-col items-center">
    <p className="mb-3">mask-bottom</p>
    <Stripes className="aspect-[1.333] w-32 rounded-lg max-sm:w-24" border>
      <div className="h-full rounded-lg bg-[url(https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=80)] mask-radial-from-70% mask-radial-to-70% bg-cover bg-center mask-size-[50%_66%] mask-bottom mask-no-repeat"></div>
    </Stripes>
  </div>
  <div className="flex flex-col items-center">
    <p className="mb-3">mask-bottom-right</p>
    <Stripes className="aspect-[1.333] w-32 rounded-lg max-sm:w-24" border>

```

--------------------------------

### HTML input example with @tailwindcss/forms

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/blog/tailwindcss-v2/index.mdx

Example of styling a checkbox with utility classes after installing `@tailwindcss/forms`.

```html
<!-- This will be a nice rounded checkbox with an indigo focus ring and an indigo checked state -->
<input
  type="checkbox"
  class="focus:ring-opacity-50 h-4 w-4 rounded border-gray-300 text-indigo-500 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
/>
```

--------------------------------

### Basic example

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/background-color.mdx

Example demonstrating the use of basic background color utilities like bg-blue-500, bg-cyan-500, and bg-pink-500.

```html
<!-- [!code classes:bg-blue-500,bg-cyan-500,bg-pink-500] -->
<button class="bg-blue-500 ...">Button A</button>
<button class="bg-cyan-500 ...">Button B</button>
<button class="bg-pink-500 ...">Button C</button>
```

--------------------------------

### Basic example

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/line-clamp.mdx

Example demonstrating how to use line-clamp-<number> utilities to truncate multi-line text.

```html
<!-- [!code classes:line-clamp-3] -->
<article>
  <time>Mar 10, 2020</time>
  <h2>Boost your conversion rate</h2>
  <p class="line-clamp-3">
    Nulla dolor velit adipisicing duis excepteur esse in duis nostrud occaecat mollit incididunt deserunt sunt. Ut ut
    sunt laborum ex occaecat eu tempor labore enim adipisicing minim ad. Est in quis eu dolore occaecat excepteur fugiat
    dolore nisi aliqua fugiat enim ut cillum. Labore enim duis nostrud eu. Est ut eiusmod consequat irure quis deserunt
    ex. Enim laboris dolor magna pariatur. Dolor et ad sint voluptate sunt elit mollit officia ad enim sit consectetur
    enim.
  </p>
  <div>
    <img src="/img/lindsay.jpg" />
    Lindsay Walton
  </div>
</article>
```

--------------------------------

### Configuring theme variables with a prefix

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/upgrade-guide.mdx

CSS example showing how to configure theme variables without a prefix, even when using a prefix for utilities.

```css
@import "tailwindcss" prefix(tw);

@theme {
  --font-display: "Satoshi", "sans-serif";

  --breakpoint-3xl: 120rem;

  --color-avocado-100: oklch(0.99 0 0);
  --color-avocado-200: oklch(0.98 0.04 113.22);
  --color-avocado-300: oklch(0.94 0.11 115.03);

  /* ... */
}
```

--------------------------------

### Responsive Grid Example HTML

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/styling-with-utility-classes.mdx

Demonstrates how to apply responsive grid columns using the `sm:` breakpoint prefix in HTML.

```html
<div class="grid grid-cols-2 sm:grid-cols-3">
  <!-- ... -->
</div>
```

--------------------------------

### MDX Post Example

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/blog/building-the-tailwind-blog/index.mdx

An example of an MDX post demonstrating how React components can be embedded within Markdown.

```md
# My first MDX post

MDX is a really cool authoring format because it lets
you embed React components right in your markdown:

<MyComponent myProp={5} />

How cool is that?
```

--------------------------------

### Install dependencies

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/README.md

Command to install project dependencies using pnpm.

```bash
pnpm install
```

--------------------------------

### Basic example

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/text-indent.mdx

Example demonstrating the use of indent-<number> utilities.

```html
<!-- [!code classes:indent-8] -->
<p class="indent-8">So I started to walk into the water...</p>
```

--------------------------------

### Basic example

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/rotate.mdx

Example demonstrating how to use rotate utilities to rotate elements by degrees.

```html
<!-- [!code classes:rotate-45,rotate-90,rotate-210] -->
<img class="rotate-45 ..." src="/img/mountains.jpg" />
<img class="rotate-90 ..." src="/img/mountains.jpg" />
<img class="rotate-210 ..." src="/img/mountains.jpg" />
```

--------------------------------

### Flow Root

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/display.mdx

Example of using the `flow-root` utility.

```html
<!-- [!code classes:flow-root] -->
<div class="p-4">
  <div class="flow-root ...">
    <div class="my-4 ...">Well, let me tell you something, ...</div>
  </div>
  <div class="flow-root ...">
    <div class="my-4 ...">Sure, go ahead, laugh if you want...</div>
  </div>
</div>
```

--------------------------------

### Min Inline Size Utilities Example

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/min-inline-size.mdx

Demonstrates various min-inline-size utilities to set a fixed minimum inline size.

```html
<div class="inline-40 ...">
  <div class="min-inline-lg ...">min-inline-lg</div>
  <div class="min-inline-md ...">min-inline-md</div>
  <div class="min-inline-sm ...">min-inline-sm</div>
  <div class="min-inline-xs ...">min-inline-xs</div>
  <div class="min-inline-2xs ...">min-inline-2xs</div>
  <div class="min-inline-3xs ...">min-inline-3xs</div>
</div>
```

--------------------------------

### Basic example

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/transition-timing-function.mdx

Example demonstrating the use of `ease-in`, `ease-out`, and `ease-in-out` utilities to control the easing curve of an element's transition.

```html
<!-- [!code classes:ease-in,ease-out,ease-in-out] -->
<button class="duration-300 ease-in ...">Button A</button>
<button class="duration-300 ease-out ...">Button B</button>
<button class="duration-300 ease-in-out ...">Button C</button>
```

--------------------------------

### Using theme() function with opacity

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/blog/tailwindcss-v3-1/index.mdx

Example demonstrating how to adjust color opacity using a slash syntax with the `theme()` function.

```css
.select2-dropdown {
  border-radius: theme(borderRadius.lg);
  background-color: theme(colors.gray.100 / 50%);
  color: theme(colors.gray.900);
}
/* ... */
```

--------------------------------

### Start

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/place-items.mdx

Use `place-items-start` to place grid items on the start of their grid areas on both axes:

```html
<!-- [!code classes:place-items-start] -->
<div class="grid grid-cols-3 place-items-start gap-4 ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
  <div>04</div>
  <div>05</div>
  <div>06</div>
</div>
```

--------------------------------

### Styling an unstyled list

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/preflight.mdx

Example of how to apply list-style utilities to an unstyled list.

```html
<ul class="list-inside list-disc">
  <li>One</li>
  <li>Two</li>
  <li>Three</li>
</ul>
```

--------------------------------

### Using pbs- utility

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/padding.mdx

Example of using the `pbs-` (padding-block-start) utility.

```html
<!-- [!code classes:pbs-8] -->
<div class="pbs-8 ...">pbs-8</div>
```

--------------------------------

### Basic border spacing example

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/blog/tailwindcss-v3-1/index.mdx

Demonstrates the use of `border-separate` and `border-spacing-2` classes to create space between table borders.

```html
<!-- [!code word:border-spacing-2] -->
<table class="border-separate border-spacing-2 ...">
  <thead>
    <tr>
      <th class="border border-slate-300 ...">State</th>
      <th class="border border-slate-300 ...">City</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-slate-300 ...">Indiana</td>
      <td class="border border-slate-300 ...">Indianapolis</td>
    </tr>
    <!-- ... -->
  </tbody>
</table>
```

--------------------------------

### Using theme() function in CSS

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/blog/tailwindcss-v3-1/index.mdx

Example of using the `theme()` function to retrieve values from the Tailwind config.

```css
.select2-dropdown {
  border-radius: theme(borderRadius.lg);
  background-color: theme(colors.gray.100);
  color: theme(colors.gray.900);
}
/* ... */
```

--------------------------------

### Basic example (JSX)

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/font-size.mdx

JSX code demonstrating different font sizes.

```jsx
<div className="flex flex-col gap-8">
      <div>
        <span className="mb-3 font-mono text-xs font-medium text-gray-500 dark:text-gray-400">text-sm</span>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
          The quick brown fox jumps over the lazy dog.
        </p>
      </div>
      <div>
        <span className="mb-3 font-mono text-xs font-medium text-gray-500 dark:text-gray-400">text-base</span>
        <p className="text-base font-medium text-gray-900 dark:text-gray-200">
          The quick brown fox jumps over the lazy dog.
        </p>
      </div>
      <div>
        <span className="mb-3 font-mono text-xs font-medium text-gray-500 dark:text-gray-400">text-lg</span>
        <p className="text-lg font-medium text-gray-900 dark:text-gray-200">
          The quick brown fox jumps over the lazy dog.
        </p>
      </div>
      <div>
        <span className="mb-3 font-mono text-xs font-medium text-gray-500 dark:text-gray-400">text-xl</span>
        <p className="text-xl font-medium text-gray-900 dark:text-gray-200">
          The quick brown fox jumps over the lazy dog.
        </p>
      </div>
      <div>
        <span className="mb-3 font-mono text-xs font-medium text-gray-500 dark:text-gray-400">text-2xl</span>
        <p className="text-2xl font-medium text-gray-900 dark:text-gray-200">
          The quick brown fox jumps over the lazy dog.
        </p>
      </div>
    </div>
```

--------------------------------

### Transitioning individual transform properties

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/upgrade-guide.mdx

To fix this, include the individual properties in the list. For example, if you want to transition changes when using `opacity-*` and `scale-*` utilities you should use `transition-[opacity,scale]` instead.

```HTML
<!-- [!code --:2] -->
<button class="transition-[opacity,transform] hover:scale-150"></button>
<!-- [!code ++:2] -->
<button class="transition-[opacity,scale] hover:scale-150"></button>
```

--------------------------------

### Adding explicit ring color for v4

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/upgrade-guide.mdx

HTML example showing how to add `ring-blue-500` to preserve v3 default ring color behavior.

```html
<button class="focus:ring-3 focus:ring-blue-500 ...">
  <!-- ... -->
</button>
```

--------------------------------

### Basic example

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/outline-offset.mdx

Example showing how to use `outline-offset-0`, `outline-offset-2`, and `outline-offset-4` utilities to control the outline offset.

```html
<!-- [!code classes:outline-offset-0,outline-offset-2,outline-offset-4] -->
<button class="outline-2 outline-offset-0 ...">Button A</button>
<button class="outline-2 outline-offset-2 ...">Button B</button>
<button class="outline-2 outline-offset-4 ...">Button C</button>
```

--------------------------------

### Adding a Radial Mask

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/mask-image.mdx

Example demonstrating how to apply a radial gradient mask with custom size, start, and position.

```html
<!-- [!code classes:mask-radial-from-75%] -->
<div class="flex items-center gap-4">
  <img class="mask-radial-[100%_100%] mask-radial-from-75% mask-radial-at-left ..." src="/img/keyboard.png" />
  <div class="font-medium">
    <p class="font-mono text-xs text-blue-500 uppercase dark:text-blue-400">Speed</p>
    <p class="mt-2 text-base text-gray-700 dark:text-gray-300">Built for power users</p>
    <p class="mt-1 text-sm leading-relaxed text-balance text-gray-500">
      Work faster than ever with customizable keyboard shortcuts
    </p>
  </div>
</div>
```

--------------------------------

### CSS Imports in main.css

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/blog/tailwindcss-v3-1/index.mdx

Example of using CSS imports in main.css, including a custom theme file.

```css
@import "tailwindcss/base";
@import "./select2-theme.css";
@import "tailwindcss/components";
@import "tailwindcss/utilities";
```

--------------------------------

### Example WebVTT Transcript

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/blog/2025-05-14-compass-course-starter-kit/index.mdx

A WebVTT file demonstrating speaker information and timestamps for an interview transcript.

```txt
WEBVTT

00:00.000 --> 00:20.000
<v Tom Harris>Hello fellow passengers, welcome to the Compass podcast. Today, we have a special guest, Annie King. She's the author of The Inevitable You: How to Embrace Your Path and Succeed with Relentless Precision. Annie, welcome to the show.

00:20.000 --> 00:35.000
<v Annie King>Thank you! I'm so happy to be here. And thanks for sending me the questions in advance — I'm really excited to share some of the ideas from the book with your viewers. I think we're going to have a lot of fun unpacking what it means to truly embrace your path.

00:35.000 --> 00:45.000
<v Tom Harris>Absolutely! I want to get into your book, but first I have to ask — what was it like growing up in a household that treated organization almost like...a sport?
```

--------------------------------

### Example of arbitrary values for variants

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/blog/tailwindcss-v3-1/index.mdx

Demonstrates using arbitrary values within variants to style specific child elements.

```html
<!-- [!code word:hover:[&>li:nth-child(2)>div>p:first-child]:text-indigo-500] -->
<ul
  role="list"
  class="space-y-4 [&>*]:rounded-lg [&>*]:bg-white [&>*]:p-4 [&>*]:shadow hover:[&>li:nth-child(2)>div>p:first-child]:text-indigo-500"
>
  <!-- ... -->
  <li class="flex">
    <img class="h-10 w-10 rounded-full" src="..." alt="" />
    <div class="ml-3 overflow-hidden">
      <p class="text-sm font-medium text-slate-900">Floyd Miles</p>
      <p class="truncate text-sm text-slate-500">floyd.miles@example.com</p>
    </div>
  </li>
  <!-- ... -->
</ul>
```

--------------------------------

### JSON Response

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/blog/2022-12-15-protocol-api-documentation-template/index.mdx

Example JSON response after successfully creating a message.

```json
{
  "id": "gWqY86BMFRiH5o11",
  "conversation_id": "xgQQXg3hrtjh7AvZ",
  "message": "You're what the French call 'les incompetents.'",
  "reactions": [],
  "created_at": 692233200
}
```

--------------------------------

### Basic example

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/filter-sepia.mdx

Example demonstrating how to use `sepia`, `sepia-50`, and `sepia-0` utilities to apply sepia filters to images.

```html
<!-- [!code classes:sepia-0,sepia-50,sepia] -->
<img class="sepia-0" src="/img/mountains.jpg" />
<img class="sepia-50" src="/img/mountains.jpg" />
<img class="sepia" src="/img/mountains.jpg" />
```

--------------------------------

### Basic Case Study Example

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/blog/2023-08-07-meet-studio-our-new-agency-template/index.mdx

An example of a basic case study authored in MDX, including common metadata and support for custom components mixed into the content.

```mdx
import logo from "@/images/clients/phobia/logomark-dark.svg";
import imageHero from "./hero.jpg";
import imageJennyWilson from "./jenny-wilson.jpeg";

export const caseStudy = {
  client: "Phobia",
  title: "Overcome your fears, find your match",
  description:
    "Find love in the face of fear 

— Phobia is a dating app that matches users based on their mutual phobias so they can be scared together.",
  summary: [
    "Find love in the face of fear 

— Phobia is a dating app that matches users based on their mutual phobias so they can be scared together.",
    "We worked with Phobia to develop a new onboarding flow. A user is shown pictures of common phobias and we use the microphone to detect which ones make them scream, feeding the results into the matching algorithm.",
  ],
  logo,
  image: { src: imageHero },
  date: "2022-06",
  service: "App development",
  testimonial: {
    author: { name: "Jenny Wilson", role: "CPO of Phobia" },
    content:
      "The team at Studio went above and beyond with our onboarding, even finding a way to access the user’s microphone without triggering one of those annoying permission dialogs.",
  },
};

export const metadata = {
  title: `${caseStudy.client} Case Study`,
  description: caseStudy.description,
};

## Overview

Noticing incredibly high churn, the team at Phobia came to the conclusion that, instead of having a
fundamentally flawed business idea, they needed to improve their onboarding process.

Previously users selected their phobias manually but this led to some users selecting things they
weren’t actually afraid of to increase their matches.

To combat this, we developed a system that displays a slideshow of common phobias during
onboarding. We then use malware to surreptitiously access their microphone and detect when they
have audible reactions. We measure the pitch, volume and duration of their screams and feed that
information to the matching algorithm.

The next phase is a VR version of the onboarding flow where users are subjected to a series of
scenarios that will determine their fears. We are currently developing the first scenario, working
title: “Jumping out of a plane full of spiders”.

## What we did

<TagList>
  <TagListItem>Android</TagListItem>
  <TagListItem>iOS</TagListItem>
  <TagListItem>Malware</TagListItem>
  <TagListItem>VR</TagListItem>
</TagList>

<Blockquote author={{ name: "Jenny Wilson", role: "CPO of Phobia" }} image={{ src: imageJennyWilson }}>
  The team at Studio went above and beyond with our onboarding, even finding a way to access the user’s microphone
  without triggering one of those annoying permission dialogs.
</Blockquote>

<StatList>
  <StatListItem value="20%" label="Churn rate" />
  <StatListItem value="5x" label="Uninstalls" />
  <StatListItem value="2.3" label="App store rating" />
  <StatListItem value="8" label="Pending lawsuits" />
</StatList>
```

--------------------------------

### Arbitrary values with theme() and opacity

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/blog/tailwindcss-v3-1/index.mdx

Example of using `theme()` function with opacity inside arbitrary values for custom gradients.

```html
<div class="bg-[image:linear-gradient(to_right,theme(colors.red.500)_75%,theme(colors.red.500/25%))]">
  <!-- ... -->
</div>
```

--------------------------------

### Install Standalone CLI

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/blog/standalone-cli/index.mdx

Example commands to download and make the standalone CLI executable for macOS arm64.

```sh
# Example for macOS arm64
curl -sLO https://github.com/tailwindlabs/tailwindcss/releases/latest/download/tailwindcss-macos-arm64
chmod +x tailwindcss-macos-arm64
mv tailwindcss-macos-arm64 tailwindcss
```

--------------------------------

### Basic example

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/backdrop-filter-invert.mdx

Example demonstrating the use of backdrop-invert utilities.

```html
<!-- [!code classes:backdrop-invert-0,backdrop-invert-65,backdrop-invert] -->
<div class="bg-[url(/img/mountains.jpg)]">
  <div class="bg-white/30 backdrop-invert-0 ..."></div>
</div>
<div class="bg-[url(/img/mountains.jpg)]">
  <div class="bg-white/30 backdrop-invert-65 ..."></div>
</div>
<div class="bg-[url(/img/mountains.jpg)]">
  <div class="bg-white/30 backdrop-invert ..."></div>
</div>
```

--------------------------------

### Generated CSS variables with prefix

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/upgrade-guide.mdx

Example of generated CSS variables including a prefix to avoid conflicts.

```css
:root {
  --tw-font-display: "Satoshi", "sans-serif";

  --tw-breakpoint-3xl: 120rem;

  --tw-color-avocado-100: oklch(0.99 0 0);
  --tw-color-avocado-200: oklch(0.98 0.04 113.22);
  --tw-color-avocado-300: oklch(0.94 0.11 115.03);

  /* ... */
}
```

--------------------------------

### Basic example (HTML)

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/line-height.mdx

HTML markup for the basic line-height example.

```html
<!-- [!code classes:text-base/6,text-base/7,text-base/8] -->
<p class="text-base/6 ...">So I started to walk into the water...</p>
<p class="text-base/7 ...">So I started to walk into the water...</p>
<p class="text-base/8 ...">So I started to walk into the water...</p>
```

--------------------------------

### tailwind.config.js

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/blog/tailwindcss-v3-1/index.mdx

Example of using the `addVariant` API to create a custom variant in `tailwind.config.js`.

```js
const plugin = require("tailwindcss/plugin");

module.exports = {
  // ...
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("third", "&:nth-child(3)");
    }),
  ],
};
```

--------------------------------

### HTML with arbitrary variant for @supports

Source: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/blog/tailwindcss-v3-1/index.mdx

Example of using an arbitrary variant to apply styles based on a CSS `@supports` query.

```html
<div
  class="bg-white [@supports(backdrop-filter:blur(0))]:bg-white/50 [@supports(backdrop-filter:blur(0))]:backdrop-blur"
>
  <!-- ... -->
</div>
```
