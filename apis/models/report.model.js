const Collection = require("./collection.model");

const Report = function (report) {
  this.id = report.id || "";
  this.report_name = report.report_name;
  this.report_updated = report.report_updated;
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

Report.pendingCollections = async (collectionId, result) =>{
  try{
    let collectionInfo = {};
    let collectionStreets = [];
    let streetInfos = [];

    await knex.select('*').from('sivathai_collections').where({id: collectionId})
      .then(collection=>{
        if(!collection.length==0){
          collectionInfo = collection[0]
        }
      })

    await knex.select('*').from('sivathai_streets').where({street_deleted: 0})
      .then(streets=>{
        collectionStreets = streets;
      })

      for(street of collectionStreets){
       // console.log('street :>> ', street.id);


        await Collection.collectionStreet(collectionId, street.id, async (err, streetData) => {
          if(streetData){
            var streeetData = {
              ...streetData.street,
              collections: streetData.data,
              ...streetData.collection_stats
            }

            console.log('streetData.id :>> ', streetData.id);
            streetInfos.push(streeetData);
          }
        });
      }

      setTimeout(() => {

        result(null, {status: '200', collection: collectionInfo, data: streetInfos});

      }, 200);


  }catch(err){
    result(null, {status: '400', error: 'Data not found.'})
  }
}

Report.pendingCollectionsOld = async (result)=>{
  try{
    let allStreets = [];

    await knex('sivathai_streets').select(['street_name','id']).where({street_deleted: 0})
    .then(streets=>{
      allStreets = streets;
    })
    .catch(err=>{
      result(null, {status: 400, err: err, error: 'Streets not found.'});
    });

    for(let street of allStreets){
      var streetInfo = street;

      var old_collection_count = knex.count('id').from('sivathai_old_collection_details').whereRaw(`old_detail_family_id=sod.old_detail_family_id AND old_detail_is_cleared!=1`).as('old_collection_count');
      await knex
      .select(old_collection_count, "sod.old_detail_family_id", "sod.old_detail_street_id", "sph.people_name", "sf.family_unique_id")
      .from("sivathai_old_collection_details as sod")
      .groupBy('old_detail_family_id')
      .leftJoin('sivathai_families as sf', 'sod.old_detail_family_id', 'sf.id')
      .leftJoin('sivathai_people as sph', 'sf.family_head', 'sph.id')
      .where({'sod.old_detail_street_id':street.id})
      .then(async function (res) {
        streetInfo.families = res;

        if(streetInfo.families.length>0){
          for (let family of streetInfo.families){
            await knex.select(knex.raw('sod.*, so.*, so.id as collection_id, sod.id as detail_id'))
            .from('sivathai_old_collection_details as sod')
            .leftJoin(knex.raw('sivathai_old_collections as so'), 'so.id', 'sod.old_detail_collection_id')
            .whereRaw(`sod.old_detail_family_id=${family.old_detail_family_id}`)
            .then(res=>{
              family.collections = res;
            })
            .catch(err=>{
              result(null, {status: "700",err: err,error: "Data not found"});
            })
          }
        }
        // collections = res;
      })
      .catch(function (err) {
        result(null, {status: "500",err: err,error: "Data not found"});
      });

    }

    result(null, {status: '200', streets: allStreets, error: 'Data not found.'})
  }catch(err){
    result(null, { status: "600", error: "Data not found.", err: err });
  }
}

Report.destroyDB = (result)=>{
  try {
    knex.destroy();
    result(null, { status: "200", error: "Connection Destroyed." });
  }catch(err){
    result(null, { status: "400", error: "Connection can not be destroyed.", err: err });
  }
}

module.exports = Report;
