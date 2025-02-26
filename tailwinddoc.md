================================================
File: src/docs/aspect-ratio.mdx
================================================
import { ApiTable } from "@/components/api-table.tsx";
import { Example } from "@/components/example.tsx";
import { Figure } from "@/components/figure.tsx";
import { UsingACustomValue, ResponsiveDesign, CustomizingYourTheme } from "@/components/content.tsx";

export const title = "aspect-ratio";
export const description = "Utilities for controlling the aspect ratio of an element.";

<ApiTable
  rows={[
    ["aspect-<ratio>", "aspect-ratio: <ratio>;"],
    ["aspect-square", "aspect-ratio: 1 / 1;"],
    ["aspect-video", "aspect-ratio: var(--aspect-ratio-video); /* 16 / 9 */"],
    ["aspect-auto", "aspect-ratio: auto;"],
    ["aspect-(<custom-property>)", "aspect-ratio: var(<custom-property>);"],
    ["aspect-[<value>]", "aspect-ratio: <value>;"],
  ]}
/>

## Examples

### Basic example

Use <code>aspect-<var>&lt;ratio&gt;</var></code> utilities like `aspect-3/2` to give an element a specific aspect ratio:

<Figure desktopHint="Resize the example to see the expected behavior">

<Example resizable>
  {
    <img
      className="mx-auto aspect-3/2 w-full max-w-sm rounded-lg object-cover"
      src="https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80"
    />
  }
</Example>

```html
<!-- [!code classes:aspect-3/2] -->
<img class="aspect-3/2 object-cover ..." src="/img/villas.jpg" />
```

</Figure>

### Using a video aspect ratio

Use the `aspect-video` utility to give a video element a 16 / 9 aspect ratio:

<Figure desktopHint="Resize the example to see the expected behavior">

<Example resizable>
  {
    <iframe
      className="aspect-video w-full rounded-lg"
      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  }
</Example>

```html
<!-- [!code classes:aspect-video] -->
<iframe class="aspect-video ..." src="https://www.youtube.com/embed/dQw4w9WgXcQ"></iframe>
```

</Figure>

### Using a custom value

<UsingACustomValue
  element="img"
  elementAttributes={{ src: "/img/villas.jpg" }}
  utility="aspect"
  name="aspect ratio"
  value="calc(4*3+1)/3"
  variable="aspect-ratio"
/>

### Responsive design

<ResponsiveDesign
  element="iframe"
  elementAttributes={{ src: "https://www.youtube.com/embed/dQw4w9WgXcQ" }}
  property="aspect-ratio"
  defaultClass="aspect-video"
  featuredClass="aspect-square"
/>

## Customizing your theme

<CustomizingYourTheme
  element="iframe"
  elementAttributes={{ src: "https://www.youtube.com/embed/dQw4w9WgXcQ" }}
  utility="aspect"
  name="aspect ratio"
  customName="retro"
  customValue="4 / 3"
/>


================================================
File: src/docs/box-decoration-break.mdx
================================================
import { ApiTable } from "@/components/api-table.tsx";
import { Example } from "@/components/example.tsx";
import { Figure } from "@/components/figure.tsx";
import { ResponsiveDesign } from "@/components/content.tsx";

export const title = "box-decoration-break";
export const description =
  "Utilities for controlling how element fragments should be rendered across multiple lines, columns, or pages.";

<ApiTable
  rows={[
    ["box-decoration-clone", "box-decoration-break: clone"],
    ["box-decoration-slice", "box-decoration-break: slice"],
  ]}
/>

## Examples

### Basic example

Use the `box-decoration-slice` and `box-decoration-clone` utilities to control whether properties like background, border, border-image, box-shadow, clip-path, margin, and padding should be rendered as if the element were one continuous fragment, or distinct blocks:

<Figure>

<Example>
  {
    <div className="grid grid-cols-1 gap-10 px-10 font-mono font-bold sm:grid-cols-2">
      <div className="flex flex-col">
        <p className="mb-3 font-mono text-sm font-medium text-gray-500 dark:text-gray-400">box-decoration-slice</p>
        <div className="font-sans text-5xl leading-none font-extrabold tracking-tight">
          <span className="bg-linear-to-r from-indigo-600 to-pink-500 box-decoration-slice px-2 leading-[3.5rem] text-white">
            Hello
            <br />
            World
          </span>
        </div>
      </div>
      <div className="flex flex-col">
        <p className="mb-3 font-mono text-sm font-medium text-gray-500 dark:text-gray-400">box-decoration-clone</p>
        <div className="font-sans text-5xl leading-none font-extrabold tracking-tight">
          <span className="bg-linear-to-r from-indigo-600 to-pink-500 box-decoration-clone px-2 leading-[3.5rem] text-white">
            Hello
            <br />
            World
          </span>
        </div>
      </div>
    </div>
  }
</Example>

{/* prettier-ignore */}
```html
<!-- [!code classes:box-decoration-slice,box-decoration-clone] -->
<span class="box-decoration-slice bg-linear-to-r from-indigo-600 to-pink-500 px-2 text-white ...">
  Hello<br />World
</span>
<span class="box-decoration-clone bg-linear-to-r from-indigo-600 to-pink-500 px-2 text-white ...">
  Hello<br />World
</span>
```

</Figure>

### Responsive design

<ResponsiveDesign
  property="box-decoration-break"
  defaultClass="box-decoration-clone"
  featuredClass="box-decoration-slice"
/>


================================================
File: src/docs/break-after.mdx
================================================
import { ApiTable } from "@/components/api-table.tsx";
import { ResponsiveDesign } from "@/components/content.tsx";

export const title = "break-after";
export const description = "Utilities for controlling how a column or page should break after an element.";

<ApiTable
  rows={[
    ["break-after-auto", "break-after: auto;"],
    ["break-after-avoid", "break-after: avoid;"],
    ["break-after-all", "break-after: all;"],
    ["break-after-avoid-page", "break-after: avoid-page;"],
    ["break-after-page", "break-after: page;"],
    ["break-after-left", "break-after: left;"],
    ["break-after-right", "break-after: right;"],
    ["break-after-column", "break-after: column;"],
  ]}
/>

## Examples

### Basic example

Use utilities like `break-after-column` and `break-after-page` to control how a column or page break should behave after an element:

```html
<!-- [!code classes:break-after-column] -->
<div class="columns-2">
  <p>Well, let me tell you something, ...</p>
  <p class="break-after-column">Sure, go ahead, laugh...</p>
  <p>Maybe we can live without...</p>
  <p>Look. If you think this is...</p>
</div>
```

### Responsive design

<ResponsiveDesign property="break-after" defaultClass="break-after-column" featuredClass="break-after-auto" />


================================================
File: src/docs/break-before.mdx
================================================
import { ApiTable } from "@/components/api-table.tsx";
import { ResponsiveDesign } from "@/components/content.tsx";

export const title = "break-before";
export const description = "Utilities for controlling how a column or page should break before an element.";

<ApiTable
  rows={[
    ["break-before-auto", "break-before: auto;"],
    ["break-before-avoid", "break-before: avoid;"],
    ["break-before-all", "break-before: all;"],
    ["break-before-avoid-page", "break-before: avoid-page;"],
    ["break-before-page", "break-before: page;"],
    ["break-before-left", "break-before: left;"],
    ["break-before-right", "break-before: right;"],
    ["break-before-column", "break-before: column;"],
  ]}
/>

## Examples

### Basic example

Use utilities like `break-before-column` and `break-before-page` to control how a column or page break should behave before an element:

```html
<!-- [!code classes:break-before-column] -->
<div class="columns-2">
  <p>Well, let me tell you something, ...</p>
  <p class="break-before-column">Sure, go ahead, laugh...</p>
  <p>Maybe we can live without...</p>
  <p>Look. If you think this is...</p>
</div>
```

### Responsive design

<ResponsiveDesign property="break-before" defaultClass="break-before-column" featuredClass="break-before-auto" />


================================================
File: src/docs/break-inside.mdx
================================================
import { ApiTable } from "@/components/api-table.tsx";
import { ResponsiveDesign } from "@/components/content.tsx";

export const title = "break-inside";
export const description = "Utilities for controlling how a column or page should break within an element.";

<ApiTable
  rows={[
    ["break-inside-auto", "break-inside: auto;"],
    ["break-inside-avoid", "break-inside: avoid;"],
    ["break-inside-avoid-page", "break-inside: avoid-page;"],
    ["break-inside-avoid-column", "break-inside: avoid-column;"],
  ]}
/>

## Examples

### Basic example

Use utilities like `break-inside-column` and `break-inside-avoid-page` to control how a column or page break should behave within an element:

```html
<!-- [!code classes:break-inside-avoid-column] -->
<div class="columns-2">
  <p>Well, let me tell you something, ...</p>
  <p class="break-inside-avoid-column">Sure, go ahead, laugh...</p>
  <p>Maybe we can live without...</p>
  <p>Look. If you think this is...</p>
</div>
```

### Responsive design

<ResponsiveDesign property="break-inside" defaultClass="break-inside-avoid-column" featuredClass="break-inside-auto" />


