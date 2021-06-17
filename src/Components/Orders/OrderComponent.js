import React, { useState, useEffect } from "react";
import { Popconfirm, Alert, Button, Card, Collapse, message, PageHeader } from "antd";
import { APP_NAME, ORDER_NAME } from "../../DefaultProps";
import { CustomContent, CustomLayout } from "../navigation/AppLayout";
import styled from "styled-components";
import OrdersDataService from "../services/Orders.service";
import Text from "antd/lib/typography/Text";

const DONE_STATE = true;
const PENDING_STATE = false;

const { Panel } = Collapse;

const OrderCardWrapper = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const OrderCard = styled(Card)`
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

const SplitterWrapper = styled.div`
  display: grid;
  grid-template-columns: auto auto;
`;

const OrderElementsWrapper = styled.div`
  text-align: left;
  justify-content: space-evenly;
`;

const StateAlert = styled(Alert)`
  width: 170px;
  margin-bottom: 12px;
`;

const OrderComponent = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Retrieve Orders data from firebase colletion
    OrdersDataService.getAll().orderBy("date", "desc").onSnapshot(onDataChange);
  }, []);

  const onDataChange = (items) => {
    let currentOrders = [];

    items.forEach((item) => {
      // Parse to Order
      let val = buildOrderObject(item);
      currentOrders.push(val);
    });
    console.log(currentOrders);
    setOrders(currentOrders);
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
      // setOrders([...orders, order]);
      updateOrder(order);
    }
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
            <OrderCard key={order.id} title={"Orden de: " + order.clientName}>
              <SplitterWrapper>
                <OrderElementsWrapper style={{ marginRight: "20px" }}>
                  <p>Cantidad: {order.amount}</p>
                  <p>Mesa: {order.table}</p>
                  <p>Fecha: {order.date}</p>
                  <p>
                    <Text type="success">U: {order.waiterName}</Text>
                  </p>
                </OrderElementsWrapper>
                <OrderElementsWrapper>
                  {order.currentState ? (
                    <StateAlert message="Completado" type="success" showIcon />
                  ) : (
                    <>
                      <StateAlert message="Pendiente" type="warning" showIcon />
                      {/* Required functionality */}

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
        </OrderCardWrapper>
      </CustomContent>
    </CustomLayout>
  );
};

// Build Order Object from firestore collection item
export const buildOrderObject = (item) => {
  let data = item.data();
  return {
    id: item.id,
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
