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
      homedir + "/sivathai-collections/" + fileConfig.db_location,
  },
  useNullAsDefault: true

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
        isExist = true;
      }
    });

    if(isExist){
      result(null, { status: "500",error: "Can not be added as it is already added." });
      return;
    }

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
    const old_collection_count = knex.count('id').from('sivathai_old_collection_details').whereRaw(`old_detail_family_id=sod.old_detail_family_id AND old_detail_is_cleared!=1`).as('old_collection_count');
    const old_collection_ids = knex.select(knex.raw('group_concat(old_detail_collection_id)')).from('sivathai_old_collection_details').whereRaw('old_detail_family_id=sod.old_detail_family_id AND old_detail_is_cleared!=1').as('old_collection_ids');

    let collections = [];
    let allCollections = [];
    let allStreets = [];
    let pendingsCount = 0;
    let clearedCount = 0;

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
        if(!pendingIds==0){
          pendingsCount++;
        }else{
          clearedCount++;
        }
        await knex.select(knex.raw('group_concat(old_collection_name) as old_collection_names')).from('sivathai_old_collections').whereRaw(`id in (${pendingIds})`)
        .then(result=>{
          collection.old_collection_names = result[0].old_collection_names;
        })
        .catch(err=>{

        });

        allCollections.push(collection);
      }

    await  knex
    .select('*')
    .from('sivathai_streets')
    .then(streets=>{
      allStreets = streets;
    })

      result(null, { status: "200", cleared: clearedCount, pendings: pendingsCount, data: allCollections, streets: allStreets, families_count: allCollections.length });
  } catch (err) {
    result(null, {
      status: "500",
      err: err,
      error: "Data not found",
      err: err
    });
  }
};

Oldcollection.getAllFamily = async(familyId,result)=>{
  try{
    let familyInfo = {};
    let collectionsOld = [];
    let taxesInfo = [];

    await knex
    .select(
      knex.raw(
        "sp.people_name AS family_head_name, sp.people_yob as family_head_yob, sp.people_gender as family_head_gender, sp.people_in_native as family_head_in_native, sp.people_contact as family_head_contact, ss.*,sf.*, count(sfc.id) as family_no_of_members"
      )
    )
    .from(knex.raw("sivathai_families sf"))
    .leftJoin(knex.raw("sivathai_streets ss"), "ss.id", "sf.family_street_id")
    .leftJoin(knex.raw("sivathai_people sp"), "sp.id", "sf.family_head")
    .leftJoin(
      knex.raw("sivathai_people sfc"),
      "sfc.people_family_id",
      "sf.id"
    )
    .where("sf.id", familyId)
    .then((res) => {
      familyInfo = res[0];
    })
    .catch((err) => {
      result(null, { status: "400", error: "Family not found" });
    });

    await knex.select(knex.raw('sod.*, so.*, so.id as collection_id, sod.id as detail_id')).from('sivathai_old_collection_details as sod')
    .leftJoin(knex.raw('sivathai_old_collections as so'), 'so.id', 'sod.old_detail_collection_id')
    .whereRaw(`sod.old_detail_family_id=${familyId}`)
    .then(res=>{
      collectionsOld = res;
    });

    await knex.select(knex.raw('sta.*, so.*, sta.id as tax_id')).from('sivathai_old_taxes_amount as sta')
      .leftJoin(knex.raw('sivathai_old_collections as so'), 'so.id', 'sta.tax_old_collection_id')
      .whereRaw(`sta.tax_old_family_id=${familyId}`)
      .then(res=>{
        taxesInfo = res;
      })

    result(null, { status: "200", family: familyInfo, collections: collectionsOld, taxes: taxesInfo });
  }catch(err){
    result(null, { status: "400", err: err, error: "Can not loaded" });
  }
}

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

Oldcollection.addOldCollectionTaxes = async (contribute, result) => {
  try {
    const oldCollectionDetailId = contribute.detail_id;

      let familyTax = {
        tax_old_collection_id : contribute.contribute.old_tax_collection_id,
        tax_old_collection_detail_id : oldCollectionDetailId,
        tax_old_family_id : contribute.contribute.old_tax_family_id,
        tax_old_amount : contribute.contribute.old_tax_amount,
        tax_old_receipt : contribute.contribute.old_tax_receipt,
        tax_old_received : contribute.contribute.old_tax_received,
        tax_old_updated: Date.now()
      };

      // console.log('familyTax :>> ', familyTax);

      await knex.insert(familyTax).into('sivathai_old_taxes_amount')
      .then(res=>{

      })
      .catch(err=>{
        result(null, { status: "500", err:err,error: "Can not be updated" });
      });


    await knex("sivathai_old_collection_details")
      .where({ id: oldCollectionDetailId })
      .update({
        old_detail_contributed: contribute.old_detail_contributed,
        old_detail_updated: Date.now()
      })
      .then((res) => {
        result(null, { status: "200", error: "Updated successfully" });
      })
      .catch((err) => {
        result(null, { status: "600",err:err, error: "Can not be updated" });
      });
  } catch (err) {
    result(null, { status: "700", err:err, error: "Can not be updated" });
  }
};

Oldcollection.removeCollectionTaxesOld = async (contribute, result) => {
  try {

    console.log('contribute :>> ', contribute);
    const collectionId = contribute.tax_old_collection_id;
    const collectionDetailId = contribute.tax_old_collection_detail_id;
    const familyId = contribute.tax_old_family_id;
    const taxId = contribute.tax_id;
    let collectionDetailInfo = {};

    await knex('sivathai_old_collection_details')
    .where({id: collectionDetailId})
    .then(res=>{
      collectionDetailInfo = res[0];
    })
    .catch(err=>{
      collectionDetailInfo = {};
    })

    if(!collectionDetailInfo.id){
      result(null, { status: "400",err: err, error: "Can not be updated" });
      return;
    }
    // result(null, { status: "400" ,err: collectionDetailInfo, error: "Can not be updated" });


    await knex('sivathai_old_taxes_amount')
    .where({tax_old_collection_id: collectionId, tax_old_collection_detail_id: collectionDetailId, tax_old_family_id: familyId, id: taxId })
    .delete()
    .then(res=>{
      console.log('res :>> ', res);
      })
    .catch(err=>{
      result(null, { status: "500",err: err, error: "Can not be updated" });
    })

    await knex("sivathai_old_collection_details")
      .where({ id: collectionDetailId })
      .update({
        old_detail_contributed: collectionDetailInfo.old_detail_contributed - contribute.tax_old_amount,
        old_detail_is_cleared: 0,
        old_detail_updated: Date.now()
      })
      .then((res) => {
        result(null, { status: "200", error: "Updated successfully" });
      })
      .catch((err) => {
        result(null, { status: "600", err:err, error: "Can not be updated" });
      });
  } catch (err) {
    result(null, { status: "700",err:err, error: "Can not be updated" });
  }
};

Oldcollection.oldUpdateClearStatus = async (contribute, result) => {
  try {
    const oldCollectionDetailId = contribute.detail_id;
    const familyId = contribute.old_detail_family_id;
    let clearStatus = contribute.old_detail_is_cleared;
    await knex("sivathai_old_collection_details")
      .where({ id: oldCollectionDetailId, old_detail_family_id: familyId })
      .update({
        old_detail_is_cleared: clearStatus,
        old_detail_cleared_time: Date.now()
      })
      .then((res) => {
        result(null, { status: "200", res:res,error: clearStatus==1?'Cleared successfully.':'Changed it into pending.' });
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