================================================
File: src/docs/caret-color.mdx
================================================
import { ApiTable } from "@/components/api-table.tsx";
import { CustomizingYourThemeColors } from "@/components/content.tsx";
import { ResponsiveDesign } from "@/components/content.tsx";
import { Example } from "@/components/example.tsx";
import { Figure } from "@/components/figure.tsx";
import { UsingACustomValue } from "@/components/content.tsx";
import colors from "./utils/colors";

export const title = "caret-color";
export const description = "Utilities for controlling the color of the text input cursor.";

<ApiTable
  rows={[
    ["caret-inherit", "caret-color: inherit;"],
    ["caret-current", "caret-color: currentColor;"],
    ["caret-transparent", "caret-color: transparent;"],
    ...Object.entries(colors).map(([name, value]) => [
      `caret-${name}`,
      `caret-color: var(--color-${name}); /* ${value} */`,
    ]),
    ["caret-<custom-property>", "caret-color: var(<custom-property>);"],
    ["caret-[<value>]", "caret-color: <value>;"],
  ]}
/>
## Examples

### Basic example

Use utilities like `caret-rose-500` and `caret-lime-600` to change the color of the text input cursor:

<Figure hint="Focus the textarea to see the new caret color">

<Example>
  {
    <div className="flex w-full items-center justify-center">
      <textarea
        className="w-80 rounded-md p-2 text-sm caret-pink-500 ring-1 ring-gray-900/10 focus:ring-2 focus:ring-pink-500 focus:outline-none dark:bg-gray-950/25 dark:ring-1 dark:ring-white/5 dark:focus:bg-gray-950/10 dark:focus:ring-2 dark:focus:ring-pink-500"
        rows="2"
      />
    </div>
  }
</Example>

```html
<!-- [!code classes:caret-pink-500] -->
<textarea class="caret-pink-500 ..."></textarea>
```

</Figure>

### Using a custom value

<UsingACustomValue element="textarea" utility="caret" value="#50d71e" name="caret color" variable="caret-color" />

### Responsive design

<ResponsiveDesign
  element="textarea"
  property="caret-color"
  defaultClass="caret-rose-500"
  featuredClass="caret-lime-600"
/>

## Customizing your theme

<CustomizingYourThemeColors element="textarea" utility="caret" />


================================================
File: src/docs/color-scheme.mdx
================================================
import { ApiTable } from "@/components/api-table.tsx";
import { Example } from "@/components/example.tsx";
import { Figure } from "@/components/figure.tsx";
import { TargetingSpecificStates } from "@/components/content.tsx";

export const title = "color-scheme";
export const description = "Utilities for controlling the color scheme of an element.";

<ApiTable
  rows={[
    ["scheme-normal", "color-scheme: normal;"],
    ["scheme-dark", "color-scheme: dark;"],
    ["scheme-light", "color-scheme: light;"],
    ["scheme-light-dark", "color-scheme: light dark;"],
    ["scheme-only-dark", "color-scheme: only dark;"],
    ["scheme-only-light", "color-scheme: only light;"],
  ]}
/>

## Examples

### Basic example

Use utilities like `scheme-light` and `scheme-light-dark` to control how element should be rendered:

<Figure hint="Try switching your system color scheme to see the difference">

<Example>
  {
    <div className="flex justify-between gap-8 text-sm max-sm:flex-col">
      <div className="flex flex-grow flex-col items-center gap-3 text-center scheme-light">
        <p className="font-mono font-medium text-gray-500 dark:text-gray-400">scheme-light</p>
        <input
          type="date"
          className="w-full rounded-lg border border-gray-950/10 bg-[Field] px-3 py-2 text-[FieldText] dark:border-white/10"
        />
      </div>
      <div className="flex flex-grow flex-col items-center gap-3 text-center scheme-dark">
        <p className="font-medium text-gray-500 dark:text-gray-400">scheme-dark</p>
        <input
          type="date"
          className="w-full rounded-lg border border-gray-950/10 bg-[Field] px-3 py-2 text-[FieldText] dark:border-white/10"
        />
      </div>
      <div className="flex flex-grow flex-col items-center gap-3 text-center scheme-light-dark">
        <p className="font-medium text-gray-500 dark:text-gray-400">scheme-light-dark</p>
        <input
          type="date"
          className="w-full rounded-lg border border-gray-950/10 bg-[Field] px-3 py-2 text-[FieldText] dark:border-white/10"
        />
      </div>
    </div>
  }
</Example>

```html
<!-- [!code classes:scheme-light-dark,scheme-light,scheme-dark] -->
<div class="scheme-light ...">
  <input type="date" />
</div>

<div class="scheme-dark ...">
  <input type="date" />
</div>

<div class="scheme-light-dark ...">
  <input type="date" />
</div>
```

</Figure>

### Applying in dark mode

<TargetingSpecificStates
  element="html"
  property="color-scheme"
  variant="dark"
  defaultClass="scheme-light"
  featuredClass="scheme-dark"
/>


================================================
File: src/docs/field-sizing.mdx
================================================
import { ApiTable } from "@/components/api-table.tsx";
import { Example } from "@/components/example.tsx";
import { Figure } from "@/components/figure.tsx";
import { ResponsiveDesign } from "@/components/content.tsx";

export const title = "field-sizing";
export const description = "Utilities for controlling the sizing of form controls.";

<ApiTable
  rows={[
    ["field-sizing-fixed", "field-sizing: fixed;"],
    ["field-sizing-content", "field-sizing: content;"],
  ]}
/>

## Examples

### Sizing based on content

Use the `field-sizing-content` utility to allow a form control to adjust it's size based on the content:

<Figure hint="Type in the input below to see the size change">

<Example>
  {
    <textarea
      rows="2"
      defaultValue="Latex Salesman, Vanderlay Industries"
      className="mx-auto block field-sizing-content rounded-md p-2 text-sm text-gray-950 outline-1 outline-gray-900/10 focus:outline-2 focus:outline-gray-900 dark:bg-gray-950/25 dark:text-white dark:outline-1 dark:outline-white/5 dark:focus:outline-white/20"
    />
  }
</Example>

```html
<!-- [!code classes:field-sizing-content] -->
<textarea class="field-sizing-content ..." rows="2">
  Latex Salesman, Vanderlay Industries
</textarea>
```

</Figure>

### Using a fixed size

Use the `field-sizing-fixed` utility to make a from control use a fixed size:

<Figure hint="Type in the input below to see the size remain the same">

<Example>
  {
    <textarea
      rows="2"
      defaultValue="Latex Salesman, Vanderlay Industries"
      className="mx-auto block field-sizing-fixed w-80 rounded-md p-2 text-sm text-gray-950 outline-1 outline-gray-900/10 focus:outline-2 focus:outline-gray-900 dark:bg-gray-950/25 dark:text-white dark:outline-1 dark:outline-white/5 dark:focus:outline-white/20"
    />
  }
</Example>

```html
<!-- [!code classes:field-sizing-fixed] -->
<textarea class="field-sizing-fixed w-80 ..." rows="2">
  Latex Salesman, Vanderlay Industries
</textarea>
```

</Figure>

### Responsive design

<ResponsiveDesign
  element="input"
  property="field-sizing"
  defaultClass="field-sizing-content"
  featuredClass="field-sizing-fixed"
/>


================================================
File: src/docs/flex-shrink.mdx
================================================
import { ApiTable } from "@/components/api-table.tsx";
import { Example } from "@/components/example.tsx";
import { Figure } from "@/components/figure.tsx";
import { ResponsiveDesign, UsingACustomValue } from "@/components/content.tsx";
import { Stripes } from "@/components/stripes.tsx";

export const title = "flex-shrink";
export const description = "Utilities for controlling how flex items shrink.";

<ApiTable
  rows={[
    ["shrink", "flex-shrink: 1;"],
    ["shrink-<number>", "flex-shrink: <number>;"],
    ["shrink-[<value>]", "flex-shrink: <value>;"],
    ["shrink-(<custom-property>)", "flex-shrink: var(<custom-property>);"],
  ]}
/>

## Examples

### Allowing flex items to shrink

Use `shrink` to allow a flex item to shrink if needed:

<Figure>

<Example resizable>
  {
    <div className="grid grid-cols-1">
      <Stripes border className="col-start-1 row-start-1 rounded-lg" />
      <div className="col-start-1 row-start-1 flex gap-4 rounded-lg font-mono text-sm leading-6 font-bold text-white">
        <div className="flex h-14 w-14 flex-none items-center justify-center rounded-lg bg-sky-300 p-4 dark:bg-sky-800 dark:text-sky-400">
          01
        </div>
        <div className="flex h-14 w-64 shrink items-center justify-center rounded-lg bg-sky-500 p-4">02</div>
        <div className="hidden h-14 w-14 flex-none items-center justify-center rounded-lg bg-sky-300 p-4 sm:flex dark:bg-sky-800 dark:text-sky-400">
          03
        </div>
      </div>
    </div>
  }
</Example>

```html
<!-- [!code classes:shrink] -->
<div class="flex ...">
  <div class="h-14 w-14 flex-none ...">01</div>
  <div class="h-14 w-64 shrink ...">02</div>
  <div class="h-14 w-14 flex-none ...">03</div>
</div>
```

</Figure>

### Preventing items from shrinking

Use `shrink-0` to prevent a flex item from shrinking:

<Figure>

