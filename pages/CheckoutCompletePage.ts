import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutCompletePage extends BasePage {
  private readonly completeHeader:  Locator;
  private readonly completeText:    Locator;
  private readonly backHomeButton:  Locator;

  constructor(page: Page) {
    super(page);
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText   = page.locator('[data-test="complete-text"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async getHeader(): Promise<string> {
    return this.completeHeader.innerText();
  }

  async getConfirmationText(): Promise<string> {
    return this.completeText.innerText();
  }

  async isOrderComplete(): Promise<boolean> {
    return this.completeHeader.isVisible();
  }

  async backToProducts(): Promise<void> {
    await this.backHomeButton.click();
  }
}
