1.create a docker network with docker network create infodeniz_network

2.edit .env.postgres.example and rename it to .env.postgres for set your postgres environment variables

3.setup stack with docker-compose -f docker-compose-stack.yml up -d

4.edit .env.example and rename it to .env for set your environment variables

5.ssh to postgres container and create database with name you set in .env file

6.build project: docker-compose build

7.run project: docker-compose up -d

8.access swagger api doc at localhost:{your_http_port}/doc