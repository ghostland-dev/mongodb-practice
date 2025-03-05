import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  isbn: { type: String, required: true },
  pageCount: { type: Number, required: true },
  publishedDate: { type: Date, required: true }, // Automatically handles ISO date format
  thumbnailUrl: { type: String },
  shortDescription: { type: String },
  longDescription: { type: String },
  status: { type: String, enum: ["PUBLISH", "DRAFT", "ARCHIVED"], required: true },
  authors: [{ type: String, required: true }], // Array of authors
  categories: [{ type: String, required: true }] // Array of categories
}, { timestamps: true });

const Book = mongoose.model("Book", bookSchema);

export default Book;
