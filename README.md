# gristPdfSelect

Widget Grist qui permet de:

1. lire une colonne utilisée comme menu déroulant,
2. sélectionner une valeur,
3. afficher le PDF joint à la ligne correspondante (colonne de type `Attachments`).

## Démarrer en local

```bash
python3 -m http.server 5173
```

Puis ouvrir <http://localhost:5173>.

> En local, le widget fonctionne en mode démo avec des données fictives.

## Utiliser dans Grist

1. Hébergez ce dossier sur GitHub Pages (ou un autre hébergement statique).
2. Dans Grist, ajoutez un **Custom Widget** et renseignez l'URL publiée.
3. Configurez les colonnes dans les options du widget:
   - `menuColumn`: la colonne à afficher dans le menu déroulant,
   - `pdfColumn`: la colonne de pièces jointes PDF.
4. Le widget affiche automatiquement le PDF de la valeur choisie.

## Structure

- `index.html`: structure de l'interface,
- `styles.css`: styles de la page,
- `widget.js`: logique de connexion à Grist et affichage du PDF.
