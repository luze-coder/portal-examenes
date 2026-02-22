import { ActivatedRoute } from '@angular/router';
import { ExamenService } from './../../../services/examen.service';
import { Component, OnInit } from '@angular/core';
import { SolicitudExamenService } from 'src/app/services/solicitudexamen.service';
import Swal from 'sweetalert2';
import { LoginService } from 'src/app/services/login.service';
import { ExamenAlumnoService } from 'src/app/services/examen-alumno.service';

@Component({
  selector: 'app-load-examen',
  templateUrl: './load-examen.component.html',
  styleUrls: ['./load-examen.component.css']
})
export class LoadExamenComponent implements OnInit {

  catId: any = 0;
  examenes: any[] = [];
  alumnoId = 0;
  realizadosPorExamen: { [key: number]: any } = {};

  habilitados: {
    [key: number]: {
      puedeEnviar: boolean;
      pendiente: boolean;
      habilitado: boolean;
      rechazada: boolean,
    }
  } = {};

  habilitadosCargando: { [key: number]: boolean } = {};

  estadosExamen = [
    { valor: 0, nombre: 'No publicado' },
    { valor: 1, nombre: 'Público' },
    { valor: 2, nombre: 'Restringido' }
  ];

  constructor(
    private route: ActivatedRoute,
    private examenService: ExamenService,
    private solicitudService: SolicitudExamenService,
    private loginService: LoginService,
    private examenAlumnoService: ExamenAlumnoService
  ) { }

  ngOnInit(): void {
    const user = this.loginService.getUser();
    this.alumnoId = Number(user.id);

    this.route.params.subscribe(params => {
      this.catId = params['catId'];
      this.cargarExamenes();
      this.cargarResultados();
    });
  }

  cargarResultados() {
    this.realizadosPorExamen = {};

    this.examenAlumnoService.listarNotasPorAlumno(this.alumnoId).subscribe(
      (data: any) => {
        (data || []).forEach((registro: any) => {
          if (registro?.examen?.examenId) {
            this.realizadosPorExamen[registro.examen.examenId] = registro;
          }
        });
      },
      (error) => console.log(error)
    );
  }

  yaRealizado(examenId: number): boolean {
    return !!this.realizadosPorExamen[examenId];
  }

  obtenerNota(examenId: number): string {
    const registro = this.realizadosPorExamen[examenId];
    return registro?.notaObtenida != null ? String(registro.notaObtenida) : '-';
  }

  estaAprobado(examenId: number, puntosAprobacion: any): boolean {
    const registro = this.realizadosPorExamen[examenId];
    const nota = Number(registro?.notaObtenida ?? 0);
    const minimo = Number(puntosAprobacion ?? 0);
    return nota >= minimo;
  }

  getEstadoResultado(examenId: number, puntosAprobacion: any): string {
    return this.estaAprobado(examenId, puntosAprobacion) ? 'Aprobado' : 'Desaprobado';
  }

  cargarExamenes() {
    this.habilitados = {};

    this.examenService.obtenerPublicadosYRestringidosDeUnaCategoria(this.catId)
      .subscribe(
        (data: any) => {
          this.examenes = data;

          setTimeout(() => {
            this.examenes.forEach(e => {
              if (e.tipoHabilitacion === 2) {
                this.solicitudService.estaHabilitado(e.examenId, this.alumnoId)
                  .subscribe((resp: any) => {
                    const estado = resp.estado;

                    this.habilitados[e.examenId] = {
                      puedeEnviar: estado === 'NULO',
                      pendiente: estado === 'PENDIENTE',
                      habilitado: estado === 'ACEPTADA',
                      rechazada: estado === 'RECHAZADA'
                    };
                  });
              }
            });
          }, 150);
        },
        (error) => console.log(error)
      );

  }

  solicitarAcceso(examenId: number) {

    if (this.yaRealizado(examenId)) {
      Swal.fire({
        icon: 'info',
        title: 'Examen ya realizado',
        text: 'Este examen ya fue completado. Podés ver tu nota en la sección Ver notas.'
      });
      return;
    }

    this.solicitudService.enviarSolicitud(examenId).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'Solicitud enviada',
          text: 'El profesor revisará tu solicitud.',
          timer: 2000
        });

        this.solicitudService.estaHabilitado(examenId, this.alumnoId).subscribe(
          (resp: any) => {
            const estado = resp.estado;

            this.habilitados[examenId] = {
              puedeEnviar: estado === 'NULO',
              pendiente: estado === 'PENDIENTE',
              habilitado: estado === 'ACEPTADA',
              rechazada: estado === 'RECHAZADA'
            };
          }
        );

      },
      () => {
        Swal.fire({
          icon: 'warning',
          title: 'Ya enviaste una solicitud',
          text: 'Debes esperar la respuesta del profesor.'
        });
      }
    );
  }

  getNombreEstado(tipo: number): string {
    const estado = this.estadosExamen.find(est => est.valor === tipo);
    return estado ? estado.nombre : 'Desconocido';
  }
}