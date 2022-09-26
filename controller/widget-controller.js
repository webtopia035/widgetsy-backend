const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");

let DUMMY_DATA = [
  {
    id: "w1",
    title: "clock",
    description: "desc",
    creator: "u1",
  },
  {
    id: "w2",
    title: "cal",
    description: "desc",
    creator: "u1",
  },
];

const getWidgetById = (req, res, next) => {
  const widgetId = req.params.wid;
  const widget = DUMMY_DATA.find((p) => {
    return p.id === widgetId;
  });

  if (!widget) {
    throw new HttpError("could not find widget with provided ID", 404);
  }
  res.json({ widget: widget });
};

const getWidgetsByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const user = DUMMY_DATA.filter((p) => {
    return p.creator === userId;
  });
  res.json({ user: user });
};

const createWidget = (req, res, next) => {
  const { title, description, creator } = req.body;
  const createdWidget = { id: uuidv4(), title, description, creator };
  DUMMY_DATA.push(createdWidget);
  res.status(201).json({ widget: createdWidget });
};

const updateWidget = (req, res, next) => {
  const { title } = req.body;
  const widgetId = req.params.wid;
  const updatedWidget = { ...DUMMY_DATA.find((p) => p.id === widgetId) };
  const widgetIndex = DUMMY_DATA.findIndex((p) => p.id === widgetId);
  updatedWidget.title = title;
  DUMMY_DATA[widgetIndex] = updatedWidget;
  res.status(201).json({ widget: updatedWidget });
};

const deleteWidget = (req, res, next) => {
  const widgetId = req.params.wid;
  DUMMY_DATA = DUMMY_DATA.filter((p) => p.id !== widgetId);
  res.json({ message: "deleted widget" });
};

exports.getWidgetById = getWidgetById;
exports.getWidgetsByUserId = getWidgetsByUserId;
exports.createWidget = createWidget;
exports.updateWidget = updateWidget;
exports.deleteWidget = deleteWidget;
