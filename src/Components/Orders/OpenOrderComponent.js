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
import { CheckCircleOutlined, CheckCircleTwoTone } from "@ant-design/icons";
import { APP_NAME, ORDER_NAME } from "../../DefaultProps";
import { CustomContent, CustomLayout } from "../navigation/AppLayout";
import styled from "styled-components";
import {
  OrderCard,
  OrderCardWrapper,
  openFrame,
  buildOrderObject,
  orderTitle,
} from "./OrderComponent";
import OrdersDataService from "../services/Orders.service";
import Text from "antd/lib/typography/Text";

const DONE_STATE = true;
const PENDING_STATE = false;

const { Panel } = Collapse;

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

const OpenOrderComponent = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Retrieve Orders data from firebase colletion
    OrdersDataService.getOpen().onSnapshot(onDataChange);
  }, []);

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
      updateOrder(order);
    }
  };

  const completeProduct = async (order, productIndex) => {
    let prod = order.products[productIndex];
    if (!!prod) {
      prod["ready"] = true;
      order.products[productIndex] = prod;
      updateOrder(order);
    } else {
      message.error("No se pudo completar el pedido");
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
            <OrderCard
              key={order.id}
              title={orderTitle(order.orderNumber, order.clientName)}
            >
              <SplitterWrapper>
              <OrderElementsWrapper style={{ marginRight: "20px" }}>
                  <p>Mesa: {order.table}</p>
                  <p>Fecha: {order.date}</p>
                  <p>
                    <Text type="success">Hielo: {order.ice ? 'Si' : 'No'}</Text> <br/>
                    <Text type="success">Vasos: {order.cups ? 'Si' : 'No'}</Text> <br/>
                    <Text type="success">Mesero: {order.waiterName}</Text>
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
              <Collapse defaultActiveKey={["1"]}>
                <Panel header="Pedidos" key="1">
                  {order.products.map((prod, index) => (
                    <p>
                      <Text>
                        {index + 1}- {prod.name}{" "}
                      </Text>
                      <Text type="success">${prod.price}</Text>
                      <Text> x{prod.amount} </Text>
                      {prod.ready ? (
                        <CheckCircleTwoTone twoToneColor="#52c41a" />
                      ) : (
                        <Button onClick={() => completeProduct(order, index)}>
                          <CheckCircleOutlined />
                        </Button>
                      )}
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
            onClick={() => openFrame()}
          >
            Generate Invoice
          </button>
        </OrderCardWrapper>
      </CustomContent>
    </CustomLayout>
  );
};

export default OpenOrderComponent;
