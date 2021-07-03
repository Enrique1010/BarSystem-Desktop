import React, { useState } from "react";
import {
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { ROUTE_ORDERS, ROUTE_INVENTORY, ROUTE_ORDERS_DONE, ROUTE_ORDERS_OPEN } from "./Routes";
import { INVENTORY_NAME, OPEN_ORDER_NAME, ORDER_NAME, ORDER_NAME_DONE } from "../../DefaultProps";

const CustomSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const history = useHistory();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleClick = (path) => {
    history.push(path);
  };

  return (
    <StyledMenu
      defaultSelectedKeys={["1"]}
      defaultOpenKeys={["sub1"]}
      mode="inline"
      theme="dark"
      inlineCollapsed={collapsed}
    >
      <Menu.Item
        key="1"
        icon={<PieChartOutlined />}
        onClick={() => handleClick(ROUTE_ORDERS)}
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
      <Menu.Item key="5" icon={<ContainerOutlined />}>
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
