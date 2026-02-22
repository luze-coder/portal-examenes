import Swal from 'sweetalert2';
import { ExamenService } from './../../../services/examen.service';
import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-view-examenes',
  templateUrl: './view-examenes.component.html',
  styleUrls: ['./view-examenes.component.css']
})
export class ViewExamenesComponent implements OnInit {

  examenes: any = [];

  constructor(
    private examenService: ExamenService,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {

    const usuario = this.loginService.getUser();

    this.examenService.listarExamenesPorUsuario(usuario.id).subscribe(
      (dato: any) => {
        // Dar valor por defecto si tipoHabilitacion no existe
        this.examenes = dato.map((examen: any) => {
          return {
            ...examen,
            tipoHabilitacion: examen.tipoHabilitacion ?? 0 // 0 = No publicado
          };
        });
        console.log(this.examenes);
      },
      (error) => {
        console.log(error);
        Swal.fire('Error', 'Error al cargar los exámenes', 'error');
      }
    );
  }

  eliminarExamen(examenId: any) {
    Swal.fire({
      title: 'Eliminar examen',
      text: '¿Estás seguro de eliminar el examen?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.examenService.eliminarExamen(examenId).subscribe(
          (data) => {
            this.examenes = this.examenes.filter((examen: any) => examen.examenId != examenId);
            Swal.fire('Examen eliminado', 'El examen ha sido eliminado de la base de datos', 'success');
          },
          (error) => {
            Swal.fire('Error', 'Error al eliminar el examen', 'error');
          }
        );
      }
    });
  }
}

