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
2. **Tester l’API** avec `curl` ou Postman :
   - Obtenir tous les livres :
     ```sh
     curl -X GET http://localhost:3000/api/books
     ```
   - Ajouter un livre :
     ```sh
     curl -X POST http://localhost:3000/api/books \
       -H "Content-Type: application/json" \
       -d '{"title":"1984", "author":"George Orwell", "publishedYear":1949}'
     ```
   - Supprimer un livre :
     ```sh
     curl -X DELETE http://localhost:3000/api/books/{ID}
     ```

---

## 🚀 **Conclusion**
Tu as maintenant :
✅ **Un MongoDB bien configuré avec Docker**  
✅ **Une API Express TypeScript** pour gérer les livres  
✅ **Une architecture optimisée pour un déploiement en production**

🎯 **Prêt à tester et déployer !** 🚀

 ## 🚀 **Par Ismail.M**