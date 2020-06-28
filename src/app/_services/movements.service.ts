import { Injectable } from '@angular/core';
import * as $ from 'jquery';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovementsService {

  constructor() { }

  getUsers(){
  	return this.post(undefined, 'usuarios.php');
  }

  getMovements(){
    return this.post(undefined, 'movimientos.php');
  }

  getAuthorizedMovements(){
    return this.post(undefined, 'movimientos_autorizados.php');
  }

  getDeniedMovements(){
    return this.post(undefined, 'movimientos_denegados.php');
  }

  getNotClosedMovements(){
    return this.post(undefined, 'movimientos_incompletos.php');
  }

  getMovementsMatchingUser(dni){
    var formData = new FormData();
        formData.append("dni", dni);
    return this.post(formData, 'movimientos_matching.php');
  }

  post(formData, endpoint) {

        return new Promise((resolve, reject) => {
            $.ajax({
                url: environment.apiUrl+endpoint,
                type: 'post',
                processData: false,
                contentType: false,
                success: function (data) {
                    var res = JSON.parse(data);
                    if(res.error==false) resolve(res.data);
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
