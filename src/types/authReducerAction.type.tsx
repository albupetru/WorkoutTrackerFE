import { UserData } from './userData.type';

export type AuthReducerAction = {
  type: string;
  payload: UserData | null; //
};
