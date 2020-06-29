import { Injectable } from '@angular/core';
import * as $ from 'jquery';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  	constructor() { }

	getQuestions(){
        return new Promise((resolve, reject) => {

            $.ajax({ 
                url: environment.apiUrl+'preguntas.php',
                type: 'post',
                processData: false,
                contentType: false,
                success: function (data) {
                    resolve(JSON.parse(data));
                },
                "error": function (request, status) {
                    reject(request.responseText || "Error al recuperar datos desde el servidor.");
                }
            });
        });
    }

    registerQuestion(question) { 

        var formData = new FormData();
            formData.append("cuerpo", question.name);
            formData.append("respuesta_esperada", question.expectedAnswer==true? '1' : '0');

        return new Promise((resolve, reject) => {

            $.ajax({
                url: environment.apiUrl + 'pregunta_nueva.php',
                type: 'post',
                processData: false,
                contentType: false,
                success: function (data) {
                    var res = JSON.parse(data);
                    if(res.error==false) resolve(res.message);
                    else reject(res.message);
                },
                "error": function (request, status) {
                    reject(request.responseText);
                },
                data: formData
            });
        });
    }

    updateQuestion(question) { 

        var formData = new FormData();
        	formData.append("id", question.id);
            formData.append("cuerpo", question.name);
            formData.append("respuesta_esperada", question.expectedAnswer==true? '1' : '0');

        return new Promise((resolve, reject) => {

            $.ajax({
                url: environment.apiUrl + 'pregunta_update.php',
                type: 'post',
                processData: false,
                contentType: false,
                success: function (data) {
                    var res = JSON.parse(data);
                    if(res.error==false) resolve(res.message);
                    else reject(res.message);
                },
                "error": function (request, status) {
                    reject(request.responseText);
                },
                data: formData
            });
        });
    }

    deleteQuestion(id){

        var formData = new FormData();
            formData.append("id", id);

        return new Promise((resolve, reject) => {
            $.ajax({
                url: environment.apiUrl + 'pregunta_eliminar.php',
                type: 'post',
                processData: false,
                contentType: false,
                success: function (data) {
                    var res = JSON.parse(data);
                    if(res.error==false) resolve(res.message);
                    else reject(res.message);
                },
                "error": function (request, status) {
                    reject(request.responseText);
                },
                data: formData
            });
        });
    }
}
