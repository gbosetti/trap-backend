import { Injectable } from '@angular/core';
import * as $ from 'jquery';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService extends BaseService{

    constructor(private auth: AuthenticationService, private router: Router) { 
        super(auth, router); 
    }

	getQuestions(){
        return this.post(undefined, 'preguntas.php');
    }

    registerQuestion(question) { 

        var formData = new FormData();
            formData.append("cuerpo", question.name);
            formData.append("respuesta_esperada", question.expectedAnswer==true? '1' : '0');

        return this.post(formData, 'pregunta_nueva.php');
    }

    updateQuestion(question) { 

        var formData = new FormData();
        	formData.append("id", question.id);
            formData.append("cuerpo", question.name);
            formData.append("respuesta_esperada", question.expectedAnswer==true? '1' : '0');

        return this.post(formData, 'pregunta_update.php');
    }

    deleteQuestion(id){

        var formData = new FormData();
            formData.append("id", id);

        return this.post(formData, 'pregunta_eliminar.php');
    }
}
