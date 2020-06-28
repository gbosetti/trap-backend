import { Injectable } from '@angular/core';
import * as $ from 'jquery';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FacilitiesService {

  	constructor() { }

  	getFacilities(){
        return new Promise((resolve, reject) => {

            $.ajax({ 
                url: environment.apiUrl+'instalaciones.php',
                type: 'post',
                processData: false,
                contentType: false,
                success: function (data) {
                    resolve(JSON.parse(data));
                },
                "error": function (request, status) {
                    reject(request.responseText || "Error al recuperar la configuración desde el servidor.");
                }
            });
        });
    }

    registerFacilities(facilities) { 

        var formData = new FormData();
            formData.append("nombre", facilities.name);

        return new Promise((resolve, reject) => {

            $.ajax({
                url: environment.apiUrl + 'instalaciones_nueva.php',
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

    deleteFacilities(id){

        var formData = new FormData();
            formData.append("id", id);

        return new Promise((resolve, reject) => {
            $.ajax({
                url: environment.apiUrl + 'instalaciones_eliminar.php',
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
