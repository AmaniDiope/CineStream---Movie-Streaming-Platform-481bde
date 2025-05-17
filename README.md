# CineStream - Movie Streaming Platform

[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-9.22.0-orange)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.3.2-38B2AC)](https://tailwindcss.com/)

<img src="https://images.unsplash.com/photo-1620288627223-53302f4e8c74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxDaW5lU3RyZWFtJTJCYXBwJTJCbG9nb3xlbnwwfHx8fDE3NDc0ODMxODR8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="CineStream app logo" />

A React-based movie streaming platform with Firebase integration that allows users to browse, watch, and download movies. Includes an admin dashboard for content management.

## Features

- User-friendly movie browsing interface
- Streaming functionality with custom video player
- Download capabilities for offline viewing
- Admin dashboard for content management
- Responsive design optimized for all devices

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14.0.0 or higher)
- NPM or Yarn package manager
- Firebase account
- Git (for cloning the repository)

## Installation

Follow these steps to set up the project locally:

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/cinestream.git
   cd cinestream
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or if you use yarn
   yarn install
   ```

3. **Set up environment variables**

   Create a `.env` file in the project root and add your Firebase configuration. Use the `.env.example` file as a reference.

   ```bash
   cp src/.env.example .env
   ```

   Then update the file with your actual Firebase credentials.

4. **Initialize Firebase**

   - Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Enable Authentication, Firestore, and Storage services
   - Update the Firebase configuration in `src/firebase/config.js` with your project's credentials

## Running the Application

### Development Server

To start the development server:

```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`

### Build for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

## Project Structure

```
src/
├── components/         # Reusable UI components
├── context/           # React context providers
├── firebase/          # Firebase configuration and utilities
├── hooks/             # Custom React hooks
├── pages/             # Page components
│   └── admin/         # Admin dashboard pages
├── styles/            # Global CSS and styles
├── App.js             # Main application component
└── index.js           # Application entry point
```

## Environment Variables

Create a `.env` file with the following variables:

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Admin Access

To access the admin dashboard:

1. Navigate to `/admin/login`
2. Use the admin credentials created in Firebase Authentication

## Troubleshooting

### Common Issues

#### Firebase Connection Issues

- Ensure your Firebase project has the appropriate services enabled (Authentication, Firestore, Storage)
- Verify that your Firebase credentials in the `.env` file are correct
- Check if your IP address is allowed in Firebase project settings

#### Build or Compilation Errors

- Clear the cache: `npm cache clean --force` or `yarn cache clean`
- Delete `node_modules` folder and run `npm install` again
- Ensure you're using a compatible Node.js version (v14+)

#### Video Playback Issues

- Verify that the video file format is supported by the browser
- Check if the Firebase Storage permissions allow the user to access the video
- Ensure the video URL is properly generated and accessible

## Firebase Security Rules

For proper functioning of the application, configure your Firebase security rules:

### Firestore Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /movies/{movieId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    // Additional collections...
  }
}
```

### Storage Rules

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /movies/{movieFile} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    match /thumbnails/{thumbnailFile} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React Team for the fantastic library
- Firebase for the backend infrastructure
- All contributors to this project