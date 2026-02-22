import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SolicitudExamenService {

  private baseUrl = 'http://localhost:8080/solicitud-examen';

  constructor(private http: HttpClient) { }

  enviarSolicitud(examenId: number) {
    return this.http.post(`${this.baseUrl}/enviar/${examenId}`, {});
  }

  getPendientes() {
    return this.http.get(`${this.baseUrl}/pendientes/mias`);
  }


  resolverSolicitud(id: number, estado: string) {
    return this.http.put(`${this.baseUrl}/resolver/${id}/${estado}`, {});
  }

  estaHabilitado(examenId: number, alumnoId: number) {
    return this.http.get(`${this.baseUrl}/habilitado/${examenId}/${alumnoId}`);
  }

}
