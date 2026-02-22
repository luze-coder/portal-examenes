package com.sistema.examenes.repositorios;

import com.sistema.examenes.modelo.Categoria;
import com.sistema.examenes.modelo.Examen;
import com.sistema.examenes.modelo.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExamenRepository extends JpaRepository<Examen,Long> {

    List<Examen> findByCategoria(Categoria categoria);

    List<Examen> findByUsuario(Usuario usuario);

    List<Examen> findByTipoHabilitacion(Integer tipoHabilitacion);

    List<Examen> findByCategoriaAndTipoHabilitacionIn(Categoria categoria, List<Integer> tipos);
}

