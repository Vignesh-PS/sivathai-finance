const Oldcollection = function (old_collection) {
  this.id = old_collection.id || "";
  this.old_collection_name = old_collection.old_collection_name;
  this.old_collection_year = old_collection.old_collection_year;
  this.old_collection_amount = old_collection.old_collection_amount;
  this.old_collection_updated = old_collection.old_collection_updated;
};

const homedir = require("os").homedir();
const fileConfig = require("../config/file-config");

const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename:
      homedir + "\\sivathai-collections\\" + fileConfig.db_location,
  },
});

Oldcollection.create = (newOldcollection, result) => {
  try {
    knex
      .insert({
        old_collection_name: newOldcollection.old_collection_name,
        old_collection_amount: newOldcollection.old_collection_amount,
        old_collection_year: newOldcollection.old_collection_year,
        old_collection_updated: newOldcollection.old_collection_updated,
      })
      .into("sivathai_old_collections")
      .then((res) => {
        console.log(res, "id");
        result(null, { status: "200", error: "Collection added successfully." });
      })
      .catch((err) => {
        result(null, { status: "400", err: err,error: "Can not be added." });
      });
  } catch (err) {
    result(null, { status: "500",err: err, error: "Can not be added." });
  }
};

Oldcollection.newEntry = async (newEntry, result) => {
  try {

    let collectionId = newEntry.old_detail_collection_id;
    let familyId = newEntry.old_detail_family_id;
    let isExist = false;

    await knex.select('id').from('sivathai_old_collection_details').where({old_detail_collection_id: collectionId, old_detail_family_id: familyId}).then(res=>{
      if(res.length>0){
        // result(null, { status: "500",error: "Can not be added as it is already added." });
        isExist = true;
        // return;
      }
    });

    if(isExist){
      result(null, { status: "500",error: "Can not be added as it is already added." });
      return;
    }

    console.log('newEntry :>> ', newEntry);

    knex
      .insert({
        old_detail_collection_id: newEntry.old_detail_collection_id,
        old_detail_family_id: newEntry.old_detail_family_id,
        old_detail_street_id: newEntry.old_detail_street_id,
        old_detail_tax_count: newEntry.old_detail_tax_count,
        old_detail_amount: newEntry.old_detail_amount,
        old_detail_contributed: newEntry.old_detail_contributed,
        old_detail_comments: newEntry.old_detail_comments
      })
      .into("sivathai_old_collection_details")
      .then((res) => {
        console.log(res, "id");
        result(null, { status: "200",id:res, error: "Collection added successfully." });
      })
      .catch((err) => {
        result(null, { status: "400", err: err,error: "Can not be added." });
      });
  } catch (err) {
    result(null, { status: "500",err: err, error: "Can not be added." });
  }
};


