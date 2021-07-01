import firebase from "../../firebase";

const db = firebase.collection("/Orders");

class OrdersDataService {
  getAll() {
    return db;
  }
  
  getPending() {
    return db
    .where("currentState", "==", false)
    .orderBy("date", "desc");
  }
  
  getOpen() {
    return this.getPending()
    .where("openOrder", "==", true);
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

export default new OrdersDataService();