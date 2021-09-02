export default class Endpoint {
  constructor(http, key) {
    this.http = http;
    this.key = key;
  }

  // CRUDL

  // C
  create(data) {
    return this.http.post(this.key, data);
  }

  // R
  read(id) {
    return this.http.get(`${this.key}/${id}`);
  }

  // U
  update(id, data) {
    return this.http.put(`${this.key}/${id}`, data);
  }

  // D
  delete(id) {
    return this.http.delete(`${this.key}/${id}`);
  }

  // L
  list(query) {
    if (query) {
      return this.http.search(this.key, query);
    }

    return this.http.get(this.key);
  }
}
