import { UserData } from "../../types/userData.type";

const initialState: UserData = {
  loading: false,
  error: false,
  requestToken: null,
  name: null,
  email: null,
  accessToken: null,
  userId: null,
  userImage: false,
  userLoaded: false,
};

export default initialState;
