import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Popconfirm,
  message,
  Button,
  InputNumber,
  PageHeader,
  Table,
  Input,
} from "antd";
import Modal from "antd/lib/modal/Modal";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
import { APP_NAME, INVENTORY_NAME } from "../../DefaultProps";
import { CustomContent, CustomLayout } from "../navigation/AppLayout";
import { ROUTE_ADD_PRODUCT } from "../navigation/Routes";
import ProductsDataService from "../services/Products.service";
import UsersService from "../services/Users.service";
import { parseRole } from "./users.config";

export const PTable = styled(Table)`
  padding: 20px;
  margin: 20px;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08);
`;

const columns = [
  {
    title: "Correo",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Nombre",
    dataIndex: "userName",
    key: "userName",
  },
  {
    title: "Fecha de Registro",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Rol",
    dataIndex: "role",
    key: "role",
    render: (record) => (<span>{parseRole(record)}</span>),
  },
];

// Build User Object from firestore collection item
export const buildUserObject = (item) => {
  let data = item.data();
  return {
    email: data.email,
    userName: data.name,
    role: data.role,
    uid: data.uid,
    date: data.date,
  };  
};

const UsersComponent = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [newSupply, setNewSupply] = useState(0);
  const [modal, contextHolder] = Modal.useModal();
  const [messageHolder] = message.useMessage();
  const history = useHistory();

  const tableColumns = () => {
    let cols = [
      ...columns,
      {
        title: "Acciones",
        dataIndex: "",
        key: "x",
        render: (record) => (
          <>
            <Button
              // onClick={() => onEdit(record)}
              style={{ marginRight: "12px" }}
            >
              <EditOutlined />
            </Button>

            <Popconfirm
              placement="top"
              title={"¿Desea Eliminar esta Usuario? Se perderán todos los accesos de inmediato."}
              onConfirm={() => onDelete(record.id)}
              okText="Si"
              cancelText="No"
            >
              <Button>
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </>
        ),
      },
    ];
    return cols;
  };

  const FilterByNameInput = (
    <Input
      placeholder="Filtrar por Nombre"
      value={nameFilter}
      onChange={(e) => {
        const filter = e.target.value;
        setNameFilter(filter);
        if (filter.trim() !== "") {
          const filteredData = users.filter((usr) =>
            usr.name.includes(filter)
          );
          setFilteredUsers(filteredData);
        } else {
          setFilteredUsers(undefined);
        }
      }}
    />
  );

  // const AddProductConfig = (e) => {
  //   return {
  //     title: "Agregando Producto...",
  //     content: (
  //       <div>
  //         <p>Suministro Actual: {e.supply}</p>
  //         <br />
  //         <p>Nuevo Suministro: </p>
  //         <InputNumber
  //           min={1}
  //           max={10000}
  //           defaultValue={0}
  //           onChange={setNewSupply}
  //           style={{ marginRight: "10px" }}
  //         />
  //         <Button
  //           onClick={() => updateCurrentElementSupply(e)}
  //           disabled={!newSupply < 0}
  //         >
  //           Agregar
  //         </Button>
  //       </div>
  //     ),
  //   };
  // };

  useEffect(() => {
    UsersService.getAll()
      .orderBy("userName", "asc")
      .onSnapshot(onDataChange);
  }, []);

  const onDataChange = (items) => {
    let current = [];

    items.forEach((item) => {
      let val = buildUserObject(item);
      current.push(val);
    });
    setUsers(current);
  };

  // const showEditModal = (e) => {
  //   modal.info(AddProductConfig(e));
  // };

  // const updateCurrentElementSupply = (e) => {
  //   let newElement = e;
  //   newElement["newSupply"] = newSupply;
  //   newElement["olderSupply"] = newElement.supply;
  //   newElement["supply"] = newElement.supply + newSupply;
  //   ProductsDataService.update(newElement.id, newElement);
  //   showUpdateInfo(newElement.name, newSupply);
  //   modal.destroy();
  // };

  // const onEdit = (element) => {
  //   showEditModal(element);
  // };

  const onDelete = (key) => {
    UsersService.delete(key);
  };

  // const showUpdateInfo = (name, supply) => {
  //   messageHolder.open({
  //     type: "info",
  //     content: `Producto: ${name} se agregó un suministro de ${supply}`,
  //     duration: 3,
  //   });
  // };

  return (
    <CustomLayout>
      <PageHeader
        ghost={false}
        title={APP_NAME}
        subTitle={INVENTORY_NAME}
        extra={[
          <Button key="2">Exportar</Button>,
          <Button key="1" type="primary" onClick={createProduct}>
            Nuevo Producto
          </Button>,
        ]}
      ></PageHeader>
      <CustomContent>
        {FilterByNameInput}
        <PTable
          dataSource={!!filteredUsers && filteredUsers.length > 0 ? filteredUsers : users}
          columns={tableColumns()}
        />
      </CustomContent>
      {contextHolder}
    </CustomLayout>
  );
};

export default UsersComponent;
