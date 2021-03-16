module.exports = (app) => {
  const street = require("../controllers/street.controller.js");
  const family = require("../controllers/family.controller.js");

  //Street
  app.post("/streetAdd", street.create);

  app.get("/getStreets", street.findAll);

  app.get("/getStreet/:streetId", street.findOne);

  app.post("/updateStreet/:streetId", street.update);

  app.post("/deleteStreet/:streetId", street.delete);

  app.post("/familyAdd", family.create);

  app.get("/getFamilies", family.findAll);

  app.get("/getFamily/:familyId", family.findOne);

  app.post("/updateFamily/:familyId", family.update);

  app.post("/deleteFamily/:familyId", family.delete);
};
