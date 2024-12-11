// For handling text input effects, so I introduced the typed.js library
// Initialisation
document.addEventListener("DOMContentLoaded", function () {
    var type = new Typed('#typed-output', {
        strings: ["Photography Competition to Promote Fairness and Inclusiveness in Chemical Science Community"],
        typeSpeed: 60,// typing speed
        backSpeed: 30,// Deletion speed
        loop: true // cycle
    });
    console.log("Typed init script is running...");

});