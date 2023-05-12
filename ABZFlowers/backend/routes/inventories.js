const express = require("express");
const multer = require("multer");

const Event = require("../models/event")

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //cb is callback
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('invalid mime type')
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images/events"); //this path is relative to the server.js file
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + '.' + ext);
  }
});

//multer will try to extract a single image
router.post("", multer({ storage: storage }).single("image"), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  //you're calling this from the models folder event.js, you gave its name as'Event'
  const event = new Event({
    name: req.body.name,
    images: [
    {
      imagePath: url + "/images/events" + req.file.filename,
      index: req.body.index
    }
  ]
  }); //this object is being managed by mongoose, you can save the objects created here directly on monngoDB
  event.save().then(createdEvent => {
    res.status(201).json({
      message: "Event added succesfully",
      event: {
        ...createdEvent, //created properties with all the properties of createdEvent
        id: createdEvent._id //override to _id property
      }
    });
  }); //mongoose function, will create a collection called the same name as the model but plural

  // We dont use next() jere because res is already sending a response
  // sending a second response with next() would cause an error
});

router.put("/:id", multer({ storage: storage }).single("image"), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/events" + req.file.filename
  }
  const event = new Event({
    name: req.body.name,
    images: [
    {
      image: req.body.image,
      index: req.body.index
    }
  ]
  })
  Event.updateOne({ _id: req.params.id }, event).then(result => {
    res.status(200).json({ message: "Update successful!" });
  })
});

router.get("", (req, res, next) => {
  Event.find() //simply returns all entries, can be narrowed down
    .then(documents => {
      res.status(200).json({
        message: 'Events fetched succesfully!',
        events: documents
      });
    });
  //200 is sucess

});

router.get("/:id", (req, res, next) => {
  Event.findById(req.params.id).then(event => {
    if (event) {
      res.status(200).json(event);
    } else {
      res.status(404).json({ message: 'Event not found!' })
    }
  });
});

router.delete("/:id", (req, res, next) => {
  Event.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result)
  });
  res.status(200).json({ message: "Event deleted!" });
});

module.exports = router;
