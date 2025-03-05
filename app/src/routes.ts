import express from "express";
import Book from "./models/book";
import Movie from "./models/Movie";

const router = express.Router();

/**
 * 🔹 Obtenir tous les livres
 */
router.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des livres", error });
  }
});

/**
 * 🔹 Obtenir un livre par ID
 */
router.get("/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du livre", error });
  }
});

/**
 * 🔹 Ajouter un livre
 */
router.post("/books", async (req, res) => {
  try {
    const {
      title,
      isbn,
      pageCount,
      publishedDate,
      thumbnailUrl,
      shortDescription,
      longDescription,
      status,
      authors,
      categories
    } = req.body;

    const newBook = new Book({
      title,
      isbn,
      pageCount,
      publishedDate,
      thumbnailUrl,
      shortDescription,
      longDescription,
      status,
      authors,
      categories
    });

    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de l'ajout du livre", error });
  }
});

/**
 * 🔹 Importer plusieurs livres en une seule requête
 */
router.post("/books/import", async (req, res) => {
  try {
    const booksData = req.body;

    if (!Array.isArray(booksData) || booksData.length === 0) {
      return res.status(400).json({ message: "Le format de la requête est invalide. Attendu: tableau de livres." });
    }

    const addedBooks = [];
    const errors = [];

    for (const book of booksData) {
      const { title, isbn, pageCount, publishedDate, thumbnailUrl, shortDescription, longDescription, status, authors, categories } = book;
      
      if (!title || !isbn || !pageCount || !publishedDate || !status || !authors || !categories) {
        errors.push({ book, error: "Champs obligatoires manquants." });
        continue;
      }

      try {
        const newBook = new Book({
          title,
          isbn,
          pageCount,
          publishedDate,
          thumbnailUrl,
          shortDescription,
          longDescription,
          status,
          authors,
          categories
        });

        const savedBook = await newBook.save();
        addedBooks.push(savedBook);
      } catch (err:any) {
        errors.push({ book, error: err });
      }
    }

    res.status(201).json({
      message: `${addedBooks.length} livres ajoutés avec succès.`,
      addedBooks,
      errors
    });

  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'importation des livres", error });
  }
});

/**
 * 🔹 Supprimer un livre
 */
router.delete("/books/:id", async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }
    res.json({ message: "Livre supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du livre", error });
  }
});

 
/**
 * 🔹 Obtenir tous les films
 */
router.get("/movies", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des films", error });
  }
});

/**
 * 🔹 Obtenir un film par ID
 */
router.get("/movies/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Film non trouvé" });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du film", error });
  }
});

/**
 * 🔹 Ajouter un film
 */
router.post("/movies", async (req, res) => {
  try {
    const newMovie = new Movie(req.body);
    await newMovie.save();
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de l'ajout du film", error });
  }
});

/**
 * 🔹 Importer plusieurs films
 */
router.post("/movies/import", async (req, res) => {
  try {
    const moviesData = req.body;

    if (!Array.isArray(moviesData) || moviesData.length === 0) {
      return res.status(400).json({ message: "Le format de la requête est invalide. Attendu: tableau de films." });
    }

    const addedMovies = await Movie.insertMany(moviesData);

    res.status(201).json({
      message: `${addedMovies.length} films ajoutés avec succès.`,
      addedMovies
    });

  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'importation des films", error });
  }
});

/**
 * 🔹 Supprimer un film
 */
router.delete("/movies/:id", async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
    if (!deletedMovie) {
      return res.status(404).json({ message: "Film non trouvé" });
    }
    res.json({ message: "Film supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du film", error });
  }
});

export default router;
