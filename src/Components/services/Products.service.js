import firebase from "../../firebase";

const db = firebase.collection("/Products");

class ProductsDataService {
  getAll() {
    return db;
  }

  create(product) {
    return db.doc(product.productCode).set(product);
  }

  update(id, value) {
    return db.doc(id).update(value);
  }

  delete(id) {
    return db.doc(id).delete();
  }
}

export const buildProduct = values => {
  return {
    productCode: values.productCode,
    name: values.name,
    category: values.category,
    price: values.price,
    supply: values.supply,
    olderSupply: values.olderSupply,
    quantitySold: values.quantitySold,
    registrationDate: values.registrationDate,
  };
}
export default new ProductsDataService();