const axios = require('axios').default;

const { API_ENDPOINT_URL: url = 'http://localhost:4000/companies' } =
  process.env;

module.exports = async (toolbox) => {
  const getCompanyApi = async (companyId) => {
    const { data } = await axios.get(`${url}/${companyId}`);

    if (data && data.status === 'success') {
      return data.company;
    }
    throw new Error('Unable to retrieve company data');
  };

  const getCertsApi = async (companyId) => {
    const { data } = await axios.get(`${url}/${companyId}/certs`);

    if (data && data.status === 'success') {
      return data.certs;
    }
    throw new Error('Unable to retrieve cert data');
  };

  const getPropertiesApi = async (companyId) => {
    const { data } = await axios.get(`${url}/${companyId}/properties`);

    if (data && data.status === 'success') {
      return data.properties;
    }
    throw new Error('Unable to retrieve properties data');
  };

  const getCompanyData = async (companyId) => {
    const [company, certs, properties] = await Promise.all([
      getCompanyApi(companyId),
      getCertsApi(companyId),
      getPropertiesApi(companyId),
    ]);

    return { companyId, company, certs, properties };
  };

  const fetchReportData = async (companyIds) => {
    const companyDataRequests = companyIds.map((companyId) =>
      getCompanyData(companyId),
    );
    const companyDataArray = await Promise.all(companyDataRequests);
    return companyDataArray.reduce(
      (dataObj, { companyId, company, certs, properties }) => ({
        [companyId]: { company, certs, properties },
        ...dataObj,
      }),
      {},
    );
  };

  toolbox.apiClient = { fetchReportData };
};
