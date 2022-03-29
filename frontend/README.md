# Palveluohjain website frontend

This is the React frontend for Palveluohjain.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run test`

Runs tests (using Jest) once.

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

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `install:local:rasa-webchat`

For installing chat widget `rasa-webchat` from local folder. The script assumes that `WebFrontend` and `rasa-webchat` are in the same directory.

## "Why...?" - Issues and concerns

### onloadwff.js error

Error `Assertion failed: Input argument is not an HTMLInputElement @ onloadwff.js` is caused by LastPass and is just noise. No need for concern.

### "I updated rasa-webchat but I am not seeing the changes..."

If you made changes to [the fork of the `rasa-webchat` ](https://github.com/City-of-Turku/rasa-webchat) but running `npm install` does not seem to install the updated version from Github, here's what has worked for me:

1. Remove `rasa-webchat` from `package.json` (cut the line out, you'll need it in step 3)
2. Run `npm install`
3. Add `rasa-webchat` back to `package.json`
4. Run `npm install` again. Now you should have the updated version.

If this still does not work, delete `node_modules` and run `npm install` once again (with `rasa-webchat` in the `package.json`).
