const validateEmail = require("./validateEmail");

/* User schema: 
{
    fullname: string,           (min length: 4 chars)
    password: string,           (min length: 8 chars)
    confirmPassword: string,    (should be identical to password field)
    email: string,
    bio: string,                (min length: 20 chars)
} */
function validateUser(user) {
  const { fullname, password, confirmPassword, email, bio } = user;

  const errors = {};
  if (fullname.length < 4)
    errors.fullname = "Username must be 4 or more characters long";
  if (password.length < 8)
    errors.password = "Password must be 8 or more characters long";
  if (password !== confirmPassword)
    errors.confirmPassword = "Passwords don't match";
  if (!validateEmail(email)) errors.email = "Email is not valid";
  if (bio.length < 20) errors.bio = "Bio must be 20 or more characters long";

  if (Object.keys(errors).length === 0) return null;
  return errors;
}

module.exports = { validateUser };
