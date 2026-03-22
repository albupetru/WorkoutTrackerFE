import { UserRole } from "./UserRole.type";

export type UserData = {
  loading: boolean;
  error: boolean;
  userId: string | null;
  requestToken: string | null;
  name: string | null;
  email: string | null;
  role: UserRole | null;
  userImage: boolean;
  userLoaded: boolean;
};
