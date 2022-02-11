import React,{Component} from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import {faEdit,faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import { DropdownMenu,ButtonDropdown,Dropdown,DropdownItem,DropdownToggle,Modal, ModalBody,ModalFooter,ModalHeader} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CBadge } from '@coreui/react'
import './plantas.scss';

const url="http://3.231.34.221:8080/api/planta/";
class plantas extends Component {

    state={
        data:[],
        modalInsertar:false,
        modalEliminar:false,
        tipoModal:'',
        dropDownOpen:false,
        dropDownValue: 'Elija el tipo de Planta',
        form:{
            idPlanta:'',
            tipo:1,
            capacidad:'',
            x:'',
            y:''
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

    peticionPost=async()=>{
        delete this.state.form.idPlanta;
        console.log(this.state.form);
       await axios.post(url,this.state.form).then(response=>{
          this.modalInsertar();
          this.peticionGet();
        }).catch(error=>{
          console.log(error.message);
        })
    }

    
    peticionDelete=()=>{
        axios.delete(url+this.state.form.idPlanta).then(response=>{
          this.setState({modalEliminar: false});
          this.peticionGet();
        })
    }


    modalInsertar=()=>{
        this.setState({modalInsertar: !this.state.modalInsertar});
    }

    toggle = () => {
        this.setState({
           dropDownOpen: !this.state.dropDownOpen
        })
    }


    changeValue(e) {
        this.setState({
            dropDownValue: e.currentTarget.textContent,
        })
    }

    handleChange2 = (code,val) => {
        this.setState({
            dropDownValue: code
           
        })
        if(val===1){
            this.setState({
                form:{
                    ...this.state.form,
                    tipo:1
                }
            })
        }else{
            this.setState({
                form:{
                    ...this.state.form,
                    tipo:2
                }
            })
        }
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

    peticionPatch=()=>{
        axios.patch(url+this.state.form.idPlanta,this.state.form).then(response=>{
            console.log(response.data);
            this.modalInsertar();
            this.peticionGet();
        }).catch(error=>{
            console.log(error.message);
        })
    }
    

    handleDropDown = e => {
        e.persist();
        this.setState({form:{
                ...this.state.form,
                [e.target.name]: e.target.value
              }},);
    }
    componentDidMount(){
       this.peticionGet();
        
    }
    getBadge=(tipo)=> {
        switch (tipo) {
          case 1: return 'primary'
          case 2: return 'warning'
        }
    }
    seleccionarPlanta=(planta)=>{
        console.log(planta)
       if(planta.tipo===1){
        this.setState({
            dropDownValue:'Planta Principal'
        })
       } else{
        this.setState({
            dropDownValue:'Planta Intermedia'
        })
           
       }

        this.setState({
            tipoModal:'actualizar',
            form:{
                idPlanta:planta.idPlantas,
                tipo:planta.tipo,
                capacidad:planta.capacidad,
                x:planta.x,
                y:planta.y
            }
        })
    }
    render(){
        const{form}=this.state;
        return (
            <div className="plantas">
            <br/>
            <button className="btn btn-success"  onClick={()=>{this.setState({form: null, tipoModal: 'insertar'}); this.modalInsertar()}}>Agregar Planta</button>
            <br/><br/>

            <table className="table">
                <thead>
                    <tr>
                        <th> ID </th>
                        <th> Tipo </th>
                        <th> Capacidad de Almacen </th>
                        <th> X </th>
                        <th> Y </th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.data.map(almacen=>{
                            return(
                                <tr>
                                    <td>{almacen.idPlantas}</td>
                                    <td> 
                                        {almacen.tipo===1?
                                            <CBadge  color={this.getBadge(almacen.tipo)}>
                                                Principal
                                            </CBadge>:
                                            < CBadge color={this.getBadge(almacen.tipo)}>
                                                Intermedia
                                            </CBadge>
                                        }
                                    </td>
                                    <td>{almacen.capacidad}</td>
                                    <td>{almacen.x}</td>
                                    <td>{almacen.y}</td>
                                    <td>
                                        <button className="btn btn-primary" onClick={()=>{this.seleccionarPlanta(almacen); this.modalInsertar()}}><FontAwesomeIcon icon={faEdit}/></button>
                                        {"     "}
                                        <button className="btn btn-danger"onClick={()=>{this.seleccionarPlanta(almacen); this.setState({modalEliminar: true})}}><FontAwesomeIcon icon={faTrashAlt}/></button>
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
                            <input className="form-control" type="text" name="idPlanta" id="idPlanta" readOnly onChange={this.handleChange} value={form?form.idPlanta: this.state.data.length+1}/>
                            <br />
                            <label htmlFor="tipo">Tipo de Planta</label>
                            <br/>
                            
                            <ButtonDropdown size="lg" >
                                <Dropdown isOpen={this.state.dropDownOpen} toggle={this.toggle} >
                                    <DropdownToggle color="primary" caret className="dropdown-toggle">
                                    {this.state.dropDownValue}
                                    </DropdownToggle>
                                    <DropdownMenu className="currency-dropdown" end>
                                        <DropdownItem  key={1} onClick={()=>this.handleChange2("Planta Principal",1)} onChange={this.handleChange} value={form?form.tipo:''}>
                                            Planta Principal
                                        </DropdownItem>    
                                        <DropdownItem  key={2} onClick={()=>this.handleChange2("Planta Intermedia",2)} onChange={this.handleChange} value={form?form.tipo:''}>
                                            Planta Intermedia
                                        </DropdownItem>    
                                    </DropdownMenu>
                                </Dropdown>
                            </ButtonDropdown>
                            <br />
                            <br />
                            <label htmlFor="placa">Capacidad</label>
                            <input className="form-control" type="number" name="capacidad" id="capacidad" onChange={this.handleChange} value={form?form.capacidad:''}/>
                            <br />
                            <label htmlFor="placa">Coordenada X</label>
                            <input className="form-control" type="number" name="x" id="x" onChange={this.handleChange} value={form?form.x: ''}/>
                            <br />
                            <label htmlFor="placa">Coordenada Y</label>
                            <input className="form-control" type="number" name="y" id="y" onChange={this.handleChange} value={form?form.y: ''}/>
                            <br />
                            
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        {this.state.tipoModal==='insertar'?
                            <button className="btn btn-success" onClick={()=>this.peticionPost()}>Insertar</button>:
                            <button className="btn btn-primary" onClick={()=>this.peticionPatch()}>Actualizar</button>
                        }
                        
                        <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>cancelar</button>
                    </ModalFooter>
            </Modal>

            <Modal isOpen={this.state.modalEliminar}>
                <ModalBody>
                Estás seguro que deseas eliminar la planta con id {form && form.idPlanta}
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
export default plantas;

