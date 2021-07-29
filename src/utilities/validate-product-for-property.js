module.exports = (companyData) => {
  const ERROR_CODE = 'INVALID_PRODUCT_FOR_PROPERTY';
  const propertyTypeMap = companyData.properties.reduce((typeMap, property) => {
    typeMap[property.id] = property.type;
    return typeMap;
  }, {});

  const invalidProductForPropertyType = companyData.certs.some((cert) => {
    return (
      (cert.installment_payment === 0 &&
        propertyTypeMap[cert.property_id] === 'INSTALLMENTS') ||
      (cert.down_payment === 0 &&
        propertyTypeMap[cert.property_id] === 'PAY_IN_FULL')
    );
  });

  if (invalidProductForPropertyType) {
    return {
      error_code: ERROR_CODE,
      company_id: companyData.company.id,
    };
  }
};
