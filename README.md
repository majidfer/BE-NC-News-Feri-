# NC News API

The purpose of this API is to provide information about news in form of articles, topics, comments, and users.

## Hosted version

Link to the hosted version : https://be-nc-news-cvii.onrender.com/api

## Instructions

1. Clone the project locally <br>
    `git clone https://github.com/ffm-id/BE-NC-News-Feri-.git`


2. Install required dependencies <br>
    `npm i`

3. Seed local database <br>
    `npm run setup-dbs` <br>
    `npm run seed`

4. Run tests <br>
    `npm t __tests__/app.test.js`

5. Create `.env` files <br> 
    Create two .env files, `.env.test` and `.env.development` in the root folder of the repository in order to successfully connect to the two databases locally. Into each, add `PGDATABASE=<database_name_here>`, with the correct database name for each environment (see `/db/setup.sql` for the database names). Example of `.env` file can be found in `.env-example`.

## Minimum requirements

- Node.js v17.7.2
- Postgres v12.11
