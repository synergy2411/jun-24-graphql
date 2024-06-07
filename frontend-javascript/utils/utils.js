const getFirstName = (fullName) => fullName.split(" ")[0];

const passwordValidator = (password) => password.length > 6;

module.exports = { getFirstName, passwordValidator };
