import Swal from 'sweetalert2';
import { CategoriaService } from './../../../services/categoria.service';
import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-view-categorias',
  templateUrl: './view-categorias.component.html',
  styleUrls: ['./view-categorias.component.css']
})
export class ViewCategoriasComponent implements OnInit {

  categorias: any = [];

  constructor(
    private categoriaService: CategoriaService,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {

    // Obtener usuario logueado
    const usuario = this.loginService.getUser();

    // Llamar a backend: /categoria/usuario/{id}
    this.categoriaService.listarCategoriasPorUsuario(usuario.id).subscribe(
      (dato: any) => {
        this.categorias = dato;
        console.log(this.categorias);
      },
      (error) => {
        console.log(error);
        Swal.fire('Error !!', 'Error al cargar las categorías', 'error');
      }
    );
  }

}