<Example resizable>
  {
    <div className="grid grid-cols-1">
      <Stripes border className="col-start-1 row-start-1 rounded-lg" />
      <div className="col-start-1 row-start-1 flex gap-4 rounded-lg font-mono text-sm leading-6 font-bold text-white">
        <div className="flex flex-1 items-center justify-center rounded-lg bg-blue-300 p-4 dark:bg-blue-800 dark:text-blue-500">
          01
        </div>
        <div className="flex w-16 shrink-0 items-center justify-center rounded-lg bg-blue-500 p-4 sm:w-64">02</div>
        <div className="hidden flex-1 items-center justify-center rounded-lg bg-blue-300 p-4 sm:flex dark:bg-blue-800 dark:text-blue-500">
          03
        </div>
      </div>
    </div>
  }
</Example>

```html
<!-- [!code classes:shrink-0] -->
<div class="flex ...">
  <div class="h-16 flex-1 ...">01</div>
  <div class="h-16 w-32 shrink-0 ...">02</div>
  <div class="h-16 flex-1 ...">03</div>
</div>
```

</Figure>

### Using a custom value

<UsingACustomValue utility="shrink" name="flex shrink factor" value="calc(100vw-var(--sidebar))" />

### Responsive design

<ResponsiveDesign property="flex-shrink" defaultClass="shrink" featuredClass="shrink-0" />


================================================
File: src/docs/font-smoothing.mdx
================================================
import { ApiTable } from "@/components/api-table.tsx";
import { Example } from "@/components/example.tsx";
import { Figure } from "@/components/figure.tsx";
import { ResponsiveDesign } from "@/components/content.tsx";

export const title = "font-smoothing";
export const description = "Utilities for controlling the font smoothing of an element.";

<ApiTable
  rows={[
    ["antialiased", "-webkit-font-smoothing: antialiased;\n-moz-osx-font-smoothing: grayscale;"],
    ["subpixel-antialiased", "-webkit-font-smoothing: auto;\n-moz-osx-font-smoothing: auto;"],
  ]}
/>

## Examples

### Grayscale antialiasing

Use the `antialiased` utility to render text using grayscale antialiasing:

<Figure>

<Example>
  {
    <p className="text-center text-lg font-medium text-gray-900 antialiased dark:text-gray-200">
      The quick brown fox jumps over the lazy dog.
    </p>
  }
</Example>

```html
<!-- [!code classes:antialiased] -->
<p class="antialiased ...">The quick brown fox ...</p>
```

</Figure>

### Subpixel antialiasing

Use the `subpixel-antialiased` utility to render text using subpixel antialiasing:

<Figure>

<Example>
  {
    <p className="text-center text-lg font-medium text-gray-900 subpixel-antialiased dark:text-gray-200">
      The quick brown fox jumps over the lazy dog.
    </p>
  }
</Example>

```html
<!-- [!code classes:subpixel-antialiased] -->
<p class="subpixel-antialiased ...">The quick brown fox ...</p>
```

</Figure>

### Responsive design

<ResponsiveDesign
  element="p"
  properties={["-webkit-font-smoothing", "-moz-osx-font-smoothing"]}
  defaultClass="antialiased"
  featuredClass="subpixel-antialiased"
/>


================================================
File: src/docs/font-style.mdx
================================================
import { ApiTable } from "@/components/api-table.tsx";
import { Example } from "@/components/example.tsx";
import { Figure } from "@/components/figure.tsx";
import { ResponsiveDesign } from "@/components/content.tsx";

export const title = "font-style";
export const description = "Utilities for controlling the style of text.";

<ApiTable
  rows={[
    ["italic", "font-style: italic;"],
    ["not-italic", "font-style: normal;"],
  ]}
/>

## Examples

### Italicizing text

Use the `italic` utility to make text italic:

<Figure>

<Example>
  {
    <p className="text-center text-lg font-medium text-gray-900 italic dark:text-gray-200">
      The quick brown fox jumps over the lazy dog.
    </p>
  }
</Example>

```html
<!-- [!code classes:italic] -->
<p class="italic ...">The quick brown fox ...</p>
```

</Figure>

### Displaying text normally

Use the `not-italic` utility to display text normally:

<Figure>

<Example>
  {
    <p className="text-center text-lg font-medium text-gray-900 not-italic dark:text-gray-200">
      The quick brown fox jumps over the lazy dog.
    </p>
  }
</Example>

```html
<!-- [!code classes:not-italic] -->
<p class="not-italic ...">The quick brown fox ...</p>
```

</Figure>

### Responsive design

<ResponsiveDesign property="font-style" defaultClass="italic" featuredClass="not-italic" element="p" />


================================================
File: src/docs/grid-auto-columns.mdx
================================================
import { ApiTable } from "@/components/api-table.tsx";
import { ResponsiveDesign, UsingACustomValue } from "@/components/content.tsx";

export const title = "grid-auto-columns";
export const description = "Utilities for controlling the size of implicitly-created grid columns.";

<ApiTable
  rows={[
    ["auto-cols-auto", "grid-auto-columns: auto;"],
    ["auto-cols-min", "grid-auto-columns: min-content;"],
    ["auto-cols-max", "grid-auto-columns: max-content;"],
    ["auto-cols-fr", "grid-auto-columns: minmax(0, 1fr);"],
    ["auto-cols-(<custom-property>)", "grid-auto-columns: var(<custom-property>);"],
    ["auto-cols-[<value>]", "grid-auto-columns: <value>;"],
  ]}
/>

## Examples

### Basic example

Use utilities like `auto-cols-min` and `auto-cols-max` to control the size of implicitly-created grid columns:

```html
<!-- [!code classes:auto-cols-max] -->
<div class="grid auto-cols-max grid-flow-col">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
```

### Using a custom value

<UsingACustomValue utility="auto-cols" name="size of implicitly-created grid columns" value="minmax(0,2fr)" />

### Responsive design

<ResponsiveDesign
  property="grid-auto-columns"
  defaultClass="grid grid-flow-col auto-cols-max"
  featuredClass="auto-cols-min"
/>


================================================
File: src/docs/grid-auto-flow.mdx
================================================
import { ApiTable } from "@/components/api-table.tsx";
import { Example } from "@/components/example.tsx";
import { Figure } from "@/components/figure.tsx";
import { ResponsiveDesign } from "@/components/content.tsx";
import { Stripes } from "@/components/stripes.tsx";

export const title = "grid-auto-flow";
export const description = "Utilities for controlling how elements in a grid are auto-placed.";

<ApiTable
  rows={[
    ["grid-flow-row", "grid-auto-flow: row;"],
    ["grid-flow-col", "grid-auto-flow: column;"],
    ["grid-flow-dense", "grid-auto-flow: dense;"],
    ["grid-flow-row-dense", "grid-auto-flow: row dense;"],
    ["grid-flow-col-dense", "grid-auto-flow: column dense;"],
  ]}
/>

## Examples

### Basic example

Use utilities like `grid-flow-col` and `grid-flow-row-dense` to control how the auto-placement algorithm works for a grid layout:

<Figure>

<Example>
  {
    <div className="grid grid-cols-1">
      <Stripes border className="col-start-1 row-start-1 rounded-lg" />
      <div className="col-start-1 row-start-1 grid grid-flow-row-dense grid-cols-3 grid-rows-3 gap-4 rounded-lg text-center font-mono text-sm leading-6 font-bold text-white">
        <div className="col-span-2 rounded-lg bg-purple-300 p-4 dark:bg-purple-800 dark:text-purple-400">01</div>
        <div className="col-span-2 rounded-lg bg-purple-300 p-4 dark:bg-purple-800 dark:text-purple-400">02</div>
        <div className="rounded-lg bg-purple-500 p-4">03</div>
        <div className="rounded-lg bg-purple-300 p-4 dark:bg-purple-800 dark:text-purple-400">04</div>
        <div className="rounded-lg bg-purple-300 p-4 dark:bg-purple-800 dark:text-purple-400">05</div>
      </div>
    </div>
  }
</Example>

```html
<!-- [!code classes:grid-flow-row-dense] -->
<div class="grid grid-flow-row-dense grid-cols-3 grid-rows-3 ...">
  <div class="col-span-2">01</div>
  <div class="col-span-2">02</div>
  <div>03</div>
  <div>04</div>
  <div>05</div>
</div>
```

</Figure>

### Responsive design

<ResponsiveDesign property="grid-auto-flow" defaultClass="grid grid-flow-col" featuredClass="grid-flow-row" />


================================================
File: src/docs/grid-auto-rows.mdx
================================================
import { ApiTable } from "@/components/api-table.tsx";
import { ResponsiveDesign, UsingACustomValue } from "@/components/content.tsx";

export const title = "grid-auto-rows";
export const description = "Utilities for controlling the size of implicitly-created grid rows.";

<ApiTable
  rows={[
    ["auto-rows-auto", "grid-auto-rows: auto;"],
    ["auto-rows-min", "grid-auto-rows: min-content;"],
    ["auto-rows-max", "grid-auto-rows: max-content;"],
    ["auto-rows-fr", "grid-auto-rows: minmax(0, 1fr);"],
    ["auto-rows-(<custom-property>)", "grid-auto-rows: var(<custom-property>);"],
    ["auto-rows-[<value>]", "grid-auto-rows: <value>;"],
  ]}
/>

## Examples

### Basic example

Use utilities like `auto-rows-min` and `auto-rows-max` to control the size of implicitly-created grid rows:

