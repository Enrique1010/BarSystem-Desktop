import React from "react";
import { Button, Form, Input, PageHeader } from "antd";
import { CustomContent, CustomLayout } from "../navigation/AppLayout";
import { ADD_PRODUCT_NAME, APP_NAME } from "../../DefaultProps";

const ProductForm = () => {
  return (
    <CustomLayout>
      <PageHeader
        ghost={false}
        title={APP_NAME}
        subTitle={ADD_PRODUCT_NAME}
        extra={[
          <Button key="1" type="primary">
            Crear
          </Button>,
        ]}
      ></PageHeader>
      <CustomContent>
        <Form layout="vertical">
          <Form.Item
            name="name"
            label="Nombre"
            rules={[
              {
                required: true,
                message: "Introduzca el Nombre del nuevo Producto!",
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
                message: "Introduzca la Categoría del producto!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Precio"
            rules={[
              { required: true, message: "Introduzca el Precio del producto!" },
            ]}
          >
            <Input type="transaction-amount" />
          </Form.Item>
        </Form>
      </CustomContent>
    </CustomLayout>
  );
};

export default ProductForm;
