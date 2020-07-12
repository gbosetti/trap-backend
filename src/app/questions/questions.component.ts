// https://github.com/gbosetti
import { Component, OnInit, ViewChild } from '@angular/core';
import { QuestionsService } from '../_services/questions.service';
import * as $ from 'jquery';
import 'bootstrap';
import 'datatables.net';
import 'datatables.net-fixedcolumns-dt';
declare var bootbox: any;
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { DatatablesSpanish } from '../_helpers/datatables-spanish';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  registerForm: FormGroup;
  loading = false;
  submitted = false;
  currentQuestionId;

  updateAnswerLabel(evt){
  	$(".custom-control-label-expected-answer").html($(evt.target).prop('checked')? 'Si': 'No');
  }

  constructor(private questions: QuestionsService, private formBuilder: FormBuilder) {}

  ngOnInit() {

  	this.initializeDatatable();
  	this.loadQuestions();
  	this.registerForm = this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
        expectedAnswer: ['']
    });

    $('#newQuestionModalButton').on('click', ()=>{
        $('#newQuestionModal').data("action", "createQuestion");
    });

    $('#newQuestionModal').on('shown.bs.modal', ()=>{
      	$('#newQuestionModal input[formControlName="name"]').focus();
    });

    $('#newQuestionModal').on('hidden.bs.modal', ()=>{
    	this.initNewFacilitiesForm();
    });
  }

  initNewFacilitiesForm() {
  		this.registerForm.reset();
        $("#newQuestionModal .form-control").each((idx, ctrl)=>{$(ctrl).removeClass("is-invalid")});
        this.loading = false;
        this.submitted = false;
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  initializeDatatable(){

    $('#questions').DataTable({
      "order": [[ 0, "asc" ]],
      "columnDefs": [ 
        { "title": "Cuerpo", "targets": 0 },
        { "title": "Respuesta esperada", "width": "100px", "targets": 1 },
        { "title": "Acciones", "width": "150px", "targets": 2 }
      ]
    });
    var self = this;
    $('#questions tbody').on( 'click', 'button', function () {
        self[this.getAttribute('data-action')](this.dataset);
    });
  }

  toBool(val) {
    return !!JSON.parse(String(val).toLowerCase());
  }

  loadQuestions(){

  	var formattedData = [];
    $('#overlay-spinner').fadeIn();
    this.questions.getQuestions().then((res:any) => {

    res.data.forEach(e => {

		e["respuesta_esperada"] = this.toBool(e["respuesta_esperada"]);

        formattedData.push([
          e["cuerpo"], 
          e["respuesta_esperada"]? 'Si <i class="fa fa-check" style="color:green"></i>' : 'No <i class="fa fa-times" style="color:#d5220e"></i>', 
          "<div style='text-align: center'>" + 
              "<button data-action='editQuestion' data-id='" + e["id"] + "' data-cuerpo='" + 
	              e["cuerpo"] + "' data-answer='" + e["respuesta_esperada"] + "'><i class='fa fa-edit'></i></button>" +
	          "<button data-action='deleteQuestion' data-id='" + e["id"] + "' data-cuerpo='" + 
	              e["cuerpo"] + "'><i class='fa fa-remove'></i></button>" +
	       "</div>"
         ]);
      });

      $('#questions').DataTable().clear().destroy();
      $('#questions').DataTable({
        "data": formattedData,
        "scrollX": true,
        "language": DatatablesSpanish.getLangStrings(),
        "lengthMenu": [[50, 100, 500, -1], [50, 100, 500, "todos los"]]
      });
      $('#overlay-spinner').fadeOut();
    });
  }

  onNewQuestionSubmit() {
   
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return false;
        }

        this.loading = true;
        var method = $('#newQuestionModal').data("action");
        this[method](this.registerForm.value);
        return false;
   }

   createQuestion(formValues){
     this.questions.registerQuestion(formValues).then(
          msg => {
              /*bootbox.alert(msg, ()=>{
                $('.modal-backdrop').remove();
              });*/
              $("#newQuestionModal").modal('hide');
              $('.modal-backdrop').remove();
              this.loadQuestions();
          },
          error => {
              bootbox.alert(error || "Error");
              this.loading = false;
          }
      );
   }

   updateQuestion(formValues){
     formValues['id'] = this.currentQuestionId;
     this.questions.updateQuestion(formValues).then(
          msg => {
              $("#newQuestionModal").modal('hide');
              $('.modal-backdrop').remove();
              this.loadQuestions();
          },
          error => {
              bootbox.alert(error || "Error");
              this.loading = false;
          }
      );
   }

   editQuestion(data){
     this.currentQuestionId=data.id;
     $('#newQuestionModal').data("action", "updateQuestion");
     $("#newQuestionModal").modal('show');
     this.registerForm.get('name').setValue(data.cuerpo);
     this.registerForm.get('expectedAnswer').setValue(data.answer);
     $("#expectedAnswer").prop("checked", this.toBool(data.answer));
   }

  deleteQuestion(data){

    bootbox.confirm("¿Está seguro de querer eliminar la siguiente pregunta?: " + data.cuerpo, resp=>{
         if(resp){
         	this.questions.deleteQuestion(data.id).then(msg =>{ 
	            // bootbox.alert(msg);
	         }, msg =>{
	             bootbox.alert(msg);
	         }).finally(()=>{ this.loadQuestions(); });
         }
    });
  }
}