
import React,{Component} from 'react'

import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import {faEdit,faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import { Modal, ModalBody,ModalFooter,ModalHeader} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const url="http://3.231.34.221:8080/api/tipoVehiculo/";

class Tipo extends Component {
    
    state={
        data:[],
        modalInsertar:false,
        modalEliminar:false,
        tipoModal:'',
        form:{
            idTipo:'',
            pesoBruto:0.0,   
            capacidad:0.0,
            pesoCarga:0.0,
            velocidad:0.0,
            cantidad:0,
            estado:'1'
        }
        
    }

    peticionGet=()=>{
        axios.get(url).then(response=>{
            console.log(response.data);
            this.setState({data:response.data});
        }).catch(error=>{
            console.log(error.message);
        })
    }

    peticionPatch=()=>{
        axios.patch(url+this.state.form.idTipo,this.state.form).then(response=>{
            console.log(response.data);
            this.modalInsertar();
            this.peticionGet();
        }).catch(error=>{
            console.log(error.message);
        })
    }
    
    peticionPost=async()=>{
        delete this.state.form.idTipo;
        console.log(this.state.form);
       await axios.post(url,this.state.form).then(response=>{
          this.modalInsertar();
          this.peticionGet();
        }).catch(error=>{
          console.log(error.message);
        })
    }
      

    peticionDelete=()=>{
        axios.delete(url+this.state.form.idTipo).then(response=>{
          this.setState({modalEliminar: false});    
          this.peticionGet();
        })
    }

    modalInsertar=()=>{
        this.setState({modalInsertar: !this.state.modalInsertar});
    }

    seleccionarTipo=(tipo)=>{
        this.setState({
            tipoModal:'actualizar',
            form:{
                idTipo:tipo.idTipo,
                pesoBruto:parseFloat(tipo.pesoBruto),
                pesoCarga:parseFloat(tipo.pesoCarga),
                velocidad:parseFloat(tipo.velocidad),
                cantidad:parseInt(tipo.cantidad),
                capacidad:parseFloat(tipo.capacidad),
            }
        })
    }

    changeValue(e) {
        this.setState({dropDownValue: e.currentTarget.textContent})
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

    componentDidMount(){
        this.peticionGet();
    }
    render(){
        const{form}=this.state;
        return (
            <div className="Tipo">
            <br/>
            <button className="btn btn-success"  onClick={()=>{this.setState({form: null, tipoModal: 'insertar'}); this.modalInsertar()}}>Agregar Tipo de Camión</button>
            <br/><br/>

            <table className="table">
                <thead>
                    <tr>
                        <th> ID </th>
                        <th> Peso Bruto (ton)</th>
                        <th> Carga GLP(m3)</th>
                        <th> Peso Carga (ton) </th>
                        <th> Velocidad (Km/h) </th>
                        <th> Unidades </th>
                        <th> Acciones </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.data.map(tipoV=>{
                            return(
                                <tr> 
                                    <td> {tipoV.idTipo}</td>
                                    <td> {tipoV.pesoBruto}</td>
                                    <td> {tipoV.capacidad}</td>
                                    <td> {tipoV.pesoCarga}</td>
                                    <td> {tipoV.velocidad}</td>
                                    <td> {tipoV.cantidad}</td>
                                    <td>
                                        <button className="btn btn-primary" onClick={()=>{this.seleccionarTipo(tipoV); this.modalInsertar()}}><FontAwesomeIcon icon={faEdit}/></button>
                                        {"     "}
                                        <button className="btn btn-danger"onClick={()=>{this.seleccionarTipo(tipoV); this.setState({modalEliminar: true})}}><FontAwesomeIcon icon={faTrashAlt}/></button>
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
                        <input className="form-control" type="text" name="idTipo" id="idTipo" readOnly onChange={this.handleChange} value={form?form.idTipo: this.state.data.length+1}/>
                        <br />
                        <label htmlFor="nombre">Peso Bruto</label>
                        <input className="form-control" type="number" name="pesoBruto" id=" pesoBruto" onChange={this.handleChange} value={form?form.pesoBruto:''}/>
                        <br />
                        <label htmlFor="nombre">Carga GLP (m3)</label>
                        <input className="form-control" type="number" name="capacidad" id="capacidad" onChange={this.handleChange} value={form?form.capacidad:''}/>
                        <br />
                        <label htmlFor="nombre">Peso Carga (ton)</label>
                        <input className="form-control" type="number" name="pesoCarga" id=" pesoCarga" onChange={this.handleChange} value={form?form.pesoCarga:''}/>
                        <br />
                        <label htmlFor="nombre">Velocidad (Km/h)</label>
                        <input className="form-control" type="number" name="velocidad" id="velocidad" onChange={this.handleChange} value={form?form.velocidad:''}/>
                        <br />
                        <label htmlFor="nombre">Unidades</label>
                        <input className="form-control" type="number" name="cantidad" id="cantidad" onChange={this.handleChange} value={form?form.cantidad:''}/>
                        <br />
                    </div>
                </ModalBody>
                    <ModalFooter>
                        {this.state.tipoModal==='insertar'?
                            <button className="btn btn-success" onClick={()=>this.peticionPost()}>
                            Insertar
                        </button>: <button className="btn btn-primary" onClick={()=>this.peticionPatch()}>
                            Actualizar
                        </button>
                        }
                            <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>Cancelar</button>
                    </ModalFooter>
            </Modal>

            <Modal isOpen={this.state.modalEliminar}>
            <ModalBody>
               Estás seguro que deseas eliminar al tipo de vehiculo {form && form.idTipo}
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

export default Tipo;
