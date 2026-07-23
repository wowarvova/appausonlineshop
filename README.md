# App aus Onlineshop

Blank-Canvas Landing Page (Vorlage bereit zum Aufbau).

## Lokal ansehen

```bash
cd appausonlineshop
python3 -m http.server 8080
```

Dann [http://localhost:8080](http://localhost:8080) öffnen.

## Konfiguration

In `config.js` (später nutzbar):

```js
window.APPAUSONLINESHOP = {
  instagramHandle: "dein.handle",
  instagramUrl: "https://www.instagram.com/dein.handle/",
};
```

## Auf Render deployen

1. Neues GitHub-Repo erstellen und diesen Ordner pushen.
2. Render → **New** → **Blueprint** → Repo verbinden.
3. Oder **New** → **Static Site** → Repo wählen, **Publish directory:** `.`
