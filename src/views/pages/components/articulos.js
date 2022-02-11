
import React,{Component} from 'react'

import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import {faEdit,faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import {Modal, ModalBody,ModalFooter,ModalHeader} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



const url="http://localhost:1109/api/articulos/";


class Articulos extends Component {

    state={
        data:[],
        modalInsertar:false,
        modalEliminar:false,
        form:{
            id:'',
            codigo:'',
            nombre:'',
            descripcion:'',
            cantidad:'',
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
        delete this.state.form.id;
        await axios.post(url,this.state.form).then(response=>{
            this.modalInsertar();
            this.peticionGet();
        }).catch(error=>{
            console.log(error.message);
        })
    }
    
    peticionPut=async()=>{
        console.log('peticionPut');
        this.state.form.cantidad=parseInt(this.state.form.cantidad)
        await axios.put(url+this.state.form.id,this.state.form)
        .then(response=>{
            var rsp=response.data
            var aux=this.state.data
            aux.map(articulo=>{
                if(articulo.id==this.state.form.id){
                    articulo.codigo=rsp.codigo
                    articulo.nombre=rsp.nombre
                    articulo.descripcion=rsp.descripcion
                    articulo.cantidad=rsp.cantidad
                }
            });
            this.modalInsertar();
            this.peticionGet();
        }).catch(error=>{
            console.log(error.message);
        })
        

    }

    peticionDelete=()=>{
        axios.delete(url+this.state.form.id).then(response=>{
          this.setState({modalEliminar: false});    
          this.peticionGet();
        })
    }

    modalInsertar=()=>{
        this.setState({modalInsertar: !this.state.modalInsertar});
    }

    seleccionarArticulo=(articulo)=>{
        console.log(articulo)
        this.setState({
            tipoModal:'actualizar',
            form:{
                id:articulo.id,
                codigo:articulo.codigo,
                nombre:articulo.nombre,
                descripcion:articulo.descripcion,
                cantidad:articulo.cantidad
            }
        })
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
            <div className="Articulos">
            <br/>
            <button className="btn btn-success"  onClick={()=>{this.setState({form: null, tipoModal: 'insertar'}); this.modalInsertar()}}>Agregar Articulo</button>
            <br/><br/>

            <table className="table">
                <thead>
                    <tr>
                        <th> ID </th>
                        <th> Codigo </th>
                        <th> Nombre </th>
                        <th> Descripcion </th>
                        <th> Cantidad</th>
                        <th> Acciones </th>
                    </tr>

                </thead>
                <tbody>
                    {
                        this.state.data.map(articulo=>{
                            return(
                                <tr>
                                    <td>{articulo.id}</td>
                                    <td>{articulo.codigo}</td>
                                    <td>{articulo.nombre}</td>
                                    <td>{articulo.descripcion}</td>
                                    <td>{articulo.cantidad}</td>
                                    <td>
                                        <button className="btn btn-primary" onClick={()=>{this.seleccionarArticulo(articulo); this.modalInsertar()}}><FontAwesomeIcon icon={faEdit}/></button>
                                        {"     "}
                                        <button className="btn btn-danger"onClick={()=>{this.seleccionarArticulo(articulo); this.setState({modalEliminar: true})}}><FontAwesomeIcon icon={faTrashAlt}/></button>
                                    </td>
                                </tr>
                                

                            )

                        })
                    }
                </tbody>

            </table>
            <Modal isOpen={this.state.modalInsertar}>
                    <ModalHeader style={{display:'block'}}>
                        <span style={{float:'right'}} onClick={()=>this.modalInsertar()} >x</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="id">ID</label>
                            <input className="form-control" type="text" name="id" id="id" readOnly onChange={this.handleChange} value={form?form.id: this.state.data.length+1}/>
                            <br />
                            <label htmlFor="codigo">Codigo</label>
                            <input className="form-control" type="text" name="codigo" id="codigo" onChange={this.handleChange} value={form?form.codigo: ''}/>
                            <br />
                            <label htmlFor="nombre">Nombre</label>
                            <input className="form-control" type="text" name="nombre" id="nombre" onChange={this.handleChange} value={form?form.nombre: ''}/>
                            <br />
                            <label htmlFor="descripcion">Descripcion</label>
                            <input className="form-control" type="text" name="descripcion" id="descripcion" onChange={this.handleChange} value={form?form.descripcion: ''}/>
                            <br />
                            <label htmlFor="cantidad">Cantidad</label>
                            <input className="form-control" type="text" name="cantidad" id="cantidad" onChange={this.handleChange} value={form?form.cantidad: ''}/>
                            <br />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        {
                            this.state.tipoModal==='insertar'?
                            <button className="btn btn-success" onClick={()=>this.peticionPost()}>Insertar</button>:
                            <button className="btn btn-primary" onClick={()=>this.peticionPut()}>actualizar</button>
                        }
                        
                        <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>cancelar</button>
                    </ModalFooter>
            </Modal>

            <Modal isOpen={this.state.modalEliminar}>
                <ModalBody>
                ¿Estás seguro que deseas eliminar el articulo con codigo {form && form.codigo}?
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

export default Articulos;
