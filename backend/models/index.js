const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name:              { type: String, required: true, trim: true },
  email:             { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:          { type: String, required: true },
  bio:               { type: String, default: '' },
  avatar:            { type: String, default: '' },
  followers:         [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following:         [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  bookmarks:         [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  newsletter:        { type: Boolean, default: false },
  resetToken:        { type: String },
  resetTokenExpires: { type: Number },
}, { timestamps: true });

const PostSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  subtitle:   { type: String, default: '' },
  content:    { type: String, required: true },
  coverImage: { type: String, default: '' },
  tags:       [String],
  category:   { type: String, default: 'General' },
  author:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  claps:      { type: Number, default: 0 },
  clappers:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  views:      { type: Number, default: 0 },
  featured:   { type: Boolean, default: false },
   readTime:   { type: Number, default: 1 },
  isDraft:    { type: Boolean, default: false },
}, { timestamps: true });

const CommentSchema = new mongoose.Schema({
  post:    { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  author:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  likes:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = {
  User:    mongoose.model('User', UserSchema),
  Post:    mongoose.model('Post', PostSchema),
  Comment: mongoose.model('Comment', CommentSchema),
};