```html
<!-- [!code classes:auto-rows-max] -->
<div class="grid grid-flow-row auto-rows-max">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
```

### Using a custom value

<UsingACustomValue utility="auto-rows" name="size of implicitly-created grid rows" value="minmax(0,2fr)" />

### Responsive design

<ResponsiveDesign
  property="grid-auto-rows"
  defaultClass="grid grid-flow-row auto-rows-max"
  featuredClass="auto-rows-min"
/>


================================================
File: src/docs/isolation.mdx
================================================
import { ApiTable } from "@/components/api-table.tsx";
import { ResponsiveDesign } from "@/components/content.tsx";

export const title = "isolation";
export const description =
  "Utilities for controlling whether an element should explicitly create a new stacking context.";

<ApiTable
  rows={[
    ["isolate", "isolation: isolate;"],
    ["isolation-auto", "isolation: auto;"],
  ]}
/>

## Examples

### Basic example

Use the `isolate` and `isolation-auto` utilities to control whether an element should explicitly create a new stacking context:

```html
<!-- [!code classes:isolate] -->
<div class="isolate ...">
  <!-- ... -->
</div>
```

### Responsive design

<ResponsiveDesign property="isolation" defaultClass="isolate" featuredClass="isolation-auto" />


================================================
File: src/docs/list-style-image.mdx
================================================
import { ApiTable } from "@/components/api-table.tsx";
import { Example } from "@/components/example.tsx";
import { Figure } from "@/components/figure.tsx";
import { ResponsiveDesign } from "@/components/content.tsx";

export const title = "list-style-image";
export const description = "Utilities for controlling the marker images for list items.";

<ApiTable
  rows={[
    ["list-image-[<value>]", "list-style-image: <value>;"],
    ["list-image-(<custom-property>)", "list-style-image: var(<custom-property>);"],
    ["list-image-none", "list-style-image: none;"],
  ]}
/>

## Examples

### Basic example

Use the `list-image-[<value>]` syntax to control the marker image for list items:

<Figure>

<Example padding={false}>
  {
    <div className="px-4 sm:px-0">
      <div className="mx-auto max-w-sm p-8 text-gray-700 sm:text-base sm:leading-7 dark:text-gray-400">
        <ul className="list-image-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxNCAxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmaWxsPSIjMzhiZGY4Ij48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMy42ODUuMTUzYS43NTIuNzUyIDAgMCAxIC4xNDMgMS4wNTJsLTggMTAuNWEuNzUuNzUgMCAwIDEtMS4xMjcuMDc1bC00LjUtNC41YS43NS43NSAwIDAgMSAxLjA2LTEuMDZsMy44OTQgMy44OTMgNy40OC05LjgxN2EuNzUuNzUgMCAwIDEgMS4wNS0uMTQzWiIgLz48L3N2Zz4=')] pl-4 text-gray-900 dark:text-gray-200">
          <li className="pl-2">5 cups chopped Porcini mushrooms</li>
          <li className="pl-2">1/2 cup of olive oil</li>
          <li className="pl-2">3lb of celery</li>
        </ul>
      </div>
    </div>
  }
</Example>

```html
<!-- [!code classes:list-image-[url(/img/checkmark.png)]] -->
<ul class="list-image-[url(/img/checkmark.png)]">
  <li>5 cups chopped Porcini mushrooms</li>
  <!-- ... -->
</ul>
```

</Figure>

### Using a CSS variable

Use the <code>list-image-{'(<custom-property>)'}</code> syntax to control the marker image for list items using a CSS variable:

```html
<!-- [!code classes:list-image-(--my-list-image)] -->
<ul class="list-image-(--my-list-image)">
  <!-- ... -->
</ul>
```

This is just a shorthand for <code>list-image-{'[var(<custom-property>)]'}</code> that adds the `var()` function for you automatically.

### Removing a marker image

Use the `list-image-none` utility to remove an existing marker image from list items:

```html
<!-- [!code classes:list-image-none] -->
<ul class="list-image-none">
  <!-- ... -->
</ul>
```

### Responsive design

<ResponsiveDesign
  property="list-style-image"
  defaultClass="list-image-none"
  featuredClass="list-image-[url(/img/checkmark.png)]"
/>


================================================
File: src/docs/list-style-position.mdx
================================================
import { ApiTable } from "@/components/api-table.tsx";
import { Example } from "@/components/example.tsx";
import { Figure } from "@/components/figure.tsx";
import { ResponsiveDesign } from "@/components/content.tsx";

export const title = "list-style-position";
export const description = "Utilities for controlling the position of bullets and numbers in lists.";

<ApiTable
  rows={[
    ["list-inside", "list-style-position: inside;"],
    ["list-outside", "list-style-position: outside;"],
  ]}
/>

## Examples

### Basic example

Use utilities like `list-inside` and `list-outside` to control the position of the markers and text indentation in a list:

<Figure>

<Example>
  {
    <div className="flex flex-col gap-8 sm:flex-row">
      <div className="relative">
        <div className="absolute -top-8 -bottom-8 left-8 w-px bg-pink-400/40 dark:bg-pink-400/30"></div>
        <p className="mb-3 ml-8 font-mono text-sm font-medium text-gray-500 dark:text-gray-400">list-inside</p>
        <ul className="list-inside list-disc rounded-xl p-4 pl-8 text-gray-900 dark:text-gray-200">
          <li>5 cups chopped Porcini mushrooms</li>
          <li>1/2 cup of olive oil</li>
          <li>3lb of celery</li>
        </ul>
      </div>
      <div className="relative">
        <div className="absolute -top-0 -bottom-8 left-8 w-px bg-pink-400/40 sm:-top-8 dark:bg-pink-400/30"></div>
        <p className="mb-3 ml-8 font-mono text-sm font-medium text-gray-500 dark:text-gray-400">list-outside</p>
        <ul className="list-outside list-disc rounded-xl p-4 pl-8 text-gray-900 dark:text-gray-200">
          <li>5 cups chopped Porcini mushrooms</li>
          <li>1/2 cup of olive oil</li>
          <li>3lb of celery</li>
        </ul>
      </div>
    </div>
  }
</Example>

```html
<!-- [!code classes:list-inside] -->
<ul class="list-inside">
  <li>5 cups chopped Porcini mushrooms</li>
  <!-- ... -->
</ul>

<!-- [!code classes:list-outside] -->
<ul class="list-outside">
  <li>5 cups chopped Porcini mushrooms</li>
  <!-- ... -->
</ul>
```

</Figure>

### Responsive design

<ResponsiveDesign element="ul" property="list-style-position" defaultClass="list-outside" featuredClass="list-inside" />


================================================
File: src/docs/opacity.mdx
================================================
import { ApiTable } from "@/components/api-table.tsx";
import { CustomizingYourTheme, ResponsiveDesign, UsingACustomValue } from "@/components/content.tsx";
import { Example } from "@/components/example.tsx";
import { Figure } from "@/components/figure.tsx";
import { TargetingSpecificStates } from "@/components/content.tsx";

export const title = "opacity";
export const description = "Utilities for controlling the opacity of an element.";

<ApiTable
  rows={[
    ["opacity-<number>", "opacity: <number>%;"],
    ["opacity-(<custom-property>)", "opacity: var(<custom-property>);"],
    ["opacity-[<value>]", "opacity: <value>;"],
  ]}
/>

## Examples

### Basic example

Use `opacity-<number>` utilities like `opacity-25` and `opacity-100` to set the opacity of an element:

<Figure>

<Example>
  {
    <div className="flex flex-col items-center justify-center gap-8 text-sm leading-6 font-bold text-white sm:flex-row sm:gap-16">
      <div className="flex shrink-0 flex-col items-center">
        <p className="mb-3 text-center font-mono text-sm font-medium text-gray-500 dark:text-gray-400">opacity-100</p>
        <button className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white opacity-100">
          Button A
        </button>
      </div>
      <div className="flex shrink-0 flex-col items-center">
        <p className="mb-3 text-center font-mono text-sm font-medium text-gray-500 dark:text-gray-400">opacity-75</p>
        <button className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white opacity-75">
          Button B
        </button>
      </div>
      <div className="flex shrink-0 flex-col items-center">
        <p className="mb-3 text-center font-mono text-sm font-medium text-gray-500 dark:text-gray-400">opacity-50</p>
        <button className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white opacity-50">
          Button C
        </button>
      </div>
      <div className="flex shrink-0 flex-col items-center">
        <p className="mb-3 text-center font-mono text-sm font-medium text-gray-500 dark:text-gray-400">opacity-25</p>
        <button className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white opacity-25">
          Button D
        </button>
      </div>
    </div>
  }
</Example>

```html
<!-- [!code classes:opacity-100,opacity-75,opacity-50,opacity-25] -->
<button class="bg-indigo-500 opacity-100 ..."></button>
<button class="bg-indigo-500 opacity-75 ..."></button>
<button class="bg-indigo-500 opacity-50 ..."></button>
<button class="bg-indigo-500 opacity-25 ..."></button>
```

</Figure>

### Applying conditionally

<TargetingSpecificStates
  element="input"
  elementAttributes={{ type: "text" }}
  variant="disabled"
  property="opacity"
  defaultClass="opacity-100"
  featuredClass="opacity-75"
/>

### Using a custom value

<UsingACustomValue element="button" utility="opacity" value=".67" />

### Responsive design

