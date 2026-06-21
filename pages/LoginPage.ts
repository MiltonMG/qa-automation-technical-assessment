import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput   = page.locator('[data-test="username"]');
    this.passwordInput   = page.locator('[data-test="password"]');
    this.loginButton     = page.locator('[data-test="login-button"]');
    this.errorContainer  = page.locator('[data-test="error"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage(): Promise<string> {
    return this.errorContainer.innerText();
  }

  async isErrorVisible(): Promise<boolean> {
    return this.errorContainer.isVisible();
  }
}
