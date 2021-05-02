export default class Endpoint {
  constructor(http, namespace) {
    this.http = http;
    this.ns = namespace;
  }

  // CRUDL

  // C
  create(data) {
    return this.http.post(this.ns, data);
  }

  // R
  read(id) {
    return this.http.get(`${this.ns}/${id}`);
  }

  // U
  update(id, data) {
    return this.http.put(`${this.ns}/${id}`, data);
  }

  // D
  delete(id) {
    return this.http.delete(`${this.ns}/${id}`);
  }

  // L
  list(filters) {
    if (filters) {
      return this.http.search(this.ns, filters);
    }

    return this.http.get(this.ns);
  }
}
