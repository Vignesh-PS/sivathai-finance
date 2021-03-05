export default class ListStreetsModel {
  public web_id:any;
  public user_name:string;
  public user_password: string;
  public user_cpassword: string;
  public listStreets_status: any;
  public action: string;
  public type: string;

  constructor(listStreets:any = {}){
    this.action=listStreets.action || '';
    this.web_id = listStreets.web_id || '';
    this.user_name = listStreets.user_name || '';
    this.user_password = listStreets.user_password || '';
    this.user_cpassword = listStreets.user_cpassword || '';
    this.listStreets_status = listStreets.listStreets_status || '';
    this.type = listStreets.type || '';

  }

}
