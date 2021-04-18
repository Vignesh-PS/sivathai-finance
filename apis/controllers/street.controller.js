const Street = require("../models/street.model.js");

// Create and Save a new Street
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Create a Street
  const street = new Street({
    street_name: req.body.street_name,
    street_updated: Date.now(),
  });

  // Save Street in the database
  Street.create(street, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Street.",
      });
    else res.send(data);
  });
};

// Retrieve all Streets from the database.
exports.findAll = (req, res) => {
  Street.getAll((err, data) => {
    // knex.destroy();
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving streets.",
      });
    else res.send(data);
  });
};

// Find a single Street with a streetId
exports.findOne = (req, res) => {
  Street.findById(req.params.streetId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Street with id ${req.params.streetId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Street with id " + req.params.streetId,
        });
      }
    } else res.send(data);
  });
};

// Update a Street identified by the streetId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body.id) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  Street.updateById(req.params.streetId, new Street(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Street with id ${req.params.streetId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating Street with id " + req.params.streetId,
        });
      }
    } else res.send(data);
  });
};

// Delete a Street with the specified streetId in the request
exports.delete = (req, res) => {
  Street.remove(req.params.streetId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Street with id ${req.params.streetId}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete Street with id " + req.params.streetId,
        });
      }
    } else
      res.send({ status: "200", error: `Street was deleted successfully!` });
  });
};

// Delete all Streets from the database.
exports.deleteAll = (req, res) => {
  Street.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all streets.",
      });
    else res.send({ message: `All Streets were deleted successfully!` });
  });
};
// Delete all Streets from the database.
exports.destroyDB = (req, res) => {
  Street.destroyDB((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred.",
      });
    else res.send({ message: `Connection Destroyed!` });
  });
};

