import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Popconfirm,
  message,
  Button,
  PageHeader,
  Table,
  Input,
  Select,
} from "antd";
import Modal from "antd/lib/modal/Modal";
import { Option } from "antd/lib/mentions";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { APP_NAME, INVENTORY_NAME } from "../../DefaultProps";
import { CustomContent, CustomLayout } from "../navigation/AppLayout";
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
    render: (record) => <span>{parseRole(record)}</span>,
  },
];

// Build User Object from firestore collection item
export const buildUserObject = (item) => {
  let data = item.data();
  return {
    email: data.email,
    userName: data.userName,
    role: data.role,
    uid: data.uid,
    date: data.date,
  };
};

export const buildRoleObject = (item) => {
  let data = item.data();
  return {
    role: data.role,
    forbidden: data.forbidden,
  };
};

const UsersComponent = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [newRole, setNewRole] = useState("disabled");
  const [newUser, setNewUser] = useState(undefined);
  const [modal, contextHolder] = Modal.useModal();
  const [messageHolder] = message.useMessage();

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
              onClick={() => onEdit(record)}
              style={{ marginRight: "12px" }}
            >
              <EditOutlined />
            </Button>

            <Popconfirm
              placement="top"
              title={
                "¿Desea Eliminar esta Usuario? Se perderán todos los accesos de inmediato."
              }
              onConfirm={() => onDelete(record.uid)}
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
            usr.userName.toLowerCase().includes(filter.toLocaleLowerCase())
          );
          setFilteredUsers(filteredData);
        } else {
          setFilteredUsers(undefined);
        }
      }}
    />
  );

  const EditUserConfig = (e) => {
    return {
      title: "Editar Role de Usuario...",
      content: (
        <div>
          <p> Cambiar el Rol del Usuario </p>
          <Select
            style={{ width: 200 }}
            placeholder="Seleccione un rol"
            optionFilterProp="children"
            defaultValue="disable"
            onChange={setNewRole}
          >
            {roles.map((r, i) => (
              <Option key={i} value={r.role}>
                {r.role}
              </Option>
            ))}
          </Select>
          {/* <Button onClick={() => updateCurrentUserRole(e)}>Cambiar</Button> */}
        </div>
      ),
    };
  };

  useEffect(() => {
    UsersService.getAll().orderBy("userName", "asc").onSnapshot(onDataChange);
    UsersService.getAllRoles().onSnapshot(onRolesDataChange);
  }, []);

  useEffect(() => {
    if (!!newUser) {
      updateCurrentUserRole(newUser);
    }
  }, [newRole]);

  const onDataChange = (items) => {
    let current = [];
    items.forEach((item) => {
      let val = buildUserObject(item);
      current.push(val);
    });
    setUsers(current);
  };

  const onRolesDataChange = (items) => {
    let current = [];
    items.forEach((item) => {
      let val = buildUserObject(item);
      current.push(val);
    });
    setRoles(current);
  };

  const showEditModal = (e) => {
    setNewUser(e);
    modal.info(EditUserConfig(e));
  };

  const updateCurrentUserRole = (e) => {
    let newElement = e;
    newElement["role"] = newRole;
    console.log(e);
    UsersService.update(newElement.uid, newElement);
    // showUpdateInfo(newElement.userName, newElement.role);
    setNewUser(undefined);
    modal.destroy();
  };

  const onEdit = (element) => {
    showEditModal(element);
  };

  const onDelete = (key) => {
    UsersService.delete(key);
  };

  const showUpdateInfo = (name, role) => {
    messageHolder.open({
      type: "info",
      content: `El Usuario ${name} ahora tiene el rol de ${role}`,
      duration: 3,
    });
  };

  return (
    <CustomLayout>
      <PageHeader
        ghost={false}
        title={APP_NAME}
        subTitle={INVENTORY_NAME}
      ></PageHeader>
      <CustomContent>
        {FilterByNameInput}
        <PTable
          dataSource={
            !!filteredUsers && filteredUsers.length > 0 ? filteredUsers : users
          }
          columns={tableColumns()}
        />
      </CustomContent>
      {contextHolder}
    </CustomLayout>
  );
};

export default UsersComponent;
