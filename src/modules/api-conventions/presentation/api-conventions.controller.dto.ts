export interface IAdminAccessToken {
  name: string;
  accessToken: string;
  refreshToken: string;
}

export interface CreateAdminAccessTokenRes {
  adminAccessTokens: IAdminAccessToken[];
}
