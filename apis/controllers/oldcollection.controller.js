const Oldcollection = require("../models/oldcollection.model.js");

// Create and Save a new Oldcollection
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Create a Oldcollection
  const oldcollection = new Oldcollection({
    old_collection_name: req.body.old_collection_name,
    old_collection_amount: req.body.old_collection_amount,
    old_collection_year: req.body.old_collection_year,
    old_collection_updated: Date.now(),
  });

  // Save Oldcollection in the database
  Oldcollection.create(oldcollection, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Oldcollection.",
      });
    else res.send(data);
  });
};

// Retrieve all Oldcollections from the database.
exports.findAll = (req, res) => {
  Oldcollection.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving oldcollections.",
      });
    else res.send(data);
  });
};

// Retrieve all Oldcollections from the database.
exports.newEntry = (req, res) => {
  Oldcollection.newEntry(req.body, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving oldcollections.",
      });
    else res.send(data);
  });
};

exports.findAllDetail = (req, res) => {
  Oldcollection.getAllDetail((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving oldcollections.",
      });
    else res.send(data);
  });
};

// Find a single Oldcollection with a oldcollectionId
exports.findOne = (req, res) => {
  Oldcollection.findById(req.params.oldcollectionId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Oldcollection with id ${req.params.oldcollectionId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Oldcollection with id " + req.params.oldcollectionId,
        });
      }
    } else res.send(data);
  });
};

exports.oldcollectionStreet = (req, res) => {
  Oldcollection.oldcollectionStreet(req.params.oldcollectionId, req.params.streetId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Oldcollection with id ${req.params.oldcollectionId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Oldcollection with id " + req.params.oldcollectionId,
        });
      }
    } else res.send(data);
  });
};

exports.oldcollectionFamily = (req, res) => {
  Oldcollection.oldcollectionFamily(req.params.oldcollectionId, req.params.streetId, req.params.familyId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Oldcollection with id ${req.params.oldcollectionId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Oldcollection with id " + req.params.oldcollectionId,
        });
      }
    } else res.send(data);
  });
};

// Update a Oldcollection identified by the oldcollectionId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body.id) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  Oldcollection.updateById(req.params.oldcollectionId, new Oldcollection(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Oldcollection with id ${req.params.oldcollectionId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating Oldcollection with id " + req.params.oldcollectionId,
        });
      }
    } else res.send(data);
  });
};

exports.updateOldcollectionComments = (req, res) => {
  // Validate Request
  if (!req.body.id) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  Oldcollection.updateOldcollectionComments(req.params.oldcollectionId, req.body, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Oldcollection with id ${req.params.oldcollectionId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating Oldcollection with id " + req.params.oldcollectionId,
        });
      }
    } else res.send(data);
  });
};

exports.addOldcollectionTaxes = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  Oldcollection.addOldcollectionTaxes( req.body, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Oldcollection with id ${req.params.oldcollectionId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating Oldcollection with id " + req.params.oldcollectionId,
        });
      }
    } else res.send(data);
  });
};

exports.removeOldcollectionTaxes = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  Oldcollection.removeOldcollectionTaxes( req.body, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Oldcollection with id ${req.params.oldcollectionId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating Oldcollection with id " + req.params.oldcollectionId,
        });
      }
    } else res.send(data);
  });
};

exports.updateClearStatus = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  Oldcollection.updateClearStatus( req.body, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Oldcollection with id ${req.params.oldcollectionId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating Oldcollection with id " + req.params.oldcollectionId,
        });
      }
    } else res.send(data);
  });
};

// Delete a Oldcollection with the specified oldcollectionId in the request
exports.delete = (req, res) => {
  Oldcollection.remove(req.params.oldcollectionId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Oldcollection with id ${req.params.oldcollectionId}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete Oldcollection with id " + req.params.oldcollectionId,
        });
      }
    } else
      res.send({ status: "200", error: `Oldcollection was deleted successfully!` });
  });
};

// Delete all Oldcollections from the database.
exports.deleteAll = (req, res) => {
  Oldcollection.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all oldcollections.",
      });
    else res.send({ message: `All Oldcollections were deleted successfully!` });
  });
};

// Delete all Streets from the database.
exports.destroyDB = (req, res, next) => {
  Oldcollection.destroyDB((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred.",
      });

    else next();
    // else res.send({ message: `Connection Destroyed!` });
  });
};

