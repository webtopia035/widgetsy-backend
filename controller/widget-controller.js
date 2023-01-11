const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Widget = require("../models/widget");
const User = require("../models/user");
const widget = require("../models/widget");

//get widget by id
const getWidgetById = async (req, res, next) => {
  const widgetId = req.params.wid;

  let widget;
  try {
    widget = await Widget.findById(widgetId);
  } catch (error) {
    console.log(error);
    return next(error);
  }

  if (!widget) {
    throw new HttpError("could not find widget with provided ID", 404);
  }

  res.json({ widget: widget.toObject({ getters: true }) });
};

//get widget by user id
const getWidgetsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let user;
  try {
    user = await Widget.find({ creator: userId });
  } catch (error) {
    console.log(error);
    return next(error);
  }

  res.json({ user: user.map((widget) => widget.toObject({ getters: true })) });
};

// create widget
const createWidget = async (req, res, next) => {
  const { title, description, type, creator, config } = req.body;
  const createdWidget = new Widget({
    title,
    description,
    type,
    creator,
    config,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    console.log(err);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }

  console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdWidget.save({ session: sess });
    user.widget.push(createdWidget);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    console.log(error);
    return next(error);
  }

  res.status(201).json({ widget: createdWidget });
};

//update widget
const updateWidget = async (req, res, next) => {
  const { title, description, config } = req.body;
  const widgetId = req.params.wid;

  let updatedWidget;
  try {
    updatedWidget = await Widget.findById(widgetId);
  } catch (error) {
    console.log(error);
    return next(error);
  }

  updatedWidget.title = title;
  updatedWidget.description = description;
  updatedWidget.config = config;

  try {
    await updatedWidget.save();
  } catch (error) {
    console.log(error);
    return next(error);
  }

  res.status(201).json({ widget: updatedWidget.toObject({ getters: true }) });
};

//delete widget
const deleteWidget = async (req, res, next) => {
  const widgetId = req.params.wid;

  let deleteWidget;
  try {
    deleteWidget = await Widget.findById(widgetId).populate("creator");
  } catch (error) {
    console.log(error);
    return next(error);
  }

  if (!deleteWidget) {
    const error = new HttpError("Could not find place for this id.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await deleteWidget.remove({ session: sess });
    deleteWidget.creator.widget.pull(deleteWidget);
    await deleteWidget.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    console.log(error);
    return next(error);
  }

  res.json({ message: "deleted widget" });
};

exports.getWidgetById = getWidgetById;
exports.getWidgetsByUserId = getWidgetsByUserId;
exports.createWidget = createWidget;
exports.updateWidget = updateWidget;
exports.deleteWidget = deleteWidget;
