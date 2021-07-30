import React from "react";
import { Image } from "antd";
import Layout, { Content, Footer } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import OrderComponent from "../Orders/OrderComponent";
import CustomSidebar from "./CustomSidebar";
import mainLogo from "../../logo.jpeg";
import { Route, Switch } from "react-router-dom";
import {
  ROUTE_ADD_ORDER,
  ROUTE_ADD_PRODUCT,
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

const AppLayout = () => {

  return (
    <Store style={{ maxHeight: "100vh" }}>
      <Layout>
        <Sider>
          <Image src={mainLogo} style={{ height: "auto" }} />
          <CustomSidebar />
        </Sider>
        <Switch>
          {/* ORDERS AND EACH STATUS FILTER */}
          <Route exact path="/">
            <spam style={{ margin: "30%", alignText: "center" }}>
              <h1>
                Bienvenido a <b>11:11 Administrativo</b>
              </h1>
              <br />
              Elija una opción para ir a otra pantalla en el menú lateral.
            </spam>
          </Route>
          <Route exact path={ROUTE_ORDERS}>
            <OrderComponent />
          </Route>
          {/* <Route exact path={ROUTE_ORDERS_OPEN}>
              <OpenOrderComponent />
            </Route> */}
          <Route exact path={ROUTE_ORDERS_DONE}>
            <OrderList />
          </Route>
          <Route exact path={ROUTE_ADD_ORDER}>
            <OrderForm />
          </Route>
          {/* OTHERS */}
          <Route exact path={ROUTE_INVENTORY}>
            <ProductComponent />
          </Route>
          <Route exact path={ROUTE_ADD_PRODUCT}>
            <ProductForm />
          </Route>
          <Route exact path={ROUTE_USERS}>
            <UsersComponent />
          </Route>
          <Route exact path={ROUTE_REGISTER_USER}>
            <UsersForm />
          </Route>
          <Route exact path={ROUTE_LOG_OUT}>
            {/* {logOut} */}
          </Route>
        </Switch>
      </Layout>
    </Store>
  );
};

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
