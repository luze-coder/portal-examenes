package com.sistema.examenes.servicios;

import java.util.List;

import com.sistema.examenes.modelo.Examen;
import com.sistema.examenes.modelo.SolicitudExamen;
import com.sistema.examenes.modelo.Usuario;

public interface SolicitudExamenService {
    SolicitudExamen enviarSolicitud(SolicitudExamen solicitud);
    SolicitudExamen actualizar(SolicitudExamen solicitud);
    List<SolicitudExamen> buscarPorAlumnoYExamen(Usuario alumno, Examen examen);
    SolicitudExamen actualizarEstado(Long solicitudId, String nuevoEstado);
    List<SolicitudExamen> solicitudesPendientes();
    List<SolicitudExamen> solicitudesDeProfesor(Usuario profesor);
    List<SolicitudExamen> solicitudesPendientesDeProfesor(Usuario profesor);

}

