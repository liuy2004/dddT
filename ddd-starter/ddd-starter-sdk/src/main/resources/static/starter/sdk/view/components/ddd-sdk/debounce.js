export default function (func, wait, immediate) {
  let timeout, result;
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }
  wait = wait || 0;
  var debounced = function () {
    let _this = this;
    let args = arguments;
    // 清空上从定时器
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      let callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait);
      if (callNow) result = func.apply(_this, args);
    } else {
      timeout = setTimeout(function () {
        // console.log(this)  //=>这里面的this指向window，也就是前面的count那的this是指向window
        //但是防抖函数的this应该是指向container
        func.apply(_this, args);

      }, wait)
    }
    return result;
  }
  //添加取消防抖函数功能
  debounced.cannel = function () {
    clearTimeout(timeout);
    timeout = null;
  }
  return debounced;
}