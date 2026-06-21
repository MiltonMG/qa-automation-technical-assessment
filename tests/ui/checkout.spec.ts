import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutStepOnePage } from '../../pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../../pages/CheckoutStepTwoPage';
import { CheckoutCompletePage } from '../../pages/CheckoutCompletePage';
import { TEST_USERS, CHECKOUT_INFO } from '../../test-data';
import { validarPrecioRegex } from '../../helpers/regex';

test.describe('Sauce Demo — Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(TEST_USERS.standard.username!, TEST_USERS.standard.password!);
    await expect(page).toHaveURL(/inventory/);
  });

  test('E2E: login → add item → cart → checkout → order confirmed', { tag: '@checkout' }, async ({ page }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkoutOne = new CheckoutStepOnePage(page);
    const checkoutTwo = new CheckoutStepTwoPage(page);
    const complete = new CheckoutCompletePage(page);

    // --- Step 1: Add item to cart ---    
    const itemsBefore = await inventory.getInventoryItemNames();
    expect(itemsBefore.length).toBeGreaterThan(0);

    await inventory.addItemToCartByIndex(0);
    expect(await inventory.getCartBadgeCount()).toBe(1);

    // --- Step 2: Open cart ---
    await inventory.goToCart();
    await expect(page).toHaveURL(/cart/);
    expect(await cart.getCartItemCount()).toBe(1);

    const cartItemNames = await cart.getCartItemNames();
    expect(cartItemNames[0]).toBe(itemsBefore[0]);

    // --- Step 3: Proceed to checkout ---
    await cart.checkout();
    await expect(page).toHaveURL(/checkout-step-one/);

    // --- Step 4: Fill personal information ---
    await checkoutOne.fillInfo(CHECKOUT_INFO.valid);
    await checkoutOne.continue();
    await expect(page).toHaveURL(/checkout-step-two/);

    // --- Step 5: Verify order summary ---
    expect(await checkoutTwo.getSummaryItemCount()).toBe(1);

    const summaryNames = await checkoutTwo.getSummaryItemNames();
    expect(summaryNames[0]).toBe(itemsBefore[0]);

    const total = await checkoutTwo.getTotal();
    expect(total).toMatch(validarPrecioRegex); // Verifica formato "Total: $X.XX"

    // --- Step 6: Finish order ---
    await checkoutTwo.finish();
    await expect(page).toHaveURL(/checkout-complete/);

    // --- Step 7: Verify completion page ---
    expect(await complete.isOrderComplete()).toBe(true);

    const header = await complete.getHeader();
    expect(header).toBe('Thank you for your order!');

    const confirmationText = await complete.getConfirmationText();
    expect(confirmationText).toContain('Your order has been dispatched');
  });

  test('should not proceed to checkout with empty cart', { tag: '@checkout' }, async ({ page }) => {
    const inventory = new InventoryPage(page);

    // Navigate to cart without adding items
    await inventory.goToCart();
    await expect(page).toHaveURL(/cart/);

    const cart = new CartPage(page);
    expect(await cart.getCartItemCount()).toBe(0);

    // Checkout button is still present but cart is empty — verifies guard
    await cart.checkout();
    // Site allows proceeding but step-one form is shown; we assert the URL to confirm navigation
    await expect(page).toHaveURL(/checkout-step-one/);

    const checkoutOne = new CheckoutStepOnePage(page);
    await checkoutOne.continue();

    // Missing firstName triggers inline validation
    const error = await checkoutOne.getErrorMessage();
    expect(error).toContain('First Name is required');
  });

  test('should require all checkout fields before proceeding', { tag: '@checkout' }, async ({ page }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkoutOne = new CheckoutStepOnePage(page);

    await inventory.addItemToCartByIndex(0);
    await inventory.goToCart();
    await cart.checkout();
    await expect(page).toHaveURL(/checkout-step-one/);

    // Submit with all fields empty
    await checkoutOne.continue();

    const error = await checkoutOne.getErrorMessage();
    expect(error).toContain('First Name is required');
  });
});
