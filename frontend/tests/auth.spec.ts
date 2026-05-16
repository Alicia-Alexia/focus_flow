import { test, expect } from '@playwright/test';

test.describe('Fluxo de Autenticação - FocusFlow', () => {

    test('Deve exibir a tela de login com os elementos corretos', async ({ page }) => {
        await page.goto('/login');
        await expect(page.getByRole('heading', { name: 'FocusFlow' })).toBeVisible();
        await expect(page.locator('input[type="email"]')).toBeVisible();
        await expect(page.locator('input[type="password"]')).toBeVisible();
    });

    test('Deve realizar login com sucesso e ir para a Dashboard', async ({ page }) => {
        await page.goto('/login');

        await page.locator('input[type="email"]').fill(process.env.TEST_USER_EMAIL || '');
        await page.locator('input[type="password"]').fill(process.env.TEST_USER_PASSWORD || '');

        await page.getByRole('button', { name: 'Entrar na Conta' }).click();

        await expect(page).toHaveURL(/.*dashboard/);
        const botaoCriar = page.getByRole('button', { name: 'Criar Tarefa' });
        await expect(botaoCriar).toBeVisible({ timeout: 8000 });

        await expect(page.locator('h1', { hasText: 'Hoje' })).toBeVisible();
    });

});