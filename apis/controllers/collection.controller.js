const Collection = require("../models/collection.model.js");

// Create and Save a new Collection
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Create a Collection
  const collection = new Collection({
    collection_name: req.body.collection_name,
    collection_amount: req.body.collection_amount,
    collection_year: req.body.collection_year,
    collection_updated: Date.now(),
  });

  // Save Collection in the database
  Collection.create(collection, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Collection.",
      });
    else res.send(data);
  });
};

// Retrieve all Collections from the database.
exports.findAll = (req, res) => {
  Collection.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving collections.",
      });
    else res.send(data);
  });
};

// Find a single Collection with a collectionId
exports.findOne = (req, res) => {
  Collection.findById(req.params.collectionId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Collection with id ${req.params.collectionId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Collection with id " + req.params.collectionId,
        });
      }
    } else res.send(data);
  });
};

exports.collectionStreet = (req, res) => {
  Collection.collectionStreet(req.params.collectionId, req.params.streetId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Collection with id ${req.params.collectionId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Collection with id " + req.params.collectionId,
        });
      }
    } else res.send(data);
  });
};

exports.collectionFamily = (req, res) => {
  Collection.collectionFamily(req.params.collectionId, req.params.streetId, req.params.familyId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Collection with id ${req.params.collectionId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Collection with id " + req.params.collectionId,
        });
      }
    } else res.send(data);
  });
};

// Update a Collection identified by the collectionId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body.id) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  Collection.updateById(req.params.collectionId, new Collection(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Collection with id ${req.params.collectionId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating Collection with id " + req.params.collectionId,
        });
      }
    } else res.send(data);
  });
};

exports.updateCollectionComments = (req, res) => {
  // Validate Request
  if (!req.body.id) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  Collection.updateCollectionComments(req.params.collectionId, req.body, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Collection with id ${req.params.collectionId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating Collection with id " + req.params.collectionId,
        });
      }
    } else res.send(data);
  });
};

exports.addCollectionTaxes = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  Collection.addCollectionTaxes( req.body, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Collection with id ${req.params.collectionId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating Collection with id " + req.params.collectionId,
        });
      }
    } else res.send(data);
  });
};

exports.removeCollectionTaxes = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  Collection.removeCollectionTaxes( req.body, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Collection with id ${req.params.collectionId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating Collection with id " + req.params.collectionId,
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

  Collection.updateClearStatus( req.body, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Collection with id ${req.params.collectionId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating Collection with id " + req.params.collectionId,
        });
      }
    } else res.send(data);
  });
};

// Delete a Collection with the specified collectionId in the request
exports.delete = (req, res) => {
  Collection.remove(req.params.collectionId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Collection with id ${req.params.collectionId}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete Collection with id " + req.params.collectionId,
        });
      }
    } else
      res.send({ status: "200", error: `Collection was deleted successfully!` });
  });
};

// Delete all Collections from the database.
exports.deleteAll = (req, res) => {
  Collection.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all collections.",
      });
    else res.send({ message: `All Collections were deleted successfully!` });
  });
};

// Delete all Streets from the database.
exports.destroyDB = (req, res) => {
  Collection.destroyDB((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred.",
      });
    else res.send({ message: `Connection Destroyed!` });
  });
};

