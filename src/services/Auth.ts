export interface Token {
  accessToken: string;
  expiresIn: number;
}

export interface User {
  email: string;
  id: string;
  name: string;
  role: string;
}

class Auth {
  public token: Token | null;
  public user: User;

  constructor() {
    const authInfo = localStorage.getItem('authInformation');

    this.token = authInfo
      ? JSON.parse(authInfo || '{}').token.accessToken
      : null;
    this.user = authInfo ? JSON.parse(authInfo || '{}').user : null;
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
  getUser() {
    return this.user;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authInformation');
  }
}

export default new Auth();
