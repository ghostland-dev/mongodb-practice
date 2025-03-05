import Book from "../../models/book";
import router from "../../routes"; 
import request from "supertest";
import express from "express";

jest.mock("../../models/book");

const app = express();
app.use(express.json());
app.use(router);

describe("Book Routes - Unit Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("GET /books - doit retourner une liste de livres", async () => {
    (Book.find as jest.Mock).mockResolvedValue([
      { _id: "1", title: "Livre A", author: "Auteur A", publishedYear: 2020 },
      { _id: "2", title: "Livre B", author: "Auteur B", publishedYear: 2021 },
    ]);

    const response = await request(app).get("/books");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].title).toBe("Livre A");
  });

  test("POST /books - doit ajouter un nouveau livre", async () => {
    const newBook = { title: "Nouveau Livre", author: "Nouvel Auteur", publishedYear: 2023 };
    (Book.prototype.save as jest.Mock).mockResolvedValue({ _id: "123", ...newBook });

    const response = await request(app).post("/books").send(newBook);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(newBook.title);
  });

  test("DELETE /books/:id - doit supprimer un livre", async () => {
    (Book.findByIdAndDelete as jest.Mock).mockResolvedValue({});

    const response = await request(app).delete("/books/123");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Livre supprimé");
  });
});
