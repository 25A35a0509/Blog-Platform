# Architecture & Technical Decisions

This document explains the architectural choices, data flow, and design patterns used in Inkwell.

---

## 🎯 Design Philosophy

**Simplicity over Magic**
- Use plain JavaScript/React without heavy abstractions
- Minimal dependencies — only what's necessary
- Clear, readable code that's easy to understand and maintain

**Production-Ready**
- Proper error handling throughout
- Security best practices (JWT, bcrypt, validation, rate limiting)
- Scalable structure (can handle 10k+ daily active users)
- Observable (logs, metrics endpoints)

**User Experience First**
- Responsive design works on all devices
- Dark mode support with persistence
- Optimistic UI updates (instant feedback)
- Toast notifications for all actions

---

## 🏗 Overall Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Vite + React)                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Pages: Home, Login, Register, Post, Dashboard        │   │
│  │ Components: Cards, Editor, Comments, Forms           │   │
│  │ Context: Auth, Theme, Toast (Global State)           │   │
│  │ HTTP Client: Axios with token interceptor            │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │ REST API (HTTP/JSON)
                       ↓
┌──────────────────────────────────────────────────────────────┐
│              BACKEND (Express + Node.js)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Routes: /api/auth, /api/posts, /api/comments, ...    │   │
│  │ Controllers: Business logic for each route           │   │
│  │ Middleware: Auth (JWT), Validation, Error handling   │   │
│  │ Models: User, Post, Comment (Mongoose schemas)       │   │
│  │ Utils: Token generation, password hashing            │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │ MongoDB Protocol (tcp)
                       ↓ (2 more services)
            ┌──────────┴──────────┐
            ↓                     ↓
    ┌──────────────────┐  ┌──────────────────┐
    │  MongoDB Atlas   │  │   Cloudinary     │
    │   (Database)     │  │  (Image Storage) │
    └──────────────────┘  └──────────────────┘
```

---

## 🔐 Authentication Flow

### Registration

```
User fills form → POST /api/auth/register
                     ↓
              Validate inputs
              Check email exists
              Hash password (bcrypt)
              Save to MongoDB
                     ↓
              Generate JWT token
              Return user + token to frontend
                     ↓
Frontend stores token in localStorage
```

### Login

```
User fills form → POST /api/auth/login
                     ↓
              Find user by email
              Compare password (bcrypt)
              If valid:
                Generate JWT token
                Return user + token
              ↓
Frontend stores token, redirects to /dashboard
```

### Protected Routes

```
Request to protected endpoint
              ↓
   authMiddleware.protect()
              ↓
   Extract token from Authorization header
              ↓
   Verify signature with JWT_SECRET
              ↓
   Find user in database
              ↓
   Attach user to req.user
              ↓
   Proceed to controller
```

### Frontend Auth Flow

```
App loads
  ↓
AuthContext initialization
  ↓
Check localStorage for token
  ↓
If token exists:
  Show cached user immediately
  Fetch /api/auth/profile to validate
  If invalid → clear localStorage, set user = null
  ↓
ProtectedRoute checks:
  If loading → show spinner
  If authenticated → render page
  If not → redirect to /login
```

---

## 📝 Post Lifecycle

### Create

```
User submits form (CreatePost page)
              ↓
    Validate: title, content required
              ↓
    POST /api/posts (with JWT token)
              ↓
    postController.createPost()
    • Create slug from title (unique, URL-friendly)
    • Extract excerpt from content (first 200 chars)
    • Save to MongoDB (author = current user ID)
              ↓
    Return full post object
              ↓
    Frontend redirects to /posts/{slug}
    Toast: "Post published!"
```

### Update

```
User on EditPost page
              ↓
    Load existing post (owner check)
              ↓
    User edits and saves
              ↓
    PUT /api/posts/:id (with JWT token)
              ↓
    postController.updatePost()
    • Verify ownership (post.author === user._id)
    • Update fields (slug, excerpt auto-generated)
    • Save to MongoDB
              ↓
    Return updated post
              ↓
    Frontend redirects to /posts/{slug}
    Toast: "Post updated"
```

### Delete (with Comments)

```
User clicks delete button
              ↓
    ConfirmModal opens
              ↓
    User confirms
              ↓
    DELETE /api/posts/:id (with JWT token)
              ↓
    postController.deletePost()
    • Verify ownership
    • Delete all comments with this post ID (cascade)
    • Delete the post
              ↓
    Frontend redirects to /dashboard
    Toast: "Post deleted"
