import React from "react";
import {
  notification,
  Button,
  Form,
  Input,
  PageHeader,
} from "antd";
import { CustomContent, CustomLayout } from "../navigation/AppLayout";
import { ADD_PRODUCT_NAME, APP_NAME, getLocalDate } from "../../DefaultProps";
import { useHistory } from "react-router-dom";
import { ROUTE_INVENTORY } from "../navigation/Routes";
import firebase from "firebase";
import UsersService from "../services/Users.service";

const UsersForm = () => {
  const history = useHistory();
  const [form] = Form.useForm();

  const RegisterUser = (email, password, userName) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        let date = getLocalDate();
        const newUser = createUser(
          user.email,
          userName,
          "pending",
          user.uid,
          date
        );
        UsersService.create(newUser).then(() => {});
        openNotification(userName);
        // user.updateProfile({
        //   displayName: userName,
        // }).then(() => {console.log("why?? e.e");});
        // firebase.auth().signOut().then(() => {console.log("SALLIIIII!!")});
      })
      .catch((error) => {
        openRegisterErrorNotification(error.message);
      });
  };

  const onFinishForm = (values) => {
    if (values.password === values.confirmPassword) {
      form.resetFields();
      RegisterUser(values.email, values.password, values.userName);
    } else {
      openPasswordErrorNotification();
    }
  };

  const openNotification = (name) => {
    notification.success({
      message: `Registro de Usuario`,
      description: `Usuario: ${name} se registró correctamente`,
      placement: "bottomRight",
    });
  };

  const openRegisterErrorNotification = (message) => {
    notification.error({
      message: `Registro de Usuario`,
      description: `No se pudo Registrar el Usuario \n${message}`,
      placement: "bottomRight",
    });
  };

  const openPasswordErrorNotification = () => {
    notification.error({
      message: `Registro de Usuario`,
      description: `Las contraseñas deben ser iguales`,
      placement: "bottomRight",
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
          {/* Email */}
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Inserte su Correo electrónico!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          {/* Contraseña */}
          <Form.Item
            name="password"
            label="Contraseña"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Inserte su contraseña!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          {/* Confirmar Contraseña */}
          <Form.Item
            name="confirmPassword"
            label="Confirmar Contraseña"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Confirme su contraseña!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          {/* Nombre de Usuario */}
          <Form.Item
            name="userName"
            label="Nombre de Usuario"
            rules={[
              {
                required: true,
                message: "Inserte el Nombre del Usuario!",
                whitespace: true,
              },
            ]}
          >
            <Input />
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

const createUser = (email, name, role, uid, date) => {
  return {
    email: email,
    userName: name,
    role: role,
    uid: uid,
    date: date,
  };
};

export default UsersForm;
