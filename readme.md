### Voici un projet complet avec :

1. **Un `docker-compose.yml` corrigé** pour MongoDB avec les meilleures pratiques.
2. **Une application Express en TypeScript** qui communique avec la base MongoDB pour gérer une collection de livres.

---

## 📌 **1. Correction du fichier `docker-compose.yml`**

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    restart: unless-stopped
    env_file:
      - .env
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_INITDB_ROOT_USERNAME}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_INITDB_ROOT_PASSWORD}
      MONGO_INITDB_DATABASE: ${MONGO_INITDB_DATABASE}
    ports:
      - "27017:27017"
    networks:
      - service_network
    volumes:
      - mongo_data:/data/db
      - mongo_config:/data/configdb
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.runCommand('ping').ok"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 30s
    deploy:
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M
    ulimits:
      nofile:
        soft: 64000
        hard: 64000

  app:
    build: ./app
    restart: unless-stopped
    env_file:
      - .env
    depends_on:
      mongodb:
        condition: service_healthy
    networks:
      - service_network
    ports:
      - "3000:3000"

networks:
  service_network:
    driver: bridge

volumes:
  mongo_data:
    driver: local
  mongo_config:
    driver: local
```

---

## 📌 **2. Application Express TypeScript avec MongoDB**
Créons une application TypeScript qui va gérer une collection de livres.

### 📂 **Structure du projet**
```
/project
 ├── /app
 │   ├── /tests
 │   │   ├── e2e
 │   │   │ |── bookRoutes.e2e.test.ts
 │   │   ├── unit
 │   │   │ |── bookController.test.ts
 │   ├── /src
 │   │   ├── index.ts
 │   │   ├── database.ts
 │   │   ├── routes.ts
 │   │   ├── models/Book.ts
 │   ├── package.json
 │   ├── tsconfig.json
 │   ├── Dockerfile
 ├── docker-compose.yml
 ├── .env
```
 

### 📌 **3. Fichier `.env`**
```env
# App Configs
PORT=3000
MONGO_URI=mongodb://username:password@mongo-db:27017/database_name?authSource=username

# Database Configs
MONGO_INITDB_ROOT_USERNAME=username
MONGO_INITDB_ROOT_PASSWORD=password
MONGO_INITDB_DATABASE=database_name
```
 
---

## 📌 **4. Lancement du projet**
1. **Lancer Docker Compose**
   ```sh
   docker-compose up --build
   ```
Voici les commandes `cURL` correspondantes pour les différentes routes de votre API :

### 📚 **Livres (Books)**

#### 1️⃣ **Obtenir tous les livres**
```sh
curl -X GET http://localhost:3000/api/books
```

#### 2️⃣ **Obtenir un livre par ID**
```sh
curl -X GET http://localhost:3000/api/books/{id}
```
Remplacez `{id}` par l'ID du livre recherché.

#### 3️⃣ **Ajouter un livre**
```sh
curl -X POST http://localhost:3000/api/books \
     -H "Content-Type: application/json" \
     -d '{
           "title": "Nom du livre",
           "isbn": "123456789",
           "pageCount": 300,
           "publishedDate": "2023-01-01T00:00:00.000Z",
           "thumbnailUrl": "https://example.com/image.jpg",
           "shortDescription": "Description courte",
           "longDescription": "Description longue",
           "status": "PUBLISHED",
           "authors": ["Auteur 1"],
           "categories": ["Catégorie 1"]
         }'
```

#### 4️⃣ **Importer plusieurs livres**
```sh
curl -X POST http://localhost:3000/api/books/import \
     -H "Content-Type: application/json" \
     -d '[
           {
             "title": "Livre 1",
             "isbn": "1111111111",
             "pageCount": 250,
             "publishedDate": "2023-01-01T00:00:00.000Z",
             "thumbnailUrl": "https://example.com/image1.jpg",
             "shortDescription": "Description 1",
             "longDescription": "Longue description 1",
             "status": "PUBLISHED",
             "authors": ["Auteur 1"],
             "categories": ["Catégorie A"]
           },
           {
             "title": "Livre 2",
             "isbn": "2222222222",
             "pageCount": 320,
             "publishedDate": "2023-02-01T00:00:00.000Z",
             "thumbnailUrl": "https://example.com/image2.jpg",
             "shortDescription": "Description 2",
             "longDescription": "Longue description 2",
             "status": "PUBLISHED",
             "authors": ["Auteur 2"],
             "categories": ["Catégorie B"]
           }
         ]'
