import React, { useEffect, useState } from "react";
import { Input, PageHeader } from "antd";
import { CustomContent, CustomLayout } from "../navigation/AppLayout";
import { ORDER_LIST, APP_NAME } from "../../DefaultProps";
import OrdersDataService from "../services/Orders.service";
import { buildOrderObjectWithProductFormatted } from "./OrderComponent";
import { PTable } from "../Products/ProductComponent";

const columns = [
  {
    title: "No. Orden",
    dataIndex: "orderNumber",
    key: "orderNumber",
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
  const [nameFilter, setNameFilter] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  useEffect(() => {
    OrdersDataService.getAll().onSnapshot(onDataChange);
  }, []);

  const FilterByNameInput = (
    <Input
      placeholder="Filtrar por Número de Orden"
      value={nameFilter}
      onChange={(e) => {
        const filter = e.target.value;
        setNameFilter(filter);
        if (filter.trim() !== "") {
          const filteredData = orders.filter((ord) =>
            ord.orderNumber.toLowerCase().includes(filter.toLocaleLowerCase())
          );
          setFilteredOrders(filteredData);
        } else {
          setFilteredOrders(undefined);
        }
      }}
    />
  );

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
        {FilterByNameInput}
        <PTable
          dataSource={
            !!filteredOrders && filteredOrders.length > 0
              ? filteredOrders
              : orders
          }
          columns={columns}
        />
      </CustomContent>
    </CustomLayout>
  );
};

export default OrderList;
