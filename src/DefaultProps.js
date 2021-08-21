export const APP_NAME = "Bar System";
export const ORDER_NAME = "Ordenes";
export const OPEN_ORDER_NAME = "Abiertas";
export const ORDER_NAME_DONE = "Completadas";
export const ORDER_LIST = "Lista de Ordenes";
export const INVENTORY_NAME = "Inventario";
export const USERS_NAME = "Usuarios";
export const ADD_PRODUCT_NAME = "Nuevo Producto";

export const LOGIN_EMAIL = "11.11live.drink@admin.com";

const pad = (number) => {
  if (number < 10) {
    return "0" + number;
  }
  return number;
};

export const getLocalDate = () => {
  let date = new Date();
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    " " +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds()) +
    "." +
    (date.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5)
  );
};

export const getLocalDateShort = () => {
  let date = new Date();
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate())
  );
};

