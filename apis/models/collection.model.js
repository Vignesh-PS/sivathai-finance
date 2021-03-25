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

Collection.findById = async (collectionId, result) => {
  try {
    let collectionInfo = {};
    let collectionStats = {};
    const contributed_count = knex.count('id').from('sivathai_collection_details').whereRaw(`detail_street_id=ss.id AND detail_collection_id=${collectionId}`).as('contributed_count');
    const cleared_count = knex.count('id').from('sivathai_collection_details').whereRaw(`detail_street_id=ss.id AND detail_is_cleared=1  AND detail_collection_id=${collectionId}`).as('cleared_count');
    const collection_amount = knex.sum('detail_contributed').from('sivathai_collection_details').whereRaw(`detail_street_id=ss.id  AND detail_collection_id=${collectionId}`).as('collected_amount');
    const all_families_count = knex.count('id').from('sivathai_families').whereRaw('family_street_id=ss.id AND family_deleted=0').as('all_families_count');

    const all_contribute_count = knex.count('id').from('sivathai_collection_details').where({detail_collection_id: collectionId}).as('total_contribute_count');
    const all_clear_count = knex.count('id').from('sivathai_collection_details').where({detail_collection_id: collectionId, detail_is_cleared: 1}).as('total_cleared_count');
    const all_amount = knex.sum('detail_contributed').from('sivathai_collection_details').where({detail_collection_id: collectionId}).as('total_amount');
    const all_families = knex.count('id').from('sivathai_families').where({family_deleted:0}).as('total_families');

    await knex.select('*').from('sivathai_collections').where({id: collectionId}).then(collection=>{
      if(collection.length>0){
        collectionInfo = collection[0];
      }
    });

    await knex.select(all_contribute_count, all_clear_count, all_amount, all_families).then(res=>{
      if(res.length>0){
        collectionStats = res[0];
      }
    })

    knex.select('ss.*', contributed_count, cleared_count, collection_amount, all_families_count)
    .from('sivathai_streets as ss')
    .then(res=>{
      result(null, { status: "200", data:res, collection : collectionInfo, stats: collectionStats, error: "All Collections" });
    })
    .catch(err=>{
    result(null, { status: "400", err:err, error: "No data" });
    })

  } catch (e) {
    result(null, { status: "500", error: "Data not found", err: e });
  }
};

Collection.collectionStreet = (collectionId, streetId, result)=>{
  try{
    const familySelect = 'sf.family_head, sf.family_unique_id, sf.family_tax_count';

    knex.select(knex.raw('scd.*, '+ familySelect))
    .from('sivathai_collection_details as scd')
    .join('sivathai_families as sf', {'sf.id': 'scd.detail_family_id'})
    .where('scd.detail_collection_id', collectionId)
    .where('scd.detail_street_id', streetId)
    .then(collections=>{
      result(null, {status: '200',data: collections});
    })
    .catch(err=>{
      result(null, {status: '500',err: err, error: 'Data not found'})
    })
  }catch(err){
    result(null, {status: '400', error: 'Data not found'})
  }
}

Collection.getAll = (result) => {
  try {
    knex
      .select("*")
      .from("sivathai_collections")
      .where({collection_deleted: 0})
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
    knex('sivathai_collections').where({id: id})
    .update({collection_deleted: 1, collection_updated: Date.now()})
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
