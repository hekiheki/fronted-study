# fronted-study
 我的前端学习经验总结

## [ES6相关](https://es6.ruanyifeng.com/#README)

1. Promise(摘自winter 重学前端)
  Promise 是 Javascript 语言提供的一种标准化的异步管理方式，它的总体思想是，需要进行io、等待或者其他异步操作的函数，不返回真实结果，而是返回一个“承诺”，函数的调用方可以在合适的实际，选择等待这个承诺兑现（通过 Promise 的 then 方法的回调）。 
  
  新特性： async/await

  async/await 是 ES2016 新加入的特性，他提供了for, if等代码结构来编写异步的方式。它的运行基础是 Promise。
  async函数必定返回Promise, 我们把所有返回的Promise 的函数都可以认为是异步函数。async函数是一种特殊的语法，在function关键字之前加上async关键字，定义一个async函数，可以在其中使用await来等待一个Promise.

  小练习： 实现一个红绿灯，一个圆形div按照绿色3秒，黄色1s，红色2s循环改变背景色。

  ```
    function sleep (duration) {
      return new Promise ((resolve) => {
        setTimeout(resolve, duration)
      })
    }

    async function changeColor (ele, duration, color) {
      ele.style.background = color
      await sleep(duration)
    }

    async function init () {
      const round = document.getElementById('#round')
      while (true) {
        await changeColor(round, 3000, 'green')
        await changeColor(round, 1000, 'yellow')
        await changeColor(round, 2000, 'red')
      }
    }
  ```

  **面试须知：**

  [如何实现一个Promise？](promise.js)
  
  参考[Promises/A+规范](https://www.ituring.com.cn/article/66566)


2. 
