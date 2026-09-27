## Note

- Sur chaque nouvelle page du front, définir la variable `page` pour la couleur de bulle et l'état actif du menu : `{% set page = "about" %}`
  - La valeur doit correspondre à la `key` de la page dans `src/data/menu.json`
- À chaque nouvelle page, renseigner le titre via le bloc dédié : `{% block title %}TITRE{% endblock %}`
  - Sinon le navigateur affiche « TITRE MANQUANT »