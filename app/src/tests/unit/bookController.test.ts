import Book from "../../models/book";
import router from "../../routes"; 
import express from "express";
import request from "supertest";

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
      {
        _id: "1",
        title: "Livre A",
        isbn: "1234567890",
        pageCount: 250,
        publishedDate: new Date("2022-01-01"),
        thumbnailUrl: "https://example.com/image1.jpg",
        shortDescription: "Short description A",
        longDescription: "Long description A",
        status: "PUBLISH",
        authors: ["Auteur A"],
        categories: ["Category A"],
      },
      {
        _id: "2",
        title: "Livre B",
        isbn: "0987654321",
        pageCount: 300,
        publishedDate: new Date("2023-01-01"),
        thumbnailUrl: "https://example.com/image2.jpg",
        shortDescription: "Short description B",
        longDescription: "Long description B",
        status: "PUBLISH",
        authors: ["Auteur B"],
        categories: ["Category B"],
      },
    ]);

    const response = await request(app).get("/books");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].title).toBe("Livre A");
    expect(response.body[0]).toHaveProperty("isbn");
    expect(response.body[0]).toHaveProperty("authors");
  });

  test("POST /books - doit ajouter un nouveau livre", async () => {
    const newBook = {
      title: "Nouveau Livre",
      isbn: "1122334455",
      pageCount: 320,
      publishedDate: "2024-01-15",
      thumbnailUrl: "https://example.com/new-book.jpg",
      shortDescription: "Une courte description",
      longDescription: "Une longue description",
      status: "PUBLISH",
      authors: ["Nouvel Auteur"],
      categories: ["Nouvelle Catégorie"],
    };

    (Book.prototype.save as jest.Mock).mockResolvedValue({ _id: "123", ...newBook });

    const response = await request(app).post("/books").send(newBook);

    expect(response.status).toBe(201);
    expect(response.body.title).toBe(newBook.title);
    expect(response.body).toHaveProperty("isbn");
    expect(response.body).toHaveProperty("authors");
  });

  test("DELETE /books/:id - doit supprimer un livre", async () => {
    (Book.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: "123" });

    const response = await request(app).delete("/books/123");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Livre supprimé avec succès");
  });

  test("DELETE /books/:id - retourne 404 si le livre n'existe pas", async () => {
    (Book.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

    const response = await request(app).delete("/books/999");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Livre non trouvé");
  });
});
