# 📑 Complete File Index & Navigation Guide

## 🎯 Start Here

**New to the project?** Read in this order:
1. **README.md** — Project overview and features
2. **SETUP.md** — Get it running locally
3. **src code** — Explore the implementation
4. **ARCHITECTURE.md** — Understand the design
5. **DEPLOYMENT.md** — Deploy to production

---

## 📚 Documentation Files (5 files)

### 📖 README.md
- **Purpose:** Project overview, features, quick start
- **Length:** ~2,000 words
- **Sections:**
  - ✨ Features overview
  - 🛠 Tech stack
  - 📁 Folder structure
  - 🚀 Quick start (both backend and frontend)
  - 📚 Complete API documentation with examples
  - 🔐 Security features
  - 🎨 Customization options
  - 📦 Deployment services
  - 📝 Sample credentials

**Read this to:** Understand what the app does and get the big picture

### 🔧 SETUP.md
- **Purpose:** Local development setup instructions
- **Length:** ~1,500 words
- **Sections:**
  - Prerequisites (Node, npm, MongoDB, Git)
  - How to install and configure
  - MongoDB setup (local or Atlas)
  - Cloudinary setup for image uploads
  - Starting both dev servers
  - Seeding sample data
  - Development workflow
  - Debugging tips
  - Common issues and fixes

**Read this to:** Get the app running on your machine in 10 minutes

### 🌐 DEPLOYMENT.md
- **Purpose:** Production deployment guide
- **Length:** ~1,800 words
- **Sections:**
  - Architecture overview
  - Step-by-step MongoDB Atlas setup
  - Render/Railway backend deployment
  - Vercel frontend deployment
  - Environment variables reference
  - Monitoring and logs
  - Troubleshooting common issues
  - Scaling tips for growth
  - Performance optimization
  - Security checklist

**Read this to:** Deploy to the internet for free (or cheap)

### 🏗 ARCHITECTURE.md
- **Purpose:** Technical design decisions and patterns
- **Length:** ~2,500 words
- **Sections:**
  - Design philosophy
  - Overall system architecture
  - Authentication flow (registration, login, protected routes)
  - Post lifecycle (create, update, delete, like)
  - Comment system
  - Search and filtering strategy
  - Image upload flow
  - State management (Context API breakdown)
  - Security architecture (JWT, passwords, validation, CORS)
  - Database schema design
  - Performance considerations
  - API design principles
  - Future improvements

**Read this to:** Understand WHY the code is organized the way it is

### 📦 PROJECT_SUMMARY.md
- **Purpose:** Complete project manifest and checklist
- **Length:** ~2,000 words
- **Includes:**
  - What's included (complete file list)
  - Feature checklist
  - Technology stack
  - Database schemas
  - API endpoint reference
  - Performance metrics
  - Security features
  - Code quality checklist
  - Learning value
  - File statistics

**Read this to:** See what you got and what's already implemented

---

## 💾 Backend Code (22 files)

### server/server.js
- **Lines:** ~100
- **Purpose:** Express app initialization, middleware setup, routes mounting
- **Key Points:**
  - Helmet for security headers
  - CORS configuration (CLIENT_URL from env)
  - Rate limiting (general + auth-specific)
  - Morgan logging
  - Health check endpoint
  - Error handling middleware

**Start here to:** Understand backend flow from HTTP request to response

### server/config/db.js
- **Lines:** ~20
- **Purpose:** MongoDB connection setup
- **Exports:** `connectDB()` async function
- **Key Points:**
  - Uses Mongoose to connect
  - Exits process on connection failure
  - Logs connection info

### server/config/cloudinary.js
- **Lines:** ~30
- **Purpose:** Cloudinary configuration for image uploads
- **Exports:** `{ cloudinary, upload }` (Multer middleware)
- **Key Points:**
  - Streams files directly to Cloudinary
  - Validates image MIME types
  - Enforces 5MB file limit
  - Auto-resizes to 1600px max width

