# IDS.OWID.Plus.Live

OWIDplusLIVE erlaubt die LIVE-Frequenzanalyse von Token und N-Grammen in Tageszeitungen.
Eine Demo auf Basis von 13 deutschsprachigen Nachrichten-RSS-Feeds finden Sie hier:
https://www.owid.de/plus/live-2021/

## Überblick

| Verzeichnis  | Inhalt | Status |
|--------------|--------|--------|
| `API`        | .NET-Dienst **IDS.OWIDplusLIVE.API** (REST-API v3) | **aktuell** |
| `API.v3`     | ASP.NET-Core-Demoprojekt (Weather-Forecast), noch keine OWIDplusLIVE-API | **Platzhalter** |
| `WebClient`  | GUI (Vue 3, Vite, Vuetify, Pinia, ECharts) | aktuell |
| `Jupyter`    | Jupyter-Notebooks zur Nutzung der API v3 mit Python | aktuell |
| `Tools`      | Hilfsprogramme für Upload und ältere Konvertierungs-/Schreibabläufe | teilweise veraltet |

Die API v3 berechnet die N-Gramme selbst. Ein separates Skript zur Erzeugung von N-Grammen und ElasticSearch werden für diesen Dienst nicht benötigt.

## Systemvoraussetzungen

Für eine eigene Installation:

- Linux-Server (x64) für den hier beschriebenen Betrieb
- Webserver (z. B. Apache oder NGINX) – dient zur Auslieferung des WebClients und optional als Reverse-Proxy vor der API
- **.NET 6.0** (Runtime bzw. SDK zum Kompilieren) für den Dienst `IDS.OWIDplusLIVE.API`
- **TreeTagger** mit deutschem Sprachmodell (wird beim Daten-Update zur Annotation verwendet)
- Node.js (nur zum Bauen des WebClients)

Das API-Projekt referenziert zusätzlich mehrere Projekte außerhalb dieses Repositories. Ein Build setzt daher die vollständige Entwicklerumgebung mit diesen Abhängigkeiten voraus.

## Installation

### 1. API v3 (`API`)

```bash
cd API
dotnet build -c Release
dotnet run -c Release          # Entwicklung
dotnet publish -c Release -o /opt/owidplus-live-api   # Produktion
```

Die Konfiguration erfolgt über `API/config.cnf` (JSON). Der Dienst verwendet den TreeTagger mit der Sprache Deutsch (Sprachmodell kann umgestellt werden). Der TreeTagger und müssen Sprachmodell manuell hinterlegt werden (siehe unten).

Die fertige Applikation liest folgende Daten aus der `config.cnf` aus:
```json
{
  "IP": "*",
  "Port": 4455,
  "N": 3,
  "MaxItems": 1000,
  "MaxPostSize": 52428800,
  "SecureUpdateToken": "token"
}
```
Bedeutung:
- `IP`: Bei `"*"` lauscht der Dienst auf allen Schnittstellen. Bei Betrieb hinter einem Proxy kann der Dienst auf `localhost` beschränkt werden.
- `Port`: Port des Dienstes.
- `N`: Maximale N-Gramm-Länge der API. Standardmäßig ist `N = 3`; der WebClient unterstützt ebenfalls höchstens 3.
- `MaxItems`: Begrenzt die Treffer beim ersten Suchlauf im Fokusjahr auf die häufigsten N-Gramme. Weitere Jahre werden anschließend für diese Treffer abgefragt.
- `MaxPostSize`: Maximale Größe des Request-Bodys für `POST /v3/convert`. Ein vorgeschalteter Proxy muss gegebenenfalls ebenfalls entsprechend konfiguriert werden. Für `/v3/update` setzt der Dienst selbst kein Größenlimit; Proxy- oder Serverlimits können weiterhin gelten.
- `SecureUpdateToken`: Geheimes Token für die Authentifizierung von Daten-Updates. Ändern Sie unbedingt den Beispielwert `token` in einen langen, zufälligen Wert, bevor Sie den Dienst bereitstellen.

Tipp: Der Dienst sollte automatisch mit Linux starten – registrieren Sie ihn z. B. als `systemd`-Dienst.
Sichern Sie die API per Reverse-Proxy (Apache/NGINX, TLS) nach außen ab.

> Hinweis: `API` enthält die Implementierung der REST-API v3. `API.v3` ist derzeit nur ein ASP.NET-Core-Demoprojekt. Die öffentliche Demo-API ist unter https://www.owid.de/plus/live-2021/api erreichbar.

