function _mergeNamespaces(n, m) {
  m.forEach(function(e) {
    e && typeof e !== "string" && !Array.isArray(e) && Object.keys(e).forEach(function(k) {
      if (k !== "default" && !(k in n)) {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function() {
            return e[k];
          }
        });
      }
    });
  });
  return Object.freeze(Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }));
}
var axios$2 = { exports: {} };
var bind$2 = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};
var bind$1 = bind$2;
var toString = Object.prototype.toString;
function isArray(val) {
  return Array.isArray(val);
}
function isUndefined(val) {
  return typeof val === "undefined";
}
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && typeof val.constructor.isBuffer === "function" && val.constructor.isBuffer(val);
}
function isArrayBuffer(val) {
  return toString.call(val) === "[object ArrayBuffer]";
}
function isFormData(val) {
  return toString.call(val) === "[object FormData]";
}
function isArrayBufferView(val) {
  var result;
  if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && isArrayBuffer(val.buffer);
  }
  return result;
}
function isString(val) {
  return typeof val === "string";
}
function isNumber(val) {
  return typeof val === "number";
}
function isObject(val) {
  return val !== null && typeof val === "object";
}
function isPlainObject(val) {
  if (toString.call(val) !== "[object Object]") {
    return false;
  }
  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}
function isDate(val) {
  return toString.call(val) === "[object Date]";
}
function isFile(val) {
  return toString.call(val) === "[object File]";
}
function isBlob(val) {
  return toString.call(val) === "[object Blob]";
}
function isFunction(val) {
  return toString.call(val) === "[object Function]";
}
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}
function isURLSearchParams(val) {
  return toString.call(val) === "[object URLSearchParams]";
}
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "");
}
function isStandardBrowserEnv() {
  if (typeof navigator !== "undefined" && (navigator.product === "ReactNative" || navigator.product === "NativeScript" || navigator.product === "NS")) {
    return false;
  }
  return typeof window !== "undefined" && typeof document !== "undefined";
}
function forEach(obj, fn) {
  if (obj === null || typeof obj === "undefined") {
    return;
  }
  if (typeof obj !== "object") {
    obj = [obj];
  }
  if (isArray(obj)) {
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}
function merge() {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }
  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === "function") {
      a[key] = bind$1(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}
function stripBOM(content) {
  if (content.charCodeAt(0) === 65279) {
    content = content.slice(1);
  }
  return content;
}
var utils$e = {
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isObject,
  isPlainObject,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isFunction,
  isStream,
  isURLSearchParams,
  isStandardBrowserEnv,
  forEach,
  merge,
  extend,
  trim,
  stripBOM
};
var utils$d = utils$e;
function encode(val) {
  return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
var buildURL$2 = function buildURL(url, params, paramsSerializer) {
  if (!params) {
    return url;
  }
  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils$d.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];
    utils$d.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === "undefined") {
        return;
      }
      if (utils$d.isArray(val)) {
        key = key + "[]";
      } else {
        val = [val];
      }
      utils$d.forEach(val, function parseValue(v) {
        if (utils$d.isDate(v)) {
          v = v.toISOString();
        } else if (utils$d.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + "=" + encode(v));
      });
    });
    serializedParams = parts.join("&");
  }
  if (serializedParams) {
    var hashmarkIndex = url.indexOf("#");
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
  }
  return url;
};
var utils$c = utils$e;
function InterceptorManager$1() {
  this.handlers = [];
}
InterceptorManager$1.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled,
    rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};
InterceptorManager$1.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};
InterceptorManager$1.prototype.forEach = function forEach2(fn) {
  utils$c.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};
var InterceptorManager_1 = InterceptorManager$1;
var utils$b = utils$e;
var normalizeHeaderName$1 = function normalizeHeaderName(headers, normalizedName) {
  utils$b.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};
