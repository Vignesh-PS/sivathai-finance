const Report = require("../models/report.model.js");

exports.pendingCollections = (req, res) => {
  Report.pendingCollections(req.params.collectionId, (err, data)=>{
    if(err)
      res.status(500).send({err: 'Error Occured'})

    else res.send(data);
  })
}


// Disconnect db connection
exports.destroyDB = (req, res, next) => {
  Report.destroyDB((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred.",
      });


    else next();

    // else res.send({ message: `Connection Destroyed report!` });
  });
};

