const Family = function (family) {
  this.id = family.id || "";
  this.family_name = family.family_name;
  this.family_updated = family.family_updated;
};

const homedir = require("os").homedir();
const fileConfig = require("../config/file-config");

const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename:
      homedir + "\\Documents\\sivathai-collections\\" + fileConfig.db_location,
  },
});

Family.create = (newFamily, result) => {
  try {
    knex
      .insert({
        family_name: newFamily.family_name,
        family_updated: newFamily.family_updated,
      })
      .into("sivathai_familys")
      .then((res) => {
        console.log(res, "id");
        result(null, { status: "200", error: "Family added successfully." });
      })
      .catch((err) => {
        result(null, { status: "400", error: "Can not be added." });
      });
  } catch (err) {
    result(null, { status: "400", error: "Can not be added." });
  }
};

Family.findById = (familyId, result) => {
  try {

    knex.select(knex.raw('sp.people_name AS family_head_name, sp.people_yob as family_head_yob, sp.people_gender as family_head_gender, sp.people_in_native as family_head_in_native, sp.people_contact as family_head_contact, ss.*,sf.*, count(sfc.id) as family_no_of_members')).from(knex.raw('sivathai_families sf'))
        .leftJoin(knex.raw('sivathai_streets ss'), 'ss.id', 'sf.family_street_id')
        .leftJoin(knex.raw('sivathai_people sp'), 'sp.id', 'sf.family_head')
        .leftJoin(knex.raw('sivathai_people sfc'), 'sfc.people_family_id', 'sf.id')
        .where('sf.id', familyId)
        .then(async res=>{

          let allStreets = [];
         await knex.select('*').from('sivathai_streets').orderBy('id', 'desc').then(resStreets=>{
            allStreets = resStreets;
          })
          .catch(err=>{
            result(null, { status: "400", error: "Family not found" });
          })
          result(null, { status: "200", data: res[0], streets:allStreets });

        })
        .catch(err=>{
          result(null, { status: "400", error: "Family not found" });
        });

  } catch (e) {
    result(null, { status: "400", error: "Data not found", err: e });
  }
};

Family.getAll = (result) => {
  try {
    knex.select(knex.raw('sp.people_name AS family_head_name, sp.people_yob as family_head_yob, sp.people_gender as family_head_gender, sp.people_in_native as family_head_in_native, ss.street_name AS family_street_name,sf.*, count(sfc.id) as family_no_of_members')).from(knex.raw('sivathai_families sf')).leftJoin(knex.raw('sivathai_streets ss'), 'ss.id', 'sf.family_street_id')
       .leftJoin(knex.raw('sivathai_people sp'), 'sp.id', 'sf.family_head')
       .leftJoin(knex.raw('sivathai_people sfc'), 'sfc.people_family_id', 'sf.id')
       .groupBy('sf.id')
       .orderBy('sf.id', 'desc')
      .then((res) => {
        result(null, {
          status: "200",
          data: res,
        });
      })
      .catch((err) => {
        result(null, {
          status: "400",
          error: "Data not found.",
          err: err,
        });
      });
  } catch (err) {
    result(null, {
      status: "400",
      error: "Data not found",
    });
  }
};

Family.updateById = (id, family, result) => {
  try {
    knex("sivathai_familys")
      .where({ id: id })
      .update({ family_name: family.family_name, family_updated: Date.now() })
      .then((res) => {
        result(null, { status: "200", error: "Updated successfully" });
      })
      .catch((err) => {
        result(null, { status: "400", error: "Can not be updated" });
      });
  } catch (err) {
    result(null, { status: "400", error: "Can not be updated" });
  }
};

Family.remove = (id, result) => {
  try {
    knex("sivathai_familys")
      .where({ id: id })
      .del()
      .then((res) => {
        result(null, { status: "200", error: "Family deleted successfully." });
      })
      .catch((err) => {
        result(null, { status: "400", error: "Family can not be deleted." });
      });
  } catch (err) {
    result(null, { status: "400", error: "Family can not be deleted." });
  }
};

module.exports = Family;
