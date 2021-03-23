const Collection = function (collection) {
  this.id = collection.id || "";
  this.collection_name = collection.collection_name;
  this.collection_year = collection.collection_year;
  this.collection_amount = collection.collection_amount;
  this.collection_updated = collection.collection_updated;
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

Collection.create = (newCollection, result) => {
  try {
    knex
      .insert({
        collection_name: newCollection.collection_name,
        collection_amount: newCollection.collection_amount,
        collection_year: newCollection.collection_year,
        collection_updated: newCollection.collection_updated,
      })
      .into("sivathai_collections")
      .then((res) => {
        console.log(res, "id");
        result(null, { status: "200", error: "Collection added successfully." });
      })
      .catch((err) => {
        result(null, { status: "400", error: "Can not be added." });
      });
  } catch (err) {
    result(null, { status: "400", error: "Can not be added." });
  }
};

Collection.findById = (collectionId, result) => {
  try {
    let collectionInfo = {};


      // SELECT ss.*, (SELECT count(id) FROM sivathai_collection_details WHERE detail_street_id=ss.id) as contributed_count,
      //     (SELECT count(id) FROM sivathai_collection_details WHERE detail_street_id=ss.id AND detail_is_cleared=1) as cleared_count,
      //     (SELECT sum(detail_contributed) FROM sivathai_collection_details WHERE detail_street_id=ss.id) as collected_amount,
      //     (SELECT count(id) FROM sivathai_families WHERE family_street_id=ss.id) as all_families_count
      // FROM sivathai_streets ss;


    result(null, { status: "400", error: "All Collections" });
  } catch (e) {
    result(null, { status: "400", error: "Data not found", err: e });
  }
};

Collection.getAll = (result) => {
  try {
    knex
      .select("*")
      .from("sivathai_collections")
      .orderBy("id", "desc")
      .then(function (res) {
        // resolve(res);
        result(null, { status: "200", data: res });
      })
      .catch(function (err) {
        result(null, {
          status: "400",
          error: "Data not found",
        });
      });
  } catch (err) {
    result(null, {
      status: "400",
      error: "Data not found",
      err: err
    });
  }
};

Collection.updateById = (id, collection, result) => {
  try {
    knex("sivathai_collections")
      .where({ id: id })
      .update({
        collection_name: collection.collection_name,
        collection_amount: collection.collection_amount,
        collection_year: collection.collection_year,
        collection_updated: Date.now()
      })
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

Collection.remove = (id, result) => {
  try {
    knex('sivathai_collections').where({id: id}).del()
    .then(res=>{
      result(null, { status: "200", error: "Collection deleted successfully." });
    })
    .catch(err=>{
      result(null, { status: "400", error: "Collection can not be deleted." });
    });
  } catch (err) {
    result(null, { status: "400", error: "Collection can not be deleted." });
  }
};



module.exports = Collection;
