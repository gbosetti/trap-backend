
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../_model/user';
import { environment } from '../../environments/environment';
import * as $ from 'jquery';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    private apiUrl; //THIS SHOULD BE REPLACED BY THE ENVIRONMENTS VAR

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
        this.apiUrl = environment.apiUrl;
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    setCurrentUserToken(token){
        if(this.currentUserSubject.value!=undefined)
            this.currentUserSubject.value.token = token;
    }

    login(dni, password) {

        var formData = new FormData();
            formData.append("dni", dni);
            formData.append("password", password);

        var self = this;
        return new Promise((resolve, reject) => {
            $.ajax({
                "url": this.apiUrl + 'admin_autenticar.php',
                "type": 'post',
                "processData": false,
                "contentType": false,
                "success": function (res) {

                    var data = JSON.parse(res);
                    if ('data' in data) {

                        var user = new User();
                            user["dni"] = data["data"]["dni"];
                            user["firstName"] = data["data"]["nombre"];
                            user["lastName"] = data["data"]["apellido"];
                            user["token"] = data["data"]["token"];
                            
                        localStorage.setItem('currentUser', JSON.stringify(user));
                        self.currentUserSubject.next(user);
                        resolve(user);
                    }
                    else {reject(data.message);};
                },
                "error": function (request, status) {
                    reject(request.responseText);
                },
                "data": formData
            });
        }); 
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}