<ResponsiveDesign element="button" property="opacity" defaultClass="opacity-50" featuredClass="opacity-100" />


================================================
File: src/docs/order.mdx
================================================
import { ApiTable } from "@/components/api-table.tsx";
import { Example } from "@/components/example.tsx";
import { Figure } from "@/components/figure.tsx";
import { ResponsiveDesign, UsingACustomValue } from "@/components/content.tsx";

export const title = "order";
export const description = "Utilities for controlling the order of flex and grid items.";

<ApiTable
  rows={[
    ["order-<number>", "order: <number>;"],
    ["-order-<number>", "order: calc(<number> * -1);"],
    ["order-first", "order: calc(-infinity);"],
    ["order-last", "order: calc(infinity);"],
    ["order-none", "order: 0;"],
    ["order-(<custom-property>)", "order: var(<custom-property>);"],
    ["order-[<value>]", "order: <value>;"],
  ]}
/>

## Examples

### Explicitly setting a sort order

Use `order-<number>` utilities like `order-1` and `order-3` to render flex and grid items in a different order than they appear in the document:

<Figure>

<Example>
  {
    <div className="flex justify-between font-mono text-sm leading-6 font-bold text-white">
      <div className="order-3 flex h-14 w-14 items-center justify-center rounded-lg bg-sky-500">01</div>
      <div className="order-1 flex h-14 w-14 items-center justify-center rounded-lg bg-sky-500">02</div>
      <div className="order-2 flex h-14 w-14 items-center justify-center rounded-lg bg-sky-500">03</div>
    </div>
  }
</Example>

```html
<!-- [!code classes:order-1,order-2,order-3] -->
<div class="flex justify-between ...">
  <div class="order-3 ...">01</div>
  <div class="order-1 ...">02</div>
  <div class="order-2 ...">03</div>
</div>
```

</Figure>

### Ordering items first or last

Use the `order-first` and `order-last` utilities to render flex and grid items first or last:

<Figure>

<Example>
  {
    <div className="flex justify-between font-mono text-sm leading-6 font-bold text-white">
      <div className="order-last flex h-14 w-14 items-center justify-center rounded-lg bg-fuchsia-500">01</div>
      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-fuchsia-500">02</div>
      <div className="order-first flex h-14 w-14 items-center justify-center rounded-lg bg-fuchsia-500">03</div>
    </div>
  }
</Example>

```html
<!-- [!code classes:order-first,order-last] -->
<div class="flex justify-between ...">
  <div class="order-last ...">01</div>
  <div class="...">02</div>
  <div class="order-first ...">03</div>
</div>
```

</Figure>

### Using negative values

To use a negative order value, prefix the class name with a dash to convert it to a negative value:

```html
<!-- [!code classes:-order-1] -->
<div class="-order-1">
  <!-- ... -->
</div>
```

### Using a custom value

<UsingACustomValue utility="order" value="min(var(--total-items),10)" />

### Responsive design

<ResponsiveDesign property="order" defaultClass="order-first" featuredClass="order-last" />


================================================
File: src/docs/outline-offset.mdx
================================================
import { ApiTable } from "@/components/api-table.tsx";
import { Example } from "@/components/example.tsx";
import { Figure } from "@/components/figure.tsx";
import { ResponsiveDesign, UsingACustomValue } from "@/components/content.tsx";

export const title = "outline-offset";
export const description = "Utilities for controlling the offset of an element's outline.";

<ApiTable
  rows={[
    ["outline-offset-<number>", "outline-offset: <number>px;"],
    ["-outline-offset-<number>", "outline-offset: calc(<number>px * -1);"],
    ["outline-offset-(<custom-property>)", "outline-offset: var(<custom-property>);"],
    ["outline-offset-[<value>]", "outline-offset: <value>;"],
  ]}
/>

## Examples

### Basic example

Use utilities like `outline-offset-2` and `outline-offset-4` to change the offset of an element's outline:

<Figure>

<Example>
  {
    <div className="grid grid-cols-1 gap-8 text-center text-sm font-bold text-white sm:grid-cols-3 sm:gap-4">
      <div className="flex shrink-0 flex-col items-center">
        <p className="mb-3 text-center font-mono text-sm font-medium text-gray-500 dark:text-gray-400">
          outline-offset-0
        </p>
        <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 outline-2 outline-offset-0 outline-sky-500 dark:border-transparent dark:bg-gray-700 dark:text-gray-200">
          Button A
        </button>
      </div>
      <div className="flex shrink-0 flex-col items-center">
        <p className="mb-3 text-center font-mono text-sm font-medium text-gray-500 dark:text-gray-400">
          outline-offset-2
        </p>
        <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 outline-2 outline-offset-2 outline-sky-500 dark:border-transparent dark:bg-gray-700 dark:text-gray-200">
          Button B
        </button>
      </div>
      <div className="flex shrink-0 flex-col items-center">
        <p className="mb-3 text-center font-mono text-sm font-medium text-gray-500 dark:text-gray-400">
          outline-offset-4
        </p>
        <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 outline-2 outline-offset-4 outline-sky-500 dark:border-transparent dark:bg-gray-700 dark:text-gray-200">
          Button C
        </button>
      </div>
    </div>
  }
</Example>

```html
<!-- [!code classes:outline-offset-0,outline-offset-2,outline-offset-4] -->
<button class="outline-2 outline-offset-0 ...">Button A</button>
<button class="outline-2 outline-offset-2 ...">Button B</button>
<button class="outline-2 outline-offset-4 ...">Button C</button>
```

</Figure>

### Using a custom value

<UsingACustomValue utility="outline-offset" name="outline offset" value="2vw" />

### Responsive design

<ResponsiveDesign property="outline-offset" defaultClass="outline" featuredClass="outline-offset-2" />


================================================
File: src/docs/resize.mdx
================================================
import { ApiTable } from "@/components/api-table.tsx";
import { Example } from "@/components/example.tsx";
import { Figure } from "@/components/figure.tsx";
import { ResponsiveDesign } from "@/components/content.tsx";

export const title = "resize";
export const description = "Utilities for controlling how an element can be resized.";

<ApiTable
  rows={[
    ["resize-none", "resize: none;"],
    ["resize", "resize: both;"],
    ["resize-y", "resize: vertical;"],
    ["resize-x", "resize: horizontal;"],
  ]}
/>

## Examples

### Resizing in all directions

Use `resize` to make an element horizontally and vertically resizable:

<Figure hint="Drag the textarea handle in the demo to see the expected behavior">

<Example>
  {
    <textarea
      rows="2"
      className="mx-auto block w-80 resize rounded-md p-2 text-sm text-gray-950 outline-1 outline-gray-900/10 focus:outline-2 focus:outline-gray-900 dark:bg-gray-950/25 dark:text-white dark:outline-1 dark:outline-white/5 dark:focus:outline-white/20"
    ></textarea>
  }
</Example>

```html
<!-- [!code classes:resize] -->
<textarea class="resize rounded-md ..."></textarea>
```

</Figure>

### Resizing vertically

Use `resize-y` to make an element vertically resizable:

<Figure hint="Drag the textarea handle in the demo to see the expected behavior">

<Example>
  {
    <textarea
      rows="2"
      className="mx-auto block w-80 resize-y rounded-md p-2 text-sm text-gray-950 outline-1 outline-gray-900/10 focus:outline-2 focus:outline-gray-900 dark:bg-gray-950/25 dark:text-white dark:outline-1 dark:outline-white/5 dark:focus:outline-white/20"
    ></textarea>
  }
</Example>

```html
<!-- [!code classes:resize-y] -->
<textarea class="resize-y rounded-md ..."></textarea>
```

</Figure>

### Resizing horizontally

Use `resize-x` to make an element horizontally resizable:

<Figure hint="Drag the textarea handle in the demo to see the expected behavior">

<Example>
  {
    <textarea
      rows="2"
      className="mx-auto block w-80 resize-x rounded-md p-2 text-sm text-gray-950 outline-1 outline-gray-900/10 focus:outline-2 focus:outline-gray-900 dark:bg-gray-950/25 dark:text-white dark:outline-1 dark:outline-white/5 dark:focus:outline-white/20"
    ></textarea>
  }
</Example>

```html
<!-- [!code classes:resize-x] -->
<textarea class="resize-x rounded-md ..."></textarea>
```

</Figure>

### Prevent resizing

Use `resize-none` to prevent an element from being resizable:

<Figure hint="Notice that the textarea handle is gone">

<Example>
  {
    <textarea
      rows="2"
      className="mx-auto block w-80 resize-none rounded-md p-2 text-sm text-gray-950 outline-1 outline-gray-900/10 focus:outline-2 focus:outline-gray-900 dark:bg-gray-950/25 dark:text-white dark:outline-1 dark:outline-white/5 dark:focus:outline-white/20"
    ></textarea>
  }
</Example>

```html
<!-- [!code classes:resize-none] -->
<textarea class="resize-none rounded-md"></textarea>
```

</Figure>

### Responsive design

<ResponsiveDesign property="resize" defaultClass="resize-none" featuredClass="resize" />


================================================
File: src/docs/scroll-behavior.mdx
================================================
import { ApiTable } from "@/components/api-table.tsx";
import { Example } from "@/components/example.tsx";
import { Figure } from "@/components/figure.tsx";

