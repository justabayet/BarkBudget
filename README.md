# INAB (I Need A Budget)

INAB is a budgeting app built using React.js that allows users to track their expenses, set financial targets, and monitor their financial status. The app features a responsive design, intuitive user interface, and a secure login system for user privacy. 

## Features

INAB offers several features that help users manage their finances more effectively:

- **Expense Tracking and Forecasting**: Users can enter their expenses and the app will display a summary of their spending habits. The app also provides forecasting tools that help users plan for future expenses.

- **Financial Target Setting and Tracking**: Users can set financial goals and track their progress over time. The app provides visual aids that help users understand how close they are to achieving their targets.

- **Adding, Editing, and Deleting Financial Data**: Users can add, edit, and delete financial data to keep their accounts up-to-date.

- **Graphical Representation of Financial Status**: The app provides graphs and charts that display a user's financial status in a clear and concise manner.

- **Secure Login System for User Privacy**: INAB uses a secure login system to protect users' sensitive financial information.

## Technology Stack

INAB is built using the following technologies:

- **React.js**: A popular JavaScript library for building user interfaces.

- **React Router**: A library that enables dynamic routing in React applications.

- **React Bootstrap**: A set of pre-built Bootstrap components for use in React apps.

- **Axios**: A promise-based HTTP client for making API calls.

- **Github Pages**: A free web hosting service provided by Github.

## Installation and Setup

To run the app locally, you'll need to have Node.js and npm installed on your computer. 

1. Clone the repository using `git clone https://github.com/justabayet/INAB.git`
2. Install the dependencies using `npm install`
3. Start the app using `npm start`

The app will run on `http://localhost:3000/`.

## Deployment

INAB is hosted on Github Pages, a free hosting service provided by Github. The app is automatically deployed to Github Pages whenever changes are pushed to the `main` branch of the Github repository.

The deployment process is handled by a Github Actions workflow that uses the `peaceiris/actions-gh-pages` action to build and deploy the app to Github Pages. The workflow is triggered whenever changes are pushed to the `main` branch of the repository.

To deploy the app to Github Pages:

1. Ensure that your changes are committed and pushed to the `main` branch of the repository.
2. Wait for the Github Actions workflow to complete. You can check the status of the workflow on the `Actions` tab of the Github repository.
3. Once the workflow has completed successfully, the app will be deployed to the Github Pages URL, which is `https://justabayet.github.io/INAB/`.

Note that the deployment process requires a `BUILDER_TOKEN` secret, which is used for authentication. This token is stored securely in the Github repository settings and is not visible to anyone except the repository owner.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
