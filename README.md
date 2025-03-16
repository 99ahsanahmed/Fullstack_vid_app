# Video App Backend

This is the backend for a full-stack video application, built using Express.js and MongoDB. It provides APIs for user authentication, video management, and other essential functionalities.

## Features
- User authentication (signup, login, JWT authentication)
- Video upload and retrieval
- Video metadata storage in MongoDB
- Secure API endpoints
- Image storage using Cloudinary

## Tech Stack
- **Backend Framework:** Express.js
- **Database:** MongoDB (with Mongoose ORM)
- **Authentication:** JSON Web Tokens (JWT)
- **File Storage:** Cloudinary (for images)
- **Other Tools:** Postman (for testing APIs)

## Installation

### Prerequisites
Ensure you have the following installed:
- Node.js (latest LTS version recommended)
- MongoDB (local or cloud instance)

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/video-app-backend.git
   cd video-app-backend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and configure the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. Start the development server:
   ```sh
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login

### Video Management
- `POST /api/videos/upload` - Upload a video (To be implemented)
- `GET /api/videos/:id` - Get video details
- `GET /api/videos` - List all videos

### Image Management
- `POST /api/images/upload` - Upload an image to Cloudinary
- `GET /api/images/:id` - Get image details

## Project Structure
```
/video-app-backend
│── src
│   ├── controllers    # Route controllers
│   ├── models         # Mongoose models
│   ├── routes         # Express routes
│   ├── middleware     # Middleware functions
│   ├── config         # Configuration files
│── .env.example       # Environment variable sample
│── server.js          # Entry point
│── package.json       # Dependencies and scripts
```

## To-Do
- Implement video upload functionality
- Add user roles and permissions
- Enhance API security measures
- Integrate cloud storage for videos

## Contributing
Contributions are welcome! Feel free to fork this repository and submit a pull request.

## License
This project is licensed under the MIT License.
