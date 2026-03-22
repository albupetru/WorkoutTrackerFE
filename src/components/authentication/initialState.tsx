import { UserData } from "../../types/userData.type";

const initialState: UserData = {
  loading: true,
  error: false,
  requestToken: null,
  name: null,
  email: null,
  role: null,
  userId: null,
  userImage: false,
  userLoaded: false,
};

export default initialState;
