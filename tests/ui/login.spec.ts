import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { TEST_USERS } from '../../test-data';

test.describe('Sauce Demo — Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should redirect to inventory after successful login', async ({ page }) => {
    await loginPage.login(TEST_USERS.standard.username!, TEST_USERS.standard.password!);

    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('should display error for invalid credentials', async ({ page }) => {
    await loginPage.login(TEST_USERS.invalid.username!, TEST_USERS.invalid.password!);

    await expect(page).toHaveURL('/');
    expect(await loginPage.isErrorVisible()).toBe(true);

    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toContain('Username and password do not match');
  });

  test('should display error for locked-out user', async ({ page }) => {
    await loginPage.login(TEST_USERS.lockedOut.username!, TEST_USERS.lockedOut.password!);

    await expect(page).toHaveURL('/');
    expect(await loginPage.isErrorVisible()).toBe(true);

    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toContain('Sorry, this user has been locked out');
  });

  test('should display error when username is empty', async () => {
    await loginPage.login('', TEST_USERS.standard.password!);

    expect(await loginPage.isErrorVisible()).toBe(true);

    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toContain('Username is required');
  });

  test('should display error when password is empty', async () => {
    await loginPage.login(TEST_USERS.standard.username!, '');

    expect(await loginPage.isErrorVisible()).toBe(true);

    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toContain('Password is required');
  }); 
});
