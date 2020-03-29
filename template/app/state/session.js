import produce from 'immer';

const initialState = {
  userId: 1,
  token: null,
};

export default produce((draft, { type, payload }) => {
  switch (type) {
    case 'Your login successful action type here...':
      draft.token = payload;
      break;

    default:
      break;
  }
}, initialState);
