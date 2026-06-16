# Inkwell — A Modern Blog Platform

A full-stack blogging platform built with the MERN stack (MongoDB, Express, React, Node.js). Create, edit, and delete blog posts; engage with comments; and manage your author profile — all in a clean, responsive interface with dark mode support.

## ✨ Features

### Authentication & Authorization
- User registration and login with JWT authentication
- Password hashing with bcrypt
- Protected routes for authenticated-only pages
- Session persistence with localStorage

### Blog Management
- Create, read, update, and delete blog posts
- Rich text editor with formatting toolbar (bold, italic, headings, lists, links, images)
- Cover image upload to Cloudinary
- Post categorization and tagging
- View count tracking
- Pagination and search across all posts

### Comments & Community
- Real-time comment system on each post
- Add, view, and delete your own comments
- Displayed commenter name and timestamp
- Comment count per post

### Engagement Features
- Like/unlike posts (shows count and list)
- Author profiles with bio
- Filter posts by author
- Full-text search by title, content, and tags
- Category-based filtering

### User Experience
- Responsive, mobile-first design
- Dark/light mode toggle with system preference detection
- Toast notifications for feedback
- Loading states and error handling
- Form validation with clear error messages
- Accessibility features (ARIA labels, keyboard navigation, focus management)

### Admin Features
- Dashboard showing all your posts
- Quick edit/delete from dashboard
- Profile page with avatar upload
- Password change functionality

## 🛠 Tech Stack

### Backend
- **Node.js + Express.js** — RESTful API
- **MongoDB + Mongoose** — Database with schema validation
- **JWT + bcrypt** — Secure authentication and password hashing
- **Cloudinary** — Image hosting
- **express-validator** — Request validation
- **express-rate-limit** — Brute-force protection
- **Helmet** — Security headers
- **CORS** — Cross-origin configuration

### Frontend
- **React 18** with Hooks
- **Vite** — Fast build tool
- **React Router v6** — Client-side routing
- **Tailwind CSS** — Utility-first styling
- **Axios** — HTTP client with interceptors
- **Lucide React** — Icon library
- **Context API** — State management

## 📁 Folder Structure

```
blog-platform/
├── server/                          # Backend
│   ├── config/
│   │   ├── db.js                   # MongoDB connection
│   │   └── cloudinary.js           # Image upload config
│   ├── controllers/
│   │   ├── authController.js       # Auth logic
│   │   ├── postController.js       # Post CRUD
│   │   ├── commentController.js    # Comment logic
│   │   └── uploadController.js     # Image upload
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT verification
│   │   ├── errorMiddleware.js      # Error handling
│   │   └── validators.js           # Input validation
│   ├── models/
│   │   ├── User.js                 # User schema
│   │   ├── Post.js                 # Post schema
│   │   └── Comment.js              # Comment schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── postRoutes.js
│   │   ├── commentRoutes.js
│   │   └── uploadRoutes.js
│   ├── seed/
│   │   └── seed.js                 # Sample data
│   ├── utils/
│   │   └── generateToken.js        # JWT utility
│   ├── server.js                   # Entry point
│   └── .env.example
│
└── client/                          # Frontend
    ├── public/
    │   └── favicon.svg
    ├── src/
    │   ├── api/
    │   │   ├── axiosInstance.js    # HTTP client setup
    │   │   ├── authApi.js          # Auth endpoints
    │   │   ├── postApi.js          # Post endpoints
    │   │   ├── commentApi.js       # Comment endpoints
    │   │   └── uploadApi.js        # Upload endpoint
    │   ├── components/
    │   │   ├── Navbar.jsx          # Top navigation
    │   │   ├── Footer.jsx
    │   │   ├── Spinner.jsx         # Loading indicator
    │   │   ├── ProtectedRoute.jsx  # Auth guard
    │   │   ├── PostCard.jsx        # Post grid item
    │   │   ├── PostEditor.jsx      # Create/edit form
    │   │   ├── RichTextEditor.jsx  # WYSIWYG editor
    │   │   ├── ImageUploader.jsx   # Cover upload
    │   │   ├── SearchFilterBar.jsx # Search & filter
    │   │   ├── CommentSection.jsx  # Comments UI
    │   │   ├── CommentItem.jsx     # Single comment
    │   │   ├── ConfirmModal.jsx    # Delete confirmation
    │   │   ├── Pagination.jsx      # Page controls
    │   │   └── EmptyState.jsx      # No-results UI
    │   ├── context/
    │   │   ├── AuthContext.jsx     # User & token state
    │   │   ├── ThemeContext.jsx    # Dark mode
    │   │   └── ToastContext.jsx    # Notifications
    │   ├── pages/
    │   │   ├── Home.jsx            # Public feed
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── PostDetails.jsx     # Single post view
    │   │   ├── CreatePost.jsx
    │   │   ├── EditPost.jsx
    │   │   ├── Dashboard.jsx       # My posts
    │   │   └── Profile.jsx         # Account settings
    │   ├── utils/
    │   │   └── helpers.js          # Utility functions
    │   ├── App.jsx                 # Route config
    │   ├── main.jsx                # React entry
    │   └── index.css               # Global styles
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    └── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (free tier works)

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables:**
   ```
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://127.0.0.1:27017/blog-platform
   JWT_SECRET=your_long_random_secret_key
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:5173
   CLOUDINARY_CLOUD_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   ```

4. **Seed sample data (optional):**
   ```bash
   npm run seed
   ```

5. **Start the server:**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd client
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

3. **Build for production:**
   ```bash
   npm run build
   ```

## 📚 API Documentation

### Authentication

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}

Response: 201
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGc..."
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}

Response: 200
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "token": "eyJhbGc..."
  }
}
```

