import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCol,
  CCardHeader,
  CRow,
  CButton,
  CInputGroup,
  CInputGroupText,
  CFormLabel,
  CForm,
  CFormInput,
  CFormTextarea, CFormFeedback
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilArrowThickToBottom, cilArrowThickFromBottom } from "@coreui/icons";
import { Table, Pagination, TagPicker, SelectPicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { MajorAPI } from "../../api/major";
import * as API from "../../api";
import { FetchAPI } from "../../api/FetchAPI";

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

const ListOrganization = () => {
  // Common & table states
  const [loadingTable, setLoadingTable] = useState(false);
  const [perpage, setPerpage] = useState(10);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [validated, setValidated] = useState(true);
  const [organizationInput, setOrganizationInput] = useState({});
  const history = useHistory();

  const onChangePage = page => {
    setPage(page);
    // fetchTableAPI(page, perpage);
  };

  const handleChangePerpage = dataKey => {
    setPerpage(dataKey);
    // fetchTableAPI(page, dataKey);
  };

  const onChangeInformation = (e) => {
    const value = e.target.value;
    setOrganizationInput({
      ...organizationInput,
      [e.target.name]: value
    });
    // console.log(organizationInput);
  };

  const handleCreateOrganization = () => {
    // Please validate 1st
    const data = {
      admin_user: organizationInput.admin_user,
      admin_password: organizationInput.admin_password,
      org_name: organizationInput.org_name,
      org_code: organizationInput.org_code,
      email: organizationInput.email,
      domain: organizationInput.domain,
      address: organizationInput.address
    };

    toast.promise(
      FetchAPI("POST",API.ADMIN_CREATE_ORGANIZATION, data),
      {
        pending: "Submitting to blockchain...",
        success: {
          render({ data }) {
            // handleClearAll();
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

  useEffect(() => {
    // fetchTableAPI(page, perpage);
    // fetchAllSubject();
  }, []);

  return (
    <CRow>
      <CCol xs={8}>
        <CCard className="mb-4">
          <CCardHeader>EDUCATIONAL ORGANIZATION INFORMATION</CCardHeader>
          <CCardBody style={{ marginLeft: "25px", marginRight: "25px" }}>
            <CForm
              validated={validated}>
              <CRow>
                <CCol xs={6}>
                  <div className="mb-3">
                    <CFormLabel>Educational Organization Name</CFormLabel>
                    <CFormInput
                      onChange={onChangeInformation}
                      name="org_name"
                      type="text" placeholder="The University of DaNang" />
                    <CFormFeedback valid>Looks good!</CFormFeedback>
                  </div>
                </CCol>
                <CCol xs={6}>
                  <CFormLabel>Email contact (Email domain)</CFormLabel>
                  <CInputGroup className="mb-3">
                    <CFormInput placeholder="Email" onChange={onChangeInformation} name="email" aria-label="Email" />
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput placeholder="Domain" onChange={onChangeInformation} name="domain" aria-label="domain" />
                    <CFormFeedback invalid>Looks good!</CFormFeedback>
                  </CInputGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol xs={2}>
                  <div className="mb-3">
                    <CFormLabel>CODE</CFormLabel>
                    <CFormInput
                      onChange={onChangeInformation}
                      name="org_code"
                      type="text" placeholder="UDN" />
                    <CFormFeedback valid>Looks good!</CFormFeedback>
                  </div>
                </CCol>
                <CCol xs={4}>
                  <div className="mb-3">
                    <CFormLabel>Address</CFormLabel>
                    <CFormInput
                      onChange={onChangeInformation}
                      name="address"
                      type="text" placeholder="41 Lê Duẩn" />
                  </div>
                </CCol>
                <CCol xs={6}>
                  <div className="mb-3">
                    <CFormLabel>Description</CFormLabel>
                    <CFormInput
                      onChange={onChangeInformation}
                      name="description"
                      type="text" placeholder="Description" />
                  </div>
                </CCol>
              </CRow><
              CRow>
              <CCol xs={6}>
                <div className="mb-3">
                  <CFormLabel>Email Transcript Management</CFormLabel>
                  <CFormInput
                    onChange={onChangeInformation}
                    name="admin_user"
                    type="text" />
                </div>
              </CCol>
              <CCol xs={6}>
                <div className="mb-3">
                  <CFormLabel>Password</CFormLabel>
                  <CFormInput
                    onChange={onChangeInformation}
                    name="admin_password"
                    type="password" />
                </div>
              </CCol>
            </CRow>
              <CRow>
                <CCol xs={12}>
                  <CButton
                    onClick={handleCreateOrganization}
                  >
                    Submit
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={4}>
        <CCard className="mb-4">
          <CCardHeader>MEMBER UNIVERSITY LIST</CCardHeader>
          <CCardBody style={{ marginLeft: "25px", marginRight: "25px" }}>
            <CForm>
              <CRow>
                <CCol xs={6}>
                  <div className="mb-3">
                    <CFormLabel>Organization Name</CFormLabel>
                    <CFormInput type="text" placeholder="The University of DaNang" />
                  </div>
                </CCol>
                <CCol xs={6}>
                  <CFormLabel>Email contact (Email domain)</CFormLabel>
                  <CInputGroup className="mb-3">
                    <CFormInput placeholder="Email" aria-label="Email" />
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput placeholder="Domain" aria-label="domain" />
                  </CInputGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol xs={2}>
                  <div className="mb-3">
                    <CFormLabel>Organization CODE</CFormLabel>
                    <CFormInput type="text" placeholder="UDN" />
                  </div>
                </CCol>
                <CCol xs={4}>
                  <div className="mb-3">
                    <CFormLabel>Address</CFormLabel>
                    <CFormInput type="text" placeholder="41 Lê Duẩn" />
                  </div>
                </CCol>
                <CCol xs={6}>
                  <div className="mb-3">
                    <CFormLabel>Description</CFormLabel>
                    <CFormInput type="text" placeholder="Address" />
                  </div>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default ListOrganization;
