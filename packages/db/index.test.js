import db from './index';

beforeEach(() => {
  db.addTable('users', ['posts', 'profile']);
});

const user1 = { id: 1, name: 'Ben', posts: [1, 2], profile: 1 };
const user2 = { id: 2, name: 'Carl' };
const user3 = { id: 3, name: 'David' };

const post1 = { id: 1, title: 'Post One' };
const post2 = { id: 2, title: 'Post Two' };

const profile1 = { id: 1, address: 'Tidy' };

const state = {
  db: {
    tables: {
      users: {
        '1': user1,
        '2': user2,
        '3': user3,
      },
      posts: {
        '1': post1,
        '2': post2,
      },
      profiles: {
        '1': profile1,
      },
    },
    orders: {
      users: {
        default: [1, 2, 3],
        reverse: [3, 2, 1],
      },
    },
  },
};

test('creates Find (one)', () => {
  expect(db.findUser).toBeDefined();
  expect(db.findUser(state, 1)).toEqual(user1);
});

test('creates Get (many)', () => {
  expect(db.getUsers).toBeDefined();

  // "default" order by default
  expect(db.getUsers(state)).toEqual([user1, user2, user3]);

  // "reverse" order
  const reversed = db.getUsers(state, 'reverse');
  expect(reversed).toEqual([user3, user2, user1]);

  // Verify result is cached
  let newReversed = db.getUsers(state, 'reverse');
  expect(newReversed).toBe(reversed);

  // Clear cache
  const newState = { ...state };
  state.db.orders.users.reverse = [3, 1, 2];

  newReversed = db.getUsers(newState, 'reverse');

  expect(newReversed).not.toBe(reversed);
  expect(newReversed).toEqual([user3, user1, user2]);
});

test('creates find Relation (one)', () => {
  expect(db.findUserProfile).toBeDefined();
  expect(db.getUserProfile).not.toBeDefined();

  expect(db.findUserProfile(state, 1)).toEqual(profile1);
});

test('creates get Relations (many)', () => {
  expect(db.getUserPosts).toBeDefined();
  expect(db.findUserPosts).not.toBeDefined();

  expect(db.getUserPosts(state, 1)).toEqual([post1, post2]);
});
