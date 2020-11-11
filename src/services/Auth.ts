class Auth {
  public token;

  constructor() {
    const authInfo = localStorage.getItem('authInformation');

    this.token = authInfo
      ? JSON.parse(authInfo || '{}').token.accessToken
      : null;
  }

  isLogged() {
    return !!this.token;
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
