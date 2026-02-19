# gristPdfSelect

Widget Grist en fichier unique `index.html` pour afficher le PDF de la ligne sélectionnée.

## Fonctionnement (très simple)

1. Dans les options du widget, configurez **uniquement**:
   - `pdfColumn` = colonne `Attachments` contenant le PDF.
2. Dans la table Grist, cliquez une ligne.
3. Le PDF de cette ligne s’affiche dans le volet du widget.

Le nom de `pdfColumn` est pris en compte de façon robuste (insensible à la casse) et toute modification de l'option recharge l'affichage de la ligne active.

## Démarrer en local

```bash
python3 -m http.server 5173
```

Puis ouvrir <http://localhost:5173>.

## Structure

- `index.html`: interface + styles + logique Grist (tout-en-un).
