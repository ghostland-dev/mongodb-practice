import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../../index"; // Ensure this imports your Express app
import Book from "./../../models/book";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  } as any);
});

beforeEach(async () => {
  await Book.deleteMany({}); // Clear the collection before each test
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Book API - E2E Tests", () => {
  test("GET /books - doit retourner une liste vide au départ", async () => {
    const response = await request(app).get("/books");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("POST /books - doit ajouter un nouveau livre", async () => {
    const newBook = {
      title: "Nouveau Livre",
      isbn: "1234567890",
      pageCount: 300,
      publishedDate: "2024-01-15T08:00:00.000Z",
      thumbnailUrl: "https://example.com/book.jpg",
      shortDescription: "Une courte description",
      longDescription: "Une longue description",
      status: "PUBLISH",
      authors: ["Auteur Test"],
      categories: ["Catégorie Test"]
    };

    const response = await request(app).post("/books").send(newBook);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(newBook);
    expect(response.body).toHaveProperty("_id");
  });

  test("POST /books - doit échouer si des champs obligatoires sont manquants", async () => {
    const incompleteBook = {
      title: "Livre Sans ISBN"
    };

    const response = await request(app).post("/books").send(incompleteBook);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Erreur lors de l'ajout du livre");
  });

  test("GET /books - doit retourner la liste des livres ajoutés", async () => {
    await Book.create({
      title: "Livre 1",
      isbn: "1111111111",
      pageCount: 200,
      publishedDate: new Date(),
      thumbnailUrl: "https://example.com/book1.jpg",
      shortDescription: "Livre 1 description",
      longDescription: "Détails sur Livre 1",
      status: "PUBLISH",
      authors: ["Auteur 1"],
      categories: ["Catégorie 1"]
    });

    const response = await request(app).get("/books");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].title).toBe("Livre 1");
  });

  test("DELETE /books/:id - doit supprimer un livre existant", async () => {
    const book = await Book.create({
      title: "Livre à Supprimer",
      isbn: "2222222222",
      pageCount: 250,
      publishedDate: new Date(),
      thumbnailUrl: "https://example.com/book2.jpg",
      shortDescription: "Livre 2 description",
      longDescription: "Détails sur Livre 2",
      status: "PUBLISH",
      authors: ["Auteur 2"],
      categories: ["Catégorie 2"]
    });

    const response = await request(app).delete(`/books/${book._id}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Livre supprimé avec succès");

    const checkBook = await Book.findById(book._id);
    expect(checkBook).toBeNull();
  });

  test("DELETE /books/:id - doit retourner 404 si le livre n'existe pas", async () => {
    const response = await request(app).delete("/books/60d5ec49f7e4b91b3c8f8e7a"); // Random ID

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Livre non trouvé");
  });
});
