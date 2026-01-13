# NutriLens Backend

This is the backend for the NutriLens application, an AI-powered nutrition assistant.

## Features

- **Image Analysis**: Uses Google Gemini 1.5 Flash to analyze food images.
- **Nutrition Advice**: Provides calorie estimation, health assessment, and recommendations.
- **Data Storage**: Stores meal history in MongoDB.
- **Image Storage**: Saves uploaded images locally (simulating blob storage).

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **AI**: Google Gemini API
- **File Upload**: Multer

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Create a `.env` file in the `backend` directory (or rely on default hardcoded values for dev).
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/nutrilens
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    ```

3.  **Run Server**:
    ```bash
    npm start
    ```

## API Endpoints

### `POST /api/analyze`

-   **Description**: Analyzes an uploaded food image.
-   **Content-Type**: `multipart/form-data`
-   **Body**: `image` (File)
-   **Response**: JSON containing food name, health status, nutrition info, and recommendation.

### `GET /api/history`

-   **Description**: Retrieves past analyzed meals.
-   **Response**: Array of meal objects.
