// 用于处理文字输入的效果，因此我引入了typed.js库
// 初始化
document.addEventListener("DOMContentLoaded", function () {
    var type = new Typed('#typed-output', {
        strings: ["Photography Competition to Promote Fairness and Inclusiveness in Chemical Science Community"],
        typeSpeed: 60,// 打字速度
        backSpeed: 30,// 删除速度
        loop: true // 循环
    });
    console.log("Typed init script is running...");

});