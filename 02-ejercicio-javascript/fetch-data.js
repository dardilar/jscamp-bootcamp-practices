"use strict";

const jobsList = document.querySelector(".jobs-listings");

fetch("./data.json")
    .then(response => response.json())
    .then(jobs => {
        jobs.forEach(job => {
            
            const city = {
                "cdmx": "Ciudad de México",
                "guadalajara": "Guadalajara",
                "monterrey": "Monterrey",
                "barcelona": "Barcelona",
                "remoto": "Remoto"
            }

            const article = `
            <li>
                <article class="job-listing-card" data-technology="${job.data.technology}" data-location="${job.data.modalidad}" data-experience-level="${job.data.nivel}" data-titulo="${job.titulo}">
                    <div>
                        <h3>${job.titulo}</h3>
                        <small>${job.empresa} | ${city[job.data.modalidad]}</small>
                        <p>${job.descripcion}</p>
                    </div>
                    <button class="button-apply-job">Aplicar</button>
                </article>
            </li>
            `
            jobsList.insertAdjacentHTML("beforeend", article);
        })
    });
