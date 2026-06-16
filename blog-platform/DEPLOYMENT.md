# Deployment Guide

This guide covers deploying the Inkwell Blog Platform to production using industry-standard services.

## 🏗 Architecture Overview

```
Frontend (Vercel)
       ↓ HTTP/REST
   ↔  Backend API (Render/Railway)
       ↓
Database (MongoDB Atlas)
       ↑
   ← Image Storage (Cloudinary)
```

---

## 📦 Prerequisites

- GitHub account (for CI/CD)
- Vercel account (free tier)
- Render or Railway account (free tier)
- MongoDB Atlas account (free tier)
- Cloudinary account (free tier)

---

## 🗄 Step 1: Database (MongoDB Atlas)

### Create a MongoDB Cluster

1. Go to [mongodb.com/cloud](https://mongodb.com/cloud) and sign up
2. Create a free cluster (M0)
3. In **Database Access**, create a user with a strong password
4. In **Network Access**, add your IP (or `0.0.0.0/0` for development)
5. Click **Connect** and copy the connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/blog-platform?retryWrites=true&w=majority
   ```
6. Store this securely — you'll need it for the backend

### Optional: Seed Sample Data

Once your backend is deployed, you can run:
```bash
curl -X POST https://your-api.render.com/api/seed
```

(You may want to create a dedicated `/api/seed` endpoint that's protected by a secret key)

---

## 🚀 Step 2: Backend (Render)

### Deploy to Render

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/username/blog-platform.git
   git push -u origin main
   ```

2. **Sign up at [render.com](https://render.com)**

3. **Create a new Web Service:**
   - Click **New** → **Web Service**
   - Connect your GitHub repo
   - Select the `server` directory in **Root Directory**
   - Name: `blog-platform-api`

4. **Configure the service:**
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** Free

5. **Set Environment Variables** (in Render dashboard):
   ```
   PORT=5000
   NODE_ENV=production
   MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/blog-platform?retryWrites=true&w=majority
   JWT_SECRET=generate_a_random_string_with_openssl_rand_base64_48
   CLIENT_URL=https://your-frontend.vercel.app
   CLOUDINARY_CLOUD_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX=200
   ```

6. **Generate a secure JWT_SECRET:**
   ```bash
   openssl rand -base64 48
   ```

7. **Deploy:** Render will automatically deploy when you push to GitHub

8. **Test the API:**
   ```bash
   curl https://your-api.render.com/api/health
   ```

### Alternative: Railway

1. **Sign up at [railway.app](https://railway.app)**
2. **Connect your GitHub repo**
3. **Select the `server` directory**
4. **Add environment variables** (same as above)
5. **Railway will auto-detect and deploy**

---

## 🎨 Step 3: Frontend (Vercel)

### Deploy to Vercel

1. **Sign up at [vercel.com](https://vercel.com)**

2. **Import your GitHub repo:**
   - Click **Add New** → **Project**
   - Select your GitHub repo
   - Framework Preset: **Vite**
   - Root Directory: `./client`

3. **Build Settings:**
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. **Environment Variables:**
   ```
   VITE_API_URL=https://your-api.render.com/api
   ```

5. **Deploy:** Vercel will automatically deploy on push to `main`

6. **Custom Domain (optional):**
   - In Vercel dashboard, go to **Settings** → **Domains**
   - Add your custom domain and follow DNS configuration

### Test the Frontend

After deployment, visit your Vercel URL and:
- Register a new account
- Create a test post
- Add a comment
- Try dark mode toggle
- Test on mobile

---

## 🔐 Security Checklist

### Backend Security

- [ ] `JWT_SECRET` is a long, random string (use `openssl rand -base64 48`)
- [ ] `NODE_ENV=production` in production
- [ ] Database user has minimal required permissions (read/write to `blog-platform` db only)
- [ ] MongoDB IP whitelist only allows Render/Railway IP
- [ ] Cloudinary API secret is kept secret (never exposed in frontend code)
- [ ] Rate limiting is enabled (200 requests per 15 min)
- [ ] CORS `CLIENT_URL` is set to your production frontend URL only

### Frontend Security

- [ ] Never commit `.env` files to Git
- [ ] Use HTTPS only (Vercel/Render enforce this by default)
- [ ] Content Security Policy (optional, configure in `vercel.json`)
- [ ] No sensitive data in localStorage beyond `token` and `user` (no passwords, etc.)

### Database Security

- [ ] MongoDB Atlas IP whitelist is configured
- [ ] Database user password is strong (20+ characters, mixed case)
- [ ] Never share connection strings in public repositories
- [ ] Regular backups enabled (MongoDB Atlas free tier includes daily backups)

---

## 🛠 Environment Variables Reference

### Backend (.env)

```
# Server
PORT=5000
NODE_ENV=production

# Database (MongoDB Atlas)
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/blog-platform?retryWrites=true&w=majority

# Auth
JWT_SECRET=your_long_random_secret_from_openssl
JWT_EXPIRES_IN=7d

# CORS
CLIENT_URL=https://your-frontend-domain.vercel.app

# Image Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=200
```

### Frontend (.env.production)

```
VITE_API_URL=https://your-api-domain.render.com/api
```

---

## 📊 Monitoring & Logs

### Render Logs

1. Go to your service dashboard
2. Click **Logs** to view real-time logs
3. Look for errors, connection issues, or crashes

### Vercel Analytics

1. In Vercel dashboard, click your project
2. Go to **Analytics** to see performance metrics
3. Check **Logs** for build and runtime errors

### MongoDB Atlas

1. Click your cluster
2. Go to **Metrics** to monitor database performance
3. Check **Monitoring** for connection issues

---

## 🐛 Troubleshooting

### 502 Bad Gateway (Backend)

**Cause:** Backend is down or misconfigured

**Fix:**
1. Check Render logs for errors
2. Verify `MONGO_URI` is correct and reachable
3. Verify `PORT` is 5000
4. Restart the service in Render dashboard

### Frontend Can't Connect to API

**Cause:** `VITE_API_URL` is wrong or CORS is misconfigured

**Fix:**
1. Check `VITE_API_URL` in Vercel environment variables
2. Verify backend `CLIENT_URL` matches your frontend domain
3. Test API directly: `curl https://your-api/api/health`

### Image Upload Fails

**Cause:** Cloudinary credentials are invalid

**Fix:**
1. Verify credentials in Render environment
2. Log into Cloudinary and confirm they're still active
3. Check that folder path permissions are correct

### Authentication Loop

**Cause:** JWT secret changed or token is corrupted

**Fix:**
1. Clear browser localStorage
2. Log in again
3. Check that JWT_SECRET is consistent across deployments

---

## 📈 Scaling Tips

As your blog grows:

1. **Database:**
   - Upgrade MongoDB Atlas cluster (M2 tier ~$15/month)
   - Enable sharding for distributed data

2. **Backend:**
   - Upgrade Render to paid plan (auto-scaling available)
   - Use Redis for caching (optional)
   - Implement database indexing (already done on `author`, `tags`)

3. **Frontend:**
   - Vercel free tier handles millions of requests
   - Enable image optimization in `next.config.js` if you switch to Next.js
   - Consider Cloudinary's edge caching

4. **Media:**
   - Cloudinary free tier handles 25GB of bandwidth
   - Upgrade to paid plan for higher limits

---

## 🚨 Maintenance

### Regular Tasks

- **Weekly:** Check Render and Vercel logs for errors
- **Monthly:** Review MongoDB Atlas metrics and billing
- **Quarterly:** Run database maintenance (compact, re-index)
- **Annually:** Review and rotate sensitive credentials

### Backups

- **MongoDB Atlas** (free tier): Automated daily backups for 7 days
- **Code:** GitHub is your backup (use `.gitignore` for `.env`)
- **Media:** Cloudinary retains original and transformed images

---

## 📱 Performance

### Optimize for Speed

**Frontend (Vercel):**
- Use Vercel Analytics to identify slow pages
- Lazy-load images
- Code-split routes with React.lazy()

**Backend (Render):**
- Add database indexes (already done)
- Use pagination (already implemented)
- Implement caching with Redis (optional)

**Database (MongoDB):**
- Ensure indexes on frequently queried fields
- Archive old posts to separate collection (optional)

### Monitor Performance

1. Use Vercel Analytics for frontend metrics
2. Use Render built-in monitoring for backend uptime
3. Use Cloudinary's media reports for image optimization

---

## 🎉 Success Checklist

- [ ] Backend deployed on Render/Railway with all env vars set
- [ ] Frontend deployed on Vercel pointing to correct API URL
- [ ] MongoDB Atlas cluster created and connection string working
- [ ] Cloudinary credentials configured in backend
- [ ] Sample data seeded (or first user created)
- [ ] Can register → login → create post → comment → like
- [ ] Dark mode works
- [ ] Images upload successfully
- [ ] Search and filters work
- [ ] Mobile responsive on small screens
- [ ] All forms validate properly
- [ ] API returns 401 when token is invalid/expired
- [ ] Post author can edit/delete, others cannot
- [ ] Comment author can delete, others cannot

---

## 📞 Support

If deployment fails:

1. **Check logs first** (Render/Vercel dashboards)
2. **Verify environment variables** are all set correctly
3. **Test API manually:** `curl https://your-api/api/health`
4. **Verify database connection:** ping MongoDB Atlas from Render
5. **Check CORS:** browser console will show CORS errors
6. **Review git commits:** ensure code changes were deployed

---

Good luck with your deployment! 🚀
