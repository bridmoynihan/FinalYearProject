export class Item {
  constructor(
  public itemBarcode: string,
  public itemName: string,
  public expiryDate: Date,
  public isEditable?: false,
  public location?: string,
  public locationBarcode?: string,
  public vendor?: string,
  public quantity?: string,
  public qntType?: string,
  public cost?: string,
  public quality?: string,
  public reorder?: number,
  public needsReorder?: boolean

    ){}
}
