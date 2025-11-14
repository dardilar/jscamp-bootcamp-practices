// el modo 'use strict' no es necesario cuando estamos trabajando en ES6+
// En `empleos.html`, estamos ejecutando `<script type="module" src="./apply-button.js"></script>` con `type="module"`, lo que implica que estamos en en ES6+, y no es necesario usar 'use strict'

const jobsListings = document.querySelector(".jobs-listings");

jobsListings.addEventListener("click", function(e) {
    const applyButton = e.target.closest(".button-apply-job");
    
    if(applyButton) {
        applyButton.textContent = "¡Aplicado!";
        applyButton.classList.add("is-applied");
        applyButton.disabled = true;
    }
})