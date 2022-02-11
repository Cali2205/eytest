import React, {useState,useEffect } from 'react';
import {Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import {Modal,ModalFooter,ModalBody,ModalHeader} from 'reactstrap';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'


const Login = () => {
  
  const [validated,setValidated] =useState(false);
  const [email, setCorreo] = useState('');
  const [password, setPass] = useState('');
  const [showModal,setShowModal] = useState(false);
  const [vcheck,setVchek] =useState(false);
  const [recordar,setRecordar] =useState(false);
  //const [valorcheck,setValorcheck] = useState(0);
  const url="http://3.231.34.221:8080/api/usuario/validate";
  
  

  const handleSubmit = (e) => {
    const form = e.currentTarget
    if (form.checkValidity() === false) {
      e.preventDefault()
      e.stopPropagation()
    }
    setValidated(validated =>!validated)
    const datos= {email,password};


    fetch(url, {
      method:'POST',
      headers:{ 
        'Accept':'application/json',
        'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
      redirect:'manual'
    }).then(res =>res.json())
    .then(res => {
      console.log(datos)
      if(res.status !== 404){
        window.location.href = 'http://localhost:3000/#/dashboard'
      }
      if(res.status===404){
        console.log(res);
        setShowModal(true);
        
      }
  })
  }

  const handleChange=()=>{
    setRecordar(!recordar)
    
    if(recordar===false){
      console.log(recordar)
      //setValorcheck(1)
      window.sessionStorage.setItem("correo", email);
      window.sessionStorage.setItem("pass", password);
      window.sessionStorage.setItem("check",1)
      window.sessionStorage.setItem("reco",true)
    }else{
     // setValorcheck(0)
      window.sessionStorage.setItem("correo", "");
      window.sessionStorage.setItem("pass", "");
      window.sessionStorage.setItem("check",0)
      window.sessionStorage.setItem("reco",false)
    }
  }
   
  useEffect(() => {
    console.log(sessionStorage.getItem("correo")) 
    let c = sessionStorage.getItem("check")
    console.log(c)
    if(c===1){
      console.log("asdasda")
        setVchek(true)
        setCorreo(sessionStorage.getItem("correo"))
        setPass(sessionStorage.getItem("pass"))
    }else{
     // setRecordar(false)
     setVchek(false)
    }
    
  });
  

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
    <CContainer>
    <Modal isOpen={showModal}>
            <ModalHeader style={{display: 'block'}}>
                </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            Por favor, revise los datos ingresados.
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-danger"  onClick={()=>setShowModal(false)}>Cancelar</button>
                    </ModalFooter>
      </Modal>
      <CRow className="justify-content-center">
        <CCol md="8">
          <CCardGroup>
            <CCard className="p-4">
              <CCardBody>
                <CForm validated={validated.toString()} onSubmit={handleSubmit}>
                  <h1>Login</h1>
                  <p className="text-muted">Ingresa con tu cuenta</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-user" /> 
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="text" placeholder="Username" autoComplete="username" required={true} value={email} onChange={(e) => setCorreo(e.target.value)}/>
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-lock-locked" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="password" placeholder="Password" autoComplete="current-password" required={true} value={password} onChange={(e) => setPass(e.target.value)}/>
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" onChange={()=>handleChange()} checked={vcheck}/>
                      <label className="form-check-label" htmlFor="flexCheckDefault">
                        Recordar cuenta
                      </label>
                    </div>
                  </CInputGroup>
                  <CRow>
                    <CCol xs="6">
                      <CButton type="submit" color="primary" className="px-4">Login</CButton>
                    </CCol>
                    <CCol xs="6" className="text-right">
                      <CButton color="link" className="px-0">¿Olvidaste tu contraseña?</CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
            <CCard className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
              <CCardBody className="text-center">
                <div>
                  <h2>Crear cuenta</h2>
                  <p>Si aun no tienes cuenta, puedes registrarte dando clic en el boton.</p>
                  <Link to="/register">
                    <CButton color="primary" className="mt-3" active tabIndex={-1}>Registrarme</CButton>
                  </Link>
                </div>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
  )
}

export default Login