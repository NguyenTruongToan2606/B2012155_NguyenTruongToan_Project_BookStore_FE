import createApiClient from "./api.service.js";

class BookService {
  constructor(baseUrl = "/api/auth") {
    this.api = createApiClient(baseUrl);
  }

  async login(data) {
    return await this.api.post("/login", data);
  }
}

export default new BookService();
