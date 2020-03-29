export default Object.assign(
  {
    API_URL: 'https://example.org/api',
  },
  __DEV__ && {
    API_URL: 'http://127.0.0.1:8000/api',
  },
);
