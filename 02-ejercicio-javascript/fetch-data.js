// el modo 'use strict' no es necesario cuando estamos trabajando en ES6+
// En `empleos.html`, estamos ejecutando `<script type="module" src="./apply-button.js"></script>` con `type="module"`, lo que implica que estamos en en ES6+, y no es necesario usar 'use strict'

const jobsList = document.querySelector(".jobs-listings");

fetch("./data.json")
    .then(response => response.json())
    .then(jobs => {
        /* 
            Creamos un DocumentFragment para mejorar el rendimiento.
            En lugar de agregar cada trabajo directamente al DOM (lo que haría que el navegador redibuje la página múltiples veces), guardamos todos los elementos en memoria primero. Al final, agregamos todo de una sola vez.
            
            Es como preparar todos los platos en la cocina antes de llevarlos a la mesa, en vez de hacer un viaje por cada plato, llevamos todos juntos, y es mejor :)

            Esto viene muy bien cuando tenemos muchos elementos que agregar al DOM.

            No lo dimos directamente en los videos del curso, pero creo que es algo muy bueno para saber
        */
        const fragment = document.createDocumentFragment();

        jobs.forEach(job => {
            const city = {
                "cdmx": "Ciudad de México",
                "guadalajara": "Guadalajara",
                "monterrey": "Monterrey",
                "barcelona": "Barcelona",
                "remoto": "Remoto"
            }

            // creamos los elementos del DOM, no solo lo manejamos como texto a como estaba antes.
            // Esto permite poder usar los metodos de los elementos del DOM, como `classList.add`, `setAttribute`, etc.
            const li = document.createElement("li");

            const article = document.createElement("article");
            article.classList.add("job-listing-card");
            article.setAttribute("data-technology", job.data.technology);
            article.setAttribute("data-location", job.data.modalidad);
            article.setAttribute("data-experience-level", job.data.nivel);
            article.setAttribute("data-titulo", job.titulo);
            
            li.appendChild(article);
            article.innerHTML = `
                    <div>
                        <h3>${job.titulo}</h3>
                        <small>${job.empresa} | ${city[job.data.modalidad]}</small>
                        <p>${job.descripcion}</p>
                    </div>
                    <button class="button-apply-job">Aplicar</button>
            `

            fragment.appendChild(li);
        })

        jobsList.appendChild(fragment);
    });