### server/middleware/authMiddleware.js
- **Lines:** ~60
- **Purpose:** JWT token verification
- **Exports:** `{ protect, optionalAuth }` (middleware functions)
- **Key Points:**
  - `protect`: Requires valid token, blocks if missing/invalid
  - `optionalAuth`: Adds user if token present, doesn't block
  - Both attach `req.user` if successful
  - Used on protected routes

### server/middleware/errorMiddleware.js
- **Lines:** ~50
- **Purpose:** Centralized error handling
- **Exports:** `{ notFound, errorHandler }` (middleware functions)
- **Key Points:**
  - `notFound`: Catches undefined routes
  - `errorHandler`: Normalizes errors, formats JSON response
  - Handles Mongoose validation/cast errors
  - Removes stack trace in production

### server/middleware/validators.js
- **Lines:** ~70
- **Purpose:** Input validation rules
- **Exports:** Validation chains + `validateRequest()` middleware
- **Key Points:**
  - Uses express-validator
  - Covers: register, login, post, comment
  - Chain-able validation with clear messages
  - Works with `validateRequest()` to check results

### server/models/User.js
- **Lines:** ~60
- **Purpose:** User schema and model
- **Exports:** User Mongoose model
- **Key Points:**
  - `password` never returned by default (select: false)
  - Pre-save hook hashes password
  - `matchPassword()` method for login
  - Indexes: email (unique)

### server/models/Post.js
- **Lines:** ~80
- **Purpose:** Post schema and model
- **Exports:** Post Mongoose model
- **Key Points:**
  - Auto-generates `slug` from title (unique)
  - Auto-extracts `excerpt` from content
  - Text index on title, content, tags (for search)
  - Virtual `likeCount` getter
  - References author User

### server/models/Comment.js
- **Lines:** ~30
- **Purpose:** Comment schema and model
- **Exports:** Comment Mongoose model
- **Key Points:**
  - References both author (User) and post (Post)
  - Index on post field (for querying comments)
  - Timestamps for sorting

### server/controllers/authController.js
- **Lines:** ~100
- **Purpose:** Authentication business logic
- **Exports:** 4 async controller functions
- **Functions:**
  1. `registerUser(req, res)` — Create account
  2. `loginUser(req, res)` — Verify + return token
  3. `getProfile(req, res)` — Get current user (protected)
  4. `updateProfile(req, res)` — Update user data (protected)

### server/controllers/postController.js
- **Lines:** ~180
- **Purpose:** Post CRUD and engagement
- **Exports:** 7 async controller functions
- **Functions:**
  1. `getPosts()` — List with pagination, search, filter
  2. `getPostById()` — Get single + increment views
  3. `createPost()` — Save new post
  4. `updatePost()` — Edit (ownership check)
  5. `deletePost()` — Remove + cascade delete comments
  6. `toggleLike()` — Like/unlike
  7. `getCategories()` — List unique categories

### server/controllers/commentController.js
- **Lines:** ~80
- **Purpose:** Comment management
- **Exports:** 3 async controller functions
- **Functions:**
  1. `getCommentsForPost()` — List comments for post
  2. `addComment()` — Create comment
  3. `deleteComment()` — Remove (ownership check)

### server/controllers/uploadController.js
- **Lines:** ~25
- **Purpose:** File upload handler
- **Exports:** 1 async controller function
- **Functions:**
  1. `uploadImage()` — Receive file from Multer, return Cloudinary URL

### server/routes/authRoutes.js
- **Lines:** ~15
- **Purpose:** Auth endpoint definitions
- **Routes:**
  - `POST /register` → registerUser
  - `POST /login` → loginUser
  - `GET /profile` → getProfile (protected)
  - `PUT /profile` → updateProfile (protected)

### server/routes/postRoutes.js
- **Lines:** ~25
- **Purpose:** Post endpoint definitions
- **Routes:**
  - `GET /` → getPosts
  - `POST /` → createPost (protected)
  - `GET /categories` → getCategories
  - `GET /:id` → getPostById
  - `PUT /:id` → updatePost (protected)
  - `DELETE /:id` → deletePost (protected)
  - `PUT /:id/like` → toggleLike (protected)

