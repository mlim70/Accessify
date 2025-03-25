# Accessify

## Overview

**Accessify** is a project designed to enhance web accessibility for people with vision impairment. The project leverages various technologies to provide features like text-to-speech, translation, dyslexia-friendly fonts, and color blindness support.
| <img src="https://i.ibb.co/677d7TJc/original.png" alt="Live-translation with Dyslexia and Color Accommodations" width="300"> |
|:------------------------------------------------------------------------------------------------------------:|
| <img src="https://i.ibb.co/RpV8Rn1W/Screenshot-2025-03-24-201536.png" alt="Currently implemented features!" width="300"> |




## Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Chrome Extension](#chrome-extension)
  - [Authentication & Security](#authentication--security)
  - [Deployment & Infrastructure](#deployment--infrastructure)
  - [Development Tools](#development-tools)
- [Project Structure](#project-structure)
- [APIs and AI | Modules & Functions](#apis-and-ai--modules--functions)
  - [Translation Service](#translation-service)
  - [AI Enhancement Service](#ai-enhancement-service)
  - [Content Script Integration](#content-script-integration)
  - [API Endpoints](#api-endpoints)
- [Running the Application](#running-the-application)
  - [Frontend & Backend](#frontend--backend)
  - [Chrome Extension](#chrome-extension-1)
- [Enjoy](#enjoy)

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

## APIs and AI | Modules & Functions

### Translation Service

**File:** `backend/src/server.js`

**Purpose:**  
The translation service uses Google Cloud Translation API to provide real-time language translation capabilities. It handles requests from the Chrome extension to translate webpage content into various languages, supporting accessibility for non-native speakers.

**Key Features:**
- Multi-language support
- Real-time translation
- Error handling and logging
- Response caching

---

### AI Enhancement Service

**File:** `backend/src/server.js`

**Purpose:**  
This service combines multiple AI models to enhance webpage accessibility:

1. **Claude (Anthropic)**
   - Using the user-inputted custom instructions:
     1) Populates a prompt template tailoring to visibility enhancements (prompt engineering)
     2) Processes current webpage HTML content
     3) Supplements webpage with new, accessibility-enhanced HTML
   - Provides context-aware modifications
   - Caches results for efficiency

2. **Gemini (Google)**
   - Parses webpage for difficult-to-pronounce words to query for following step
   - Generates the pronunciation guides for phonetic assistance 
   - Provides phonetic assistance
   - Optimized for dyslexia support

3. **OpenAI Text-to-Speech**
   - Converts text to natural-sounding speech
   - Supports multiple voices for user-preference
   - Provides audio playback
   - Handles streaming responses

---

### Content Script Integration

**File:** `extension/content.js`

**Purpose:**  
The content script serves as the bridge between the Chrome extension and the backend services. It:
- Intercepts webpage content
- Applies accessibility modifications
- Manages text-to-speech playback
- Handles user interactions
- Coordinates with multiple AI services

---

### API Endpoints

**File:** `backend/src/server.js`

**Available Endpoints:**
1. `/api/translate`
   - Translates text to target language
   - Handles batch translation requests
   - Returns translated content

2. `/api/enhance-accessibility`
   - Processes HTML with Claude
   - Applies accessibility enhancements
   - Caches results for performance

3. `/api/pronunciation`
   - Generates pronunciation guides
   - Identifies challenging words
   - Returns enhanced text

4. `/api/tts`
   - Converts text to speech
   - Streams audio response
   - Supports multiple voices

5. `/api/create-user`
   - Initializes user preferences
   - Manages user accounts
   - Stores accessibility settings

6. `/api/check-email`
   - Verifies user existence
   - Retrieves user preferences
   - Manages authentication state

Each endpoint includes:
- Input validation
- Error handling
- Response formatting
- Performance optimization
- Security measures

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

# *(In a new terminal):
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
