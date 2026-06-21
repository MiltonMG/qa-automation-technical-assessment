import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutStepTwoPage extends BasePage {
  private readonly finishButton:    Locator;
  private readonly cartItems:       Locator;
  private readonly totalLabel:      Locator;
  private readonly subtotalLabel:   Locator;
  private readonly summaryItemNames: Locator;

  constructor(page: Page) {
    super(page);
    this.finishButton     = page.locator('[data-test="finish"]');
    this.cartItems        = page.locator('.cart_item');
    this.totalLabel       = page.locator('.summary_total_label');
    this.subtotalLabel    = page.locator('.summary_subtotal_label');
    this.summaryItemNames = page.locator('.inventory_item_name');
  }

  async getSummaryItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async getSummaryItemNames(): Promise<string[]> {
    return this.summaryItemNames.allInnerTexts();
  }

  async getTotal(): Promise<string> {
    return this.totalLabel.innerText();
  }

  async getSubtotal(): Promise<string> {
    return this.subtotalLabel.innerText();
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
