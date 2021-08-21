import React, { useEffect, useState } from "react";
import { Input, PageHeader } from "antd";
import { CustomContent, CustomLayout } from "../navigation/AppLayout";
import { ORDER_LIST, APP_NAME, getLocalDate, getLocalDateShort } from "../../DefaultProps";
import OrdersDataService from "../services/Orders.service";
import { buildOrderObject, displayDate } from "./OrderComponent";
import { PTable } from "../Products/ProductComponent";
import Text from "antd/lib/typography/Text";

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
    return: (v) => displayDate(v),
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
  const [dailyOrders, setDailyOrders] = useState(0);

  useEffect(() => {
    OrdersDataService.getAll().onSnapshot(onDataChange);
    OrdersDataService.getAllCompleted(getLocalDateShort()).onSnapshot((items) => {
      console.log("itemss:", items.size);
      setDailyOrders(items.size);
    });
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
      let val = buildOrderObject(item);
      val.products = (
        <p>
          {val.products.map((prod, index) => (
            <>
              <Text>
                {index + 1}- {prod.name} ${prod.price}x{prod.amount}
              </Text>
              <br />
            </>
          ))}
        </p>
      );
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
        {!!dailyOrders > 0 ? (<h1>Ordenes de Hoy: {dailyOrders}</h1>) : (<></>)}
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