```

### View & Like

```
User visits /posts/:id
              ↓
GET /api/posts/:id
              ↓
• Increment views counter
• Return post with author details
              ↓
Frontend renders post content + comments

User clicks like button
              ↓
PUT /api/posts/:id/like (with JWT token)
              ↓
postController.toggleLike()
• Check if user already liked
• If yes: remove from likes array
• If no: add to likes array
• Save post
              ↓
Return: { liked: boolean, likeCount: number }
              ↓
Frontend optimistically updates UI
(immediately, before response)
```

---

## 💬 Comment System

### Lifecycle

```
User types comment + submits
              ↓
Validate: text not empty, <= 1000 chars
              ↓
POST /api/comments/:postId (with JWT token)
              ↓
commentController.addComment()
• Create comment (author = user ID, post = postId)
• Save to MongoDB
• Return populated comment (with author details)
              ↓
Frontend prepends comment to list
(optimistic update — no wait for server)
Clear input field
Toast: "Comment posted"

---

Delete comment flow:
              ↓
DELETE /api/comments/:commentId (with JWT token)
              ↓
commentController.deleteComment()
• Verify ownership
• Delete from MongoDB
              ↓
Frontend removes from list
Toast: "Comment deleted"
```

---

## 🔍 Search & Filter

### How It Works

```
User types in search box
              ↓
400ms debounce (avoid excessive requests)
              ↓
GET /api/posts?search=query&category=Tech&tag=react
              ↓
postController.getPosts()

Build MongoDB query:
  - If search: use text index on title+content+tags
  - If category: exact match (case-insensitive)
  - If tag: check if in tags array
  - If author: match author._id
              ↓
Execute query with pagination
Sort by relevance (if search) or createdAt
              ↓
Return paginated results + pagination metadata
              ↓
Frontend renders grid, shows page count
```

### Text Index Strategy

```
MongoDB text index on: title, content, tags

Example:
Query: "react tutorial"
Matches:
- Posts with "react" in title
- Posts with "tutorial" in content
- Posts with both words in any field
Ranked by relevance
```

---

## 🖼 Image Upload Flow

### Frontend

```
User drags image or clicks upload
              ↓
ImageUploader component
              ↓
File validation:
  • Must be image MIME type
  • Max 5MB
              ↓
Show upload spinner
              ↓
POST /api/upload (multipart/form-data)
  Authorization: Bearer <token>
  Body: { image: File }
              ↓
Wait for response
              ↓
{
  success: true,
  data: {
    url: "https://res.cloudinary.com/...",
    publicId: "blog-platform/..."
  }
}
              ↓
Set coverImage = url in form state
Show preview
Toast: "Image uploaded"
```

### Backend (Multer + Cloudinary)

```
POST /api/upload
              ↓
uploadController.uploadImage()
              ↓
Multer (middleware):
• Check file exists
• Validate MIME type
• Check file size < 5MB
• Stream directly to Cloudinary
              ↓
Cloudinary:
• Stores in "blog-platform" folder
• Applies transformation (max width 1600px)
• Returns secure HTTPS URL
              ↓
Controller returns URL to frontend
```

---

## 🏃 State Management

### Global State (Context API)

We use React Context for three concerns:

#### 1. AuthContext

```javascript
{
  user: {
    _id: "...",
    name: "John",
    email: "john@example.com",
    bio: "...",
    avatar: "https://...",
    token: "eyJhbGc..." // stored in localStorage
  },
  isAuthenticated: boolean,
  loading: boolean // during initial auth check
}

Methods:
• login(credentials) → async, persist token
• register(data) → async, persist token
• logout() → clear localStorage
• updateUser(data) → sync local state
```

#### 2. ThemeContext

```javascript
{
  theme: "light" | "dark",
  toggleTheme() → switches theme, saves to localStorage
}

On app load:
• Check localStorage for saved theme
• If not found, check system preference
• Apply to document.documentElement class
```

#### 3. ToastContext

```javascript
{
  toast: {
    success(message) → show green notification
    error(message) → show red notification
    info(message) → show blue notification
  }
}

