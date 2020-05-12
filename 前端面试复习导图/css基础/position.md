position 属性：

1. static: static是所有元素的默认属性，可以理解为正常的文档流
2. relative: 相对于自己文档的位置来定位，对旁边元素无影响
3. absolute: 相对于 static 定位以外的第一个父元素进行定位
4. fixed: 相对于浏览器窗口来定位
5. inherit: 从父元素继承position属性的值，ie不支持