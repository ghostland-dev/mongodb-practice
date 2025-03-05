import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "./../../index"; // Assurez-vous que c'est bien votre serveur Express
import Movie from "../../models/Movie";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  await Movie.deleteMany({}); // Nettoie la DB avant chaque test
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Movie API - E2E Tests", () => {
  test("GET /movies - devrait retourner une liste vide au départ", async () => {
    const response = await request(app).get("/movies");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("POST /movies - devrait ajouter un nouveau film", async () => {
    const newMovie = {
      title: "Blacksmith Scene",
      plot: "Three men hammer on an anvil and pass a bottle of beer around.",
      genres: ["Short"],
      runtime: 1,
      cast: ["Charles Kayser", "John Ott"],
      num_mflix_comments: 1,
      countries: ["USA"],
      released: "1893-05-01T00:00:00.000Z",
      directors: ["William K.L. Dickson"],
      rated: "UNRATED",
      awards: { wins: 1, nominations: 0, text: "1 win." },
      year: 1893,
      imdb: { rating: 6.2, votes: 1189, id: 5 },
      type: "movie",
      tomatoes: { viewer: { rating: 3, numReviews: 184, meter: 32 }, lastUpdated: "2015-08-26T00:03:50.133Z" }
    };

    const response = await request(app).post("/movies").send(newMovie);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(newMovie);
  });

  test("DELETE /movies/:id - devrait supprimer un film existant", async () => {
    const movie = await Movie.create({
      title: "Film Test",
      genres: ["Drama"],
      year: 2023
    });

    const response = await request(app).delete(`/movies/${movie._id}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Film supprimé avec succès");

    const checkMovie = await Movie.findById(movie._id);
    expect(checkMovie).toBeNull();
  });

  test("DELETE /movies/:id - devrait retourner 404 si le film n'existe pas", async () => {
    const response = await request(app).delete("/movies/60d5ec49f7e4b91b3c8f8e7a");
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Film non trouvé");
  });
});