```

#### 5️⃣ **Supprimer un livre**
```sh
curl -X DELETE http://localhost:3000/api/books/{id}
```
Remplacez `{id}` par l'ID du livre à supprimer.

---

### 🎬 **Films (Movies)**

#### 1️⃣ **Obtenir tous les films**
```sh
curl -X GET http://localhost:3000/api/movies
```

#### 2️⃣ **Obtenir un film par ID**
```sh
curl -X GET http://localhost:3000/api/movies/{id}
```
Remplacez `{id}` par l'ID du film recherché.

#### 3️⃣ **Ajouter un film**
```sh
curl -X POST http://localhost:3000/api/movies \
     -H "Content-Type: application/json" \
     -d '{
           "title": "Nom du film",
           "director": "Réalisateur",
           "releaseDate": "2023-01-01T00:00:00.000Z",
           "genre": "Action",
           "rating": 8.5
         }'
```

#### 4️⃣ **Importer plusieurs films**
```sh
curl -X POST "http://localhost:3000/movies" \
     -H "Content-Type: application/json" \
     -d '[
  {
    "title": "Inception",
    "plot": "A thief who enters dreams to steal secrets.",
    "fullplot": "A skilled thief is given a chance to erase his criminal past.",
    "genres": ["Sci-Fi", "Thriller"],
    "runtime": 148,
    "cast": ["Leonardo DiCaprio", "Joseph Gordon-Levitt"],
    "num_mflix_comments": 10,
    "countries": ["USA"],
    "released": "2010-07-16T00:00:00Z",
    "directors": ["Christopher Nolan"],
    "rated": "PG-13",
    "awards": {
      "wins": 4,
      "nominations": 8,
      "text": "Won 4 Oscars. Another 8 wins & 8 nominations."
    },
    "lastupdated": "2023-03-01",
    "year": 2010,
    "imdb": {
      "rating": 8.8,
      "votes": 2000000,
      "id": 1375666
    },
    "type": "movie",
    "tomatoes": {
      "viewer": {
        "rating": 4.5,
        "numReviews": 15000,
        "meter": 92
      },
      "lastUpdated": "2023-03-01T00:00:00Z"
    }
  },
  {
    "title": "The Matrix",
    "plot": "A hacker discovers the true nature of his reality.",
    "fullplot": "A computer hacker learns about the true nature of his world.",
    "genres": ["Action", "Sci-Fi"],
    "runtime": 136,
    "cast": ["Keanu Reeves", "Laurence Fishburne"],
    "num_mflix_comments": 20,
    "countries": ["USA"],
    "released": "1999-03-31T00:00:00Z",
    "directors": ["Lana Wachowski", "Lilly Wachowski"],
    "rated": "R",
    "awards": {
      "wins": 4,
      "nominations": 6,
      "text": "Won 4 Oscars. Another 6 wins & 10 nominations."
    },
    "lastupdated": "2023-03-01",
    "year": 1999,
    "imdb": {
      "rating": 8.7,
      "votes": 1800000,
      "id": 0133093
    },
    "type": "movie",
    "tomatoes": {
      "viewer": {
        "rating": 4.7,
        "numReviews": 13000,
        "meter": 87
      },
      "lastUpdated": "2023-03-01T00:00:00Z"
    }
  }
]'

```

#### 5️⃣ **Supprimer un film**
```sh
curl -X DELETE http://localhost:3000/api/movies/{id}
```
Remplacez `{id}` par l'ID du film à supprimer.


## 🚀 **Conclusion**
Tu as maintenant :
✅ **Un MongoDB bien configuré avec Docker**  
✅ **Une API Express TypeScript** pour gérer les livres  
✅ **Une architecture optimisée pour un déploiement en production**

🎯 **Prêt à tester et déployer !** 🚀

 ## 🚀 **Par Ismail.M**