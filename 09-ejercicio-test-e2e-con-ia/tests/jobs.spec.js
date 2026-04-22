// @ts-check
import { test, expect } from '@playwright/test'

test('Navegar a la página principal y verificar si existe un buscador visible', async({ page }) => {
    await page.goto('http://localhost:5173');

    const searchInput = page.getByRole('searchbox');
    await expect(searchInput).toBeVisible();
});

test('Simula a un usuario buscando empleos por tecnologia', async({ page }) => {
    await page.goto('http://localhost:5173');

    const searchInput = page.getByRole('searchbox');
    await searchInput.fill('React');

    const searchButton = page.getByRole('button', { name: 'Buscar' });
    await searchButton.click();

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

  const firstJobTitle = jobsCards.first().locator('a').first();
  await expect(firstJobTitle).toHaveText('Desarrollador de Software Senior');

  await page.getByRole('button', { name: 'Iniciar sesión' }).click();

  const applyButton = page.getByRole('button', { name: 'Aplicar' }).first();
  await applyButton.click();

  await expect(page.getByRole('button', { name: 'Aplicado' }).first()).toBeVisible();
});

test('Verificar el filtro remoto y por nivel en la aplicación', async({ page }) => {
    await page.goto('http://localhost:5173');
    
    const empleosPage = page.getByRole('link', { name: 'Empleos' });
    await empleosPage.click();

    const checkboxUbicacion = page.locator('#filter-location');
    await checkboxUbicacion.selectOption('remoto');

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

  const pagination = page.locator('nav[class*="pagination"]');
  await expect(pagination).toBeVisible();

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
  
  const jobDetail = page.getByRole('link', { name: 'Desarrollador de Software Senior' });
  await jobDetail.click();

  await expect(page).toHaveURL(/\/jobs\/\d+/);
  await expect(page.getByRole('heading', { name: 'Desarrollador de Software Senior', level: 1 })).toBeVisible();

  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  const applyButton = page.getByRole('button', { name: 'Aplicar ahora' }).first();
  await expect(applyButton).toBeVisible();

  await applyButton.click();
  await expect(page.getByRole('button', { name: 'Aplicado' }).first()).toBeVisible();
})