#### Get Profile
```
GET /api/auth/profile
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "...",
    "avatar": "https://...",
    "createdAt": "2024-06-16T..."
  }
}
```

### Posts

#### Get All Posts
```
GET /api/posts?page=1&limit=6&search=query&category=Technology&author=userId

Response: 200
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 6,
    "total": 42,
    "totalPages": 7,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### Get Single Post
```
GET /api/posts/:id
GET /api/posts/:slug

Response: 200
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Hello World",
    "content": "<h2>Introduction</h2><p>...</p>",
    "author": {
      "_id": "...",
      "name": "John Doe",
      "avatar": "..."
    },
    "category": "Technology",
    "tags": ["javascript", "react"],
    "coverImage": "https://...",
    "views": 234,
    "likes": ["userId1", "userId2"],
    "createdAt": "2024-06-16T...",
    "updatedAt": "2024-06-16T..."
  }
}
```

#### Create Post
```
POST /api/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Hello World",
  "content": "<h2>Introduction</h2><p>...</p>",
  "category": "Technology",
  "tags": ["javascript", "react"],
  "coverImage": "https://..."
}

Response: 201
{
  "success": true,
  "data": { ... }
}
```

#### Update Post
```
PUT /api/posts/:id
Authorization: Bearer <token>
Content-Type: application/json

{ "title": "Updated Title", ... }

Response: 200
{
  "success": true,
  "data": { ... }
}
```

#### Delete Post
```
DELETE /api/posts/:id
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "data": { "_id": "..." }
}
```

#### Like Post
```
PUT /api/posts/:id/like
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "data": {
    "_id": "...",
    "likes": ["..."],
    "liked": true,
    "likeCount": 5
  }
}
```

### Comments

#### Get Comments
```
GET /api/comments/:postId

Response: 200
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "...",
      "text": "Great post!",
      "author": {
        "_id": "...",
        "name": "Jane Doe",
        "avatar": "..."
      },
      "createdAt": "2024-06-16T..."
    }
  ]
}
```

#### Add Comment
```
POST /api/comments/:postId
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Great post!"
}

Response: 201
{
  "success": true,
  "data": { ... }
}
```

#### Delete Comment
```
DELETE /api/comments/:commentId
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "data": { "_id": "..." }
}
```

### Image Upload

```
POST /api/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

[image file as "image" field]

Response: 201
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "blog-platform/..."
  }
}
```

## 🔐 Security Features

- **Password Hashing:** bcrypt with 10 salt rounds
- **JWT Authentication:** Secure token-based auth with 7-day expiration
- **Request Validation:** express-validator on all inputs
- **Rate Limiting:** 200 requests per 15 minutes (stricter for auth endpoints)
- **CORS:** Configured to only allow requests from trusted origins
- **Helmet:** Security headers (XSS, clickjacking, etc.)
- **Ownership Verification:** Users can only edit/delete their own content
- **Error Handling:** Centralized error middleware prevents info leakage

## 🎨 Customization

### Colors & Theme
Edit `client/tailwind.config.js` to customize the color palette. The design uses:
- **Primary:** Blue (`#4f5ff0`)
- **Accent:** Warm amber (`#cf8f27`)
- **Ink:** Text color palette
- **Paper:** Background for light mode

### Fonts
Google Fonts are loaded in `index.html`:
- **Display font:** Lora (headings)
- **Sans-serif:** Inter (body)
- **Monospace:** JetBrains Mono (code, timestamps)

### Editor Toolbar
Customize rich text formatting in `client/src/components/RichTextEditor.jsx`. Currently supports:
- Text formatting (bold, italic, underline)
- Headings (H2, H3)
- Lists (ordered, unordered)
- Blockquotes
- Links and images
- Undo/redo

## 📦 Deployment

### Backend (Render or Railway)

1. **Create `.env` on the hosting platform:**
   ```
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/blog-platform
   JWT_SECRET=generate_a_long_random_string
   CLIENT_URL=https://your-frontend.vercel.app
   CLOUDINARY_*=...
   ```

2. **Set start command to:** `node server.js`

3. **Database:** Use MongoDB Atlas (free tier available)

### Frontend (Vercel)

1. **Connect your GitHub repo to Vercel**

2. **Set environment variables:**
   ```
   VITE_API_URL=https://your-api.render.com/api
   ```

3. **Build command:** `npm run build`

4. **Output directory:** `dist`

### Cloudinary Setup

1. Sign up at [cloudinary.com](https://cloudinary.com) (free tier)
2. Get your credentials from the dashboard
3. Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` in `.env`

## 📝 Sample Credentials

After running `npm run seed` in the server, you can log in with:
- **Email:** `alice@example.com`
- **Password:** `password123`

(See `server/seed/seed.js` for all sample users)

## 🤝 Contributing

This is a portfolio/learning project. Feel free to fork, modify, and build upon it!

## 📄 License

This project is open source and available under the MIT License.

## 🙋 Support

For issues or questions:
1. Check existing error messages in the app (toast notifications)
2. Review console errors (browser DevTools)
3. Check that all environment variables are set correctly
4. Verify MongoDB is running and the connection string is correct
5. Ensure Cloudinary credentials are valid

---

Built with ❤️ for learning and portfolios.
