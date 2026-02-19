# gristPdfSelect

Widget Grist en fichier unique `index.html` pour afficher le PDF de la ligne sélectionnée.

## Fonctionnement (très simple)

1. Dans les options du widget, configurez **uniquement**:
   - `pdfColumn` = colonne `Attachments` contenant le PDF.
2. Dans la table Grist, cliquez une ligne.
3. Le PDF de cette ligne s’affiche dans le volet du widget.

Le widget lit en priorité la colonne mappée par Grist (`pdfColumn`) puis retombe sur le nom configuré (insensible à la casse). Toute modification de l'option recharge la ligne active.

## Démarrer en local

```bash
python3 -m http.server 5173
```

Puis ouvrir <http://localhost:5173>.

## Structure

- `index.html`: interface + styles + logique Grist (tout-en-un).
