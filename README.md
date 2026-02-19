# gristPdfSelect

Widget Grist en fichier unique `index.html` pour choisir une fiche dans un menu déroulant et afficher son PDF.

## Fonctionnement simple

1. Dans les options du widget, configurez:
   - `menuColumn` = colonne qui sert de menu déroulant (fiche),
   - `pdfColumn` = colonne `Attachments` contenant le PDF.
2. Dans le widget, sélectionnez une fiche dans le menu déroulant.
3. Le PDF de cette fiche s'affiche directement dans la vue (iframe).

> La configuration des colonnes se fait uniquement dans les options du widget Grist (pas depuis l'interface du widget).

## Démarrer en local

```bash
python3 -m http.server 5173
```

Puis ouvrir <http://localhost:5173>.

## Structure

- `index.html`: interface + styles + logique Grist (tout-en-un).
