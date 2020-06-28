import { Injectable } from '@angular/core';
import * as $ from 'jquery';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  	constructor() { }

  	getSettings(){
        return new Promise((resolve, reject) => {

            $.ajax({ 
                url: environment.apiUrl+'settings.php',
                type: 'post',
                processData: false,
                contentType: false,
                success: function (data) {
                    resolve(JSON.parse(data));
                },
                "error": function (request, status) {
                    console.log("ERRORRRRRRRRRRRRRRRRRRRRRRRR", request, status);
                    reject(request.responseText || "Error al recuperar la configuración desde el servidor.");
                }
            });
        });
    }

    updateSettings(settings){

        var formData = new FormData();
            formData.append("settings", JSON.stringify(settings));

        return new Promise((resolve, reject) => {
            $.ajax({
                url: environment.apiUrl+'settings_update.php',
                type: 'post',
                processData: false,
                contentType: false,
                success: function (data) {
                    var res = JSON.parse(data);
                    console.log(res);
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