### server/routes/commentRoutes.js
- **Lines:** ~15
- **Purpose:** Comment endpoint definitions
- **Routes:**
  - `GET /:postId` → getCommentsForPost
  - `POST /:postId` → addComment (protected)
  - `DELETE /:commentId` → deleteComment (protected)

### server/routes/uploadRoutes.js
- **Lines:** ~12
- **Purpose:** Upload endpoint definitions
- **Routes:**
  - `POST /` → uploadImage (protected, with Multer middleware)

### server/utils/generateToken.js
- **Lines:** ~15
- **Purpose:** JWT token generation utility
- **Exports:** `generateToken(userId)` function
- **Returns:** Signed JWT token valid for JWT_EXPIRES_IN

### server/seed/seed.js
- **Lines:** ~150
- **Purpose:** Sample data generator
- **Usage:** `npm run seed` in server folder
- **Creates:**
  - 3 sample users (Alice, Bryan, Chitra)
  - 6 sample blog posts
  - Comments on each post
- **Login with:** `alice@example.com` / `password123`

### server/.env.example
- **Purpose:** Environment variable template
- **Contains:** 11 configurable variables
- **Usage:** Copy to `.env` and fill in values

### server/package.json
- **Purpose:** NPM dependencies and scripts
- **Scripts:**
  - `npm start` → Run server (production)
  - `npm run dev` → Run with Nodemon (development)
  - `npm run seed` → Populate database

---

## 🎨 Frontend Code (30 files)

### client/src/App.jsx
- **Lines:** ~50
- **Purpose:** Route configuration
- **Routes:**
  - Public: `/`, `/login`, `/register`, `/posts/:id`
  - Protected: `/create`, `/edit/:id`, `/dashboard`, `/profile`
- **Key Points:**
  - Uses ProtectedRoute component
  - Catches all other routes → redirect to `/`

### client/src/main.jsx
- **Lines:** ~20
- **Purpose:** React entry point
- **Setup:**
  - Mounts App to #root
  - Wraps with providers: ThemeProvider, ToastProvider, AuthProvider
  - Initializes React Router

### client/src/pages/Home.jsx
- **Lines:** ~140
- **Purpose:** Public blog feed
- **Features:**
  - Hero section
  - Search + category filter
  - Author filter (when URL param present)
  - Post grid (3 cols on desktop, 2 on tablet, 1 on mobile)
  - Pagination controls
  - Loads in realtime as you type (debounced search)

### client/src/pages/Login.jsx
- **Lines:** ~140
- **Purpose:** Login form
- **Features:**
  - Email + password inputs
  - Show/hide password toggle
  - Form validation with error display
  - Redirect to dashboard on success
  - Redirect to login if trying to access protected page
  - Link to register page

### client/src/pages/Register.jsx
- **Lines:** ~170
- **Purpose:** Registration form
- **Features:**
  - Name + email + password + confirm password
  - Comprehensive validation
  - Password match check
  - Redirect to home on success
  - Link to login page

### client/src/pages/PostDetails.jsx
- **Lines:** ~200
- **Purpose:** Single post view + comments
- **Features:**
  - Load post by ID or slug
  - Display author info + social proof (likes, views)
  - Like button (with optimistic update)
  - Edit/delete buttons (owner only)
  - Author bio card
  - Full comment section
  - Share links to jump to sections
  - Loading state + error handling

### client/src/pages/CreatePost.jsx
- **Lines:** ~40
- **Purpose:** New post form
- **Uses:** PostEditor component
- **Flow:**
  - Fill form → submit → API call → redirect to post

### client/src/pages/EditPost.jsx
- **Lines:** ~80
- **Purpose:** Edit existing post
- **Features:**
  - Load existing post
  - Check ownership (redirect if not owner)
  - Pre-fill form with post data
  - Same form as CreatePost
  - Submit → API call → redirect

### client/src/pages/Dashboard.jsx
- **Lines:** ~120
- **Purpose:** User's own posts management
- **Features:**
  - List only current user's posts
  - Show view count, like count, date, category
  - Quick edit/delete buttons
  - Pagination (8 per page)
  - New post button
  - Empty state with CTA

