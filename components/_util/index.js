export const curry
= function curry (fn) {
  const arity = fn.length
  const curried = (oldArgs) => (...newArgs) => {
    const allArgs = oldArgs.concat(newArgs)
    const argCount = allArgs.length
    return argCount < arity ? curried(allArgs)
      : fn(...allArgs)
  }

  return curried([])
}

export const useObjState
= curry(function useObjState (setState, obj, target, val) {
  setState({ ...obj, [target]: val })
})

export const offsetDeep = function offsetDeep(node, top = 0) {
  const parent = node.offsetParent;
  if (parent && parent.tagName !== "BODY") {
    return offsetDeep(parent, node.offsetTop + top);
  } else {
    return node.offsetTop + top;
  }
}

function _fixZero (str) {
  if (typeof str !== 'string') {
    str = '' + str
  }
  return str.replace(/^([0-9])$/, '0$1')
}

export const formatDate = function (time, format = 'yyyy-mm-dd') {
  if (!time) return '';
  const date = new Date(time)
  const match = {}
  match.yyyy = date.getFullYear()
  match.mm = _fixZero(date.getMonth() + 1)
  match.dd = _fixZero(date.getDate())
  match.hh = _fixZero(date.getHours())
  match.MM = _fixZero(date.getMinutes())
  match.ss = _fixZero(date.getSeconds())
  match.aa = date.getHours() < 12 ? 'AM' : 'PM'

  return format.replace(/\w+/g, (a) => {
    return match[a]
  })
}

export const subDateToDay = function subDateToDay(d1, d2) {
  const day = subDate(d1, d2) / (24 * 60 * 60 * 1000);
  return Math.floor(day)
}

export const subDate = function subDate(d1, d2) {
  return new Date(d1).getTime() - new Date(d2).getTime()
}

export const wipe = curry(function (reg, str) {
  if (!str) {
    return '';
  } else {
    return ''.replace.call(str, reg, '');
  }
});

export const wipeSpace = wipe(/\s+/g);

export const debounce = function debounce (func, delay) {
  let callTimePoint = Date.now() + delay;
  let currentFunc = func
  let timing = false

  const startTimer = function () {
    const time = Date.now();
    if (time < callTimePoint) {
      setTimeout(startTimer, callTimePoint - time)
    } else {
      currentFunc()
      timing = false
    }
  }

  const debounced = function (...args) {
    const time = Date.now();
    callTimePoint = time + delay;
    currentFunc = func.bind(this, ...args);

    if (!timing) {
      startTimer()
      timing = true
    }
  }

  return debounced;
}

export const useArrState = curry(function useArrState(setState, arr, prop, val) {
  return setState(
    arr
      .filter(item =>
        prop(item) !== prop(val)
      )
      .concat([val])
  );
})


function _fixZero (str) {
  if (typeof str !== 'string') {
    str = '' + str
  }
  return str.replace(/^([0-9])$/, '0$1')
}
