const validateCertCount = require('../utilities/validate-cert-count');
const validateProductForProperty = require('../utilities/validate-product-for-property');
const revenueReducer = require('../utilities/revenue-reducer');
const unitsReducer = require('../utilities/units-reducer');

module.exports = async (toolbox) => {
  const { print } = toolbox;
  const reportTemplate = () => ({
    report: [],
    errors: [],
  });

  const validate = (companyData) => {
    const productValidationError = validateProductForProperty(companyData);
    if (productValidationError) {
      return productValidationError;
    }

    const certCountError = validateCertCount(companyData);
    if (certCountError) {
      return certCountError;
    }
  };

  const generatePropertiesReport = (companyData) => {
    const propertiesReport = companyData.properties.map((property) => {
      const property_id = property.id;
      const certs = companyData.certs.reduce((sum, cert) => {
        if (cert.property_id === property.id) {
          sum++;
        }
        return sum;
      }, 0);
      const units = property.units;
      const coverage = certs / units;
      const monthly_revenue = companyData.certs
        .filter(({ property_id }) => property_id === property.id)
        .reduce(revenueReducer, 0);
      return { property_id, certs, units, coverage, monthly_revenue };
    });
    return propertiesReport;
  };

  const generateCertsReport = (companyData) => {
    const totalCerts = companyData.certs.length;
    const certsMap = companyData.certs.reduce((certData, cert) => {
      const product_id = cert.product_id;
      if (certData.hasOwnProperty(product_id)) {
        certData[product_id].amount++;
        certData[product_id].percent = certData[product_id].amount / totalCerts;
      } else {
        certData[product_id] = {
          amount: 1,
          percent: 1 / totalCerts,
          product_id,
        };
      }
      return certData;
    }, {});
    return Object.values(certsMap);
  };

  const generateCompanyReport = (companyData) => {
    const error = validate(companyData);
    if (error) {
      print.info(error);
      return { error };
    }
    const company_id = companyData.company.id;
    const company_name = companyData.company.name || 'unknown';
    const total_units = companyData.properties.reduce(unitsReducer, 0);
    const total_certs = companyData.certs.length;
    const total_coverage = total_certs / total_units;
    const monthly_revenue = companyData.certs.reduce(revenueReducer, 0);
    const annual_revenue = monthly_revenue * 12;
    const properties = generatePropertiesReport(companyData);
    const certs = generateCertsReport(companyData);

    const report = {
      company_id,
      company_name,
      total_units,
      total_certs,
      total_coverage,
      monthly_revenue,
      annual_revenue,
      properties,
      certs,
    };
    return { report };
  };

  const generate = (rawData) => {
    const reportData = reportTemplate();
    for (const companyId of Object.keys(rawData)) {
      const companyData = rawData[companyId];
      if (!companyData.company.id) {
        companyData.company.id = companyId;
      }
      const { report, error } = generateCompanyReport(companyData);
      if (report) {
        reportData.report.push(report);
      }
      if (error) {
        reportData.errors.push(error);
      }
    }
    return reportData;
  };
  toolbox.report = { generate };
};
