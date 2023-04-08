const express = require("express");
const widgetController = require("../controllers/widget");
const router = express.Router();

router.get("/:wid", widgetController.getWidgetById);

router.get("/user/:uid", widgetController.getWidgetsByUserId);

router.post("/", widgetController.createWidget);

router.patch("/update/:wid", widgetController.updateWidget);

router.delete("/:wid", widgetController.deleteWidget);

module.exports = router;
