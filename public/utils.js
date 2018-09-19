// Documented using JSDoc
// https://en.wikipedia.org/wiki/JSDoc

/**
 * Shorthand for $.ajax with integrated error handling and automatic json request
 * @param {object} options 
 * @param {string} options.method
 * @param {string} options.url
 * @param {object} options.data
 * @param {function} options.callback  
 */
function ajax(options) {
    $.ajax({
        type: options.method,
        url: options.url,
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(options.data),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${options.jwtToken}`);
        },
        success: options.callback,
        error: err => {
            alert('Internal Server Error (see console)');
            console.error(err);
        }
    });
}

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
