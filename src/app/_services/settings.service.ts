import { Injectable } from '@angular/core';
import * as $ from 'jquery';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SettingsService extends BaseService{

    constructor(private auth: AuthenticationService, private router: Router) { 
        super(auth, router); 
    }

  	getSettings(){
        return this.post(undefined,'settings.php');
    }

    updateSettings(settings){

        var formData = new FormData();
            formData.append("settings", JSON.stringify(settings));

        return this.post(formData,'settings_update.php');
    }
}
