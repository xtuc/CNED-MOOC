import {log} from "./messages"

function JSONRequest(url, onSuccess, onError) {

  /**
   * Call the onSuccess cb with parsed data
   *
   * @param {string} data
   */
  function complete(data) {
    if (data.responseJSON.parse) {
      return onSuccess(data.responseJSON.parse)
    }

    if (data.responseJSON.error && onError) {
      return onError(data.error)
    }
  }

  $.ajax({
    dataType: "json",
    url,
    complete,
    error: log
  })
}

export function getPage(page, onSuccess, onError) {
  const url = `/w/api.php?action=parse&page=${page}&format=json&redirects`

  return JSONRequest(url, onSuccess, onError)
}

export function getPageNameFromUrl(url) {
  const matches = /\/wiki\/(.*)\?.*/.exec(url)

  if (matches && matches[1]) {
    return matches[1]
  }
}
