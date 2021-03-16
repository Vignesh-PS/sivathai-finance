export default class StreetsModel {
  public id:any;
  public street_name:string;
  public street_updated: string;
  public action:string;

  constructor(streets:any = {}){
    this.action=streets.action || '';
    this.id = streets.id || '';
    this.street_name = streets.street_name || '';
    this.street_updated = streets.street_updated || '';
  }

}
