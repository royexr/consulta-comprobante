const BASE_URL = 'http://127.0.0.1:3001/api';

const callApi = async (endpoint, options = {}) => {
  const opts = options;
  opts.headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  opts.mode = 'cors';
  opts.cache = 'default';
  opts.credentials = 'same-origin';

  const url = BASE_URL + endpoint;
  const rt = await fetch(url, opts)
    .then((res) => res.json())
    .then((response) => response)
    .catch((error) => error);
  return rt;
};

const api = {
  Company: {
    ReadById(id) {
      return callApi(`/companies/${id}`, { method: 'GET' });
    },
  },
  Distincts: {
    GetValues(collection, fieldName, arrayFN, codes) {
      const initialQuery = `/${collection}/distinct/?fieldName=${fieldName}`;
      const arrayFNQuery = arrayFN !== undefined ? `&arrayFN=${arrayFN}` : '';
      const auxcodesQuery = codes !== undefined ? codes.map((code) => `&codes[]=${code}`) : '';
      const codesQuery = auxcodesQuery.constructor === Array ? auxcodesQuery.join('') : '';
      return callApi(initialQuery.concat(arrayFNQuery, codesQuery), { method: 'GET' });
    },
  },
  Invoice: {
    GetMany(query) {
      return callApi(`/invoices/?${query}`, { method: 'GET' });
    },
  },
  User: {
    Create(user) {
      return callApi('/users', { method: 'POST', body: JSON.stringify(user) });
    },
    GetById(userId) {
      return callApi(`/users/${userId}`, { method: 'GET' });
    },
    GetCompanies(userId) {
      return callApi(`/users/getCompanies/${userId}`, { method: 'GET' });
    },
    SignIn(credentials) {
      return callApi('/users/signin', { method: 'POST', body: JSON.stringify(credentials) });
    },
    SendMail(object) {
      return callApi('/users/sendmail', { method: 'POST', body: JSON.stringify(object) });
    },
    VerifyEmail(object) {
      return callApi('/users/verifyEmail', { method: 'POST', body: JSON.stringify(object) });
    },
  },
};

export default api;
