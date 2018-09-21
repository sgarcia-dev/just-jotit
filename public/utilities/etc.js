window.ETC_MODULE = {
    getQueryStringParam
};

/**
 * Returns the value of a query string parameter. Credit:
 * https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
 * @param {string} name
 * @returns {string} value
 * @example HTTP GET note/details.html?id=5b7b885bcaa2973d30aa2377
 * const id = getQueryStringParam('id'); // Returns 5b7b885bcaa2973d30aa2377
 */
function getQueryStringParam(name) {
    const url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
