// https://github.com/gbosetti
import { Component, OnInit, ViewChild } from '@angular/core';
import { FacilitiesService } from '../_services/facilities.service';
import * as $ from 'jquery';
import 'bootstrap';
import 'datatables.net';
import 'datatables.net-fixedcolumns-dt';
declare var bootbox: any;
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { DatatablesSpanish } from '../_helpers/datatables-spanish';

@Component({
  selector: 'app-facilities',
  templateUrl: './facilities.component.html',
  styleUrls: ['./facilities.component.css']
})
export class FacilitiesComponent implements OnInit {

  registerForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(private facilitiesService: FacilitiesService, private formBuilder: FormBuilder) {}

  ngOnInit() {

  	this.initializeDatatable();
  	this.loadFacilities();
  	this.registerForm = this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]]
    });

    $('#newFacilitiesModal').on('shown.bs.modal', ()=>{
      	$('#newFacilitiesModal input[formControlName="name"]').focus();
    });

    $('#newFacilitiesModal').on('hidden.bs.modal', ()=>{
    	this.initNewFacilitiesForm();
    });
  }

  initNewFacilitiesForm() {
  		this.registerForm.reset();
        $("#newFacilitiesModal .form-control").each((idx, ctrl)=>{$(ctrl).removeClass("is-invalid")});
        this.loading = false;
        this.submitted = false;
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  initializeDatatable(){

    $('#facilities').DataTable({
      "order": [[ 0, "asc" ]],
      "columnDefs": [ 
        { "title": "Nombre", "targets": 0 },
        { "title": "Acciones", "width": "150px", "targets": 1 }
      ]
    });
    var self = this;
    $('#facilities tbody').on( 'click', 'button', function () {
        self[this.getAttribute('data-action')](this.dataset);
    });
  }

  loadFacilities(){

  	var formattedData = [];
    $('#overlay-spinner').fadeIn();
    this.facilitiesService.getFacilities().then((res:any) => {

      res.data.forEach(e => {
        formattedData.push([
          e["nombre"], 
          "<div style='text-align: center'>" + 
	          "<button data-action='deleteFacilities' data-id='" + e["id"] + "' data-nombre='" + 
	              e["nombre"] + "'><i class='fa fa-remove'></i></button>" +
	       "</div>"
         ]);
      });

      $('#facilities').DataTable().clear().destroy();
      $('#facilities').DataTable({
        "data": formattedData,
        "scrollX": true,
        "language": DatatablesSpanish.getLangStrings(),
        "lengthMenu": [[50, 100, 500, -1], [50, 100, 500, "todos los"]]
      });
      $('#overlay-spinner').fadeOut();
    });
  }

  onNewFacilitiesSubmit() {
   
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return false;
        }

        this.loading = true;
        this.facilitiesService.registerFacilities(this.registerForm.value).then(
            msg => {
                //bootbox.alert(msg, ()=>{
                	$('.modal-backdrop').remove();
                //});
                $("#newFacilitiesModal").modal('hide');
                this.loadFacilities();
            },
            error => {
                bootbox.alert(error || "Error");
                this.loading = false;
            }
        );
        return false;
   }

  deleteFacilities(data){

    bootbox.confirm("¿Está seguro de querer eliminar " + data.nombre + "?", resp=>{
         if(resp){
         	this.facilitiesService.deleteFacilities(data.id).then(msg =>{ 
	             //bootbox.alert(msg);
	         }, msg =>{
	             bootbox.alert(msg);
	         }).finally(()=>{ this.loadFacilities(); });
         }
    });
  }
}

