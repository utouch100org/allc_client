exports.install = (Vue, options) => {
    Vue.prototype.validator = {
      lanenoTransf(val) { return val.substr(2, 1) == '1' ? '出口' : '入口' }
    }
  }