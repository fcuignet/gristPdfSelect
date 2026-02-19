# gristPdfSelect

Widget Grist qui permet de:

1. choisir la **colonne utilisée pour sélectionner un enregistrement**,
2. choisir la **colonne PDF** à afficher,
3. sélectionner une valeur d'enregistrement,
4. afficher le PDF de la même ligne.

## Démarrer en local

```bash
python3 -m http.server 5173
```

Puis ouvrir <http://localhost:5173>.

> En local, le widget fonctionne en mode démo avec des données fictives.

## Utiliser dans Grist

1. Hébergez ce dossier sur GitHub Pages (ou un autre hébergement statique).
2. Dans Grist, ajoutez un **Custom Widget** et renseignez l'URL publiée.
3. (Optionnel) Configurez des colonnes par défaut dans les options du widget:
   - `menuColumn`: colonne menu par défaut,
   - `pdfColumn`: colonne PDF par défaut.
4. Dans le widget, vous pouvez ensuite changer directement:
   - la colonne menu,
   - la colonne PDF,
   - la valeur d'enregistrement.

## Structure

- `index.html`: structure de l'interface,
- `styles.css`: styles de la page,
- `widget.js`: logique de connexion à Grist et affichage du PDF.
