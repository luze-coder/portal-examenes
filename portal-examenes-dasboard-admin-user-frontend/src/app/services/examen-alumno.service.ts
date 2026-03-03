import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class ExamenAlumnoService {

  constructor(private http: HttpClient) { }

  guardarResultado(data: any) {
    return this.http.post(`${baseUrl}/api/examen-alumno/guardar`, data);
  }

  listarPorAlumno(alumnoId: number) {
    return this.http.get(`${baseUrl}/api/examen-alumno/alumno/${alumnoId}`);
  }

  listarNotasPorAlumno(alumnoId: number) {
    return this.http.get(`${baseUrl}/api/examen-alumno/alumno/${alumnoId}/notas`);
  }

  obtenerEstadoAlumnoExamen(alumnoId: number, examenId: number) {
    return this.http.get(`${baseUrl}/api/examen-alumno/estado/${alumnoId}/${examenId}`);
  }

  listarNotasPorExamen(examenId: number) {
    return this.http.get(`${baseUrl}/api/examen-alumno/examen/${examenId}`);
  }
}