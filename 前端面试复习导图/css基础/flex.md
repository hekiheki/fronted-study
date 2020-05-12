1. 介绍一下flex布局

flexible box的缩写，以为弹性布局，为盒装模型提供最大的灵活性，为 Flex 布局以后，子元素的float、clear和vertical-align属性将失效

2. 如何用flex实现九宫格布局

  ```
    .parent{
      width: 500px;
      height: 500px;
      display:flex;
      justify-content: space-around;
      flex-wrap: wrap;
    }
    .child{
      width: calc(calc(100% / 3) - 10px);
    }

  ```

3. flex:1指的是什么，flex属性默认值是什么
  flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]

  默认值为 0 1 auto

4. 分别介绍一下flex-shrink 和 flex-basis属性

flex-shrink表示子元素缩小比例，默认为1，若空间不足，则会缩小

flex-basis定义了在分配多余空间之前，项目占据的主轴空间，默认为auto

5. 什么是grid


http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html