Auto-dismisses after 4 seconds (customizable)
```

### Local State

- **Page components:** useState for form inputs, pagination, filters
- **Component state:** useState for dropdowns, modals, loading flags
- **Avoid prop drilling:** Use Context only for truly global concerns

---

## 🔄 Data Flow Example: Create & Publish Post

```
1. User fills CreatePost form
   ├─ Title, Category, Tags (local state)
   ├─ Rich text content (from RichTextEditor)
   └─ Cover image (from ImageUploader)

2. User clicks "Publish"
   ├─ PostEditor validates inputs
   └─ Calls onSubmit(payload)

3. CreatePost page calls postApi.createPost(payload)
   ├─ axiosInstance.post('/posts', payload)
   └─ Interceptor adds Authorization header with token

4. Backend receives POST /api/posts
   ├─ authMiddleware.protect() verifies JWT
   ├─ validators check inputs
   ├─ postController.createPost():
   │  ├─ Generate slug from title
   │  ├─ Extract excerpt from content
   │  ├─ Set author = req.user._id
   │  └─ Save to MongoDB
   └─ Return created post

5. Frontend catches success response
   ├─ Extract post data
   ├─ Show toast: "Post published!"
   └─ Navigate to /posts/{post.slug}

6. PostDetails page loads
   ├─ Fetch POST /api/posts/:slug
   ├─ Display post content, author, comments
   └─ User can now interact (like, comment, etc.)
```

---

## 🛡 Security Architecture

### JWT Strategy

```
Token Structure: header.payload.signature

Payload contains: { id: userId, iat: ..., exp: ... }

Never stored on server (stateless)
Verified on every request using JWT_SECRET

Expiration: 7 days
Refresh: Not implemented (users re-login when expired)

Note: For larger apps, implement refresh tokens
```

### Password Security

```
Registration:
  Plain password → bcrypt.hash(password, 10 salt rounds)
             → Stored in database
             → Plain password discarded

Login:
  Plain password → bcrypt.compare(plain, hashed)
             → Match/no match
             → Never stored or logged
```

### Validation Strategy

```
All inputs validated on two levels:

1. Frontend (UX feedback):
   ├─ Empty check
   ├─ Length validation
   ├─ Format validation (email, URL)
   └─ Toast on error

2. Backend (Security):
   ├─ express-validator on request
   ├─ Mongoose schema validation
   ├─ Ownership verification (can you edit this?)
   └─ Error response to client
```

### CORS & Headers

```
Headers middleware (Helmet):
├─ X-Content-Type-Options: nosniff
├─ X-Frame-Options: DENY (clickjacking)
├─ Strict-Transport-Security (HTTPS)
└─ Others for XSS protection

CORS configuration:
├─ Allow-Origin: CLIENT_URL (configured in .env)
├─ Credentials: true (for cookies, if implemented)
└─ Methods: GET, POST, PUT, DELETE
```

### Rate Limiting

```
General limit: 200 requests per 15 minutes

Auth endpoints (stricter):
├─ /api/auth/login
└─ /api/auth/register
└─ Limit: 20 requests per 15 minutes

Prevents brute-force password attacks
```

---

## 📈 Database Schema Design

### User Collection

```javascript
{
  _id: ObjectId,
  name: String (required, 2-50 chars),
  email: String (required, unique, lowercase),
  password: String (hashed, never returned),
  bio: String (0-300 chars),
  avatar: String (Cloudinary URL),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}

Indexes:
├─ _id (automatic)
└─ email (unique)
```

### Post Collection

```javascript
{
  _id: ObjectId,
  title: String (required, max 150),
  slug: String (unique, auto-generated from title),
  content: String (required, HTML),
  excerpt: String (auto-extracted from content),
  category: String,
  tags: [String] (array),
  coverImage: String (Cloudinary URL),
  author: ObjectId (ref: User),
  likes: [ObjectId] (array of user IDs),
  views: Number (default 0),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}

Indexes:
├─ _id
├─ slug (unique)
├─ author
├─ text: title, content, tags (for search)
└─ category (for filtering)
```

### Comment Collection

```javascript
{
  _id: ObjectId,
  text: String (required, max 1000),
  author: ObjectId (ref: User),
  post: ObjectId (ref: Post),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}

