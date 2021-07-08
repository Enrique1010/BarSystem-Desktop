import React, { useState, useEffect } from "react";
import {
  Popconfirm,
  Alert,
  Button,
  Card,
  Collapse,
  message,
  PageHeader,
} from "antd";
import { APP_NAME, ORDER_NAME } from "../../DefaultProps";
import { CustomContent, CustomLayout } from "../navigation/AppLayout";
import styled from "styled-components";
import OrdersDataService from "../services/Orders.service";
import Text from "antd/lib/typography/Text";
import Invoice, { InvoiceElement, RawInvoiceStyle } from "../invoice/Invoice";
import ProductsDataService from "../services/Products.service";
import { buildProductObject } from "../Products/ProductComponent";

const DONE_STATE = true;
const PENDING_STATE = false;

const { Panel } = Collapse;

export const OrderCardWrapper = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

export const OrderCard = styled(Card)`
  width: auto;
  height: min-content;
  min-width: 300px;
  margin: 20px;
  background: rgb(245, 245, 245);
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08);
  flex: 1 0 500px;
  box-sizing: border-box;
  margin: 1rem 0.25em;
  @media screen and (min-width: 40em) {
    .card {
      max-width: calc(50% - 1em);
    }
  }

  @media screen and (min-width: 60em) {
    .card {
      max-width: calc(25% - 1em);
    }
  }
`;

export const openFrame = (afterPrint) => {
  var divContents = document.getElementById("OrderInvoice").innerHTML;
  console.log("ORDER INVOICE:", divContents);
  var a = window.open("", "", "height=300, width=500");
  a.document.write("<html>");
  a.document.write(`<body style="${RawInvoiceStyle}">`);
  a.document.write(divContents);
  a.document.write("</body></html>");
  a.document.close();
  a.print();
  afterPrint();
};

export const orderTitle = (number, name) => (
  <span>
    <span>Orden: {number}</span>
    <br />
    <span>Nombre del cliente: {name}</span>
  </span>
);

export const SplitterWrapper = styled.div`
  display: grid;
  grid-template-columns: auto auto;
`;

export const OrderElementsWrapper = styled.div`
  text-align: left;
  justify-content: space-evenly;
`;

export const StateAlert = styled(Alert)`
  width: 170px;
  margin-bottom: 12px;
`;

