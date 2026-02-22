package com.sistema.examenes.repositorios;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sistema.examenes.modelo.Examen;
import com.sistema.examenes.modelo.SolicitudExamen;
import com.sistema.examenes.modelo.Usuario;

public interface SolicitudExamenRepository extends JpaRepository<SolicitudExamen, Long> {
    List<SolicitudExamen> findByExamenAndEstado(Examen examen, String estado);
    List<SolicitudExamen> findByExamen(Examen examen);
    List<SolicitudExamen> findByAlumnoAndExamen(Usuario alumno, Examen examen);
    List<SolicitudExamen> findByEstado(String estado);
    List<SolicitudExamen> findByExamen_Usuario(Usuario usuario);
    List<SolicitudExamen> findByExamen_UsuarioAndEstado(Usuario usuario, String estado);

}