export const CONFIG_REGEX = /\(#\s?(\S*)\)/g // xxx (# y)

export const request = (url, success) => $.ajax({ url, success })
export const wrapToClass = CSSClass => node => node.wrap(`<div class="${CSSClass}"></div>`)
export const wrapInnerToClass = CSSClass => node => node.wrapInner(`<div class="${CSSClass}"></div>`)
export const wrapToTag = tag => node => node.wrap(`<${tag}></${tag}>`)
export const removeExternalMark = $n => $n.find("a").removeClass("external")
export const isInstanceOfjQuery = x => x instanceof jQuery
export const getConfig = t => CONFIG_REGEX.exec(t)
export const removeConfig = t => t.replace(CONFIG_REGEX, "")
export const removeToc = $n => $n.find("#toc").remove()

export const slug = str => {
  str = str.replace(/^\s+|\s+$/g, "") // trim
  str = str.toLowerCase()

  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;"
  var to   = "aaaaeeeeiiiioooouuuunc------"
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
  quizz: "evaluation"
}

