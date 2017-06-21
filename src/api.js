import {log} from "./messages"

function JSONRequest(url, onSuccess) {

  /**
   * Call the onSuccess cb with parsed data
   *
   * @param {string} data
   */
  function success(data) {
    return onSuccess(data.parse)
  }

  $.ajax({
    dataType: "json",
    url,
    success,
    error: log
  })
}

export function getPage(page, cb) {
  const url = `/w/api.php?action=parse&page=${page}&format=json&redirects`

  return JSONRequest(url, cb)
}

export function getPageNameFromUrl(url) {
  const [,firstMatch] = /\/wiki\/(.*)\?.*/.exec(url)

  return firstMatch
}
