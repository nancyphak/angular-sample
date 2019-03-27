export class AuthToken {
  exp: any;
  expiresAt: any;

  constructor(public accessToken: string,
              public expiresIn: number,
              public idToken: string,
              public tokenType: string = 'Bearer') {
    this.expiresAt = (this.expiresIn * 1000) + new Date().getTime();
    this.exp = this.expiresAt - (60 * 1000);
  }

  public static isValid(authToken: AuthToken) {
    return (authToken.accessToken && !this.isExpired(authToken));
  }

  public static isExpired(authToken: AuthToken): boolean {
    return new Date().getTime() > authToken.expiresAt;
  }
}
