import React, { useEffect, useState } from "react";
import { Image } from "antd";
import Layout, { Content, Footer } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import OrderComponent from "../Orders/OrderComponent";
import CustomSidebar from "./CustomSidebar";
import mainLogo from "../../logo.jpeg";
import { Route, Switch, useHistory } from "react-router-dom";
import {
  ROUTE_ADD_PRODUCT,
  ROUTE_AUTH,
  ROUTE_INVENTORY,
  ROUTE_LOG_OUT,
  ROUTE_ORDERS,
  ROUTE_ORDERS_DONE,
  ROUTE_ORDERS_OPEN,
  ROUTE_USERS,
} from "./Routes";
import ProductComponent from "../Products/ProductComponent";
import styled from "styled-components";
import ProductForm from "../Products/ProductForm";
import Store from "../../commonStore";
import OrderList from "../Orders/OrderList";
import OpenOrderComponent from "../Orders/OpenOrderComponent";
import firebase from "firebase";
import { StyledFirebaseAuth } from "react-firebaseui";
import UsersService from "../services/Users.service";
import UsersComponent from "../Users/UsersComponent";

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: "/",
  // We will display Google and Facebook as auth providers.
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
};

const AppLayout = () => {
  const history = useHistory();
  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.
  const [currentUser, setCurrentUser] = useState(undefined);
  const [userRolesForbiddenActions, setUserRolesForbiddenActions] = useState(
    []
  );

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((user) => {
        setIsSignedIn(!!user);
        setCurrentUser(!!user ? user : undefined);
      });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

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
                setUserRolesForbiddenActions(foundRole.forbidden);
              }
            });
          } else {
            // Crear usuario y asignar rol
            let date = new Date().toLocaleString([], { hour12: true });
            const newUser = createUser(
              currentUser.email,
              currentUser.displayName,
              "pending",
              currentUser.uid,
              date
            );
            if (!!currentUser.uid) {
              UsersService.create(newUser);
              setUserRolesForbiddenActions([]);
            }
          }
        });
      }
    };

    getOrCreateUser();
  }, [currentUser]);

  const redirectAuth = () => {
    if (!isSignedIn) {
      history.push(ROUTE_AUTH);
    }
  };

  const redirectOrders = () => {
    history.push(ROUTE_ORDERS);
  };

  const logOut = () => {
    firebase.auth().signOut();
    history.push(ROUTE_AUTH);
  };

  return (
    <Store style={{ maxHeight: "100vh" }}>
      <Layout>
        <Sider>
          <Image
            src={mainLogo}
            style={{ height: "auto" }}
          />
          <CustomSidebar
            isSignedIn={isSignedIn}
            userForbiddenActions={userRolesForbiddenActions}
          />
        </Sider>
        {!isSignedIn ? (
          <LoginForm>
            <h1>Iniciar Sesión</h1>
            <br />
            <StyledFirebaseAuth
              uiConfig={uiConfig}
              firebaseAuth={firebase.auth()}
            />
          </LoginForm>
        ) : (
          <Switch>
            {/* ORDERS AND EACH STATUS FILTER */}
            <Route exact path="/">
              {redirectAuth}
              {redirectOrders}
            </Route>
            <Route exact path={ROUTE_ORDERS}>
              {redirectAuth}
              <OrderComponent />
            </Route>
            <Route exact path={ROUTE_ORDERS_OPEN}>
              {redirectAuth}
              <OpenOrderComponent />
            </Route>
            <Route exact path={ROUTE_ORDERS_DONE}>
              {redirectAuth}
              <OrderList />
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
            <Route exact path={ROUTE_LOG_OUT}>
              {logOut}
            </Route>
          </Switch>
        )}
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

const createUser = (email, name, role, uid, date) => {
  return {
    email: email,
    userName: name,
    role: role,
    uid: uid,
    date: date,
  };
};

export default AppLayout;
