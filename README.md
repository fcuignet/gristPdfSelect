# gristPdfSelect

Widget Grist en fichier unique `index.html` pour afficher un PDF attaché selon l’enregistrement sélectionné.

## Fonctionnement

Le widget:

1. lit la colonne menu configurée dans les **options du widget** (`menuColumn`),
2. affiche la liste des enregistrements via un menu déroulant,
3. lit la colonne PDF configurée dans les **options du widget** (`pdfColumn`),
4. affiche le PDF de la même ligne dans la vue intégrée.

> Les colonnes ne sont **pas configurables depuis l’interface du widget** : elles se règlent uniquement dans les options Grist du widget.

## Démarrer en local

```bash
python3 -m http.server 5173
```

Puis ouvrir <http://localhost:5173>.

## Utiliser dans Grist

1. Hébergez `index.html` (GitHub Pages ou autre hébergement statique).
2. Dans Grist, ajoutez un **Custom Widget** et renseignez l'URL publiée.
3. Configurez les options du widget:
   - `menuColumn`: colonne de sélection de l’enregistrement,
   - `pdfColumn`: colonne de type `Attachments` contenant le PDF.

## Structure

- `index.html`: interface + styles + logique Grist (tout-en-un).
