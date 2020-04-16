1. 介绍下JavaScript的this

  函数执行时，会初始化this的指向，this指向调用函数的对象

2. 如何改变this指向
  call, apply和bind都能改变this的指向

  ```
    // 1.function.prototype.call()
    // call 方法第一个参数是要绑定给this的值，后面传入的是一个参数列表。当第一个参数为null、undefined的时候，默认指向window
    let obj = {};
    const fn = function(){
      return this;
    };

    console.log(fn() === window) // 执行全局对象
    console.log(fn.call(obj) === obj) // 改变this指向为obj

    // 2.function.prototype.apply()
    // apply接受两个参数，第一个参数是要绑定给this的值，第二个参数是一个参数数组。当第一个参数为null、undefined的时候，默认指向window
    let obj = {};
    const fn = function(){
      return this;
    };

    console.log(fn() === window) // 执行全局对象
    console.log(fn.apply(obj) === obj) // 改变this指向为obj

    // 3.Function.prototype.bind()
      // bind第一个参数是this的指向，从第二个参数开始是接收的参数列表, 返回值是函数.
      // bind 方法不会立即执行，而是返回一个改变了上下文 this 后的函数。
    let d = new Date();
    d.getTime() // 1481869925657

    let print = d.getTime; // d.getTime 赋值给 print 后，getTime 内部的this 指向方式变化，已经不再指向date 对象实例了
    print() // Uncaught TypeError: this is not a Date object.

    let print = d.getTime.bind(d); 
    print() // 1481869925657
  ```

3. call和apply的区别
    apply 接收数组作为函数执行时的参数
    call 接受多个参数作为函数执行时的参数

    ```
      function f(x, y){
        console.log(x + y);
      }

      f.call(null, 1, 1) // 2
      f.apply(null, [1, 1]) // 2
    ```

4. 如何实现call和apply

    ```
    // 思考，这里的fn用symbol应该更好，有可能跟原对象中的fn冲突
     Function.prototype.mycall = function (...args) {
      let target = args[0] || window; // 接收第一个参数为this的指向，null或空或undefined时指向全局变量
      target.fn = this; // 改变this指向
      let result = target.fn(...args.splice(1)); // 把执行结果赋值给result，函数参数为之后的参数列表
      delete target.fn; // 删除fn属性，原对象中不包含
      return result; 
    }
    Function.prototype.myapply = function (...args) {
      let target = args[0] || window;  // 接收第一个参数为this的指向，null或空或undefined时指向全局变量
      target.fn = this;  // 改变this指向
      let result = target.fn(...args[1]);  // 把执行结果赋值给result， 函数参数为第二个参数数组
      delete target.fn;  // 删除fn属性，原对象中不包含
      return result;
    }
    ```
5. 如何实现一个bind
    
    ```
    // bind第一个参数是this的指向，从第二个参数开始是接收的参数列表, 返回值是函数.
    // bind 方法不会立即执行，而是返回一个改变了上下文 this 后的函数。

    Function.prototype.mybind = function (target, ...args) {
      const _this = this;
      const fn = function (...args2) {
          return _this.apply(this instanceof fn ? this : target, [...args, ...args2]);
      }
      fn.prototype = Object.create(this.prototype);
      return fn;
    }
    ```
