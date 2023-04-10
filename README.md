# BarkBudget

Unleash Your Financial Potential.

BarkBudget is a budgeting app built using React.js that allows users to track their expenses, set financial targets, and monitor their financial status. The app features a responsive design, intuitive user interface, and a secure login system for user privacy. 

## Features

BarkBudget offers several features that help users manage their finances more effectively:

- **Expense Tracking and Forecasting**: Users can enter their expenses and the app will display a summary of their spending habits. The app also provides forecasting tools that help users plan for future expenses.

- **Financial Target Setting and Tracking**: Users can set financial goals and track their progress over time. The app provides visual aids that help users understand how close they are to achieving their targets.

- **Adding, Editing, and Deleting Financial Data**: Users can add, edit, and delete financial data to keep their accounts up-to-date.

- **Graphical Representation of Financial Status**: The app provides graphs and charts that display a user's financial status in a clear and concise manner.

- **Secure Login System for User Privacy**: BarkBudget uses a secure login system to protect users' sensitive financial information.

## Technology Stack

BarkBudget is built using the following technologies:

- **React.js**: A popular JavaScript library for building user interfaces.

- **React Router**: A library that enables dynamic routing in React applications.

- **React Bootstrap**: A set of pre-built Bootstrap components for use in React apps.

- **Axios**: A promise-based HTTP client for making API calls.

- **Github Pages**: A free web hosting service provided by Github.

## Future Enhancements

BarkBudget has the potential for further enhancements, such as:

- **Reminders and Notifications**: The ability for the app to send reminders and notifications to users about upcoming bills or payments.

- **Integration with Financial Institutions**: The ability for users to connect their bank accounts and credit cards to the app, allowing for automatic tracking of expenses.

- **Multiple Currency Support**: The ability for the app to support multiple currencies, making it easier for users who travel or have international transactions.

- **Goal-Specific Savings**: The ability for users to set savings goals for specific purposes, such as a vacation or a down payment on a house, and track their progress towards those goals.

- **Machine Learning-Based Insights**: The ability for the app to provide personalized insights and recommendations based on a user's spending habits and financial goals, using machine learning algorithms.

- **Expense Sharing**: The ability for users to share expenses and split bills with friends and family members, making it easier to manage group expenses.

- **Investment Tracking**: The ability for users to track their investments and monitor their portfolio performance, providing a comprehensive view of their overall financial status.

- **Expense Analytics**: The ability for users to analyze their expenses and identify patterns or trends, helping them make informed decisions about their spending habits.

## Installation and Setup

To run the app locally, you'll need to have Node.js and npm installed on your computer. 

1. Clone the repository using `git clone https://github.com/justabayet/BarkBudget.git`
2. Install the dependencies using `npm install`
3. Start the app using `npm start`

The app will run on `http://localhost:3000/`.

## Deployment

BarkBudget is hosted on Github Pages, a free hosting service provided by Github. The app is automatically deployed to Github Pages whenever changes are pushed to the `main` branch of the Github repository.

The deployment process is handled by a Github Actions workflow that uses the `peaceiris/actions-gh-pages` action to build and deploy the app to Github Pages. The workflow is triggered whenever changes are pushed to the `main` branch of the repository.

To deploy the app to Github Pages:

1. Ensure that your changes are committed and pushed to the `main` branch of the repository.
2. Wait for the Github Actions workflow to complete. You can check the status of the workflow on the `Actions` tab of the Github repository.
3. Once the workflow has completed successfully, the app will be deployed to the Github Pages URL, which is `https://justabayet.github.io/BarkBudget/`.

Note that the deployment process requires a `BUILDER_TOKEN` secret, which is used for authentication. This token is stored securely in the Github repository settings and is not visible to anyone except the repository owner.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
