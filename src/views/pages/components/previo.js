
import React, { Component } from 'react';
import {
    Button, Input, InputGroup, Dropdown, ButtonDropdown, DropdownItem,
    DropdownMenu, DropdownToggle
} from 'reactstrap';

import "bootstrap/dist/css/bootstrap.min.css";
import './previo.scss';
import axios from 'axios';
import { CCol, CRow } from '@coreui/react';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
const urlP = "http://localhost:8080/api/simulacion/uploadPedidos"
const urlB = "http://localhost:8080/api/simulacion/uploadCallesBloqueadas"
const urlM = "http://localhost:8080/api/simulacion/tipoSimulacion"
toast.configure();
class Previo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            dropDownOpen: false,
            dropDownValue: 'Elija la opcion',
            archivoPedido: null,
            archivoBloqueo: null,
            archivoMantenimiento: null,
            fileUploadState: '',
            enable: 0,
            form:{
                tipo: 0
            },
            files: [],
            selectedFiles: undefined,
        };
        this.inputReference = React.createRef();
    };


    onFileChange2 = event => {
        this.setState({ archivoBloqueo: event.target.files[0] });
        this.setState({ enable: this.state.enable + 1 });
    }
    toggle = () => {
        this.setState({
            dropDownOpen: !this.state.dropDownOpen,
        })
    }
    handleChange = (code) => {
        console.log(code)
        if (code !== "Simulación a 3 días") {
            console.log("toy aca")
            this.setState({
                form: {
                    tipo:1
                }
            })
        }
        this.setState({
            dropDownValue: code,

        })
    }
    notify=(val)=>{
        console.log("tasdasd")
        if(val===1)
        {toast("Se cargó el archivo de pedidos correctamente");}    
        if(val===2)
            {toast("Se cargó el archivo de bloqueos correctamente");}
    }
    uploadJSONFilesP(event) {
        event.preventDefault();
        console.log(event)
        let formData = new FormData();
        // let jsonBodyData = { 'someKey': 'someValue' };
        formData.append('file', event.target.files[0], event.target.files[0].name);

        console.log("archivo de Pedido")
        this.setState({ enable: this.state.enable + 1 })
        axios.post(urlP, formData).then(response => {
            console.log("se subio correctamente el archivo")
            this.notify(1);
        }).catch(error => {
            toast.error("Ha ingresado un archivo no válido. Por favor, revíselo")
            console.log(error.message);
        })
        // fetch(urlP, {
        //     method: 'POST',
        //     body: formData
        // }).then(response => response.json())
        //     .then(result => console.log('Se subió el archivo correctamente!'))
        //     .catch(error => console.log('Hubo un error al subir el archivo'));
    }

    uploadJSONFilesB(event) {
        event.preventDefault();
        console.log(event)
        let formData = new FormData();
        // let jsonBodyData = { 'someKey': 'someValue' };
        formData.append('file', event.target.files[0], event.target.files[0].name);
        console.log("archivo de Pedido")
        this.setState({ enable: this.state.enable + 1 })
        axios.post(urlB, formData).then(response => {
            console.log("se subio correctamente el archivo")
            this.notify(2);
        }).catch(error => {
            toast.error("Ha ingresado un archivo no válido. Por favor, revíselo")
            console.log(error.message);
        })
    }

    handleClick=() =>{
        console.log(this.state.form)
        axios.post(urlM, this.state.form).then(response => {
            console.log(response.data)
            console.log("posteo de tipo de simulacion")
            window.location.href = '/#/entregas/simulacion'
        }).catch(error => {
            console.log(error.message);
        })

       
    }
    render() {
        return (
            <div className="Tipo">
                <CRow>
                    <CCol xs={2}>
                        Simulación
                    </CCol>
                </CRow>
                <br />
                <CRow>
                    <CCol xs={2}>
                        Tipo:
                    </CCol>
                    <CCol xs={10}>
                        <ButtonDropdown size="lg" >
                            <Dropdown isOpen={this.state.dropDownOpen} toggle={this.toggle} >
                                <DropdownToggle color="primary" caret className="dropdown-toggle">
                                    {this.state.dropDownValue}
                                </DropdownToggle>
                                <DropdownMenu className="currency-dropdown" end>
                                    <DropdownItem onClick={() => this.handleChange("Simulación a 3 días")} >Simulación a 3 días</DropdownItem>
                                    <DropdownItem onClick={() => this.handleChange("Colapso logístico")} >Colapso logístico</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </ButtonDropdown>
                    </CCol>
                </CRow>
                <br />
                <CRow>
                    <CCol xs={2}>
                        Pedidos:
                    </CCol>
                    <CCol xs={3}>
                        <InputGroup>
                            <Input id={1} type="file" accept=".txt, .csv" className="archivosTexto" onChange={(event) => this.uploadJSONFilesP(event)} />
                        </InputGroup>

                    </CCol>
                </CRow>
                <br />
                <CRow>
                    <CCol xs={2}>
                        Bloqueos:
                    </CCol>
                    <CCol xs={3}>
                        <InputGroup>
                            <Input id={2} type="file" accept=".txt, .csv" className="archivosTexto" onChange={(event) => this.uploadJSONFilesB(event)} />
                        </InputGroup>
                    </CCol>

                </CRow>
                <br />
                {/* <CRow>
                    <CCol xs={2}>
                    Mantenimientos:
                    </CCol>
                    <CCol xs={3}>
                        <InputGroup>
                            <Input id={3} type="file" accept=".txt, .csv" className="archivosTexto" onChange={this.uploadJSONFiles}/>
                        </InputGroup>
                    </CCol>
                    
                </CRow>
                <br/> */}
                <CRow>
                    <CCol xs={2}>
                        Iniciar Simulación:
                    </CCol>
                    <CCol xs={3}>
                        {this.state.enable >= 1 ?
                            <Button type="submit" onClick={this.handleClick} className="botonP" color="primary">
                                Click para confirmar configuración
                            </Button> :
                            <Button disabled type="submit" onClick={(event) => this.uploadJSONFiles(event)} className="botonP" color="primary">
                                Click para confirmar configuración
                            </Button>
                        }


                    </CCol>

                </CRow>
            </div>
        )
    }
}

export default Previo