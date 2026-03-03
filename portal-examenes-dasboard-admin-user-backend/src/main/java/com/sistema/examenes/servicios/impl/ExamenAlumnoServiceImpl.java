package com.sistema.examenes.servicios.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sistema.examenes.modelo.Examen;
import com.sistema.examenes.modelo.ExamenAlumno;
import com.sistema.examenes.modelo.Usuario;
import com.sistema.examenes.repositorios.ExamenAlumnoRepository;
import com.sistema.examenes.servicios.ExamenAlumnoService;

@Service
public class ExamenAlumnoServiceImpl implements ExamenAlumnoService {

    @Autowired
    private ExamenAlumnoRepository repo;

    @Override
    public ExamenAlumno guardar(ExamenAlumno ea) {
        return repo.save(ea);
    }

    @Override
    public List<ExamenAlumno> listarPorAlumno(Usuario usuario) {
        return repo.findByUsuario(usuario);
    }

    @Override
    public List<ExamenAlumno> listarPorExamen(Examen examen) {
        return repo.findByExamen(examen);
    }

    @Override
    public Optional<ExamenAlumno> obtenerPorAlumnoYExamen(Usuario usuario, Examen examen) {
        return repo.findFirstByUsuarioAndExamenOrderByIdDesc(usuario, examen);
    }

    @Override
    public boolean existeExamenRealizado(Usuario usuario, Examen examen) {
        return repo.existsByUsuarioAndExamenAndRealizadoTrue(usuario, examen);
    }

    @Override
    public List<ExamenAlumno> listarNotasPorAlumno(Usuario usuario) {
        return repo.findByUsuarioAndRealizadoTrueOrderByFechaRealizacionDesc(usuario);
    }
}