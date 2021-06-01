import React, { useState, useEffect } from "react";
import { Alert, Button, Card, Collapse, message, PageHeader } from "antd";
import { APP_NAME, ORDER_NAME } from "../../DefaultProps";
import { CustomContent, CustomLayout } from "../navigation/AppLayout";
import styled from "styled-components";
import OrdersDataService from "../services/Orders.service";

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

// Build Order Object from firestore collection item
const buildOrderObject = (item) => {
  let data = item.data();
  console.log("DATA->:", data);
  return {
    id: item.id,
    amount: data.amount,
    clientName: data.clientName,
    currentState: data.currentState,
    date: data.date,
    products: data.products,
    table: data.table,
  };
};
const OrderComponent = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Retrieve Orders data from firebase colletion
    OrdersDataService.getAll().orderBy("date", "desc").onSnapshot(onDataChange);
  }, []);

  const onDataChange = (items) => {
    console.log(items);
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
        extra={[
          <Button key="1" type="primary">
            Nueva Orden
          </Button>,
        ]}
      ></PageHeader>
      <CustomContent>
        <OrderCardWrapper>
          {orders.map((order, index) => (
            <OrderCard
              key={order.id}
              title={"Orden de: " + order.clientName}
            >
              <SplitterWrapper>
                <OrderElementsWrapper style={{ marginRight: "20px" }}>
                  <p>Cantidad: {order.amount}</p>
                  <p>Mesa: {order.table}</p>
                  <p>Fecha: {order.date}</p>
                </OrderElementsWrapper>
                <OrderElementsWrapper>
                  {order.currentState ? (
                    <StateAlert message="Completado" type="success" showIcon />
                  ) : (
                    <>
                      <StateAlert message="Pendiente" type="warning" showIcon />
                      {/* Required functionality */}
                      <Button type="danger" onClick={console.log(":D")}>
                        Cancelar
                      </Button>
                      <Button style={{margin: "0px 8px"}} type="primary" onClick={() => nextState(order)}>
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
                      {index}: {prod}
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

export default OrderComponent;
