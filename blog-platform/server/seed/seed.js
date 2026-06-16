/**
 * Seeds the database with sample users, posts, and comments for local
 * development and testing.
 *
 * Usage:
 *   node seed/seed.js            -> wipes Users/Posts/Comments and inserts sample data
 *   node seed/seed.js --destroy  -> wipes Users/Posts/Comments only
 */
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

const sampleUsers = [
  { name: 'Alice Johnson', email: 'alice@example.com', password: 'password123', bio: 'Full-stack developer and tech blogger. I write about JavaScript, React, and everything web.' },
  { name: 'Bryan Mensah', email: 'bryan@example.com', password: 'password123', bio: 'DevOps engineer sharing notes on cloud infrastructure and automation.' },
  { name: 'Chitra Rao', email: 'chitra@example.com', password: 'password123', bio: 'UX designer exploring the intersection of design systems and accessibility.' },
];

const samplePosts = [
  {
    title: 'Getting Started with the MERN Stack',
    category: 'Web Development',
    tags: ['mongodb', 'express', 'react', 'nodejs'],
    content: `<h2>Why MERN?</h2><p>The MERN stack (MongoDB, Express, React, Node.js) is one of the most popular choices for building full-stack JavaScript applications. It lets you use a single language across your entire codebase, which speeds up development and reduces context switching.</p><h2>Setting Up Your Project</h2><p>Start by creating two folders: <code>client</code> for your React app and <code>server</code> for your Express API. Initialize each with its own <code>package.json</code> so dependencies stay isolated.</p><h2>Connecting to MongoDB</h2><p>Use Mongoose to define schemas and models. A clean schema design early on will save you headaches later, especially around relationships like users, posts, and comments.</p><h2>Wrapping Up</h2><p>Once your API and frontend can talk to each other through a well-documented set of REST endpoints, you have a solid foundation to build almost any product on top of.</p>`,
  },
  {
    title: 'A Practical Guide to JWT Authentication',
    category: 'Security',
    tags: ['jwt', 'authentication', 'security', 'nodejs'],
    content: `<h2>What is JWT?</h2><p>A JSON Web Token is a compact, URL-safe way of representing claims to be transferred between two parties. It's commonly used for stateless authentication in web APIs.</p><h2>The Authentication Flow</h2><p>When a user logs in, the server verifies their credentials and issues a signed token. The client stores this token and sends it with subsequent requests in the <code>Authorization</code> header.</p><h2>Securing Your Secret</h2><p>Always keep your JWT secret out of source control. Use environment variables and rotate secrets periodically in production environments.</p><h2>Common Pitfalls</h2><p>Avoid storing sensitive data inside the token payload, and always set a reasonable expiration time to limit the damage from a leaked token.</p>`,
  },
  {
    title: 'Designing Accessible Forms',
    category: 'Design',
    tags: ['accessibility', 'ux', 'forms', 'design-systems'],
    content: `<h2>Why Accessibility Matters</h2><p>Forms are one of the most common ways users interact with a product, and they're also one of the most common places accessibility breaks down.</p><h2>Labels and Instructions</h2><p>Every input needs a visible, programmatically associated label. Placeholder text is not a substitute for a label.</p><h2>Error Handling</h2><p>Describe errors clearly, in plain language, and associate them with the relevant field using <code>aria-describedby</code>.</p><h2>Keyboard Navigation</h2><p>Test your forms using only a keyboard. Focus order should be logical, and focus states should be clearly visible.</p>`,
  },
  {
    title: 'Deploying Node.js Apps with Render and Railway',
    category: 'DevOps',
    tags: ['deployment', 'render', 'railway', 'devops'],
    content: `<h2>Choosing a Platform</h2><p>Render and Railway both offer simple, Git-based deployment workflows for Node.js applications, with free tiers suitable for portfolio projects.</p><h2>Environment Variables</h2><p>Never commit your <code>.env</code> file. Instead, configure environment variables directly in your hosting provider's dashboard.</p><h2>Build and Start Commands</h2><p>Make sure your <code>package.json</code> defines clear <code>build</code> and <code>start</code> scripts so the platform knows how to run your app.</p><h2>Connecting to MongoDB Atlas</h2><p>Whitelist your hosting provider's IP ranges (or allow access from anywhere for simplicity during development) in your Atlas network access settings.</p>`,
  },
  {
    title: 'React State Management in 2026: Context vs Redux Toolkit',
    category: 'Web Development',
    tags: ['react', 'redux', 'context-api', 'state-management'],
    content: `<h2>The Core Question</h2><p>Not every app needs Redux. For small to medium projects, React's built-in Context API combined with hooks is often enough.</p><h2>When Context Shines</h2><p>Context works well for relatively static global state like authentication status, theme preferences, or user profile data.</p><h2>When Redux Toolkit Helps</h2><p>As state interactions grow more complex, especially with frequent updates, normalized data, and middleware needs, Redux Toolkit provides useful structure and dev tools.</p><h2>Our Recommendation</h2><p>Start simple with Context. Migrate to Redux Toolkit only when you feel real friction, not preemptively.</p>`,
  },
  {
    title: 'Building a Comment System: Lessons Learned',
    category: 'Web Development',
    tags: ['comments', 'mongodb', 'ux', 'mern'],
    content: `<h2>Data Modeling</h2><p>A comment needs a reference to its author and the post it belongs to. Keeping these as separate documents (rather than embedding) makes pagination and moderation much easier.</p><h2>Optimistic UI Updates</h2><p>Updating the UI immediately after a comment is posted, before the server confirms, makes the app feel instant. Just be ready to roll back on error.</p><h2>Cascading Deletes</h2><p>When a post is deleted, don't forget to clean up its comments too, or you'll end up with orphaned documents.</p><h2>Moderation Considerations</h2><p>Even a simple "delete your own comment" feature goes a long way toward giving users a sense of control over their contributions.</p>`,
  },
];

