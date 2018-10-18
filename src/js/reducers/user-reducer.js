/**
 *
 *  reducer - to update store state
 *  listens to every action that is sent
 */
import { UPDATE_USER } from "../actions/user-actions";

export default function userReducer(state = "", { type, payload }) {
  switch (type) {
    case UPDATE_USER:
      return payload.user;
    default:
      return state;
  }
}
