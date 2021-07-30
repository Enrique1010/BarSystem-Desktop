import React from "react";
import { Button, Image, Input, notification, Form } from "antd";
import Layout, { Content, Footer } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import OrderComponent from "../Orders/OrderComponent";
import CustomSidebar from "./CustomSidebar";
import mainLogo from "../../logo.jpeg";
import { Route, Switch, useHistory } from "react-router-dom";
import {
  ROUTE_ADD_ORDER,
  ROUTE_ADD_PRODUCT,
  ROUTE_AUTH,
  ROUTE_INVENTORY,
  ROUTE_LOG_OUT,
  ROUTE_ORDERS,
  ROUTE_ORDERS_DONE,
  ROUTE_REGISTER_USER,
  ROUTE_USERS,
} from "./Routes";
import ProductComponent from "../Products/ProductComponent";
import styled from "styled-components";
import ProductForm from "../Products/ProductForm";
import Store from "../../commonStore";
import OrderList from "../Orders/OrderList";
import UsersComponent from "../Users/UsersComponent";
import OrderForm from "../Orders/OrderForm";
import UsersForm from "../Users/UsersForm";
import { useEffect, useState } from "react/cjs/react.development";
import firebase from "firebase";
import UsersService from "../services/Users.service";

const AppLayout = () => {
  const history = useHistory();
  const [form] = Form.useForm();
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userRolesForbiddenActions, setUserRolesForbiddenActions] = useState(undefined);

  const redirectAuth = () => {
    if (!isSignedIn) {
      history.push(ROUTE_AUTH);
    }
  };

  const logOut = () => {
    firebase.auth().signOut();
    setIsSignedIn(false);
    setCurrentUser(undefined);
    history.push(ROUTE_AUTH);
  };

  useEffect(() => {
    const getOrCreateUser = () => {
      if (!!currentUser) {
        UsersService.getByUID(currentUser.uid).onSnapshot((usr) => {
          if (!!usr && usr.exists) {
            // Recibir el rol
            UsersService.getRole(usr.data().role).onSnapshot((roles) => {
              if (!!roles) {
                const foundRole = roles.docs
                  .find((r) => r.data().role === usr.data().role)
                  .data();
                  console.log('Aparecio ', foundRole);
                setUserRolesForbiddenActions(foundRole.forbidden);
                setIsSignedIn(true);
              }
            });
          }
        });
      }
    };

    getOrCreateUser();
  }, [currentUser]);

  const openRegisterErrorNotification = (message) => {
    notification.error({
      message: `Acceso de Usuario`,
      description: `No se pudo Iniciar sesión con el usuario \n ${message}`,
      placement: "bottomRight",
    });
  };

  const onFinishForm = (values) => {
    if (
      !!values.password &&
      values.password !== "" &&
      !!values.email &&
      values.email !== ""
    ) {
      firebase
        .auth()
        .signInWithEmailAndPassword(values.email, values.password)
        .then((userCredential) => {
          console.log(userCredential);
          setCurrentUser(userCredential.user);
        }).catch((error) => {
          openRegisterErrorNotification(error.message);
        });
      form.resetFields();
    } else {
      openRegisterErrorNotification('');
    }
  };

  return (
    <Store style={{ maxHeight: "100vh" }}>
      <Layout>
        <Sider>
          <Image src={mainLogo} style={{ height: "auto" }} />
          <CustomSidebar isSignedIn={isSignedIn} userRolesForbiddenActions={userRolesForbiddenActions} />
        </Sider>

        {!isSignedIn ? (
          <LoginForm>
            <h1>Iniciar Sesión</h1>
            <Login form={form} onFinishForm={onFinishForm} />
          </LoginForm>
        ) : (
          <Switch>
            {/* ORDERS AND EACH STATUS FILTER */}
            <Route exact path="/">
              {redirectAuth}
              <spam style={{ margin: "30%", alignText: "center" }}>
                <h1>
                  Bienvenido a <b>11:11 Administrativo</b>
                </h1>
                <br />
                Elija una opción para ir a otra pantalla en el menú lateral.
              </spam>
            </Route>
            <Route exact path={ROUTE_ORDERS}>
              {redirectAuth}
              <OrderComponent />
            </Route>
            {/* <Route exact path={ROUTE_ORDERS_OPEN}>
              <OpenOrderComponent />
            </Route> */}
            <Route exact path={ROUTE_ORDERS_DONE}>
              {redirectAuth}
              <OrderList />
            </Route>
            <Route exact path={ROUTE_ADD_ORDER}>
              {redirectAuth}
              <OrderForm />
            </Route>
            {/* OTHERS */}
            <Route exact path={ROUTE_INVENTORY}>
              {redirectAuth}
              <ProductComponent />
            </Route>
            <Route exact path={ROUTE_ADD_PRODUCT}>
              {redirectAuth}
              <ProductForm />
            </Route>
            <Route exact path={ROUTE_USERS}>
              {redirectAuth}
              <UsersComponent />
            </Route>
            <Route exact path={ROUTE_REGISTER_USER}>
              {redirectAuth}
              <UsersForm />
            </Route>
            <Route exact path={ROUTE_LOG_OUT}>
              {logOut}
            </Route>
          </Switch>
        )}
      </Layout>
    </Store>
  );
};

const Login = ({ form, onFinishForm }) => (
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
    <Button
      type="primary"
      htmlType="submit"
      style={{ minWidth: 100, marginRight: 10 }}
    >
      Acceder
    </Button>
  </Form>
);

export const CustomLayout = styled(Layout)`
  max-height: 100vh;
`;

export const CustomContent = styled(Content)`
  margin: 24px 16px 0;
  color: white;
  max-height: 100%;
  overflow: auto;
`;

export const CustomFooter = () => {
  return (
    <Footer>
      <h5>Este es el Footer @ registrado</h5>
    </Footer>
  );
};

export const LoginForm = styled.div`
  width: 100%;
  height: 100vh;
  align-self: CENTER;
  margin: 10px;
  padding: 10px;
`;

export default AppLayout;