Indexes:
├─ _id
└─ post (for querying comments per post)
```

---

## ⚡ Performance Considerations

### Frontend Optimization

1. **Code Splitting:**
   - React Router lazy-loads route components
   - Each page is a separate chunk

2. **Image Optimization:**
   - Cloudinary handles responsive images
   - Cover images max 1600px (auto-optimized)

3. **State Updates:**
   - Use useCallback for stable function refs
   - Minimize re-renders with memo (where needed)
   - Controlled component inputs

### Backend Optimization

1. **Database Queries:**
   - Indexes on frequently queried fields
   - Populate only required fields
   - Pagination (default 6 items per page)

2. **Text Search:**
   - MongoDB text index for search
   - Avoided `regex` patterns (slow on large collections)

3. **Caching Opportunities** (for future):
   - Redis for user sessions
   - Cache frequently accessed posts
   - CDN for static assets (Vercel provides)

---

## 🚀 Scalability

### Current Limits

- **Users:** Tested with sample data, should handle 10k+ with indexes
- **Posts:** Pagination handles large collections efficiently
- **Comments:** Indexed by post ID, scales well
- **File Uploads:** Cloudinary handles unlimited images

### When to Scale

1. **More than 100k posts:**
   - Add database indexing (already done)
   - Consider sharding by author/date
   - Implement Redis caching

2. **More than 10k daily active users:**
   - Upgrade MongoDB to paid tier
   - Use CDN for frontend (Vercel does this)
   - Implement session caching

3. **Memory issues on backend:**
   - Upgrade Render/Railway plan
   - Implement pagination cursor-based
   - Add caching middleware

---

## 🔄 API Design Principles

### RESTful Endpoints

```
GET    /api/posts              # List all
POST   /api/posts              # Create
GET    /api/posts/:id          # Read one
PUT    /api/posts/:id          # Update
DELETE /api/posts/:id          # Delete
PUT    /api/posts/:id/like     # Custom action

GET    /api/comments/:postId   # List comments
POST   /api/comments/:postId   # Add comment
DELETE /api/comments/:id       # Delete comment
```

### Response Format

```javascript
// Success
{
  success: true,
  data: { ... },
  pagination: { page: 1, ... } // if applicable
}

// Error
{
  success: false,
  message: "Email already exists"
}
```

### Error Codes

```
200 OK               - Success
201 Created          - Resource created
400 Bad Request      - Validation failed
401 Unauthorized     - No token or invalid token
403 Forbidden        - Authenticated but not allowed
404 Not Found        - Resource doesn't exist
500 Server Error     - Unexpected error
```

---

## 📊 Monitoring & Observability

### Logging

```javascript
// Backend logs via morgan:
GET /api/posts 200 45ms

// Application logs:
"MongoDB connected: localhost/blog-platform"
"Server running in development mode on port 5000"

// Error logs:
"Not authorized, no token provided" (401)
```

### Health Check

```bash
GET /api/health
→ { success: true, message: "API is running" }
```

### Metrics for Future

- Request latency by endpoint
- Database query performance
- Error rate and types
- User signup/login rates
- Most liked posts
- Most commented posts

---

## 🔮 Future Improvements

1. **Search Enhancement:**
   - Elasticsearch for advanced full-text search
   - Filters: date range, popularity, trending

2. **Performance:**
   - Implement Redis caching layer
   - GraphQL API (alternative to REST)
   - WebSocket for real-time comments

3. **Social Features:**
   - Follow/unfollow users
   - User feed (posts from followed users)
   - Direct messaging
   - Notifications (push or email)

4. **Content Moderation:**
   - Flag inappropriate posts/comments
   - Admin dashboard
   - Word filter

5. **Analytics:**
   - Post view analytics
   - User engagement metrics
   - Dashboard for authors

6. **Monetization:**
   - Premium memberships
   - Sponsored content
   - Ad network integration

---

## 📚 Resources & References

- **Express.js Best Practices:** https://expressjs.com/
- **MongoDB Mongoose:** https://mongoosejs.com/
- **React Docs:** https://react.dev/
- **JWT.io:** https://jwt.io/
- **OWASP:** https://owasp.org/
- **Cloudinary Docs:** https://cloudinary.com/documentation

---

This architecture is designed to be:
- ✅ Simple and understandable
- ✅ Production-ready
- ✅ Secure
- ✅ Scalable to 10k+ users
- ✅ Easy to maintain and extend

Happy building! 🚀
