import { test, expect, APIResponse } from '@playwright/test';
import { REQRES_USERS } from '../../test-data';
import { apiHeaders } from '../../helpers/apiHeaders';

// Base URL read from environment variables for flexibility.
const BASE_URL = process.env.REQRES_BASE_URL ?? '';

test.describe('ReqRes API — Authentication', () => {
  test.beforeEach(() => {
    if (!process.env.REQRES_API_KEY) {
      test.skip(true, 'REQRES_API_KEY is not set.');
    }
  });

  test('POST /login — returns token for valid credentials', async ({ request }) => {
    const response: APIResponse = await request.post(`${BASE_URL}/login`, {
      headers: apiHeaders(),
      data: REQRES_USERS.valid,
    });

    expect(response.status()).toBe(200);

    const body = await response.json();

    // Token must be present and non-empty
    expect(body).toHaveProperty('token');
    expect(typeof body.token).toBe('string');
    expect(body.token.length).toBeGreaterThan(0);
  });

  test('POST /login — returns 400 when password is omitted', async ({ request }) => {
    const response: APIResponse = await request.post(`${BASE_URL}/login`, {
      headers: apiHeaders(),
      data: REQRES_USERS.noPassword,
    });

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body).toHaveProperty('error');
    expect(body.error).toBe('Missing password');
    // No token must be present in an error response
    expect(body).not.toHaveProperty('token');
  });

  test('POST /login — returns 400 when email is omitted', async ({ request }) => {
    const response: APIResponse = await request.post(`${BASE_URL}/login`, {
      headers: apiHeaders(),
      data: REQRES_USERS.noEmail,
    });

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body).toHaveProperty('error');
    expect(body.error).toBe('Missing email or username');
    expect(body).not.toHaveProperty('token');
  });
});

test.describe('ReqRes API — Users', () => {
  test.beforeEach(() => {
    if (!process.env.REQRES_API_KEY) {
      test.skip(true, 'REQRES_API_KEY is not set.');
    }
  });

  test('GET /users?page=2 — returns paginated user list with correct schema', async ({ request }) => {
    const response: APIResponse = await request.get(`${BASE_URL}/users`, {
      headers: apiHeaders(),
      params: { page: 2 },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();

    // Pagination envelope
    expect(body).toHaveProperty('page');
    expect(body).toHaveProperty('per_page');
    expect(body).toHaveProperty('total');
    expect(body).toHaveProperty('total_pages');
    expect(body).toHaveProperty('data');
    expect(body).toHaveProperty('support');

    expect(body.page).toBe(2);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data.length).toBeLessThanOrEqual(body.per_page);

    // User object schema
    for (const user of body.data) {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('first_name');
      expect(user).toHaveProperty('last_name');
      expect(user).toHaveProperty('avatar');

      expect(typeof user.id).toBe('number');
      expect(typeof user.email).toBe('string');
      expect(typeof user.first_name).toBe('string');
      expect(typeof user.last_name).toBe('string');
      expect(user.email).toMatch(/@reqres\.in$/);
      expect(user.avatar).toMatch(/^https?:\/\//);
    }
  });
  //   // Make both requests in parallel to speed up the test
  //   const [page1Res, page2Res] = await Promise.all([
  //     request.get(`${BASE_URL}/users`, { headers: apiHeaders(), params: { page: 1 } }),
  //     request.get(`${BASE_URL}/users`, { headers: apiHeaders(), params: { page: 2 } }),
  //   ]);

  //   // Both requests must succeed
  //   expect(page1Res.status()).toBe(200);
  //   expect(page2Res.status()).toBe(200);

  //   // Parse JSON responses
  //   const page1 = await page1Res.json();
  //   const page2 = await page2Res.json();

  //   // Extract user IDs from both pages
  //   const page1Ids = page1.data.map((u: { id: number }) => u.id);
  //   const page2Ids = page2.data.map((u: { id: number }) => u.id);

  //   // Pages must be disjoint
  //   const overlap = page1Ids.filter((id: number) => page2Ids.includes(id));
  //   expect(overlap.length).toBe(0);
  // });
});
