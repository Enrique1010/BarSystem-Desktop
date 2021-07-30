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
    productCode: data.productCode,
    name: data.name,
    category: data.category,
    price: data.price,
    supply: data.supply,
    olderSupply: data.olderSupply,
    quantitySold: data.quantitySold,
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
  const [newName, setNewName] = useState(undefined);
  const [price, setPrice] = useState(undefined);
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
              onConfirm={() => onDelete(record.productCode)}
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

  const showEditModal = () => {
    setVisible(true);
  };

  const updateCurrentElementSupply = () => {
    if (!!newProduct) {
      console.log(newProduct, " aSD ", price, newName);
      var newElement = newProduct;
      if (!!newSupply) {
        newElement.newSupply = newSupply;
        newElement.olderSupply = newElement.supply;
        newElement.supply = newElement.supply + newSupply;
      }
      if (!!newName) newElement.name = newName;
      if (!!price) newElement.price = price;
      ProductsDataService.update(newElement.productCode, newElement);
      showUpdateInfo(newElement.name);
      setVisible(false);
      setPrice(undefined);
      setNewName(undefined);
      setNewProduct(undefined);
    } else {
      message.error("Error editando el producto: Intente nuevamente");
    }
  };

  const onEdit = (element) => {
    setNewProduct(element);
    showEditModal();
  };

  const onDelete = (key) => {
    ProductsDataService.delete(key);
  };

  const createProduct = () => {
    history.push(ROUTE_ADD_PRODUCT);
  };

  const showUpdateInfo = (name) => {
    message.info(`Producto: ${name} ha sido actualizado`);
  };

  const putName = (name) => {
    setNewName(name.target.value);
  };

  const closeModal = () => {
    setNewName(undefined);
    setPrice(undefined);
    setVisible(false);
  };

  return (
    <CustomLayout>
      <PageHeader
        ghost={false}
        title={APP_NAME}
        subTitle={INVENTORY_NAME}
        extra={[
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
          onOk={closeModal}
          onCancel={closeModal}
        >
          <div>
            <p>Suministro Actual: {!!newProduct ? newProduct.supply : 0}</p>

            <br />
            {!!newProduct ? (
              <>
                <p>Nuevo Nombre: </p>
                <Input
                  defaultValue={newProduct.name}
                  onChange={putName}
                  style={{ marginRight: "10px" }}
                />
                <br />
                <p>Nuevo Precio: </p>
                <InputNumber
                  min={1}
                  max={999999}
                  defaultValue={newProduct.price}
                  onChange={setPrice}
                  style={{ marginRight: "10px" }}
                />
                <br />
              </>
            ) : (
              <></>
            )}
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
              disabled={!newSupply < 0 && !!newName && !!price}
            >
              Actualizar
            </Button>
          </div>
        </Modal>
      </CustomContent>
    </CustomLayout>
  );
};

export default ProductComponent;
