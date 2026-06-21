export const TEST_USERS = {
  standard: {
    username: process.env.SAUCEDEMO_STANDARD_USERNAME,
    password: process.env.SAUCEDEMO_STANDARD_PASSWORD,
  },
  lockedOut: {
    username: process.env.SAUCEDEMO_LOCKED_USERNAME,
    password: process.env.SAUCEDEMO_STANDARD_PASSWORD,
  },
  invalid: {
    username: process.env.SAUCEDEMO_INVALID_USERNAME,
    password: process.env.SAUCEDEMO_INVALID_PASSWORD,
  },
};

export const REQRES_USERS = {
  valid: {
    email: process.env.REQRES_VALID_EMAIL,
    password: process.env.REQRES_VALID_PASSWORD,
  },
  noPassword: {
    email: process.env.REQRES_VALID_EMAIL,
  },
  noEmail: {
    password: process.env.REQRES_VALID_PASSWORD,
  },
};

export const CHECKOUT_INFO = {
  valid: {
    firstName: process.env.CHECKOUT_FIRST_NAME!,
    lastName: process.env.CHECKOUT_LAST_NAME!,
    postalCode: process.env.CHECKOUT_POSTAL_CODE!,
  },
};
