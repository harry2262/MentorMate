// import { Schema, SchemaType } from "mongoose";
const mongoose = require("mongoose");
const ErrorHandler = require("../utils/errorHandlers");

const sessionSchema = new mongoose.Schema({
  by: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  to: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  reviews: [
    {
      review: String,
      rating: Number,
      by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
  topic: String,
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED", "COMPLETED"],
    default: "PENDING",
  },
  bookedFor: Date,
  bookedOn: {
    type: Date,
    default: Date.now(),
  },
});

const sessionModel = new mongoose.model("Session", sessionSchema);
module.exports = sessionModel;
