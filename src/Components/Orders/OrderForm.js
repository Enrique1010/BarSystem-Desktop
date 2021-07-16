import React, { useEffect, useState } from "react";
import {
  notification,
  Button,
  Form,
  InputNumber,
  PageHeader,
  Divider,
  Select,
  Switch,
} from "antd";
import { CustomContent, CustomLayout } from "../navigation/AppLayout";
import { ADD_PRODUCT_NAME, APP_NAME } from "../../DefaultProps";
import { useHistory } from "react-router";
import { ROUTE_ORDERS } from "../navigation/Routes";
import OrdersService from "../services/Orders.service";
import ProductsService from "../services/Products.service";
import { buildProductObject } from "../Products/ProductComponent";
import { Option } from "antd/lib/mentions";
import { buildOrderWithoutDataObject } from "./OrderComponent";
import UsersService from "../services/Users.service";

const OrderForm = () => {
  const history = useHistory();
  const [form] = Form.useForm();
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orderProducts, setOrderProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(undefined);
  const [amount, setAmount] = useState(undefined);

  useEffect(() => {
    ProductsService.getAll().onSnapshot(onDataChange);
    UsersService.getAll().onSnapshot(onDataUsersChange);
  }, []);

  const onDataChange = (items) => {
    let current = [];

    items.forEach((item) => {
      let val = buildProductObject(item);
      current.push(val);
    });
    setProducts(current);
  };

  const onDataUsersChange = (items) => {
    let current = [];
    items.forEach((item) => {
      let data = item.data();
      let val = {
        name: data.userName,
        uid: data.uid,
        id: data.id,
      };
      current.push(val);
    });
    setUsers(current);
  };

  const onFinishForm = (values) => {
    let dateInstance = new Date();
    let date = new Date().toLocaleString([], { hour12: true });
    let waiter = users.find((x) => x.uid === values.uid);
    let randomNumber = Math.round(Math.random() * (999 - 10) + 10);
    values["date"] = date;
    values["products"] = orderProducts;
    values["products"] = orderProducts;
    values["openOrder"] = false;
    values["currentState"] = false;
    values["orderNumber"] =
      dateInstance.getDay() +
      "" +
      dateInstance.getMonth() +
      "" +
      dateInstance.getFullYear() +
      "" +
      randomNumber;
    values["id"] = values.orderNumber;
    values["waiterName"] = waiter.name;
    values["ice"] = !!values.ice ? values.ice : false;
    values["cups"] = !!values.cups ? values.cups : false;
    values["clientName"] = "Cliente" + values.orderNumber;
    let newOrder = buildOrderWithoutDataObject(values);
    OrdersService.create(newOrder);
    openNotification(newOrder.name);
    resetFields();
  };

  const addProductOrder = () => {
    if (!!selectedProduct && !!amount) {
      let prd = products.find((x) => x.productCode === selectedProduct);
      let smallProd = {
        amount: amount,
        category: prd.category,
        name: prd.name,
        price: prd.price,
        ready: true,
        supply: prd.supply,
      };
      let newPrds = orderProducts;
      newPrds.push(smallProd);
      setOrderProducts(newPrds);
      setSelectedProduct(undefined);
      setAmount(undefined);
      openProductNotification(smallProd.name);
    }
  };

  const openNotification = (name) => {
    notification.success({
      message: `Orden Agregada`,
      description: `Orden: ${name} se agregó correctamente`,
      placement: "bottomRight",
    });
  };

  const openProductNotification = (name) => {
    notification.success({
      message: `Producto Agregado`,
      description: `Producto: ${name} agregado a la orden`,
      placement: "bottomRight",
    });
  };

  const openProductsAddedNotification = () => {
    notification.info({
      message: `Producto Agregados:`,
      description: `${orderProducts.forEach((prod) => (
        <spam>
          <h5>
            {prod.name} ${prod.price} x{prod.amount}
          </h5>
          <br />
        </spam>
      ))}`,
      placement: "bottomRight",
    });
  };

  const openNotProductsAddedNotification = () => {
    notification.warning({
      message: `Producto Agregados:`,
      description: `No hay productos agregados`,
      placement: "bottomRight",
    });
  };

  const showAddedProducts = () => {
    if (!!orderProducts && orderProducts.length > 0) {
      openProductsAddedNotification();
    } else {
      openNotProductsAddedNotification();
    }
  };

  const backToOrders = () => {
    history.push(ROUTE_ORDERS);
  };

  const resetFields = () => {
    form.resetFields();
    setOrderProducts([]);
    setSelectedProduct(undefined);
    setAmount(undefined);
  };

  return (
    <CustomLayout>
      <PageHeader
        ghost={false}
        title={APP_NAME}
        subTitle={ADD_PRODUCT_NAME}
        extra={[
          <Button key="1" type="secondary" onClick={backToOrders}>
            Volver a Ordenes
          </Button>,
        ]}
      ></PageHeader>
      <CustomContent>
        <Form
          form={form}
          layout="vertical"
          style={{ maxWidth: "500px", textAlign: "start" }}
          name="addOrderForm"
          onFinish={onFinishForm}
        >
          {/* <Form.Item
            name="clientName"
            label="Cliente"
            rules={[
              {
                required: true,
                message: "Debe Introducir el nombre del cliente.",
              },
            ]}
          >
            <Input />
          </Form.Item>
           */}

          <Form.Item name="uid" label="Usuario">
            <Select
              showSearch
              placeholder="Seleccione su Usuario"
              optionFilterProp="children"
            >
              {users.map((p, i) => (
                <Option key={i} value={p.uid}>
                  {p.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="table"
            label="Número de Mesa"
            rules={[
              {
                required: true,
                message: "Introduzca el número de mesa.",
              },
            ]}
          >
            <InputNumber min={0} style={{ minWidth: 150 }} />
          </Form.Item>

          <Form.Item name="cups" label="Vasos">
            <Switch />
          </Form.Item>

          <Form.Item name="ice" label="Hielo">
            <Switch />
          </Form.Item>

          <Divider />
          <Button
            type="secondary"
            onClick={showAddedProducts}
            style={{ minWidth: 100, marginRight: 10 }}
          >
            Ver Productos Agregados
          </Button>
          <br />

          <Form.Item name="selectedProduct" label="Productos">
            <Select
              showSearch
              onChange={setSelectedProduct}
              placeholder="Seleccione un Producto"
              optionFilterProp="children"
            >
              {products.map((p, i) => (
                <Option key={i} value={p.productCode}>
                  {p.name} - ${p.price}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {/* Agregar el boton, que agregue a la listya y luego que vaya a estblecer el modelo */}

          <Form.Item name="productAmount" label="Cantidad">
            <InputNumber
              onChange={setAmount}
              min={0}
              style={{ minWidth: 150 }}
            />
          </Form.Item>

          <Button
            type="secondary"
            onClick={addProductOrder}
            style={{ minWidth: 100, marginRight: 10 }}
          >
            Agregar Producto
          </Button>

          <Divider />
          <Button
            type="primary"
            htmlType="submit"
            style={{ minWidth: 100, marginRight: 10 }}
          >
            Crear
          </Button>
          <Button style={{ minWidth: 100 }} onClick={resetFields}>
            Limpiar
          </Button>
        </Form>
      </CustomContent>
    </CustomLayout>
  );
};

export default OrderForm;