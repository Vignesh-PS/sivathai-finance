const Family = require("../models/family.model.js");

// Create and Save a new Family
exports.create = (req, res) => {
   // Validate request
   if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Family
  const family = new Family({
      family_comments: req.body.family_comments,
      family_door_no: req.body.family_door_no,
      family_head: req.body.family_head,
      family_head_contact: req.body.family_head_contact,
      family_head_gender: req.body.family_head_gender,
      family_head_in_native: req.body.family_head_in_native,
      family_head_name: req.body.family_head_name,
      family_head_yob: req.body.family_head_yob,
      family_street_id: req.body.family_street_id,
      family_unique_id: req.body.family_unique_id,
      family_tax_count: req.body.family_tax_count,
      family_updated: Date.now(),
  });

  // Save Family in the database
  Family.create(family, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Family."
      });
    else res.send(data);
  });
};

// Retrieve all Familys from the database.
exports.findAll = (req, res) => {
    Family.getAll((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving familys."
          });
        else res.send(data);
      });
};

// Retrieve all Familys from the database.
exports.checkUnique = (req, res) => {
  Family.checkUnique(req.body,(err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Family with id ${req.params.familyId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Family with id " + req.params.familyId
          });
        }
      } else res.send(data);
    }
  );
};

// Find a single Family with a familyId
exports.findOne = (req, res) => {
    Family.findById(req.params.familyId, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Family with id ${req.params.familyId}.`
            });
          } else {
            res.status(500).send({
              message: "Error retrieving Family with id " + req.params.familyId
            });
          }
        } else res.send(data);
      });
};

exports.familyAllDetails = (req, res) => {
    Family.familyAllDetails(req.params.familyId, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Family with id ${req.params.familyId}.`
            });
          } else {
            res.status(500).send({
              message: "Error retrieving Family with id " + req.params.familyId
            });
          }
        } else res.send(data);
      });
};

// Update a Family identified by the familyId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body.id) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  Family.updateById(
    req.params.familyId,
    new Family(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Family with id ${req.params.familyId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Family with id " + req.params.familyId
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a Family with the specified familyId in the request
exports.delete = (req, res) => {
    Family.remove(req.params.familyId, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Family with id ${req.params.familyId}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete Family with id " + req.params.familyId
            });
          }
        } else res.send({status: '200', error: `Family was deleted successfully!` });
      });
};

// Delete all Familys from the database.
exports.deleteAll = (req, res) => {
    Family.removeAll((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all familys."
          });
        else res.send({ message: `All Familys were deleted successfully!` });
      });
};

// Delete all Streets from the database.
exports.destroyDB = (req, res, next) => {
  Family.destroyDB((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred.",
      });

    else next();
    // else res.send({ message: `Connection Destroyed!` });
  });
};

