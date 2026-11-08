# Webshop
 
Deze repo hoort bij het vak informatica op het Emmauscollege Rotterdam.
[Meer info over deze opdracht](https://informatica.emmauscollege.nl/)
 
# Hoe werkt de webshop?
 
De webshop bestaat uit drie delen:
 
| Deel | Map | Wat doet het? |
|---|---|---|
| Database | `db` | Bewaart de producten (naam, prijs, beschrijving, code). |
| API (server) | `api` | Haalt gegevens uit de database en stuurt ze naar de browser. |
| Website | `web` | De pagina's die je in de browser ziet (HTML, CSS en JavaScript). |
 
Wat er gebeurt als je de webshop opent:
 
1. De browser laadt een pagina uit de map `web`.
2. JavaScript op die pagina vraagt aan de API welke producten er zijn, bijvoorbeeld via `/api/products`.
3. De API haalt de producten uit de database en stuurt ze terug als JSON.
4. JavaScript zet de producten op de pagina.
De winkelwagen wordt in je browser bewaard (localStorage), niet op de server.
 
# Webshop starten
 
Typ in de terminal van Codespaces:
```
bash start.sh
```
Je kunt ook op de knop "Bouw DB & Start API" onderin het scherm drukken.
 
Server stoppen: druk op `Ctrl` + `C` in de terminal.
 
Start de server opnieuw na elke wijziging in de database of in de API.
 
# Database aanpassen
 
De database wordt elke keer opnieuw gemaakt uit `db/create.sql` als je de server start.
Wil je producten of tabellen aanpassen? Doe dat in `db/create.sql` en start de server opnieuw.
 
Afbeeldingen staan in `web/images`. Het product met id 3 gebruikt `3.jpg`.
 
# Fouten zoeken
 
## In de database
Open de database in de terminal:
```
sqlite3 db/my.db
```
Handige commando's:
- `.tables` toont alle tabellen
- `.schema products` toont de kolommen van de tabel products
- `SELECT * FROM products LIMIT 3;` toont de eerste 3 producten (vergeet de `;` niet)
- `.quit` sluit sqlite3 af
## In de API
Zet `/api/products` achter het adres van je webshop, bijvoorbeeld:
`https://....-8080.app.github.dev/api/products`
Je ziet dan wat de API terugstuurt.
 
Foutmeldingen van de API zie je in de terminal. Je kunt zelf waarden laten zien met:
```
console.log("Waarde van i is ", i);
```
 
## In de website
Open de console in de browser (Chrome: `F12` of rechtermuisknop → Inspecteren → Console).
Daar zie je foutmeldingen en de uitvoer van `console.log`.
 
Zet `debugger` in je code om het programma op die plek te pauzeren als de console open staat.
 
# Bestelling mailen
 
De shop kan een bevestiging van elke bestelling mailen. Daarvoor heb je een Gmail-account nodig met tweestapsverificatie.
 
1. Maak een app-wachtwoord: Google-account → Beveiliging → App-wachtwoorden.
2. Typ in de terminal (vul je eigen gegevens in):
```
export GMAIL_EMAIL=jouwshop@gmail.com
export GMAIL_PASSWORD=jouwapppassword
export ORDER_MAIL_TO=jouw@email.nl
bash start.sh
```
3. Plaats een bestelling. In de terminal zie je `Email sent` als het gelukt is, of een foutmelding als het niet gelukt is.
Deze instellingen verdwijnen als je de terminal sluit. Wil je ze bewaren? Zet ze als secrets in GitHub: Settings → Codespaces → Secrets.
 
Zet je wachtwoord nooit in de code. Iedereen kan je repo lezen.
 
# Mappen en bestanden
 
| Bestand of map | Inhoud |
|---|---|
| `db/create.sql` | SQL-commando's die de database maken |
| `api/index.js` | De API (server) |
| `web/` | HTML, CSS, JavaScript en afbeeldingen van de website |
| `web/js/basket.js` | Functies voor de winkelwagen |
| `start.sh` | Maakt de database en start de server |
| `.devcontainer/`, `.vscode/` | Instellingen voor Codespaces (niet aanpassen) |
 
# Nieuwe dingen in de code
 
Je kent HTML, CSS en JavaScript uit de vierde klas. Deze technieken zijn nieuw:
 
- Functies als parameter: je kunt een functie meegeven aan een andere functie, net als een variabele.
- Callbacks: sommige opdrachten (zoals iets ophalen bij de API) duren even. JavaScript wacht daar niet op, maar roept een functie aan zodra het klaar is. Die functie heet een callback.
- Templates: HTML tussen `<template>` en `</template>` wordt niet getoond. JavaScript kopieert dat stukje voor elk product, vult het in en zet het op de pagina.
# Vraag en antwoord
 
Codespaces zegt "Oh no, it looks like you're offline".
De firewall van school blokkeert Codespaces soms. Gebruik dan de hotspot van je mobiel.
 
# Handige links
 
- HTML, CSS en JavaScript: https://www.w3schools.com
- SQL leren: https://www.khanacademy.org/computing/computer-programming/sql
- sqlite3 in de terminal: https://www.sqlite.org/cli.html
- better-sqlite3 (database in JavaScript): https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md
- Express (server): https://expressjs.com
- Nodemailer met Gmail: https://nodemailer.com/guides/using-gmail
# Credits
 
Gebaseerd op werk van [avs123a](https://github.com/avs123a/NodeJS-simple-example) en [Robert Bakker](https://github.com/Notalifeform).
 