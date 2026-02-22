import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoriaService } from './../../../services/categoria.service';
import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login.service';   // <-- AGREGADO

@Component({
  selector: 'app-add-categoria',
  templateUrl: './add-categoria.component.html',
  styleUrls: ['./add-categoria.component.css']
})
export class AddCategoriaComponent implements OnInit {

  categoria = {
    titulo: '',
    descripcion: '',
    usuario: {              // <-- AGREGADO
      id: ''               // <-- AGREGADO
    }
  }

  constructor(
    private categoriaService: CategoriaService,
    private snack: MatSnackBar,
    private router: Router,
    private loginService: LoginService   // <-- AGREGADO
  ) { }

  ngOnInit(): void {

    // === OBTENER EL USUARIO LOGUEADO ===
    const user = this.loginService.getUser();
    this.categoria.usuario.id = user.id;   // <-- ASIGNADO A LA CATEGORÍA
  }

  formSubmit() {

    if (this.categoria.titulo.trim() == '' || this.categoria.titulo == null) {
      this.snack.open("El título es requerido !!", '', {
        duration: 3000
      });
      return;
    }

    this.categoriaService.agregarCategoria(this.categoria).subscribe(
      (dato: any) => {

        // reiniciar el form pero manteniendo usuario.id
        const idUsuario = this.loginService.getUser().id;

        this.categoria = {
          titulo: '',
          descripcion: '',
          usuario: {
            id: idUsuario
          }
        }

        Swal.fire(
          'Categoría agregada',
          'La categoría ha sido agregada con éxito',
          'success'
        );

        this.router.navigate(['/admin/categorias']);
      },
      (error) => {
        console.log(error);
        Swal.fire('Error !!', 'Error al guardar la categoría', 'error');
      }
    )
  }
}

