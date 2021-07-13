import React from "react";
import {
  PieChartOutlined,
  UserSwitchOutlined,
  CloseOutlined,
  TagsOutlined,
  TagsFilled,
  TagsTwoTone,
} from "@ant-design/icons";
import { Menu } from "antd";
import styled from "styled-components";
import { useHistory, useLocation } from "react-router-dom";
import {
  ROUTE_ORDERS,
  ROUTE_INVENTORY,
  ROUTE_ORDERS_DONE,
  ROUTE_ORDERS_OPEN,
  ROUTE_LOG_OUT,
  ROUTE_USERS,
} from "./Routes";
import {
  INVENTORY_NAME,
  OPEN_ORDER_NAME,
  ORDER_NAME,
  ORDER_NAME_DONE,
  USERS_NAME,
} from "../../DefaultProps";
import {
  findRequiredAction,
  ORDERS_ALL,
  ORDERS_READ,
  PRODUCTS_READ,
  PRODUCTS_WRITE,
  USERS_ALL,
  validateRoleActions,
} from "../Users/users.config";

const CustomSidebar = ({ isSignedIn, userForbiddenActions }) => {
  const history = useHistory();
  const location = useLocation();

  const handleClick = (path) => {
    history.push(path);
  };

  const getCurrentPathKey = () => {
    if (location.pathname === ROUTE_ORDERS) return 1;
    else if (location.pathname === ROUTE_ORDERS_OPEN) return 2;
    else if (location.pathname === ROUTE_ORDERS_DONE) return 3;
    else if (location.pathname === ROUTE_INVENTORY) return 4;
    else if (location.pathname === ROUTE_ORDERS_OPEN) return 5;
    else if (location.pathname === ROUTE_USERS) return 6;
  };
  return (
    <StyledMenu defaultOpenKeys={[getCurrentPathKey]} mode="inline" theme="dark">
      {isSignedIn ? (
        <>
          <Menu.Item
            key="1"
            icon={<TagsOutlined />}
            onClick={() => handleClick(ROUTE_ORDERS)}
            disabled={validateRoleActions(userForbiddenActions, [ORDERS_ALL, PRODUCTS_WRITE])}
          >
            {ORDER_NAME}
          </Menu.Item>
          <Menu.Item
            key="2"
            icon={<TagsFilled />}
            onClick={() => handleClick(ROUTE_ORDERS_OPEN)}
            disabled={validateRoleActions(userForbiddenActions, [ORDERS_ALL, PRODUCTS_WRITE])}
          >
            {OPEN_ORDER_NAME}
          </Menu.Item>
          <Menu.Item
            key="3"
            icon={<TagsTwoTone />}
            onClick={() => handleClick(ROUTE_ORDERS_DONE)}
            disabled={
              findRequiredAction(userForbiddenActions, ORDERS_ALL) ||
              findRequiredAction(userForbiddenActions, ORDERS_READ)
            }
          >
            {ORDER_NAME_DONE}
          </Menu.Item>
          <Menu.Item
            key="4"
            icon={<PieChartOutlined />}
            onClick={() => handleClick(ROUTE_INVENTORY)}
            disabled={
              findRequiredAction(userForbiddenActions, PRODUCTS_READ) ||
              findRequiredAction(userForbiddenActions, PRODUCTS_WRITE)
            }
          >
            {INVENTORY_NAME}
          </Menu.Item>
          <Menu.Item
            key="5"
            icon={<UserSwitchOutlined />}
            onClick={() => handleClick(ROUTE_USERS)}
            disabled={findRequiredAction(userForbiddenActions, USERS_ALL)}
          >
            {USERS_NAME}
          </Menu.Item>
          <Menu.Item
            key="6"
            icon={<CloseOutlined />}
            onClick={() => handleClick(ROUTE_LOG_OUT)}
          >
            Salir
          </Menu.Item>{" "}
        </>
      ) : (
        <></>
      )}
    </StyledMenu>
  );
};

const StyledMenu = styled(Menu)`
  min-width: 156px;
  height: 100vh;
  font-weight: 600;
`;

export default CustomSidebar;
