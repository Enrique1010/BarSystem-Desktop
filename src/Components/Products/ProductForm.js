import React from "react";
import { Button, Form, Input, PageHeader } from "antd";
import { CustomContent, CustomLayout } from "../navigation/AppLayout";
import { ADD_PRODUCT_NAME, APP_NAME } from "../../DefaultProps";
import { useHistory } from "react-router";
import { ROUTE_INVENTORY } from "../navigation/Routes";
import ProductDataService from "../services/Products.service";

const ProductForm = () => {
  const history = useHistory();

  const onFinishForm = (values) => {
    // console.log(values);
    ProductDataService.create(values);
  };

  const backToIntenvory = () => {
    history.push(ROUTE_INVENTORY);
  }

  return (
    <CustomLayout>
      <PageHeader
        ghost={false}
        title={APP_NAME}
        subTitle={ADD_PRODUCT_NAME}
        extra={[
          <Button key="1" type="secondary" onClick={backToIntenvory}>
            Volver a Inventario
          </Button>,
        ]}
      ></PageHeader>
      <CustomContent>
        <Form layout="vertical" style={{maxWidth: '500px', alignContent: 'left'}} name="addProductForm" onFinish={onFinishForm}>
          {/* Add actua */}
        <Form.Item
            name="code"
            label="Código"
            rules={[
              {
                required: true,
                message: "Debe Introducir un Código para el nuevo producto.",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="Nombre"
            rules={[
              {
                required: true,
                message: "Introduzca el Nombre del nuevo producto.",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="category"
            label="Categoría"
            rules={[
              {
                required: true,
                message: "Introduzca la Categoría del producto.",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Precio"
            rules={[
              { required: true, message: "Introduzca el Precio del producto." },
            ]}
          >
            <Input type="transaction-amount" />
          </Form.Item>
          <Button type="primary" htmlType="submit">Crear</Button>
        </Form>
      </CustomContent>
    </CustomLayout>
  );
};

export default ProductForm;
