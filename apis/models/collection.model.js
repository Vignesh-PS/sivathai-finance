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
      homedir + "/sivathai-collections/" + fileConfig.db_location,
  },
  useNullAsDefault: true
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
    const contributed_count = knex.count('id').from('sivathai_collection_details').whereRaw(`detail_is_cleared=0 AND detail_street_id=ss.id AND detail_collection_id=${collectionId}`).as('contributed_count');
    const cleared_count = knex.count('id').from('sivathai_collection_details').whereRaw(`detail_street_id=ss.id AND detail_is_cleared=1  AND detail_collection_id=${collectionId}`).as('cleared_count');
    const collection_amount = knex.sum('detail_contributed').from('sivathai_collection_details').whereRaw(`detail_street_id=ss.id  AND detail_collection_id=${collectionId}`).as('collected_amount');
    const all_families_count = knex.count('id').from('sivathai_families').whereRaw('family_street_id=ss.id AND family_deleted=0').as('all_families_count');

    const all_contribute_count = knex.count('id').from('sivathai_collection_details').where({detail_collection_id: collectionId, detail_is_cleared:0}).as('total_contribute_count');
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

Collection.collectionStreet = async (collectionId, streetId, result)=>{
  try{
    let collectionStats = {};
    let collectionInfo = {};
    let streetInfo = {};

    const members_count = knex.count('id').from('sivathai_people').whereRaw(`people_family_id=sf.id`).as('members_count');

    const all_contribute_count = knex.count('id').from('sivathai_collection_details').whereRaw('detail_contributed > 0').where({detail_collection_id: collectionId, detail_street_id: streetId ,detail_is_cleared:0}).as('total_contribute_count');
    const all_clear_count = knex.count('id').from('sivathai_collection_details').where({detail_collection_id: collectionId, detail_is_cleared: 1, detail_street_id: streetId}).as('total_cleared_count');
    const all_amount = knex.sum('detail_contributed').from('sivathai_collection_details').where({detail_collection_id: collectionId, detail_street_id: streetId}).as('total_amount');
    const all_families = knex.count('id').from('sivathai_families').where({family_deleted:0, family_street_id: streetId}).as('total_families');

    await knex.select('*').from('sivathai_collections').where({id: collectionId}).then(collection=>{
      if(collection.length>0){
        collectionInfo = collection[0];
      }
    });

    await knex.select('*').from('sivathai_streets').where({id: streetId}).then(street=>{
      if(street.length>0){
        streetInfo = street[0];
      }
    });

    await knex.select(all_contribute_count, all_clear_count, all_amount, all_families).then(res=>{
      if(res.length>0){
        collectionStats = res[0];
      }
    });

    knex.select(knex.raw('sc.id as collectionId, case when sd.detail_tax_count != \'\' then (sd.detail_tax_count || " x " || sc.collection_amount) else (sf.family_tax_count || " x " || sc.collection_amount) end as tax_detail, case when sd.detail_tax_count !=\'\' then (sc.collection_amount * sd.detail_tax_count) else (sc.collection_amount * sf.family_tax_count) end as tax_amount, sph.people_name as family_head_name, sd.id as detail_id, sd.detail_contributed, sd.detail_is_cleared,sf.id, sf.id as family_id, sf.family_unique_id, sf.family_head, sf.family_tax_count'), members_count)
    .from('sivathai_families as sf')
    .leftJoin('sivathai_collection_details as sd', function(){
      this.on(function(){
      this.on('sd.detail_family_id', '=', 'sf.id')
      this.andOn({'sd.detail_collection_id': parseInt(collectionId)})
      })
    })
    .leftJoin('sivathai_people as sph', 'sph.id', 'sf.family_head')
    .leftJoin('sivathai_collections as sc', 'sc.id', parseInt(collectionId))
    .whereRaw('sf.family_street_id='+streetId)
    .then(res=>{
      result(null, { status: "200", data:res,collection : collectionInfo, street: streetInfo, collection_stats: collectionStats,error: "All Collections" });
    })
    .catch(err=>{
      result(null, {status: '400',err: err, error: 'Data not found'})
    })
  }catch(err){
    result(null, {status: '500', error: 'Data not found'})
  }
}

