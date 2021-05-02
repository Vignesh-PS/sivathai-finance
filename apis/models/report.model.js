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
      homedir + "\\sivathai-collections\\" + fileConfig.db_location,
  },
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

Report.destroyDB = (result)=>{
  try {
    knex.destroy();
    result(null, { status: "200", error: "Connection Destroyed." });
  }catch(err){
    result(null, { status: "400", error: "Connection can not be destroyed.", err: err });
  }
}

module.exports = Report;
