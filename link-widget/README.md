# Palveluohjain Link Widget

A simple link element that will stay in the right bottom corner of the screen (and can be closed)

## Usage

The widget can be added to a page by inserting following script

```html
<!-- Element for widget to attach to -->
<div id="palveluohjain-link"></div>

<!-- Import widget source code -->
<script src="./paoh-link.js"></script>

<!-- Code to initialize and customize widget -->
<script type="text/javascript">
  PaohLink.init({
    text: 'Text to show on the widget',
    background: 'darkblue',
    color: 'white',
    municipality: 'Turku',
    language: 'sv',
    // Add other properties here (full list below)
  });
</script>
```

The widget will try attach itself to a element with an id `palveluohjain-link`. If it does not find such element, it will add a `<div>` element with id `palveluohjain-link-widget` and attach itself to that instead.

It is recommended to provide the HTML element for the widget (for example `<div>` with id `palveluohjain-link`).

```html
<div id="palveluohjain-link"></div>
```

## Parameters

<!-- prettier-ignore -->
| Parameter | Default value | Explanation |
| --------- | ------------- | ------------|
| `debug` | `false` | If true, the widget will print debugging information to browser console. Defaults to false. |
| `text` | `"Etsi palveluita Palveluohjaimesta"` | Text shown on the link button. Defaults to 'Etsi palveluita Palveluohjaista'|
| `position` | `"right"` | Position of the chat button, either `"left"` or `"right"` bottom corner of the screen. | 
| `color` | `"#fff"` | Text color of the chat button. |
| `background` | `"#111832"` | Background color of the chat button. |
| `zIndex` | 100000 |  Layer z-index of the widget that allows it to be set under or on top of other elements. |
| `language` | No default value | Language to be used when opening Palveluohaaja. No default value. the website (www.palveluohjaaja.fi) itself will either use the language the user used on previous visit or use it's default option. Available values fi, en and sv - or check palveluohjaaja.fi |
| `municipality` |  No default value | From which municipality Palveluohjain should try to find services. 
| `topic` | No default value | Topic that chatbot discussion should start from.

> Link parameters (`language`, `municipality`, and `topic`) are described in more details on Palveluohjaaja.fi.
