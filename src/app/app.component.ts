import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './_services/authentication.service';
import { User } from './_model/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  	title = 'trap-backend';
  	currentUser: User;

  	constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

    navMovements(){
        this.router.navigate(['/home']);
    }

    navAdmins(){
        this.router.navigate(['/admins']);
    }

    navQuestions(){
        this.router.navigate(['/questions']);
    }

    navHome(){
        this.navMovements();
    }

    navSettings(){
        this.router.navigate(['/settings']);
    }

    navGuards(){
        this.router.navigate(['/guards']);
    }

    navFacilities(){
        this.router.navigate(['/facilities']);
    }
}
