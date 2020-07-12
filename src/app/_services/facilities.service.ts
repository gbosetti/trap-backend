import { Injectable } from '@angular/core';
import * as $ from 'jquery';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FacilitiesService extends BaseService{

  	constructor(private auth: AuthenticationService, private router: Router) { 
        super(auth, router); 
    }

  	getFacilities(){
        
        return this.post(undefined,'instalaciones.php');
    }

    registerFacilities(facilities) { 

        var formData = new FormData();
            formData.append("nombre", facilities.name);

        return this.post(formData,'instalaciones_nueva.php');
    }

    deleteFacilities(id){

        var formData = new FormData();
            formData.append("id", id);

        return this.post(formData,'instalaciones_eliminar.php');
    }
}
