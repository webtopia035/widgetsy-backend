const express = require("express");
const widgetController = require("../controller/widget-controller");
const router = express.Router();

router.get("/:wid", widgetController.getWidgetById);

router.get("/user/:uid", widgetController.getWidgetsByUserId);

router.post("/", widgetController.createWidget);

router.patch("/:wid", widgetController.updateWidget);

router.delete("/:wid", widgetController.deleteWidget);

module.exports = router;
