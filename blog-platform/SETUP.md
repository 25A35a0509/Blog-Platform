# Local Development Setup

Get the Inkwell Blog Platform running on your machine for development.

## Prerequisites

- **Node.js** v18+ ([download](https://nodejs.org/))
- **npm** v9+ (comes with Node)
- **MongoDB** ([download](https://www.mongodb.com/try/download/community) or use MongoDB Atlas cloud)
- **Git** ([download](https://git-scm.com/))

### Verify Installation

```bash
node --version    # Should be v18+
npm --version     # Should be v9+
git --version     # Should output git version
```

---

## 📥 Clone & Install

```bash
# Clone the repository
git clone https://github.com/yourusername/blog-platform.git
cd blog-platform

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
cd ..
```

---

## 🔧 Configure Environment

### Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Create `.env` file from template:**
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` with your values:**
   ```bash
   # On macOS/Linux:
   nano .env
   
   # On Windows:
   notepad .env
   ```

4. **Set these values:**
   ```
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://127.0.0.1:27017/blog-platform
   JWT_SECRET=your_super_secret_key_change_this_in_production
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:5173
   
   # Cloudinary (optional for local dev, required for image uploads)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### Frontend Setup

No `.env` needed for development! Vite will proxy `/api` to `http://localhost:5000` automatically (configured in `vite.config.js`).

---

## 🗄 Setup MongoDB

### Option A: Local MongoDB (Recommended for Development)

#### macOS (via Homebrew)

```bash
# Install
brew tap mongodb/brew
brew install mongodb-community

# Start the service
brew services start mongodb-community

# Verify it's running
mongo --version
```

#### Windows

1. Download [MongoDB Community Edition](https://www.mongodb.com/try/download/community)
2. Run the installer and follow prompts
3. MongoDB will start as a Windows service automatically
4. Verify: Open Command Prompt and run `mongod --version`

#### Linux

```bash
# Install (Ubuntu)
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
apt-get install -y mongodb-org
systemctl start mongod
```

### Option B: MongoDB Atlas (Cloud)

1. Sign up at [mongodb.com/cloud](https://mongodb.com/cloud)
2. Create a free cluster
3. Create a database user
4. Add your IP to Network Access (or use `0.0.0.0/0` for development)
5. Get your connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/blog-platform?retryWrites=true&w=majority
   ```
6. Use this in your `.env` as `MONGO_URI`

### Verify MongoDB Connection

```bash
# Test local connection
mongosh "mongodb://localhost:27017"

# You should see a shell prompt. Type:
# use blog-platform
# db.users.insertOne({test: true})
# exit
```

---

## 📱 Cloudinary Setup (for image uploads)

This is optional but recommended to test image upload features.

1. Sign up at [cloudinary.com](https://cloudinary.com) (free account)
2. Go to **Dashboard**
3. Copy your:
   - **Cloud Name**
   - **API Key**
   - **API Secret** (keep this secret!)
4. Add to `.env` in the server folder:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

If you skip this, image uploads will fail with an error message, but the rest of the app works fine.

---

## 🚀 Start Development Servers

### Terminal 1: Start Backend

```bash
cd server
npm run dev
```

You should see:
```
Server running in development mode on port 5000
MongoDB connected: localhost/blog-platform
```

### Terminal 2: Start Frontend

```bash
cd client
npm run dev
```

You should see:
```
VITE v5.2.0  ready in 200 ms

➜  Local:   http://localhost:5173/
```

### Open the App

Visit **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 📝 Seed Sample Data

To populate the database with sample users and posts:

```bash
cd server
npm run seed
```

This creates 3 users and 6 sample posts. Login with:

**Email:** `alice@example.com`  
**Password:** `password123`

(See `server/seed/seed.js` for all sample users)

---

## 📚 Development Workflow

### Making Changes

1. **Backend changes:**
   - Edit files in `server/`
   - Server auto-restarts via nodemon
   - Refresh browser to see changes

2. **Frontend changes:**
   - Edit files in `client/src/`
   - Vite hot-reloads (changes appear instantly)
   - Check browser console for errors

### Testing APIs

Use **Postman** or **curl**:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"password123"}'

# Get posts
curl http://localhost:5000/api/posts

# Get your profile (with token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/auth/profile
```

---

## 🐛 Debugging

### Check Backend Logs

Terminal where you ran `npm run dev` will show:
- Request logs (method, path, status)
- Errors (red text)
- Validation errors
- Database errors

### Check Frontend Logs

Open browser **DevTools** (F12 or Cmd+Option+I):
- **Console** tab shows JavaScript errors
- **Network** tab shows API requests/responses
- **Application** tab shows localStorage (tokens, user data)

### Common Issues

**"Cannot find module"**
- Run `npm install` in the appropriate directory
- Delete `node_modules` and `package-lock.json`, then reinstall

**"Connection refused"**
- Verify MongoDB is running: `mongosh`
- Verify backend is running on port 5000
- Check `MONGO_URI` in `.env`

**"CORS error"**
- Verify `CLIENT_URL` in backend `.env` matches frontend URL
- By default, should be `http://localhost:5173`

**"Images won't upload"**
- Check Cloudinary credentials in `.env`
- Verify API key has upload permissions
- Check browser console for error messages

---

## 📦 Project Structure

```
blog-platform/
├── server/
│   ├── controllers/        # Business logic
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   ├── middleware/        # Auth, validation, error handling
│   ├── seed/              # Sample data
│   ├── .env               # Local env vars (create from .env.example)
│   ├── server.js          # Entry point
│   └── package.json
│
└── client/
    ├── src/
    │   ├── pages/         # Page components (Home, Login, etc.)
    │   ├── components/    # Reusable UI components
    │   ├── api/          # HTTP client and API calls
    │   ├── context/      # Global state (auth, theme, toasts)
    │   ├── utils/        # Helper functions
    │   ├── App.jsx       # Routes
    │   └── main.jsx      # Entry point
    ├── vite.config.js     # Vite config (includes API proxy)
    ├── tailwind.config.js # Styles config
    └── package.json
```

---

## 🔄 Hot Reload

**Backend:** Nodemon watches `server/**/*.js` and auto-restarts  
**Frontend:** Vite detects file changes and hot-reloads the browser

Just save your file and watch the changes appear instantly!

---

## 🛑 Stop Development

Press `Ctrl+C` in each terminal to stop the servers.

---

## ✅ Checklist: Local Dev Ready

- [ ] Node.js v18+ installed
- [ ] MongoDB running (`mongosh` connects successfully)
- [ ] `server/.env` created and configured
- [ ] `npm install` run in both `server/` and `client/`
- [ ] Backend running: `npm run dev` in `server/`
- [ ] Frontend running: `npm run dev` in `client/`
- [ ] Browser opens [http://localhost:5173](http://localhost:5173) successfully
- [ ] Can register a new account
- [ ] Can log in with sample credentials (if seeded)
- [ ] Can create a post (with or without cover image)
- [ ] Can see posts on home page
- [ ] Dark mode toggle works
- [ ] Browser console shows no errors

---

## 📚 Next Steps

1. **Explore the code:**
   - Start with `server/server.js` to understand backend setup
   - Then check `client/src/App.jsx` for frontend routing
   - Read through a controller to see how data flows

2. **Make your first change:**
   - Edit a button text in `client/src/components/Navbar.jsx`
   - Watch it update live in the browser

3. **Create a test post:**
   - Log in (register or use sample credentials)
   - Click "Write a new post"
   - Test the rich text editor
   - Try uploading a cover image
   - Publish and see it on the home page

4. **Read the full docs:**
   - `README.md` — Project overview
   - `DEPLOYMENT.md` — How to go live

---

Happy coding! 🎉
