const express = require("express");

const EventController = require("../controllers/event");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

router.post("", checkAuth, extractFile, EventController.createEvent);

router.put("/:id", checkAuth, extractFile, EventController.updateEvent);

router.get("", EventController.getEvents);

router.get("/:id", EventController.getEvent);

router.delete("/:id", checkAuth, EventController.deleteEvent);

module.exports = router;
