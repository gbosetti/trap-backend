import { Component, OnInit } from '@angular/core';
import { MovementsService } from'../_services/movements.service';
import { UserService } from'../_services/user.service';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-fixedcolumns-dt';
declare var bootbox: any;
import { DatatablesSpanish } from '../_helpers/datatables-spanish';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  toDate: String = (new Date()).toISOString().split('T')[0];
  toDateForReal: Date;
  fromDate: String = new Date(((new Date()).setMonth((new Date()).getMonth()-1))).toISOString().split('T')[0];
  fromDateForReal: Date;

  // User search input variables
  keyword = 'name';
  visitors: any = [];
  isVisitorLoadingResult: boolean;

	constructor(private movements: MovementsService, private users: UserService) { }

	ngOnInit() {
		var self = this;
		$(document).ready(()=>{
		    this.enableDatatable();
        $("#movements-filter").on("change", evt=>{
          this.loadMovenetsStrategy();
        });
        /*$('#movements').on( 'draw.dt', function () {
          $('#movements_filter').css("float", "left");
        });*/
		    this.loadAllMovements(this.getFromDate(), this.getToDate());    
		});
    $('#movements tbody').on( 'click', 'button', function () {
        self[this.getAttribute('data-action')](this.dataset);
    });
	}

  closeFix(event, datePicker) {
    if(event.target.offsetParent == null || event.target.offsetParent.nodeName != "NGB-DATEPICKER"){
      datePicker.close();
    }
  };

  getFromDate(){
    return ($("#fromDate").val() || $("#fromDate").attr("placeholder")).toString() + " 00:00:00";
  }

  getToDate(){
    return ($("#toDate").val() || $("#toDate").attr("placeholder")).toString() + " 23:59:59";
  }

  loadMovenetsStrategy(){

    var from = this.getFromDate();
    var to = this.getToDate();

    if(new Date(from.replace(/-/gi, "/")) > new Date(to.replace(/-/gi, "/"))){
      bootbox.alert('La fecha indicada en el campo "Desde" debe ser menor o igual a la indicada en el campo "Hasta".');
      $('#movements').DataTable().clear().destroy(); 
      return;
    }

    this[$("#movements-filter").val()](from, to);
  }

	loadAllMovements(from, to){
    this.hideMovementsMatchingControls();
    
    this.movements.getMovements(from, to).then((res:any) => {
      this.loadMovements(res.data);
    });
	}

  loadAuthorizedMovements(from, to){
    this.hideMovementsMatchingControls();
    this.movements.getAuthorizedMovements(from, to).then((res:any) => {
      this.loadMovements(res.data);
    });
  }

  loadDeniedMovements(from, to){
    this.hideMovementsMatchingControls();
    this.movements.getDeniedMovements(from, to).then((res:any) => {
      this.loadMovements(res.data);
    });
  }

  loadNotClosedMovements(from, to){
    this.hideMovementsMatchingControls();
    this.movements.getNotClosedMovements(from, to).then((res:any) => {
      this.loadMovements(res.data);
    });
  }

  loadMovementsMatching(from, to){
    this.visitors = [];
    this.clearDatatable();
    this.showMovementsMatchingControls();

    setTimeout(function(){ 
      $("#loadMovementsMatchingPerson .input-container input").val('').focus();
    }, 100);
  }

  hideMovementsMatchingControls(){
    $("#loadMovementsMatchingPerson").hide();
    $(".alert-info-visitante").addClass("d-none");
  }

  showMovementsMatchingControls(){
    $("#loadMovementsMatchingPerson").show();
    $(".alert-info-visitante").addClass("d-none");
    $(".alert-info-visitante .registros-visitante").html('');
  }

  onVisitorSelected(data){
    $(".alert-info-visitante").removeClass("d-none");
    $(".alert-info-visitante .nombre-visitante").html("Registros de " + data.name);
    $(".alert-info-visitante .registros-visitante").html('');
    this.movements.getMovementsMatchingUser(data.id, this.getFromDate(), this.getToDate()).then((res:any) => {

      res.data['user_movements'].forEach(mov=>{
        $(".alert-info-visitante .registros-visitante").append('<li class="list-group-item">'+
            '<i class="fa fa-minus mr-3" aria-hidden="true"></i> ' + 
            '<span class="mr-3"> ingreso: ' + mov['entrada'] + '</span>' +
            '<span class="mr-3"> egreso: ' + mov['salida'] + '</span>' +
          '</li>');
      });
      
      this.loadMovements(res.data['related_movements']);

    }).catch(err=>{
      this.clearDatatable();
    });
  }

  onVisitorCleared(){
    this.clearDatatable();
  }

  loadMovements(movements){

    var formattedData = [];
    $('#overlay-spinner').fadeIn();

    movements.forEach(e => {

      var preguntas = '';
      e["preguntas"] = (e["preguntas"]==null? [] : JSON.parse(e["preguntas"])).forEach(preg=>{ 
        preguntas +=
        (preg['passed']==1? '<i class="fa fa-check" style="color:green"></i> ' : '<i class="fa fa-times" style="color:#d5220e"></i> ') + 
        preg['value'] + '<br>' 
      });

      var instalaciones = '';
      e["instalaciones"] = (e["instalaciones"]==null? [] : JSON.parse(e["instalaciones"])).forEach(inst=>{ 
        instalaciones += '<i class="fa fa-minus mr-3"></i> ' + inst + '<br>' 
      });

      formattedData.push([
        (e["autorizado"]==1? '<i class="fa fa-check" style="color:green"></i> Si' : '<i class="fa fa-times" style="color:#d5220e"></i> No'), 
        e["entrada"], 
        e["salida"]=='0000-00-00 00:00:00'? '':e["salida"], //.replace(' ', '<br>'), 
        e["apellido"].toUpperCase() + ', ' + e["nombre"], 
        e["dni"], 
        "<div style='text-align: center'>" + 
          (e["supero_temperatura"]==1? '<i class="fa fa-check" style="color:green"></i> ' : '<i class="fa fa-times" style="color:#d5220e"></i> ') +
          e["temperatura"] +
        "</div>", 
        "<div style='text-align: center'>" + 
            (e["supero_olfativo"]==1? '<i class="fa fa-check" style="color:green"></i> Si' : '<i class="fa fa-times" style="color:#d5220e"></i> No') + 
        "</div>", 
        "<div style='text-align: center'>" + 
            (e["supero_preguntas"]==1? '<i class="fa fa-check" style="color:green"></i> Si' : '<i class="fa fa-times" style="color:#d5220e"></i> No') + 
            " <small class='ml-1'><button style='border-radius: 25px;' data-action='seeQuestions' data-questions='" + preguntas + "'>Ver</button></small>" +
        "</div>", 
        instalaciones,
        e["guardia_ingreso"],
        e["guardia_egreso"]
       ]);
    });

    this.clearDatatable();
    $('#movements').DataTable({
      "data": formattedData,
      //"dom": '<"top"f>t<"bottom"lp><"clear">',
      "language": DatatablesSpanish.getLangStrings()
    });
    
    $('#overlay-spinner').fadeOut();
  }

  seeQuestions(data){

    if(!data.questions.length){
      data.questions = "No se han encontrado preguntas vinculadas a este registro.";
    }
    bootbox.alert({
        title: "Resultados de preguntas realizadas",
        message: data.questions, 
        centerVertical: true,
        callback: function(result){ 
            console.log(result); 
        }
    });
  }

	enableDatatable(){

      $('#movements').DataTable({
            "columnDefs": [ 
              { "title": "Autori<br>zado", "targets": 0, "width": "75px" },
              { "title": "Ingreso", "targets": 1, "width": "75px" },
              { "title": "Egreso", "targets": 2, "width": "75px" },
              { "title": "Apellido y nombre", "targets":3, "width": "100px" },
              { "title": "DNI", "targets": 4, "width": "75px" },
              { "title": "Tempe<br>ratura", "targets": 5, "width": "75px" },
              { "title": "Test<br>olfativo<br>superado", "targets": 6, "width": "75px" },
              { "title": "Preguntas superadas", "targets": 7, "width": "75px" },
              { "title": "Instalaciones<br>visitadas", "targets": 8 },
              { "title": "Ingreso registrado por:", "targets": 9, "width": "100px" },
              { "title": "Egreso registrado por:", "targets": 10, "width": "100px" }
            ]
      });
      var self = this;
    $('#movements tbody').on( 'click', 'button', function () {
        self[this.getAttribute('data-action')](this.dataset);
    });
  }

  clearDatatable(){
    $('#movements').DataTable().clear().destroy();
  }

  getVisitorServerResponse(keywords) {
    if(this.isVisitorLoadingResult)
      return;

    this.isVisitorLoadingResult = true;
    this.users.getUserMatching(keywords).then((res:any) => {
        this.visitors = res.data;
        this.isVisitorLoadingResult = false;
    }, data => {
        this.visitors = [];
        this.isVisitorLoadingResult = false;
    });
  }
}