export const title = "scroll-behavior";
export const description = "Utilities for controlling the scroll behavior of an element.";

<ApiTable
  rows={[
    ["scroll-auto", "scroll-behavior: auto;"],
    ["scroll-smooth", "scroll-behavior: smooth;"],
  ]}
/>

## Examples

### Using smooth scrolling

Use the `scroll-smooth` utility to enable smooth scrolling within an element:

```html
<!-- [!code classes:scroll-smooth] -->
<html class="scroll-smooth">
  <!-- ... -->
</html>
```

Setting the `scroll-behavior` only affects scroll events that are triggered by the browser.

### Using normal scrolling

Use the `scroll-auto` utility to revert to the default browser behavior for scrolling:

```html
<!-- [!code classes:scroll-auto] -->
<html class="scroll-smooth md:scroll-auto">
  <!-- ... -->
</html>
```


================================================
File: src/docs/stroke-width.mdx
================================================
import { ApiTable } from "@/components/api-table.tsx";
import { ResponsiveDesign, UsingACustomValue } from "@/components/content.tsx";
import { Example } from "@/components/example.tsx";
import { Figure } from "@/components/figure.tsx";

export const title = "stroke-width";
export const description = "Utilities for styling the stroke width of SVG elements.";

<ApiTable
  rows={[
    ["stroke-<number>", "stroke-width: <number>;"],
    ["stroke-(length:<custom-property>)", "stroke-width: var(<custom-property>);"],
    ["stroke-[<value>]", "stroke-width: <value>;"],
  ]}
/>

## Examples

### Basic example

Use `stroke-<number>` utilities like `stroke-1` and `stroke-2` to set the stroke width of an SVG:

<Figure>

<Example>
  {
    <div className="flex items-center justify-center gap-x-8">
      <svg
        className="stroke-indigo-500 stroke-1"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="24" cy="24" r="23" strokeLinejoin="round" />
        <path d="M23 1C23 1 15 10.4901 15 24C15 37.5099 23 47 23 47" strokeLinejoin="round" />
        <path d="M25 1C25 1 33 10.4901 33 24C33 37.5099 25 47 25 47" strokeLinejoin="round" />
        <path d="M1 24H47" />
      </svg>
      <svg
        className="stroke-indigo-500 stroke-2"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="24" cy="24" r="23" strokeLinejoin="round" />
        <path d="M23 1C23 1 15 10.4901 15 24C15 37.5099 23 47 23 47" strokeLinejoin="round" />
        <path d="M25 1C25 1 33 10.4901 33 24C33 37.5099 25 47 25 47" strokeLinejoin="round" />
        <path d="M1 24H47" />
      </svg>
    </div>
  }
</Example>

```html
<!-- [!code classes:stroke-1,stroke-2] -->
<svg class="stroke-1 ..."></svg>
<svg class="stroke-2 ..."></svg>
```

</Figure>

