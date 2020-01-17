// Dependencies
import jwt from 'jsonwebtoken';

// Resources
import api from '../utils/api';

// const currentUser = jwt.verify(sessionStorage.getItem('userJWT'), 'pale');

const login = async (credentials) => {
  const loginR = await api.User.SignIn({ credentials });
  return loginR;
};

const authenticationService = {
  login,
};

export default authenticationService;
