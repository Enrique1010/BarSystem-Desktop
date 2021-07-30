import React from "react";
import {
  PieChartOutlined,
  UserSwitchOutlined,
  TagsOutlined,
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
  ROUTE_USERS,
} from "./Routes";
import {
  INVENTORY_NAME,
  ORDER_NAME,
  ORDER_NAME_DONE,
  USERS_NAME,
} from "../../DefaultProps";

const CustomSidebar = () => {
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
    <StyledMenu
      defaultOpenKeys={[getCurrentPathKey]}
      mode="inline"
      theme="dark"
    >
      <Menu.Item
        key="1"
        icon={<TagsOutlined />}
        onClick={() => handleClick(ROUTE_ORDERS)}
      >
        {ORDER_NAME}
      </Menu.Item>
      {/* <Menu.Item
            key="2"
            icon={<TagsFilled />}
            onClick={() => handleClick(ROUTE_ORDERS_OPEN)}
            disabled={validateRoleActions(userForbiddenActions, [ORDERS_ALL, PRODUCTS_WRITE])}
          >
            {OPEN_ORDER_NAME}
          </Menu.Item> */}
      <Menu.Item
        key="3"
        icon={<TagsTwoTone />}
        onClick={() => handleClick(ROUTE_ORDERS_DONE)}
      >
        {ORDER_NAME_DONE}
      </Menu.Item>
      <Menu.Item
        key="4"
        icon={<PieChartOutlined />}
        onClick={() => handleClick(ROUTE_INVENTORY)}
      >
        {INVENTORY_NAME}
      </Menu.Item>
      <Menu.Item
        key="5"
        icon={<UserSwitchOutlined />}
        onClick={() => handleClick(ROUTE_USERS)}
      >
        {USERS_NAME}
      </Menu.Item>
      {/* <Menu.Item
        key="6"
        icon={<CloseOutlined />}
        onClick={() => handleClick(ROUTE_LOG_OUT)}
      >
        Cerrar Sesión
      </Menu.Item> */}
    </StyledMenu>
  );
};

const StyledMenu = styled(Menu)`
  min-width: 156px;
  height: 100vh;
  font-weight: 600;
`;

export default CustomSidebar;
