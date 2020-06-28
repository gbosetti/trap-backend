// https://github.com/gbosetti
import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import * as $ from 'jquery';
import 'bootstrap';
import 'datatables.net';
import 'datatables.net-fixedcolumns-dt';
declare var bootbox: any;

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.css']
})
export class AdminsComponent implements OnInit {

  constructor(private userService: UserService) {}

  ngOnInit() {

  	this.initializeDatatable();
  	this.loadAdmins();
  }

  initializeDatatable(){

    $('#admins').DataTable({
      "order": [[ 0, "asc" ]],
      "columnDefs": [ 
        { "title": "Apellido", "targets": 0 },
        { "title": "Nombre", "targets": 1 },
        { "title": "DNI", "width": "100px", "targets": 2 },
        { "title": "Habilitado", "width": "100px", "targets": 3 },
        { "title": "Acciones", "width": "150px", "targets": 4 }
      ]
    });
    var self = this;
    $('#admins tbody').on( 'click', 'button', function () {
        self[this.getAttribute('data-action')](this.dataset);
    });
  }

  toBool(val) {
    return !!JSON.parse(String(val).toLowerCase());
  }

  loadAdmins(){

  	var formattedData = [];
    $('#overlay-spinner').fadeIn();
    this.userService.getAdmins().then((admins: Array<any>) => {

      admins.forEach(e => {
      	
        e["habilitado"] = this.toBool(e["habilitado"]);
        formattedData.push([
          e["apellido"], 
          e["nombre"], 
          e["dni"],
          e["habilitado"]? 'Si <i class="fa fa-check" style="color:green"></i>' : 'No <i class="fa fa-times" style="color:#d5220e"></i>',
          "<div style='text-align: center'>" + 
	          "<button data-action='" + ((e["habilitado"])? 'disableAdmin' : 'enableAdmin') + 
	              "' data-dni='" + e["dni"] + "' data-nombre='" + 
	              e["nombre"] + "' data-apellido='" + e["apellido"] + "'>" + ((e["habilitado"])? 'Desabilitar ' : 'Habilitar') + 
	              " <i class='fa fa-toggle-on'></i></button>"  +
	          "<button data-action='deleteAdmin' data-dni='" + e["dni"] + "' data-nombre='" + 
	              e["nombre"] + "' data-apellido='" + e["apellido"] + "'><i class='fa fa-remove'></i></button>" +
	       "</div>"
         ]);
      });

      $('#admins').DataTable().clear().destroy();
      $('#admins').DataTable({
        "data": formattedData,
        "scrollX": true,
        "language": {
          "url": "https://cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"
        },
        "lengthMenu": [[50, 100, 500, -1], [50, 100, 500, "todos los"]]
      });
      $('#overlay-spinner').fadeOut();
    });
  }

  deleteAdmin(data){

    bootbox.confirm("¿Está seguro de querer eliminar al usuario " + data.nombre + " " + data.apellido + "?", resp=>{
         if(resp){
         	this.userService.deleteAdmin(data.dni).then(msg =>{ 
	             bootbox.alert(msg);
	         }, msg =>{
	             bootbox.alert(msg);
	         }).finally(()=>{ this.loadAdmins(); });
         }
    });
  }

  enableAdmin(data){

    bootbox.confirm("¿Está seguro de querer habilitar al usuario " + data.nombre + " " + data.apellido + "?", resp=>{

    	if(resp){
		     this.userService.toggleAdminEnabledState(data.dni, true).then(msg =>{ 
		         bootbox.alert(msg);
		     }, msg =>{
		         bootbox.alert(msg);
		     }).finally(()=>{ this.loadAdmins(); });
		 }
    }); 
  }

  disableAdmin(data){

    bootbox.confirm("¿Está seguro de querer deshabilitar al usuario " + data.nombre + " " + data.apellido + "?", resp=>{
         if(resp){
         	this.userService.toggleAdminEnabledState(data.dni, false).then(msg =>{ 
	             bootbox.alert(msg);
	         }, msg =>{
	             bootbox.alert(msg);
	         }).finally(()=>{ this.loadAdmins(); });
         }
    });
  }
}

