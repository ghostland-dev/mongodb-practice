import express from "express";
import Book from "./models/book";

const router = express.Router();

// Obtenir tous les livres
router.get("/books", async (req: any, res: { json: (arg0: any) => void; }) => {
  const books = await Book.find();
  res.json(books);
});

// Ajouter un livre
router.post("/books", async (req: { body: { title: any; author: any; publishedYear: any; }; }, res: { json: (arg0: any) => void; }) => {
  const { title, author, publishedYear } = req.body;
  const newBook = new Book({ title, author, publishedYear });
  await newBook.save();
  res.json(newBook);
});

// Supprimer un livre
router.delete("/books/:id", async (req: { params: { id: any; }; }, res: { json: (arg0: { message: string; }) => void; }) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: "Livre supprimé" });
});

export default router;
