import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../_services/settings.service';
import * as $ from 'jquery';
declare var bootbox: any;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private settingsService: SettingsService) { }

	ngOnInit() {
	  	this.loadSettings();
	}

  	loadSettings(){
  		
  		$(".settings").html('');
  		this.settingsService.getSettings().then((res:any) => {

    		var i = 0, row;
      		res.data.forEach(cog => {

      			if (i % 3 == 0){
	    			row = $(`<div class="row"></div>`);
	  				$(".settings").append(row);
	    		}
	    		i++;

      			row.append($(`<div class="col-4" style="padding: 1em;">
	      			<div class="card" style="background: rgba(0,0,0,0.125); border: none; padding: 1em;">
				      	<div class="form-group">
				            <label for="${cog['nombre']}"><h5 class="card-title">
				            	${cog['display']} 
				            	<i class="fa fa-info-circle ml-2 text-primary cog-info" aria-hidden="true" data-toggle="tooltip" data-placement="right" title="${cog['tooltip']}"></i>
				            </h5></label>
				            <input type="${cog['tipo']}" name="${cog['nombre']}" value="${cog['valor']}" placeholder='${cog['placeholder']}' class="form-control" [ngClass]="{ 'is-invalid': submitted && f[${cog['nombre']}].errors }" />
				            <div *ngIf="submitted && f[${cog['nombre']}].errors" class="invalid-feedback">
				                <div *ngIf="f[${cog['nombre']}].errors.required">Este es un campo obligatorio</div>
				            </div>
				        </div>
				    </div>
				</div>`));
  			});

  			$('input[formControlName="temperature"]').focus();
  			$('[data-toggle="tooltip"]').tooltip();
	  			
  		}).catch(err=>{bootbox.alert(err || "Error")});
  	}

  	saveSettings(){
  		var settings = [];
  		$(".settings .card input").each((idx, ctrl)=>{
  			settings.push({
  				"valor": $(ctrl).val(),
  				"nombre": $(ctrl).attr("name")
  			});
  		});
  		this.settingsService.updateSettings(settings).then(msg=>{
  			bootbox.alert(msg);
  			this.loadSettings();
  		}).catch((err)=>{console.log(err); bootbox.alert(err)});
  	}
}
