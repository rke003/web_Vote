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

        // Reset all error styles
        [firstName, lastName, email, password, confirmPassword, occupation, country, organization].forEach(field => {
            field.classList.remove('error');
        });

        // Verify the first name
        if (!firstName.value.trim()) {
            firstName.classList.add('error');
            isValid = false;
        }

        // Verification Last Name
        if (!lastName.value.trim()) {
            lastName.classList.add('error');
            isValid = false;
        }

        // Verification Email
        if (!email.value.trim()) {
            email.classList.add('error');
            isValid = false;
        }

        // Verification Password
        if (!password.value.trim()) {
            password.classList.add('error');
            isValid = false;
        }

        // Verification Confirm Password
        if (password.value !== confirmPassword.value || !confirmPassword.value.trim()) {
            confirmPassword.classList.add('error');
            isValid = false;
        }

        // Verification Occupation
        if (!occupation.value.trim()) {
            occupation.classList.add('error');
            isValid = false;
        }

        // Verification Country
        if (!country.value.trim()) {
            country.classList.add('error');
            isValid = false;
        }

        // Verification Organization
        if (!organization.value.trim()) {
            organization.classList.add('error');
            isValid = false;
        }

        // If there are any errors, block the submission
        if (!isValid) {
            alert('Please fill in all required fields correctly.');
            event.preventDefault(); // Block form submissions
        }
    });
});
