import { Injectable } from '@angular/core';
import * as $ from 'jquery';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MovementsService extends BaseService{

  constructor(private auth: AuthenticationService, private router: Router) { 
      super(auth, router); 
  }

  getUsers(){
  	return this.post(undefined, 'usuarios.php');
  }

  getMovements(fromDate, toDate){
    var formData = new FormData();
        formData.append("fromDate", fromDate.toString());
        formData.append("toDate", toDate.toString());

    return this.post(formData, 'movimientos.php');
  }

  getAuthorizedMovements(fromDate, toDate){
    var formData = new FormData();
        formData.append("fromDate", fromDate.toString());
        formData.append("toDate", toDate.toString());

    return this.post(formData, 'movimientos_autorizados.php');
  }

  getDeniedMovements(fromDate, toDate){
    var formData = new FormData();
        formData.append("fromDate", fromDate.toString());
        formData.append("toDate", toDate.toString());

    return this.post(formData, 'movimientos_denegados.php');
  }

  getNotClosedMovements(fromDate, toDate){
    var formData = new FormData();
        formData.append("fromDate", fromDate.toString());
        formData.append("toDate", toDate.toString());

    return this.post(formData, 'movimientos_incompletos.php');
  }

  getMovementsMatchingUser(dni, fromDate, toDate){
    var formData = new FormData();
        formData.append("fromDate", fromDate.toString());
        formData.append("toDate", toDate.toString());
        formData.append("dni", dni);
        
    return this.post(formData, 'movimientos_matching.php');
  }
}
