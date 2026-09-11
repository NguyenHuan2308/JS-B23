export class Product {
  constructor(id, name, price, img, description, type, deleted) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.img = img;
    this.description = description;
    this.type = type;
    this.deleted = deleted;
  }
}