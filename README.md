## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
# install node dependencies
npm install

# run the database
npx supabase start

# run database migrations
npx supabase migration up
```

Then, create a `.env` file with the same keys as the example below:

```
# Application config
APP_PORT=3000

# Database credentials
DB_HOST= 'localhost'
DB_PORT = 54322
DB_NAME='postgres'
DB_USERNAME= 'postgres'
DB_PASSWORD= 'postgres'

# Security config
JWT_SECRET='DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.'
JWT_EXPIRATION=360s

GOOGLE_CLIENT_ID=
GOOGLE_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
```

## Compile and run the project

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Run tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## OpenAPI

Checkout `http://localhost:3000/api` for more detailed API info.

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.
