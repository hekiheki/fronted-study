class myPromise {
  constructor (except) {
    // 状态： pending fulfilled rejected
    this.state = 'pending'
    // 表示拒绝的原因
    this.reason = undefined
    // 表示终值
    this.value = undefined
    // 缓存成功执行的回调队列
    this.successList = []
    // 缓存失败执行的回调队列
    this.failList = []
    if (typeof except === 'function') {
      // 接收一个exception, 绑定当前实例
      except(this.resolve.bind(this), this.reject.bind(this))
    } else {
      throw new TypeError('not a function')
    }
  }

  resolve (value) {
    if (this.state === 'pending') {
      this.state = 'fulfilled'
      this.value = value
      this.successList.forEach(fn => fn())
    }
  }

  reject (reason) {
    if (this.state === 'pending') {
      this.state = 'rejected'
      this.reason = reason
      this.failList.forEach(fn => fn())
    }
  }
  // onFulfilled 和 onRejected 都是可选参数
  then (onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    // 如果 onFulfilled 不是函数，其必须被忽略
    onRejected = typeof onRejected === 'function' ? onRejected : e => { throw e }
    // then 方法必须返回一个 promise 对象
    let p;
    p = new myPromise((resolve, reject) => {
      // 如果 onFulfilled 或者 onRejected 返回一个值 x ，则运行下面的 Promise 解决过程
      // 如果 onFulfilled 或者 onRejected 抛出一个异常 e ，则 promise2 必须拒绝执行，并返回拒因 e
      // 如果 onFulfilled 不是函数且 promise1 成功执行， promise2 必须成功执行并返回相同的值
      // 如果 onRejected 不是函数且 promise1 拒绝执行， promise2 必须拒绝执行并返回相同的据因
      // 函数还在执行状态，被添加到回调队列中
      if (this.state === 'pending') {
        // 如果 onFulfilled 不是函数，其必须被忽略
        if (typeof onFulfilled === 'function') {
          this.successList.push(() => {
            try {
              let x = onFulfilled(this.value);
              this.resolvePromise(p, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        }
        this.failList.push(() => {
          try {
            let x = onRejected(this.reason);
            this.resolvePromise(p, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      } else if (this.state === 'fulfilled') {
        try {
          let x = onFulfilled(this.value);
          this.resolvePromise(p, x, resolve, reject)
        } catch (e) {
          reject(e)
        }
      } else if (this.state === 'rejected') {
        try {
          let x = onRejected(this.reason);
          this.resolvePromise(p, x, resolve, reject)
        } catch (e) {
          reject(e)
        }
      }
    })
    return p;
  }
  // 是一个不同名的then方法
  catch (reject) {
    return this.then(null, reject);
  }
  // 调用内联函数时，不需要多次声明该函数或为该函数创建一个变量保存它
  // finally的回调函数中不接收任何参数，它仅用于无论最终结果如何都要执行的情况
  finally (onFinally) {
    return this.then(
      value => {this.resolve(onFinally()).then(() => value)},
      reason => {this.reject(onFinally()).then(() => reason)}
    )
  }
  // promise执行过程
  resolvePromise (promise, x, resolve, reject) {
    // 记录函数是否被调用
    let called;
    // 如果 promise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 promise
    if (promise === x) {
      return reject(new TypeError ('the same '));
    }
    // 如果 x 为对象或者函数
    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
      try {
        // 把 x.then 赋值给 then
        let then = x.then;
        // 如果 then 是函数，将 x 作为函数的作用域 this 调用之。
        // 传递两个回调函数作为参数，第一个参数叫做 resolvePromise ，第二个参数叫做 rejectPromise
        if (typeof then === 'function') {
          // 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
          then.call(x, (y) => {
            // 如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
            if (called) return;
            called = true;
            resolvePromise(promise, y, resolve, reject);
          }, (r) => {
            // 如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
            if (called) return;
            called = true;
            // 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
            reject(r);
          })
        } else {
          // 如果 then 不是函数，以 x 为参数执行 promise
          if (called) return;
          called = true;
          resolve(x);
        }
      } catch (e) {
        // 如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
        if (called) return;
        called = true;
        reject(e);
      }
    } else {
      // 如果 x 不为对象或者函数，以 x 为参数执行 promise
      if (called) return;
      called = true;
      resolve(x);
    }
  }
  // 返回一个以给定值解析后的Promise 对象
  static resolve (value) {
    return new myPromise ((resolve) => {
      resolve(value);
    });
  }
  // 返回一个带有拒绝原因的Promise对象
  static reject (reason) {
    return new myPromise((undefined, reject) => {
      reject(reason);
    });
  }
  /**
    * 将多个 Promise 实例，包装成一个新的 Promise 实例
    * iterable为一个可迭代对象，如 Array 或 String
    * 此实例在 iterable 参数内所有的 promise 都“完成（resolved）”或参数中不包含 promise 时回调完成（resolve）
    * 如果参数中 promise 有一个失败（rejected），此实例回调失败（reject），失败原因的是第一个失败 promise 的结果
  **/
  static all (iterable) {
    // iterable为一个可迭代对象，如 Array 或 String
    if (iterable[Symbol.iterator]) {
      return new myPromise((resolve, reject) => {
        let resolveArr = [];
        try {
          for (let x of iterable) {
            // 判断x的是否是个promise类型
            if (x instanceof myPromise) {
              x.then(value => {
                // 取得resolve的值
                resolveArr.push(value)
                if (resolveArr.length === iterable.length) {
                  resolve(resolveArr)
                }
              }, reason => {
                reject(reason)
              })
            } else {
              // 直接返回值
              resolveArr.push(x)
              if (resolveArr.length === iterable.length) {
                resolve(resolveArr)
              }
            }
          }
        } catch (e) {
          reject(e)
        }
      });
    } else {
      throw new TypeError('not a iterable');
    }
  }
  /**
    * 将多个 Promise 实例，包装成一个新的 Promise 实例
    * iterable为一个可迭代对象，如 Array 或 String
    * 一旦迭代器中的某个promise解决或拒绝，返回的 promise就会解决或拒绝
  **/
  static race (iterable) {
    // iterable为一个可迭代对象，如 Array 或 String
    if (iterable[Symbol.iterator]) {
      return new myPromise((resolve, reject) => {
        try {
          for (let x of iterable) {
            // 判断x的是否是个promise类型
            if (x instanceof myPromise) {
              x.then(value => {
                // 取得resolve的值
                resolve(value)
              }, reason => {
                reject(reason)
              })
            } else {
              // 直接返回值
              resolve(x)
            }
          }
        } catch (e) {
          reject(e)
        }
      });
    } else {
      throw new TypeError('not a iterable');
    }
  }
}