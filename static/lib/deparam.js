var deparam = function () {

    /**!
     * Deparam plugin converts query string to a valid JavaScript object
     * Released under MIT license
     * @name Deparam.js
     * @author Sachin Singh <contactsachinsingh@gmail.com>
     * @version 2.0.11
     * @license MIT
     */
    // Vars
    const isBrowser = typeof window !== "undefined";

    // Shorthand for built-ins
    const isArr = Array.isArray;

    /**
     * Checks if input is a number
     * @param {*} key 
     */
    function isNumber(key) {
        key = (key + "").trim();
        if (['null', 'undefined', ''].indexOf(key) > -1) return false;
        return !isNaN(Number(key));
    }

    /**
     * Checks if key is a true object
     * @param {*} key Any type of value
     */
    function isObject(key) {
        return (key != null && !isArr(key) && key.toString() === "[object Object]");
    }

    /**
     * Checks if query parameter key is a complex notation
     * @param {string} q 
     */
    function ifComplex(q) {
        return (/\[/.test(q));
    }

    /**
     * Sets default value
     * @param {*} value Any value
     * @param {*} defaultValue Default value if value is undefined
     */
    function setDefault(value, defaultValue) {
        return typeof value === 'undefined' ? defaultValue : value;
    }

    /**
     * Converts query string to JavaScript object
     * @param {string} qs query string argument (defaults to url query string)
     */
    function deparam(qs, coerce) {
        qs = setDefault(qs, (isBrowser ? window.location.search : "")).trim();
        coerce = setDefault(coerce, true);
        if (qs.charAt(0) === "?") {
            qs = qs.replace("?", "");
        }
        const queryParamList = qs.split("&");
        const queryObject = {};
        if (qs) {
            queryParamList.forEach((qq) => {
                const qArr = qq.split("=").map(part => decodeURIComponent(part));
                if (ifComplex(qArr[0])) {
                    complex.apply(this, [].concat(qArr).concat([queryObject, coerce]));
                } else {
                    simple.apply(this, [qArr, queryObject, false, coerce]);
                }
            });
        }
        return queryObject;
    }

    /**
     * Converts an array to an object
     * @param {array} arr 
     */
    function toObject(arr) {
        var convertedObj = {};
        if (isArr(arr)) {
            arr.forEach((value, index) => {
                convertedObj[index] = value;
            });
        }
        return convertedObj;
    }

    /**
     * Resolves an array to object if required
     * @param {array} ob An array object
     * @param {boolean} isNumber flag to test if next key is number
     */
    function resolve(ob, isNextNumber) {
        if (typeof ob === "undefined") return isNextNumber ? [] : {};
        return isNextNumber ? ob : toObject(ob);
    }

    /**
     * Resolves the target object for next iteration
     * @param {Object} ob current reference object
     * @param {string} nextProp reference property in current object
     */
    function resolveObj(ob, nextProp) {
        if (isObject(ob)) return { ob };
        if (isArr(ob) || typeof ob === "undefined") return { ob: resolve(ob, isNumber(nextProp)) };
        return { ob: [ob], push: ob !== null };
    }

    /**
     * Handles complex query parameters
     * @param {string} key 
     * @param {string} value 
     * @param {Object} obj 
     */
    function complex(key, value, obj, doCoerce) {
        doCoerce = setDefault(doCoerce, true);
        const match = key.match(/([^\[]+)\[([^\[]*)\]/) || [];
        if (match.length === 3) {
            let prop = match[1];
            let nextProp = match[2];
            key = key.replace(/\[([^\[]*)\]/, "");
            if (ifComplex(key)) {
                if (nextProp === "") nextProp = "0";
                key = key.replace(/[^\[]+/, nextProp);
                complex(key, value, (obj[prop] = resolveObj(obj[prop], nextProp).ob), doCoerce);
            } else if (nextProp) {
                const { ob, push } = resolveObj(obj[prop], nextProp);
                obj[prop] = ob;
                if (push) {
                    obj[prop].push({
                        [nextProp]: (doCoerce ? coerce(value) : value)
                    });
                } else {
                    obj[prop][nextProp] = (doCoerce ? coerce(value) : value);
                }
            } else {
                simple([match[1], value], obj, true);
            }
        }
    }

    /**
     * Handles simple query
     * @param {array} qArr 
     * @param {Object} queryObject 
     * @param {boolean} toArray 
     */
    function simple(qArr, queryObject, toArray, doCoerce) {
        doCoerce = setDefault(doCoerce, true);
        let key = qArr[0];
        let value = qArr[1];
        if (doCoerce) {
            value = coerce(value);
        }
        if (key in queryObject) {
            queryObject[key] = isArr(queryObject[key]) ? queryObject[key] : [queryObject[key]];
            queryObject[key].push(value);
        } else {
            queryObject[key] = toArray ? [value] : value;
        }
    }

    /**
     * Restores values to their original type
     * @param {string} value undefined or string value
     */
    function coerce(value) {
        if (value == null) return "";
        if (typeof value !== "string") return value;
        value = value.trim();
        if (isNumber(value)) return +value;
        switch (value) {
            case "null": return null;
            case "undefined": return undefined;
            case "true": return true;
            case "false": return false;
            case "NaN": return NaN;
            default: return value;
        }
    }

    return deparam;
}();