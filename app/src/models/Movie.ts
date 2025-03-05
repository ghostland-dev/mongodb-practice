import mongoose, { Document, Schema } from "mongoose";

interface IAwards {
  wins: number;
  nominations: number;
  text: string;
}

interface IIMDB {
  rating: number;
  votes: number;
  id: number;
}

interface ITomatoes {
  viewer: {
    rating: number;
    numReviews: number;
    meter: number;
  };
  lastUpdated: Date;
}

export interface IMovie extends Document {
  title: string;
  plot: string;
  fullplot: string;
  genres: string[];
  runtime: number;
  cast: string[];
  num_mflix_comments: number;
  countries: string[];
  released: Date;
  directors: string[];
  rated: string;
  awards: IAwards;
  lastupdated: string;
  year: number;
  imdb: IIMDB;
  type: string;
  tomatoes: ITomatoes;
}

const MovieSchema: Schema = new Schema(
  {
    _id: { type:String, required: false},
    title: { type: String, required: true },
    plot: { type: String },
    fullplot: { type: String },
    genres: { type: [String] },
    runtime: { type: Number },
    cast: { type: [String] },
    num_mflix_comments: { type: Number },
    countries: { type: [String] },
    released: { type: Date },
    directors: { type: [String] },
    rated: { type: String },
    awards: {
      wins: { type: Number },
      nominations: { type: Number },
      text: { type: String },
    },
    lastupdated: { type: String },
    year: { type: Number },
    imdb: {
      rating: { type: Number },
      votes: { type: Number },
      id: { type: Number },
    },
    type: { type: String, required: true },
    tomatoes: {
      viewer: {
        rating: { type: Number },
        numReviews: { type: Number },
        meter: { type: Number },
      },
      lastUpdated: { type: Date },
    },
  },
  { timestamps: true }
);

const Movie = mongoose.model<IMovie>("Movie", MovieSchema);
export default Movie;