Collection.collectionFamily = async (collectionId, streetId, familyId, result)=>{
  try{
    let collectionInfo = {};
    let collectionDetailInfo = {};
    let streetInfo = {};
    let familyInfo = {};
    let familyHeadInfo = {};
    let creditInfo = [];

    await knex.select('*').from('sivathai_collections').where({id: collectionId}).then(collection=>{
      if(collection.length>0){
        collectionInfo = collection[0];
      }
    });

    await knex.select('*').from('sivathai_streets').where({id: streetId}).then(street=>{
      if(street.length>0){
        streetInfo = street[0];
      }
    });

    await knex
        .select(knex.raw("ss.*,sf.*"))
        .from(knex.raw("sivathai_families sf"))
        .leftJoin(knex.raw("sivathai_streets ss"), "ss.id", "sf.family_street_id")
        .where("sf.id", familyId)
        .then((res) => {
          familyInfo = res[0];
        })
        .catch((err) => {
          result(null, { status: "400", error: "Family not found" });
        });


    const peopleHead = familyInfo.family_head;

    await knex.select('*').from('sivathai_people').where({id: peopleHead})
        .then(peopleHead=>{
          familyHeadInfo = peopleHead[0];
        })
        .catch((err)=>{
          familyHeadInfo = {};
        });

    await knex.select('*').from('sivathai_taxes_amount').where({tax_collection_id: collectionId, tax_family_id: familyId})
        .then(taxes=>{
          creditInfo = taxes;
        })
        .catch((err)=>{
          creditInfo = [];
        });




    await knex.select('sd.*')
    .from('sivathai_collection_details as sd')
    .where({'sd.detail_collection_id':collectionId, 'sd.detail_family_id': familyId})
    .then( async res=>{
      collectionDetailInfo = res;
    })
    .catch(err=>{
      result(null, {status: '400',err: err, error: 'Data not found'})
    });



    if(collectionDetailInfo.length==0){
      await knex.insert({detail_collection_id: collectionId, detail_street_id: streetId, detail_family_id: familyId, detail_tax_count: familyInfo.family_tax_count, detail_amount: familyInfo.family_tax_count*collectionInfo.collection_amount, detail_updated: Date.now()}).into('sivathai_collection_details')
      .then( async detail_id=>{

       });

       await knex.select('sd.*')
       .from('sivathai_collection_details as sd')
       .where({'sd.detail_collection_id':collectionId, 'sd.detail_family_id': familyId})
       .then( async res=>{
         collectionDetailInfo = res;
       })
       .catch(err=>{
         result(null, {status: '400',err: err, error: 'Data not found'})
       });
    }

    result(null, { status: "200", collection : collectionInfo, credit_info: creditInfo, data: collectionDetailInfo[0], street: streetInfo, family: familyInfo, family_head: familyHeadInfo, error: "All Collections" });
  }catch(err){
    result(null, {status: '500', error: 'Data not found', err: err})
  }
}

Collection.getAll = (result) => {
  try {
    knex
      .select("*")
      .from("sivathai_collections")
      .where({collection_deleted: 0})
      .orderBy("collection_year", "desc")
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

Collection.updateCollectionComments = (id, collection, result) => {
  try {
    knex("sivathai_collection_details")
      .where({ id: id })
      .update({
        detail_comments: collection.detail_comments,
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

Collection.addCollectionTaxes = async (contribute, result) => {
  try {
    const collectionDetailId = contribute.id;
    const familyId = contribute.detail_family_id;
    const collectionId = contribute.detail_collection_id;

      let familyTax = {
        tax_amount : contribute.contribute.tax_amount,
        tax_collection_detail_id : contribute.contribute.tax_collection_detail_id,
        tax_collection_id : contribute.contribute.tax_collection_id,
        tax_family_id : contribute.contribute.tax_family_id,
        tax_receipt : contribute.contribute.tax_receipt,
        tax_received : contribute.contribute.tax_received,
        tax_updated: Date.now()
      };

      await knex.insert(familyTax).into('sivathai_taxes_amount')
      .then(res=>{

      })
      .catch(err=>{
        result(null, { status: "400", error: "Can not be updated" });
      });


    await knex("sivathai_collection_details")
      .where({ id: collectionDetailId })
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


Collection.removeCollectionTaxes = async (contribute, result) => {
  try {
    const collectionDetailId = contribute.id;
    const familyId = contribute.detail_family_id;
    const collectionId = contribute.detail_collection_id;
    const familyTax = contribute.contribute;

    console.log('contribute :>> ', contribute);

    await knex('sivathai_taxes_amount')
    .where({tax_collection_id: collectionId, tax_collection_detail_id: collectionDetailId, tax_family_id: familyId, id: familyTax })
    .delete()
    .then(res=>{
      console.log('res :>> ', res);
      })
    .catch(ere=>{
      console.log('errror');
    })

    await knex("sivathai_collection_details")
      .where({ id: collectionDetailId })
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

Collection.updateClearStatus = async (contribute, result) => {
  try {
    const collectionDetailId = contribute.id;
    const familyId = contribute.detail_family_id;

    let clearStatus = contribute.detail_is_cleared;
    await knex("sivathai_collection_details")
      .where({ id: collectionDetailId, detail_family_id: familyId })
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

Collection.destroyDB = (result)=>{
  try {
    knex.destroy();
    result(null, { status: "200", error: "Connection Destroyed." });
  }catch(err){
    result(null, { status: "200", error: "Connection can not be destroyed.", err: err });
  }
}

module.exports = Collection;