const OrderComponent = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [invoiceOrder, setInvoiceOrder] = useState(undefined);

  useEffect(() => {
    // Retrieve Orders data from firebase colletion
    OrdersDataService.getPending().onSnapshot(onDataChange);
    ProductsDataService.getAll().onSnapshot(onProductChange);
  }, []);

  useEffect(() => {
    handlePrint(afterPrint);
  }, [invoiceOrder]);

  const afterPrint = () => {
    // Remove the invoice order after printing
    // then will remove the invoice from screen
    setInvoiceOrder(undefined);
  };

  const totalPrice = (order) => {
    let total = 0.0;
    if (!!order.products)
      order.products.forEach((prod) => {
        total += prod.price * prod.amount;
      });
    return total;
  };

  const onDataChange = (items) => {
    if (!!items) {
      let currentOrders = [];

      items.forEach((item) => {
        // Parse to Order
        let val = buildOrderObject(item);
        currentOrders.push(val);
      });
      setOrders(currentOrders);
    }
  };

  const onProductChange = (items) => {
    if (!!items) {
      let currentProd = [];

      items.forEach((item) => {
        let val = buildProductObject(item);
        currentProd.push(val);
      });
      setProducts(currentProd);
    }
  };

  const updateOrder = async (order) => {
    OrdersDataService.update(order.id, order);
  };

  const cancelOrder = async (order) => {
    OrdersDataService.delete(order.id);
  };

  const nextState = (order) => {
    if (order.currentState === PENDING_STATE) {
      order.currentState = DONE_STATE;
      message.success("Pedido Completado");
      calculateOrder(order);
      updateOrder(order);
      setInvoiceOrder(order);
    }
  };

  const calculateOrder = (order) => {
    order.products.map((prod, index) => {
      let newProd = products.find((x) => x.productCode == prod.productCode);
      newProd["supply"] = newProd.supply - prod.amount;
      newProd["quantitySold"] = newProd.quantitySold + prod.amount;
      ProductsDataService.update(newProd.id, newProd);
    });
  };

  const handlePrint = (afterPrint) => {
    if (!!invoiceOrder) openFrame(afterPrint);
  };

  return (
    <CustomLayout>
      <PageHeader
        ghost={false}
        title={APP_NAME}
        subTitle={ORDER_NAME}
      ></PageHeader>
      <CustomContent>
        <OrderCardWrapper>
          {orders.map((order, index) => (
            <OrderCard
              key={order.id}
              title={orderTitle(order.orderNumber, order.clientName)}
            >
              <SplitterWrapper>
                <OrderElementsWrapper style={{ marginRight: "20px" }}>
                  <p>Mesa: {order.table}</p>
                  <p>Fecha: {order.date}</p>
                  <p>
                    <Text type="success">Hielo: {order.ice ? "Si" : "No"}</Text>{" "}
                    <br />
                    <Text type="success">
                      Vasos: {order.cups ? "Si" : "No"}
                    </Text>
                    <br />
                    <Text type="success">Mesero: {order.waiterName}</Text>
                  </p>
                </OrderElementsWrapper>
                <OrderElementsWrapper>
                  {order.currentState ? (
                    <StateAlert message="Completado" type="success" showIcon />
                  ) : (
                    <>
                      <StateAlert message="Pendiente" type="warning" showIcon />

                      <Popconfirm
                        placement="top"
                        title={"¿Desea cancelar esta Orden?"}
                        onConfirm={() => cancelOrder(order)}
                        okText="Si"
                        cancelText="No"
                      >
                        <Button type="danger">Cancelar</Button>
                      </Popconfirm>
                      <Button
                        style={{ margin: "0px 8px" }}
                        type="primary"
                        onClick={() => nextState(order)}
                      >
                        Completar
                      </Button>
                    </>
                  )}
                </OrderElementsWrapper>
              </SplitterWrapper>
              <Collapse defaultActiveKey={["0"]}>
                <Panel header="Pedidos" key="1">
                  {order.products.map((prod, index) => (
                    <p>
                      <Text>
                        {index + 1}- {prod.name}{" "}
                      </Text>
                      <Text type="success">${prod.price}</Text>
                      <Text> x{prod.amount}</Text>
                    </p>
                  ))}
                </Panel>
              </Collapse>
            </OrderCard>
          ))}

          <iframe
            id="ifmcontentstoprint"
            style={{ height: 0, width: 0, position: "absolute" }}
          />
          <button
            id={"invoice" + 1}
            value={1}
            className="btn btn-info"
            style={{
              color: "black",
              marginTop: "1%",
              marginBottom: "1%",
              marginLeft: "1%",
              marginRight: "1%",
              textAlign: "right",
            }}
            onClick={handlePrint}
          >
            order Generate Invoice
          </button>
        </OrderCardWrapper>
      </CustomContent>
      {!!invoiceOrder ? (
        <Invoice
          order={invoiceOrder}
          products={InvoiceElement(invoiceOrder)}
          total={totalPrice(invoiceOrder)}
        />
      ) : (
        <></>
      )}
    </CustomLayout>
  );
};

// Build Order Object from firestore collection item
export const buildOrderObject = (item) => {
  let data = item.data();
  return {
    id: item.id,
    orderNumber: data.orderNumber,
    openOrder: data.openOrder,
    clientName: data.clientName,
    currentState: data.currentState,
    date: data.date,
    products: data.products,
    table: data.table,
    cups: data.cups,
    ice: data.ice,
    uid: data.uid,
    waiterName: data.waiterName,
  };
};

export const buildOrderObjectWithProductFormatted = (item) => {
  let data = item.data();
  let newDate = new Date(data.date).toLocaleDateString();
  return {
    id: item.id,
    orderNumber: data.orderNumber,
    openOrder: data.openOrder,
    clientName: data.clientName,
    currentState: data.currentState,
    date: newDate,
    products: data.products.length,
    table: data.table,
    cups: data.cups,
    ice: data.ice,
    uid: data.uid,
    waiterName: data.waiterName,
  };
};

export default OrderComponent;