#### 1.1. TreeTagger-Installation
Die API verwendet beim Daten-Update den CorpusExplorers in Kombination mit dem TreeTagger mit der fest codierten Sprache Deutsch. Installationshinweise zu TreeTagger finden Sie auf der [Projektseite](https://www.cis.uni-muenchen.de/~schmid/tools/TreeTagger/). 
Die kompilierten Daten müssen im Unterordner des Web-Service (API) abgelegt werden, im Unterordner `XDependencies/TreeTagger`.
Besonders wichtig:
- die Binärdaten müssen in `XDependencies/TreeTagger/bin`
- die Modell-Daten müssen in `XDependencies/TreeTagger/lib`
liegen. Die Sprache ist aktuell hart codiert, es wird immer `XDependencies/TreeTagger/lib/german-utf8.par` verwendet. Falls Sie eine andere Sprache nutzen wollen, dann benennen Sie die PAR-Datei in `XDependencies/TreeTagger/lib/german-utf8.par` um. 

#### 1.2. Daten-Upload (`Tools/EasyUpload`)

Das EasyUpdate-Tool erleichtert den Prozess des Updates. Das Tool kompilieren Sie wie folgt:

```bash
cd Tools/EasyUpload
dotnet build -c Release
dotnet run -c Release          # Entwicklung
dotnet publish -c Release -o /opt/easy-update   # Produktion
```

Damit Sie Daten an den Server schicken können, benötigen Sie den Wert von `SecureUpdateToken` (siehe oben). Der Client fordert anschließend ein einmalig verwendbares Token an und berechnet damit den SessionKey.

```bash
./IDS.Lexik.OWIDplusLIVE.Upload [URL] [secret] [LocalPath]
```

Beispiel:
```bash
./IDS.Lexik.OWIDplusLIVE.Upload http://127.0.0.1/v3/ 12345TOKEN789 /home/pi/2020-02-28.txt
```

- `URL`: Basisadresse mit abschließendem `/`. Für diesen Client muss sie auf die API-Routen `/v3/token` und `/v3/update` zeigen, daher endet sie üblicherweise auf `/v3/`.
- `secret`: Der konfigurierte Wert von `SecureUpdateToken`.
- `LocalPath`: Datei mit einem Datum als Dateinamen im Format `yyyy-MM-dd`, z. B. `2026-11-06.txt`. Ein vorhandenes Datum wird überschrieben. Die Dateiendung ist beliebig; der Dateiinhalt muss UTF-8-kodierter Text sein.

Der aktuelle EasyUpload-Client blockiert Verbindungen zu Port 443. Verwenden Sie ihn daher nicht mit einer HTTPS-Adresse; für den Upload über HTTPS muss der Client angepasst werden. Der Dienst selbst sollte nicht ungeschützt über öffentliches HTTP erreichbar sein.

### 2. WebClient (`WebClient`)

```bash
cd WebClient
npm install
npm run dev        # Entwicklungsserver
npm run build      # Produktions-Build nach WebClient/dist
npm run preview    # Build lokal testen
```

Den Inhalt von `dist/` auf den Webserver kopieren. Der Produktions-Build ist in `vite.config.js` auf den Basispfad `/plus/live-2021/` eingestellt; für einen anderen Pfad muss dieser angepasst werden.
`public/config.json` enthält unter anderem Anwendungsnamen, Texte und Links. Die API-Adresse wird derzeit in `App.vue`, `components/Search.vue` und `components/Clipboard.vue` fest im Quellcode gesetzt; der Eintrag `baseUrl` in `config.json` ändert sie nicht.

## Komponenten

### GUI – WebClient

Basis-URL der Demo: `https://www.owid.de/plus/live-2021/`

Der WebClient ist die Weboberfläche von OWIDplusLIVE (Vue 3, Vite, Vuetify, Pinia, vue-i18n, ECharts).
Er ruft ausschließlich die API v3 auf und bietet:

- **Suche**: einfache Suche (N = 1–3, je Position ein Layer – Wortform, Lemma oder POS – mit Platzhaltern `*`) und erweiterte Tiefen-Suche
  (Wortform, Lemma und POS gleichzeitig). Der Fokus-Jahrgang bestimmt, welches Jahr zuerst geladen wird, weitere Jahre werden nachgeladen.
- **Suchverlauf**: Vergleich und Verfeinerung früherer Suchen, Auswahl einzelner Treffer, Export (TSV, CSV, HTML, SQL, XML, JSON), Teilen per Link, Speichern/Laden des Verlaufs und Abfrage in KorAP.
- **Visualisierung**: Zeitverlauf, Kalender-Heatmap und Sankey-Diagramm.
- **Einstellungen**: relative/absolute Frequenz, Granulierung (Tag, Woche, Monat, Quartal, Jahr) und Glättung (gleitender Durchschnitt).
- Mehrsprachige Oberfläche (Deutsch, Englisch und Thai).

### Jupyter-Notebooks (`Jupyter`)

Die Notebooks bieten Python-Beispiele zur Nutzung der API v3:

- `OwidPlusLive.ipynb` – für die lokale Ausführung; die benötigten Pakete sind im Notebook aufgeführt und können dort installiert werden.
- `OwidPlusLive_ONLINE.ipynb` – für browserbasierte Jupyter-Umgebungen; die Verfügbarkeit der Pakete hängt von der jeweiligen Umgebung ab.

Enthalten sind u. a. `searchSimple`, `searchAdvanced`, Granulierung und gleitender Durchschnitt, Sankey-Daten sowie
`lookupSingle`/`lookupDataFrame` und Beispiele im Abschnitt „Playground“.

### API v3 – aktuell gültig

Basis-URL der Demo: `https://www.owid.de/plus/live-2021/api/`.

Die API-Basis-URL ist unter https://www.owid.de/plus/live-2021/api/ erreichbar. Nachfolgend eine Kurzübersicht der im Ordner `API` implementierten Endpunkte.

| Methode | Pfad | Beschreibung |
|---------|------|--------------|
| GET  | `/v3/years`   | Liste der verfügbaren Jahrgänge, z. B. `[2020, 2021, …]` |
| GET  | `/v3/norm`    | Normierungsdaten: Array von Tages-Summen, je ein Objekt `{ "YYYY-MM-DD": Anzahl }`; die Anzahl der Einträge richtet sich nach `N` in `config.cnf` |
| POST | `/v3/search`  | Sucht nach N-Grammen; liefert bis zu 1000 der häufigsten N-Gramme der Abfrage |
| POST | `/v3/lookup`  | Ermittelt zu Wortformen die passenden Werte eines anderen Layers (z. B. Lemma/POS) |
| POST | `/v3/convert?n=<n>&format=<format>` | Konvertiert eine Ausgabe von `/v3/search` in `CSV`, `TSV`, `HTML`, `SQL` oder `XML` |
| GET  | `/v3/token`    | Liefert ein einmalig verwendbares Token für einen Daten-Upload |
| POST | `/v3/update`   | Schreibt Tagesdaten (`Year`, `Month`, `Day`, `Data`, `SessionKey`); `Data` enthält base64-kodierte, gzip-komprimierte UTF-8-Daten. Der SessionKey wird mit Token und `SecureUpdateToken` gebildet. |
| GET  | `/heartbeat`, `/ping` | Statusprüfung; `/heartbeat` liefert 200, wenn Daten geladen sind, andernfalls 102. `/ping` liefert 200. |

#### `POST /v3/search`

Anfrage:
```json
{
  "N": 3,
  "Year": 2024,
  "Items": [
    { "Position": 0, "Layer": 0, "Token": "schön" },
    { "Position": 1, "Layer": 0, "Token": "zum" },
    { "Position": 2, "Layer": 2, "Token": "N*" }
  ]
}
```

- `N`: Größe des N-Gramms (1 bis zum konfigurierten Maximum; standardmäßig 3).
- `Year`: abgefragtes Jahr (siehe `/years`; `0` = Standardjahr des Servers). Der WebClient fragt zuerst das Fokus-Jahr ab und lädt die übrigen Jahre nacheinander nach.
- `Items`: Suchbedingungen. `Position` ist nullbasiert (0 bis N-1); `Layer`: `0` = Wortform, `1` = Lemma, `2` = POS. `Token` erlaubt Platzhalter (`*`).

Antwort: Wörterbuch je gefundenem N-Gramm. Schlüssel sind die gefundenen N-Gramme z. B. `schön zum wandern` (Token der Positionen jeweils durch Leerzeichen getrennt),
Werte sind Objekte `{ "YYYY-MM-DD": Frequenz }` (absolute Frequenz pro Tag).
```json
{
    "schön zum wandern": 
    {
        "2025-03-20": 1.0
    }, 
	"schön zum essen": {
        "2025-04-24": 1.0,
        "2025-05-02": 1.0
    }
}
```

#### `POST /v3/lookup`
```json
{ "Query": "gehen sagen", "Layer": 1, "Year": 2024 }
```
Antwort: `{ "Lookup": "gehen sagen|sage|sagen" }` – je Eingabewort die passenden Werte des Layers (`|`-getrennt, `?` = unbekannt).

#### Beispiel (Python)
```python
import requests
base = "https://www.owid.de/plus/live-2021/api/v3"
print(requests.get(f"{base}/years").json())
r = requests.post(f"{base}/search", json={"N": 1, "Year": 2024,
                  "Items": [{"Position": 0, "Layer": 0, "Token": "deutschland"}]})
print(r.json())
```

### Ältere API und Tools

`API` enthält die aktuelle API v3; `API.v3` ist lediglich ein separates Demoprojekt und ersetzt sie derzeit nicht. Einige Werkzeuge in `Tools` stammen aus älteren Abläufen. `EasyUpload` ist für den Daten-Upload an die API v3 vorgesehen; `Convert` und `LocalDataWriter` beziehen sich auf ältere Arbeitsabläufe und sind für eine normale Installation nicht erforderlich.
