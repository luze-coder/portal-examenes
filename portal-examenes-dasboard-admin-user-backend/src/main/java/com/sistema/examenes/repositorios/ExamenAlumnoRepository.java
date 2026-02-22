package com.sistema.examenes.repositorios;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sistema.examenes.modelo.Examen;
import com.sistema.examenes.modelo.ExamenAlumno;
import com.sistema.examenes.modelo.Usuario;

public interface ExamenAlumnoRepository extends JpaRepository<ExamenAlumno, Long> {
    List<ExamenAlumno> findByUsuario(Usuario usuario);
    List<ExamenAlumno> findByExamen(Examen examen);
    Optional<ExamenAlumno> findFirstByUsuarioAndExamenOrderByIdDesc(Usuario usuario, Examen examen);
    boolean existsByUsuarioAndExamenAndRealizadoTrue(Usuario usuario, Examen examen);
    List<ExamenAlumno> findByUsuarioAndRealizadoTrueOrderByFechaRealizacionDesc(Usuario usuario);
}