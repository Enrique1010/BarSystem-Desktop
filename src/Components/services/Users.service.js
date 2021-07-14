import firebase from "../../firebase";

const db = firebase.collection("/Users");
const rolesCollection = firebase.collection("/Roles");

class UsersService {
  getAll() {
    return db;
  }

  getAllRoles() {
    return rolesCollection;
  }

  getByUID(id) {
    return db.doc(id);
  }

  getRole(role) {
    return rolesCollection.where("role", "==", role);
  }

  create(user) {
    return db.doc(user.uid).set(user);
  }

  update(id, value) {
    return db.doc(id).update(value);
  }

  updateRole(id, value) {
    return rolesCollection.doc(id).update(value);
  }

  delete(id) {
    return db.doc(id).delete();
  }
}

export default new UsersService();
