/* eslint-disable */
import React, { Component, Fragment  } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { MainContainer } from 'src/components/main-container/main-container';
import { MainContent } from 'src/components/main-content/main-content'
import './tiempo_real.scss';
Image
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faIndustry, faTruckMoving, faHome, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { Input, InputGroup, Modal, ModalBody, ModalFooter, ModalHeader, Table, Offcanvas, OffcanvasHeader, OffcanvasBody } from 'reactstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import {
  CCol,
  CRow,
  CButton,
  CTooltip,
  CCardHeader,
  CLabel,
  CContainer,
  CBadge,
} from '@coreui/react'
import axios from 'axios';
import { touchRippleClasses } from '@mui/material';

const urlAlgoritmo = "http://localhost:8080/api/simulacion/rutas";
const urlA2 = "http://localhost:8080/api/rutas";
const urlB = "http://localhost:8080/api/simulacion/uploadCallesBloqueadas"
const urlBD = "http://localhost:8080/api/bloqueos/dia"
const urlPedido = "http://localhost:8080/api/order/";
const urlAveria = "http://localhost:8080/api/vehicle/averia"

toast.configure();
class tiempo_real extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalDoc: true,
      modalInsertar: false,
      form: {
        x: '',
        y: '',
        minFaltantes: '',
        cantidad: '', // en m3
        fechaPedido: '',
      },
      form2: {
        idVehiculo: '',
        pedidos: []
      },
      data: [],
      dataBloqueos: [],
      actualVehiclePositions: [],
      intervalId: 0,
      intervalPt: 0,
      BlockIntervalId: 0,
      initialWareHouses: [],
      vehiclePositions: [],
      blockPositions: [],
      time: 0,
      arr: [],
      actualizacion: 0,
      retor: [],
      showOf: false,
      vehi: [],
      velSimulacion: 1000,
      lped: [],
      pedidos: [],
      xBloqueo: [],
      auxV: [],
      yBloqueo: [],
      tiemposBloqueo: [],
      lped: [],
      botonPlay: 0,
      listaR: [],
      enable: 0,
      cargaArchivo: 0,
      vehiculos: []
    }
  }

  peticionPost = async () => {

    await axios.post(urlPedido, this.state.form).then(response => {
      this.modalInsertar();
    }).catch(error => {
      console.log(error.message);
    })
  }

  handleChange = async e => {
    e.persist();
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    });
    console.log(this.state.form);
  }

  peticionGetBloqueo = () => {

    axios.get(urlBD).then(response => {
      console.log(response);
      this.setState({ dataBloqueos: response.data }, () => {

        for (var i in this.state.dataBloqueos.Bloqueos) {
          if (this.state.dataBloqueos.Bloqueos.hasOwnProperty(i)) {
            this.state.xBloqueo.push(i, this.state.dataBloqueos.Bloqueos[i].x);
            this.state.yBloqueo.push(i, this.state.dataBloqueos.Bloqueos[i].y);
            this.state.tiemposBloqueo.push(i, this.state.dataBloqueos.Bloqueos[i].tiempos);

          }
        }

        if (this.state.xBloqueo.length >= 1) {
          var k = 0;
          for (var i = 1; i < this.state.xBloqueo.length; i += 2) {
            this.state.blockPositions.push(
              {
                id: k,
                activo: false,
                xPos: this.state.xBloqueo[i],
                yPos: this.state.yBloqueo[i],
                posFecha: 0
              });
            k++;
          }
          console.log(this.state.blockPositions);
        }


      })
    }).catch(error => {
      console.log(error.message);
    })
  }


  peticionGetVehiculos = () => {
    const urlVehiculos = "http://localhost:8080/api/vehicle/";
    axios.get(urlVehiculos).then(response => {
      console.log("Pidiendo los vehiculos disponibles")
      this.setState({ vehiculos: response.data }, () => {
        console.log("hola :c");
        console.log(this.state.vehiculos.length);

        for (let index = 1; index < this.state.vehiculos.length; index++) {
          this.state.vehiclePositions.push(
            {
              id: index,
              xPos: 12,
              yPos: 8,
              posRec: 0,
              posRetor: 0,
              regreso: false,
              xPed: 0,
              yPed: 0,
              posPed: 0,
              posFraccion: 0,
              posicionActualizada: false,
              placa: '',
              capacidadActual: 0,
              tipo: '',
              rutaV: [],
              retornoV: [],
              verRuta: false,
              averiado: false,
              tiempoAveriado: 300,
              lapsoAveria: 0,
              lped: [],
              idRuta: -1,
              retrasoVehiculo: 10,
              rutaCambiada: false,
            });

          this.state.listaR.push(-1);
          this.state.arr.push(index, null);
          this.state.retor.push(index, null);
          this.state.pedidos.push(index, null);
          this.state.auxV.push(index, this.state.vehiculos[index - 1]);
        }


      })
    })

  }
  peticionGet = () => {
    axios.get(urlA2).then(response => {
      console.log("Pidiendo rutas de vehiculos")
      this.setState({ data: response.data }, () => {

        for (var i in this.state.data.Rutas) {
          if (this.state.data.Rutas.hasOwnProperty(i)) {
            if (!this.state.listaR.includes(this.state.data.Rutas[i].id)) {

              let id = this.state.data.Rutas[i].vehiculo.idVehiculo;
              let index = this.state.arr.indexOf(id);
              this.state.listaR[id - 1] = this.state.data.Rutas[i].id;
              this.state.arr[index + 1] = this.state.data.Rutas[i].recorrido;
              this.state.retor[index + 1] = this.state.data.Rutas[i].retorno;
              this.state.pedidos[index + 1] = this.state.data.Rutas[i].pedidos;
              this.state.auxV[index + 1] = this.state.data.Rutas[i].vehiculo;
            }
          }
        }

      });

    }).catch(error => {
      console.log(error.message);
    })
  }

  seleccionarVehiculo = (vehiculo) => {
    this.setState({
      form: {
        placa: vehiculo.placa,
        capacidadActual: vehiculo.capacidadActual,
        nombre: vehiculo.nombre
      }
    })
  }

  insertarPedido() {
    const fecha = new Date().toISOString().slice(0, -5);
    console.log(fecha);
    this.setState({
      form: {
        ...this.state.form,
        fechaPedido: fecha
      }
    })
    this.peticionPost();
    this.setState({
      botonPlay: this.state.botonPlay + 1
    })
  }

  getRuta = (item) => {

    axios.get(urlA2).then(response => {
      this.setState({ data: response.data }, () => {

        for (var i in this.state.data.Rutas) {
          if (this.state.data.Rutas.hasOwnProperty(i)) {

            let id = this.state.data.Rutas[i].vehiculo.idVehiculo;
            let index = this.state.arr.indexOf(id);
            if (item.id == id) {

              if (item.idRuta !== this.state.listaR[id - 1]) {

                let id = this.state.data.Rutas[i].vehiculo.idVehiculo;
                let index = this.state.arr.indexOf(id);
                this.state.listaR[id - 1] = this.state.data.Rutas[i].id;
                this.state.arr[index + 1] = this.state.data.Rutas[i].recorrido;
                this.state.retor[index + 1] = this.state.data.Rutas[i].retorno;
                this.state.pedidos[index + 1] = this.state.data.Rutas[i].pedidos;
                this.state.auxV[index + 1] = this.state.data.Rutas[i].vehiculo;
                item.idRuta = this.state.data.Rutas[i].id;
                item.rutaCambiada = true;
              }

            }
          }
        }

      });

    }).catch(error => {
      console.log(error.message);
    })
  }


  componentDidMount() {
    console.log("estoy en el component did mount");
    // let subido = window.sessionStorage.getItem("subidaArchivo");
    let subido = 1;
    if (subido !== null) {
      if (subido) {


        this.peticionGetBloqueo();
        this.peticionGetVehiculos();


        const initialWareHouses = [
          {
            x: 12,
            y: 8,
            id: 1,
          },
          {
            x: 42,
            y: 42,
            id: 2,
          },
          {
            x: 63,
            y: 3,
            id: 3,
          }
        ];

        const initialVehiclePositions = this.state.vehiclePositions;

        this.state.intervalPt = setInterval(() => {
          this.peticionGet();
          console.log("Peticion Get hecha");
        }, 10000);

        this.state.intervalId = setInterval(() => {
          initialVehiclePositions.map((item) => {
            if (!item.averiado) {

              //Primero actualizamos la posicion del vehiculo para ver su ubicacion en tiempo real
              if (!item.posicionActualizada && !item.regreso && this.state.arr.length >= 1) {
                let today = new Date(); // fecha de hoy 
                const movimientos = this.state.arr[item.id * 2 - 1];
                const pedidosVehiculo = this.state.pedidos[item.id * 2 - 1];


                item.posicionActualizada = true;
              }


              var o = 1;
              if (this.state.auxV.length >= 1 && o <= this.state.auxV.length) {
                for (var x = 0; x < this.state.auxV.length / 2; x++) {
                  if (this.state.auxV[o]) {
                    initialVehiclePositions[x].placa = this.state.auxV[o].placa;
                    initialVehiclePositions[x].capacidadActual = this.state.auxV[o].capacidadActual;
                    // if (this.state.auxV[o].tipo !== null)
                    //   initialVehiclePositions[x].tipo = this.state.auxV[o].tipo.nombre;
                    initialVehiclePositions[x].consumoPetroleo = this.state.auxV[o].consumoPetroleo;
                    initialVehiclePositions[x].lped = this.state.pedidos[o];
                    o += 2;
                  }

                }
              }

              let hayRuta = false;

              if (item.posicionActualizada && !item.regreso && this.state.arr.length >= 1) {
                item.idRuta = this.state.listaR[item.id - 1];
                let index = this.state.arr.indexOf(item.id);
                if (index !== -1) hayRuta = true;
                const movimientos = this.state.arr[index + 1];
                console.log("movimientos : ", movimientos);
                item.rutaV = movimientos
                const pedidosVehiculo = this.state.pedidos[index + 1];
                if (hayRuta && movimientos && movimientos.length > item.posRec) {
                  let movimiento = movimientos[item.posRec];
                  let pedidoVehiculo;
                  if (movimiento.x != item.xPos) {
                    if (movimiento.x > item.xPos) item.xPos += 0.10;
                    else item.xPos -= 0.10;
                  }

                  if (movimiento.y != item.yPos) {
                    if (movimiento.y > item.yPos) item.yPos += 0.10;
                    else item.yPos -= 0.10;
                  }


                  item.posFraccion += 1;

                  if (item.posFraccion == 10) {
                    item.xPos = movimiento.x;
                    item.yPos = movimiento.y;
                    item.posRec += 1;
                    item.posFraccion = 0;
                  }
                  if (pedidosVehiculo.length > item.posPed) {
                    pedidoVehiculo = pedidosVehiculo[item.posPed];
                    item.xPed = pedidoVehiculo.x;
                    item.yPed = pedidoVehiculo.y;

                    if (item.xPos === item.xPed && item.yPos === item.yPed) {
                      item.lped[item.posPed].estado = 1;
                      item.posPed += 1;
                    }
                  }


                  if (movimientos.length === item.posRec) item.regreso = true;
                }

              }

              if (item.regreso && this.state.retor.length >= 1) {
                let index = this.state.arr.indexOf(item.id);
                if (index !== -1) hayRuta = true;
                const movimientos2 = this.state.retor[index + 1];
                if (hayRuta && movimientos2 && movimientos2.length > item.posRetor) {
                  let movimiento2 = movimientos2[item.posRetor];
                  if (movimiento2.x != item.xPos) {
                    if (movimiento2.x > item.xPos) item.xPos += 0.10;
                    else item.xPos -= 0.10;
                  }
                  if (movimiento2.y != item.yPos) {
                    if (movimiento2.y > item.yPos) item.yPos += 0.10;
                    else item.yPos -= 0.10;
                  }

                  item.posFraccion += 1;
                  if (item.posFraccion == 10) {
                    item.xPos = movimiento2.x;
                    item.yPos = movimiento2.y;
                    item.posRetor += 1;
                    item.posFraccion = 0;
                  }

                }

              }

              if (item.regreso && (item.xPos == 12) && (item.yPos == 8)) {
                console.log("regreso aqui");
                item.retrasoVehiculo -= 1;
                if (item.retrasoVehiculo == 0) {
                  this.getRuta(item);
                  if (item.rutaCambiada && !item.finSimulacion) {
                    console.log("se actualiza la ruta :D");
                    item.posRec = 0;
                    item.posRetor = 0;
                    item.regreso = false;
                    item.xPed = 0;
                    item.yPed = 0;
                    item.posPed = 0;
                    item.posFraccion = 0;
                    item.posicionActualizada = true;
                    item.retrasoVehiculo = 10;
                    item.rutaCambiada = false;
                  }

                  item.retrasoVehiculo = 10;

                }
              }


            }

            if (item.averiado) {
              console.log("se averio el carro");
              item.tiempoAveriado -= 1;
              item.lPed = [];
              if (item.tiempoAveriado == 0) {
                item.xPos = 12;
                item.yPos = 8;
              }

            }

          })
          this.setState({
            initialWareHouses,
            vehiclePositions: initialVehiclePositions,

          });

        }, 6000);
      }
    } else {
      console.log("Ocurrio un problema");
    }



    const initialBlockPositions = this.state.blockPositions;


    this.state.BlockIntervalId = setInterval(() => {
      initialBlockPositions.map((bloqueo) => {
        if (this.state.xBloqueo.length >= 1) {



          let fechas = this.state.tiemposBloqueo[bloqueo.id * 2 + 1];
          if (fechas && fechas.length > bloqueo.posFecha) {
            let fechasBloqueo = fechas[bloqueo.posFecha];
            let fechaInicio = fechasBloqueo.inicio;
            let fechaFin = fechasBloqueo.fin;

            let anio = parseInt(fechaInicio.slice(0, 4)); // año
            let mes = parseInt(fechaInicio.slice(5, 7)); // mes
            let dia = parseInt(fechaInicio.slice(8, 10)); // dia
            let hora = parseInt(fechaInicio.slice(11, 13)); // hora
            let minuto = parseInt(fechaInicio.slice(14, 16)); // minuto
            let segundo = parseInt(fechaInicio.slice(17, 19)); // segundo

            let anio2 = parseInt(fechaFin.slice(0, 4)); // año
            let mes2 = parseInt(fechaFin.slice(5, 7)); // mes
            let dia2 = parseInt(fechaFin.slice(8, 10)); // dia
            let hora2 = parseInt(fechaFin.slice(11, 13)); // hora
            let minuto2 = parseInt(fechaFin.slice(14, 16)); // minuto
            let segundo2 = parseInt(fechaFin.slice(17, 19)); // segundo

            let fechaAux = new Date(2021, 11, dia, hora, minuto, segundo);
            let fechaAux2 = new Date(2021, 11, dia2, hora2, minuto2, segundo2);  // 10 = mes = noviembre

            var today = new Date();
            if ((today.getTime() >= fechaAux.getTime()) && (today.getTime() <= fechaAux2.getTime())) {
              console.log("pintar bloqueo :D");
              bloqueo.activo = true;

            } else {
              if (today.getTime() >= fechaAux2.getTime()) {
                bloqueo.activo = false;
                bloqueo.posFecha += 1;
              }
            }
          }
        }
      })
      this.setState({
        blockPositions: initialBlockPositions,
      });
    }, 200)




  }

  componentWillUnmount() {

    const intervalId = this.state.intervalId;
    const BlockIntervalId = this.state.BlockIntervalId;
    const intervalPt = this.state.intervalPt;
    clearInterval(intervalId);
    clearInterval(BlockIntervalId);
    clearInterval(intervalPt);
  }

  modalArchivo() {
    this.setState({
      modalDoc: !this.state.modalDoc
    })
    window.sessionStorage.setItem("subidaArchivo", true)

  }

  handleClose() {
    this.setState({ showOf: !this.state.showOf });
  }
  handleShow = (item) => {
    this.setState({ vehi: item });
    this.setState({ lped: item.lped });
    this.setState({ showOf: !this.state.showOf });
  }

  getBadge(estado) {
    switch (estado) {
      case 1: return 'primary'
      case 0: return 'info'
    }
  }

  handleRuta = (vehiculo) => {
    vehiculo.verRuta = !vehiculo.verRuta;
  }

  handleAveria = (vehiculo) => {

    /*
    form2: {
        idVehiculo: '',
        pedidos: []
      }
    */
    console.log(vehiculo);

    if (this.state.form2.idVehiculo !== '') {
      this.state.form2.idVehiculo = '';
      this.state.form2.pedidos = [];
    }

    let lPedidos = vehiculo.lped;
    vehiculo.averiado = true;
    this.state.form2.idVehiculo = vehiculo.id;
    for (var x = vehiculo.posPed; x < lPedidos.length; x++) {
      console.log(vehiculo.lped[x].id)
      this.state.form2.pedidos = this.state.form2.pedidos.concat(lPedidos[x].id)
    }

    this.posteoAveria(vehiculo);
  }

  posteoAveria = async (vehiculo) => {

    await axios.post(urlAveria, this.state.form2).then(response => {
      console.log("vehiculo Averiado : ", vehiculo.id);
      console.log(this.state.form2);
      console.log(response);
    }).catch(error => {
      console.log("No se ha registrado la averia del vehiculo: ", vehiculo.id);
    })
  }


  modalInsertar() {
    this.setState({
      modalInsertar: !this.state.modalInsertar
    })
  }

  notify = (val) => {
    console.log("tasdasd")
    if (val === 1) {
      toast("Se cargó el archivo de pedidos correctamente");

    }
    if (val === 2) { toast("Se cargó el archivo de bloqueos correctamente"); }
  }

  uploadJSONFiles(event) {
    event.preventDefault();
    console.log(event)
    let formData = new FormData();
    formData.append('file', event.target.files[0], event.target.files[0].name);

    console.log("archivo de Pedido")
    axios.post(urlB, formData).then(response => {
      console.log("se subio correctamente el archivo");
      this.setState({
        cargaArchivo: 1
      })
      this.notify(2);
    }).catch(error => {
      toast.error("Se subió un archivo inválido, por favor revisar.")
      console.log(error.message);
    })

    this.setState({ enable: this.state.enable + 1 })
  }

  render() {
    const { blockPositions, showOf, vehiclePositions, initialWareHouses, vehi, lped, form } = this.state;
    const rutaVehiculo = vehi.rutaV ? vehi.rutaV.map((item, index) => (
      <Fragment key={item.id}>
          <li>
              <span>({item.x} - {item.y})</span>
          </li>
      </Fragment>
  )) : "No hay ruta"
    const distanceNode = 16;
    return (
      <div>

        <CRow>
          <CCol md="9">
            <MainContainer className="tracking">
              <MainContent>
                <TransformWrapper velocityAnimation={{ disabled: false }}>
                  <TransformComponent>
                    <div className="tracking__body__map">
                      <div className="tracking__body__map__container">
                        <div className="tracking__body__map__container__grid">
                          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              <pattern
                                id="smallGrid"
                                width="16"
                                height="16"
                                patternUnits="userSpaceOnUse"
                              >
                                <path
                                  d="M 16 0 L 0 0 0 16"
                                  fill="none"
                                  stroke="#454545"
                                  strokeWidth="4"
                                />
                              </pattern>
                              <pattern id="grid" width="160" height="160" patternUnits="userSpaceOnUse">
                                <rect width="160" height="160" fill="url(#smallGrid)" />
                                <path d="M 160 0 L 0 0 0 160" fill="none" stroke="gray" strokeWidth="4" />
                              </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid)" />
                          </svg>
                          {/* POSICIONES DE LOS VEHICULOS Y ALMACENES*/}
                          <div className="tracking__body__map__container__elements">
                            <>
                              {vehiclePositions && vehiclePositions.map(item => (
                                <div>
                                  <CTooltip
                                    key={item.id}
                                    content={`Cisterna: X=${item.xPos % 1 === 0 ? item.xPos : item.xPos.toFixed(1)
                                      } Y=${item.yPos % 1 === 0 ? item.yPos : item.yPos.toFixed(1)}`}
                                    placement="top-start"
                                  >

                                    <CButton block color="black" key={item.id + 500} size={'sm'} style={{
                                      width: '8px',
                                      position: 'absolute',
                                      left: item?.xPos * distanceNode - 16,
                                      bottom: item?.yPos * distanceNode - 12,
                                    }}>
                                      {item.regreso && !item.averiado &&
                                        <FontAwesomeIcon icon={faTruckMoving} style={{ color: 'yellow ' }} onClick={() => this.handleShow(item)} />}
                                      {!item.regreso && !item.averiado && item.placa &&
                                        <FontAwesomeIcon icon={faTruckMoving} style={{ color: 'silver' }} onClick={() => this.handleShow(item)} />}
                                      {item.averiado &&
                                        <FontAwesomeIcon icon={faTruckMoving} style={{ color: 'red' }} onClick={() => this.handleShow(item)} />}
                                    </CButton>

                                  </CTooltip>
                                  {!item.averiado && 
                                    <CTooltip
                                      key={item.id + 100}
                                      content={`Pedido: X=${item.xPed % 1 === 0 ? item.xPed : item.xPed.toFixed(1)
                                        } Y=${item.yPed % 1 === 0 ? item.yPed : item.yPed.toFixed(1)}`}
                                      placement="top-start"
                                    >

                                      <CButton block color="black" size={'sm'} style={{
                                        width: '8px',
                                        position: 'absolute',
                                        left: item?.xPed * distanceNode - 16,
                                        bottom: item?.yPed * distanceNode - 12,
                                      }}>
                                        {/* {item.regreso &&
                                  <FontAwesomeIcon icon={faHome} style={{color:'yellow '}}/>} */}
                                        {!item.regreso &&
                                          <FontAwesomeIcon icon={faHome} style={{ color: 'green' }} />}
                                      </CButton>

                                    </CTooltip>
                                  
                                  }

                                  {item.rutaV && !item.regreso && item.rutaV.map(nodo => (

                                    <CButton style={{ zIndex: '-1' }} disabled block color="black" size={'sm'} style={{
                                      width: '8px',
                                      position: 'absolute',
                                      left: nodo?.x * distanceNode - 16,
                                      bottom: nodo?.y * distanceNode - 12,
                                    }}>
                                      {item.verRuta &&
                                        <FontAwesomeIcon icon={faCircle} style={{ color: '#DDDDDD' }} />}
                                    </CButton>

                                  ))}

                                  {item.retornoV && item.regreso && item.retornoV.map(nodo => (

                                    <CButton style={{ zIndex: '-1' }} disabled block color="black" key={item.id} size={'sm'} style={{
                                      width: '8px',
                                      position: 'absolute',
                                      left: nodo?.x * distanceNode - 16,
                                      bottom: nodo?.y * distanceNode - 12,
                                    }}>
                                      {item.verRuta &&
                                        <FontAwesomeIcon icon={faCircle} style={{ color: '#DDDDDD' }} />}
                                    </CButton>

                                  ))}

                                </div>

                              ))
                              }
                              {blockPositions && blockPositions.map(bloqueo => (
                                <CTooltip
                                  key={bloqueo.id}
                                  content={`Bloqueo: X=${bloqueo.xPos % 1 === 0 ? bloqueo.xPos : bloqueo.xPos.toFixed(1)
                                    } Y=${bloqueo.yPos % 1 === 0 ? bloqueo.yPos : bloqueo.yPos.toFixed(1)}`}
                                  placement="top-start"
                                >

                                  <CButton block color="black" key={bloqueo.id + 500} size={'sm'} style={{
                                    width: '8px',
                                    position: 'absolute',
                                    left: bloqueo?.xPos * distanceNode - 16,
                                    bottom: bloqueo?.yPos * distanceNode - 12,
                                  }}>
                                    {bloqueo.activo &&
                                      <FontAwesomeIcon icon={faExclamationTriangle} style={{ color: 'Blue ' }} />}
                                  </CButton>

                                </CTooltip>
                              ))
                              }
                              {initialWareHouses && initialWareHouses.map((warehouse) => (
                                <CTooltip
                                  key={warehouse.id}
                                  content={`Posición: X=${warehouse?.x} Y=${warehouse?.y}`}
                                  placement="top-start"
                                >
                                  <CButton block color="black" key={warehouse.id} style={{
                                    width: '8px',
                                    position: 'absolute',
                                    left: warehouse?.x * distanceNode - 20,
                                    bottom: warehouse?.y * distanceNode - 16,
                                  }}>
                                    <FontAwesomeIcon icon={faIndustry} style={{ color: 'orange' }} />
                                  </CButton>
                                </CTooltip>
                              ))
                              }
                            </>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TransformComponent>
                </TransformWrapper>
              </MainContent>
            </MainContainer>
          </CCol>
          <CCol md="3">

            <CRow>
              <CCol >
                {this.state.enable >= 1 ?
                  <CButton className="btn btn-primary" onClick={() => this.modalInsertar()}>
                    Agregar Pedido</CButton> :
                  <CButton className="btn btn-primary" onClick={() => this.modalInsertar()}>Agregar Pedido</CButton>
                }


                <br /><br />
              </CCol>
            </CRow>


            <CContainer style={{ background: 'Cyan' }}>
              <CRow>
                <CCardHeader>
                  <CCol>
          
                    <CRow>
                      <CCol>
                        <FontAwesomeIcon icon={faHome} style={{ color: 'green', fontSize: "21px" }} />
                        {' '}
                        <CLabel>Puntos de Entrega </CLabel>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol>
                        <FontAwesomeIcon icon={faExclamationTriangle} style={{ color: 'Blue', fontSize: "21px" }} />
                        {' '}
                        <CLabel>Cruces Bloqueados: </CLabel>
                      </CCol>
                    </CRow>

                    <CRow>
                      <CCol>
                        <FontAwesomeIcon icon={faIndustry} style={{ color: 'orange', fontSize: "21px" }} />
                        {' '}
                        <CLabel>Plantas : 3</CLabel>
                      </CCol>
                    </CRow>

                    <CRow>
                      <CCol>
                        <FontAwesomeIcon icon={faTruckMoving} style={{ color: 'silver', fontSize: "21px" }} />
                        {' '}
                        <CLabel>Camiones Cisterna: 20</CLabel>
                      </CCol>
                    </CRow>

                    <CRow>
                      <CCol>
                        <FontAwesomeIcon icon={faTruckMoving} style={{ color: 'red', fontSize: "21px" }} />
                        {' '}
                        <CLabel>Camiones Averiados</CLabel>
                      </CCol>
                    </CRow>


                  </CCol>
                </CCardHeader>
              </CRow>
            </CContainer>
          </CCol>
        </CRow>

        <CRow>
          <Offcanvas className="offcanvas-v" isOpen={showOf} direction="end" toggle={() => this.handleClose()}>
            <OffcanvasHeader >
              Información de Camión cisterna
            </OffcanvasHeader>
            <OffcanvasBody>
              <CRow>

                <CCol xs={3}>
                  <CButton color="warning" onClick={() => this.handleRuta(vehi)}>Ver Ruta</CButton>
                </CCol>
                <CCol xs={4}>
                  <CButton color="warning" onClick={() => this.handleAveria(vehi)}>Registrar Avería</CButton>
                </CCol>
              </CRow>
              <br />
              <br />
              <CRow>
                <CCol xs={3}>
                  Placa:
                </CCol>
                <CCol xs={3}>
                  {vehi.placa}
                </CCol>
                <CCol xs={3}>
                  Tipo de Vehiculo:
                </CCol>
                <CCol xs={3}>
                  {vehi.tipo}
                </CCol>
              </CRow>
              <br />
              <CRow>
                <CCol xs={3}>
                  Cantidad de GLP:
                </CCol>
                <CCol xs={3}>
                  {vehi.capacidadActual}
                </CCol>
                <CCol xs={6}>

                </CCol>
              </CRow>
              
              <br />
              <CRow>
                <Table striped>
                  <thead>
                    <tr>
                      <th>
                        Pedido
                      </th>
                      <th>
                        Tiempo Estimado de Entrega
                      </th>
                      <th>
                        GLP
                      </th>
                      <th>
                        Direccion
                      </th>
                      <th>
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {lped && lped.map(pedV => {
                      return (
                        <tr>
                          <td>{pedV.id}</td>
                          <td>{pedV.fechaEntrega}</td>
                          <td>{pedV.cantidad}</td>
                          <td>X:{pedV.x} - Y:{pedV.y}</td>
                          <td>
                            {pedV.estado === 0 ?
                              <CBadge color={this.getBadge(pedV.estado)}>
                                Entregado
                              </CBadge> :
                              < CBadge color={this.getBadge(pedV.estado)}>
                                En curso
                              </CBadge>
                            }
                          </td>
                        </tr>


                      )

                    })
                    }

                  </tbody>
                </Table>
              </CRow>
              <CRow>
                <CCol xs={3}>
                  Ruta:
                </CCol>
              </CRow>
              <CRow>
                {rutaVehiculo}
              </CRow>
            </OffcanvasBody>
          </Offcanvas>
        </CRow>

        {/* {this.state.modalDoc &&
          <Modal isOpen={this.state.modalDoc}>
            <ModalBody>
              <br />
              <div className="form-group">
                <CRow>
                  <CCol>
                    Por favor, suba el archivo de bloqueos:

                  </CCol>
                </CRow>
                <br />
                <CRow>
                  <CCol >
                    <InputGroup>
                      <Input id={1} type="file" accept=".txt, .csv" className="archivosTexto" onChange={(event) => this.uploadJSONFiles(event)} />
                    </InputGroup>
                  </CCol>
                </CRow>

              </div>
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-success" data-dismiss="modal" onClick={() => this.modalArchivo()}>Aceptar</button>
            </ModalFooter>
          </Modal>

        } */}


        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader style={{ display: 'block' }}>
            <span style={{ float: 'right' }} onClick={() => this.modalInsertar()} >x</span>
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="posX">Posición X</label>
              <input className="form-control" type="text" name="x" id="x" onChange={this.handleChange} value={form ? form.posX : ''} />
              <br />
              <label htmlFor="posY">Posición Y</label>
              <input className="form-control" type="text" name="y" id="y" onChange={this.handleChange} value={form ? form.posY : ''} />
              <br />
              <label htmlFor="cantidad">Cantidad en m3</label>
              <input className="form-control" type="text" name="cantidad" id="cantidad" onChange={this.handleChange} value={form ? form.cantidad : ''} />
              <br />
              <label htmlFor="horaLimite">Hora Límite</label>
              <input className="form-control" type="text" name="minFaltantes" id="minFaltantes" onChange={this.handleChange} value={form ? form.horaLimite : ''} />
              <br />

            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-success" onClick={() => this.insertarPedido()}>Insertar</button>
            <button className="btn btn-danger" onClick={() => this.modalInsertar()}>cancelar</button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default tiempo_real;


// dar formato : shift alt F