import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  _id: { type:String, required: false},
  title: { type: String, required: true },
  isbn: { type: String, required: true },
  pageCount: { type: Number, required: true },
  publishedDate: { type: Date, required: true }, 
  thumbnailUrl: { type: String },
  shortDescription: { type: String },
  longDescription: { type: String },
  status: { type: String, enum: ["PUBLISH", "DRAFT", "ARCHIVED"], required: true },
  authors: [{ type: String, required: true }],  
  categories: [{ type: String, required: true }]  
}, { timestamps: true });

const Book = mongoose.model("Book", bookSchema);

export default Book;