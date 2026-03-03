package com.sistema.examenes.servicios;

import java.util.List;
import java.util.Optional;

import com.sistema.examenes.modelo.Examen;
import com.sistema.examenes.modelo.ExamenAlumno;
import com.sistema.examenes.modelo.Usuario;

public interface ExamenAlumnoService {
    ExamenAlumno guardar(ExamenAlumno ea);
    List<ExamenAlumno> listarPorAlumno(Usuario usuario);
    List<ExamenAlumno> listarPorExamen(Examen examen);
    Optional<ExamenAlumno> obtenerPorAlumnoYExamen(Usuario usuario, Examen examen);
    boolean existeExamenRealizado(Usuario usuario, Examen examen);
    List<ExamenAlumno> listarNotasPorAlumno(Usuario usuario);
}