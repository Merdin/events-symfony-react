# Project
The project is build with:
- Symfony 6.4 & API Platform
- React + TanStack Router & Query

All the above mentioned frameworks were complete new to me (except React).

# Setup
## 1. Clone project
## 2. Setup .env file in /backend
```
APP_ENV=dev
APP_SECRET=
APP_TIMEZONE=Europe/Amsterdam

JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=

POSTGRES_DB=merdin-events
POSTGRES_USER=merdin-events
POSTGRES_PASSWORD=123456

DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@127.0.0.1:5432/${POSTGRES_DB}?serverVersion=16&charset=utf8"

CORS_ALLOW_ORIGIN='^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$'

```

## 3. Install dependencies
```
cd ./backend
composer install
cd ../frontend
npm install
```

## 4. Setup database
```
cd ./backend
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
symfony console doctrine:fixtures:load
```

## 5. JWT Token
```
cd ./backend
php bin/console lexik:jwt:generate-keypair
```

## 6. Run the project
```
cd ./backend
docker-compose up -d
symfony server:start

cd ../frontend
npm run dev
```

# Good To Know
- Running `fixtures:load` will create some events and users (password: `password`). More info in `AppFixtures` class.
- Did not use TypeScript at its fullest, did use some types here and there but due to lack of time it was more important for me to finish the job.
