const Street = function (street) {
  this.id = street.id || "";
  this.street_name = street.street_name;
  this.street_updated = street.street_updated;
};

const homedir = require("os").homedir();
const fileConfig = require("./../config/file-config");

const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename:
      homedir + "\\Documents\\sivathai-collections\\" + fileConfig.db_location,
  },
});

Street.create = (newStreet, result) => {
  try {
    knex
      .insert({
        street_name: newStreet.street_name,
        street_updated: newStreet.street_updated,
      })
      .into("sivathai_streets")
      .then((res) => {
        console.log(res, "id");
        result(null, { status: "200", error: "Street added successfully." });
      })
      .catch((err) => {
        result(null, { status: "400", error: "Can not be added." });
      });
  } catch (err) {
    result(null, { status: "400", error: "Can not be added." });
  }
};

Street.findById = (streetId, result) => {
  try {
    result(null, { status: "400", error: "All Streets" });
  } catch (e) {
    result(null, { status: "400", error: "Data not found", err: e });
  }
};

Street.getAll = (result) => {
  try {
    knex
      .select("s.*")
      .select(knex.raw("count(f.id) as street_families"))
      .from(knex.raw("sivathai_streets s"))
      .leftJoin(knex.raw("sivathai_families f"), "s.id", "f.family_street_id")
      .groupBy("s.id")
      .orderBy("s.id", "desc")
      .then(function (res) {
        // resolve(res);
        result(null, { status: "200", data: res });
      })
      .catch(function (err) {
        result(null, {
          status: "400",
          error: "Data not found",
          file: homedir + "\\Documents\\sivathai-collections\\sivathai-db",
        });
      });
  } catch (err) {
    result(null, {
      status: "400",
      error: "Data not found",
      file: homedir + "\\Documents\\sivathai-collections\\sivathai-db",
    });
  }
};

Street.updateById = (id, street, result) => {
  try {
    knex("sivathai_streets")
      .where({ id: id })
      .update({ street_name: street.street_name, street_updated: Date.now() })
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

Street.remove = (id, result) => {
  try {
    knex('sivathai_streets').where({id: id}).del()
    .then(res=>{
      result(null, { status: "200", error: "Street deleted successfully." });
    })
    .catch(err=>{
      result(null, { status: "400", error: "Street can not be deleted." });
    });
  } catch (err) {
    result(null, { status: "400", error: "Street can not be deleted." });
  }
};

module.exports = Street;
