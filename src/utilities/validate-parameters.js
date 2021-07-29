module.exports = (parameters) =>
  parameters.length > 0 && // Validate that input was received
  parameters.includes(' ') === false // Validate no spaces
    ? parameters.split(',').filter((id) => !!id) // Filter out any empty elements
    : false;
