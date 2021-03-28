export default class CollectionStreetsModel {
  public id: any;
  public collectionId: number;
  public tax_amount: number;
  public family_head_name: string;
  public detail_id: number;
  public detail_contributed: number;
  public detail_is_cleared: number;
  public family_id: number;
  public family_unique_id: number|string;
  public family_head: string;
  public family_tax_count: number;
  public members_count: number;
  public action: string;

  constructor(collectionStreets: any = {}) {
    this.action = collectionStreets.action || '';
    this.id = collectionStreets.id || '';
    this.collectionId = collectionStreets.collectionId || '';
    this.tax_amount = collectionStreets.tax_amount || '';
    this.family_head_name = collectionStreets.family_head_name || '';
    this.detail_id = collectionStreets.detail_id || '';
    this.detail_contributed = collectionStreets.detail_contributed || '';
    this.detail_is_cleared = collectionStreets.detail_is_cleared || '';
    this.id = collectionStreets.id || '';
    this.family_id = collectionStreets.family_id || '';
    this.family_unique_id = collectionStreets.family_unique_id || '';
    this.family_head = collectionStreets.family_head || '';
    this.family_tax_count = collectionStreets.family_tax_count || '';
    this.members_count = collectionStreets.members_count || '';

  }

}
