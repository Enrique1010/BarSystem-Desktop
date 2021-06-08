import React from "react";
import { Image } from "antd";
import Layout, { Content, Footer } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import OrderComponent from "../Orders/OrderComponent";
import CustomSidebar from "./CustomSidebar";
import mainLogo from "../../logo.jpg";
import { Route, Switch } from "react-router-dom";
import {
  ROUTE_ADD_PRODUCT,
  ROUTE_INVENTORY,
  ROUTE_ORDERS,
  ROUTE_ORDERS_ACTIVE,
  ROUTE_ORDERS_DONE,
  ROUTE_ORDERS_PENDING,
} from "./Routes";
import ProductComponent from "../Products/ProductComponent";
import styled from "styled-components";
import ProductForm from "../Products/ProductForm";
import Store from "../../commonStore";

const AppLayout = () => {
  return (
    <Store>
      <Layout>
        <Sider>
          <Image
            src={mainLogo}
            style={{ height: "64px", padding: "12px", marginBottom: "32px" }}
          />
          <CustomSidebar />
        </Sider>
        <Switch>
          {/* ORDERS AND EACH STATUS FILTER */}
          <Route exact path="/">
            <OrderComponent />
          </Route>
          <Route exact path={ROUTE_ORDERS}>
            <OrderComponent filtered={"all"} />
          </Route>
          <Route exact path={ROUTE_ORDERS_ACTIVE}>
            <OrderComponent filtered={"active"} />
          </Route>
          <Route exact path={ROUTE_ORDERS_PENDING}>
            <OrderComponent filtered={"pending"} />
          </Route>
          <Route exact path={ROUTE_ORDERS_DONE}>
            <OrderComponent filtered={"done"} />
          </Route>
          {/* OTHERS */}
          <Route exact path={ROUTE_INVENTORY}>
            <ProductComponent />
          </Route>
          <Route exact path={ROUTE_ADD_PRODUCT}>
            <ProductForm />
          </Route>
        </Switch>
      </Layout>
    </Store>
  );
};

export const CustomLayout = styled(Layout)``;

export const CustomContent = styled(Content)`
  margin: 24px 16px 0;
  color: white;
`;

export const CustomFooter = () => {
  return (
    <Footer>
      <h5>Este es el Footer @ registrado</h5>
    </Footer>
  );
};

export default AppLayout;
