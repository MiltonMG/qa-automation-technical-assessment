import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export class CheckoutStepOnePage extends BasePage {
  private readonly firstNameInput:  Locator;
  private readonly lastNameInput:   Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton:  Locator;
  private readonly errorContainer:  Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput  = page.locator('[data-test="firstName"]');
    this.lastNameInput   = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton  = page.locator('[data-test="continue"]');
    this.errorContainer  = page.locator('[data-test="error"]');
  }

  async fillInfo(info: CheckoutInfo): Promise<void> {
    await this.firstNameInput.fill(info.firstName);
    await this.lastNameInput.fill(info.lastName);
    await this.postalCodeInput.fill(info.postalCode);
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  async getErrorMessage(): Promise<string> {
    return this.errorContainer.innerText();
  }
}
