export interface IUser {
  email?: string;
  password?: string;
  name?: string;
  address?: string;
  dob?: Date;
  categories?: [string];
}
export interface IUserLogin {
  email: string;
  password: string;
}
export interface DataStoredInToken {
  id: string;
  name: string;
  email: string;
  loginType: string;
}
