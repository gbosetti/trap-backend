import { Injectable } from '@angular/core';
import * as $ from 'jquery';
import { environment } from '../../environments/environment';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  	private authError: string;

	constructor(private authenticationService: AuthenticationService, private routerService: Router) { 
        this.authError="Su sesión ha caducado. Por favor, inicie sesión nuevamente.";
	}

    post(formData, endpoint, auth=true) {

        if(formData==undefined){
            formData = new FormData();
        }

        if(auth){
            formData.append("guard_token", this.authenticationService.currentUserValue.token);
            formData.append("guard_dni", this.authenticationService.currentUserValue.dni);
        }

        return new Promise((resolve, reject) => {
            $.ajax({
                url: environment.apiUrl+endpoint,
                type: 'post',
                processData: false,
                contentType: false,
                success: (data)=>{
                    this.handleResponseSuccess(data, resolve, reject);
                },
                "error": function (request, status) {
                    reject(status);
                },
                data: formData
            });
        });
    }

    handleResponseSuccess(data, resolve, reject){
        console.log(data);
        var res = JSON.parse(data);   
        if(res.auth==undefined || res.auth==false) {
            this.logout();
            reject(this.authError);
        }
        else this.authenticationService.setCurrentUserToken(res.token);

        if(res.error==false) resolve(res);
        else reject(res.message);
    }

    get(formData, endpoint) {

        if(formData==undefined){
            formData = new FormData();
        }
        formData.append("guard_token", this.authenticationService.currentUserValue.token);
        formData.append("guard_dni", this.authenticationService.currentUserValue.dni);

        return new Promise((resolve, reject) => {
            $.ajax({
                url: environment.apiUrl+endpoint,
                type: 'get',
                processData: false,
                contentType: false,
                success: (data)=>{
                    this.handleResponseSuccess(data, resolve, reject);
                },
                "error": function (request, status) {
                    reject(request.responseText);
                },
                data: formData
            });
        });
    }

    logout(){
    	this.authenticationService.logout();
    	this.routerService.navigate(["/login"]);
    }
}
