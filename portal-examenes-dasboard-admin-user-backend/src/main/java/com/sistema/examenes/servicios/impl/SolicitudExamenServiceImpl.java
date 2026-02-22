package com.sistema.examenes.servicios.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sistema.examenes.modelo.Examen;
import com.sistema.examenes.modelo.SolicitudExamen;
import com.sistema.examenes.modelo.Usuario;
import com.sistema.examenes.repositorios.SolicitudExamenRepository;
import com.sistema.examenes.servicios.SolicitudExamenService;


@Service
public class SolicitudExamenServiceImpl implements SolicitudExamenService {

    @Autowired
    private SolicitudExamenRepository repo;

    @Override
    public SolicitudExamen enviarSolicitud(SolicitudExamen solicitud) {
        List<SolicitudExamen> existentes = repo.findByAlumnoAndExamen(
                solicitud.getAlumno(), solicitud.getExamen());

        // Si hay una solicitud ACEPTADA → NO permitir pedir de nuevo
        boolean yaAceptada = existentes.stream()
                .anyMatch(s -> s.getEstado().equals("ACEPTADA"));

        if (yaAceptada) {
            throw new RuntimeException("Ya estás habilitado para este examen.");
        }

        // Si hay una PENDIENTE → NO permitir mandar otra
        boolean pendiente = existentes.stream()
                .anyMatch(s -> s.getEstado().equals("PENDIENTE"));

        if (pendiente) {
            throw new RuntimeException("Tu solicitud está pendiente de revisión.");
        }

        // Si la última fue RECHAZADA → se permite enviar una nueva
        return repo.save(solicitud);
    }



    @Override
    public List<SolicitudExamen> solicitudesPendientes() {
        return repo.findByEstado("PENDIENTE");
    }


    @Override
    public SolicitudExamen actualizar(SolicitudExamen solicitud) {
        return repo.save(solicitud);
    }
    
    @Override
    public SolicitudExamen actualizarEstado(Long solicitudId, String nuevoEstado) {
        SolicitudExamen solicitud = repo.findById(solicitudId)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        solicitud.setEstado(nuevoEstado.toUpperCase()); // ACEPTADA, RECHAZADA
        return repo.save(solicitud);
    }
    
    @Override
    public List<SolicitudExamen> buscarPorAlumnoYExamen(Usuario alumno, Examen examen) {
        return repo.findByAlumnoAndExamen(alumno, examen);
    }
    @Override
    public List<SolicitudExamen> solicitudesDeProfesor(Usuario profesor) {
        return repo.findByExamen_Usuario(profesor);
    }

    @Override
    public List<SolicitudExamen> solicitudesPendientesDeProfesor(Usuario profesor) {
        return repo.findByExamen_UsuarioAndEstado(profesor, "PENDIENTE");
    }

}

