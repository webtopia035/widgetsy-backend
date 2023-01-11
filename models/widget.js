const mongoose = require("mongoose");
const { stringify } = require("uuid");

const Schema = mongoose.Schema;

const widgetSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  config: { type: Object, required: true },
});

module.exports = mongoose.model("Widget", widgetSchema);
