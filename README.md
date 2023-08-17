
<h1 align="center">Vue3 Scroll-Spy Directive</h1>

<div align="center">
<p>Scrollspy and animated scroll-to for Vue3, inspired by <a href="https://github.com/ibufu/vue2-scrollspy">vue2-scrollspy</a>. <br>
Fork based on previous work done by <a href="https://github.com/bennyxguo">Benny Guo</a> <a href="https://github.com/bennyxguo/vue3-scroll-spy">vue3-scroll-spy</a>
</p>
</div>

## Installation

```bash
npm i @aleios10/vue3-scroll-spy-composable -S
```

OR

```bash
yarn add @aleios10/vue3-scroll-spy-composable
```

## Usage

### Support

| Supported Package | Version |
| ----------------- | ------- |
| Vue               | 3+      |

### Use directive via composable SFC

```html
<template>
   <ul v-scroll-spy-active v-scroll-spy-link>
   <li>
      <a>Menu 1</a>
   </li>
   <li>
      <a>Menu 2</a>
   </li>
   </ul>

   <div v-scroll-spy>
   <div>
      <h1>Header 1</h1>
      <p>Content</p>
   </div>
   <div>
      <h1>Header 2</h1>
      <p>Content</p>
   </div>
   </div>
</template>
```

```javascript
<script setup>
import { useScrollSpy } from 'vue3-scroll-spy-composable';

const { vScrollSpy, vScrollSpyLink, vScrollSpyActive } = useScrollSpy()

</script>

```

## Configuration

### v-scroll-spy

Binding scroll-spy to sections (or elements) of a container.

| Directive name                                 | Description                                                                     | Default                                    |
| ---------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------ |
| `v-scroll-spy="{allowNoActiveSection: true}"`  | When scroll position is outside of the container, active class will be removed. | Keep one section stays active at all time. |
| `v-scroll-spy="{offset: 50}"`                  | TAdding offset to scroll and active elements.                                   | Default: `0`                               |
| `v-scroll-spy="{time: 200, steps: 30}"`        | Set the animation options, time is animation duration, steps is step per frame. | `{time: 200, steps: 30}`                   |

### v-scroll-spy-active

Setting active elements' `selector` and `class` properties.

| Directive name                                                             | Description                                 | Default                             |
| -------------------------------------------------------------------------- | ------------------------------------------- | ----------------------------------- |
| `v-scroll-spy-active="{selector: 'li.menu-item', class: 'custom-active'}"` | Customize elements selector and class name. | `{selector: null, class: 'active'}` |

### v-scroll-spy-link

Add `click handler` on children elements allow scrolling to the related section.

| Directive name                                  | Description                    | Default                             |
| ----------------------------------------------- | ------------------------------ | ----------------------------------- |
| `v-scroll-spy-link="{selector: 'a.menu-link'}"` | Customize menu links selector. | `{selector: null, class: 'active'}` |

### Bezier animations

```javascript
import { useScrollSpy } from 'vue3-scroll-spy-composable';

const { vScrollSpy, vScrollSpyLink, vScrollSpyActive } = useScrollSpy({
   easing: Easing.Cubic.In
})
```

## Note

- You should have the same number of children elements for `v-scroll-spy`, `v-scroll-spy-active`, `v-scroll-spy-link` for this directive to work correctly.

### Nested sections

Vue3 Scroll-Spy also support multi-leveled sections:

```html
<ol
  v-scroll-spy
  v-scroll-spy-active="{selector: 'li.menu-item', class: 'active'}"
>
  <li class="menu-item">Item 1</li>
  <li class="menu-item">
    Item 2
    <ol>
      <li class="menu-item">Item 2.1</li>
      <li class="menu-item">Item 2.2</li>
    </ol>
  </li>
</ol>
```

## License

MIT License