Oldcollection.getAll = (result) => {
  try {
    knex
      .select("*")
      .from("sivathai_old_collections")
      .where({old_collection_deleted: 0})
      .orderBy("old_collection_year", "desc")
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

Oldcollection.getAllDetail = async (result) => {
  try {
    const old_collection_count = knex.count('id').from('sivathai_old_collection_details').whereRaw(`old_detail_family_id=sod.old_detail_family_id`).as('old_collection_count');
    const old_collection_ids = knex.select(knex.raw('group_concat(old_detail_collection_id)')).from('sivathai_old_collection_details').whereRaw('old_detail_family_id=sod.old_detail_family_id').as('old_collection_ids');

    let collections = [];
    let allCollections = [];

   await knex
      .select(old_collection_count,old_collection_ids, "sod.old_detail_family_id", "sod.old_detail_street_id", "sph.people_name", "ss.street_name", "sf.family_unique_id")
      .from("sivathai_old_collection_details as sod")
      .groupBy('old_detail_family_id')
      .leftJoin('sivathai_families as sf', 'sod.old_detail_family_id', 'sf.id')
      .leftJoin('sivathai_people as sph', 'sf.family_head', 'sph.id')
      .leftJoin('sivathai_streets as ss', 'sod.old_detail_street_id', 'ss.id')
      .then(function (res) {
        collections = res;
      })
      .catch(function (err) {
        result(null, {
          status: "400",
          err: err,
          error: "Data not found",
        });
      });


      for (let collection of collections){
        let pendingIds = collection.old_collection_ids;
        await knex.select(knex.raw('group_concat(old_collection_name) as old_collection_names')).from('sivathai_old_collections').whereRaw(`id in (${pendingIds})`)
        .then(result=>{
          collection.old_collection_names = result[0].old_collection_names;
        })
        .catch(err=>{

        })

        allCollections.push(collection);
      }

      result(null, { status: "200", data: allCollections, families_count: allCollections.length });
  } catch (err) {
    result(null, {
      status: "500",
      err: err,
      error: "Data not found",
      err: err
    });
  }
};

Oldcollection.updateById = (id, oldcollection, result) => {
  try {
    knex("sivathai_old_collections")
      .where({ id: id })
      .update({
        old_collection_name: oldcollection.old_collection_name,
        old_collection_amount: oldcollection.old_collection_amount,
        old_collection_year: oldcollection.old_collection_year,
        old_collection_updated: Date.now()
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

Oldcollection.updateOldcollectionComments = (id, oldcollection, result) => {
  try {
    knex("sivathai_old_collection_details")
      .where({ id: id })
      .update({
        detail_comments: oldcollection.detail_comments,
        detail_updated: Date.now()
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

Oldcollection.addOldcollectionTaxes = async (contribute, result) => {
  try {
    const oldcollectionDetailId = contribute.id;
    const familyId = contribute.detail_family_id;
    const oldcollectionId = contribute.detail_old_collection_id;

      let familyTax = {
        tax_amount : contribute.contribute.tax_amount,
        tax_old_collection_detail_id : contribute.contribute.tax_old_collection_detail_id,
        tax_old_collection_id : contribute.contribute.tax_old_collection_id,
        tax_family_id : contribute.contribute.tax_family_id,
        tax_updated: Date.now()
      };

      await knex.insert(familyTax).into('sivathai_taxes_amount')
      .then(res=>{

      })
      .catch(err=>{
        result(null, { status: "400", error: "Can not be updated" });
      });


    await knex("sivathai_old_collection_details")
      .where({ id: oldcollectionDetailId })
      .update({
        detail_contributed: contribute.detail_contributed,
        detail_updated: Date.now()
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

Oldcollection.removeOldcollectionTaxes = async (contribute, result) => {
  try {
    const oldcollectionDetailId = contribute.id;
    const familyId = contribute.detail_family_id;
    const oldcollectionId = contribute.detail_old_collection_id;
    const familyTax = contribute.contribute;

    console.log('contribute :>> ', contribute);

    await knex('sivathai_taxes_amount')
    .where({tax_old_collection_id: oldcollectionId, tax_old_collection_detail_id: oldcollectionDetailId, tax_family_id: familyId, id: familyTax })
    .delete()
    .then(res=>{
      console.log('res :>> ', res);
      })
    .catch(ere=>{
      console.log('errror');
    })

    await knex("sivathai_old_collection_details")
      .where({ id: oldcollectionDetailId })
      .update({
        detail_contributed: contribute.detail_contributed,
        detail_updated: Date.now()
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

Oldcollection.updateClearStatus = async (contribute, result) => {
  try {
    const oldcollectionDetailId = contribute.id;
    const familyId = contribute.detail_family_id;

    let clearStatus = contribute.detail_is_cleared;
    await knex("sivathai_old_collection_details")
      .where({ id: oldcollectionDetailId, detail_family_id: familyId })
      .update({
        detail_is_cleared: contribute.detail_is_cleared,
        detail_cleared_time: Date.now()
      })
      .then((res) => {
        result(null, { status: "200", error: clearStatus==1?'Cleared successfully.':'Changed it into pending.' });
      })
      .catch((err) => {
        result(null, { status: "400", error: "Can not be changed" });
      });
  } catch (err) {
    result(null, { status: "400", error: "Can not be changed" });
  }
};

Oldcollection.remove = (id, result) => {
  try {
    knex('sivathai_old_collections').where({id: id})
    .update({old_collection_deleted: 1, old_collection_updated: Date.now()})
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

Oldcollection.destroyDB = (result)=>{
  try {
    knex.destroy();
    result(null, { status: "200", error: "Connection Destroyed." });
  }catch(err){
    result(null, { status: "200", error: "Connection can not be destroyed.", err: err });
  }
}

module.exports = Oldcollection;
