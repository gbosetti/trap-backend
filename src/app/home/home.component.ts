import { Component, OnInit } from '@angular/core';
import { MovementsService } from'../_services/movements.service';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-fixedcolumns-dt';
declare var bootbox: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	toDate: String = (new Date()).toISOString().split('T')[0];
    toDateForReal: Date;
    fromDate: String = new Date(((new Date()).setMonth((new Date()).getMonth()-1))).toISOString().split('T')[0];
    fromDateForReal: Date;

	constructor(private movements: MovementsService) { }

	ngOnInit() {
		var self = this;
		$(document).ready(()=>{
		    this.enableDatatable();
		    this.loadMovements();    
		});
	}

	loadMovements(){

    var formattedData = [];
    $('#overlay-spinner').fadeIn();
    this.movements.getMovements().then((movements: Array<any>) => {

      movements.forEach(e => {

        var preguntas = '';
        e["preguntas"] = JSON.parse(e["preguntas"]).forEach(preg=>{ 
          preguntas +=
          (preg['passed']==1? '<i class="fa fa-check" style="color:green"></i> ' : '<i class="fa fa-times" style="color:#d5220e"></i> ') + 
          preg['value'] + '<br>' 
        });

        formattedData.push([
          e["entrada"], 
          e["salida"]=='0000-00-00 00:00:00'? '':e["salida"], //.replace(' ', '<br>'), 
          e["apellido"].replace(' ', '<br>'), 
          e["nombre"].replace(' ', '<br>'), 
          e["dni"], 
          "<div style='text-align: center'>" + 
            e["temperatura"] +
          "</div>", 
          "<div style='text-align: center'>" + 
              (e["supero_olfativo"]==1? '<i class="fa fa-check" style="color:green"></i> Si' : '<i class="fa fa-times" style="color:#d5220e"></i> No') + 
          "</div>", 
          preguntas
         ]);
      });

      $('#movements').DataTable().clear().destroy();
      $('#movements').DataTable({
        "data": formattedData,
        "language": {
          "url": "https://cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"
        }
      });
      $('#overlay-spinner').fadeOut();
    });
	}

  	enableDatatable(){

        $('#movements').DataTable({
              "columnDefs": [ 
                { "title": "Entrada", "targets": 0, "width": "75px" },
                { "title": "Salida", "targets": 1, "width": "100px" },
                { "title": "Apellido", "targets": 2, "width": "100px" },
                { "title": "Nombre", "targets": 3, "width": "75px" },
                { "title": "DNI", "targets": 4, "width": "75px" },
                { "title": "Tempe<br>ratura", "targets": 5, "width": "75px" },
                { "title": "Test<br>olfativo<br>superado", "targets": 6, "width": "75px" },
                { "title": "Preguntas superadas", "targets": 7 }
              ]
        });
        var self = this;
	    $('#movements tbody').on( 'click', 'button', function () {
	        self[this.getAttribute('data-action')](this.dataset);
	    });
    }

}
