# PLAYER LOBBY — Setup Guide

Alles was du jetzt im Firebase Console noch klicken musst, damit das live geht. Reihenfolge einhalten, sonst kackt's ab.

## 1. Email/Password Login aktivieren
Firebase Console → **Authentication** → Tab **Sign-in method** → **Email/Password** → aktivieren & speichern.
Ohne den Schritt funktioniert `index.html` gar nicht.

## 2. Firestore Database erstellen
Firebase Console → **Firestore Database** → **Create database** → Standort wählen (z.B. `eur3`) → Start im **production mode**.
Die Security Rules sind schon vorbereitet (`firestore.rules`), die deployen wir gleich.

## 3. Realtime Database erstellen
Firebase Console → **Realtime Database** → **Create database** → Standort wählen → **locked mode**.
Danach siehst du oben im Panel die URL, sieht aus wie:
`https://multiplayer-games-163ee-default-rtdb.europe-west1.firebasedatabase.app`

**Wichtig:** Kopier dir diese URL und trag sie in `js/firebase-config.js` bei `databaseURL` ein — da steht aktuell ein Platzholder-Format drin, der muss zu deiner echten URL passen.

## 4. Firebase CLI installieren (einmalig)
```bash
npm install -g firebase-tools
firebase login
```

## 5. Rules deployen
Im Projektordner (wo `firebase.json` liegt):
```bash
firebase deploy --only firestore:rules,database
```
Das pusht `firestore.rules` und `database.rules.json` live — ohne das kann niemand login/online status nutzen, weil alles by default gesperrt ist.

## 6. Website hosten — zwei Optionen

**Option A: Firebase Hosting** (du hattest das ja schon im Screenshot angefangen)
```bash
firebase deploy --only hosting
```
Danach ist die Seite live unter `https://multiplayer-games-163ee.web.app`

**Option B: GitHub Pages**
1. Repo erstellen, diesen ganzen Ordner pushen
2. GitHub Repo → Settings → Pages → Branch auf `main` / Root setzen
3. Fertig, läuft unter `https://<dein-username>.github.io/<repo-name>/`

Beide Optionen können parallel laufen, schadet nix.

## 7. Testen
- Zwei Browserfenster (eins davon Inkognito, sonst teilen sie sich den Login)
- In jedem mit anderem Account registrieren
- Im einen Fenster sollte der andere User unter "ONLINE JETZT" auftauchen
- Invite schicken → im anderen Fenster taucht die Einladung auf → annehmen → beide landen automatisch im Game Room

## Aktueller Stand
- Login/Register ✅
- Online-Status live ✅
- Invite-System ✅
- 1 Spiel eingebaut: **Tic-Tac-Toe** (synced live über Firestore)

## Neues Spiel hinzufügen
Games sind absichtlich modular gehalten:
1. In `js/lobby.js` das `GAMES` Array erweitern (`{ id: "...", name: "..." }`)
2. Eigene `gamename.html` + `js/gamename.js` bauen, ähnlich wie `game.html`/`js/game.js`
3. In `acceptInvite()` (`js/lobby.js`) ggf. je nach `inv.game` auf die richtige HTML-Seite routen, falls mehr als ein Spiel zur Auswahl steht
