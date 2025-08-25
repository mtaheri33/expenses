// This is for the users MongoDB collection.

import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});
const User = mongoose.model('User', userSchema);

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(password, salt);
}

async function readByEmail(email) {
  const user = await User.find({ email });
  if (user.length === 0) {
    return null;
  }
  return user[0];
};

async function create(email, password) {
  const existingUser = await readByEmail(email);
  if (existingUser) {
    return;
  }
  const hashedPassword = await hashPassword(password);
  const user = new User({ email, password: hashedPassword });
  return await user.save();
};

async function checkPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

async function signIn(email, password) {
  const user = await readByEmail(email);
  if (!user) {
    return;
  }
  const success = await checkPassword(password, user.password);
  if (success) {
    return user;
  }
  return;
}

async function readById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  const user = await User.findById(id);
  if (user) {
    return user;
  }
  return null;
};

export default {
  create,
  signIn,
  readById,
};
