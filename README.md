# App aus Onlineshop

Blank-Canvas Landing Page (Vorlage bereit zum Aufbau).

## Lokal ansehen

```bash
cd appausonlineshop
python3 -m http.server 8080
```

Dann [http://localhost:8080](http://localhost:8080) öffnen.

## Konfiguration

In `config.js`:

```js
window.APPAUSONLINESHOP = {
  offerEmail: "deine@email.de", // Empfänger für Angebots-Anfragen
};
```

Anfragen laufen über [FormSubmit](https://formsubmit.co) an `offerEmail`.
Beim ersten Mal die Bestätigungsmail von FormSubmit einmal freischalten.

## Auf Render deployen

1. Neues GitHub-Repo erstellen und diesen Ordner pushen.
2. Render → **New** → **Blueprint** → Repo verbinden.
3. Oder **New** → **Static Site** → Repo wählen, **Publish directory:** `.`
