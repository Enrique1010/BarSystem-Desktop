import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, InputNumber, PageHeader, Table } from "antd";
import Modal from "antd/lib/modal/Modal";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { APP_NAME, INVENTORY_NAME } from "../../DefaultProps";
import { CustomContent, CustomLayout } from "../navigation/AppLayout";
import ProductsDataService from "../services/Products.service";

const ProductTable = styled(Table)`
  padding: 20px;
  margin: 20px;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08);
`;

const columns = [
  {
    title: "Categoría",
    dataIndex: "category",
    key: "category",
  },
  {
    title: "Nombre",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Código de Producto",
    dataIndex: "productCode",
    key: "productCode",
  },
  {
    title: "Precio",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "Fecha de Registro",
    dataIndex: "registrationDate",
    key: "registrationDate",
  },
  {
    title: "Suministro",
    dataIndex: "supply",
    key: "supply",
  },
];

// Build Product Object from firestore collection item
const buildProductObject = (item) => {
  let data = item.data();
  console.log(data);
  return {
    id: item.id,
    name: data.name,
    productCode: data.productCode,
    category: data.category,
    price: data.price,
    supply: data.supply,
    lastAddedSupply: data.lastAddedSupply,
    olderSupply: data.olderSupply,
    quantitySold: data.quantitySold,
    dailySales: data.dailySales,
    registrationDate: data.registrationDate,
    lastRegistrationDate: data.lastRegistrationDate,
  };
};

const ProductComponent = () => {
  const [products, setProducts] = useState([]);
  const [editingElement, setEditingElement] = useState(undefined);
  const [newSupply, setNewSupply] = useState(0);
  const [modal, contextHolder] = Modal.useModal();

  const tableColumns = () => {
    var cols = columns;
    cols.push({
      title: "Acciones",
      dataIndex: "",
      key: "x",
      render: (record) => (
        <>
          <Button
            onClick={() => onEdit(record)}
            style={{ marginRight: "12px" }}
          >
            <EditOutlined />
          </Button>
          <Button onClick={() => onDelete(record.id)}>
            <DeleteOutlined />
          </Button>
        </>
      ),
    });
    return cols;
  };

  const AddProductConfig = () => {
    console.log(editingElement);
    return {
      title: "Agregando Producto...",
      content: (
        <div>
          <p>Suministro Actual: {editingElement.supply}</p>
          <br />
          <p>Nuevo Suministro: </p>
          <InputNumber
            min={1}
            max={10000}
            defaultValue={0}
            onChange={setNewSupply}
            style={{ marginRight: "10px" }}
          />
          <Button onClick={() => updateCurrentElementSupply} disabled={!newSupply < 0}>Agregar</Button>
        </div>
      ),
    };
  };

  useEffect(() => {
    ProductsDataService.getAll()
      .orderBy("name", "asc")
      .onSnapshot(onDataChange);

    // let pr = {
    // name: "Presidente",
    // productCode: "5012",
    // category: "Cerveza",
    // price: 300,
    // supply: 40,
    // lastAddedSupply: 0,
    // olderSupply: 0,
    // quantitySold: 0,
    // dailySales: 0,
    // registrationDate: "4/7/2021",
    // lastRegistrationDate: "4/7/2021",}
    // ProductsDataService.create(pr);
  }, []);

  const onDataChange = (items) => {
    let current = [];

    items.forEach((item) => {
      let val = buildProductObject(item);
      current.push(val);
    });
    setProducts(current);
  };

  const showEditModal = () => {
    modal.info(AddProductConfig());
  };

  const updateCurrentElementSupply = () => {
    let newElement = editingElement;
    newElement["newSupply"] = newSupply;
    newElement["olderSupply"] = newElement.supply;
    newElement["supply"] = newElement.supply + newSupply;
    ProductsDataService.update(newElement.id, newElement);
    modal.destroy();
  };

  const onEdit = (element) => {
    setEditingElement(element);
    showEditModal();
  };

  const onDelete = (key) => {
    ProductsDataService.delete(key);
    console.log("ELIMINAR", key);
  };

  return React.useMemo(() => {
    return (
      <CustomLayout>
        <PageHeader
          ghost={false}
          title={APP_NAME}
          subTitle={INVENTORY_NAME}
          extra={[
            <Button key="2">Exportar</Button>,
            <Button key="1" type="primary">
              Nuevo Producto
            </Button>,
          ]}
        ></PageHeader>
        <CustomContent>
          <ProductTable dataSource={products} columns={tableColumns()} />
        </CustomContent>
        {contextHolder}
      </CustomLayout>
    );
  }, [products, editingElement]);
};

export default ProductComponent;
