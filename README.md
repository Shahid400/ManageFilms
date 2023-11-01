# ManageFilms

micro service based project

# Prereq to run this code

Node installed

Docker installed

Docker compose installed

Free Port 8000 and 5672

.env file is required

replace MONGO_DSN in env with your database url.

# To Run

cd gateway

npm install

cd ../userAccount

npm install

cd ..

and run command

docker compose up

wait for all the services to up

Go to http://localhost:8000/api
