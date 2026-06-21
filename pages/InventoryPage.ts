import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  private readonly cartBadge: Locator;
  private readonly cartLink: Locator;
  private readonly addToCartButtons: Locator;
  private readonly inventoryItemNames: Locator;

  constructor(page: Page) {
    super(page);
    this.cartBadge          = page.locator('.shopping_cart_badge');
    this.cartLink           = page.locator('.shopping_cart_link');
    this.addToCartButtons   = page.locator('[data-test^="add-to-cart"]'); // Selecciona cualquier elemento cuyo atributo data-test comience con el texto add-to-cart. 
    this.inventoryItemNames = page.locator('.inventory_item_name');
  }

  async addItemToCartByIndex(index: number = 0): Promise<void> {
    await this.addToCartButtons.nth(index).click();
  }

  async addItemToCartByName(itemName: string): Promise<void> {
    const dataTestId = `add-to-cart-${itemName.toLowerCase().replace(/\s+/g, '-')}`;
    await this.page.locator(`[data-test="${dataTestId}"]`).click();
  }

  async getCartBadgeCount(): Promise<number> {
    if (await this.cartBadge.isVisible()) {
      return parseInt(await this.cartBadge.innerText(), 10);
    }
    return 0;
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }

  async getInventoryItemNames(): Promise<string[]> {
    return this.inventoryItemNames.allInnerTexts();
  }
}
