// el modo 'use strict' no es necesario cuando estamos trabajando en ES6+
// En `empleos.html`, estamos ejecutando `<script type="module" src="./apply-button.js"></script>` con `type="module"`, lo que implica que estamos en en ES6+, y no es necesario usar 'use strict'

const searchInput = document.getElementById('empleos-search-input');
const locationFilter = document.getElementById('filter-location');
const experienceLevelFilter = document.getElementById('filter-experience-level');
const technologyFilter = document.getElementById('filter-technology');

const applyFilter = function() {
    const jobListings = document.querySelectorAll('.job-listing-card');

    const searchValue = searchInput.value.toLowerCase();
    const location = locationFilter.value;
    const experienceLevel = experienceLevelFilter.value;
    const technology = technologyFilter.value;

    jobListings.forEach(function(jobCard) {
        let isHidden = false;

        // Input Search filter
        const cardTitle = jobCard.dataset.titulo.toLowerCase();
        if(!cardTitle.includes(searchValue) && searchValue !== '') {
            isHidden = true;
        }

        // Location filter
        const cardLocation = jobCard.dataset.location;
        if (location !== cardLocation && location !== '') {
            isHidden = true;
        }

        // Experience level filter
        const cardExperienceLevel = jobCard.dataset.experienceLevel;
        if (experienceLevel !== cardExperienceLevel && experienceLevel !== '') {
            isHidden = true;
        }

        // Technology filter
        const cardTechnology = jobCard.dataset.technology.split(',');
        if(!cardTechnology.includes(technology) && technology !== '') {
            isHidden = true;
        }
        
        jobCard.classList.toggle('is-hidden', isHidden);
    })
}

// Event Listener Location filter
locationFilter.addEventListener('change', function() {
    applyFilter();
})

// Event Listener Experience level filter
experienceLevelFilter.addEventListener('change', function() {
    applyFilter();
})

// Event Listener Input Search filter
searchInput.addEventListener('input', function() {
    applyFilter();
})

// Event Listener Technology filter
technologyFilter.addEventListener('change', function() {
    applyFilter();
})