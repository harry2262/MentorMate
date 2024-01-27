const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required."],
    minlength: [3, "Minimum Length of name is 3 characters."],
    maxlength: [24, "Maximum Length of name is 24 characters."],
    trim: true,
  },
  id: {
    type: String,
    required: [true, "username is required."],
    minlength: [3, "Minimum Length of name is 3 characters."],
    maxlength: [24, "Maximum Length of name is 24 characters."],
    unique: true,
  },

  email: {
    type: String,
    required: [true, "Please enter a e-mail."],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid password"],
  },
  phone: {
    type: Number,
    // required: [true, 'Please enter phone number.']
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  branch: {
    type: String,
    enum: [
      "Computer Science & Engineering",
      "Information Technology",
      "Textile Technology",
      "Mechanical Engineering",
      "Electronics and Communication",
      "Electrical Engineering",
      "Civil Engineering",
      "Chemcial Engineering",
    ],
    required: false,
  },
  college: {
    type: String,
    required: [true, "Please enter your full college name."],
    default: "Not selected",
  },
  is_graduated: {
    type: Boolean,
    required: true,
    default: false,
  },
  semester: {
    type: Number,
    min: 1,
    max: 12,
    default: 1,
  },
  linkedIn: {
    type: String,
    default: null,
  },
  github: {
    type: String,
    default: null,
  },
  notifications: [
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      content: String,
      timestamp: {
        type: Date,
        default: Date.now(),
      },
      // [{ body: String, date: Date, is_read: Boolean }],
    },
  ],
  past_session: [{ type: mongoose.Schema.Types.ObjectId, ref: "Sessions" }],
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.getJwtToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60,
  });
};

userSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  // delete userObject.notifications;
  // delete userObject.past_session;
  return userObject;
};

const userModel = new mongoose.model("User", userSchema);

module.exports = userModel;
