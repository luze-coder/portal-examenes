// src/app/pages/user/sidebar/sidebar.component.ts
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoriaService } from './../../../services/categoria.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-user',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  categorias: any[] = [];
  cargando = false;

  constructor(
    private categoriaService: CategoriaService,
    private snack: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.cargando = true;
    this.categoriaService.listarCategorias().subscribe(
      (data: any) => {
        this.categorias = data || [];
        this.cargando = false;
      },
      (error) => {
        this.cargando = false;
        this.snack.open('Error al cargar categorías', '', { duration: 3000 });
        console.error('Error cargarCategorias:', error);
      }
    );
  }

  trackById(index: number, item: any): any {
    return item?.categoriaId;
  }

  // navegación programática opcional (útil si querés hacer otras cosas antes de navegar)
  irACategoria(catId: number) {
    // ruta absoluta para evitar problemas de resolución relativa
    this.router.navigate(['/user-dashboard/categoria', catId]);
  }
}

