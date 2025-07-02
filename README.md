# SigmaBlocks (Temporary name)
A workflow automation solution

## Installation:
Spin up the container: 
```
docker compose up
```
The container will expose: 
- The frontend on http://localhost:5173
- The backend on http://localhost:5000
- A mongoDB instance on http://localhost:27017

This is meant to be used in a developement environment, both frontend and backend will have hot-reloading enabled and any change made to the code will be reflected in real time.

> [!NOTE]  
> Make sure to rebuild the container when adding new dependencies to the project, using 
> ```
> sudo docker compose up --build
> ```

## Deployment
To deploy the application in production, use the following command:
```
docker compose -f docker-compose.yml up
```
Docker will ignore the override file `docker-compose.override.yml` containing developement specific directives.
Hot reloading will be disabled and the images will be smaller and self-contained.

# Legacy 
Old instructions for manually bringing up single components. 
### Avviare frontend
Per installare il frontend:
```bash
pnpm install
```

Per far partire il frontend:
```bash
cd frontend
pnpm run dev
```
### Avviare backend
Per installare il backend:
```bash
pnpm install
```

Per far partire il backend:
```bash
cd backend
pnpm run start:dev
```