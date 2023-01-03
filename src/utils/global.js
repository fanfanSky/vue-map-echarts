export default {
  install(Vue, options = {}) {


    Vue.prototype.msgSuccess = function (msg) {
      this.$message({ showClose: true, message: msg, type: "success" });
    }

    Vue.prototype.msgError = function (msg) {
      this.$message({ showClose: true, message: msg, type: "error" });
    }

    Vue.prototype.msgWarning = function (msg) {
      this.$message({ showClose: true, message: msg, type: "warning" });
    }

    Vue.prototype.msgInfo = function (msg) {
      this.$message({ showClose: true, message: msg, type: "info" });
    }

    // 日期格式化
    Vue.prototype._parseTime = function (time, pattern) {
      if (arguments.length === 0 || !time) {
        return null
      }
      const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
      let date
      if (typeof time === 'object') {
        date = time
      } else {
        if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
          time = parseInt(time)
        } else if (typeof time === 'string') {
          time = time.replace(new RegExp(/-/gm), '/');
        }
        if ((typeof time === 'number') && (time.toString().length === 10)) {
          time = time * 1000
        }
        date = new Date(time)
      }
      const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
      }
      const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
        if (result.length > 0 && value < 10) {
          value = '0' + value
        }
        return value || 0
      })
      return time_str
    }

    /**
     * 对象数组根据某一属性排序
     * @param {string} field
     * @param {boolean} rev true表示升序排列，false降序排序
     * @returns {function}
     */
    Vue.prototype._sortBy = function (field, rev) {
      if (rev === undefined) {
        rev = 1;
      } else {
        rev = (rev) ? 1 : -1;
      }
      return function (a, b) {
        let val1 = a[field] * 1;
        let val2 = b[field] * 1;
        if (val1 < val2) {
          return rev * 1;
        } else if (val1 > val2) {
          return rev * -1;
        }
      }
    }

    /**
     * 数字千分号
     * @returns {string}
     */
    Vue.prototype._formatNumber = function(num) {
      var decimalPart = '';
      num = num ? num.toString() : '0';
      if (num.indexOf('.') !== -1) {
        decimalPart = '.' + num.split('.')[1];
        num = parseInt(num.split('.')[0]);
      }
      var array = num.toString().split('');
      var index = -3;
      while (array.length + index > 0) {
        // 从单词的最后每隔三个数字添加逗号
        array.splice(index, 0, ',');
        index -= 4;
      }
      return array.join('') + decimalPart;
    };

    /**
     * 随机生成三位数
     * @returns {boolean}
     */
    Vue.prototype._mathRandom1000 = function() {
      return (Math.random() * 1000).toFixed(0) * 1
    }

    /**
     * 判断是否是手机端
     * @returns {boolean}
     */
    Vue.prototype._isMobile = function() {
      var flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
      if (flag) {
        return true
      }
    }

  }
}
