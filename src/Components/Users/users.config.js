// FORBIDDEN
export const USERS_ALL = "USERS_ALL";
export const USERS_READ = "USERS_READ";
export const USERS_WRITE = "USERS_WRITE";
export const USERS_CREATE = "USERS_CREATE";
export const PRODUCTS_READ = "PRODUCTS_READ";
export const PRODUCTS_WRITE = "PRODUCTS_WRITE";
export const PRODUCTS_CREATE = "PRODUCTS_CREATE";
export const PRODUCTS_DELETE = "PRODUCTS_DELETE";

export const ORDERS_ALL = "ORDERS_ALL";
export const ORDERS_READ = "ORDERS_READ";

//  USERS ROLES

// This function extract userRolesForbiddenActions (Array) from currentUser and try matches the requiered (String) action
// if requiered action was found should mean that the function will be disabled or something.
export const findRequiredAction = (userRolesForbiddenActions, required) => {
  if (!!userRolesForbiddenActions && !!required) {
    const found = userRolesForbiddenActions.find((a) => a === required);
    if (!!found) {
      return true;
    }
  }
  return false;
};

// This one has multiple required Actions (Array) and compares it with userRolesForbiddenActions (Array) returning true only if all are valid
export const validateRoleActions = (userRolesForbiddenActions, required) => {
  let found = [];
  required.forEach((req) => {
    if (findRequiredAction(userRolesForbiddenActions, req)) found.push(req);
  });
  return required.length === found.length;
};

export const parseRole = (role) => {
  let newRole = "";
  if (role === "pending") {
    newRole = "Sin asignar";
  }
  else if (role === "admin") {
    newRole = "Administrador";
  }
  else if (role === "waiter") {
    newRole = "Mesero";
  }
  else if (role === "bartender") {
    newRole = "Bartender";
  }

  return newRole;
};
