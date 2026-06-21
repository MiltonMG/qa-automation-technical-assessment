import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  private readonly checkoutButton: Locator;
  private readonly cartItems: Locator;
  private readonly cartItemNames: Locator;

  constructor(page: Page) {
    super(page);
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.cartItems      = page.locator('.cart_item');
    this.cartItemNames  = page.locator('.inventory_item_name');
  }

  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async getCartItemNames(): Promise<string[]> {
    return this.cartItemNames.allInnerTexts();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
