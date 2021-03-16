export default class FamiliesModel {
  public id: number;
  public action: string;
  public family_head_name: string;
  public family_street_name: string;
  public family_head: number;
  public family_door_no: string;
  public family_street_id: number;
  public family_comments: string;
  public family_updated: any;
  public family_no_of_members : number;

  constructor(families:any = {}){
    this.id = families.id || '';
    this.action=families.action || '';
    this.family_head_name = families.family_head_name || '';
    this.family_street_name = families.family_street_name || '';
    this.family_head = families.family_head || '';
    this.family_door_no = families.family_door_no || '';
    this.family_street_id = families.family_street_id || '';
    this.family_comments = families.family_comments || '';
    this.family_updated = families.family_updated || '';
    this.family_no_of_members = families.family_no_of_members || '';
  }

}
