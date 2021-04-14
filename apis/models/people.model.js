const People = function (people) {
  this.id = people.id || "";
  this.people_name = people.people_name;
  this.people_yob = people.people_yob;
  this.people_gender = people.people_gender;
  this.people_in_native = people.people_in_native;
  this.people_other_address = people.people_other_address;
  this.people_contact = people.people_contact;
  this.people_family_id = people.people_family_id;
  this.people_comments = people.people_comments;
  this.people_updated = Date.now();
};

const homedir = require("os").homedir();
const fileConfig = require("./../config/file-config");

const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename:
      homedir + "\\sivathai-collections\\" + fileConfig.db_location,
  },
});

People.create = (newPeople, result) => {

  // console.log(newPeople);
  // result(null, { status: "400", error: "Can not be added." });
  //return;

  try {
    knex
      .insert({
        people_name : newPeople.people_name,
        people_yob : newPeople.people_yob,
        people_gender : newPeople.people_gender,
        people_in_native : newPeople.people_in_native,
        people_other_address : newPeople.people_other_address,
        people_contact : newPeople.people_contact,
        people_family_id : newPeople.people_family_id,
        people_comments : newPeople.people_comments,
        people_updated : newPeople.people_updated
      })
      .into("sivathai_people")
      .then((res) => {
        console.log(res, "id");
        result(null, { status: "200", error: "People added successfully." });
      })
      .catch((err) => {
        result(null, { status: "400", error: "Can not be added.", err: err });
      });
  } catch (err) {
    result(null, { status: "400", error: "Can not be added." });
  }
};

People.findById = (peopleId, result) => {
  try {
    result(null, { status: "400", error: "All Peoples" });
  } catch (e) {
    result(null, { status: "400", error: "Data not found", err: e });
  }
};

People.getAll = (result) => {
  try {
    knex
      .select("s.*")
      .select(knex.raw("count(f.id) as people_families"))
      .from(knex.raw("sivathai_peoples s"))
      .leftJoin(knex.raw("sivathai_families f"), "s.id", "f.family_people_id")
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

People.dashboardInfo = async(result)=>{
  try {

    let dashboardInfo = {};

    await knex
      .select(knex.raw("count(ss.id) as count"))
      .from(knex.raw("sivathai_streets as ss"))
      .where({"ss.street_deleted": '0'})
      .then(function (res) {
        dashboardInfo.street_count = res[0].count;
        // resolve(res);
        // result(null, { status: "200", data: res });
      })
      .catch(function (err) {
        result(null, {
          status: "600",
          err: err,
          error: "Data not found"
        });
        return;
      });

      //return;


      await knex
      .select(knex.raw("count(sp.id) as count"))
      .from(knex.raw("sivathai_people as sp"))
      .then(function (res) {
        dashboardInfo.people_count = res[0].count;
      })
      .catch(function (err) {
        result(null, {
          status: "700",
          error: "Data not found"
        });
        return;
      });

      await knex
      .select(knex.raw("count(sf.id) as count"))
      .from(knex.raw("sivathai_families as sf"))
      .where({"sf.family_deleted": '0'})
      .then(function (res) {
        dashboardInfo.families_count = res[0].count;
        // resolve(res);
        // result(null, { status: "200", data: res });
      })
      .catch(function (err) {
        result(null, {
          status: "800",
          error: "Data not found"
        });
        return;
      });

      result(null, {
        status: "200",
        data: dashboardInfo,
        error: "Data not found"
      });

  } catch (err) {
    result(null, {
      status: "500",
      error: "Data not found"
    });
  }
}

People.updateById = (id, people, result) => {
  try {
    knex("sivathai_people")
      .where({ id: id })
      .update(
          {
            people_name : people.people_name,
            people_yob : people.people_yob,
            people_gender : people.people_gender,
            people_in_native : people.people_in_native,
            people_other_address : people.people_other_address,
            people_contact : people.people_contact,
            people_family_id : people.people_family_id,
            people_comments : people.people_comments,
            people_updated : Date.now()
          }
      )
      .then((res) => {
        result(null, { status: "200", error: "Updated successfully" });
      })
      .catch((err) => {
        result(null, { status: "400", err: err,error: "Can not be updated" });
      });
  } catch (err) {
    result(null, { status: "500",err: err, error: "Can not be updated" });
  }
};

People.remove = (id, result) => {
  try {
    knex('sivathai_people').where({id: id}).del()
    .then(res=>{
      result(null, { status: "200", error: "People deleted successfully." });
    })
    .catch(err=>{
      result(null, { status: "400", error: "People can not be deleted." });
    });
  } catch (err) {
    result(null, { status: "400", error: "People can not be deleted." });
  }
};

module.exports = People;
