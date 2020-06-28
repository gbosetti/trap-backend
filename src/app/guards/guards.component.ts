// https://github.com/gbosetti
import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../_services/user.service';
import * as $ from 'jquery';
import 'bootstrap';
import 'datatables.net';
import 'datatables.net-fixedcolumns-dt';
declare var bootbox: any;
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-guards',
  templateUrl: './guards.component.html',
  styleUrls: ['./guards.component.css']
})
export class GuardsComponent implements OnInit {
  
  registerForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(private userService: UserService, private formBuilder: FormBuilder) {}

  ngOnInit() {

  	this.initializeDatatable();
  	this.loadGuards();
  	this.registerForm = this.formBuilder.group({
        firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(35)]],
        lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(35)]],
        password: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(15)]],
        dni: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(15)]]
    });

    $('#newGuardModal').on('shown.bs.modal', ()=>{
      	$('#newGuardModal input[formControlName="firstName"]').val('').focus();
    });

    $('#newGuardModal').on('hidden.bs.modal', ()=>{
    	this.initNewGuardForm();
    	//$('.modal-backdrop').remove();
    });
  }

  initNewGuardForm() {
  		this.registerForm.reset();
        $("#newGuardModal .form-control").each((idx, ctrl)=>{$(ctrl).removeClass("is-invalid")});
        this.loading = false;
        this.submitted = false;
  }

  onNewGuardSubmit() {
   
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return false;
        }

        this.loading = true;
        this.userService.registerGuard(this.registerForm.value).then(
            msg => {
                bootbox.alert(msg, ()=>{
                	$('.modal-backdrop').remove();
                });
                $("#newGuardModal").modal('hide');
                this.loadGuards();
            },
            error => {
                bootbox.alert(error || "Error");
                this.loading = false;
            }
        );
        return false;
   }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  initializeDatatable(){

    $('#guards').DataTable({
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
    $('#guards tbody').on( 'click', 'button', function () {
        self[this.getAttribute('data-action')](this.dataset);
    });
  }

  toBool(val) {
    return !!JSON.parse(String(val).toLowerCase());
  }

  loadGuards(){

  	var formattedData = [];
    $('#overlay-spinner').fadeIn();
    this.userService.getGuards().then((guards: Array<any>) => {

      guards.forEach(e => {
      	
        e["habilitado"] = this.toBool(e["habilitado"]);
        formattedData.push([
          e["apellido"], 
          e["nombre"], 
          e["dni"],
          e["habilitado"]? 'Si <i class="fa fa-check" style="color:green"></i>' : 'No <i class="fa fa-times" style="color:#d5220e"></i>',
          "<div style='text-align: center'>" + 
	          "<button data-action='" + ((e["habilitado"])? 'disableGuard' : 'enableGuard') + 
	              "' data-dni='" + e["dni"] + "' data-nombre='" + 
	              e["nombre"] + "' data-apellido='" + e["apellido"] + "'>" + ((e["habilitado"])? 'Desabilitar ' : 'Habilitar') + 
	              " <i class='fa fa-toggle-on'></i></button>"  +
	          "<button data-action='deleteGuard' data-dni='" + e["dni"] + "' data-nombre='" + 
	              e["nombre"] + "' data-apellido='" + e["apellido"] + "'><i class='fa fa-remove'></i></button>" +
	       "</div>"
         ]);
      });

      $('#guards').DataTable().clear().destroy();
      $('#guards').DataTable({
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

  deleteGuard(data){

    bootbox.confirm("¿Está seguro de querer eliminar al usuario " + data.nombre + " " + data.apellido + "?", resp=>{
         if(resp){
         	this.userService.deleteGuard(data.dni).then(msg =>{ 
	             //bootbox.alert(msg);
	         }, msg =>{
	             bootbox.alert(msg);
	         }).finally(()=>{ this.loadGuards(); });
         }
    });
  }

  enableGuard(data){

    bootbox.confirm("¿Está seguro de querer habilitar al usuario " + data.nombre + " " + data.apellido + "?", resp=>{

    	if(resp){
		     this.userService.toggleGuardEnabledState(data.dni, true).then(msg =>{ 
		         //bootbox.alert(msg);
		     }, msg =>{
		         bootbox.alert(msg);
		     }).finally(()=>{ this.loadGuards(); });
		 }
    }); 
  }

  disableGuard(data){

    bootbox.confirm("¿Está seguro de querer deshabilitar al usuario " + data.nombre + " " + data.apellido + "?", resp=>{
         if(resp){
         	this.userService.toggleGuardEnabledState(data.dni, false).then(msg =>{ 
	            //bootbox.alert(msg);
	         }, msg =>{
	             bootbox.alert(msg);
	         }).finally(()=>{ this.loadGuards(); });
         }
    });
  }
}

