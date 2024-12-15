## Running the Project Locally

Follow these steps to set up and run the project locally:

### Prerequisites

1. **Install NVM (Node Version Manager)**  
   If you don’t have NVM installed, follow the installation guide from the [NVM GitHub repository](https://github.com/nvm-sh/nvm).

2. **Install Node.js 18.18.0**  
   Run the following command to install the required Node.js version:

   nvm install 18.18.0

3. **Use Node.js 18.18.0**
   Activate the installed Node.js version: nvm use 18.18.0

4. **Install Dependencies**
   Ensure you have npm or yarn installed (comes with Node.js). Install the project dependencies:

   npm install

5. **Running in Development Mode**
   To start the development server, run:

   npm run dev

   PORT: - http://localhost:5001

6. **Running in Production Mode**
   Build the Project
   Create a production build of the application:

   npm run build && npm run start

   PORT:- http://localhost:8080

   **Troubleshooting**
   If you encounter issues:

   nvm use 18.18.0

   npm install

   If issues persist, try deleting the node_modules folder and reinstalling dependencies
   rm -rf node_modules

   npm install
