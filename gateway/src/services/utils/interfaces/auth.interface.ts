export interface IAuthorizedRequest extends Request {
  tokenData?: ITokenData;
}

export interface ITokenData {
  userId?: string;
  name: string;
  email: string;
  categories: [string];
  token: string;
}
