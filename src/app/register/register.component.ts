// Implemented by https://github.com/gbosetti
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { UserService } from '../_services/user.service';
import { AuthenticationService } from '../_services/authentication.service';
import * as $ from 'jquery';
declare var bootbox: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    registerForm: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService
    ) {}

    ngOnInit() {
    	$('input:text:visible:first').focus();
        this.registerForm = this.formBuilder.group({
            firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(35)]],
            lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(35)]],
            password: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(15)]],
            dni: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(15)]],
            telefono: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(10)]],
            codigo_area: [54380, [Validators.required, Validators.minLength(3), Validators.maxLength(4)]]
        });
        $('input:text:visible:first').focus();
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
        this.userService.registerAdmin(this.registerForm.value).then(
            (res:any) => {
                this.router.navigate(['/login']).then(()=>{
                  bootbox.alert({ message: res.message });
                });
            },
            error => {
                bootbox.alert({ message: (error || "Error") });
                this.loading = false;
            }
        );
    }

}
