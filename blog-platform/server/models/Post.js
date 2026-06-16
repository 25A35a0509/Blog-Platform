const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Please add content for the post'],
    },
    excerpt: {
      type: String,
      maxlength: [300, 'Excerpt cannot exceed 300 characters'],
    },
    coverImage: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
    },
    tags: {
      type: [String],
      default: [],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Text index to support full-text search on title/content/tags
postSchema.index({ title: 'text', content: 'text', tags: 'text' });

// Auto-generate a unique, URL-friendly slug and excerpt before saving.
postSchema.pre('save', async function (next) {
  if (this.isModified('title') || !this.slug) {
    const base = slugify(this.title, { lower: true, strict: true });
    let slug = base;
    let counter = 1;

    // Ensure slug uniqueness by appending a counter if needed
    // eslint-disable-next-line no-await-in-loop
    while (await this.constructor.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${base}-${counter}`;
      counter += 1;
    }
    this.slug = slug;
  }

  if (this.isModified('content') || !this.excerpt) {
    const plainText = this.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    this.excerpt = plainText.substring(0, 200) + (plainText.length > 200 ? '...' : '');
  }

  next();
});

postSchema.virtual('likeCount').get(function () {
  return this.likes ? this.likes.length : 0;
});

postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Post', postSchema);
