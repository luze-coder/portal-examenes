import { Component, OnInit } from '@angular/core';
import { SolicitudExamenService } from 'src/app/services/solicitudexamen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-solicitudes',
  templateUrl: './view-solicitudes.component.html',
  styleUrls: ['./view-solicitudes.component.css']
})
export class ViewSolicitudesComponent implements OnInit {

  solicitudes: any[] = [];

  constructor(
    private solicitudService: SolicitudExamenService,
  ) { }

  ngOnInit(): void {
    this.cargarSolicitudesPendientes();
  }

  cargarSolicitudesPendientes() {
    this.solicitudService.getPendientes().subscribe(
      (data: any) => this.solicitudes = data,
      (err) => console.log(err)
    );
  }

  aceptar(id: number) {
    this.solicitudService.resolverSolicitud(id, "ACEPTADA").subscribe(
      () => {
        Swal.fire("Solicitud aceptada", "", "success");
        this.cargarSolicitudesPendientes();
      },
      () => Swal.fire("Error", "No se pudo aceptar.", "error")
    );
  }

  rechazar(id: number) {
    this.solicitudService.resolverSolicitud(id, "RECHAZADA").subscribe(
      () => {
        Swal.fire("Solicitud rechazada", "", "info");
        this.cargarSolicitudesPendientes();
      },
      () => Swal.fire("Error", "No se pudo rechazar.", "error")
    );
  }

}
