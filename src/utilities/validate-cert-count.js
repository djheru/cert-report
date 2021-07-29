module.exports = (companyData) => {
  const ERROR_CODE = 'MORE_CERTS_THAN_UNITS';
  const certsPerProperty = companyData.certs.reduce((certCounts, cert) => {
    const certCount = certCounts.hasOwnProperty(cert.property_id)
      ? certCounts[cert.property_id] + 1
      : 1;
    return { ...certCounts, [cert.property_id]: certCount };
  }, {});

  const invalidCertCount = companyData.properties.some((property) => {
    const certCountForProperty = certsPerProperty[property.id] || 0;
    return certCountForProperty > property.units;
  });

  if (invalidCertCount) {
    return {
      error_code: ERROR_CODE,
      company_id: companyData.company.id,
    };
  }
};
