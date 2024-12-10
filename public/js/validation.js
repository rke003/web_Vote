document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');
    const firstName = document.getElementById('first');
    const lastName = document.getElementById('last');
    const email = document.getElementById('email');
    const occupation = document.getElementById('Occupation');
    const country = document.getElementById('country');
    const organization = document.getElementById('organization');

    form.addEventListener('submit', function (event) {
        let isValid = true;

        // 重置所有错误样式
        [firstName, lastName, email, password, confirmPassword, occupation, country, organization].forEach(field => {
            field.classList.remove('error');
        });

        // 验证 First Name
        if (!firstName.value.trim()) {
            firstName.classList.add('error');
            isValid = false;
        }

        // 验证 Last Name
        if (!lastName.value.trim()) {
            lastName.classList.add('error');
            isValid = false;
        }

        // 验证 Email
        if (!email.value.trim()) {
            email.classList.add('error');
            isValid = false;
        }

        // 验证 Password
        if (!password.value.trim()) {
            password.classList.add('error');
            isValid = false;
        }

        // 验证 Confirm Password
        if (password.value !== confirmPassword.value || !confirmPassword.value.trim()) {
            confirmPassword.classList.add('error');
            isValid = false;
        }

        // 验证 Occupation
        if (!occupation.value.trim()) {
            occupation.classList.add('error');
            isValid = false;
        }

        // 验证 Country
        if (!country.value.trim()) {
            country.classList.add('error');
            isValid = false;
        }

        // 验证 Organization
        if (!organization.value.trim()) {
            organization.classList.add('error');
            isValid = false;
        }

        // 如果有任何错误，阻止提交
        if (!isValid) {
            alert('Please fill in all required fields correctly.');
            event.preventDefault(); // 阻止表单提交
        }
    });
});