const sampleComments = [
  'Great write-up! This really helped me understand the basics.',
  "I've been doing this differently and ran into issues — this clears it up.",
  'Could you do a follow-up on testing strategies for this?',
  'Bookmarking this for my next project, thanks for sharing!',
  'Solid explanation. One thing I would add is to double-check your environment variables before deploying.',
];

const importData = async () => {
  await connectDB();

  await Comment.deleteMany();
  await Post.deleteMany();
  await User.deleteMany();

  console.log('Cleared existing Users, Posts, and Comments');

  const createdUsers = [];
  for (const userData of sampleUsers) {
    const user = await User.create(userData);
    createdUsers.push(user);
  }
  console.log(`Created ${createdUsers.length} users`);

  const createdPosts = [];
  for (let i = 0; i < samplePosts.length; i += 1) {
    const author = createdUsers[i % createdUsers.length];
    const post = await Post.create({ ...samplePosts[i], author: author._id });
    createdPosts.push(post);
  }
  console.log(`Created ${createdPosts.length} posts`);

  let commentCount = 0;
  for (const post of createdPosts) {
    const numComments = 1 + Math.floor(Math.random() * sampleComments.length);
    for (let i = 0; i < numComments; i += 1) {
      const author = createdUsers[(i + 1) % createdUsers.length];
      await Comment.create({
        text: sampleComments[i % sampleComments.length],
        author: author._id,
        post: post._id,
      });
      commentCount += 1;
    }
  }
  console.log(`Created ${commentCount} comments`);

  console.log('\nSample login credentials (all passwords: password123):');
  sampleUsers.forEach((u) => console.log(`  - ${u.email}`));

  process.exit(0);
};

const destroyData = async () => {
  await connectDB();

  await Comment.deleteMany();
  await Post.deleteMany();
  await User.deleteMany();

  console.log('All Users, Posts, and Comments removed');
  process.exit(0);
};

if (process.argv.includes('--destroy')) {
  destroyData();
} else {
  importData();
}
