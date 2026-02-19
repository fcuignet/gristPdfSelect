# gristPdfSelect

Widget Grist en fichier unique `index.html` pour afficher le PDF de la ligne sélectionnée.

## Fonctionnement

1. Dans les options du widget, configurez:
   - `pdfColumn` = colonne **de type Pièce jointe / Attachments** contenant le PDF.
2. Dans la table Grist, cliquez une ligne.
3. Le widget charge la pièce jointe et l'affiche directement dans le volet PDF.

Le widget lit la valeur mappée par Grist (`record.pdfColumn`) et recharge automatiquement l’affichage quand `pdfColumn` change.

## Démarrer en local

```bash
python3 -m http.server 5173
```

Puis ouvrir <http://localhost:5173>.

## Structure

- `index.html`: interface + styles + logique Grist (tout-en-un).
