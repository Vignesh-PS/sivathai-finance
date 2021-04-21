module.exports = (app) => {
  const street = require("../controllers/street.controller.js");
  const family = require("../controllers/family.controller.js");
  const people = require("../controllers/people.controller.js");
  const collection = require("../controllers/collection.controller.js");
  const report = require("../controllers/report.controller.js");

  //Clear db connection
  app.post('/destroyDB', people.destroyDB, street.destroyDB, family.destroyDB, collection.destroyDB, report.destroyDB, (req, res)=>{
    res.send({status: 200,data: 'cleared all'})
  });

  //Streets
  app.post("/streetAdd", street.create);

  app.get("/getStreets", street.findAll);

  app.get("/getStreet/:streetId", street.findOne);

  app.post("/updateStreet/:streetId", street.update);

  app.post("/deleteStreet/:streetId", street.delete);

  //Families
  app.post("/familyAdd", family.create);

  app.get("/getFamilies", family.findAll);

  app.get("/getFamily/:familyId", family.findOne);

  app.get("/getFamilyDetails/:familyId", family.familyAllDetails);

  app.post("/updateFamily/:familyId", family.update);

  app.post("/deleteFamily/:familyId", family.delete);

  app.post("/checkUniqueExists", family.checkUnique);

  //People
  app.post("/peopleAdd", people.create);

  app.get("/dashboardInfo", people.dashboardInfo);

  app.post("/updatePeople/:peopleId", people.update);

  app.post("/deletePeople/:peopleId", people.delete);

  //Collections
    app.post("/collectionAdd", collection.create);

    app.get("/getCollection", collection.findAll);

    app.get("/getCollection/:collectionId", collection.findOne);

    app.get("/getCollection/:collectionId/:streetId", collection.collectionStreet);

    app.get("/getCollection/:collectionId/:streetId/:familyId", collection.collectionFamily);

    app.post("/updateCollection/:collectionId", collection.update);

    app.post("/updateCollectionComments/:collectionId", collection.updateCollectionComments);

    app.post("/addCollectionTaxes", collection.addCollectionTaxes);

    app.post("/removeCollectionTaxes", collection.removeCollectionTaxes);

    app.post("/updateClearStatus", collection.updateClearStatus);

    app.post("/deleteCollection/:collectionId", collection.delete);

    //Reports
    app.get("/reportsPending/:collectionId", report.pendingCollections);

};
