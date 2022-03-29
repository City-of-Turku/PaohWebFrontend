# Palveluohjain website backend

Backend is simple Express server that acts as layer between React frontend and service recommendation API. The main job of the backend is to transform API data to fit frontend's needs. It also performs some filtering reducing the amount of checks (for missing data for example) needed in the frontend.

## Project structure

In `src` there are:

- `index.ts` which contains the Express server. Nothing fancy there.
- `convert.ts` contains all the logic for formatting and filter API data (described with `/dtos`) to format expected by frontend (described by `/models`). And `convert.test.ts` contains unit tests for that code (these could certainly be improved.)
- `/factories` contains test data generators matching `/dtos`. The idea is to avoid having to create and then update massive amounts of test data each time API changes.
- `types.ts` just configures the languages available.

## Available scripts

### `npm start`

Runs the app. However, almost all of the time it's probably better to use `npm run dev`.

### `npm run dev`

Runs the app with `nodemon`. Nodemon will watch the files and if any files change, it will automatically restart the application.

Also sets environment variable `NOD_ENV` to `development`.

### `npm run test:dev`

Launches the test runner (Jest) in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run test:cov`

Runs tests and prints out a coverage report in the terminal.

### `npm run test:ci`

Test script intented to be used in the pipeline.\

- Generates test summary with `jest-junit`
- Coverage report is generated with **Cobertura** and published in the Azure pipeline.
- The flag `--ci` changes the behavior when a new snapshot is encountered. Instead of the regular behavior of storing a new snapshot automatically, it will fail the test and require Jest to be run with `--updateSnapshot`.
