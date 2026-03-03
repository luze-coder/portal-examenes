import Swal from 'sweetalert2';
import { CategoriaService } from './../../../services/categoria.service';
import { ExamenService } from './../../../services/examen.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-actualizar-examen',
  templateUrl: './actualizar-examen.component.html',
  styleUrls: ['./actualizar-examen.component.css']
})
export class ActualizarExamenComponent implements OnInit {

  examenId = 0;

  estadosExamen = [
    { valor: 0, nombre: 'No publicado' },
    { valor: 1, nombre: 'Público' },
    { valor: 2, nombre: 'Restringido' }
  ];

  examen: any = {
    titulo: '',
    descripcion: '',
    puntosMaximos: '',
    numeroDePreguntas: '',
    puntosAprobacion: '',
    tiempoMaximoMinutos: 0,
    tipoHabilitacion: 0,
    categoria: {
      categoriaId: ''
    },
    usuario: {
      id: ''
    },
  };

  categorias: any = [];

  numeroDePreguntasOriginal: number = 0;


  constructor(
    private route: ActivatedRoute,
    private examenService: ExamenService,
    private categoriaService: CategoriaService,
    private router: Router,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {

    this.examenId = this.route.snapshot.params['examenId'];


    this.examenService.obtenerExamen(this.examenId).subscribe(
      (data: any) => {
        this.examen = {
          ...data,
          tiempoMaximoMinutos: data?.tiempoMaximoMinutos ?? 0
        };

        this.numeroDePreguntasOriginal = Number(data.numeroDePreguntas);

        const user = this.loginService.getUser();

        if (!this.examen.usuario || !this.examen.usuario.id) {
          this.examen.usuario = { id: user.id };
        }
      },
      (error) => {
        console.log(error);
      }
    );

    const user = this.loginService.getUser();

    this.categoriaService.listarCategoriasPorUsuario(user.id).subscribe(
      (data: any) => {
        this.categorias = data;
      },
      () => {
        Swal.fire('Error', 'Error al cargar las categorías', 'error');
      }
    );
  }

  public actualizarDatos() {

    const user = this.loginService.getUser();
    this.examen.usuario = { id: user.id };

    if (this.examen.tiempoMaximoMinutos == null || this.examen.tiempoMaximoMinutos < 0) {
      Swal.fire('Atención', 'El tiempo máximo debe ser 0 o mayor', 'warning');
      return;
    }

    const numeroActual = Number(this.examen.numeroDePreguntas);

    // ✅ Validación nueva
    if (numeroActual < this.numeroDePreguntasOriginal) {
      Swal.fire(
        'No permitido',
        `No puedes reducir el número de preguntas. Actualmente el examen tiene ${this.numeroDePreguntasOriginal} preguntas.`,
        'warning'
      );
      return;
    }

    this.examenService.actualizarExamen(this.examen).subscribe(
      () => {
        Swal.fire(
          'Examen actualizado',
          'El examen ha sido actualizado con éxito',
          'success'
        ).then(() => {
          this.router.navigate(['/admin/examenes']);
        });
      },
      (error) => {
        Swal.fire('Error', 'No se ha podido actualizar el examen', 'error');
        console.log(error);
      }
    );
  }
}