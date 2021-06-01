import firebase from "../../firebase";

const db = firebase.collection("/Products");

class ProductsDataService {
  getAll() {
    return db;
  }

  create(order) {
    return db.add(order);
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
    id: values.id,
    name: values.name,
    productCode: values.productCode,
    category: values.category,
    price: values.price,
    supply: values.supply,
    lastAddedSupply: values.lastAddedSupply,
    olderSupply: values.olderSupply,
    quantitySold: values.quantitySold,
    dailySales: values.dailySales,
    registrationDate: values.registrationDate,
    lastRegistrationDate: values.lastRegistrationDate,
  };
}
export default new ProductsDataService();