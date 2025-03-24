# Accessify

## Overview

EmoryHax is a project designed to enhance web accessibility for people with vision impairment. The project leverages various technologies to provide features like text-to-speech, translation, dyslexia-friendly fonts, and color blindness support.

## Tech Stack

---

### Frontend ![Next.js Badge](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
> **Next.js** — React framework for server-rendered and static web applications  
> **React** — Library for building user interfaces  
> **TypeScript** — Typed superset of JavaScript for better development experience  
> **Tailwind CSS** — Utility-first CSS framework for modern UI development  
> **NextAuth.js** — Authentication solution for Next.js applications  
> **Radix UI** — Unstyled, accessible component primitives  
> **Lucide React** — Clean and consistent icon set

---

### Backend ![Node.js Badge](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
> **Express** — Fast, unopinionated web framework for Node.js  
> **AWS SDK** — AWS service integration for DynamoDB  
> **Google Cloud Translation** — Multi-language translation capabilities  
> **Google Generative AI** — Advanced AI for text generation and analysis  
> **Anthropic Claude** — AI model for accessibility enhancements based on user-inputted custom prompts  

---

### Chrome Extension ![Chrome Badge](https://img.shields.io/badge/Chrome-4285F4?style=flat&logo=google-chrome&logoColor=white)
> **Chrome Extensions API** — Browser extension development framework  
> **JavaScript** — Core programming language for extension logic  
> **HTML/CSS** — Extension popup interface and styling  
> **Chrome Storage** — Quick-access local data persistence for user preferences 
> **Chrome Scripting API** — Dynamic content script injection

---

### Authentication & Security
> **NextAuth.js** — Secure authentication with multiple providers  
> **Google OAuth2.0** — Secure third-party authentication  

---

### Deployment & Infrastructure
> **AWS Amplify** — Full-stack deployment and hosting  
> **DynamoDB** — Serverless NoSQL database - ideal for high-traffic and future scaling

---

### Development Tools
> **ESLint** — Code quality and style enforcement  
> **PostCSS** — CSS processing and optimization  
> **Tailwind CSS** — Utility-first styling system  
> **Nodemon** — Development server with auto-reload

## Project Structure

```
Accessify/
├── backend/                  // Backend server
│   ├── src/
│   │   ├── server.js         // Express server handling API endpoints for:
│   │   │                     // 1) translation, 2) user preferences, and 3) Gemini API integration
│   │   └── config/
│   ├── .env                  // Environment variables (API keys, database URLs)
│   └── package.json          // Project metadata, scripts, and dependencies
│
├── site/                     // Next.js frontend application
│   ├── app/
│   │   ├── auth/
│   │   │   ├── login/       // Login page with Google OAuth form validation and error handling
│   │   │   └── signup/      // Signup page with Google OAuth user registration flow
│   │   └── page.js          // Main landing page with Chrome Extension guide; login; feature showcase
│   ├── components/
│   │   ├── features/
│   │   │   └── auth/
│   │   │       └── LoginButton.tsx  // Google OAuth integration with session management
│   │   ├── layout/
│   │   │   └── HeroSection.tsx      // Landing page hero section with animated content
│   │   └── ui/
│   │       ├── Button.tsx   // Button component
│   │       ├── Card.tsx     // Card container with to display feature details/usage
│   │       ├── Checkbox.tsx // Accessible checkbox with custom styling
│   │       ├── Input.tsx    // Form input component
│   │       ├── Label.tsx    // Form label component
│   │       └── Tabs.tsx     // Tab component to navigate between extension features, with animations
│   ├── lib/                 // Utility functions and shared logic
│   ├── public/              // Static assets (images, fonts)
│   └── package.json         // Frontend dependencies and scripts
│
├── extension/               // Chrome extension for accessibility features
│   ├── popup/
│   │   ├── popup.html      // Extension Popup UI with visually clean Accessibility Preferences
│   │   ├── popup.css       // Styling for Popup UI
│   │   └── popup.js        // Popup logic handling; sending to DynamoDB & API endpoints
│   ├── content.js          // Content script implementing features:
│   │                       // 1) Color blindness filters
│   │                       // 2) Dyslexia treatments (font, spacing, word simplification)
│   │                       // 3) Text-to-speech functionality
│   │                       // 4) Page translation
│   │                       // 5) Feature loading progress bar overlays
│   ├── manifest.json       // Extension configuration and permissions
│   └── assets/            // Extension icons and images
│
├── .env.local              // Root environment variables for development
├── package.json           // Root dependencies and project scripts
├── .gitignore            // Git ignore rules for sensitive files
├── amplify.yml           // AWS Amplify deployment configuration
└── README.md            // Project documentation and setup instructions
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
