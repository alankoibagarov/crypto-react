# React Crypto App

This application is created for demo purposes.
Tech stack: TypeScript, React, React-Query, Axios, Zustand, Vite, Github Pages, EsLint, Prettier, Vitest

If you are using VSCode, it's better to install Prettier and Eslint extensions

Husky is used on precommits, it runs linter and prettier

Currently, two pages are available:

- Main page with expanding cryptocurrency table
- Trade page with currency conversion

## Demo
Live demo of the project can be found here:  
[Demo](https://alankoibagarov.github.io/crypto-react/)

## Setup guide

```bash
# 1. Clone repository
git clone https://github.com/alankoibagarov/crypto-react.git
cd crypto-trading

# 2. Install dependencies
npm install

# 3. Run the dev server
npm run dev

App is located on "http://localhost:5173/crypto-react/" address
```
---

## Testing

```bash
# Run tests
npm run test

# Run unit tests in watch mode
npm run test:watch

# Collect coverage
npm run test:coverage

Unit tests are using Vitest and testing-library/react
```
---

## Authentication

Authentication is currently done locally and has only one user:
Login: admin@crypto.com
Password: 123456

Trying to log in with other credentials will throw an error

## NPM scripts
use npm run <script>

```bash
"dev": #Run Development mode
"build": #Build the project in /dist folder
"lint": #Run ESLint manually
"format": #Run Prettier manually
"preview": #Preview the application in Production mode
"predeploy": #Build the project for deploy on Github Pages,
"deploy": #Deploy on GitHub Pages
"test": #Run unit tests
"test:watch": #Run unit tests in watch mode
"test:coverage": #Collect coverage from all the code, results will be in /coverage folder
```
---

## Environment variables

#### VITE_ENCRYPTION_KEY - used for encryption of user data (use 32-byte key)
#### VITE_CRYPTO_API_KEY - API key for [Coingecko](https://www.coingecko.com/). You can generate a free demo key to access API.
#### VITE_CRYPTO_API_LINK - link to crypto API
---

## Technology choices

#### TypeScript:
- **Pros**: TypeScript, in comparison with Javascript, has static code analysis, which allows to catch errors without running the code. Also property typing allows to write more scalable code and know the code structure better
- **Cons**: Requires more code writing to type all the properties and interfaces

#### React:
- **Pros**: React is the most popular library for building interfaces. It can be used to build mobile applications in a form of React Native. Large community and a lot of packages on NPM
- **Cons**: Can get complex in large apps. Also not so strict to code styling as frontend frameworks, so without any conventions and rules it can get messy

#### Vite:
- **Pros**: Fast startup and hot reload, which improves the development speed, especially on large projects
- **Cons**: Not so much tools, compared to Webpack

#### Zustand:
- **Pros**: Modular store management system, easy to implement and use
- **Cons**: Can be complex, when intersection between different stores is needed

#### React Query:
- **Pros**: Handles async data fetching with caching, background updates, and retries
- **Cons**: Need to spend time on proper configuration. Not so flexible compared to self-written solution

#### CSS Modules:
- **Pros**: CSS Modules allow you to create scoped and modular styles by default, which avoids global class name collisions. This is especially useful in large applications where many components are styled independently
- **Cons**: CSS selectors and have the same name in different scoped component styles, so it can be difficult to global search for a specific selector 

#### Vitest:
- **Pros**: Modern analogue of Jest, simpler usage and faster performance

## Project folder structure


```
src/
├── components/       # Reusable components, that be implemented on pages
├── pages/            # All the pages, that can be used as routes in application (for ex. Home and Trade)
├── layouts/          # Page layouts, that routes are wrapped in (for ex. dashboard layout, landing page layout, etc.)
├── store/            # Store management modules
├── const/            # Where all hardcoded data is stored, for example lists
├── routing/          # Routing tools and components, such as protected route
├── assets/           # Where we store static files, images
├── enums/            # All the global enums
├── api/              # Where all endpoints are located
├── test/             # Test config
├── utils/            # Contains utilitary functions for different cases(validation, array, object, string, number methods, etc.)
├── App.tsx
├── main.tsx
```

---

##  Assumptions & Trade-offs

### Assumptions:
- CoinGecko API is used, enough for demo, but limited
- Only 1 user is present at the moment, login and password are encrypted, using the key from .env
- User session is stored in LocalStorage
- Buy/Sell functionality invokes toasts or opens login modal if user is unauthorized
- Trade page allows user to see conversion value from selected cryptocurrency to fiat and vice versa
- Coin dropdown on Trade page shows only 100 coins, probably better to use most popular/supported coins in the future

### Trade-offs:
- Session is stored locally only in browser that user uses at the moment, so when cache is cleared, no data remains. 
- Fake security with crypto-js library, for demo only until backend is connected
- No real design code, so UI was developed intuitively. It's better to have design in the tools, such as Figma first
- Based on project size, we may need to adjust project folder structure, in order to split the code more or less.
- Easy form validation. Library or self-written solution should be implemented in the future
- No user roles and permissions. All functionality is available to all users atm.
- No mobile, tablet adaptivity. Should take a look if needed in the future
---

## License

This project is licensed under the MIT License.

© 2025 Alan Koibagarov. You are free to use, modify, and distribute this project under the terms of the MIT license.


