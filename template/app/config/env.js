export default Object.assign(
  {
    API_URL: 'https://example.org/api',
    SOCKET_URL: 'https://example.org:6001',
  },
  __DEV__ && {
    API_URL: 'http://127.0.0.1:8000/api',
    SOCKET_URL: 'http://127.0.0.1:6001',
  },
);
