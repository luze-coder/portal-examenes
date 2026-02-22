import { Component, OnInit } from '@angular/core';
import { ExamenAlumnoService } from 'src/app/services/examen-alumno.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-ver-notas',
  templateUrl: './ver-notas.component.html',
  styleUrls: ['./ver-notas.component.css']
})
export class VerNotasComponent implements OnInit {

  notas: any[] = [];
  cargando = false;

  constructor(
    private examenAlumnoService: ExamenAlumnoService,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.cargarNotas();
  }

  cargarNotas() {
    const user = this.loginService.getUser();
    const alumnoId = Number(user.id);

    this.cargando = true;

    this.examenAlumnoService.listarNotasPorAlumno(alumnoId).subscribe(
      (data: any) => {
        this.notas = data || [];
        this.cargando = false;
      },
      (error) => {
        console.log(error);
        this.cargando = false;
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