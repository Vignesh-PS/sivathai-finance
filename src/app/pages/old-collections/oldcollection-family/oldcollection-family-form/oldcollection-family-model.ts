export default class OldcollectionFamilyModel {
  public id: any;
  public old_collection_count: number;
  public old_collection_ids: string;
  public old_detail_family_id: string;
  public old_detail_street_id: number;
  public people_name: string;
  public street_name: string;
  public family_unique_id: number;
  public old_collection_names: string;
  public action: string;

  constructor(oldcollectionFamily: any = {}) {
    this.action = oldcollectionFamily.action || '';
    this.id = oldcollectionFamily.id || '';
    this.old_collection_count = oldcollectionFamily.old_collection_count || '';
    this.old_collection_ids = oldcollectionFamily.old_collection_ids || '';
    this.old_detail_family_id = oldcollectionFamily.old_detail_family_id || '';
    this.old_detail_street_id = oldcollectionFamily.old_detail_street_id || '';
    this.people_name = oldcollectionFamily.people_name || '';
    this.street_name = oldcollectionFamily.street_name || '';
    this.family_unique_id = oldcollectionFamily.family_unique_id || '';
    this.old_collection_names = oldcollectionFamily.old_collection_names || '';
  }

}
