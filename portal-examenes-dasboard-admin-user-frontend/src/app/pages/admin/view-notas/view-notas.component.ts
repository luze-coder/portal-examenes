import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { ExamenService } from './../../../services/examen.service';
import { ExamenAlumnoService } from './../../../services/examen-alumno.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-view-notas',
  templateUrl: './view-notas.component.html',
  styleUrls: ['./view-notas.component.css'],

})
export class ViewNotasComponent implements OnInit {

  notas: any[] = [];
  examenes: any[] = [];
  cargando = false;

  constructor(
    private examenAlumnoService: ExamenAlumnoService,
    private examenService: ExamenService,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.cargarNotasProfesor();
  }

  cargarNotasProfesor() {

    const usuario = this.loginService.getUser();
    const profesorId = Number(usuario.id);

    this.cargando = true;

    // 1️⃣ Traer exámenes del profesor
    this.examenService.listarExamenesPorUsuario(profesorId).subscribe(
      (examenes: any) => {

        this.examenes = examenes || [];

        if (this.examenes.length === 0) {
          this.cargando = false;
          return;
        }

        // 2️⃣ Por cada examen traer sus notas
        this.examenes.forEach((ex: any) => {

          this.examenAlumnoService.listarNotasPorExamen(ex.examenId).subscribe(
            (data: any) => {
              if (data && data.length > 0) {
                this.notas.push(...data);
              }
              this.cargando = false;
            },
            (error) => {
              console.log(error);
              this.cargando = false;
            }
          );

        });

      },
      (error) => {
        console.log(error);
        this.cargando = false;
        Swal.fire('Error', 'No se pudieron cargar los exámenes', 'error');
      }
    );
  }

  estaAprobado(registro: any): boolean {
    const nota = Number(registro?.notaObtenida ?? 0);
    const minimo = Number(registro?.examen?.puntosAprobacion ?? 0);
    return nota >= minimo;
  }

  getEstadoResultado(registro: any): string {
    return this.estaAprobado(registro) ? 'Aprobado' : 'Desaprobado';
  }

}