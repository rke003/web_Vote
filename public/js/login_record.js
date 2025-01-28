document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const rememberMeCheckbox = document.getElementById("rememberMe");

    //  读取 Cookies 并填充
    if (document.cookie.includes("rememberedEmail")) {
        const cookies = document.cookie.split("; ");
        let email = "", password = "";
        cookies.forEach(cookie => {
            let [name, value] = cookie.split("=");
            if (name === "rememberedEmail") email = decodeURIComponent(value);
            if (name === "rememberedPassword") password = decodeURIComponent(value);
        });

        if (email && password) {
            emailInput.value = email;
            passwordInput.value = password;
            rememberMeCheckbox.checked = true;  // ✅ 保持勾选
        }
    }

    //  监听表单提交，存储或清除 Cookies
    document.getElementById("loginForm").addEventListener("submit", function () {
        if (rememberMeCheckbox.checked) {
            document.cookie = `rememberedEmail=${encodeURIComponent(emailInput.value)}; path=/; max-age=604800`;  // 7天
            document.cookie = `rememberedPassword=${encodeURIComponent(passwordInput.value)}; path=/; max-age=604800`;
        } else {
            // ❌ 用户未勾选，清除 Cookies
            document.cookie = "rememberedEmail=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
            document.cookie = "rememberedPassword=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
        }
    });
});
