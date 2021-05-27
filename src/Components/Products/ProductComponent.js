import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, PageHeader, Table } from "antd";
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

const AddOrderConfig = {
  title: "Modificando Producto...",
  content: <>Aqui hay que modificar la cantidad del producto :)</>,
};

const columns = (onEdit, onDelete) => {
 return [
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
      title: "Cantidad",
      dataIndex: "supply",
      key: "supply",
    },
    {
      title: "Acciones",
      dataIndex: "",
      key: "x",
      render: () => (
        <>
          <Button onClick={onEdit} style={{ marginRight: "12px" }}>
            <EditOutlined />
          </Button>
          <Button onClick={onDelete}>
            <DeleteOutlined />
          </Button>
        </>
      ),
    },
  ];
};

// Build Product Object from firestore collection item
const buildProductObject = (item) => {
  let data = item.data();
  console.log(data);
  return {
    id: item.id,
    name: data.name,
    category: data.category,
    price: data.price,
    supply: data.supply,
    newSupply: data.newSupply,
    olderSupply: data.olderSupply,
    quantitySold: data.quantitySold,
    dailySales: data.dailySales,
    registrationDate: data.registrationDate,
    lastRegistrationDate: data.lastRegistrationDate,
  };
};

const ProductComponent = () => {
  const [products, setProducts] = useState([]);

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

  const onEdit = () => {
    console.log("EDITAR");
  }

  const onDelete = () => {
    console.log("ELIMINAR");
  }

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
          <ProductTable dataSource={products} columns={columns(onEdit, onDelete)} />
        </CustomContent>
      </CustomLayout>
    );
  }, [products]);
};

export default ProductComponent;
