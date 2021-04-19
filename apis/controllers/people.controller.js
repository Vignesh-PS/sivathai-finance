const People = require("../models/people.model.js");

// Create and Save a new People
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Create a People
  const people = new People({
    people_name : req.body.people_name,
    people_yob : req.body.people_yob,
    people_gender : req.body.people_gender,
    people_in_native : req.body.people_in_native,
    people_other_address : req.body.people_other_address,
    people_contact : req.body.people_contact,
    people_family_id : req.body.people_family_id,
    people_comments : req.body.people_comments,
    people_updated : Date.now()
  });

  // Save People in the database
  People.create(people, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the People.",
      });
    else res.send(data);
  });
};

// Retrieve all Peoples from the database.
exports.findAll = (req, res) => {
  People.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving peoples.",
      });
    else res.send(data);
  });
};


exports.dashboardInfo = (req, res) => {
  People.dashboardInfo((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving peoples.",
      });
    else res.send(data);
  });
};

// Find a single People with a peopleId
exports.findOne = (req, res) => {
  People.findById(req.params.peopleId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found People with id ${req.params.peopleId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving People with id " + req.params.peopleId,
        });
      }
    } else res.send(data);
  });
};

// Update a People identified by the peopleId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body.id) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  People.updateById(req.params.peopleId, new People(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found People with id ${req.params.peopleId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating People with id " + req.params.peopleId,
        });
      }
    } else res.send(data);
  });
};

// Delete a People with the specified peopleId in the request
exports.delete = (req, res) => {
  People.remove(req.params.peopleId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found People with id ${req.params.peopleId}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete People with id " + req.params.peopleId,
        });
      }
    } else
      res.send({ status: "200", error: `People was deleted successfully!` });
  });
};

// Delete all Peoples from the database.
exports.deleteAll = (req, res) => {
  People.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all peoples.",
      });
    else res.send({ message: `All Peoples were deleted successfully!` });
  });
};

// Delete all Streets from the database.
exports.destroyDB = (req, res, next) => {
  People.destroyDB((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred.",
      });

      else next();

    // else console.log('res >> ', res);res.send({res:JSON.stringify(res), message: `Connection Destroyed!` });
  });
};

