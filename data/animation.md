### 动画实现
```css
.element1 {
    /* 尺寸与定位 */
    animate: name1 1s;
}
.element2 {
    /* 尺寸与定位 */
    animate: name2 1s;
}
.element3 {
    /* 尺寸与定位 */
    animate: name3 1s;
}

/* 创建一个类名，如.animate，凡是使用到了animation动画的元素都添加这个类名；如下CSS代码：*/

.animate {
    animation-play-state: paused;
}
.active .animate {
    animation-play-state: running;
}
```