import React, { Component } from 'react'
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import './usuarios.scss';
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { DropdownMenu,ButtonDropdown,Dropdown,DropdownItem,DropdownToggle,Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    CBadge
} from '@coreui/react'
//const url="http://3.231.34.221:8080/api/usuario/";
const url = "http://localhost:8080/api/usuario/";
class usuarios extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            modalInsertar: false,
            modalEliminar: false,
            dropDownOpen: false,
            dropDownValue: '',
            tipoModal: '',
            colorEstado: '',
            form: {
                idUsuario: 0,
                email: '',
                estado: '',
                nombres: '',
                apellidos: '',
                password: '',
                actions: [],
            },
        };
    }

    peticionGet = () => {
        axios.get(url).then(response => {
            console.log(response.data);
            this.setState({ data: response.data });
        }).catch(error => {
            console.log(error.message);
        })
    }

    getBadge = (status) => {
        console.log(status)
        switch (status) {
            case 1: return 'success'
            case 0: return 'secondary'
        }
    }
    peticionPatch = () => {
        axios.patch(url + this.state.form.idUsuario, this.state.form).then(response => {
            console.log(response.data);
            this.modalInsertar();
            this.peticionGet();
        }).catch(error => {
            console.log(error.message);
        })
    }
    peticionPost = async () => {
        delete this.state.form.idUsuario;
        console.log(this.state.form);
        await axios.post(url, this.state.form).then(response => {
            this.modalInsertar();
            this.peticionGet();
        }).catch(error => {
            console.log(error.message);
        })
    }
    toggle = () => {
        this.setState({
           dropDownOpen: !this.state.dropDownOpen
        })
    }


    peticionDelete = () => {
        axios.delete(url + this.state.form.idUsuario).then(response => {
            this.setState({ modalEliminar: false });
            this.peticionGet();
        })
    }

    modalInsertar = () => {
        this.setState({ modalInsertar: !this.state.modalInsertar });
    }

    seleccionarUsuario = (usuario) => {
        console.log(usuario)
        if(usuario.estado===1){
         this.setState({
             dropDownValue:'Activo'
         })
        } else{
         this.setState({
             dropDownValue:'Inactivo'
         })
            
        }
        this.setState({
            tipoModal: 'actualizar',
            form: {
                idUsuario: usuario.idUsuario,
                email: usuario.email,
                estado: usuario.estado,
                nombres: usuario.nombres,
                apellidos: usuario.apellidos
            }
        })
    }

    handleChange = async e => {
        e.persist();
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
        console.log(this.state.form);
    }
    handleChange2 = (code,val) => {
        this.setState({
            dropDownValue: code
           
        })
        if(val===1){
            this.setState({
                form:{
                    ...this.state.form,
                    estado:1
                }
            })
        }else{
            this.setState({
                form:{
                    ...this.state.form,
                    estado:0
                }
            })
        }
    }
    componentDidMount() {
        this.peticionGet();
    }

    render() {
        const { form } = this.state;
        let seccion,seccion2;
        if (this.state.tipoModal === 'insertar') {
            seccion = 
            <div>
                <label htmlFor="placa">Contraseña</label>
                <input className="form-control" type="password" name="password" id="password" onChange={this.handleChange} value={form ? form.password : ''} />
                <br />
                
            </div>
            seccion2=
            <div>
                
            </div>
        } else {
            seccion = <div></div>
            seccion2 = 
            <div>
                <label htmlFor="estado">Estado</label>
                            <br/>
                <ButtonDropdown size="lg" >
                    <Dropdown isOpen={this.state.dropDownOpen} toggle={this.toggle} >
                        <DropdownToggle color="primary" caret className="dropdown-toggle">
                            {this.state.dropDownValue}
                        </DropdownToggle>
                        <DropdownMenu className="currency-dropdown" end>
                            <DropdownItem key={1} onClick={() => this.handleChange2("Activo", 1)} onChange={this.handleChange} value={form ? form.estado : ''}>
                                Activo
                            </DropdownItem>
                            <DropdownItem key={2} onClick={() => this.handleChange2("Inactivo", 2)} onChange={this.handleChange} value={form ? form.estado : ''}>
                                Inactivo
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </ButtonDropdown>
                </div>
        }
        return (
            <div className="usuarios">
                <br />
                <button className="btn btn-success" onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}>Agregar nuevo usuario</button>
                <br /><br />

                <table className="table">
                    <thead>
                        <tr>
                            <th> ID </th>
                            <th> Nombre </th>
                            <th> Email </th>
                            <th> Estado </th>
                            <th> Acciones </th>
                        </tr>

                    </thead>
                    <tbody>
                        {
                            this.state.data.map(usuario => {
                                return (
                                    <tr>
                                        <td>{usuario.idUsuario}</td>
                                        <td>{usuario.nombres + ' ' + usuario.apellidos}</td>
                                        <td>{usuario.email}</td>
                                        <td>
                                            {usuario.estado === 1 ?
                                                <CBadge color={this.getBadge(usuario.estado)}>
                                                    Activo
                                                </CBadge> :
                                                < CBadge color={this.getBadge(usuario.estado)}>
                                                    Inactivo
                                                </CBadge>
                                            }


                                        </td>
                                        <td>
                                            <button className="btn btn-primary" onClick={() => { this.seleccionarUsuario(usuario); this.modalInsertar() }}><FontAwesomeIcon icon={faEdit} /></button>
                                            {"     "}
                                            <button className="btn btn-danger" onClick={() => { this.seleccionarUsuario(usuario); this.setState({ modalEliminar: true }) }}><FontAwesomeIcon icon={faTrashAlt} /></button>
                                        </td>
                                    </tr>
                                )

                            })
                        }
                    </tbody>

                </table>
                <Modal isOpen={this.state.modalInsertar}>
                    <ModalHeader style={{ display: 'block' }}>
                        <span style={{ float: 'right' }} onClick={() => this.modalInsertar()}>x</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="id">ID</label>
                            <input className="form-control" type="text" name="idUsuario" id="idUsuario" readOnly onChange={this.handleChange} value={form ? form.idUsuario : this.state.data.length + 1} />
                            <br />
                            <label htmlFor="id">Nombres completos</label>
                            <div>
                                <input placeholder="Nombres" name="nombres" type="text" onChange={this.handleChange} value={form ? form.nombres : ''} class="form-control" />
                                <br />
                                <input placeholder="Apellidos" name="apellidos" type="text" onChange={this.handleChange} value={form ? form.apellidos : ''} class="form-control" />
                            </div>
                            <br />
                            <label htmlFor="placa">Email</label>
                            <input className="form-control" type="text" name="email" id="email" onChange={this.handleChange} value={form ? form.email : ''} />
                            <br />
                            {seccion}
                            {seccion2}
                            {/* <label htmlFor="placa">Contraseña</label>
                            <input className="form-control" type="password" name="password" id="password" onChange={this.handleChange} value={form?form.password: ''}/>
                            <br /> */}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        {
                            this.state.tipoModal === 'insertar' ?
                                <button className="btn btn-success" onClick={() => this.peticionPost()}>Agregar</button> :
                                <button className="btn btn-primary" onClick={() => this.peticionPatch()}>Actualizar</button>
                        }

                        <button className="btn btn-danger" onClick={() => this.modalInsertar()}>Cancelar</button>
                    </ModalFooter>
                </Modal>


                <Modal isOpen={this.state.modalEliminar}>
                    <ModalBody>
                        ¿Estás seguro que deseas dar de baja al Usuario: {form && form.idUsuario}?
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-danger" onClick={() => this.peticionDelete()}>Sí</button>
                        <button className="btn btn-secundary" onClick={() => this.setState({ modalEliminar: false })}>No</button>
                    </ModalFooter>
                </Modal>


            </div>

        )

    }
}

export default usuarios;
