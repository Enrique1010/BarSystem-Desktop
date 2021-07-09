import React, { useEffect, useState } from "react";
import { Image } from "antd";
import Layout, { Content, Footer } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import OrderComponent from "../Orders/OrderComponent";
import CustomSidebar from "./CustomSidebar";
import mainLogo from "../../logo.jpg";
import { Route, Switch, useHistory } from "react-router-dom";
import {
  ROUTE_ADD_PRODUCT,
  ROUTE_AUTH,
  ROUTE_INVENTORY,
  ROUTE_LOG_OUT,
  ROUTE_ORDERS,
  ROUTE_ORDERS_DONE,
  ROUTE_ORDERS_OPEN,
} from "./Routes";
import ProductComponent from "../Products/ProductComponent";
import styled from "styled-components";
import ProductForm from "../Products/ProductForm";
import Store from "../../commonStore";
import OrderList from "../Orders/OrderList";
import OpenOrderComponent from "../Orders/OpenOrderComponent";
import firebase from "firebase";
import { StyledFirebaseAuth } from "react-firebaseui";

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: "/",
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
};

const AppLayout = () => {
  const history = useHistory();
  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((user) => {
        setIsSignedIn(!!user);
      });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  const redirectAuth = () => {
    history.push(ROUTE_AUTH);
  };

  const logOut = () => {
    firebase.auth().signOut();
    history.push(ROUTE_AUTH);
  };

  return (
    <Store>
      <Layout>
        <Sider>
          <Image
            src={mainLogo}
            style={{ height: "64px", padding: "12px", marginBottom: "32px" }}
          />
          {isSignedIn ? <CustomSidebar /> : <></>}
        </Sider>
        {!isSignedIn ? (
          <div margin="30px">
            <h1>Iniciar Sesión</h1>
            <br />
            <StyledFirebaseAuth
              uiConfig={uiConfig}
              firebaseAuth={firebase.auth()}
            />
          </div>
        ) : (
          <Switch>
            {/* ORDERS AND EACH STATUS FILTER */}
            <Route exact path="/">
              {redirectAuth}
            </Route>
            <Route exact path={ROUTE_ORDERS}>
              <OrderComponent />
            </Route>
            <Route exact path={ROUTE_ORDERS_OPEN}>
              <OpenOrderComponent />
            </Route>
            <Route exact path={ROUTE_ORDERS_DONE}>
              <OrderList />
            </Route>
            {/* OTHERS */}
            <Route exact path={ROUTE_INVENTORY}>
              <ProductComponent />
            </Route>
            <Route exact path={ROUTE_ADD_PRODUCT}>
              <ProductForm />
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