### client/src/pages/Profile.jsx
- **Lines:** ~180
- **Purpose:** Account settings
- **Features:**
  - Display current user info
  - Edit name
  - Edit bio
  - Upload/change avatar
  - Change password (optional)
  - Link to view own posts

### client/src/components/Navbar.jsx
- **Lines:** ~180
- **Purpose:** Top navigation bar
- **Features:**
  - Logo + brand name
  - Desktop nav (Home, Dashboard, Write)
  - Mobile hamburger menu
  - Theme toggle (dark/light)
  - Auth-aware: show profile + logout OR show login/signup
  - Responsive (hidden on mobile, visible on desktop)

### client/src/components/Footer.jsx
- **Lines:** ~25
- **Purpose:** Footer
- **Contains:**
  - Logo + tagline
  - Copyright year
  - Credit line

### client/src/components/Spinner.jsx
- **Lines:** ~20
- **Purpose:** Loading indicator
- **Props:** `size` (sm/md/lg), `label`, `className`
- **Usage:** Show while loading async data

### client/src/components/ProtectedRoute.jsx
- **Lines:** ~40
- **Purpose:** Auth guard for routes
- **Logic:**
  - If loading → show spinner (initial auth check)
  - If authenticated → render page
  - If not authenticated → redirect to /login
- **Usage:** Wrap routes with `<Route element={<ProtectedRoute />}>`

### client/src/components/PostCard.jsx
- **Lines:** ~100
- **Purpose:** Post preview in grid
- **Shows:**
  - Cover image (if exists)
  - Category "spine" (colored left edge)
  - Title, excerpt, tags
  - Author avatar + name + date
  - Like count + view time estimate
- **Links to:** Post details on click

### client/src/components/PostEditor.jsx
- **Lines:** ~140
- **Purpose:** Reusable form for create/edit
- **Controlled form:**
  - Title (max 150 chars)
  - Category (free text)
  - Tags (comma-separated)
  - Cover image (via ImageUploader)
  - Content (via RichTextEditor)
- **Validation:** Frontend + prop-level errors
- **Props:** `initialData`, `onSubmit`, `submitting`, `submitLabel`

### client/src/components/RichTextEditor.jsx
- **Lines:** ~150
- **Purpose:** WYSIWYG editor for post content
- **Toolbar features:**
  - Text: bold, italic, underline
  - Headers: H2, H3
  - Quotes, lists (bullet, numbered)
  - Links (prompt for URL)
  - Images (upload to Cloudinary)
  - Undo/redo/clear formatting
- **Note:** Uses `contentEditable` + `execCommand` (deprecated but works)
- **Output:** HTML string

### client/src/components/ImageUploader.jsx
- **Lines:** ~80
- **Purpose:** File upload with drag-and-drop
- **Features:**
  - Click to select OR drag-and-drop
  - Validate MIME type + file size
  - Show preview after upload
  - Upload to Cloudinary
  - Remove button to clear
- **Props:** `value` (URL), `onChange` (callback)

### client/src/components/SearchFilterBar.jsx
- **Lines:** ~60
- **Purpose:** Search + category filter
- **Features:**
  - Search input (debounced 400ms)
  - Category dropdown
  - Clear search button
  - Call parent's onChange on update
- **Props:** `search`, `category`, `categories`, `onSearchChange`, `onCategoryChange`

### client/src/components/CommentSection.jsx
- **Lines:** ~140
- **Purpose:** Comments UI + form
- **Features:**
  - Display comment count
  - Form to add comment (protected)
  - Login prompt if not authenticated
  - List comments (newest first)
  - Loading state
  - Empty state
  - Delete confirmation modal

### client/src/components/CommentItem.jsx
- **Lines:** ~50
- **Purpose:** Single comment display
- **Shows:**
  - Commenter avatar + name
  - Comment text
  - Time posted (relative)
  - Delete button (owner only)

### client/src/components/ConfirmModal.jsx
- **Lines:** ~60
- **Purpose:** Delete confirmation dialog
- **Features:**
  - Alert icon
  - Custom title + message
  - Cancel / Confirm buttons
  - Loading state on confirm
  - Modal overlay

