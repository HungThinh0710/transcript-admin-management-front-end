import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CFormLabel, CSpinner
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cibGmail, cibMailRu, cilLockLocked, cilUser } from "@coreui/icons";
import * as API from "../../../api";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { FetchAPI } from "../../../api/FetchAPI";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [wallet, setWallet] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const location = useLocation();
  const history = useHistory();

  let fileReader;

  const validateInfo = () => {
    return email.length > 0 && password.length > 0;
  };


  const fetchLogin = () => new Promise((resolve, reject) => {
      axios.post(API.CLIENT_LOGIN, {
        email: email,
        password: password,
        wallet: wallet
      }, { withCredentials: true }) // Credentials must true for save token to cookie
        .then(function(response) {
          setIsLoading(false);
          if (response.status == 200 && response.data.code == 0) {
            resolve();
          }
        })
        .catch((error) => {
          setIsLoading(false);
          switch (error.response.data.code) {
            case 422:
              reject("The given data was invalid.");
            default:
              reject(error.response.data.message);
          }
        });
    }
  );

  const loginSubmitted = () => {
    setIsLoading(true);
    if (validateInfo()) {
      toast.promise(
        FetchAPI("POST", API.ADMIN_LOGIN, {email: email, password: password}),
        {
          pending: "Please waiting...",
          success: {
            render({ data }) {
              setIsLoading(false);
              if(data.success === true){
                return history.replace("/dashboard");
              }
            }
          },
          error: {
            render({ data }) {
              setIsLoading(false);

              console.log("DATA");
              console.log(data);
              if(data.data.success === false){
                return data.data.message;
              }
              return data.data.message;
            }
          }
        }
      );
    } else {
      setIsLoading(false);
      toast.warning("Email or Password and Secret Key is required.");
    }
  };

  useEffect(() => {
    if(typeof location.state !== "undefined"){
      setIsLogged(true)
    }
    else{
      FetchAPI("GET", API.ADMIN_GET_USER)
        .then(payload => {
          if (payload.success === true) {
            history.replace('/dashboard')
            setIsLogged(true);
          }
        })
        .catch(error => {
          setIsLogged(true);
        });
    }
  }, []);

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <ToastContainer />
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  {
                    !isLogged ?
                      (
                        <>
                        <CCardBody className="text-center">
                          <CSpinner
                            style={{marginTop: '50px'}}
                          />
                          <p style={{fontWeight: 'bold', paddingTop: '15px', fontSize: '20px'}}>Please waiting.</p>
                        </CCardBody>
                        </>)
                      : (
                        <>
                          <CForm>
                            <h1>ADMIN LOGIN</h1>
                            <p className="text-medium-emphasis">Sign In to your admin site</p>
                            <CInputGroup className="mb-3">
                              <CInputGroupText>
                                <CIcon icon={cibMailRu} />
                              </CInputGroupText>
                              <CFormInput
                                value={email}
                                onChange={(e) => {
                                  setEmail(e.target.value);
                                }}
                                placeholder="Email"
                                autoComplete="email" />
                            </CInputGroup>
                            <CInputGroup className="mb-4">
                              <CInputGroupText>
                                <CIcon icon={cilLockLocked} />
                              </CInputGroupText>
                              <CFormInput
                                value={password}
                                onChange={(pwd) => {
                                  setPassword(pwd.target.value);
                                }}
                                type="password"
                                placeholder="Password"
                                autoComplete="current-password"
                              />
                            </CInputGroup>
                            <CRow>
                              <CCol xs={6}>
                                <CButton
                                  onClick={() => {
                                    loginSubmitted();
                                  }}
                                  color="primary"
                                  disabled={isLoading}
                                  className="px-4">
                                  Login
                                </CButton>
                              </CCol>
                              {/*<CCol xs={6} className="text-right">*/}
                              {/*  <CButton color="link" className="px-0">*/}
                              {/*    Forgot password?*/}
                              {/*  </CButton>*/}
                              {/*</CCol>*/}
                            </CRow>
                          </CForm>
                        </>
                      )
                  }
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: "44%" }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Transcript Management</h2>
                    <h2>
                      ADMIN SITE
                    </h2>
                    <p>Copyright 2021 Phoenix - VKU</p>
                    {/* <Link to="/register">
                    <CButton color="primary" className="mt-3" active tabIndex={-1}>
                      Register Now!
                    </CButton>
                  </Link> */}
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>

  );
};

export default Login;
