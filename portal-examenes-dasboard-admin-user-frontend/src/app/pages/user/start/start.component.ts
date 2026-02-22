import { PreguntaService } from './../../../services/pregunta.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { LoginService } from 'src/app/services/login.service';
import { ExamenAlumnoService } from 'src/app/services/examen-alumno.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  examenId: any;
  preguntas: any;
  puntosConseguidos = 0;
  respuestasCorrectas = 0;
  intentos = 0;

  esEnviado = false;
  evaluando = false;
  timer: any;

  constructor(
    private locationSt: LocationStrategy,
    private route: ActivatedRoute,
    private router: Router,
    private preguntaService: PreguntaService,
    private examenAlumnoService: ExamenAlumnoService,
    private loginService: LoginService
  ) { }


  ngOnInit(): void {
    this.prevenirElBotonDeRetroceso();
    this.examenId = this.route.snapshot.params['examenId'];
    this.validarSiPuedeRendir();
  }

  validarSiPuedeRendir() {
    const user = this.loginService.getUser();

    this.examenAlumnoService.obtenerEstadoAlumnoExamen(Number(user.id), Number(this.examenId)).subscribe(
      (estado: any) => {
        if (estado.realizado) {
          Swal.fire({
            icon: 'info',
            title: 'Examen ya realizado',
            text: 'No podés rendir este examen más de una vez.'
          }).then(() => this.router.navigate(['/user-dashboard/0']));
          return;
        }

        this.cargarPreguntas();
      },
      (error) => {
        console.log(error);
        this.cargarPreguntas();
      }
    );
  }

  cargarPreguntas() {
    this.preguntaService.listarPreguntasDelExamenParaLaPrueba(this.examenId).subscribe(
      (data: any) => {
        this.preguntas = data;

        const examen = this.preguntas?.[0]?.examen;
        const tiempoConfiguradoMin = Number(examen?.tiempoMaximoMinutos || 0);
        const tiempoFallbackMin = this.preguntas.length * 2;
        const tiempoTotalMin = tiempoConfiguradoMin > 0 ? tiempoConfiguradoMin : tiempoFallbackMin;

        this.timer = tiempoTotalMin * 60;

        this.preguntas.forEach((p: any) => {
          p['respuestaDada'] = '';
        });
        this.iniciarTemporizador();
      },
      (error) => {
        console.log(error);
        Swal.fire('Error', 'Error al cargar las preguntas de la prueba', 'error');
      }
    );
  }

  obtenerOpciones(pregunta: any): string[] {
    if (Array.isArray(pregunta?.opciones) && pregunta.opciones.length > 0) {
      return pregunta.opciones;
    }

    return [pregunta?.opcion1, pregunta?.opcion2, pregunta?.opcion3, pregunta?.opcion4]
      .map((op: string) => (op || '').trim())
      .filter((op: string) => !!op)
      .filter((op: string, i: number, arr: string[]) => arr.indexOf(op) === i);
  }

  iniciarTemporizador() {
    let t = window.setInterval(() => {
      if (this.timer <= 0) {
        this.evaluarExamen();
        clearInterval(t);
      } else {
        this.timer--;
      }
    }, 1000);
  }

  prevenirElBotonDeRetroceso() {
    history.pushState(null, null!, location.href);
    this.locationSt.onPopState(() => {
      history.pushState(null, null!, location.href);
    });
  }

  enviarCuestionario() {
    if (this.evaluando || this.esEnviado) {
      return;
    }

    Swal.fire({
      title: '¿Quieres enviar el examen?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Enviar',
      icon: 'info'
    }).then((e) => {
      if (e.isConfirmed) {
        this.evaluarExamen();
      }
    });
  }

  evaluarExamen() {
    if (this.evaluando || this.esEnviado) {
      return;
    }

    this.evaluando = true;

    this.preguntaService.evaluarExamen(this.preguntas).subscribe(
      (data: any) => {

        this.puntosConseguidos = data.puntosMaximos;
        this.respuestasCorrectas = data.respuestasCorrectas;
        this.intentos = data.intentos;
        this.esEnviado = true;

        const user = this.loginService.getUser();

        const payload = {
          alumnoId: user.id,
          examenId: this.examenId,
          nota: this.puntosConseguidos
        };

        this.examenAlumnoService.guardarResultado(payload).subscribe(
          () => {
            this.evaluando = false;
          },
          (err) => {
            this.evaluando = false;

            if (err?.status === 409) {
              Swal.fire({
                icon: 'info',
                title: 'Examen ya registrado',
                text: 'Este examen ya estaba guardado como realizado previamente.'
              });
              return;
            }

            console.log('Error al guardar', err);
          }
        );

      },
      (error) => {
        this.evaluando = false;
        console.log(error);
      }
    );
  }

  obtenerHoraFormateada() {
    let mm = Math.floor(this.timer / 60);
    let ss = this.timer - mm * 60;
    return `${mm} : min : ${ss} seg`;
  }

  imprimirPagina() {
    window.print();
  }
}