export default class OldcollectionsModel {
  public id:any;
  public old_collection_name:string;
  public old_collection_year:string;
  public old_collection_amount:string;
  public old_collection_updated: string;
  public action:string;

  constructor(old_collections:any = {}){
    this.action=old_collections.action || '';
    this.id = old_collections.id || '';
    this.old_collection_name = old_collections.old_collection_name || '';
    this.old_collection_year = old_collections.old_collection_year || '';
    this.old_collection_amount = old_collections.old_collection_amount || '';
    this.old_collection_updated = old_collections.old_collection_updated || '';
  }

}
