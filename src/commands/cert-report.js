const validateParameters = require('../utilities/validate-parameters');

const command = {
  name: 'cert-report',
  description: 'Generates a report for a list of companies',
  run: async (toolbox) => {
    const { print, parameters, prompt, apiClient, report } = toolbox;

    // Validate input. If invalid, give them a chance to correct it
    let validInput = validateParameters(parameters.string);

    if (!validInput) {
      print.highlight(print.colors.error('Invalid input detected'));
      const inputResponse = await prompt.ask({
        type: 'input',
        name: 'ids',
        message: 'Please enter a comma-separated list of IDs with no spaces',
      });

      validInput = validateParameters(inputResponse.ids);
      if (!validInput) {
        print.error('Please try again with valid input');
      }
    }
    const rawData = await apiClient.fetchReportData(validInput);
    const reportData = report.generate(rawData);
    print.info(JSON.stringify(reportData, null, 2));
  },
};

module.exports = command;
