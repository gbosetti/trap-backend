import { Injectable } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { User } from '../_model/user';
import { environment } from '../../environments/environment';
import * as $ from 'jquery';

@Injectable({ providedIn: 'root' })
export class UserService {

    constructor(private authenticationService: AuthenticationService) {}

    getUserMatching(keywords){
        var formData = new FormData();
            formData.append("keywords", keywords);

        return new Promise((resolve, reject) => {

            $.ajax({ 
                url: environment.apiUrl+'usuario_matching.php',
                type: 'post',
                processData: false,
                contentType: false,
                success: function (data) {
                    resolve(JSON.parse(data));
                },
                "error": function (request, status) {
                    reject([]);
                },
                data: formData
            });
        });
    }

  	registerAdmin(user: User) { 

        var formData = new FormData();
            formData.append("nombre", user.firstName);
            formData.append("apellido", user.lastName);
            formData.append("dni", user.dni.toString());
            formData.append("password", user.password);

        return new Promise((resolve, reject) => {

            $.ajax({
                url: environment.apiUrl + 'admin_nuevo.php',
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

    getAdmins(){

        return new Promise((resolve, reject) => {
            $.ajax({
                dataType: "json",
                url: environment.apiUrl +"admins.php", 
                success: function(data) {

                    resolve(data);
                }
            });
        });
    }

    deleteAdmin(dni){

        var formData = new FormData();
            formData.append("dni", dni);

        var currDni = (<any>this.authenticationService.currentUser.source).getValue()["dni"];

        return new Promise((resolve, reject) => {

            if(currDni == dni){
                reject('Usted no puede eliminar su propia cuenta.');
            }
            else{
                $.ajax({
                    url: environment.apiUrl + 'admin_eliminar.php',
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
            };
        });
    }

    toggleAdminEnabledState(dni, enabled){

        var formData = new FormData();
            formData.append("dni", dni);
            formData.append("habilitado", (enabled? "1":"0"));

        var currDni = (<any>this.authenticationService.currentUser.source).getValue()["dni"];

        return new Promise((resolve, reject) => {

            if(currDni == dni){
                reject('Usted no puede cambiar su propio estado.');
            }
            else{
                $.ajax({
                    url: environment.apiUrl + 'admin_toggle_enabled.php',
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
            }
        });
    }
}
