export class Item {
  constructor(
    public barcode: number,
    public name: string,
    public ExpiryDate: string,
    public quantity: number,
    public cost: number,
    public locationBarcode: number,
    public location: string,
    public supplier: string

    ){}
}
