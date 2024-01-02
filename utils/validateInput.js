const validateInput = (input) => {
  // Regular expressions for email and phone number validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^(\+2519|\+2517)\d{8}$/; // Assuming a 10-digit phone number format

  // Check if the input matches the email or phone number regex
  if (emailRegex.test(input)) {
    // Input is an email address
    return "email";
  } else if (phoneRegex.test(input)) {
    // Input is a phone number
    return "phone";
  }
  return "invalid";
};


export default validateInput;