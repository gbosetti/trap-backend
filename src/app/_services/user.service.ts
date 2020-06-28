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

  	private registerUser(user: User, endpoint) { 

        var formData = new FormData();
            formData.append("nombre", user.firstName);
            formData.append("apellido", user.lastName);
            formData.append("dni", user.dni.toString());
            formData.append("password", user.password);

        return new Promise((resolve, reject) => {

            $.ajax({
                url: environment.apiUrl + endpoint,
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

    registerAdmin(user: User) { 

        return this.registerUser(user, 'admin_nuevo.php');
    }

    registerGuard(user: User) { 

        return this.registerUser(user, 'guardia_nuevo.php');
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

    getGuards(){

        return new Promise((resolve, reject) => {
            $.ajax({
                dataType: "json",
                url: environment.apiUrl +"guardias.php", 
                success: function(data) {
                    resolve(data);
                }
            });
        });
    }

    private deleteUser(dni, endpoint){

        var formData = new FormData();
            formData.append("dni", dni);

        var currDni = (<any>this.authenticationService.currentUser.source).getValue()["dni"];

        return new Promise((resolve, reject) => {

            if(currDni == dni){
                reject('Usted no puede eliminar su propia cuenta.');
            }
            else{
                $.ajax({
                    url: environment.apiUrl + endpoint,
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

    deleteAdmin(dni){

        return this.deleteUser(dni, 'admin_eliminar.php');
    }

    deleteGuard(dni){

        return this.deleteUser(dni, 'guardia_eliminar.php');
    }

    private toggleUserEnabledState(dni, enabled, endpoint){

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
                    url: environment.apiUrl + endpoint,
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

    toggleAdminEnabledState(dni, enabled){

        return this.toggleUserEnabledState(dni, enabled, 'admin_toggle_enabled.php');
    }

    toggleGuardEnabledState(dni, enabled){

        return this.toggleUserEnabledState(dni, enabled, 'guardia_toggle_enabled.php');
    }
}
