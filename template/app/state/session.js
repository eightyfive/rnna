import produce from 'immer';

const initialState = {
  userId: null,
  token: null,
};

const is401 = /\s401$/;

export default produce((draft, { type, payload }) => {
  switch (type) {
    case '[API] POST /login 200':
      draft.token = payload;
      break;

    case '[API] GET /user 200':
      draft.userId = payload.result;
      break;

    default:
      break;
  }

  // Logout
  if (is401.test(type)) {
    return initialState;
  }
}, initialState);
