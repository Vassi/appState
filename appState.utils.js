(function (appState, undefined) {
    appState.utils = appState.utils || {};

    //Taken from Mozilla's implementation https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
    //Removed the "fromIndex" parameter and edited to work standalone.
    var indexOf = function (searchElement, array) {
        if (array === void 0 || array === null) {
            throw new TypeError();
        }
        var t = new Object(array);
        var len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = 0;
        if (n >= len) {
            return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    };


    //We want to be polite and not 'pollute' the array prototype so we use the
    //browser version if it exists, or ours.
    appState.utils.indexOf = function (arrayToSearch, searchElement) {
        ///<summary>Find the index of an element in an array. Returns -1 if not found.</summary>
        ///<param name="arrayToSearch">The array to be searched for the element.</param>
        ///<param name="searchElement">The array whose index we want to find.</param>
        ///<returns type="Number">-1 if no match was found, otherwise the index.</returns>

        if (!Array.prototype.indexOf) {
            return indexOf(searchElement, arrayToSearch);
        }
        else {
            return arrayToSearch.indexOf(searchElement);
        }
    };

    appState.utils.logWarning = function (message) {
        ///<summary>Logs a warning message in the console if present.</summary>

        if (console !== 'undefined' && "log" in console) {
            console.log(message);
        }
    };

    //These are just convenience functions for adding and removing items from a list using 
    //Our IE friendly indexOf. Also filters out non-functions on inserts.
    appState.utils.registerCallback = function (list, callback) {
        if (typeof (callback) !== 'function') {
            appState.utils.logWarning("(" + parentState + "): callback not registered. Object is not a function.");
            return false;
        }
        list.push(callback);
        return true;
    };

    appState.utils.deregisterCallback = function (list, callback) {
        var callbackIndex = appState.utils.indexOf(list, callback);
        if (callbackIndex !== -1) {
            list.splice(callbackIndex, 1);
        }
    };


} (window.appState = window.appState || {}));