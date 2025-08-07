import createApiClient from "./api.service.js";

class BorrowingRecord {
  constructor(baseUrl = "/api/stat") {
    this.api = createApiClient(baseUrl);
  }

  async getTopBooks() {
    return (await this.api.get("/top-books")).data;
  }

  async getTopReaders() {
    return (await this.api.get("/top-readers")).data;
  }

  async getMonthlyStat() {
    return (await this.api.get("/monthly")).data;
  }
}

export default new BorrowingRecord();
