rm -rf ./_dist
npm run build
docker-compose build
docker-compose up -d
docker-compose ps
