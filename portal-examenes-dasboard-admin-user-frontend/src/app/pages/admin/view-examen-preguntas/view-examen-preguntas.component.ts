import { MatSnackBar } from '@angular/material/snack-bar';
import { PreguntaService } from './../../../services/pregunta.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-examen-preguntas',
  templateUrl: './view-examen-preguntas.component.html',
  styleUrls: ['./view-examen-preguntas.component.css']
})
export class ViewExamenPreguntasComponent implements OnInit {

  examenId:any;
  titulo:any;
  preguntas:any = [];
  cupo:any = null;

  constructor(private route:ActivatedRoute,private preguntaService:PreguntaService,private snack:MatSnackBar) { }

  ngOnInit(): void {
    this.examenId = this.route.snapshot.params['examenId'];
    this.titulo = this.route.snapshot.params['titulo'];
    this.cargarPreguntas();
    this.cargarCupo();
  }

  cargarPreguntas() {
    this.preguntaService.listarPreguntasDelExamen(this.examenId).subscribe(
      (data:any) => {
        this.preguntas = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  cargarCupo() {
    this.preguntaService.obtenerCupoPreguntas(this.examenId).subscribe(
      (data:any) => {
        this.cupo = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  eliminarPregunta(preguntaId:any){
    Swal.fire({
      title:'Eliminar pregunta',
      text:'¿Estás seguro, quieres eliminar esta pregunta?',
      icon:'warning',
      showCancelButton:true,
      confirmButtonColor:'#3085d6',
      cancelButtonColor:'#d33',
      confirmButtonText:'Eliminar',
      cancelButtonText:'Cancelar'
    }).then((resultado) => {
      if(resultado.isConfirmed){
        this.preguntaService.eliminarPregunta(preguntaId).subscribe(
          () => {
            this.snack.open('Pregunta eliminada','',{
              duration:3000
            });
            this.preguntas = this.preguntas.filter((pregunta:any) => pregunta.preguntaId != preguntaId);
            this.cargarCupo();
          },
          (error) => {
            this.snack.open('Error al eliminar la pregunta','',{
              duration:3000
            });
            console.log(error);
          }
        );
      }
    });
  }
}