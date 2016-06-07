const CONTENT_ID = "#mw-content-text"

/**
 * @Author Sven SAULEAU <sven.sauleau@xtuc.fr>
 *
 * $ is implicit since jQuery is loaded at the beginning of the page
 */

const request = (url, success) => $.ajax({ url, success })

const renderMenu = data => {
    const menu = $(data).find(CONTENT_ID)

    // Level 1
    menu
        .find("ul")
        .addClass("folder")
        .find("li")
        .wrap("<div class=\"nav-item nav-item-header\"><a href=\"#\"></a></div>")

    // Level 2
    menu
        .find("ol")
        .addClass("lesson")
        .addClass("closed") // Initial closed state
        .find("li")
        .wrap("<div class=\"nav-item nav-item-header\"><a href=\"#\"></a></div>")

    return $("<div></div>").addClass("my-sb-nav").html(menu)
}

// Don't use fat arrow there because `this` will be overwritted by ES6 compilation
const moocwikiv = function(i) {
    const element = $(this)

    element.html("") // Clear content
    element.addClass("my-sb")

    request("https://fr.wikiversity.org/wiki/Utilisateur:Xtuc-Sven/menu-FormationA", (data, status) => {
        element.append(renderMenu(data))
    })
}

$(() => $("#moocwikiv").each(moocwikiv))
