create a docker network with docker network create infodeniz_network
edit .env.postgres.example and rename it to .env.postgres for set your postgres environment variables
setup stack with docker-compose -f docker-compose-stack.yml up -d
edit .env.example and rename it to .env for set your environment variables
ssh to postgres container and create database with name you set in .env file
build project: docker-compose build
run project: docker-compose up -d
access swagger api doc at localhost:{your_http_port}/doc