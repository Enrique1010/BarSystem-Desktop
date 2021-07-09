import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Popconfirm,
  message,
  Button,
  InputNumber,
  PageHeader,
  Table,
} from "antd";
// import Highlighter from 'react-highlight-words';
import Modal from "antd/lib/modal/Modal";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
import { APP_NAME, INVENTORY_NAME } from "../../DefaultProps";
import { CustomContent, CustomLayout } from "../navigation/AppLayout";
import { ROUTE_ADD_PRODUCT } from "../navigation/Routes";
import ProductsDataService from "../services/Products.service";

export const PTable = styled(Table)`
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
export const buildProductObject = (item) => {
  let data = item.data();
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
  const [newSupply, setNewSupply] = useState(0);
  const [modal, contextHolder] = Modal.useModal();
  const [messageHolder, messageContexHolder] = message.useMessage();
  const [searchText] = useState('');
  const [searchedColumn] = useState('');
  const history = useHistory();

  const tableColumns = () => {
    let cols = [
      ...columns,
      {
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

            <Popconfirm
              placement="top"
              title={"¿Desea cancelar esta Orden?"}
              onConfirm={() => onDelete(record.id)}
              okText="Si"
              cancelText="No"
            >
              <Button>
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </>
        ),
      },
    ];
    return cols;
  };

  const AddProductConfig = (e) => {
    console.log(e);
    return {
      title: "Agregando Producto...",
      content: (
        <div>
          <p>Suministro Actual: {e.supply}</p>
          <br />
          <p>Nuevo Suministro: </p>
          <InputNumber
            min={1}
            max={10000}
            defaultValue={0}
            onChange={setNewSupply}
            style={{ marginRight: "10px" }}
          />
          <Button
            onClick={() => updateCurrentElementSupply(e)}
            disabled={!newSupply < 0}
          >
            Agregar
          </Button>
        </div>
      ),
    };
  };

  useEffect(() => {
    ProductsDataService.getAll()
      .orderBy("name", "asc")
      .onSnapshot(onDataChange);
  }, []);

  const onDataChange = (items) => {
    let current = [];

    items.forEach((item) => {
      let val = buildProductObject(item);
      current.push(val);
    });
    setProducts(current);
  };

  const showEditModal = (e) => {
    modal.info(AddProductConfig(e));
  };

  const updateCurrentElementSupply = (e) => {
    let newElement = e;
    newElement["newSupply"] = newSupply;
    newElement["olderSupply"] = newElement.supply;
    newElement["supply"] = newElement.supply + newSupply;
    ProductsDataService.update(newElement.id, newElement);
    showUpdateInfo(newElement.name, newSupply);
    modal.destroy();
  };

  const onEdit = (element) => {
    showEditModal(element);
  };

  const onDelete = (key) => {
    ProductsDataService.delete(key);
  };

  const createProduct = () => {
    history.push(ROUTE_ADD_PRODUCT);
  };

  const showUpdateInfo = (name, supply) => {
    messageHolder.open({
      type: "info",
      content: `Producto: ${name} se agregó un suministro de ${supply}`,
      duration: 3,
    });
  };

  return (
    <CustomLayout>
      <PageHeader
        ghost={false}
        title={APP_NAME}
        subTitle={INVENTORY_NAME}
        extra={[
          <Button key="2">Exportar</Button>,
          <Button key="1" type="primary" onClick={createProduct}>
            Nuevo Producto
          </Button>,
        ]}
      ></PageHeader>
      <CustomContent>
        <PTable dataSource={products} columns={tableColumns()} />
      </CustomContent>
      {contextHolder}
    </CustomLayout>
  );
};

export default ProductComponent;
