import React, { Component } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import { getRelativePosition } from 'chart.js/helpers';
import {Bar,Doughnut,Line,Pie} from 'react-chartjs-2';
import "bootstrap/dist/css/bootstrap.min.css";
import { CCol, CRow } from '@coreui/react';
import "react-datepicker/dist/react-datepicker.css";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/lab';
import frLocale from 'date-fns/locale/es';
import { Button } from 'reactstrap';
import './reporte.scss';

const url = "http://3.231.34.221:8080/api/order/filterDate";
const localeMap = {
  fr: frLocale
};

const maskMap = {
  fr: '__/__/____',
};
class Prueba extends Component {
    constructor(){
      super();
      this.state = {
        data:[],
        chartData:{},
        startDate:'2021-11-22',
        endDate:'2021-11-22',
        locale:'fr',
        form:{
          inicio:'2022-01-01 00:00',
          fin:'2022-12-30 00:58'
        },
        meses:[],
        cantPed:[],
        mes:'',
        cantidad:0
      }
    }
  
    UNSAFE_componentWillMount(){
      this.getChartData();
    }
    
    getChartData(){
      // Ajax calls here
      //this.peticionPost();
      this.setState({
        chartData:{
          labels: this.state.meses,
          datasets:[
            {
              label:'Pedidos',
              data:[20,32,22,25,16,13,33,35,40,45,18,25],
              backgroundColor:[
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(255, 99, 132, 0.6)'
              ]
            }
          ]
        },
        chartData2:{
          labels: ['Mantenimiento Preventivo', 'Mantenimiento Correctivo'],
          datasets:[
            {
              label:'Mantenimientos',
              data:[20,5],
              backgroundColor:[
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(255, 99, 132, 0.6)'
              ]
            }
          ]
        }
      });
    }
    
    handleDateChange(date){
      this.setState({startDate:date});
    }
    handleDateChange2(date){
      this.setState({endDate:date});
    }

    peticionPost=async()=>{
      console.log(this.state.form);
      await axios.post(url,this.state.form).then(response=>{
          this.setState({data:response});
          console.log(this.state.data);
          for(var i in this.state.data.data){
            if (this.state.data.data.hasOwnProperty(i)) {
              console.log(i)
            this.state.meses.push(this.state.data.data[i].Mes);
            this.state.cantPed.push(parseInt(this.state.data.data[i].Data))
          }
        }
      }).catch(error=>{
          console.log(error.message);
      })
    }


    handleSearch=(fecha1,fecha2)=>{
      fecha1 = fecha1.toISOString().slice(0, -8).replace('T',' ');
      fecha2 = fecha2.toISOString().slice(0, -8).replace('T',' ');
      this.state.form.inicio=fecha1;
      this.state.form.fin=fecha2;
      this.state.meses.length = 0;
      this.state.cantPed.length=0;
      this.peticionPost();
      this.getChartData();
    }

    componentDidMount() {
      this.peticionPost();
      this.getChartData();
    
    }
    
    render() {
      const {locale,endDate,startDate,chartData,chartData2} = this.state;
      return (
        <div>
              <CRow>
                <CCol xs={2}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} locale={localeMap[locale]}>
                  <DatePicker className="dt-picker"
                    label="Fecha de Inicio"
                    openTo="day"
                    mask={maskMap[locale]}
                    views={['year', 'month', 'day']}
                    value={startDate}
                    onChange={(date) => {this.handleDateChange(date)}}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  </LocalizationProvider>
                </CCol>
                <CCol xs={2}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} locale={localeMap[locale]}>
                    <DatePicker className="dt-picker"
                      label="Fecha de Fin"
                      openTo="day"
                      mask={maskMap[locale]}
                      views={['year', 'month', 'day']}
                      value={endDate}
                      onChange={(date) => {
                        this.handleDateChange2(date);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </CCol>
                <CCol xs={2}>
                      <Button color="primary" onClick={()=>this.handleSearch(startDate,endDate)}>
                        Buscar
                      </Button>
                </CCol>
                <br/>
              </CRow>
              
              <br/>
              <CRow>
                <CCol xs={6}>
                    <div className="chart-container">
                    <div className="App-header">
                    <h3>Histórico de Pedidos del Año</h3>
                    </div>
                    <Line data={chartData} options={{maintainAspectRatio:true}}  />
                    </div>
                </CCol>
                <CCol xs={6}>
                    <div className="chart-container">
                    <div className="App-header">
                    <h3>Consumo mensual de petróleo de la flota en m3</h3>
                    </div>
                    <Bar data={chartData} options={{maintainAspectRatio:true}}  />
                    </div>
                    <br/>
                </CCol>
                <br/>
              </CRow>
              <br/>
              <br/>
              <CRow>
                <CCol xs={2}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} locale={localeMap[locale]}>
                  <DatePicker className="dt-picker"
                    label="Fecha de Inicio"
                    openTo="day"
                    mask={maskMap[locale]}
                    views={['year', 'month', 'day']}
                    value={startDate}
                    onChange={(date) => {this.handleDateChange(date)}}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  </LocalizationProvider>
                </CCol>
                <CCol xs={2}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} locale={localeMap[locale]}>
                    <DatePicker className="dt-picker"
                      label="Fecha de Fin"
                      openTo="day"
                      mask={maskMap[locale]}
                      views={['year', 'month', 'day']}
                      value={endDate}
                      onChange={(date) => {
                        this.handleDateChange2(date);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </CCol>
                <CCol xs={2}>
                      <Button color="primary" onClick={()=>this.handleSearch(startDate,endDate)}>
                        Buscar
                      </Button>
                </CCol>
              
              </CRow>
              
              <br/>
            <CRow>
                <CCol xs={6}>
                    <div className="chart-container">
                    <div>
                    <h4>Mantimiento de Vehiculos</h4>
                    </div>
                    <Pie data={chartData2} options={{maintainAspectRatio:false}}  />
                    </div>
                </CCol>
                <CCol xs={6}>
                    <div className="chart-container">
                    <div>
                    <h4>Mantimiento de Vehiculos</h4>
                    </div>
                    <Doughnut data={chartData} options={{maintainAspectRatio:true}}  />
                    </div>
                </CCol>
            </CRow>
        </div>
      );
    }
  }
  
  export default Prueba;