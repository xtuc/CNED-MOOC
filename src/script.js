const CONTENT_ID = "#mw-content-text"

const MENU_LEVEL_1 = "h1"
const MENU_LEVEL_2 = "h2"
const MENU_LEVEL_3 = "h3"

const CONFIG_REGEX = /\((\S*)\)/g

const request = (url, success) => $.ajax({ url, success })
const wrapToClass = CSSClass => node => node.wrap(`<div class="${CSSClass}"></div>`)
const wrapInnerToClass = CSSClass => node => node.wrapInner(`<div class="${CSSClass}"></div>`)
const wrapToTag = tag => node => node.wrap(`<${tag}></${tag}>`)
const removeExternalMark = $n => $n.find("a").removeClass("external")
const isInstanceOfjQuery = x => x instanceof jQuery
const getConfig = t => CONFIG_REGEX.exec(t)
const removeConfig = t => t.replace(CONFIG_REGEX, "")

function slug(str) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to   = "aaaaeeeeiiiioooouuuunc------";
  for (var i=0, l=from.length ; i<l ; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return str;
}

const iconMarkupMap = {
  vido: "bases", // vidéo
  texte: "activity",
  quizz: "evaluation"
}

class Menu {
  constructor(menu) {
    this.menu = menu

    this.reducer = this.reducer.bind(this) // Otherwise reduce will override context
    this.foldAccordeon = this.foldAccordeon.bind(this) // Otherwise reduce will override context
  }

  getLastElement = array => array[array.length - 1]
  isLesson = $n => $n.hasClass("lesson")
  isFolder = $n => $n.hasClass("folder")
  isLevel3 = $n => $n.hasClass("level3")

  /**
   * Normalize Mediawiki generated mw-* classes by removing them
   */
  normalizeItem = $n => $n.get(0).innerHTML

  /**
   * Remove link target and title
   */
  normalizeLink = e => $(e).attr("href", `#${slug($(e).text())}`).attr("title", "").get()

  applyAccordeon(element) {
    // Add expandable icon
    element.find(".nav-item").append('<div class="expandable sprite"> <div class="btn-closed">Déployer</div> <div class="btn-open">Refermer</div> </div>')

    // console.log("apply", element.find(".nav-item-content").children().length)
    // console.log("apply", element.find(".nav-item-content").find("div").length)

    element.find(".nav-item-header").find("a, .expandable").click(() => {
      element.toggleClass("closed")
      element.toggleClass("open")
    })
  }

  /**
   * Generate items for level 1 menu
   *
   * @param item Current item in the loop (jQuery DOM Node)
   * @param lastItem I-1 item (jQuery DOM Node)
   */
  generateLevel1(item, lastItem) {
    item = this.normalizeItem(item)
    const levelClass = "folder"

    /**
     * Remove link from a level1 item
     */
    if ($(item).get(0).tagName === "A") {
      item = this.normalizeLink(item)
    }

    item = $("<div />").addClass("nav-item nav-item-header").wrapInner(item)

    // To folder with initial closed
    item = $("<div />").addClass(`${levelClass} closed`).wrapInner(item)

    // Append the lesson elements container
    $("<div />").addClass("nav-item-content").appendTo(item)

    this.applyAccordeon(item)

    return item
  }

  /**
   * Generate items for level 2 menu
   *
   * @param item Current item in the loop (jQuery DOM Node)
   * @param lastItem I-1 item (jQuery DOM Node)
   */
  generateLevel2(item, lastItem) {
    item = this.normalizeItem(item)
    const levelClass = "lesson"

    /**
     * Remove link from a level1 item
     */
    if ($(item).get(0).tagName === "A") {
      item = this.normalizeLink(item)
    }

    item = $("<div />").addClass("nav-item nav-item-header").wrapInner(item)

    // To lesson with initial closed
    item = $("<div />").addClass(`${levelClass} closed`).wrapInner(item)

    // Append the lesson elements container
    $("<div />").addClass("nav-item-content").appendTo(item)

    this.applyAccordeon(item)

    return item
  }

  /**
   * Generate items for level 3 menu
   *
   * @param item Current item in the loop (jQuery DOM Node)
   * @param lastItem I-1 item (jQuery DOM Node)
   */
  generateLevel3(item, lastItem) {
    item = this.normalizeItem(item)
    const levelClass = "level3"

    /**
     * Check for configuration xxx (y)
     */
    const regexRes = getConfig(item)

    item = removeConfig(item)

    item = $("<div />").addClass("nav-item nav-item-lesson " + levelClass).wrapInner(item)

    if (regexRes && regexRes[1]) {
      const value = iconMarkupMap[slug(regexRes[1])]

      if(value) item.addClass(value) // Apply configuration
    }

    return item
  }

  reducer(acc, element) {
    const p = n => $(n).find(".mw-headline")

    const $e = p(element)
    const lastItem = this.getLastElement(acc)

    var state = false

    // for debuging purposes
    try {

      if (element.tagName === "H1")
        state = this.generateLevel1($e, lastItem)
      else if (element.tagName === "H2")
        state = this.generateLevel2($e, lastItem)
      else if (element.tagName === "H3")
        state = this.generateLevel3($e, lastItem)

    } catch(e) {
      console.error(e)
    }

    if(state)
      acc.push(state)

    return acc
  }

  foldAccordeon(acc, element) {

    // Level 2
    if (this.isLesson(element)) {
      console.log(acc[0].get(0))

      acc.map(e => e.appendTo(element.find(".nav-item-content")))

      acc = []
    }

    // Level 3
    if (this.isLevel3(element)) {
      acc.push(element)
    }

    return acc
  }

  generate() {
    const $menu = $(this.menu)
    removeExternalMark($menu) // Remove external icon in links

    const generated = this.menu.reduce(this.reducer, [])

    // Depth-first, fold all trailing accordeons
    generated.slice().reverse().reduce(this.foldAccordeon, [])

    return $("<div></div>").addClass("my-sb-nav").html(generated)
  }
}

/**
 * Loader
 */
const startLoader = page => page.html("Chargement ...")
const stopLoaderAndReplace = (page, element) => page.html(element)

/**
 * @Author Sven SAULEAU (XTUC) <sven.sauleau@xtuc.fr>
 *
 * $ is implicit since jQuery is loaded at the beginning of the page
 */

const log = function() {
  console.log(this)
}

// Don't use fat arrow there because `this` will be overwritted by ES6 compilation
const moocwikiv = function(i) {
  const page = $(this)
  const element = $("<div></div>")

  /**
   * Clean traling file imports in p
   */
  page.parent().find("p").html("")

  page.html("") // Clear content
  startLoader(page) // Start loader

  page.addClass("my-sb")

  request("https://fr.wikiversity.org/wiki/Utilisateur:Xtuc-Sven/menu-FormationB", (data, status) => {
    data = $(data)
                .find(CONTENT_ID)
                .children()
                .get() // get DOM element

    let menu = new Menu(data)

    element.append(menu.generate())
    stopLoaderAndReplace(page, element)
  })

  console.clear() // for debug purpose
}

$(() => $("#moocwikiv").each(moocwikiv))
