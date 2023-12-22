const validateEmail = require("./validateEmail");

/* Company schema: 
{
    companyName: string,           (min length: 4 chars)
    password: string,           (min length: 8 chars)
    confirmPassword: string,    (should be identical to password field)
    email: string,
    description: string,                (min length: 20 chars)
    phone,
    source1,
    source2,
} */
function validateCompany(company) {
  const {
    companyName,
    email,
    password,
    confirmPassword,
    description,
    phone,
    source1,
    source2,
  } = company;

  const errors = {};
  if (companyName.length < 2)
    errors.companyName = "Company must be 2 or more characters long";
  if (password.length < 8)
    errors.password = "Password must be 8 or more characters long";
  if (password !== confirmPassword)
    errors.confirmPassword = "Passwords don't match";
  if (!validateEmail(email)) errors.email = "Email is not valid";
  if (description.length < 20)
    errors.description = "Description must be 20 or more characters long";
  if (!source1) errors.source1 = "Source not provided.";
  if (!source2) errors.source2 = "Source not provided.";
  if (!phone) {
    // TODO: validate phone number
    errors.phone = "Phone number not provided";
  }

  if (Object.keys(errors).length === 0) return null;
  return errors;
}

module.exports = { validateCompany };
