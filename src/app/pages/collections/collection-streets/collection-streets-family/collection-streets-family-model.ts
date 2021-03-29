export default class CollectionstreetfamilysModel {
  public id:any;
  public collectionstreetfamily_name:string;
  public collectionstreetfamily_updated: string;
  public action:string;

  constructor(collectionstreetfamilys:any = {}){
    this.action=collectionstreetfamilys.action || '';
    this.id = collectionstreetfamilys.id || '';
    this.collectionstreetfamily_name = collectionstreetfamilys.collectionstreetfamily_name || '';
    this.collectionstreetfamily_updated = collectionstreetfamilys.collectionstreetfamily_updated || '';
  }

}
