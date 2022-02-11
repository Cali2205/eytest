import React, { Component } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { MainContainer } from 'src/components/main-container/main-container2';
import { MainContent } from 'src/components/main-content/main-content'
import './tiempo_real.scss';
import moment from 'moment'
import jsPDF from "jspdf"
import "jspdf-autotable"
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faIndustry, faTruckMoving, faHome, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { DropdownToggle, ButtonDropdown, Dropdown, DropdownItem, DropdownMenu, Modal, ModalBody, ModalFooter, ModalHeader, Table, Offcanvas, OffcanvasHeader, OffcanvasBody, Button } from 'reactstrap';
import { CBadge, CCol, CRow, CButton, CTooltip, CCardHeader, CLabel, CContainer } from '@coreui/react'
import axios from 'axios';

// const urlAlgoritmo = "http://3.231.34.221:8080/api/algoritmo/";
// const urlAlgoritmo = "http://localhost:8080/api/simulacion/rutas";
const urlAlgoritmo = "http://localhost:8080/api/simulacion/rutasInit";
const urlF = "http://localhost:8080/api/simulacion/empezar"
const urlR = "http://localhost:8080/api/simulacion/reiniciar"

class Simulacion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      actualVehiclePositions: [],
      intervalId: 0,
      BlockIntervalId: 0,
      textoFin: '',
      speedIntervalId: 0,
      initialWareHouses: [],
      vehiclePositions: [],
      blockPositions: [],
      habilitado: false,
      time: 0,
      arr: [],
      retor: [],
      dropDownOpen: false,
      pedidos: [],
      xBloqueo: [],
      yBloqueo: [],
      inicioBloq: [],
      finBloq: [],
      auxV: [],
      dropDownValue: 'Elija la velocidad',
      duracionBloq: [],
      nodosBloq: [],
      showOf: false,
      vehi: [],
      lped: [],
      velSimulacion: 100,
      velAux: 100,
      tiemposBloqueo: [],
      fechaSimulacion:new Date(),
      tiempoPrograma: new Date(),
      tiempoNuevo: new Date(),
      multiplicador: 0.1,
      fraccion: 10,
      empezar: false,
      tipo: 0,
      finSimulacion: false,
      modalFin: false,
      listaIdRutas: [],
    }
  }

  seleccionarVehiculo = (vehiculo) => {
    console.log(vehiculo)
    this.setState({
      form: {
        placa: vehiculo.placa,
        capacidadActual: vehiculo.capacidadActual,
        consumoPetroleo: vehiculo.consumoPetroleo,
        nombre: vehiculo.nombre
      }
    })
  }

  cambiarVelocidad = (item) => {

    console.log(item);
    item.fraccion = this.state.fraccion;
    item.multiplicador = this.state.multiplicador;
    
  }
  getRuta = (item, url) => {

    axios.get(url).then(response => {
      this.setState({ data: response.data }, () => {
        console.log(item);
        if (item) {

          if (this.state.data.id !== item.idRuta) {
            this.state.arr[item.id * 2 - 1] = this.state.data.recorrido;
            this.state.retor[item.id * 2 - 1] = this.state.data.retorno;
            this.state.pedidos[item.id * 2 - 1] = this.state.data.pedidos;
            this.state.auxV[item.id * 2 - 1] = this.state.data.vehiculo;
            this.state.listaIdRutas[item.id * 2 - 1] = this.state.data.id;
            item.idRuta = this.state.data.id;
            item.rutaCambiada = true;

          }

        }
      });

    }).catch(error => {
      console.log(error.message);
      item.finSimulacion = true;
    })
  }

  peticionGet = () => {
    axios.get(urlAlgoritmo).then(response => {
      console.log(response);
      this.setState({ habilitado: !this.state.habilitado, data: response.data }, () => {
        // for (var i in this.state.data.Bloqueos) {
        //   if (this.state.data.Bloqueos.hasOwnProperty(i)) {
        //     this.state.xBloqueo.push(i, this.state.data.Bloqueos[i].x);
        //     this.state.yBloqueo.push(i, this.state.data.Bloqueos[i].y);
        //     this.state.tiemposBloqueo.push(i, this.state.data.Bloqueos[i].tiempos);

        //   }
        // }
        for (var i in this.state.data) {
          if (this.state.data.hasOwnProperty(i)) {
            this.state.arr.push(i, this.state.data[i].recorrido);
            this.state.retor.push(i, this.state.data[i].retorno);
            this.state.pedidos.push(i, this.state.data[i].pedidos);
            this.state.auxV.push(i, this.state.data[i].vehiculo);
            this.state.listaIdRutas.push(i, this.state.data[i].id);
          }
        }
        // if (this.state.xBloqueo.length >= 1) {
        //   var k = 0;
        //   for (var i = 1; i < this.state.xBloqueo.length; i += 2) {
        //     this.state.blockPositions.push(
        //       {
        //         id: k,
        //         activo: false,
        //         xPos: this.state.xBloqueo[i],
        //         yPos: this.state.yBloqueo[i],
        //         posFecha: 0
        //       });
        //     k++;
        //   }
        //   // console.log(this.state.blockPositions);
        // }

        if (this.state.arr.length >= 1) {
          var k = 1;
          for (var i = 1; i < this.state.arr.length; i += 2) {
            this.state.vehiclePositions.push(
              {
                id: k,
                xPos: 12,
                yPos: 8,
                posRec: 0,
                posRetor: 0,
                regreso: false,
                rutaV: [],
                xPed: 0,
                yPed: 0,
                verRuta: false,
                posPed: 0,
                averiado: 0,
                posFraccion: 0,
                fraccion:10,
                multiplicador:0.1, 
                posicionActualizada: false,
                placa: '',
                consumoPetroleo: 0,
                capacidadActual: 0,
                tipo: '',
                lped: [],
                idRuta: -1,
                retrasoVehiculo: 30,
                rutaCambiada: false,
                finSimulacion: false,
              }
            );
            k += 1;
          }

        }


      });

    }).catch(error => {
      console.log(error.message);
    })
  }

  descargarReporte = () => {
    axios.get(urlR).then(response => {
      console.log(response);
      console.log("dentro del get Reinicio")
      this.setState({
        modalFin: !this.state.modalFin
      })
    }).catch(error => {
      console.log(error.message);
    })

  }


  handleDownload = (camion) => {
    //Descarga de archivo
    //console.log(camion)
    const doc = new jsPDF();
    const fecha = new Date();
    const mul = 20
    //variable de posicion
    let posY = mul
    //CABECERA DE REPORTE
    var fechaStr = fecha.getDate() + "-" + (fecha.getMonth() + 1) + "-" + fecha.getFullYear();
    doc.setFontSize(24);
    doc.text("Hoja de Ruta Individual", doc.internal.pageSize.getWidth() / 2, posY, { align: 'center' })
    var img = new Image()
    img.src = '/SAG_negro.png'
    doc.addImage(img, 'png', 10, 12, 17, 10)
    doc.setFontSize(12)
    posY += mul
    doc.text(`Fecha: ${fechaStr}`, 150, posY)
    posY += mul / 2;
    doc.setFont(undefined, 'bold')
    doc.text("Información del vehiculo", 14, posY);
    doc.setFont(undefined, 'normal')
    posY += mul / 2;
    doc.text(`Placa: ${camion.placa}`, 14, posY);
    doc.text(`Capacidad de GLP: ${camion.capacidadActual}`, 100, posY);
    posY += mul / 2;
    doc.text(`Tipo de Vehiculo: ${camion.tipo}`, 14, posY);
    var textEstado = "Operativo"
    if (camion.averiado === 1) {
      textEstado = "En mantenimiento"
    }
    doc.text(`Estado de Vehiculo: ${textEstado}`, 100, posY);
    posY += mul / 2;
    doc.text(`Cantidad de Pedidos a entregar: ${camion.lped.length}`, 14, posY);
    doc.text(`Kilómetros a recorrer: ${camion.rutaV.length} Km`, 100, posY);
    //FIN CABECERA REPORTE

    //DETALLE DE PEDIDOS DE CAMION

    doc.addPage('a4', 'landscape');
    doc.setFont(undefined, 'bold')
    posY = 20;
    doc.setFontSize(18)
    doc.text("Listado de Pedidos", 14, posY);
    doc.setFont(undefined, 'normal')
    posY += mul

    const columnas = ["Pedido", "Fecha de Pedido", "Hora de Pedido", "Fecha de Entrega", "Hora  de Entrega", "Cantidad de GLP (m3)", "Consumo Petroleo", "Dirección", "Estado"];
    let lPedidos = [];
    let aux = 1
    camion.lped.forEach(pedido => {
      const fechaP = moment(pedido.fechaPedido).format("DD/MM/YYYY");
      const horaP = moment(pedido.fechaPedido).format("HH:mm:ss");
      const entregaF = moment(pedido.fechaEntrega).format("DD/MM/YYYY");
      const entregaH = moment(pedido.fechaEntrega).format("HH:mm:ss");
      const consumo = pedido.consumoPetroleo;
      const direccion = `X: ${pedido.x} - Y: ${pedido.y}`
      const estadoP = pedido.estado === 1 ? "Entregado" : "En camino";
      const contenido = [aux, fechaP, horaP, entregaF, entregaH, pedido.cantidad, consumo, direccion, estadoP];
      aux += 1
      lPedidos = [...lPedidos, contenido];
    })
    doc.autoTable(columnas, lPedidos, { startY: posY },
      {
        styles: {
          cellWidth: 'wrap',
          rowPageBreak: 'auto',
          halign: 'justify'
        },
      }, { columnStyles: { cellWidth: 'auto' } });
    //FIN DE DETALLES DE PEDIDOS DE CAMION


    //grabar documento de vehiculo
    doc.save(`HojaDeRuta_${camion.placa}.pdf`);

  }
  handleFullDownload=()=> {
    //HOJAS DE RUTAS DE TODOS LOS CAMIONES
    const rutasD = this.state.data
  //  console.log(rutasD.length)
      //console.log("dentro del if de la funcion")
      const doc = new jsPDF();
      const fecha = new Date();
      const mul = 20
      //variable de posicion
      let posY = mul
      //CABECERA DE REPORTE
      var fechaStr = fecha.getDate() + "-" + (fecha.getMonth() + 1) + "-" + fecha.getFullYear();
      doc.setFontSize(24);
      doc.text("Hoja de Rutas", doc.internal.pageSize.getWidth() / 2, posY, { align: 'center' })
      var img = new Image()
      img.src = '/SAG_negro.png'
      doc.addImage(img, 'png', 10, 12, 17, 10)
      doc.setFontSize(12)
      posY += mul
      doc.text(`Fecha: ${fechaStr}`, 150, posY)
      posY += mul / 2;
      doc.setFont(undefined, 'bold')

      //LISTADO DE CAMIONES
      doc.text(14, posY, "Configuración de Simulación:");
      posY += mul / 2;
      doc.text(`Fecha inicio simulacion: ${moment(this.state.fechaSimulacion).format("HH:mm:ss")}`, 14, posY);
      doc.text(`Pedidos entregados en la simulacion: ${moment(this.state.fechaSimulacion).format("HH:mm:ss")}`, 100, posY);
      posY += mul / 2;


      //LISTADO DE PEDIDOS DE CAMION

      doc.save(`HojaDeRuta_${fechaStr}.pdf`);
    


  }


  getFin = async () => {
    window.location.reload();
    this.setState({
      empezar: !this.state.empezar
    })
    console.log("dentro del post del boton")
    await axios.get(urlF).then(response => {
      console.log("dentro del post2")
      this.setState({

        modalFin: !this.state.modalFin
      })
    }).catch(error => {
      console.log(error.message);
    })

  }

  handleSimulacion = () => {
    this.setState({
      fechaSimulacion: new Date()
    })
    this.getFin();
  }

  modalFinSimulacion() {
    console.log("refrescar");
    window.location.reload(true);
    this.setState({
      modalFin: !this.state.modalFin
    })
  }
  
  componentDidMount() {

    var k = 0;
    //this.getFin();
    this.peticionGet();
    console.log("post get asdasd")

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

    const data = this.state.data;

    const initialVehiclePositions = this.state.vehiclePositions;

    this.state.intervalId = setInterval(() => {
      initialVehiclePositions.map((item) => {
        if (!item.finSimulacion) {
         // console.log(item.fraccion);
       //   console.log(item.multiplicador);
          if (!item.posicionActualizada && !item.regreso && this.state.arr.length >= 1) {
            let today = new Date(); // fecha de hoy 
            const movimientos = this.state.arr[item.id * 2 - 1];
            const pedidosVehiculo = this.state.pedidos[item.id * 2 - 1];

            item.posicionActualizada = true;
          }

          var o = 1;
          if (this.state.auxV.length >= 1 && o <= this.state.auxV.length) {
            //datos para el Offcanvas
            for (var x = 0; x < this.state.auxV.length / 2; x++) {
              if (this.state.auxV[o]) {

                initialVehiclePositions[x].placa = this.state.auxV[o].placa;
                initialVehiclePositions[x].capacidadActual = this.state.auxV[o].capacidadActual;
                if (this.state.auxV[o].tipo !== null)
                  initialVehiclePositions[x].tipo = this.state.auxV[o].tipo.nombre;
                initialVehiclePositions[x].consumoPetroleo = this.state.auxV[o].consumo;
                initialVehiclePositions[x].lped = this.state.pedidos[o];
                o += 2;
              }
            }
          }

          if (item.posicionActualizada && !item.regreso && this.state.arr.length >= 1) {
            item.idRuta = this.state.listaIdRutas[item.id * 2 - 1];
            const movimientos = this.state.arr[item.id * 2 - 1];
            item.rutaV = movimientos
            const pedidosVehiculo = this.state.pedidos[item.id * 2 - 1];
            if (movimientos && movimientos.length > item.posRec) {
              let movimiento = movimientos[item.posRec];
              let pedidoVehiculo;
              if (movimiento.x != item.xPos) {
                if (movimiento.x > item.xPos) item.xPos += item.multiplicador;
                else item.xPos -= item.multiplicador;
              }

              if (movimiento.y != item.yPos) {
                if (movimiento.y > item.yPos) item.yPos += item.multiplicador;
                else item.yPos -= item.multiplicador;
              }


              item.posFraccion += 1;

              if (item.posFraccion == item.fraccion) {
                item.xPos = movimiento.x;
                item.yPos = movimiento.y;
                this.cambiarVelocidad(item);
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
            const movimientos2 = this.state.retor[item.id * 2 - 1];
            if (movimientos2 && movimientos2.length > item.posRetor) {
              let movimiento2 = movimientos2[item.posRetor];
              if (movimiento2.x != item.xPos) {
                if (movimiento2.x > item.xPos) item.xPos += item.multiplicador;
                else item.xPos -=  item.multiplicador;
              }
              if (movimiento2.y != item.yPos) {
                if (movimiento2.y > item.yPos) item.yPos +=  item.multiplicador;
                else item.yPos -=  item.multiplicador;
              }

              item.posFraccion += 1;
              if (item.posFraccion == item.fraccion) {
                item.xPos = movimiento2.x;
                item.yPos = movimiento2.y;
                this.cambiarVelocidad(item);
                item.posRetor += 1;
                item.posFraccion = 0;
              }

            }

          }

          if (item.regreso && (item.xPos == 12) && (item.yPos == 8) && !item.finSimulacion) {

            item.retrasoVehiculo -= 1;
            if (item.retrasoVehiculo == 0) {
              const url = "http://localhost:8080/api/simulacion/ruta/" + item.placa;
              this.getRuta(item, url);
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
                item.retrasoVehiculo = 30;
                item.rutaCambiada = false;
              }

              item.retrasoVehiculo = 10;

            }

          }

        }


      })
      this.setState({
        initialWareHouses,
        vehiclePositions: initialVehiclePositions,

      });
      //console.log(this.state.tiempoNuevo)
    }, 100);

    // const initialBlockPositions = this.state.blockPositions;


    // this.state.BlockIntervalId = setInterval(() => {
    //   initialBlockPositions.map((bloqueo) => {
    //     if (this.state.xBloqueo.length >= 1) {



    //       let fechas = this.state.tiemposBloqueo[bloqueo.id * 2 + 1];
    //       if (fechas && fechas.length > bloqueo.posFecha) {
    //         let fechasBloqueo = fechas[bloqueo.posFecha];
    //         let fechaInicio = fechasBloqueo.inicio;
    //         let fechaFin = fechasBloqueo.fin;

    //         let anio = parseInt(fechaInicio.slice(0, 4)); // año
    //         let mes = parseInt(fechaInicio.slice(5, 7)); // mes
    //         let dia = parseInt(fechaInicio.slice(8, 10)); // dia
    //         let hora = parseInt(fechaInicio.slice(11, 13)); // hora
    //         let minuto = parseInt(fechaInicio.slice(14, 16)); // minuto
    //         let segundo = parseInt(fechaInicio.slice(17, 19)); // segundo

    //         let anio2 = parseInt(fechaFin.slice(0, 4)); // año
    //         let mes2 = parseInt(fechaFin.slice(5, 7)); // mes
    //         let dia2 = parseInt(fechaFin.slice(8, 10)); // dia
    //         let hora2 = parseInt(fechaFin.slice(11, 13)); // hora
    //         let minuto2 = parseInt(fechaFin.slice(14, 16)); // minuto
    //         let segundo2 = parseInt(fechaFin.slice(17, 19)); // segundo

    //         let fechaAux = new Date(2021, 11, 1, 2, 8, 0);
    //         let fechaAux2 = new Date(2021, 11, 1, 2, 9, 0);  // 10 = mes = noviembre

    //         var today =  new Date();
    //         if ((today.getTime() >= fechaAux.getTime()) && (today.getTime() <= fechaAux2.getTime())) {
    //           console.log("pintar bloqueo :D");
    //           bloqueo.activo = true;

    //         } else {
    //           if(today.getTime()>=fechaAux2.getTime()){
    //             bloqueo.activo = false;
    //             bloqueo.posFecha += 1;
    //           }
    //         }
    //       }
    //     }
    //   })
    //   this.setState({
    //     blockPositions: initialBlockPositions,
    //   });
    // }, 1000)



  }

  componentWillUnmount() {

    const intervalId = this.state.intervalId;
    // const BlockIntervalId = this.state.BlockIntervalId;
    const speedIntervalId = this.state.speedIntervalId;
    clearInterval(intervalId);
    // clearInterval(BlockIntervalId);
    clearInterval(speedIntervalId);
  }

  handleShow = (item) => {
    this.setState({ vehi: item });
    this.setState({ lped: item.lped });
    this.setState({ showOf: !this.state.showOf });
    console.log(item);
  }

  handleClose() {
    this.setState({ showOf: !this.state.showOf });
  }

  toggle = () => {
    this.setState({
      dropDownOpen: !this.state.dropDownOpen,
    })
  }

  handleChange = (code) => {
    this.setState({
      dropDownValue: code
    })
  }

  handleSpeed(velocidadS) {

    if (velocidadS === "x2") {
      this.state.multiplicador = 0.1; // fraccion : 10
      this.state.fraccion = 10;
      
    }
    if (velocidadS === "x5") {
      //clearInterval(this.state.intervalId);
      this.state.multiplicador = 0.25; // fraccion : 4
      this.state.fraccion = 4;
    }
    if (velocidadS === "x10") {
      this.state.multiplicador = 0.5; // fraccion : 2
      this.state.fraccion = 2;
    }
    if (velocidadS === "x20") {
      this.state.multiplicador = 1; // fraccion : 1
      this.state.fraccion = 1;
    }


  }

  getBadge(estado) {
    switch (estado) {
      case 0: return 'primary'
      case 1: return 'info'
    }
  }

  handleRuta = (vehi) => {
    vehi.verRuta = !vehi.verRuta
    console.log(vehi)
  }



  render() {
    const { habilitado, dropDownOpen, showOf, initialWareHouses, vehiclePositions, blockPositions, vehi, lped } = this.state;
    const distanceNode = 16;
    return (
      <div>

        <CRow>
          <CCol sm="auto" md="9">
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
                                        <FontAwesomeIcon icon={faTruckMoving} style={item.regreso ? {color:'yellow'} : {color:'silver'}} onClick={() => this.handleShow(item)} />
                                    </CButton>

                                  </CTooltip>
                                  <CTooltip
                                    key={item.id + 100}
                                    content={`Pedido: X=${item.xPed % 1 === 0 ? item.xPed : item.xPed.toFixed(1)
                                      } Y=${item.yPed % 1 === 0 ? item.yPed : item.yPed.toFixed(1)}`}
                                    placement="top-start"
                                  >

                                    <CButton block color="black" key={item.id + 1000} size={'sm'} style={{
                                      width: '8px',
                                      position: 'absolute',
                                      left: item?.xPed * distanceNode - 16,
                                      bottom: item?.yPed * distanceNode - 12,
                                    }}>
                                      
                                      {!item.regreso &&
                                        <FontAwesomeIcon icon={faHome} style={{ color: 'green' }} />}
                                    </CButton>
                                  </CTooltip>
                                  
                                  {item.rutaV && item.rutaV.map(nodo => (

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
                                  <CButton style={{ zIndex: '2' }} block color="black" key={warehouse.id} style={{
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

          <CCol sm="auto" md="3">
            <CRow>
              <CRow>
                <CCol className="col-md-auto">
                  <CButton color="success" className="btn btn-primary" onClick={() => this.handleSimulacion()}>
                    Empezar simulación
                  </CButton>
                </CCol>

              </CRow>
              <br />
              <br />
              <br />
              <br />
              <CRow className="row-md-auto">
                <CCol className="col-md-auto">
                  Velocidad de Simulación:
                </CCol>


              </CRow>

              <br />
              <br />

              <CRow>
                <CCol className="col-md-auto">
                  <ButtonDropdown size="lg" >
                    <Dropdown isOpen={dropDownOpen} toggle={this.toggle} >
                      <DropdownToggle color="secondary" caret className="dropdown-toggle">
                        {this.state.dropDownValue}
                      </DropdownToggle>
                      <DropdownMenu className="currency-dropdown" end>
                        <DropdownItem onClick={() => this.handleChange("x2")} >X2</DropdownItem>
                        <DropdownItem onClick={() => this.handleChange("x5")} >X5</DropdownItem>
                        <DropdownItem onClick={() => this.handleChange("x10")} >X10</DropdownItem>
                        <DropdownItem onClick={() => this.handleChange("x20")} >X20</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </ButtonDropdown>
                </CCol>

                <CCol className="col-md-auto">
                  <CButton className="btn btn-primary" onClick={() => this.handleSpeed(this.state.dropDownValue)}>
                    Variar Velocidad
                  </CButton>
                </CCol>

              </CRow>
            </CRow>
            <br />
            <br />

            <CRow>

              <CContainer style={{ background: 'Cyan' }}>
                <CRow>
                  <CCardHeader>
                    <CCol>
                      {/* <CRow>
                      <CLabel>Vehículos Averiados: </CLabel>
                      <CLabel> Vehículos en Ruta: </CLabel>
                      <CLabel>Pedidos sin Asignar:  </CLabel>
                      <CLabel>Pedidos con Retraso: </CLabel>
                    </CRow> */}
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
                          <CLabel>Cruces Bloqueados </CLabel>
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
                          <CLabel>Camiones Cisterna</CLabel>
                        </CCol>
                      </CRow>
                    </CCol>
                  </CCardHeader>
                </CRow>
              </CContainer>
            </CRow>
            <br />
            <CRow>
              <CCol className="col-md-auto">
                <CButton disabled={!habilitado} className="btn btn-primary" color="info" onClick={() => this.handleFullDownload()}>
                  Descargar Hoja de Rutas
                </CButton>
              </CCol>
            </CRow>
          </CCol>
        </CRow>

        <CRow>
          <Offcanvas className="offcanvas-v" isOpen={showOf} direction="end" toggle={() => this.handleClose()}>
            <OffcanvasHeader >
              Información de Camión cisterna
            </OffcanvasHeader>
            <OffcanvasBody>
              <CRow>
                <CCol xs={6}>
                  <Button color="primary" onClick={() => this.handleDownload(vehi)}>Descargar Hoja de Ruta</Button>
                </CCol>
                <CCol xs={4}>
                  <Button color="warning" onClick={() => this.handleRuta(vehi)}>Ver Ruta</Button>
                </CCol>
              </CRow>
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
                <CCol xs={3}>
                  Consumo de Petroleo:
                </CCol>
                <CCol xs={3}>
                  {vehi.consumoPetroleo} m3
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
                        Tiempo de entrega
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
                          <td>{moment(pedV.fechaEntrega).format("HH:mm:ss")}</td>
                          <td>{pedV.cantidad}</td>
                          <td>X:{pedV.x} - Y:{pedV.y}</td>
                          <td>
                            {pedV.estado === 1 ?
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
            </OffcanvasBody>
          </Offcanvas>
        </CRow>


        <Modal isOpen={this.state.modalFin}>
          <ModalHeader style={{ display: 'block' }}>
            <span style={{ float: 'right' }} onClick={() => this.modalFinSimulacion()} >x</span>
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <h1>La Simulación ha finalizado</h1>
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-success" onClick={() => this.descargarReporte()}>Descargar Reporte</button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}
export default Simulacion;