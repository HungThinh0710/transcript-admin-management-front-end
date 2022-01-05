import React, { lazy, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol, CFormTextarea,
  CProgress,
  CRow,
  CBadge
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cibTwitter,
  cilUser,
  cilUserFemale, cilArrowThickFromBottom, cilArrowThickToBottom
} from "@coreui/icons";
import { Table, Pagination, TagPicker, SelectPicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import * as API from "../../api";
import { toast } from "react-toastify";
import { FetchAPI } from "../../api/FetchAPI";
import { getStyle, hexToRgba } from "@coreui/utils";

const WidgetsDropdown = lazy(() => import("../widgets/WidgetsDropdown.js"));
const WidgetsBrand = lazy(() => import("../widgets/WidgetsBrand.js"));

const rowKey = "id";
const ExpandCell = ({ rowData, dataKey, expandedRowKeys, onChange, ...props }) => (
  <Table.Cell {...props}>
    <CIcon
      icon={
        expandedRowKeys.some((key) => key === rowData[rowKey]) ? cilArrowThickFromBottom : cilArrowThickToBottom
      }
      size="sm"
      appearance="subtle"
      onClick={() => {
        onChange(rowData);
      }}
    />
  </Table.Cell>
);

const renderRowExpanded = (rowData) => {
  return (
    <div>
      <div
        style={{
          width: 75,
          height: 75,
          float: "left",
          marginRight: 10,
          background: "#eee"
        }}
      >
        {/*<img src={rowData.logo_url} style={{ width: 75, height: 75 }} />*/}
        <img
          src="https://scontent-sin6-2.xx.fbcdn.net/v/t1.6435-9/88246879_128983265328313_2380539929374490624_n.png?_nc_cat=105&ccb=1-5&_nc_sid=973b4a&_nc_ohc=SPCOn3zRzW0AX8vemVg&_nc_ht=scontent-sin6-2.xx&oh=00_AT8IeIUNmWCzwzAWM4LeHwNQIT5AMqLQDwz0XN2FHxlyoA&oe=61FA208F"
          style={{ width: 75, height: 75 }} />
      </div>
      <p>Email: {rowData.email}</p>
      <p>Domain: {rowData.email_domain}</p>
      <p>Address: {rowData.address}</p>
      <p>Description: {rowData.description}</p>
    </div>
  );
};

const Dashboard = () => {

  const [loadingTable, setLoadingTable] = useState(false);
  const [perpage, setPerpage] = useState(10);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [payloadTable, setPayloadTable] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const history = useHistory();

  const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const progressExample = [
    { title: "Visits", value: "29.703 Users", percent: 40, color: "success" },
    { title: "Unique", value: "24.093 Users", percent: 20, color: "info" },
    { title: "Pageviews", value: "78.706 Views", percent: 60, color: "warning" },
    { title: "New Users", value: "22.123 Users", percent: 80, color: "danger" },
    { title: "Bounce Rate", value: "Average Rate", percent: 40.15, color: "primary" }
  ];

  const progressGroupExample1 = [
    { title: "Monday", value1: 34, value2: 78 },
    { title: "Tuesday", value1: 56, value2: 94 },
    { title: "Wednesday", value1: 12, value2: 67 },
    { title: "Thursday", value1: 43, value2: 91 },
    { title: "Friday", value1: 22, value2: 73 },
    { title: "Saturday", value1: 53, value2: 82 },
    { title: "Sunday", value1: 9, value2: 69 }
  ];

  const progressGroupExample2 = [
    { title: "Male", icon: cilUser, value: 53 },
    { title: "Female", icon: cilUserFemale, value: 43 }
  ];

  const progressGroupExample3 = [
    { title: "Organic Search", icon: cibGoogle, percent: 56, value: "191,235" },
    { title: "Facebook", icon: cibFacebook, percent: 15, value: "51,223" },
    { title: "Twitter", icon: cibTwitter, percent: 11, value: "37,564" },
    { title: "LinkedIn", icon: cibLinkedin, percent: 8, value: "27,319" }
  ];


  const handleExpanded = (rowData, dataKey) => {
    let open = false;
    const nextExpandedRowKeys = [];

    expandedRowKeys.forEach((key) => {
      if (key === rowData[rowKey]) {
        open = true;
      } else {
        nextExpandedRowKeys.push(key);
      }
    });
    if (!open) {
      nextExpandedRowKeys.push(rowData[rowKey]);
    }
    setExpandedRowKeys(nextExpandedRowKeys);
  };

  const ActionCell = ({ rowData, dataKey, onChange, ...props }) => {
    return (
      <Table.Cell {...props} style={{ padding: "6px" }}>
        <CButton
          appearance="link"
          onClick={() => {
            // handleEdit(rowData);
          }}>
          Edit
        </CButton>
        {
          rowData.status === 1 ? (<CButton
            color="success"
            style={{ marginLeft: "2px" }}
            onClick={() => {
              handleChangeStatusOrganization(rowData.id, rowData.status);
            }}>
            Active
          </CButton>) : (<CButton
            color="warning"
            style={{ marginLeft: "2px" }}
            onClick={() => {
              handleChangeStatusOrganization(rowData.id, rowData.status);
            }}>
            Deactivate
          </CButton>)
        }

      </Table.Cell>
    );
  };


  const handleChangeStatusOrganization = (id, status) => {
    const data = {
      org_id: id,
      status: status === 0 ? 1 : 0
    };
    toast.promise(
      FetchAPI("POST", API.ADMIN_DEACTIVATE_ORGANIZATION, data),
      {
        pending: "Please waiting...",
        success: {
          render({ data }) {
            fetchOrganizations(page, perpage);
            return data.message;
          }
        },
        error: {
          render({ data }) {
            console.log("ERROR IN FETCH NEW PAYLOAD API");
            console.log(data);
            return data.data.message;
          }
        }
      }
    );
  };

  const onChangePage = page => {
    setPage(page);
    fetchOrganizations(page, perpage);
  };


  const handleChangePerpage = dataKey => {
    setPerpage(dataKey);
    fetchOrganizations(page, dataKey);
  };


  const fetchOrganizations = (page, perpage) => {
    setLoadingTable(true);
    FetchAPI("GET", API.ADMIN_GET_ORGANIZATION, {}, page, perpage)
      .then(payload => {
        setLoadingTable(false);
        setPayloadTable(payload.organizations.data);
        setPagination(payload.organizations);
      })
      .catch(error => {
        setLoadingTable(false);
        console.log("Error in here");
        console.log(error);
        switch (error.status) {
          case 401:
            history.push("/login");
            break;
          case 403:
            history.push("/dashboard");
            toast.error(error.data.message);
            break;
          default:
            toast.error(error.data.message);
            break;
        }
      });
  };

  useEffect(() => {
    fetchOrganizations(page, perpage);
  }, []);

  return (
    <>
      <WidgetsDropdown />
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={12}>
              <h4 id="traffic" className="card-title mb-0">
                List Organization
              </h4>
            </CCol>
          </CRow>
          <CRow>
            <CCol sm={12}>
              <CButton
                onClick={() => {
                  history.push("/organizations/new");
                }}
                variant="outline">
                Create Educational Organization
              </CButton>
            </CCol>
          </CRow>
          <Table
            virtualized
            loading={loadingTable}
            height={400}
            autoHeight={true}
            data={payloadTable}
            rowExpandedHeight={150}
            rowKey={rowKey}
            expandedRowKeys={expandedRowKeys}
            renderRowExpanded={renderRowExpanded}
          >
            <Table.Column width={70} align="center">
              <Table.HeaderCell>#</Table.HeaderCell>
              <ExpandCell dataKey="id" expandedRowKeys={expandedRowKeys} onChange={handleExpanded} />
            </Table.Column>
            <Table.Column width={50} align="center">
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.Cell dataKey="id" />
            </Table.Column>
            <Table.Column width={350}>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.Cell dataKey="org_name" />
            </Table.Column>
            <Table.Column width={100}>
              <Table.HeaderCell>Code</Table.HeaderCell>
              <Table.Cell dataKey="org_code" />
            </Table.Column>
            <Table.Column width={100}>
              <Table.HeaderCell>Prefix</Table.HeaderCell>
              <Table.Cell dataKey="org_prefix" />
            </Table.Column>
            <Table.Column width={150}>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.Cell>
                {
                  rowData => {
                    return rowData.status === 1 ? (<CBadge color="danger">Deactivated</CBadge>) : (
                      <CBadge color="success">Activate</CBadge>);
                  }
                }
              </Table.Cell>

            </Table.Column>
            <Table.Column width={200}>
              <Table.HeaderCell>Action</Table.HeaderCell>
              <ActionCell dataKey="id" />
            </Table.Column>
          </Table>
          <div style={{ padding: 20 }}>
            {pagination != null ? (<Pagination
              prev
              next
              first
              last
              ellipsis
              boundaryLinks
              maxButtons={5}
              size="xs"
              layout={["total", "-", "limit", "|", "pager", "skip"]}
              total={pagination.total}
              limitOptions={[1, 10, 25, 50, 100]}
              limit={perpage}
              activePage={pagination.current_page}
              onChangePage={onChangePage}
              onChangeLimit={handleChangePerpage}
            />) : null
            }</div>

        </CCardBody>
        <CCardFooter>
          <CRow xs={{ cols: 1 }} md={{ cols: 5 }} className="text-center">
            {progressExample.map((item, index) => (
              <CCol className="mb-sm-2 mb-0" key={index}>
                <div className="text-medium-emphasis">{item.title}</div>
                <strong>
                  {item.value} ({item.percent}%)
                </strong>
                <CProgress thin className="mt-2" color={item.color} value={item.percent} />
              </CCol>
            ))}
          </CRow>
        </CCardFooter>
      </CCard>

    </>
  );
};

export default Dashboard;
