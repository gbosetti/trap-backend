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

  post(formData, endpoint) {

        return new Promise((resolve, reject) => {
            $.ajax({
                url: environment.apiUrl+endpoint,
                type: 'post',
                processData: false,
                contentType: false,
                success: function (data) {
                  console.log(data);
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
