export default class PeopleModel {
  public id: number;
  public action: string;
  public people_name: string;
  public people_yob: string;
  public people_gender: string;
  public people_in_native: string;
  public people_other_address: string;
  public people_is_head: string;
  public people_contact: string;
  public people_family_id: string | number;
  public people_comments: string;
  public people_updated: string;


  constructor(families: any = {}) {
    this.id = families.id || '';
    this.action = families.action || '';
    this.people_name = families.people_name || '';
    this.people_yob = families.people_yob || '';
    this.people_gender = families.people_gender || '';
    this.people_in_native = families.people_in_native || '';
    this.people_other_address = families.people_other_address || '';
    this.people_is_head = families.people_is_head || '';
    this.people_contact = families.people_contact || '';
    this.people_family_id = families.people_family_id || '';
    this.people_comments = families.people_comments || '';
    this.people_updated = families.people_updated || '';

  }

}
