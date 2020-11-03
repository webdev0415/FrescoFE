class Auth {
  public token;

  constructor() {
    const authInfo = localStorage.getItem('authInformation');
    console.log('authInfo', authInfo);

    this.token = authInfo
      ? JSON.parse(authInfo || '{}').token.accessToken
      : null;
  }

  isLogged() {
    return this.token ? true : false;
  }

  setToken(token) {
    this.token = token;
  }

  getToken() {
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authInformation');
  }
}

export default new Auth();
