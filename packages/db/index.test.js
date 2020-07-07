import db from './index';
import { denormalize, schema } from 'normalizr';

const postSchema = new schema.Entity('posts');
const profileSchema = new schema.Entity('profiles');

const userSchema = new schema.Entity('users', {
  posts: [postSchema],
  profile: profileSchema,
});

beforeEach(() => {
  db.addEntity('users', userSchema);
});

const user1 = { id: 1, name: 'Ben', posts: [1, 2], profile: 1 };
const user2 = { id: 2, name: 'Carl' };
const user3 = { id: 3, name: 'David' };

const post1 = { id: 1, title: 'ONE' };
const post2 = { id: 2, title: 'TWO' };

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

const user1Denormalized = {
  id: 1,
  name: 'Ben',
  posts: [post1, post2],
  profile: profile1,
};

test('creates Find (one)', () => {
  expect(db.findUser).toBeDefined();

  const user = db.findUser(state, 1);

  expect(user.name).toBe('Ben');
  expect(user.posts).toEqual([post1, post2]);
  expect(user.profile).toEqual(profile1);
});

test('creates Get (many)', () => {
  expect(db.getUsers).toBeDefined();

  // "default" order by default
  expect(db.getUsers(state)).toEqual([user1Denormalized, user2, user3]);

  // "reverse" order
  const reversed = db.getUsers(state, 'reverse');
  expect(reversed).toEqual([user3, user2, user1Denormalized]);

  // Verify result is cached
  let newReversed = db.getUsers(state, 'reverse');
  expect(newReversed).toBe(reversed);

  // Clear cache
  const newState = { ...state };
  state.db.orders.users.reverse = [3, 1, 2];

  newReversed = db.getUsers(newState, 'reverse');

  expect(newReversed).not.toBe(reversed);
  expect(newReversed).toEqual([user3, user1Denormalized, user2]);
});
