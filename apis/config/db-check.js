const homedir = require("os").homedir();
const fileConfig = require("./file-config");
const fs = require("fs");

const dbPath = homedir + "/sivathai-collections/";
const dbName = fileConfig.db_location;

if (fs.existsSync(dbPath+dbName)) {

  console.log('exist');

}else{

  console.log('not exists');
  if (!fs.existsSync(dbPath)){
    console.log('make');
   fs.mkdirSync(dbPath);
  }

  fs.copyFile(__dirname+'/empty-db.db', dbPath+dbName, (err)=>{
    if (err) {
      console.log('err :>> ', err);
    return;
    };
  });
}

