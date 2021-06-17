import React, { useEffect, useState } from "react";
import { PageHeader } from "antd";
import { CustomContent, CustomLayout } from "../navigation/AppLayout";
import { ORDER_LIST, APP_NAME } from "../../DefaultProps";
import OrdersDataService from "../services/Orders.service";
import { buildOrderObjectWithProductFormatted } from "./OrderComponent";
import { PTable } from "../Products/ProductComponent";

const columns = [
  {
    title: "Cliente",
    dataIndex: "clientName",
    key: "clientName",
  },
  {
    title: "Fecha",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Productos",
    dataIndex: "products",
    key: "products",
  },
  {
    title: "Mesero",
    dataIndex: "waiterName",
    key: "waiterName",
  },
];

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    OrdersDataService.getAll()
      .where("currentState", "==", true)
      .onSnapshot(onDataChange);
  }, []);

  const onDataChange = (items) => {
    let current = [];

    items.forEach((item) => {
      let val = buildOrderObjectWithProductFormatted(item);
      current.push(val);
    });
    setOrders(current);
  };

  return (
    <CustomLayout>
      <PageHeader
        ghost={false}
        title={APP_NAME}
        subTitle={ORDER_LIST}
      ></PageHeader>
      <CustomContent>
        <PTable dataSource={orders} columns={columns} />
      </CustomContent>
    </CustomLayout>
  );
};

export default OrderList;
