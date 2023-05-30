const Event = require("../models/event");

exports.createEvent = (req, res, next) => {

  const url = req.protocol + '://' + req.get("host");
  //you're calling this from the models folder event.js, you gave its name as'Event'
  const images = [];
  images.push({
    imagePath: url + "/images/events/" + req.file.filename,
    index: req.body.index
  });

  const event = new Event({
    name: req.body.name,
    images: images,
    creator: req.userData.userId
  }); //this object is being managed by mongoose, you can save the objects created here directly on monngoDB
  event.save().then(createdEvent => {
    res.status(201).json({
      message: "Event added succesfully",
      event: {
        ...createdEvent, //created properties with all the properties of createdEvent
        id: createdEvent._id //override to _id property
      }
    });
  })
    .catch(error => {
      res.status(500).json({
        message: "Creating a event failed!"
      })
    }); //mongoose function, will create a collection called the same name as the model but plural

  // We dont use next() jere because res is already sending a response
  // sending a second response with next() would cause an error
};

exports.updateEvent = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/events/" + req.file.filename;
  }

  Event.findOne({ _id: req.params.id, creator: req.userData.userId })
    .then(event => {
      if (event) {
        const images = event.images;
        images[0] = {
          imagePath: imagePath,
          index: req.body.index
        };
        event.name = req.body.name;
        event.images = images;

        event.save()
          .then(updatedEvent => {
            res.status(200).json({ message: "Update successful!", event: updatedEvent });
          })
          .catch(error => {
            res.status(500).json({ message: "Couldn't update event" });
          });
      } else {
        res.status(401).json({ message: "You are not authorized to update this event!" });
      }
    })
    .catch(error => {
      res.status(500).json({ message: "Fetching event failed!" });
    });
};

exports.getEvents = (req, res, next) => {
  const pageSize = +req.query.pagesize; //these second parameters are up to youy "pagesize" "page"
  const currentPage = +req.query.page;
  const eventQuery = Event.find();
  let fetchedEvents;
  if (pageSize && currentPage) {
    eventQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  eventQuery //simply returns all entries, can be narrowed down
    .then(documents => {
      fetchedEvents = documents;
      return Event.count();
    })
    .then(count => {
      res.status(200).json({
        message: 'Events fetched succesfully!',
        events: fetchedEvents,
        maxEvents: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching events failed!"
      })
    });
  //200 is sucess

};

exports.getEvent = (req, res, next) => {
  Event.findById(req.params.id)
    .then(event => {
      if (event) {
        res.status(200).json(event);
      } else {
        res.status(404).json({ message: "Event not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching event failed!"
      });
    });
};

exports.deleteEvent = (req, res, next) => {
  Event.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Deletion successful!" });
    }
    else {
      res.status(401).json({ message: "You are not authorized!" });
    }
  })
    .catch(error => {
      res.status(500).json({
        message: "Deleting event failed!"
      })
    });

};
