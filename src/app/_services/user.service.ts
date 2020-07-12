import { Injectable } from '@angular/core';
import { User } from '../_model/user';
import { environment } from '../../environments/environment';
import * as $ from 'jquery';
import { BaseService } from './base.service';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseService{

    constructor(private auth: AuthenticationService, private router: Router) { 
        super(auth, router); 
    }

    getUserMatching(keywords){
        var formData = new FormData();
            formData.append("keywords", keywords);

        return this.post(formData,'usuario_matching.php');
    }

  	private registerUser(user: User, endpoint, enableAuth) { 

        var formData = new FormData();
            formData.append("nombre", user.firstName);
            formData.append("apellido", user.lastName);
            formData.append("dni", user.dni.toString());
            formData.append("password", user.password);
            formData.append("codigo_area", user.codigo_area.toString());
            formData.append("telefono", user.telefono.toString());

        return this.post(formData, endpoint, enableAuth);
    }

    registerAdmin(user: User) { 

        return this.registerUser(user, 'admin_nuevo.php', false);
    }

    registerGuard(user: User) { 

        return this.registerUser(user, 'guardia_nuevo.php', true);
    }

    getAdmins(){
        return this.post(undefined, "admins.php");
    }

    getGuards(){
        return this.post(undefined, "guardias.php");
    }

    private deleteUser(dni, endpoint){

        var formData = new FormData();
            formData.append("dni", dni);

        var currDni = (<any>this.auth.currentUser.source).getValue()["dni"];

        return new Promise((resolve, reject) => {

            if(currDni == dni){
                reject('Usted no puede eliminar su propia cuenta.');
            }
            else{
                return this.post(formData, endpoint).then(data=>{
                    resolve(data);
                }).catch(err=>{reject(err)});
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

        var currDni = (<any>this.auth.currentUser.source).getValue()["dni"];

        return new Promise((resolve, reject) => {

            if(currDni == dni){
                reject('Usted no puede cambiar su propio estado.');
            }
            else{
                this.post(formData, endpoint).then(data=>{
                    resolve(data);
                }).catch(err=>{reject(err)});
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
