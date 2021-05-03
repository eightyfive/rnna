export default class Endpoint {
  constructor(http, name) {
    this.http = http;
    this.name = name;
  }

  // CRUDL

  // C
  create(data) {
    return this.http.post(this.name, data);
  }

  // R
  read(id) {
    return this.http.get(`${this.name}/${id}`);
  }

  // U
  update(id, data) {
    return this.http.put(`${this.name}/${id}`, data);
  }

  // D
  delete(id) {
    return this.http.delete(`${this.name}/${id}`);
  }

  // L
  list(filters) {
    if (filters) {
      return this.http.search(this.name, filters);
    }

    return this.http.get(this.name);
  }
}
