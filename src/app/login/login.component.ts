import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../_services/authentication.service';
import * as $ from 'jquery';
declare var bootbox: any;
import { MovementsService } from'../_services/movements.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  	loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            dni: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = '/'; //this.route.snapshot.queryParams['returnUrl'] || '/';
        $('input:text:visible:first').focus();
    }

  	get f() { return this.loginForm.controls; }

	onSubmit() {
	    this.submitted = true;

	    // stop here if form is invalid
	    if (this.loginForm.invalid) {
	        return;
	    }

	    this.loading = true;
	    this.authenticationService.login(this.f.dni.value, this.f.password.value).then(userData => {
	        this.router.navigate(['/home']);
	    }, errorMessage => {
	        alert(errorMessage);
	        this.loading = false;
	    });
	}

}
