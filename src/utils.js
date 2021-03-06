import { complainIconNotFound } from "./messages.js"

export const CONFIG_REGEX = /\(#\s?(.*)\)/g // xxx (# y)

export const request = (url, success) => {
  const onSuccess = (data, textStatus) => {
    if (textStatus == "success")
      success(data)
    else
      success(false)
  }

  $.ajax({ url, success: onSuccess })
}
export const wrapToClass = CSSClass => node => node.wrap(`<div class="${CSSClass}"></div>`)
export const wrapInnerToClass = CSSClass => node => node.wrapInner(`<div class="${CSSClass}"></div>`)
export const wrapToTag = tag => node => node.wrap(`<${tag}></${tag}>`)
export const removeExternalMark = $n => $n.find("a").removeClass("external")
export const isInstanceOfjQuery = x => x instanceof jQuery
export const getConfig = t => CONFIG_REGEX.exec(t)
export const removeConfig = t => t.replace(CONFIG_REGEX, "")
export const removeToc = $n => $n.find("#toc").remove()
export const isExternalWikiLink = u => u.indexOf("http://") === 0 || u.indexOf("https://") === 0
export const isPrinting = window.location.search.indexOf("printable=yes") !== -1

export const slug = str => {
  str = str.replace(/^\s+|\s+$/g, "") // trim
  str = str.toLowerCase()

  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;- "
  var to   = "aaaaeeeeiiiioooouuuunc________"
  for (var i=0, l=from.length ; i<l ; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i))
  }

  str = str.replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-") // collapse dashes

  return str
}

export const CONTENT_ID = "#mw-content-text"

export const MENU_LEVEL_1 = "h1"
export const MENU_LEVEL_2 = "h2"
export const MENU_LEVEL_3 = "h3"

export const iconMarkupMap = {
  video: "bases", // vidéo
  texte: "activity",
  quizz: "evaluation",
  prerequis: "prerequis", // Pré-requis
  objectif: "objectif",
  competencesvisees: "competence", // compétences visées
  duree: "duree", // durée
  moocwikivplus: "contrib",
  moocwikivinfo: "info",
  public: "public"
}

export const getIcon = id => {
  const icon = iconMarkupMap[id]

  if (!icon) {
    complainIconNotFound(id)
  }

  return icon
}

export const ALT_TEXT = "Chargement ..."
export const APPEND_CONTENT_LINKS = "#firstHeading"

export const capitalizeFirstLetter = s => s.charAt(0).toUpperCase() + s.slice(1)

/**
 * Menu
 */
export const ITEM_OPEN_BTN = "<div class=\"btn-closed\">Déployer</div>"
export const ITEM_CLOSE_BTN = "<div class=\"btn-open\">Refermer</div>"

export const ariaAttributes = (controls, expanded = false) =>
  `aria-expanded="${expanded}" aria-controls="${controls}"`

export const generateExpandableBtn = (open, close, attributes) =>
  `<div class="expandable sprite" role="button" ${attributes}>${open} ${close}</div>`

export const ariaControls = (level = 1, index = 1) => `item-l${level}-i${index}`

export const truncate = nbr => str =>
  (str.length > nbr) ? str.substring(0, nbr) + "..." : str

export const getIEVersion = () => {
// Returns the version of Internet Explorer or a -1
// (indicating the use of another browser).
  var rv = -1 // Return value assumes failure.
  if (navigator.appName == "Microsoft Internet Explorer") {
    var ua = navigator.userAgent
    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})")
    if (re.exec(ua) != null)
      rv = parseFloat( RegExp.$1 )
  }

  return rv
}

export const getIfLessThan =
  v1 => (str, v2) => (v1 > v2 && v2 !== -1) ? str : ""
