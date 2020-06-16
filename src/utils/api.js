const config = require('../config');

const BASE_URL = `${config.servicesApi}`;

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
    Create(object) {
      return callApi('/companies', { method: 'POST', body: JSON.stringify(object) });
    },
    Delete(id) {
      return callApi(`/companies/${id}`, { method: 'DELETE' });
    },
    ReadAll(signal) {
      const opts = {
        method: 'GET',
      };
      if (signal !== undefined) {
        opts.signal = signal;
      }
      return callApi('/companies', opts);
    },
    ReadById(id, signal) {
      return callApi(`/companies/${id}`, { method: 'GET', signal });
    },
    Update(object) {
      return callApi('/companies', { method: 'PUT', body: JSON.stringify(object) });
    },
  },
  Voucher: {
    GetEntities(companyCode, bookCode, signal) {
      return callApi(`/vouchers/getEntities/?companyCode=${companyCode}&bookCode=${bookCode}`, { method: 'GET', signal });
    },
    GetDetailedReport(query) {
      return callApi(`/vouchers/getDetailedReport?${query}`, { method: 'GET' });
    },
    GetResumedReport(query) {
      return callApi(`/vouchers/getResumedReport?${query}`, { method: 'GET' });
    },
    GetSeriesNumbers(companyCode, bookCode) {
      return callApi(`/vouchers/getSeriesNumbers/?companyCode=${companyCode}&bookCode=${bookCode}`, { method: 'GET' });
    },
    ReadMany(query, signal) {
      return callApi(`/vouchers/?${query}`, { method: 'GET', signal });
    },
    ReadReport(id, signal) {
      return callApi(`/vouchers/getReport/${id}`, { method: 'GET', signal });
    },
    VerifyFinalUser(clientCode) {
      return callApi(`/vouchers/verifyFinalUser/${clientCode}`, { method: 'GET' });
    },
    VerifyVoucher(query) {
      return callApi(`/vouchers/verifyVoucher?${query}`, { method: 'GET' });
    },
  },
  VoucherTypes: {
    GetAll(signal) {
      return callApi('/voucherTypes', { method: 'GET', signal });
    },
  },
  User: {
    AddCompany(object) {
      return callApi('/users/addCompany', { method: 'PUT', body: JSON.stringify(object) });
    },
    Create(object) {
      return callApi('/users', { method: 'POST', body: JSON.stringify(object) });
    },
    CreateWithCode(object) {
      return callApi('/users/withCode', { method: 'POST', body: JSON.stringify(object) });
    },
    Delete(userId) {
      return callApi(`/users/${userId}`, { method: 'DELETE' });
    },
    GetAll() {
      return callApi('/users', { method: 'GET' });
    },
    GetAllWithCompanies(signal) {
      return callApi('/users/allWithCompanies', { method: 'GET', signal });
    },
    GetById(userId, signal) {
      return callApi(`/users/${userId}`, { method: 'GET', signal });
    },
    GetCompanies(userId, signal) {
      const opts = {
        method: 'GET',
      };
      if (opts !== undefined) {
        opts.signal = signal;
      }
      return callApi(`/users/getCompanies?userId=${userId}`, opts);
    },
    RequestReset(object) {
      return callApi('/users/requestResetPassword', { method: 'POST', body: JSON.stringify(object) });
    },
    ResetPassword(object, query) {
      return callApi(`/users/resetPassword${query}`, { method: 'POST', body: JSON.stringify(object) });
    },
    SignIn(credentials) {
      return callApi('/users/signin', { method: 'POST', body: JSON.stringify(credentials) });
    },
    Update(object) {
      return callApi('/users/', { method: 'PUT', body: JSON.stringify(object) });
    },
    VerifyEmail(object) {
      return callApi('/users/verifyEmail', { method: 'POST', body: JSON.stringify(object) });
    },
  },
  UserCode: {
    Create(object) {
      return callApi('/userCodes', { method: 'POST', body: JSON.stringify(object) });
    },
  },
};

export default api;
