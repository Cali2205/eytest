import React,{Component} from 'react'
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import {faEdit,faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import { DropdownMenu,ButtonDropdown,Dropdown,DropdownItem,DropdownToggle,Modal, ModalBody,ModalFooter,ModalHeader} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './flota.scss';
import {
    CBadge
  } from '@coreui/react'
// const url="http://3.231.34.221:8080/api/vehicle";
// const url2= "http://3.231.34.221:8080/api/tipoVehiculo/";

const url="http://localhost:8080/api/vehicle/";
const url2= "http://localhost:8080/api/tipoVehiculo/";

class flota extends Component {
    constructor(props){
        super(props);
        this.state={
            data:[],
            tiposV:[],
            modalInsertar:false,
            modalEliminar:false,
            dropDownOpen:false,
            idTV :'',
            dropDownValue: 'Elija el tipo de Camión',
            form:{
                idVehiculo:0,
                placa:'',
                capacidadActual:'',
                idTipo:'',
                incidentes:'',
                actions: [],
            },
        };
    }

    peticionGet=()=>{
        axios.get(url).then(response=>{
            console.log(response.data);
            this.setState({data:response.data});
        }).catch(error=>{
            console.log(error.message);
        })
    }
    
    peticionGet2=()=>{
        axios.get(url2).then(response=>{
            console.log(response.data);
            this.setState({tiposV:response.data});
        }).catch(error=>{
            console.log(error.message);
        })
    }
    peticionPost=async()=>{
        delete this.state.form.idVehiculo;
        console.log(this.state.form);
       await axios.post(url,this.state.form).then(response=>{
          this.modalInsertar();
          this.peticionGet();
        }).catch(error=>{
          console.log(error.message);
        })
    }
    
    // peticionPut=()=>{
    //     const form2 = null;
    //     axios.put(url+this.state.form.idVehiculo,form2).then(response=>{
    //         this.modalInsertar();
    //         this.peticionGet();
    //     })
    //     console.log(form2);

    // }

    peticionPatch=()=>{
        console.log("ACAAA");
        console.log(this.state.form);
        axios.patch(url+this.state.form.idVehiculo,this.state.form).then(response=>{
            console.log(response.data);
             this.modalInsertar();
            this.peticionGet();
         }).catch(error=>{
             console.log(error.message);
         })
    }

    peticionDelete=()=>{
        axios.delete(url+this.state.form.idVehiculo).then(response=>{
          this.setState({modalEliminar: false});
          this.peticionGet();
        })
    }

    modalInsertar=()=>{
        this.setState({modalInsertar: !this.state.modalInsertar});
    }

    seleccionarVehiculo=(vehiculo)=>{
        this.setState({
            tipoModal:'actualizar',
            form:{
                idVehiculo:vehiculo.idVehiculo,
                placa:vehiculo.placa,
                capacidadActual:vehiculo.capacidadActual,
                tipo:vehiculo.tipo.idTipo,
            }
        })
    }

    toggle = () => {
        this.setState({
           dropDownOpen: !this.state.dropDownOpen
           
        })
    }

    changeValue(e) {
        this.setState({
            dropDownValue: e.currentTarget.textContent,
        });  
    }

    handleChange=async e=>{
        e.persist();
        await this.setState({
          form:{
            ...this.state.form,
            [e.target.name]: e.target.value
          }
        });
        console.log(this.state.form);
    }

    handleChange2 = (code) => {
        this.setState({
            dropDownValue: code.nombre,
            form:{
                ...this.state.form,
                idTipo:code.idTipo
              }
        })
        
    }
    getBadge=(status)=> {
       // console.log(status)
        switch (status) {
          case 'TIPO A': return 'primary'
          case 'TIPO B': return 'info'
          case 'TIPO C': return 'success'
          case 'TIPO D': return 'warning'
        }
    }
    handleDropDown = e => {
        e.persist();
        this.setState(
          {
              form:{
                ...this.state.form,
                [e.target.name]: e.target.value
              }
            
          },
        );
    };

    componentDidMount(){
        this.peticionGet();
        this.peticionGet2();
    }

    render(){
        const{form}=this.state;
        return (
            <div className="flota">
            <br/>
            <button className="btn btn-success"  onClick={()=>{this.setState({form: null, tipoModal: 'insertar'}); this.modalInsertar()}}>Agregar Camión</button>
            <br/><br/>

            <table className="table">
                <thead>
                    <tr>
                        <th> ID </th>
                        <th> Placa </th>
                        <th> Capacidad Actual </th>
                        <th> Tipo </th>
                        <th> Acciones </th>
                    </tr>

                </thead>
                <tbody>
                    {
                        this.state.data.map(vehiculo=>{
                            return(
                                <tr>
                                    <td>{vehiculo.idVehiculo}</td>
                                    <td>{vehiculo.placa}</td>
                                    <td>{vehiculo.capacidadActual}</td>
                                    <td>
                                            <CBadge color={this.getBadge(vehiculo.tipo.nombre)}>
                                            {vehiculo.tipo.nombre}
                                            </CBadge>
                                        
                                        </td>
                                    <td>
                                        <button className="btn btn-primary" onClick={()=>{this.seleccionarVehiculo(vehiculo); this.modalInsertar()}}><FontAwesomeIcon icon={faEdit}/></button>
                                        {"     "}
                                        <button className="btn btn-danger"onClick={()=>{this.seleccionarVehiculo(vehiculo); this.setState({modalEliminar: true})}}><FontAwesomeIcon icon={faTrashAlt}/></button>
                                    </td>
                                </tr>
                                

                            )

                        })
                    }
                </tbody>

            </table>
            <Modal isOpen={this.state.modalInsertar}>
            <ModalHeader style={{display: 'block'}}>
                  <span style={{float: 'right'}} onClick={()=>this.modalInsertar()}>x</span>
                </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="id">ID</label>
                            <input className="form-control" type="text" name="idVehiculo" id="idVehiculo" readOnly onChange={this.handleChange} value={form?form.idVehiculo: this.state.data.length+1}/>
                            <br />
                            <label htmlFor="placa">Placa</label>
                            <input className="form-control" type="text" name="placa" id="placa" onChange={this.handleChange} value={form?form.placa: ''}/>
                            <br />
                            <label htmlFor="tipo">Tipo de Camión</label>
                            <br/>
                            <ButtonDropdown size="lg" >
                                <Dropdown isOpen={this.state.dropDownOpen} toggle={this.toggle} >
                                    <DropdownToggle color="primary" caret className="dropdown-toggle">
                                    {this.state.dropDownValue}
                                    </DropdownToggle>
                                    <DropdownMenu className="currency-dropdown" end>
                                        {this.state.tiposV.map(tipoV => (
                                        <DropdownItem onClick={() => this.handleChange2(tipoV)} key={tipoV.idTipo} onChange={this.handleChange} value={form?form.idTipo: ''}>
                                            {tipoV.nombre}
                                        </DropdownItem>
                                        ))}    
                                    </DropdownMenu>
                                </Dropdown>
                            </ButtonDropdown>
                            <br />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        {
                            this.state.tipoModal==='insertar'?
                            <button className="btn btn-success" onClick={()=>this.peticionPost()}>insertar</button>:
                            <button className="btn btn-primary" onClick={()=>this.peticionPatch()}>actualizar</button>
                        }
                        
                        <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>cancelar</button>
                    </ModalFooter>
            </Modal>

            <Modal isOpen={this.state.modalEliminar}>
                <ModalBody>
                Estás seguro que deseas eliminar el vehículo con la placa {form && form.placa}
                </ModalBody>
                <ModalFooter>
                <button className="btn btn-danger" onClick={()=>this.peticionDelete()}>Sí</button>
                <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar: false})}>No</button>
                </ModalFooter>
            </Modal>


            </div>

        )
        
    }
}

export default flota;
