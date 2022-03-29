# Website to host Palveluohjain chatbot

This repository contains the web service 'Palveluohjain', the home of the project's chatbot. In the service users can interact with the chatbot and browse services recommended to them based on the conversation with the bot.

Related to the website, the repository also contains simple React-based embedable link widget (in `/link-widget` ) that could be placed for example on municipality's website and used to link to the Palveluohjain service. See widget's README for further details.

## Project structure

---

Though the initial plan for the service is simple and could have been implemented without a separate backend, for future proofing the service has been divided into frontend (React) and backend (Node.js, Express). Both live in this repository, in their respective subdirectories (`/frontend` and `/backend`).

## Related services

- Frontend shows recommendations based on the conversation with chatbot so it is recommended to have a Rasa chatbot running (locally or on a server).
- Frontend requests recommendations (and details of individual services) from backend which then requests those from Palveluohjain service recommendation API (`ServiceMatchEngine`). Thus, you should have Service Match Engine running as well to have data for the web service.

## Getting Started Locally

---

**NOTE:** To have meaningful data in the service, make sure you have access to services described in section 'Related services'.

1. Before you start, make sure you have Node and NPM installed
2. Install frontend dependencies `cd frontend && npm install`
3. Install backend dependencies `cd backend && npm install`
4. In each directory, there is example secrets file `.example.env` with instructions. Follow those before continuing.
5. Run `npm start` in `/frontend` to start React frontend. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
6. Run `npm run dev` in `/backend` to start backend in development mode, where `nodemon` will automatically restart the app each time files change. You can open [http://localhost:8000](http://localhost:8000) to view server in browser.

Now you should have a frontend up and running running and server that can transform service recommendation API data to format suitable for the frontend.

You can also run `/frontend` React app without the backend (or chatbot). Then you just won't see service recommendation and instead in recommendations panel will display an error message.

## Deploying to Azure

---

Docker images are deployed to the test and production environments from `dev` and `main` branches respectively.

Linting and testing (unit, snapshot etc. tests) are part of the pipeline and test results and coverage reports are published as part of the pipeline. Deployment is completed only if tests succeed.

The Azure Devops pipeline is defined in azure-pipelines.yml file and AKS Kubernetes configs are in `kube/` folder.

**Note:** Frontend uses [a fork of the chatwidget `rasa-webchat` ](https://github.com/City-of-Turku/rasa-webchat) which is installed from City of Turku GitHub instead of NPM. This install has at times caused issues in Azure pipeline.

- Running the widget's build as part of the install did not work so that issue has been solved by committing build files to Github.
- Pipeline has sometimes complained about access rights to the repo. This was resolved by including a Github ssh key to pipeline.

## Code formatting and linting

---

Prettier is used to enforce consistent code formatting. To make development easy, automatic formatting has been set up as pre-commit hook with [Husky](https://typicode.github.io/husky/#/) and [lint-staged](https://github.com/okonet/lint-staged).

Both backend and frontend use more or less the same formatting and linting configuation, with some differences in ESLint plugins.

## Automatic testing

Both `/frontend` and `/backend` have been configured with Husky to run tests on push.

## Editor settings

For those using Visual Studio Code the repository includes VS Code `.vscode/settings.json` configuring

- automatic formatting (with Prettier) and code fixing (ESLint) on save
- `cSpell` settings for automatic spell checking (does not work with Finnish though)

It is recommended to use these settings and install said plugins if you use VS Code as your code editor.

Also, `.vscode/settings.json` lists a couple of plugins that have been helpful:

- previously mentioned `cSpell` aka [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) for spell-checking
- [Sort lines](https://marketplace.visualstudio.com/items?itemName=Tyriar.sort-lines) by Daniel Imms: especially helpful for sorting translation files
- [Azure Pipelines syntax highlighter](https://marketplace.visualstudio.com/items?itemName=ms-azure-devops.azure-pipelines): a bit buggy and not always up-to-date, but can still be helpful

_(Feel free to commit settings for other editors - just add a note about it here)._
