import firebase from "../../firebase";

const db = firebase.collection("/Orders");
const db2 = firebase.collection("/StaticUsers");

class OrdersDataService {
  getAll() {
    return db;
  }
  
  getPending() {
    return db
    .where("currentState", "==", false)
    .where("openOrder", "==", false)
    .orderBy("date", "desc");
  }
  
  getAllStaticUsers() {
    return db2;
  }

  getOpen() {
    return  db
    .where("currentState", "==", false)
    .where("openOrder", "==", true);
  }

  create(order) {
    return db.doc(order.id).set(order);
  }

  update(id, value) {
    return db.doc(id).update(value);
  }

  delete(id) {
    return db.doc(id).delete();
  }
}

export default new OrdersDataService();