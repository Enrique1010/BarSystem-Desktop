import React, { useState, useEffect } from "react";
import { Popconfirm, Alert, Button, Collapse, message, PageHeader } from "antd";
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
  totalPrice,
  displayDate,
} from "./OrderComponent";
import Invoice, { InvoiceElement } from "../invoice/Invoice";
import OrdersDataService from "../services/Orders.service";
import Text from "antd/lib/typography/Text";
import ProductsDataService from "../services/Products.service";
import { buildProductObject } from "../Products/ProductComponent";

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
  const [products, setProducts] = useState([]);
  const [invoiceOrder, setInvoiceOrder] = useState(undefined);

  useEffect(() => {
    // Retrieve Orders data from firebase colletion
    OrdersDataService.getOpen().onSnapshot(onDataChange);
    ProductsDataService.getAll().onSnapshot(onProductChange);
  }, []);

  useEffect(() => {
    const handlePrint = () => {
      if (!!invoiceOrder) {
        openFrame();
        afterPrint();
      }
    };

    handlePrint();
  }, [invoiceOrder]);

  const afterPrint = () => {
    // Remove the invoice order after printing
    // then will remove the invoice from screen
    setInvoiceOrder(undefined);
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

  const calculateOrder = (order) => {
    order.products.forEach((prod) => {
      let newProd = products.find((x) => x.productCode === prod.productCode);
      newProd["supply"] = newProd.supply - prod.amount;
      newProd["quantitySold"] = newProd.quantitySold + prod.amount;
      ProductsDataService.update(newProd.id, newProd);
    });
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
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              title={order.orderNumber}
            >
              <SplitterWrapper>
                <OrderElementsWrapper style={{ marginRight: "20px" }}>
                  <p>Mesa: {order.table}</p>
                  <p>Fecha: {displayDate(order.date)}</p>
                  <p>
                    <Text type="success">Hielo: {order.ice ? "Si" : "No"}</Text>{" "}
                    <br />
                    <Text type="success">
                      Vasos: {order.cups ? "Si" : "No"}
                    </Text>{" "}
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

export default OpenOrderComponent;
