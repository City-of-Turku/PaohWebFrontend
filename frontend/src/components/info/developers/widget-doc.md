Seuraava lyhyt pätkää koodia tulee vain sijoittaa sivun `<body>`-elementtiin:

```js
<div id="palveluohjain-link"></div>
<script type="text/javascript">
  PaohLink.init({
    text: 'Text to show on the widget',
    municipality: 'Turku',
    language: 'sv',
    // topic: ''
    // Lisää muita parametreja (lista alla)
  });
</script>
```

Elementti huolehtii yllä kuvatusta oikean linkkiformaatin generoinnista ja sille voi vain antaa yllä kuvatut parametrit:

- kieli `language`
- kunta `municipality`
- ja aihe `topic`).

Lisäksi elementin mukauttamiseen on tarjolla muutamia muita parametreja:

- `text`: Widgetissä näytettävä teksti.
  Oletusarvo: `"Etsi palveluita Palveluohjaimesta"`
- `position`: Widgetin sijainti, joko ruudun oikea tai vasen alanurkka. Oletusarvo on `"right"`
- `color`: Widgetin tekstin väri. Oletusarvo on `"#fff"` (valkoinen)
- `background`: Widgetin taustaväri. Oletusarvo on `"#111832"`.
- `zIndex`: z-indeksi määrittää missä järjestykssä päällekkäiset elementit näytetän. Korkeimman z-indeksin omaava elementti näytetään päällimmäisenä. Oletusarvo on 100000
- `debug`: Jos arvo on `true`, widgetti printtaa debuggausta helpottavaa tietoa JavaScript-konsoliin. Oletusarvo on `false`
