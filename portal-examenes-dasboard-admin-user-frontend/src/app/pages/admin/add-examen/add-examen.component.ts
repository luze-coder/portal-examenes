import { Router } from '@angular/router';
import { ExamenService } from './../../../services/examen.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { CategoriaService } from './../../../services/categoria.service';
import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-add-examen',
  templateUrl: './add-examen.component.html',
  styleUrls: ['./add-examen.component.css']
})
export class AddExamenComponent implements OnInit {

  categorias: any = [];

  estadosExamen = [
    { valor: 0, nombre: 'No publicado' },
    { valor: 1, nombre: 'Público' },
    { valor: 2, nombre: 'Restringido' }
  ];


  examenData = {
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
    }
  };

  constructor(
    private categoriaService: CategoriaService,
    private snack: MatSnackBar,
    private examenService: ExamenService,
    private router: Router,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    const user = this.loginService.getUser();
    this.examenData.usuario.id = user.id;

    this.categoriaService.listarCategoriasPorUsuario(user.id).subscribe(
      (dato: any) => {
        this.categorias = dato;
      }, () => {
        Swal.fire('Error', 'Error al cargar los datos', 'error');
      }
    );
  }

  guardarCuestionario() {
    if (this.examenData.titulo.trim() === '') {
      this.snack.open('El título es requerido', '', { duration: 3000 });
      return;
    }

    if (this.examenData.tiempoMaximoMinutos == null || this.examenData.tiempoMaximoMinutos < 0) {
      this.snack.open('El tiempo máximo debe ser 0 o mayor', '', { duration: 3000 });
      return;
    }

    this.examenService.agregarExamen(this.examenData).subscribe(
      () => {
        Swal.fire('Examen guardado', 'El examen ha sido guardado con éxito', 'success');

        this.examenData = {
          titulo: '',
          descripcion: '',
          puntosMaximos: '',
          numeroDePreguntas: '',
          puntosAprobacion: '',
          tiempoMaximoMinutos: 0,
          tipoHabilitacion: 0,
          categoria: { categoriaId: '' },
          usuario: { id: this.loginService.getUser().id }
        };

        this.router.navigate(['/admin/examenes']);
      },
      () => {
        Swal.fire('Error', 'Error al guardar el examen', 'error');
      }
    );
  }
}