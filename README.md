
# Weaveline mini-project

This is a notes app where one user can create a notes list and invite other users as contributors. 

The goal of this project is to manage authorization in an application using NestJS.





## Tech Stack

**Server:** Node, Nest

**Database:** MongoDB


## Installation

```bash
$ npm install
```
## Adding MongoDB url

In the .env file you will find the **DB_URL** variable where you could put you own database url.

```bash
DB_URL='mongodb+srv://example:******@cluster0.lteno.mongodb.net/weavline?retryWrites=true&w=majority'
```
## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Documentation

After starting the app navigate to the link below to find the swagger documentation

http://localhost:3000/api


## API Reference

The Api is defided into three segments the Authentication, List, Note

#### Authentication

```http
  POST /auth/login
  
  POST /auth/register
```

*To access the List and Note routes the user need to authenticated*

#### List

```http
GET /list/all

GET /list/{id}

POST /list/create

PUT /list/update/{id}

DELETE /list/delete/{id}

PUT /list/invite/{lid}/{cid}

DELETE /list/remove_contributor/{lid}/{cid}

PUT /list/change_contributor_privilege/{lid}/{cid}
```

#### List

```http
GET /list/all

GET /list/{id}

POST /list/create

PUT /list/update/{id}

DELETE /list/delete/{id}

PUT /list/invite/{lid}/{cid}

DELETE /list/remove_contributor/{lid}/{cid}

PUT /list/change_contributor_privilege/{lid}/{cid}
```
#### Note

```http
GET /note/{id}

GET /note/all_by_list/{id}

POST /note/create/{id}

PUT /note/update/{id}

DELETE /note/delete/{id}
```
