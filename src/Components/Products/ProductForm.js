import React from "react";
import {
  notification,
  Button,
  Form,
  Input,
  InputNumber,
  PageHeader,
} from "antd";
import { CustomContent, CustomLayout } from "../navigation/AppLayout";
import { ADD_PRODUCT_NAME, APP_NAME } from "../../DefaultProps";
import { useHistory } from "react-router";
import { ROUTE_INVENTORY } from "../navigation/Routes";
import ProductDataService from "../services/Products.service";

const ProductForm = () => {
  const history = useHistory();
  const [form] = Form.useForm();

  const onFinishForm = (values) => {
    let date = new Date().toLocaleString([], { hour12: true});;
    values["registrationDate"] = date;
    values["lastRegistrationDate"] = date;
    values["dailySales"] = 0;
    values["lastAddedSupply"] = 0;
    values["newSupply"] = 0;
    values["olderSupply"] = 0;
    values["quantitySold"] = 0;
    ProductDataService.create(values);
    openNotification(values.name);
    form.resetFields();
  };

  const openNotification = (name) => {
    notification.success({
      message: `Producto Agregado`,
      description: `Producto: ${name} se agregó correctamente`,
      placement:'bottomRight',
    });
  };

  const backToIntenvory = () => {
    history.push(ROUTE_INVENTORY);
  };

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
        <Form
          form={form}
          layout="vertical"
          style={{ maxWidth: "500px", textAlign: "start" }}
          name="addProductForm"
          onFinish={onFinishForm}
        >
          {/* Add actua */}
          <Form.Item
            name="productCode"
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
            <InputNumber
              defaultValue={0}
              min={0}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              style={{ minWidth: 150 }}
            />
          </Form.Item>
          <Form.Item
            name="supply"
            label="Cantidad"
            rules={[
              {
                required: true,
                message: "Introduzca cuantos de este producto tiene.",
              },
            ]}
          >
            <InputNumber min={0} style={{ minWidth: 150 }} />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ minWidth: 100, marginRight: 10 }}
          >
            Crear
          </Button>
          <Button
            style={{ minWidth: 100 }}
            onClick={() => {
              form.resetFields();
            }}
          >
            Limpiar
          </Button>
        </Form>
      </CustomContent>
    </CustomLayout>
  );
};

export default ProductForm;
