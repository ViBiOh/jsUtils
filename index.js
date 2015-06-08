const safeHasOwnProperty = {}.hasOwnProperty;

export function getInt(value) {
  if (typeof value === 'number' && value % 1 === 0) {
    return value;
  }

  let strValue = String(value);
  if (strValue.search(/^[\+\-]?[0-9]+$/) !== -1) {
    return parseInt(strValue, 10);
  }

  return null;
}

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function hasValue(value) {
  return typeof value !== 'undefined' && value !== null && (Array.isArray(value) || String(value) !== '');
}

export function inspectValue(value) {
  if (typeof value !== 'undefined' && value !== null) {
    if (Array.isArray(value)) {
      return value;
    }

    let strValue = String(value);
    if (strValue === '' || strValue === 'true') {
      return true;
    }
    if (strValue === 'false') {
      return false;
    }
    let intValue = getInt(value);
    if (intValue !== null) {
      return intValue;
    }
    if (strValue.search(/^[\+\-]?[0-9]*\.[0-9]+$/) !== -1) {
      return parseFloat(strValue);
    }
    return value;
  }
}

export function isAssociativeArray(value) {
  return typeof value === 'object' && value !== null && !(value instanceof String || value instanceof Boolean || value instanceof Number || Array.isArray(value));
}

export function arrayRm(array, item) {
  if (!Array.isArray(array)) {
    return;
  }

  let index = array.indexOf(item);
  if (index > -1) {
    array.splice(index, 1);
  }
}

export function extend(destination, append) {
  if (!(isAssociativeArray(destination) && isAssociativeArray(append))) {
    throw 'Invalid extend between <' + destination + '> and <' + append + '>';
  }

  for (let key in append) {
    if (safeHasOwnProperty.call(append, key)) {
      if (safeHasOwnProperty.call(destination, key) && isAssociativeArray(key.value) && isAssociativeArray(destination[key.value])) {
        extend(destination[key], append[key]);
      } else {
        destination[key] = append[key];
      }
    }
  }

  return destination;
}

export function stringify(obj, space) {
  let objectCache = [];

  return JSON.stringify(obj, function(key, value) {
    if (typeof value === 'object' && value !== null) {
      if (objectCache.indexOf(value) !== -1) {
        return '[Circular]';
      }
      objectCache.push(value);
    }
    return value;
  }, space);
}

export function asyncify(fn, bind) {
  return function() {
    let args = [].slice.call(arguments, 0);
    return new Promise(function(resolve, reject) {
      try {
        resolve(fn.apply(bind || null, args));
      } catch (e) {
        reject(e);
      }
    });
  };
}

export function asyncifyCallback(fn, bind) {
  return function() {
    let args = [].slice.call(arguments, 0);
    return new Promise(function(resolve, reject) {
      args.push(function(err, res) {
        if (err) {
          reject(err);
          return;
        }
        resolve(res);
      });
      fn.apply(bind || null, args);
    });
  };
}
