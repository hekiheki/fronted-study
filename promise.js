class myPromise {
  constructor (fn) {
    this.state = 'pending';
    this.doneList = [];
    this.failList = [];
    // 定义resolve, reject了两个回调函数为默认值
    if (typeof fn !== 'function') {
      throw new Error(`myPromise resolver ${fn} id not a function`);
    } else {
      try {
        fn(this.resolve.bind(this), this.reject.bind(this));
      } catch (e) {
        this.reject(e)
      }
    }
  }

  done (handle) {
    if (typeof handle === 'function') {
      this.doneList.push(handle);
    } else {
      throw new Error('is not a function');
    }
    return this;
  }

  fail (handle) {
    if (typeof handle === 'function') {
      this.failList.push(handle);
    } else {
      throw new Error('is not a function');
    }
    return this;
  }

  /** 
    * then方法可以接受两个回调函数作为参数
    * 第一个回调函数是Promise对象的状态变为resolved时调用
    * 第二个回调函数是Promise对象的状态变为rejected时调用
    * 第二个函数是可选的，不一定要提供
    * 这两个函数都接受Promise对象传出的值作为参数
  **/
  then (resolve, reject) {
    this.done(resolve || function () { }).fail(reject || function () { });
    return this;
  }

  catch (reject) {
    this.fail(reject || function () { });
    return this;
  }

  finish () {
    return this;
  }
  //  rest 参数代替arguments变量
  // ...args 代替Array.prototype.slice.call(arguments)
  resolve (...args) {
    this.state = 'resolve';
    setTimeout(function () {
      this.doneList.forEach((item, key, arr) => {
        try {
          item.apply(null, args);
        } catch(error) {
          this.catch(error)
        }
      });
    }.bind(this), 200);
  }

  reject (...args) {
    this.state = 'reject';
    setTimeout(function () {
      this.failList.forEach((item, key, arr) => {
        item.apply(null, args);
      });
    }.bind(this), 200);
  }
}