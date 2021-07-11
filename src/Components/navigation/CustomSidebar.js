import React from "react";
import {
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { ROUTE_ORDERS, ROUTE_INVENTORY, ROUTE_ORDERS_DONE, ROUTE_ORDERS_OPEN, ROUTE_LOG_OUT } from "./Routes";
import { INVENTORY_NAME, OPEN_ORDER_NAME, ORDER_NAME, ORDER_NAME_DONE } from "../../DefaultProps";
import { findRequiredAction, ORDERS_ALL, validateRoleActions } from "../Users/users.config";

const CustomSidebar = ({ isSignedIn, userForbiddenActions }) => {
  const history = useHistory();

  const handleClick = (path) => {
    history.push(path);
  };

  console.log('ACT', userForbiddenActions);

  return (
    <StyledMenu
      defaultOpenKeys={["sub1"]}
      mode="inline"
      theme="dark"
      // inlineCollapsed={collapsed}
    >
      <Menu.Item
        key="1"
        icon={<PieChartOutlined />}
        onClick={() => handleClick(ROUTE_ORDERS)}
        disabled={findRequiredAction(userForbiddenActions, ORDERS_ALL)}
      >
        {ORDER_NAME}
      </Menu.Item>

      
      <Menu.Item
        key="2"
        icon={<PieChartOutlined />}
        onClick={() => handleClick(ROUTE_ORDERS_OPEN)}
      >
        {OPEN_ORDER_NAME}
      </Menu.Item>
      
      <Menu.Item
        key="3"
        icon={<PieChartOutlined />}
        onClick={() => handleClick(ROUTE_ORDERS_DONE)}
      >
        {ORDER_NAME_DONE}
      </Menu.Item>
      <Menu.Item
        key="4"
        icon={<DesktopOutlined />}
        onClick={() => handleClick(ROUTE_INVENTORY)}
      >
        {INVENTORY_NAME}
      </Menu.Item>
      <Menu.Item key="5" icon={<ContainerOutlined />} onClick={() => handleClick(ROUTE_LOG_OUT)} >
        Salir
      </Menu.Item>
    </StyledMenu>
  );
};

const StyledMenu = styled(Menu)`
  min-width: 156px;
  height: 100vh;
  font-weight: 600;
`;

export default CustomSidebar;
