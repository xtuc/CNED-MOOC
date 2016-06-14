export default class Breadcrumb {

  constructor() {
  }

  generate() {
    return $("<div />")
                  .addClass("my-breadcrumb")
                  .html("Piloter l'accessibilité &gt; <a href=\"https://fr.wikiversity.org/wiki/Comprendre_l%27accessibilit%C3%A9\" title=\"Comprendre l'accessibilité\">Initier une démarche d'accessibilité</a> &gt; <strong>Activités d'apprentissage</strong>")
  }
}
