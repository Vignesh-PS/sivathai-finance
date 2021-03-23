export default class CollectionStreetsModel {
  public id:any;
  public collectionstreet_name:string;
  public collectionstreet_updated: string;
  public action:string;

  constructor(collectionstreets:any = {}){
    this.action=collectionstreets.action || '';
    this.id = collectionstreets.id || '';
    this.collectionstreet_name = collectionstreets.collectionstreet_name || '';
    this.collectionstreet_updated = collectionstreets.collectionstreet_updated || '';
  }

}
