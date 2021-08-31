import firebase from "../../firebase";

// Production
const db = firebase.collection("/Orders");
// Develop
// const db = firebase.collection("/Orders_Test");

class OrdersDataService {
  getAll() {
    return db;
  }
  
  getPending() {
    return db
    .where("currentState", "==", false)
    .where("openOrder", "==", false)
    .orderBy("date", "asc");
  }

  // Fetch all Completed Orders
  getAllCompleted() {
    return db
    .where("currentState", "==", true);
  }
  
  // Fetch all Completed Orders by date
  getAllCompletedByDate(date) {
    return db
    .where("currentState", "==", true)
    .orderBy("date").startAt(date);
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