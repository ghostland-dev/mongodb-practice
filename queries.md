# Queries MongoDB pour Mflix

## 1. Nombre total de films
```js
db.movies.countDocuments({ "type": "movie" })
```

## 2. Nombre total de séries
```js
db.movies.countDocuments({ "type": "series" })
```

## 3. Deux types de contenu présents
```js
db.movies.distinct("type")
```

## 4. Liste des genres disponibles
```js
db.movies.distinct("genres")
```

## 5. Films depuis 2015 classés par ordre décroissant
```js
db.movies.find({ year: { $gte: 2015 } }).sort({ year: -1 })
```

## 6. Nombre de films depuis 2015 ayant au moins 5 récompenses
```js
db.movies.countDocuments({ "year": { $gte: 2015 }, "awards.wins": { $gte: 5 } })
```

## 7. Nombre de ces films disponibles en français
```js
db.movies.countDocuments({ "year": { $gte: 2015 }, "awards.wins": { $gte: 5 }, "languages": "French" })
```

## 8. Nombre de films dont le genre est Thriller et Drama
```js
db.movies.countDocuments({ "genres": { $all: ["Thriller", "Drama"] } })
```

## 9. Titres et genres des films Crime ou Thriller
```js
db.movies.find({ "genres": { $in: ["Crime", "Thriller"] } }, { title: 1, genres: 1, _id: 0 })
```

## 10. Titres et langues des films disponibles en français et italien
```js
db.movies.find({ "languages": { $all: ["French", "Italian"] } }, { title: 1, languages: 1, _id: 0 })
```

## 11. Titres et genres des films avec une note IMDB > 9
```js
db.movies.find({ "imdb.rating": { $gt: 9 } }, { title: 1, genres: 1, _id: 0 })
```

## 12. Nombre de contenus avec exactement 4 acteurs au casting
```js
db.movies.countDocuments({ "cast": { $size: 4 } })
```

---