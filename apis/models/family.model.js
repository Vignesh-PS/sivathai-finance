const Family = function (family) {
  this.family_comments = family.family_comments || "";
  this.family_door_no = family.family_door_no || "";
  this.family_head = family.family_head || "";
  this.family_head_contact = family.family_head_contact || "";
  this.family_head_gender = family.family_head_gender || "";
  this.family_head_in_native = family.family_head_in_native || "";
  this.family_head_name = family.family_head_name || "";
  this.family_head_yob = family.family_head_yob || "";
  this.family_street_id = family.family_street_id || "";
  this.family_unique_id = family.family_unique_id || "";
  this.family_tax_count = family.family_tax_count || "";
  this.family_updated = family.family_updated || Date.now();
};

const homedir = require("os").homedir();
const fileConfig = require("../config/file-config");

const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename:
      homedir + "\\Documents\\sivathai-collections\\" + fileConfig.db_location,
  },
});

Family.create = async (newFamily, result) => {
  try {

    let uniqueExists = [];

    const uniqueId = newFamily.family_unique_id;
    await knex.select('id')
        .from("sivathai_families")
        .where({family_unique_id: uniqueId})
        .then((res) => {
          if(res.length>0){
          uniqueExists = res;
          }
        })
        .catch((err) => {
          result(null, {
            status: "400",
            error: "Data not found.",
            err: err,
          });
          return;
        });

    if(uniqueExists.length!=0){
      result(null, {
        status: "400",
        error: 'Family No is already exists, use other no.'
      });
      return;
    }

    knex
      .insert({
        people_name: newFamily.family_head_name,
        people_yob: newFamily.family_head_yob,
        people_gender: newFamily.family_head_gender,
        people_in_native: newFamily.family_head_in_native,
        people_is_head: "yes",
        people_contact: newFamily.family_head_contact,
        people_updated: newFamily.family_updated,
      })
      .into("sivathai_people")
      .then((peopleHead) => {
        knex
          .insert({
            family_head: peopleHead,
            family_door_no: newFamily.family_door_no,
            family_street_id: newFamily.family_street_id,
            family_comments: newFamily.family_comments,
            family_unique_id: newFamily.family_unique_id,
            family_tax_count: newFamily.family_tax_count,
            family_updated: newFamily.family_updated,
          })
          .into("sivathai_families")
          .then((res) => {
            console.log(res, "id");
            result(null, {
              status: "200",
              family_id: res[0],
              error: "Family added successfully.",
            });
          })
          .catch((err) => {
            result(null, { status: "400", error: "Can not be added." });
          });
      })
      .catch((err) => {
        result(null, { status: "400", error: "Can not be added.", err: err });
      });
  } catch (err) {
    result(null, { status: "400", error: "Can not be added." });
  }
};

Family.findById = (familyId, result) => {
  try {
    knex
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
        result(null, { status: "200", data: res[0] });
      })
      .catch((err) => {
        result(null, { status: "400", error: "Family not found" });
      });
  } catch (e) {
    result(null, { status: "400", error: "Data not found", err: e });
  }
};

Family.getAll = (result) => {
  try {
    knex
      .select(
        knex.raw(
          "sp.people_name AS family_head_name, sp.people_yob as family_head_yob, sp.people_gender as family_head_gender, sp.people_in_native as family_head_in_native, ss.street_name AS family_street_name,sf.*, count(sfc.id) as family_no_of_members"
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
      .groupBy("sf.id")
      .orderBy("sf.id", "desc")
      .then((res) => {
        result(null, {
          status: "200",
          data: res,
        });
      })
      .catch((err) => {
        result(null, {
          status: "400",
          error: "Data not found.",
          err: err,
        });
      });
  } catch (err) {
    result(null, {
      status: "400",
      error: "Data not found",
    });
  }
};

Family.checkUnique = (data, result) => {
  try {
    const uniqueId = data.uniqueId;
    knex
      .select('id')
      .from("sivathai_families")
      .where({family_unique_id: uniqueId})
      .then((res) => {
        result(null, {
          status: "200",
          data: res,
          error: 'Family No is already exists.'
        });
      })
      .catch((err) => {
        result(null, {
          status: "400",
          error: "Data not found.",
          err: err,
        });
      });
  } catch (err) {
    result(null, {
      status: "400",
      error: "Data not found",
    });
  }
};

Family.updateById = (id, newFamily, result) => {
  try {
    knex("sivathai_families")
      .where({ id: id })
      .update({
        family_door_no: newFamily.family_door_no,
        family_street_id: newFamily.family_street_id,
        family_comments: newFamily.family_comments,
        family_updated: newFamily.family_updated,
        family_tax_count: newFamily.family_tax_count,
        family_updated: Date.now(),
      })
      .then((res) => {

        const peopleHead = newFamily.family_head;
        knex("sivathai_people")
        .where({ id: peopleHead })
        .update({
          people_name: newFamily.family_head_name,
          people_yob: newFamily.family_head_yob,
          people_gender: newFamily.family_head_gender,
          people_in_native: newFamily.family_head_in_native,
          people_contact: newFamily.family_head_contact,
          people_updated: Date.now(),
        })
        .then(update=>{
          result(null, { status: "200", data:update,error: "Updated successfully" });
        })
        .catch(err=>{
          result(null, { status: "400", err: err, error: "Can not be updated" });
        })

      })
      .catch((err) => {
        result(null, { status: "400", error: "Can not be updated" });
      });
  } catch (err) {
    result(null, { status: "400", error: "Can not be updated" });
  }
};

Family.remove = (id, result) => {
  try {
    knex("sivathai_families")
      .where({ id: id })
      .del()
      .then((res) => {
        result(null, { status: "200", error: "Family deleted successfully." });
      })
      .catch((err) => {
        result(null, { status: "400", error: "Family can not be deleted." });
      });
  } catch (err) {
    result(null, { status: "400", error: "Family can not be deleted." });
  }
};

Family.familyAllDetails = async (familyId, result) => {
  try {
    let familyInfo = {};
    await knex
        .select(knex.raw("ss.*,sf.*"))
        .from(knex.raw("sivathai_families sf"))
        .leftJoin(knex.raw("sivathai_streets ss"), "ss.id", "sf.family_street_id")
        .where("sf.id", familyId)
        .then((res) => {
          familyInfo.family = res[0];
        })
        .catch((err) => {
          result(null, { status: "400", error: "Family not found" });
        });

        if(!familyInfo.family){
              result(null, { status: "400", error: "Family not found" });
        }

    const peopleHead = familyInfo.family.family_head;
    await knex.select('*').from('sivathai_people').where({id: peopleHead})
        .then(peopleHead=>{
          familyInfo.family_head = peopleHead[0];
        })
        .catch((err)=>{
          familyInfo.family_head = {};
        });

    await knex.select('*').from('sivathai_people').where({people_family_id: familyId}).orderBy('id', 'desc')
        .then(familyMember=>{
          familyInfo.members = [familyInfo.family_head, ...familyMember];
          const year = (new Date()).getFullYear();
          familyInfo.members.map(x=>{
            if(x.people_yob!=''){
              x.people_age = year-x.people_yob;
            }
          });
        });

    result(null, { status: "200", data: familyInfo });


  } catch (e) {
    result(null, { status: "400", error: "Data not found", err: e });
  }
};

module.exports = Family;
