const { Schema, model } = require("mongoose");

const buddySchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  avg_rating: Number,
  sessions: [{ type: Schema.Types.ObjectId, ref: "Session" }],
  is_available: { type: Boolean, default: true },
  badges: { type: Number, default: 0 },
});

const buddyModel = new model("Buddy", buddySchema);

module.exports = buddyModel;
