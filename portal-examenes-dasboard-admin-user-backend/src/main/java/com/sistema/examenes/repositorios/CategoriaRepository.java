package com.sistema.examenes.repositorios;

import com.sistema.examenes.modelo.Categoria;
import com.sistema.examenes.modelo.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    List<Categoria> findByUsuario(Usuario usuario);
}


