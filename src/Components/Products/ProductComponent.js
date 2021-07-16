import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Popconfirm,
  Button,
  InputNumber,
  PageHeader,
  Table,
  Input,
  message,
} from "antd";
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
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [newSupply, setNewSupply] = useState(0);
  const [newProduct, setNewProduct] = useState(undefined);
  const [visible, setVisible] = useState(false);
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

  const FilterByNameInput = (
    <Input
      placeholder="Filtrar por Nombre"
      value={nameFilter}
      onChange={(e) => {
        const filter = e.target.value;
        setNameFilter(filter);
        if (filter.trim() !== "") {
          const filteredData = products.filter((prd) =>
            prd.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
          );
          setFilteredProducts(filteredData);
        } else {
          setFilteredProducts(undefined);
        }
      }}
    />
  );

  useEffect(() => {
    ProductsDataService.getAll()
      .orderBy("name", "asc")
      .onSnapshot(onDataChange);
  }, []);

  useEffect(() => {}, [newSupply]);

  const onDataChange = (items) => {
    let current = [];

    items.forEach((item) => {
      let val = buildProductObject(item);
      current.push(val);
    });
    setProducts(current);
  };

  const showEditModal = (e) => {
    setVisible(true);
  };

  const updateCurrentElementSupply = () => {
    if (!!newProduct) {
      var newElement = newProduct;
      newElement.newSupply = newSupply;
      newElement.olderSupply = newElement.supply;
      newElement.supply = newElement.supply + newSupply;
      ProductsDataService.update(newElement.id, newElement);
      showUpdateInfo(newElement.name, newSupply);
      setVisible(false);
      setNewProduct(undefined);
    } else {
      message.error("Error editando el producto: Intente nuevamente");
    }
  };

  const onEdit = (element) => {
    setNewProduct(element);
    showEditModal(element);
  };

  const onDelete = (key) => {
    ProductsDataService.delete(key);
  };

  const createProduct = () => {
    history.push(ROUTE_ADD_PRODUCT);
  };

  const showUpdateInfo = (name, supply) => {
    message.info(`Producto: ${name} se agregó un suministro de ${supply}`);
  };

  return (
    <CustomLayout>
      <PageHeader
        ghost={false}
        title={APP_NAME}
        subTitle={INVENTORY_NAME}
        extra={[
          // <Button key="2">Exportar</Button>,
          <Button key="1" type="primary" onClick={createProduct}>
            Nuevo Producto
          </Button>,
        ]}
      ></PageHeader>
      <CustomContent>
        {FilterByNameInput}
        <PTable
          dataSource={
            !!filteredProducts && filteredProducts.length > 0
              ? filteredProducts
              : products
          }
          columns={tableColumns()}
        />
        <Modal
          title="Agregando Producto..."
          centered
          visible={visible}
          cancelText="Cerrar"
          onOk={() => setVisible(false)}
          onCancel={() => setVisible(false)}
        >
          <div>
            <p>Suministro Actual: {!!newProduct ? newProduct.supply : 0}</p>
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
              onClick={updateCurrentElementSupply}
              disabled={!newSupply < 0}
            >
              Agregar
            </Button>
          </div>
        </Modal>
      </CustomContent>
    </CustomLayout>
  );
};

export default ProductComponent;