### client/src/components/Pagination.jsx
- **Lines:** ~60
- **Purpose:** Page navigation controls
- **Shows:**
  - Prev/next buttons
  - Page numbers (with ellipses for gaps)
  - Current page highlighted
- **Props:** `page`, `totalPages`, `onPageChange`

### client/src/components/EmptyState.jsx
- **Lines:** ~20
- **Purpose:** "No results" UI
- **Shows:**
  - Icon
  - Title + message
  - Optional action (button/link)

### client/src/context/AuthContext.jsx
- **Lines:** ~100
- **Purpose:** Global auth state
- **State:**
  - `user` (with token)
  - `loading` (initial check)
  - `isAuthenticated` (boolean)
- **Methods:**
  - `login()` → API call + persist
  - `register()` → API call + persist
  - `logout()` → clear storage
  - `updateUser()` → sync state

### client/src/context/ThemeContext.jsx
- **Lines:** ~40
- **Purpose:** Dark mode toggle state
- **State:**
  - `theme` ("light" | "dark")
- **Methods:**
  - `toggleTheme()` → switch + save to localStorage
- **Initialization:** Check localStorage → system preference

### client/src/context/ToastContext.jsx
- **Lines:** ~80
- **Purpose:** Toast notifications
- **State:**
  - `toasts` (array of notifications)
- **Methods:**
  - `toast.success(msg)` → green notification
  - `toast.error(msg)` → red notification
  - `toast.info(msg)` → blue notification
- **Auto-dismiss:** 4 seconds (customizable)

### client/src/api/axiosInstance.js
- **Lines:** ~40
- **Purpose:** HTTP client setup
- **Features:**
  - Base URL from env (or `/api` in dev)
  - Request interceptor: adds Authorization header with token
  - Response interceptor: normalizes error messages
  - Axios instance exported for use everywhere

### client/src/api/authApi.js
- **Lines:** ~30
- **Purpose:** Auth API calls
- **Exports:** `{ register, login, getProfile, updateProfile }`

### client/src/api/postApi.js
- **Lines:** ~50
- **Purpose:** Post API calls
- **Exports:** `{ getPosts, getPostById, createPost, updatePost, deletePost, toggleLike, getCategories }`

### client/src/api/commentApi.js
- **Lines:** ~20
- **Purpose:** Comment API calls
- **Exports:** `{ getComments, addComment, deleteComment }`

### client/src/api/uploadApi.js
- **Lines:** ~20
- **Purpose:** Image upload API call
- **Exports:** `{ uploadImage(file) }`

### client/src/utils/helpers.js
- **Lines:** ~100
- **Purpose:** Utility functions
- **Exports:**
  - `formatDate(iso)` → "Jun 14, 2024"
  - `timeAgo(iso)` → "2 hours ago"
  - `stripHtml(html)` → plain text
  - `getReadingTime(html)` → minutes
  - `getCategoryColor(name)` → color class
  - `getInitials(name)` → "JD"

### client/src/index.css
- **Lines:** ~150
- **Purpose:** Global styles + Tailwind
- **Contains:**
  - Tailwind directives (@tailwind)
  - Prose styles for post content
  - Button styles (.btn, .btn-primary, etc.)
  - Form styles (.input-field, .label-text)
  - Card styles

### client/vite.config.js
- **Lines:** ~25
- **Purpose:** Vite configuration
- **Key points:**
  - React plugin
  - Dev proxy: `/api` → `http://localhost:5000`

### client/tailwind.config.js
- **Lines:** ~80
- **Purpose:** Tailwind customization
- **Customizes:**
  - Colors (primary, accent, ink, paper)
  - Fonts (display, sans, mono)
  - Dark mode (class-based)
  - Box shadows

### client/postcss.config.js
- **Lines:** ~6
- **Purpose:** PostCSS setup
- **Plugins:** tailwindcss, autoprefixer

### client/index.html
- **Lines:** ~30
- **Purpose:** HTML entry point
- **Contains:**
  - Google Fonts links (Lora, Inter, JetBrains Mono)
  - Root div for React
  - Vite script import