var enhanceError$2 = function enhanceError(error, config, code, request2, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.request = request2;
  error.response = response;
  error.isAxiosError = true;
  error.toJSON = function toJSON() {
    return {
      message: this.message,
      name: this.name,
      description: this.description,
      number: this.number,
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      config: this.config,
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  };
  return error;
};
var transitional = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};
var enhanceError$1 = enhanceError$2;
var createError$2 = function createError(message, config, code, request2, response) {
  var error = new Error(message);
  return enhanceError$1(error, config, code, request2, response);
};
var createError$1 = createError$2;
var settle$1 = function settle(resolve, reject, response) {
  var validateStatus2 = response.config.validateStatus;
  if (!response.status || !validateStatus2 || validateStatus2(response.status)) {
    resolve(response);
  } else {
    reject(createError$1("Request failed with status code " + response.status, response.config, null, response.request, response));
  }
};
var utils$a = utils$e;
var cookies$1 = utils$a.isStandardBrowserEnv() ? function standardBrowserEnv() {
  return {
    write: function write(name, value, expires, path, domain, secure) {
      var cookie = [];
      cookie.push(name + "=" + encodeURIComponent(value));
      if (utils$a.isNumber(expires)) {
        cookie.push("expires=" + new Date(expires).toGMTString());
      }
      if (utils$a.isString(path)) {
        cookie.push("path=" + path);
      }
      if (utils$a.isString(domain)) {
        cookie.push("domain=" + domain);
      }
      if (secure === true) {
        cookie.push("secure");
      }
      document.cookie = cookie.join("; ");
    },
    read: function read(name) {
      var match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
      return match ? decodeURIComponent(match[3]) : null;
    },
    remove: function remove(name) {
      this.write(name, "", Date.now() - 864e5);
    }
  };
}() : function nonStandardBrowserEnv() {
  return {
    write: function write() {
    },
    read: function read() {
      return null;
    },
    remove: function remove() {
    }
  };
}();
var isAbsoluteURL$1 = function isAbsoluteURL(url) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
};
var combineURLs$1 = function combineURLs(baseURL, relativeURL) {
  return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
};
var isAbsoluteURL2 = isAbsoluteURL$1;
var combineURLs2 = combineURLs$1;
var buildFullPath$1 = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL2(requestedURL)) {
    return combineURLs2(baseURL, requestedURL);
  }
  return requestedURL;
};
var utils$9 = utils$e;
var ignoreDuplicateOf = [
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent"
];
var parseHeaders$1 = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;
  if (!headers) {
    return parsed;
  }
  utils$9.forEach(headers.split("\n"), function parser(line) {
    i = line.indexOf(":");
    key = utils$9.trim(line.substr(0, i)).toLowerCase();
    val = utils$9.trim(line.substr(i + 1));
    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === "set-cookie") {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
      }
    }
  });
  return parsed;
};
var utils$8 = utils$e;
var isURLSameOrigin$1 = utils$8.isStandardBrowserEnv() ? function standardBrowserEnv2() {
  var msie = /(msie|trident)/i.test(navigator.userAgent);
  var urlParsingNode = document.createElement("a");
  var originURL;
  function resolveURL(url) {
    var href = url;
    if (msie) {
      urlParsingNode.setAttribute("href", href);
      href = urlParsingNode.href;
    }
    urlParsingNode.setAttribute("href", href);
    return {
      href: urlParsingNode.href,
      protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
      host: urlParsingNode.host,
      search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
      hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
      hostname: urlParsingNode.hostname,
      port: urlParsingNode.port,
      pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
    };
  }
  originURL = resolveURL(window.location.href);
  return function isURLSameOrigin2(requestURL) {
    var parsed = utils$8.isString(requestURL) ? resolveURL(requestURL) : requestURL;
    return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
  };
}() : function nonStandardBrowserEnv2() {
  return function isURLSameOrigin2() {
    return true;
  };
}();
function Cancel$3(message) {
  this.message = message;
}
Cancel$3.prototype.toString = function toString2() {
  return "Cancel" + (this.message ? ": " + this.message : "");
};
Cancel$3.prototype.__CANCEL__ = true;
var Cancel_1 = Cancel$3;
var utils$7 = utils$e;
var settle2 = settle$1;
var cookies = cookies$1;
var buildURL$1 = buildURL$2;
var buildFullPath2 = buildFullPath$1;
var parseHeaders2 = parseHeaders$1;
var isURLSameOrigin = isURLSameOrigin$1;
var createError2 = createError$2;
var transitionalDefaults$1 = transitional;
var Cancel$2 = Cancel_1;
var xhr = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;
    var onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }
      if (config.signal) {
        config.signal.removeEventListener("abort", onCanceled);
      }
    }
    if (utils$7.isFormData(requestData)) {
      delete requestHeaders["Content-Type"];
    }
    var request2 = new XMLHttpRequest();
    if (config.auth) {
      var username = config.auth.username || "";
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : "";
      requestHeaders.Authorization = "Basic " + btoa(username + ":" + password);
    }
    var fullPath = buildFullPath2(config.baseURL, config.url);
    request2.open(config.method.toUpperCase(), buildURL$1(fullPath, config.params, config.paramsSerializer), true);
    request2.timeout = config.timeout;
    function onloadend() {
      if (!request2) {
        return;
      }
      var responseHeaders = "getAllResponseHeaders" in request2 ? parseHeaders2(request2.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === "text" || responseType === "json" ? request2.responseText : request2.response;
      var response = {
        data: responseData,
        status: request2.status,
        statusText: request2.statusText,
        headers: responseHeaders,
        config,
        request: request2
      };
      settle2(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);
      request2 = null;
    }
    if ("onloadend" in request2) {
      request2.onloadend = onloadend;
    } else {
      request2.onreadystatechange = function handleLoad() {
        if (!request2 || request2.readyState !== 4) {
          return;
        }
        if (request2.status === 0 && !(request2.responseURL && request2.responseURL.indexOf("file:") === 0)) {
          return;
        }
        setTimeout(onloadend);
      };
    }
    request2.onabort = function handleAbort() {
      if (!request2) {
        return;
      }
      reject(createError2("Request aborted", config, "ECONNABORTED", request2));
      request2 = null;
    };
    request2.onerror = function handleError() {
      reject(createError2("Network Error", config, null, request2));
      request2 = null;
    };
    request2.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = config.timeout ? "timeout of " + config.timeout + "ms exceeded" : "timeout exceeded";
      var transitional3 = config.transitional || transitionalDefaults$1;
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError2(timeoutErrorMessage, config, transitional3.clarifyTimeoutError ? "ETIMEDOUT" : "ECONNABORTED", request2));
      request2 = null;
    };
    if (utils$7.isStandardBrowserEnv()) {
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ? cookies.read(config.xsrfCookieName) : void 0;
      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }
    if ("setRequestHeader" in request2) {
      utils$7.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === "undefined" && key.toLowerCase() === "content-type") {
          delete requestHeaders[key];
        } else {
          request2.setRequestHeader(key, val);
        }
      });
    }
    if (!utils$7.isUndefined(config.withCredentials)) {
      request2.withCredentials = !!config.withCredentials;
    }
    if (responseType && responseType !== "json") {
      request2.responseType = config.responseType;
    }
    if (typeof config.onDownloadProgress === "function") {
      request2.addEventListener("progress", config.onDownloadProgress);
    }
    if (typeof config.onUploadProgress === "function" && request2.upload) {
      request2.upload.addEventListener("progress", config.onUploadProgress);
    }
    if (config.cancelToken || config.signal) {
      onCanceled = function(cancel) {
        if (!request2) {
          return;
        }
        reject(!cancel || cancel && cancel.type ? new Cancel$2("canceled") : cancel);
        request2.abort();
        request2 = null;
      };
      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener("abort", onCanceled);
      }
    }
    if (!requestData) {
      requestData = null;
    }
    request2.send(requestData);
  });
};
var utils$6 = utils$e;
var normalizeHeaderName2 = normalizeHeaderName$1;
var enhanceError2 = enhanceError$2;
var transitionalDefaults = transitional;
var DEFAULT_CONTENT_TYPE = {
  "Content-Type": "application/x-www-form-urlencoded"
};
function setContentTypeIfUnset(headers, value) {
  if (!utils$6.isUndefined(headers) && utils$6.isUndefined(headers["Content-Type"])) {
    headers["Content-Type"] = value;
  }
}
function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== "undefined") {
    adapter = xhr;
  } else if (typeof process !== "undefined" && Object.prototype.toString.call(process) === "[object process]") {
    adapter = xhr;
  }
  return adapter;
}
function stringifySafely(rawValue, parser, encoder) {
  if (utils$6.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils$6.trim(rawValue);
    } catch (e) {
      if (e.name !== "SyntaxError") {
        throw e;
      }
    }
  }
  return (encoder || JSON.stringify)(rawValue);
}
var defaults$3 = {
  transitional: transitionalDefaults,
  adapter: getDefaultAdapter(),
  transformRequest: [function transformRequest(data2, headers) {
    normalizeHeaderName2(headers, "Accept");
    normalizeHeaderName2(headers, "Content-Type");
    if (utils$6.isFormData(data2) || utils$6.isArrayBuffer(data2) || utils$6.isBuffer(data2) || utils$6.isStream(data2) || utils$6.isFile(data2) || utils$6.isBlob(data2)) {
      return data2;
    }
    if (utils$6.isArrayBufferView(data2)) {
      return data2.buffer;
    }
    if (utils$6.isURLSearchParams(data2)) {
      setContentTypeIfUnset(headers, "application/x-www-form-urlencoded;charset=utf-8");
      return data2.toString();
    }
    if (utils$6.isObject(data2) || headers && headers["Content-Type"] === "application/json") {
      setContentTypeIfUnset(headers, "application/json");
      return stringifySafely(data2);
    }
    return data2;
  }],
  transformResponse: [function transformResponse(data2) {
    var transitional3 = this.transitional || defaults$3.transitional;
    var silentJSONParsing = transitional3 && transitional3.silentJSONParsing;
    var forcedJSONParsing = transitional3 && transitional3.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === "json";
    if (strictJSONParsing || forcedJSONParsing && utils$6.isString(data2) && data2.length) {
      try {
        return JSON.parse(data2);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === "SyntaxError") {
            throw enhanceError2(e, this, "E_JSON_PARSE");
          }
          throw e;
        }
      }
    }
    return data2;
  }],
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },
  headers: {
    common: {
      "Accept": "application/json, text/plain, */*"
    }
  }
};
utils$6.forEach(["delete", "get", "head"], function forEachMethodNoData(method) {
  defaults$3.headers[method] = {};
});
utils$6.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
  defaults$3.headers[method] = utils$6.merge(DEFAULT_CONTENT_TYPE);
});
var defaults_1 = defaults$3;
var utils$5 = utils$e;
var defaults$2 = defaults_1;
var transformData$1 = function transformData(data2, headers, fns) {
  var context = this || defaults$2;
  utils$5.forEach(fns, function transform(fn) {
    data2 = fn.call(context, data2, headers);
  });
  return data2;
};
var isCancel$1 = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};
var utils$4 = utils$e;
var transformData2 = transformData$1;
var isCancel2 = isCancel$1;
var defaults$1 = defaults_1;
var Cancel$1 = Cancel_1;
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
  if (config.signal && config.signal.aborted) {
    throw new Cancel$1("canceled");
  }
}
var dispatchRequest$1 = function dispatchRequest(config) {
  throwIfCancellationRequested(config);
  config.headers = config.headers || {};
  config.data = transformData2.call(config, config.data, config.headers, config.transformRequest);
  config.headers = utils$4.merge(config.headers.common || {}, config.headers[config.method] || {}, config.headers);
  utils$4.forEach(["delete", "get", "head", "post", "put", "patch", "common"], function cleanHeaderConfig(method) {
    delete config.headers[method];
  });
  var adapter = config.adapter || defaults$1.adapter;
  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);
    response.data = transformData2.call(config, response.data, response.headers, config.transformResponse);
    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel2(reason)) {
      throwIfCancellationRequested(config);
      if (reason && reason.response) {
        reason.response.data = transformData2.call(config, reason.response.data, reason.response.headers, config.transformResponse);
      }
    }
    return Promise.reject(reason);
  });
};
var utils$3 = utils$e;
var mergeConfig$2 = function mergeConfig(config1, config2) {
  config2 = config2 || {};
  var config = {};
  function getMergedValue(target, source2) {
    if (utils$3.isPlainObject(target) && utils$3.isPlainObject(source2)) {
      return utils$3.merge(target, source2);
    } else if (utils$3.isPlainObject(source2)) {
      return utils$3.merge({}, source2);
    } else if (utils$3.isArray(source2)) {
      return source2.slice();
    }
    return source2;
  }
  function mergeDeepProperties(prop) {
    if (!utils$3.isUndefined(config2[prop])) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (!utils$3.isUndefined(config1[prop])) {
      return getMergedValue(void 0, config1[prop]);
    }
  }
  function valueFromConfig2(prop) {
    if (!utils$3.isUndefined(config2[prop])) {
      return getMergedValue(void 0, config2[prop]);
    }
  }
  function defaultToConfig2(prop) {
    if (!utils$3.isUndefined(config2[prop])) {
      return getMergedValue(void 0, config2[prop]);
    } else if (!utils$3.isUndefined(config1[prop])) {
      return getMergedValue(void 0, config1[prop]);
    }
  }
  function mergeDirectKeys(prop) {
    if (prop in config2) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      return getMergedValue(void 0, config1[prop]);
    }
  }
  var mergeMap = {
    "url": valueFromConfig2,
    "method": valueFromConfig2,
    "data": valueFromConfig2,
    "baseURL": defaultToConfig2,
    "transformRequest": defaultToConfig2,
    "transformResponse": defaultToConfig2,
    "paramsSerializer": defaultToConfig2,
    "timeout": defaultToConfig2,
    "timeoutMessage": defaultToConfig2,
    "withCredentials": defaultToConfig2,
    "adapter": defaultToConfig2,
    "responseType": defaultToConfig2,
    "xsrfCookieName": defaultToConfig2,
    "xsrfHeaderName": defaultToConfig2,
    "onUploadProgress": defaultToConfig2,
    "onDownloadProgress": defaultToConfig2,
    "decompress": defaultToConfig2,
    "maxContentLength": defaultToConfig2,
    "maxBodyLength": defaultToConfig2,
    "transport": defaultToConfig2,
    "httpAgent": defaultToConfig2,
    "httpsAgent": defaultToConfig2,
    "cancelToken": defaultToConfig2,
    "socketPath": defaultToConfig2,
    "responseEncoding": defaultToConfig2,
    "validateStatus": mergeDirectKeys
  };
  utils$3.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
    var merge2 = mergeMap[prop] || mergeDeepProperties;
    var configValue = merge2(prop);
    utils$3.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config[prop] = configValue);
  });
  return config;
};
var data = {
  "version": "0.26.1"
};
var VERSION = data.version;
var validators$1 = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach(function(type, i) {
  validators$1[type] = function validator2(thing) {
    return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
  };
});
var deprecatedWarnings = {};
validators$1.transitional = function transitional2(validator2, version, message) {
  function formatMessage(opt, desc) {
    return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
  }
  return function(value, opt, opts) {
    if (validator2 === false) {
      throw new Error(formatMessage(opt, " has been removed" + (version ? " in " + version : "")));
    }
    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      console.warn(formatMessage(opt, " has been deprecated since v" + version + " and will be removed in the near future"));
    }
    return validator2 ? validator2(value, opt, opts) : true;
  };
};
function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== "object") {
    throw new TypeError("options must be an object");
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator2 = schema[opt];
    if (validator2) {
      var value = options[opt];
      var result = value === void 0 || validator2(value, opt, options);
      if (result !== true) {
        throw new TypeError("option " + opt + " must be " + result);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw Error("Unknown option " + opt);
    }
  }
}
var validator$1 = {
  assertOptions,
  validators: validators$1
};
var utils$2 = utils$e;
var buildURL2 = buildURL$2;
var InterceptorManager = InterceptorManager_1;
var dispatchRequest2 = dispatchRequest$1;
var mergeConfig$1 = mergeConfig$2;
var validator = validator$1;
var validators = validator.validators;
function Axios$1(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}
Axios$1.prototype.request = function request(configOrUrl, config) {
  if (typeof configOrUrl === "string") {
    config = config || {};
    config.url = configOrUrl;
  } else {
    config = configOrUrl || {};
  }
  config = mergeConfig$1(this.defaults, config);
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = "get";
  }
  var transitional3 = config.transitional;
  if (transitional3 !== void 0) {
    validator.assertOptions(transitional3, {
      silentJSONParsing: validators.transitional(validators.boolean),
      forcedJSONParsing: validators.transitional(validators.boolean),
      clarifyTimeoutError: validators.transitional(validators.boolean)
    }, false);
  }
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
      return;
    }
    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });
  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });
  var promise;
  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest2, void 0];
    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);
    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }
    return promise;
  }
  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }
  try {
    promise = dispatchRequest2(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }
  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }
  return promise;
};
Axios$1.prototype.getUri = function getUri(config) {
  config = mergeConfig$1(this.defaults, config);
  return buildURL2(config.url, config.params, config.paramsSerializer).replace(/^\?/, "");
};
utils$2.forEach(["delete", "get", "head", "options"], function forEachMethodNoData2(method) {
  Axios$1.prototype[method] = function(url, config) {
    return this.request(mergeConfig$1(config || {}, {
      method,
      url,
      data: (config || {}).data
    }));
  };
});
utils$2.forEach(["post", "put", "patch"], function forEachMethodWithData2(method) {
  Axios$1.prototype[method] = function(url, data2, config) {
    return this.request(mergeConfig$1(config || {}, {
      method,
      url,
      data: data2
    }));
  };
});
var Axios_1 = Axios$1;
var Cancel = Cancel_1;
function CancelToken(executor) {
  if (typeof executor !== "function") {
    throw new TypeError("executor must be a function.");
  }
  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });
  var token = this;
  this.promise.then(function(cancel) {
    if (!token._listeners)
      return;
    var i;
    var l = token._listeners.length;
    for (i = 0; i < l; i++) {
      token._listeners[i](cancel);
    }
    token._listeners = null;
  });
  this.promise.then = function(onfulfilled) {
    var _resolve;
    var promise = new Promise(function(resolve) {
      token.subscribe(resolve);
      _resolve = resolve;
    }).then(onfulfilled);
    promise.cancel = function reject() {
      token.unsubscribe(_resolve);
    };
    return promise;
  };
  executor(function cancel(message) {
    if (token.reason) {
      return;
    }
    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};
CancelToken.prototype.subscribe = function subscribe(listener) {
  if (this.reason) {
    listener(this.reason);
    return;
  }
  if (this._listeners) {
    this._listeners.push(listener);
  } else {
    this._listeners = [listener];
  }
};
CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
  if (!this._listeners) {
    return;
  }
  var index2 = this._listeners.indexOf(listener);
  if (index2 !== -1) {
    this._listeners.splice(index2, 1);
  }
};
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token,
    cancel
  };
};
var CancelToken_1 = CancelToken;
var spread = function spread2(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};
var utils$1 = utils$e;
var isAxiosError = function isAxiosError2(payload) {
  return utils$1.isObject(payload) && payload.isAxiosError === true;
};
var utils = utils$e;
var bind2 = bind$2;
var Axios = Axios_1;
var mergeConfig2 = mergeConfig$2;
var defaults = defaults_1;
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind2(Axios.prototype.request, context);
  utils.extend(instance, Axios.prototype, context);
  utils.extend(instance, context);
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig2(defaultConfig, instanceConfig));
  };
  return instance;
}
var axios$1 = createInstance(defaults);
axios$1.Axios = Axios;
axios$1.Cancel = Cancel_1;
axios$1.CancelToken = CancelToken_1;
axios$1.isCancel = isCancel$1;
axios$1.VERSION = data.version;
axios$1.all = function all(promises) {
  return Promise.all(promises);
};
axios$1.spread = spread;
axios$1.isAxiosError = isAxiosError;
axios$2.exports = axios$1;
axios$2.exports.default = axios$1;
var axios = axios$2.exports;
var index = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  "default": axios
}, [axios]);
var tokenType = /* @__PURE__ */ ((tokenType2) => {
  tokenType2["FA12"] = "fa1.2";
  tokenType2["FA2"] = "fa2";
  tokenType2["XTZ"] = "XTZ";
  return tokenType2;
})(tokenType || {});
const validateAddress = (address) => {
  if (typeof address !== "string")
    return false;
  address = address.trim();
  if (address.length === 0)
    return false;
  if (address.slice(0, 2) === "tz") {
    const regex = new RegExp("tz[123][1-9A-HJ-NP-Za-km-z]{33}");
    return regex.test(address);
  } else if (address.slice(0, 2) === "KT") {
    const regex = new RegExp("KT1[1-9A-HJ-NP-Za-km-z]{33}");
    return regex.test(address);
  } else {
    return false;
  }
};
class TezToolsSDK {
  constructor() {
    this.pricesApiUrl = "https://api.teztools.io/v1/prices";
    this.xtzPriceUrl = "https://api.teztools.io/v1/xtz-price";
    this.xtzPrice = void 0;
    this.defaultFiat = "USD";
    this.xtzExchangeRate = void 0;
    this.tokenTags = [];
    this.numberOfTokens = 0;
    this.tokensPrices = [];
    this.tokensList = [];
    if (window) {
      this.fetch = async (url) => {
        const res = await this.fetch(url);
        if (res) {
          return await res.json();
        } else {
          return null;
        }
      };
    } else {
      this.fetch = async (url) => {
        const axios2 = (await Promise.resolve().then(function() {
          return index;
        })).default;
        const res = await axios2.get(url);
        if (res) {
          return res.data;
        } else {
          return null;
        }
      };
    }
  }
  is_number(val) {
    return !isNaN(+val);
  }
  is_timestamp(val) {
    return new Date(val).getTime() > 0;
  }
  is_string(val) {
    return typeof val === "string";
  }
  is_boolean(val) {
    return typeof val === "boolean";
  }
  is_url(val) {
    try {
      new URL(val);
      return true;
    } catch (error) {
      return false;
    }
  }
  async init(p) {
    const prices = p && p.prices ? p.prices : true;
    const xtzPrice = p && p.xtzPrice ? p.xtzPrice : true;
    const defaultFiat = p && p.defaultFiat ? p.defaultFiat : "USD";
    const fiatExchangeRate = p && p.fiatExchangeRate ? p.fiatExchangeRate : void 0;
    if (prices) {
      try {
        const response = await axios.get(this.pricesApiUrl);
        if (response) {
          const data2 = await response.data;
          if (typeof data2 !== "object") {
            throw `Expected object from token prices API, got ${typeof data2}`;
          } else if (typeof data2 === "object" && !data2.hasOwnProperty("contracts")) {
            throw `Object received from token prices API doesn't have a "contracts" property`;
          } else if (typeof data2 === "object" && data2.hasOwnProperty("contracts") && !Array.isArray(data2.contracts)) {
            throw `Expected contracts property from token prices API to be an array, got ${typeof data2.contracts} instead`;
          } else {
            this.numberOfTokens = data2.contracts.length;
            data2.contracts.forEach((contract) => {
              let token = {
                symbol: null,
                tokenAddress: null,
                decimals: null,
                name: null,
                shouldPreferSymbol: null,
                factoryIndex: null,
                address: null,
                ratio: null,
                tezPool: null,
                tokenPool: null,
                currentPrice: null,
                lastPrice: null,
                buyPrice: null,
                sellPrice: null,
                precision: null,
                type: null,
                bakerValidator: null,
                currentCandidate: null,
                currentDelegated: null,
                lastUpdateTime: null,
                lastVeto: null,
                periodFinish: null,
                reward: null,
                rewardPaid: null,
                rewardPerSec: null,
                totalReward: null,
                totalSupply: null,
                qptTokenSupply: null,
                totalVotes: null,
                usdValue: null,
                pairs: [],
                tags: null,
                websiteLink: null,
                telegramLink: null,
                twitterLink: null,
                discordLink: null,
                thumbnailUri: null,
                timestamp: null,
                block: null
              };
              const contractKeys = Object.keys(contract);
              contractKeys.forEach((contractKey) => {
                switch (contractKey) {
                  case "symbol":
                    const symbol = contract[contractKey];
                    if (this.is_string(symbol)) {
                      this.tokensList.push(symbol);
                      token.symbol = symbol;
                    } else {
                      token.symbol = null;
                    }
                    break;
                  case "tokenAddress":
                    const tokenAddress = contract[contractKey];
                    token.tokenAddress = (() => {
                      if (this.is_string(tokenAddress) && validateAddress(tokenAddress)) {
                        return {
                          address: tokenAddress,
                          isValid: true
                        };
                      } else {
                        return null;
                      }
                    })();
                    break;
                  case "decimals":
                    const decimals = contract[contractKey];
                    token.decimals = this.is_number(decimals) ? decimals : null;
                    break;
                  case "name":
                    const name = contract[contractKey];
                    token.name = this.is_string(name) ? name : null;
                    break;
                  case "shouldPreferSymbol":
                    token.shouldPreferSymbol = this.is_boolean(contract[contractKey]) ? contract[contractKey] : null;
                    break;
                  case "factoryIndex":
                    const factoryIndex = contract[contractKey];
                    token.factoryIndex = this.is_number(factoryIndex) ? factoryIndex : null;
                    break;
                  case "address":
                    const address = contract[contractKey];
                    token.address = (() => {
                      if (this.is_string(address) && validateAddress(address)) {
                        return {
                          address,
                          isValid: true
                        };
                      } else {
                        return null;
                      }
                    })();
                    break;
                  case "ratio":
                    const ratio = contract[contractKey];
                    token.ratio = this.is_number(ratio) ? ratio : null;
                    break;
                  case "tezPool":
                    const tezPool = contract[contractKey];
                    token.tezPool = this.is_number(tezPool) ? tezPool : null;
                    break;
                  case "tokenPool":
                    const tokenPool = contract[contractKey];
                    token.tokenPool = this.is_number(tokenPool) ? tokenPool : null;
                    break;
                  case "currentPrice":
                    const currentPrice = contract[contractKey];
                    token.currentPrice = this.is_number(currentPrice) ? currentPrice : null;
                    break;
                  case "lastPrice":
                    const lastPrice = contract[contractKey];
                    token.lastPrice = this.is_number(lastPrice) ? lastPrice : null;
                    break;
                  case "buyPrice":
                    const buyPrice = contract[contractKey];
                    token.buyPrice = this.is_number(buyPrice) ? buyPrice : null;
                    break;
                  case "sellPrice":
                    const sellPrice = contract[contractKey];
                    token.sellPrice = this.is_number(sellPrice) ? sellPrice : null;
                    break;
                  case "precision":
                    const precision = contract[contractKey];
                    token.precision = this.is_number(precision) ? precision : null;
                    break;
                  case "type":
                    const type = contract[contractKey];
                    switch (type) {
                      case "fa1.2":
                        token.type = "fa1.2";
                        break;
                      case "fa2":
                        token.type = "fa2";
                        break;
                      case "XTZ":
                        token.type = "XTZ";
                        break;
                      default:
                        token.type = null;
                        break;
                    }
                    break;
                  case "bakerValidator":
                    const bakerValidator = contract[contractKey];
                    token.bakerValidator = validateAddress(bakerValidator) ? bakerValidator : null;
                    break;
                  case "currentCandidate":
                    const currentCandidate = contract[contractKey];
                    token.currentCandidate = validateAddress(currentCandidate) ? currentCandidate : null;
                    break;
                  case "currentDelegated":
                    const currentDelegated = contract[contractKey];
                    token.currentDelegated = validateAddress(currentDelegated) ? currentDelegated : null;
                    break;
                  case "lastUpdateTime":
                    const lastUpdateTime = contract[contractKey];
                    token.lastUpdateTime = this.is_timestamp(lastUpdateTime) ? lastUpdateTime : null;
                    break;
                  case "lastVeto":
                    const lastVeto = contract[contractKey];
                    token.lastVeto = this.is_timestamp(lastVeto) ? lastVeto : null;
                    break;
                  case "periodFinish":
                    const periodFinish = contract[contractKey];
                    token.periodFinish = this.is_timestamp(periodFinish) ? periodFinish : null;
                    break;
                  case "reward":
                    const reward = contract[contractKey];
                    token.reward = this.is_number(reward) ? reward : null;
                    break;
                  case "rewardPaid":
                    const rewardPaid = contract[contractKey];
                    token.rewardPaid = this.is_number(rewardPaid) ? rewardPaid : null;
                    break;
                  case "rewardPerSec":
                    const rewardPerSec = contract[contractKey];
                    token.rewardPerSec = this.is_number(rewardPerSec) ? rewardPerSec : null;
                    break;
                  case "totalReward":
                    const totalReward = contract[contractKey];
                    token.totalReward = this.is_number(totalReward) ? totalReward : null;
                    break;
                  case "totalSupply":
                    const totalSupply = contract[contractKey];
                    token.totalSupply = this.is_number(totalSupply) ? totalSupply : null;
                    break;
                  case "qptTokenSupply":
                    const qptTokenSupply = contract[contractKey];
                    token.qptTokenSupply = this.is_number(qptTokenSupply) ? qptTokenSupply : null;
                    break;
                  case "totalVotes":
                    const totalVotes = contract[contractKey];
                    token.totalVotes = this.is_number(totalVotes) ? totalVotes : null;
                    break;
                  case "usdValue":
                    const usdValue = contract[contractKey];
                    token.usdValue = this.is_number(usdValue) ? usdValue : null;
                    break;
                  case "pairs":
                    const pairs = contract[contractKey];
                    const tokenPairs = [];
                    pairs.forEach((pair) => {
                      let tokenPair = {
                        address: validateAddress(pair.address) ? pair.address : null,
                        dex: this.is_string(pair.dex) ? pair.dex : null,
                        symbols: this.is_string(pair.symbols) ? pair.symbols : null,
                        tvl: this.is_number(pair.tvl) ? pair.tvl : null,
                        lptSupply: this.is_number(pair.lptSupply) ? pair.tvl : null,
                        sides: Array.isArray(pair.sides) ? [
                          ...pair.sides.map((side) => {
                            let tokenPairSide = {
                              symbol: this.is_string(side.symbol) ? side.symbol : null,
                              pool: this.is_number(side.pool) ? side.pool : null,
                              price: this.is_number(side.price) ? side.price : null,
                              usdvalue: this.is_number(side.usdvalue) ? side.usdvalue : null,
                              dayClose: this.is_number(side.dayClose) ? side.dayClose : null,
                              weekClose: this.is_number(side.weekClose) ? side.weekClose : null,
                              monthClose: this.is_number(side.monthClose) ? side.monthClose : null,
                              tokenType: this.is_string(side.tokenType) ? side.tokenType : null
                            };
                            return tokenPairSide;
                          })
                        ] : null
                      };
                      tokenPairs.push(tokenPair);
                    });
                    token.pairs = tokenPairs;
                    break;
                  case "tags":
                    const tags = contract[contractKey];
                    token.tags = this.is_string(tags) ? tags : null;
                    break;
                  case "websiteLink":
                    const websiteLink = contract[contractKey];
                    token.websiteLink = (() => {
                      if (this.is_string(websiteLink)) {
                        return {
                          url: websiteLink,
                          isValid: this.is_url(websiteLink)
                        };
                      } else {
                        return null;
                      }
                    })();
                    break;
                  case "telegramLink":
                    const telegramLink = contract[contractKey];
                    token.telegramLink = (() => {
                      if (this.is_string(telegramLink)) {
                        return {
                          url: telegramLink,
                          isValid: this.is_url(telegramLink)
                        };
                      } else {
                        return null;
                      }
                    })();
                    break;
                  case "twitterLink":
                    const twitterLink = contract[contractKey];
                    token.twitterLink = (() => {
                      if (this.is_string(twitterLink)) {
                        return {
                          url: twitterLink,
                          isValid: this.is_url(twitterLink)
                        };
                      } else {
                        return null;
                      }
                    })();
                    break;
                  case "discordLink":
                    const discordLink = contract[contractKey];
                    token.discordLink = (() => {
                      if (this.is_string(discordLink)) {
                        return {
                          url: discordLink,
                          isValid: this.is_url(discordLink)
                        };
                      } else {
                        return null;
                      }
                    })();
                    break;
                  case "thumbnailUri":
                    const thumbnailUri = contract[contractKey];
                    token.thumbnailUri = (() => {
                      if (this.is_string(thumbnailUri)) {
                        return {
                          url: thumbnailUri,
                          isValid: this.is_url(thumbnailUri)
                        };
                      } else {
                        return null;
                      }
                    })();
                    break;
                  case "timestamp":
                    const timestamp = contract[contractKey];
                    token.timestamp = this.is_timestamp(timestamp) ? timestamp : null;
                    break;
                  case "block":
                    const block = contract[contractKey];
                    token.block = this.is_string(block) ? block : null;
                    break;
                }
              });
              this.tokensPrices.push(token);
            });
            this.tokenTags = Array.from(new Set(this.tokensPrices.map((tk) => tk.tags).filter((tk) => tk !== null)));
          }
        } else {
          throw "No response from the tokens prices API";
        }
      } catch (error) {
        console.error();
      }
    }
    if (xtzPrice) {
      try {
        const response = await axios.get(this.xtzPriceUrl);
        if (response) {
          const data2 = await response.data;
          let xtzPrice2 = {
            fullData: true,
            price: null,
            price24h: null,
            marketCap: null,
            market24h: null,
            volume: null,
            volume24h: null,
            updated: null
          };
          const expectedKeys = Object.keys(xtzPrice2);
          const receivedKeys = Object.keys(data2);
          const matchingKeys = receivedKeys.map((key) => expectedKeys.includes(key)).reduce((a, b) => a && b);
          if (!matchingKeys || expectedKeys.length === receivedKeys.length) {
            xtzPrice2.fullData = false;
          }
          Object.keys(xtzPrice2).forEach((key) => {
            if (data2.hasOwnProperty(key)) {
              if (key === "updated" && this.is_timestamp(data2[key])) {
                xtzPrice2.updated = data2.updated;
              } else if (this.is_number(data2[key])) {
                xtzPrice2[key] = +data2[key];
              }
            }
          });
          this.xtzPrice = xtzPrice2;
          if (defaultFiat !== "USD" && fiatExchangeRate) {
            this.defaultFiat = "EUR";
            this.xtzExchangeRate = fiatExchangeRate;
          } else {
            this.xtzExchangeRate = xtzPrice2.price;
          }
        } else {
          throw "No response from the XTZ price API";
        }
      } catch (error) {
        console.error(error);
      }
    }
    return this;
  }
  updateInternalFiat(symbol, exchangeRate) {
    this.defaultFiat = symbol;
    this.xtzExchangeRate = exchangeRate;
    return this;
  }
  get(tokenSymbol) {
    if (!this.tokensList.includes(tokenSymbol)) {
      return null;
    } else {
      const result = this.tokensPrices.find((tk) => tk.symbol === tokenSymbol);
      if (result) {
        return result;
      } else {
        return null;
      }
    }
  }
  getBySymbol(tokenSymbol) {
    return this.get(tokenSymbol);
  }
  getByType(type) {
    return this.tokensPrices.filter((tk) => tk.type === type);
  }
  getByAddress(address) {
    const result = this.tokensPrices.find((tk) => tk.tokenAddress ? tk.tokenAddress.address === address : void 0);
    if (result) {
      return result;
    } else {
      return null;
    }
  }
  getByTag(tag, precision) {
    if (precision) {
      return this.tokensPrices.filter((tk) => tk.tags && tk.tags === tag.toLowerCase());
    } else {
      return this.tokensPrices.filter((tk) => tk.tags && tk.tags.toLowerCase().includes(tag.toLowerCase()));
    }
  }
  getTokensList() {
    return this.tokensList.sort((a, b) => a > b ? 1 : -1);
  }
  getTokensWithPriceGreaterThan(price) {
    return this.tokensPrices.filter((tk) => tk.currentPrice ? tk.currentPrice > price : false).sort((a, b) => {
      if (a.currentPrice && b.currentPrice) {
        return a.currentPrice - b.currentPrice;
      } else {
        return 0;
      }
    });
  }
  getTokensWithPriceLessThan(price) {
    return this.tokensPrices.filter((tk) => tk.currentPrice ? tk.currentPrice < price : false).sort((a, b) => {
      if (a.currentPrice && b.currentPrice) {
        return a.currentPrice - b.currentPrice;
      } else {
        return 0;
      }
    });
  }
  orderByUsdValue(dir, tokens) {
    const sortedTokens = this.tokensPrices.sort((a, b) => {
      if (a.usdValue && b.usdValue) {
        return dir === "desc" ? b.usdValue - a.usdValue : a.usdValue - b.usdValue;
      } else {
        return 0;
      }
    });
    if (tokens) {
      const unknownTokens = tokens.filter((tk) => !this.tokensList.includes(tk));
      if (unknownTokens.length > 0) {
        throw { message: "Unknown token(s)", list: unknownTokens };
      }
      return sortedTokens.filter((tk) => tk.symbol ? tokens.includes(tk.symbol) : false);
    } else {
      return sortedTokens;
    }
  }
  orderByUsdValueDesc(tokens) {
    return this.orderByUsdValue("desc", tokens);
  }
  orderByUsdValueAsc(tokens) {
    return this.orderByUsdValue("asc", tokens);
  }
  getCurrentPrice(tokens) {
    const tokensCurrentPrices = this.tokensPrices.map((tk) => ({
      symbol: tk.symbol,
      xtzPrice: tk.currentPrice,
      fiatPrice: tk.currentPrice && this.xtzExchangeRate ? tk.currentPrice * this.xtzExchangeRate : null,
      fiat: this.defaultFiat
    }));
    if (tokens && tokens.length > 0) {
      const unknownTokens = tokens.filter((tk) => !this.tokensList.includes(tk));
      if (unknownTokens.length > 0) {
        throw { message: "Unknown token(s)", list: unknownTokens };
      }
      return tokensCurrentPrices.filter((tk) => tk.symbol ? tokens.includes(tk.symbol) : false);
    } else {
      return tokensCurrentPrices;
    }
  }
}
export { TezToolsSDK, tokenType };
