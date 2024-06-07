const { getFirstName, passwordValidator } = require("../utils/utils.js");

describe("Utils file testing suite", () => {
  test("should return first name when full name is given", () => {
    const firstName = getFirstName("Rachel Green");
    expect(firstName).toEqual("Rachel");
  });

  test("should confirm the password is having at least 6 characters", () => {
    const isPasswordValidated = passwordValidator("abc1234");
    expect(isPasswordValidated).toBeTruthy();
  });
});
