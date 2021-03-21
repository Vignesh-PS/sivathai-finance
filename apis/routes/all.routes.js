module.exports = (app) => {
  const street = require("../controllers/street.controller.js");
  const family = require("../controllers/family.controller.js");
  const people = require("../controllers/people.controller.js");

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

  app.post("/peopleAdd", people.create);

  app.post("/updatePeople/:peopleId", people.update);

  app.post("/deletePeople/:peopleId", people.delete);
};
