export default class CollectionsModel {
  public id:any;
  public collection_name:string;
  public collection_year:string;
  public collection_amount:string;
  public collection_updated: string;
  public action:string;

  constructor(collections:any = {}){
    this.action=collections.action || '';
    this.id = collections.id || '';
    this.collection_name = collections.collection_name || '';
    this.collection_year = collections.collection_year || '';
    this.collection_amount = collections.collection_amount || '';
    this.collection_updated = collections.collection_updated || '';
  }

}