This can be useful for styling icon sets like [Heroicons](https://heroicons.com).

### Using a custom value

<UsingACustomValue utility="stroke" name="stroke width" value="1.5" variable="stroke-width" dataType="length" />

### Responsive design

<ResponsiveDesign property="stroke-width" defaultClass="stroke-1" featuredClass="stroke-2" />


================================================
File: src/docs/text-decoration-style.mdx
================================================
import { ApiTable } from "@/components/api-table.tsx";
import { Example } from "@/components/example.tsx";
import { Figure } from "@/components/figure.tsx";
import { ResponsiveDesign } from "@/components/content.tsx";

export const title = "text-decoration-style";
export const description = "Utilities for controlling the style of text decorations.";

<ApiTable
  rows={[
    ["decoration-solid", "text-decoration-style: solid;"],
    ["decoration-double", "text-decoration-style: double;"],
    ["decoration-dotted", "text-decoration-style: dotted;"],
    ["decoration-dashed", "text-decoration-style: dashed;"],
    ["decoration-wavy", "text-decoration-style: wavy;"],
  ]}
/>

## Examples

### Basic example

Use utilities like `decoration-dotted` and `decoration-dashed` to change the [text decoration](/docs/text-decoration-line) style of an element:

<Figure>

<Example>
  {
    <div className="flex flex-col gap-8 text-gray-900 dark:text-gray-200">
      <div>
        <div className="mb-3 font-mono text-sm font-medium text-gray-500 dark:text-gray-400">decoration-solid</div>
        <p className="text-lg font-medium underline decoration-solid">The quick brown fox jumps over the lazy dog.</p>
      </div>
      <div>
        <div className="mb-3 font-mono text-sm font-medium text-gray-500 dark:text-gray-400">decoration-double</div>
        <p
          className="text-lg font-medium underline decoration-double"
          children="The quick brown fox jumps over the lazy dog."
        />
      </div>
      <div>
        <div className="mb-3 font-mono text-sm font-medium text-gray-500 dark:text-gray-400">decoration-dotted</div>
        <p className="text-lg font-medium underline decoration-dotted">The quick brown fox jumps over the lazy dog.</p>
      </div>
      <div>
        <div className="mb-3 font-mono text-sm font-medium text-gray-500 dark:text-gray-400">decoration-dashed</div>
        <p className="text-lg font-medium underline decoration-dashed">The quick brown fox jumps over the lazy dog.</p>
      </div>
      <div>
        <div className="mb-3 font-mono text-sm font-medium text-gray-500 dark:text-gray-400">decoration-wavy</div>
        <p className="text-lg font-medium underline decoration-wavy">The quick brown fox jumps over the lazy dog.</p>
      </div>
    </div>
  }
</Example>

```html
<!-- [!code classes:decoration-solid,decoration-double,decoration-dotted,decoration-dashed,decoration-wavy] -->
<p class="underline decoration-solid">The quick brown fox...</p>
<p class="underline decoration-double">The quick brown fox...</p>
<p class="underline decoration-dotted">The quick brown fox...</p>
<p class="underline decoration-dashed">The quick brown fox...</p>
<p class="underline decoration-wavy">The quick brown fox...</p>
```

</Figure>

### Responsive design

<ResponsiveDesign
  element="p"
  property="text-decoration-style"
  defaultClass="underline"
  featuredClass="decoration-dashed"
/>


================================================
File: src/docs/text-decoration-thickness.mdx
================================================
import { ApiTable } from "@/components/api-table.tsx";
import { Example } from "@/components/example.tsx";
import { Figure } from "@/components/figure.tsx";
import { ResponsiveDesign, UsingACustomValue } from "@/components/content.tsx";

export const title = "text-decoration-thickness";
export const description = "Utilities for controlling the thickness of text decorations.";

<ApiTable
  rows={[
    ["decoration-<number>", "text-decoration-thickness: <number>px;"],
    ["decoration-from-font", "text-decoration-thickness: from-font;"],
    ["decoration-auto", "text-decoration-thickness: auto;"],
    ["decoration-(<custom-property>)", "text-decoration-thickness: var(<custom-property>);"],
    ["decoration-[<value>]", "text-decoration-thickness: <value>;"],
  ]}
/>

## Examples

### Basic example

Use `decoration-<number>` utilities like `decoration-2` and `decoration-4` to change the [text decoration](/docs/text-decoration-line) thickness of an element:

<Figure>

<Example>
  {
    <div className="flex flex-col gap-8 text-gray-900 dark:text-gray-200">
      <div>
        <div className="mb-3 font-mono text-sm font-medium text-gray-500 dark:text-gray-400">decoration-1</div>
        <p className="text-lg font-medium underline decoration-1">The quick brown fox jumps over the lazy dog.</p>
      </div>
      <div>
        <div className="mb-3 font-mono text-sm font-medium text-gray-500 dark:text-gray-400">decoration-2</div>
        <p className="text-lg font-medium underline decoration-2">The quick brown fox jumps over the lazy dog.</p>
      </div>
      <div>
        <div className="mb-3 font-mono text-sm font-medium text-gray-500 dark:text-gray-400">decoration-4</div>
        <p className="text-lg font-medium underline decoration-4">The quick brown fox jumps over the lazy dog.</p>
      </div>
    </div>
  }
</Example>

```html
<!-- [!code classes:decoration-1] -->
<p class="underline decoration-1">The quick brown fox...</p>
<!-- [!code classes:decoration-2] -->
<p class="underline decoration-2">The quick brown fox...</p>
<!-- [!code classes:decoration-4] -->
<p class="underline decoration-4">The quick brown fox...</p>
```

</Figure>

### Using a custom value

<UsingACustomValue
  element="p"
  utility="decoration"
  name="text decoration thickness"
  value="0.25rem"
  variable="decoration-thickness"
/>

### Responsive design

<ResponsiveDesign
  element="p"
  property="text-decoration-thickness"
  defaultClass="underline"
  featuredClass="decoration-4"
/>


================================================
File: src/docs/text-indent.mdx
================================================
import { ApiTable } from "@/components/api-table.tsx";
import { Example } from "@/components/example.tsx";
import { Figure } from "@/components/figure.tsx";
import { ResponsiveDesign, UsingACustomValue } from "@/components/content.tsx";

export const title = "text-indent";
export const description = "Utilities for controlling the amount of empty space shown before text in a block.";

<ApiTable
  rows={[
    ["indent-<number>", "text-indent: calc(var(--spacing) * <number>)"],
    ["-indent-<number>", "text-indent: calc(var(--spacing) * -<number>)"],
    ["indent-px", "text-indent: 1px;"],
    ["-indent-px", "text-indent: -1px;"],
    ["indent-(<custom-property>)", "text-indent: var(<custom-property>);"],
    ["indent-[<value>]", "text-indent: <value>;"],
  ]}
/>

## Examples

### Basic example

Use `indent-<number>` utilities like `indent-2` and `indent-8` to set the amount of empty space (indentation) that's shown before text in a block:

<Figure>

<Example>
  {
    <p className="mx-auto max-w-sm indent-8 text-gray-900 dark:text-gray-200">
      So I started to walk into the water. I won't lie to you boys, I was terrified. But I pressed on, and as I made my
      way past the breakers a strange calm came over me. I don't know if it was divine intervention or the kinship of
      all living things but I tell you Jerry at that moment, I <em>was</em> a marine biologist.
    </p>
  }
</Example>

```html
<!-- [!code classes:indent-8] -->
<p class="indent-8">So I started to walk into the water...</p>
```

</Figure>

### Using negative values

To use a negative text indent value, prefix the class name with a dash to convert it to a negative value:

<Figure>

<Example>
  {
    <p className="mx-auto max-w-sm -indent-8 text-gray-900 dark:text-gray-200">
      So I started to walk into the water. I won't lie to you boys, I was terrified. But I pressed on, and as I made my
      way past the breakers a strange calm came over me. I don't know if it was divine intervention or the kinship of
      all living things but I tell you Jerry at that moment, I <em>was</em> a marine biologist.
    </p>
  }
</Example>

```html
<!-- [!code classes:-indent-8] -->
<p class="-indent-8">So I started to walk into the water...</p>
```

</Figure>

### Using a custom value

<UsingACustomValue element="p" utility="indent" name="text indentation" value="50%" variable="indentation" />

### Responsive design

<ResponsiveDesign element="p" property="text-indent" defaultClass="indent-4" featuredClass="indent-8" />


================================================
File: src/docs/text-transform.mdx
================================================
import { ApiTable } from "@/components/api-table.tsx";
import { Example } from "@/components/example.tsx";
import { Figure } from "@/components/figure.tsx";
import { ResponsiveDesign } from "@/components/content.tsx";

export const title = "text-transform";
export const description = "Utilities for controlling the capitalization of text.";

<ApiTable
  rows={[
    ["uppercase", "text-transform: uppercase;"],
    ["lowercase", "text-transform: lowercase;"],
    ["capitalize", "text-transform: capitalize;"],
    ["normal-case", "text-transform: none;"],
  ]}
/>

## Examples

### Uppercasing text

Use the `uppercase` utility to uppercase the text of an element:

<Figure>

<Example>
  {
    <p className="text-center text-lg font-medium text-gray-900 uppercase dark:text-gray-200">
      The quick brown fox jumps over the lazy dog.
    </p>
  }
</Example>

```html
<!-- [!code classes:uppercase] -->
<p class="uppercase">The quick brown fox ...</p>
```

</Figure>

### Lowercasing text

Use the `lowercase` utility to lowercase the text of an element:

<Figure>

<Example>
  {
    <p className="text-center text-lg font-medium text-gray-900 lowercase dark:text-gray-200">
      The quick brown fox jumps over the lazy dog.
    </p>
  }
</Example>

```html
<!-- [!code classes:lowercase] -->
<p class="lowercase">The quick brown fox ...</p>
```

</Figure>

### Capitalizing text

Use the `capitalize` utility to capitalize text of an element:

<Figure>

<Example>
  {
    <p className="text-center text-lg font-medium text-gray-900 capitalize dark:text-gray-200">
      The quick brown fox jumps over the lazy dog.
    </p>
  }
</Example>

```html
<!-- [!code classes:capitalize] -->
<p class="capitalize">The quick brown fox ...</p>
```

</Figure>

### Resetting text casing

Use the `normal-case` utility to preserve the original text casing of an element—typically used to reset capitalization at different breakpoints:

<Figure>

<Example>
  {
    <p className="text-center text-lg font-medium text-gray-900 normal-case dark:text-gray-200">
      The quick brown fox jumps over the lazy dog.
    </p>
  }
</Example>

```html
<!-- [!code classes:normal-case] -->
<p class="normal-case">The quick brown fox ...</p>
```

</Figure>

### Responsive design

<ResponsiveDesign element="p" property="text-transform" defaultClass="capitalize" featuredClass="uppercase" />


================================================
File: src/docs/text-underline-offset.mdx
================================================
import { ApiTable } from "@/components/api-table.tsx";
import { Example } from "@/components/example.tsx";
import { Figure } from "@/components/figure.tsx";
import { ResponsiveDesign, UsingACustomValue } from "@/components/content.tsx";

export const title = "text-underline-offset";
export const description = "Utilities for controlling the offset of a text underline.";

<ApiTable
  rows={[
    ["underline-offset-<number>", "text-underline-offset: <number>px;"],
    ["-underline-offset-<number>", "text-underline-offset: calc(<number>px * -1);"],
    ["underline-offset-auto", "text-underline-offset: auto;"],
    ["underline-offset-(<custom-property>)", "text-underline-offset: var(<custom-property>);"],
    ["underline-offset-[<value>]", "text-underline-offset: <value>;"],
  ]}
/>

## Examples

### Basic example

Use `underline-offset-<number>` utilities like `underline-offset-2` and `underline-offset-4` to change the offset of a text underline:

<Figure>

<Example>
  {
    <div className="flex flex-col gap-8 text-gray-900 dark:text-gray-200">
      <div>
        <div className="mb-3 font-mono text-sm font-medium text-gray-500 dark:text-gray-400">underline-offset-1</div>
        <p className="text-lg font-medium underline underline-offset-1">The quick brown fox jumps over the lazy dog.</p>
      </div>
      <div>
        <div className="mb-3 font-mono text-sm font-medium text-gray-500 dark:text-gray-400">underline-offset-2</div>
        <p className="text-lg font-medium underline underline-offset-2">The quick brown fox jumps over the lazy dog.</p>
      </div>
      <div>
        <div className="mb-3 font-mono text-sm font-medium text-gray-500 dark:text-gray-400">underline-offset-4</div>
        <p className="text-lg font-medium underline underline-offset-4">The quick brown fox jumps over the lazy dog.</p>
      </div>
      <div>
        <div className="mb-3 font-mono text-sm font-medium text-gray-500 dark:text-gray-400">underline-offset-8</div>
        <p className="text-lg font-medium underline underline-offset-8">The quick brown fox jumps over the lazy dog.</p>
      </div>
    </div>
  }
</Example>

```html
<!-- [!code classes:underline-offset-1] -->
<p class="underline underline-offset-1">The quick brown fox...</p>
<!-- [!code classes:underline-offset-2] -->
<p class="underline underline-offset-2">The quick brown fox...</p>
<!-- [!code classes:underline-offset-4] -->
<p class="underline underline-offset-4">The quick brown fox...</p>
<!-- [!code classes:underline-offset-8] -->
<p class="underline underline-offset-8">The quick brown fox...</p>
```

</Figure>

### Using a custom value

<UsingACustomValue element="p" utility="underline-offset" name="text underline offset" value="3px" />

### Responsive design

<ResponsiveDesign
  element="p"
  property="text-underline-offset"
  defaultClass="underline"
  featuredClass="underline-offset-4"
/>


================================================
File: src/docs/transform.mdx
================================================
import { ApiTable } from "@/components/api-table.tsx";
import { UsingACustomValue } from "@/components/content.tsx";

export const title = "transform";
export const description = "Utilities for transforming elements.";

<ApiTable
  rows={[
    ["transform-(<custom-property>)", "transform: var(<custom-property>);"],
    ["transform-[<value>]", "transform: <value>;"],
    ["transform-none", "transform: none;"],
    [
      "transform-gpu",
      "transform: translateZ(0) var(--tw-rotate-x) var(--tw-rotate-y) var(--tw-rotate-z) var(--tw-skew-x) var(--tw-skew-y);",
    ],
    [
      "transform-cpu",
      "transform: var(--tw-rotate-x) var(--tw-rotate-y) var(--tw-rotate-z) var(--tw-skew-x) var(--tw-skew-y);",
    ],
  ]}
/>

## Examples

### Hardware acceleration

If your transition performs better when rendered by the GPU instead of the CPU, you can force hardware acceleration by adding the `transform-gpu` utility:

```html
<!-- [!code classes:transform-gpu] -->
<div class="scale-150 transform-gpu">
  <!-- ... -->
</div>
```

Use the `transform-cpu` utility to force things back to the CPU if you need to undo this conditionally.

### Removing transforms

Use the `transform-none` utility to remove all of the transforms on an element at once:

```html
<!-- [!code classes:transform-none] -->
<div class="skew-y-3 md:transform-none">
  <!-- ... -->
</div>
```

### Using a custom value

<UsingACustomValue utility="transform" value="matrix(1,2,3,4,5,6)" />


================================================
File: src/docs/transition-behavior.mdx
================================================
import { ApiTable } from "@/components/api-table.tsx";
import { Example } from "@/components/example.tsx";
import { Figure } from "@/components/figure.tsx";
import { ResponsiveDesign } from "@/components/content.tsx";

export const title = "transition-behavior";
export const description = "Utilities to control the behavior of CSS transitions.";

<ApiTable
  rows={[
    ["transition-normal", "transition-behavior: normal;"],
    ["transition-discrete", "transition-behavior: allow-discrete;"],
  ]}
/>

## Examples

### Basic example

Use the `transition-discrete` utility to start transitions when changing properties with a discrete set of values, such as elements that change from `hidden` to `block`:

<Figure hint="Interact with the checkboxes to see the expected behavior">

<Example>
  {
    <div className="flex flex-col justify-around gap-8 text-sm leading-6 font-bold text-white sm:flex-row sm:gap-0">
      <div className="flex shrink-0 flex-col items-center sm:w-1/2">
        <label className="peer mb-3 inline-flex gap-2 text-center font-mono text-sm font-medium text-gray-500 select-none dark:text-gray-400">
          <input type="checkbox" defaultChecked />
          transition-normal
        </label>
        <button className="hidden rounded-md bg-violet-500 px-4 py-2 text-sm font-semibold text-white transition-all transition-normal duration-300 not-peer-has-checked:opacity-0 peer-has-checked:block">
          I hide
        </button>
      </div>
      <div className="flex shrink-0 flex-col items-center sm:w-1/2">
        <label className="peer mb-3 inline-flex gap-2 text-center font-mono text-sm font-medium text-gray-500 select-none dark:text-gray-400">
          <input type="checkbox" defaultChecked />
          transition-discrete
        </label>
        <button className="hidden rounded-md bg-violet-500 px-4 py-2 text-sm font-semibold text-white transition-all transition-discrete duration-300 not-peer-has-checked:opacity-0 peer-has-checked:block">
          I fade out
        </button>
      </div>
    </div>
  }
</Example>

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

</Figure>

### Responsive design

<ResponsiveDesign
  element="button"
  property="transition-behavior"
  defaultClass="transition-discrete"
  featuredClass="transition-normal"
/>


================================================
File: src/docs/transition-delay.mdx
================================================
import { ApiTable } from "@/components/api-table.tsx";
import { Example } from "@/components/example.tsx";
import { Figure } from "@/components/figure.tsx";
import { ResponsiveDesign, UsingACustomValue } from "@/components/content.tsx";

export const title = "transition-delay";
export const description = "Utilities for controlling the delay of CSS transitions.";

<ApiTable
  rows={[
    ["delay-<number>", "transition-delay: <number>ms;"],
    ["delay-(<custom-property>)", "transition-delay: var(<custom-property>);"],
    ["delay-[<value>]", "transition-delay: <value>;"],
  ]}
/>

## Examples

### Basic example

Use utilities like `delay-150` and `delay-700` to set the transition delay of an element in milliseconds:

<Figure hint="Hover each button to see the expected behavior">

<Example>
  {
    <div className="flex flex-col justify-around gap-8 text-sm leading-6 font-bold text-white sm:flex-row sm:gap-0">
      <div className="flex shrink-0 flex-col items-center">
        <p className="mb-3 text-center font-mono text-sm font-medium text-gray-500 dark:text-gray-400">delay-150</p>
        <button className="rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white delay-150 duration-300 ease-in-out hover:scale-125">
          Button A
        </button>
      </div>
      <div className="flex shrink-0 flex-col items-center">
        <p className="mb-3 text-center font-mono text-sm font-medium text-gray-500 dark:text-gray-400">delay-300</p>
        <button className="rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white delay-300 duration-300 ease-in-out hover:scale-125">
          Button B
        </button>
      </div>
      <div className="flex shrink-0 flex-col items-center">
        <p className="mb-3 text-center font-mono text-sm font-medium text-gray-500 dark:text-gray-400">delay-700</p>
        <button className="rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white delay-700 duration-300 ease-in-out hover:scale-125">
          Button C
        </button>
      </div>
    </div>
  }
</Example>

```html
<!-- [!code classes:delay-150,delay-300,delay-700] -->
<button class="transition delay-150 duration-300 ease-in-out ...">Button A</button>
<button class="transition delay-300 duration-300 ease-in-out ...">Button B</button>
<button class="transition delay-700 duration-300 ease-in-out ...">Button C</button>
```

</Figure>

### Using a custom value

<UsingACustomValue element="button" utility="delay" value="1s,250ms" name="transition delay" />

### Responsive design

<ResponsiveDesign element="button" property="transition-delay" defaultClass="delay-150" featuredClass="delay-300" />


================================================
File: src/docs/transition-duration.mdx
================================================
import { ApiTable } from "@/components/api-table.tsx";
import { Example } from "@/components/example.tsx";
import { Figure } from "@/components/figure.tsx";
import { ResponsiveDesign, UsingACustomValue } from "@/components/content.tsx";

export const title = "transition-duration";
export const description = "Utilities for controlling the duration of CSS transitions.";

<ApiTable
  rows={[
    ["duration-<number>", "transition-duration: <number>ms;"],
    ["duration-initial", "transition-duration: initial;"],
    ["duration-(<custom-property>)", "transition-duration: var(<custom-property>);"],
    ["duration-[<value>]", "transition-duration: <value>;"],
  ]}
/>

## Examples

### Basic example

Use utilities like `duration-150` and `duration-700` to set the transition duration of an element in milliseconds:

<Figure hint="Hover each button to see the expected behavior">

<Example>
  {
    <div className="flex flex-col justify-around gap-8 text-sm leading-6 font-bold text-white sm:flex-row sm:gap-0">
      <div className="flex shrink-0 flex-col items-center">
        <p className="mb-3 text-center font-mono text-sm font-medium text-gray-500 dark:text-gray-400">duration-150</p>
        <button className="rounded-md bg-violet-500 px-4 py-2 text-sm font-semibold text-white duration-150 ease-in-out hover:scale-125">
          Button A
        </button>
      </div>
      <div className="flex shrink-0 flex-col items-center">
        <p className="mb-3 text-center font-mono text-sm font-medium text-gray-500 dark:text-gray-400">duration-300</p>
        <button className="rounded-md bg-violet-500 px-4 py-2 text-sm font-semibold text-white duration-300 ease-in-out hover:scale-125">
          Button B
        </button>
      </div>
      <div className="flex shrink-0 flex-col items-center">
        <p className="mb-3 text-center font-mono text-sm font-medium text-gray-500 dark:text-gray-400">duration-700</p>
        <button className="rounded-md bg-violet-500 px-4 py-2 text-sm font-semibold text-white duration-700 ease-in-out hover:scale-125">
          Button C
        </button>
      </div>
    </div>
  }
</Example>

```html
<!-- [!code classes:duration-150,duration-300,duration-700] -->
<button class="transition duration-150 ease-in-out ...">Button A</button>
<button class="transition duration-300 ease-in-out ...">Button B</button>
<button class="transition duration-700 ease-in-out ...">Button C</button>
```

</Figure>

### Using a custom value

<UsingACustomValue element="button" utility="duration" value="1s,15s" name="transition duration" />

### Responsive design

<ResponsiveDesign
  element="button"
  property="transition-duration"
  defaultClass="duration-0"
  featuredClass="duration-150"
/>


================================================
File: src/docs/will-change.mdx
================================================
import { ApiTable } from "@/components/api-table.tsx";
import { Example } from "@/components/example.tsx";
import { UsingACustomValue } from "@/components/content.tsx";

export const title = "will-change";
export const description = "Utilities for optimizing upcoming animations of elements that are expected to change.";

<ApiTable
  rows={[
    ["will-change-auto", "will-change: auto;"],
    ["will-change-scroll", "will-change: scroll-position;"],
    ["will-change-contents", "will-change: contents;"],
    ["will-change-transform", "will-change: transform;"],
    ["will-change-<custom-property>", "will-change: var(<custom-property>);"],
    ["will-change-[<value>]", "will-change: <value>;"],
  ]}
/>

## Examples

### Optimizing with will change

Use the `will-change-scroll`, `will-change-contents` and `will-change-transform` utilities to optimize an element that's expected to change in the near future by instructing the browser to prepare the necessary animation before it actually begins:

```html
<!-- [!code classes:will-change-scroll] -->
<div class="overflow-auto will-change-scroll">
  <!-- ... -->
</div>
```

It's recommended that you apply these utilities just before an element changes, and then remove it shortly after it finishes using `will-change-auto`.

The `will-change` property is intended to be used as a last resort when dealing with **known performance problems**. Avoid using these utilities too much, or simply in anticipation of performance issues, as it could actually cause the page to be less performant.

### Using a custom value

<UsingACustomValue
  utility="will-change"
  name={
    <>
      <code>will-change</code> property
    </>
  }
  value="top,left"
  variable="properties"
/>


================================================
File: src/docs/utils/colors.ts
================================================
import fs from "node:fs/promises";
import path from "node:path";

import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const styles = await fs.readFile(path.join(__dirname, "../../../node_modules/tailwindcss/theme.css"), "utf-8");

let colors: Record<string, string> = {};
for (let line of styles.split("\n")) {
  if (line.startsWith("  --color-")) {
    const [key, value] = line.split(":").map((part) => part.trim().replace(";", ""));

    let name = key.replace("--color-", "");
    colors[name] = value;
  }
}

// Move `black` and `white` to the front of the object as these should appear
// first in the documentation.
colors = {
  black: colors.black,
  white: colors.white,
  ...colors,
};

export default colors;


