import dotenv from "dotenv";
import fs from 'fs';
import connectDB, { isDatabaseEmpty } from "./../database";

dotenv.config();

const API_BASE_URL = `http://localhost:${process.env.PORT || 3000}/api`; // Correction de l'URL
const BOOKS_IMPORT_URL = `${API_BASE_URL}/books/import`;
const MOVIES_IMPORT_URL = `${API_BASE_URL}/movies/import`;

/**
 * 🔍 Function to check if MongoDB is empty before importing
 */
const seedDatabase = async () => {
  try {
    await connectDB(); // Connexion à MongoDB

    const dbIsEmpty = await isDatabaseEmpty();
    if (!dbIsEmpty) {
      console.log("⚠️ Database is not empty. Skipping import.");
      process.exit();
    }

    console.log("📥 Seeding data using API requests...");

    const fetch = (await import("node-fetch")).default;

    // Lecture des fichiers JSON
    const booksData = JSON.parse(fs.readFileSync('./data/books_data.json', 'utf-8'));
    const moviesData = JSON.parse(fs.readFileSync('./data/movies_data.json', 'utf-8'));

    // 📚 Envoi des livres à l'API
    const booksResponse = await fetch(BOOKS_IMPORT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booksData),
    });

    if (!booksResponse.ok) {
      throw new Error(`Failed to import books: ${await booksResponse.text()}`);
    }

    console.log(`✅ Imported ${booksData.length} books successfully`);

    // 🎬 Envoi des films à l'API
    const moviesResponse = await fetch(MOVIES_IMPORT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(moviesData),
    });

    if (!moviesResponse.ok) {
      throw new Error(`Failed to import movies: ${await moviesResponse.text()}`);
    }

    console.log(`✅ Imported ${moviesData.length} movies successfully`);

    console.log("🎉 Seeding complete!");
    process.exit();
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  }
};

// Exécution du script
seedDatabase();
