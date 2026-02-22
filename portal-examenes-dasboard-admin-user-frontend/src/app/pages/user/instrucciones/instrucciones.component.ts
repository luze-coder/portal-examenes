import { ActivatedRoute, Router } from '@angular/router';
import { ExamenService } from './../../../services/examen.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { LoginService } from 'src/app/services/login.service';
import { ExamenAlumnoService } from 'src/app/services/examen-alumno.service';

@Component({
  selector: 'app-instrucciones',
  templateUrl: './instrucciones.component.html',
  styleUrls: ['./instrucciones.component.css']
})
export class InstruccionesComponent implements OnInit {

  examenId: any;
  examen: any = new Object();
  puedeComenzar = true;

  constructor(
    private examenService: ExamenService,
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private examenAlumnoService: ExamenAlumnoService
  ) { }

  ngOnInit(): void {
    this.examenId = this.route.snapshot.params['examenId'];

    this.examenService.obtenerExamen(this.examenId).subscribe(
      (data: any) => {
        this.examen = data;
      },
      (error) => {
        console.log(error);
      }
    );

    this.validarSiPuedeRendir();
  }

  obtenerTiempoMinutos(): number {
    const tiempoConfigurado = Number(this.examen?.tiempoMaximoMinutos || 0);
    if (tiempoConfigurado > 0) {
      return tiempoConfigurado;
    }

    const preguntas = Number(this.examen?.numeroDePreguntas || 0);
    return preguntas > 0 ? preguntas * 2 : 0;
  }

  validarSiPuedeRendir() {
    const user = this.loginService.getUser();

    this.examenAlumnoService.obtenerEstadoAlumnoExamen(Number(user.id), Number(this.examenId)).subscribe(
      (estado: any) => {
        this.puedeComenzar = !estado.realizado;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  empezarExamen() {
    if (!this.puedeComenzar) {
      Swal.fire({
        icon: 'info',
        title: 'Examen ya realizado',
        text: 'Este examen ya fue completado. Podés revisar tu nota en Ver notas.'
      });
      return;
    }

    Swal.fire({
      title: '¿Quieres comenzar el examen?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Empezar',
      icon: 'info'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.router.navigate(['/start/' + this.examenId]);
      }
    });
  }

}