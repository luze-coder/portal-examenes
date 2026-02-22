package com.sistema.examenes.repositorios;

import com.sistema.examenes.modelo.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario,Long> {

    Usuario findByUsername(String username);

    Usuario findByUsernameIgnoreCase(String username);

    Usuario findByEmailIgnoreCase(String email);

}