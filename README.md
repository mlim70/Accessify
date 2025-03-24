# Accessify

## Overview

EmoryHax is a project designed to enhance web accessibility for people with vision impairment. The project leverages various technologies to provide features like text-to-speech, translation, dyslexia-friendly fonts, and color blindness support.

## Tech Stack

### Frontend

The frontend application (website) is built using the following technologies:

- **Next.js**: A React framework that enables server-side rendering and static site generation.
- **React**: A JavaScript library for building user interfaces.
- **Tailwind CSS**: A utility-first CSS framework for styling the application.
- **NextAuth.js**: An authentication solution for Next.js applications.
- **TypeScript**: A strongly typed programming language that builds on JavaScript.

### Backend

The backend server (that works with the chrome extension) is built using the following technologies:

- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express**: A minimal and flexible Node.js web application framework.
- **AWS SDK**: Used to interact with AWS services like DynamoDB.
- **Google Cloud Translation**: Provides language translation capabilities.
- **Google Generative AI**: Provides advanced AI capabilities such as text generation and pronunciation hints.
- **Anthropic SDK**: Used to integrate with Anthropic's Claude model for generating accessibility enhancements.
- **OpenAI API**: Used for text-to-speech capabilities.

### Chrome Extension

The Chrome extension is built using the following technologies:

- **JavaScript**: The primary programming language for the extension.
- **HTML**: Used for the extension's popup interface.
- **CSS**: Used for styling the extension's popup interface.
- **Chrome Extensions API**: Provides the necessary APIs to build Chrome extensions.

## Project Structure

```
Accessify/
├── backend/
│   ├── src/
│   │   ├── server.js         // Express server with API endpoints
│   │   └── config/           // Configuration files
│   ├── .env                  // Backend environment variables
│   └── package.json          // Backend dependencies
│
├── site/                     // Next.js frontend
│   ├── app/
│   │   ├── auth/            // Authentication pages
│   │   │   ├── login/
│   │   │   └── signup/
│   │   └── page.js          // Main landing page
│   ├── components/
│   │   ├── features/
│   │   │   └── auth/
│   │   │       └── LoginButton.tsx
│   │   ├── layout/
│   │   │   └── HeroSection.tsx
│   │   └── ui/              // Reusable UI components
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Checkbox.tsx
│   │       ├── Input.tsx
│   │       ├── Label.tsx
│   │       └── Tabs.tsx
│   ├── lib/                 // Utility functions
│   ├── public/              // Static assets
│   └── package.json         // Frontend dependencies
│
├── extension/               // Chrome extension
│   ├── popup/
│   │   ├── popup.html      // Extension popup UI
│   │   ├── popup.css       // Popup styles
│   │   └── popup.js        // Popup functionality
│   ├── content.js          // Content script for webpage modifications
│   ├── manifest.json       // Extension configuration
│   └── assets/            // Extension assets
│
├── .env.local              // Root environment variables
├── package.json           // Root dependencies
├── .gitignore            // Git ignore rules
├── amplify.yml           // AWS Amplify configuration
└── README.md            // Project documentation
```

## Environment Variables

The following environment variables are used in the project:

- `PORT`: The port on which the server will run.
- `GOOGLE_CLOUD_PROJECT_ID`: The Google Cloud project ID.
- `GOOGLE_APPLICATION_CREDENTIALS`: The path to the Google Cloud service account key file.
- `GOOGLE_APPLICATION_CREDENTIALS_JSON`: The base64-encoded JSON key for Google Cloud service account.
- `GEMINI_API_KEY`: The API key for Google Generative AI.
- `ANTHROPIC_API_KEY`: The API key for Anthropic.
- `OPENAI_API`: The API key for OpenAI.
- `NEXTAUTH_URL`: The URL of the Next.js application.
- `NEXTAUTH_SECRET`: The secret used to encrypt session tokens.
- `GOOGLE_CLIENT_ID`: The client ID for Google OAuth.
- `GOOGLE_CLIENT_SECRET`: The client secret for Google OAuth.

## Running the Application

To run the application, use the following commands:

### Frontend & Backend

```bash
# Navigate to the site directory
cd site

# Install dependencies
npm install

# Start the development server locally
npm run dev

# Build the application for production (not locally)
npm run build

# Start the production server (not locally)
npm start

# Navigate to the backend directory
cd ..
cd backend

# Install dependencies
npm install

# Start the development server locally
npm run dev

# Build the application for production (not locally)
npm run build

# Start the production server (not locally)
npm start
```

### Chrome Extension

Open Chrome and navigate to 
```
chrome://extensions/
```
Enable "Developer mode" using the toggle in the top right corner.

Click "Load unpacked" and select the extension directory.

#### Enjoy!