### client/package.json
- **Purpose:** NPM dependencies and scripts
- **Scripts:**
  - `npm run dev` → Start dev server
  - `npm run build` → Build for production
  - `npm run preview` → Preview production build

---

## 🗂 Configuration Files (6 files)

### Root Files
- **README.md** — Project overview
- **SETUP.md** — Local development setup
- **DEPLOYMENT.md** — Production deployment
- **ARCHITECTURE.md** — Technical design
- **PROJECT_SUMMARY.md** — Complete manifest

### Environment Templates
- **server/.env.example** — Backend env vars (copy to .env)

### Git
- **server/.gitignore** — Backend ignored files
- **client/.gitignore** — Frontend ignored files

---

## 📊 Code Statistics

| Category | Files | Lines (approx) |
|----------|-------|-----------------|
| Backend Controllers | 4 | 350 |
| Backend Middleware | 3 | 150 |
| Backend Models | 3 | 150 |
| Backend Routes | 4 | 70 |
| Backend Utils/Config | 4 | 80 |
| Frontend Pages | 8 | 900 |
| Frontend Components | 13 | 1,500 |
| Frontend Context | 3 | 200 |
| Frontend API | 5 | 120 |
| Frontend Utils | 1 | 100 |
| Styles & Config | 6 | 300 |
| Documentation | 5 | 9,000 |
| **TOTAL** | **65+** | **13,000+** |

---

## 🎯 How to Use This Index

### "I need to find X"

**JWT Authentication?**
→ `server/middleware/authMiddleware.js` + `server/utils/generateToken.js`

**Post creation?**
→ `server/controllers/postController.js` (backend) + `client/src/pages/CreatePost.jsx` (frontend)

**Search functionality?**
→ `client/src/components/SearchFilterBar.jsx` + `server/controllers/postController.js` (getPosts method)

**Image uploads?**
→ `server/config/cloudinary.js` + `client/src/components/ImageUploader.jsx` + `server/controllers/uploadController.js`

**Comments system?**
→ `server/models/Comment.js` (schema) + `server/controllers/commentController.js` (logic) + `client/src/components/CommentSection.jsx` (UI)

**Dark mode?**
→ `client/src/context/ThemeContext.jsx` + `client/tailwind.config.js`

**API error handling?**
→ `server/middleware/errorMiddleware.js` + `client/src/api/axiosInstance.js`

---

## 🚀 Development Workflow

1. **Start with pages:** Understand user flows in `client/src/pages/`
2. **Then components:** See UI building blocks in `client/src/components/`
3. **Then context:** Learn state management in `client/src/context/`
4. **Then API layer:** Check `client/src/api/` for backend integration
5. **Then backend:** Study `server/controllers/` to see business logic
6. **Then database:** Look at `server/models/` to understand data structure

---

## 🔍 Code Examples by Feature

### Adding a new page
1. Create file: `client/src/pages/NewPage.jsx`
2. Add route: `client/src/App.jsx`
3. Add navigation: `client/src/components/Navbar.jsx`

### Adding a new API endpoint
1. Create controller method: `server/controllers/xxController.js`
2. Add route: `server/routes/xxRoutes.js`
3. Add API call: `client/src/api/xxApi.js`
4. Use in component: `client/src/pages/xx.jsx` or `client/src/components/xx.jsx`

### Adding a new validation rule
1. Add to `server/middleware/validators.js`
2. Use in route: `server/routes/xxRoutes.js`

### Styling a new component
1. Use Tailwind classes in JSX
2. Define reusable classes in `client/src/index.css`
3. Customize colors in `client/tailwind.config.js`

---

## ✅ Next Steps

- [ ] Read README.md for overview
- [ ] Follow SETUP.md to run locally
- [ ] Explore `src` files by feature (pages → components → api → models)
- [ ] Make a small change (e.g., edit button text in Navbar)
- [ ] Create a test post with cover image
- [ ] Review ARCHITECTURE.md to understand WHY
- [ ] Follow DEPLOYMENT.md to go live

Happy exploring! 🎉
