'use strict';

const jobsListings = document.querySelector(".jobs-listings");

jobsListings.addEventListener("click", function(e) {
    const applyButton = e.target.closest(".button-apply-job");
    
    if(applyButton) {
        applyButton.textContent = "¡Aplicado!";
        applyButton.classList.add("is-applied");
        applyButton.disabled = true;
    }
})