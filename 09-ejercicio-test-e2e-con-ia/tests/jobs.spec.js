// @ts-check
import { test, expect } from '@playwright/test'

test('Navegar a la página principal y verificar si existe un buscador visible', async({ page }) => {
    await page.goto('http://localhost:5173');

    // Buscar por Role está genial! Cuando se trata de inputs, hay una manera de buscar un poquito mejor a nivel de buenas prácticas que es usar getByLabel. Esto agarra el contenido <label /> dentro del mismo contenedor que el input, o de su `aria-label`.
    // const searchInput = page.getByLabel('Buscar empleos');
    const searchInput = page.getByRole('searchbox');
    await expect(searchInput).toBeVisible();
});

test('Simula a un usuario buscando empleos por tecnologia', async({ page }) => {
    await page.goto('http://localhost:5173');

    const searchInput = page.getByRole('searchbox');
    await searchInput.fill('React');

    const searchButton = page.getByRole('button', { name: 'Buscar' });
    await searchButton.click();

    // Siempre debemos evitar usar selectores por ID o clases. Es muy frágil y puede cambiar.
    // Lo ideal es usar selectores por role.
    // Ejemplo: const jobsCards = page.getByRole('article', { name: /oferta de empleo de/i });
    // El ejemplo lo que hará es buscar todos los artículos que tengan un nombre que coincida con la expresión regular /oferta de empleo de/i, siendo "i" para que sea case-insensitive, y una regex que busca "oferta de empleo de" seguido de cualquier cosa. Entonces, podriamos agregar un atributo `aria-label` a nuestro article para colocar ese texto seguido del nombre de la posición, y mejorar de esta manera la accesibilidad.
    // IMPORTANTE: Los tests no solo sirven para evitar que el código se rompa, sino también para documentar el comportamiento de la aplicación y mejorar MUCHO la accesibilidad, porque si ves, siempre estamos tratando de buscar por `role` o por `aria-label`.
    const jobsCards = page.locator('.jobs-listings');
    await expect(jobsCards).toBeVisible();

    const jobFirstCard = page.locator('.job-listing-card').first();
    await expect(jobFirstCard).toBeVisible();
});

test('Simula el flujo completo de un usuario aplicando a una oferta de trabajo', async({ page }) => {
  await page.goto('http://localhost:5173');
  
  const searchInput = page.getByRole('searchbox');
  await searchInput.fill('Javascript');
  
  const searchButton = page.getByRole('button', { name: 'Buscar' });
  await searchButton.click();

  const jobsCards = page.locator('.job-listing-card');
  await expect(jobsCards.first()).toBeVisible();

  // Podemos buscar por `role` el link:
  // const firstJobTitle = jobsCards.first().getByRole('link').first();
  const firstJobTitle = jobsCards.first().locator('a').first();
  // Y en vez de evaluar un texto específico, podemos evaluar que tenga un `h3`
  // await expect(firstJobTitle).getByRole('heading', { level: 3 }).toBeVisible();
  await expect(firstJobTitle).toHaveText('Desarrollador de Software Senior');

  // Antes de darle click a Iniciar sesión, podemos verificar que el botón de aplicar está disabled
  // const applyButton = page.getByRole('button', { name: 'Aplicar' }).first();
  // await expect(applyButton).toBeDisabled();

  await page.getByRole('button', { name: 'Iniciar sesión' }).click();

  const applyButtonAfterLogin = page.getByRole('button', { name: 'Aplicar' }).first();
  await applyButtonAfterLogin.click();

  await expect(page.getByRole('button', { name: 'Aplicado' }).first()).toBeVisible();
});

test('Verificar el filtro remoto y por nivel en la aplicación', async({ page }) => {
    await page.goto('http://localhost:5173');
    
    const empleosPage = page.getByRole('link', { name: 'Empleos' });
    await empleosPage.click();

    // Podemos aplicar el filtro como lo comentamos antes, con `getByRole` y un aria-label en el select
    // const checkboxUbicacion = page.getByRole('combobox', { name: 'Ubicación' });
    const checkboxUbicacion = page.locator('#filter-location');
    await checkboxUbicacion.selectOption('remoto');

    // Podemos evaluar si todos los jobs tienen el atributo data-modalidad="remoto"
    // const jobCardsAll = page.getByRole('article');
    // const jobCardsAllAttributes = await jobCardsAll.getAttribute('data-modalidad');
    // await expect(jobCardsAllAttributes).toContain('remoto');
    
    const jobCards = page.locator('.job-listing-card[data-modalidad="remoto"]');
    await expect(jobCards.first()).toBeVisible();
    await expect(page.locator('.job-listing-card:not([data-modalidad="remoto"])')).toHaveCount(0);
    
    const checkboxNivel = page.locator('#filter-experience-level');
    await checkboxNivel.selectOption('senior');
    
    const jobCardsSenior = page.locator('.job-listing-card[data-nivel="senior"]');
    await expect(jobCardsSenior.first()).toBeVisible();
    await expect(page.locator('.job-listing-card:not([data-nivel="senior"])')).toHaveCount(0);
});

test('Verificar la paginación de resultados', async({ page }) => {
  await page.goto('http://localhost:5173');

  const searchInput = page.getByRole('searchbox');
  await searchInput.fill('developer');

  const searchButton = page.getByRole('button', { name: 'Buscar' });
  await searchButton.click();

  // Podemos buscar por rol y agregando aria-label
  // const pagination = page.getByRole('navigation', { name: /Paginación/i }); <- Esto va a indicar que se está buscando un elemento con el rol navigation <nav /> y el nombre Paginación, que puede ser el aria-label
  const pagination = page.locator('nav[class*="pagination"]');
  await expect(pagination).toBeVisible();

  // Podemos buscar por rol de link
  const firstPageFirstJob = await page.locator('.job-listing-card').first().textContent();
  const nextArrow = pagination.locator('a').last();

  await nextArrow.click();

  const secondPageFirstJob = await page.locator('.job-listing-card').first().textContent();
  expect(secondPageFirstJob).not.toBe(firstPageFirstJob);
})

test('Verificar el detalle de un empleo', async ({ page }) => {
  await page.goto('http://localhost:5173');
  
  const jobPage = page.getByRole('link', { name: 'Empleos' });
  await jobPage.click();
  

  // Podemos obtener el primer link, obtener el título, y ver si es el mismo que el título principal de la página `details`
  const jobDetail = page.getByRole('link', { name: 'Desarrollador de Software Senior' });
  await jobDetail.click();

  // Esto está muy bien
  await expect(page).toHaveURL(/\/jobs\/\d+/);
  await expect(page.getByRole('heading', { name: 'Desarrollador de Software Senior', level: 1 })).toBeVisible();

  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  const applyButton = page.getByRole('button', { name: 'Aplicar ahora' }).first();
  await expect(applyButton).toBeVisible();

  await applyButton.click();
  await expect(page.getByRole('button', { name: 'Aplicado' }).first()).toBeVisible();
})