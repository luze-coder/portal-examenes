package com.sistema.examenes.servicios.impl;

import com.sistema.examenes.excepciones.UsuarioFoundException;
import com.sistema.examenes.modelo.Usuario;
import com.sistema.examenes.modelo.UsuarioRol;
import com.sistema.examenes.repositorios.RolRepository;
import com.sistema.examenes.repositorios.UsuarioRepository;
import com.sistema.examenes.servicios.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Override
    public Usuario guardarUsuario(Usuario usuario, Set<UsuarioRol> usuarioRoles) throws Exception {
        String username = usuario.getUsername() != null ? usuario.getUsername().trim() : null;
        String email = usuario.getEmail() != null ? usuario.getEmail().trim() : null;

        if (username == null || username.isEmpty()) {
            throw new UsuarioFoundException("El nombre de usuario es obligatorio.");
        }

        Usuario usuarioPorUsername = usuarioRepository.findByUsernameIgnoreCase(username);
        if (usuarioPorUsername != null) {
            throw new UsuarioFoundException("Ya existe un usuario con ese nombre de usuario.");
        }

        if (email != null && !email.isEmpty()) {
            Usuario usuarioPorEmail = usuarioRepository.findByEmailIgnoreCase(email);
            if (usuarioPorEmail != null) {
                throw new UsuarioFoundException("Ya existe un usuario con ese email.");
            }
            usuario.setEmail(email);
        }

        usuario.setUsername(username);

        for (UsuarioRol usuarioRol : usuarioRoles) {
            rolRepository.save(usuarioRol.getRol());
        }
        usuario.getUsuarioRoles().addAll(usuarioRoles);

        return usuarioRepository.save(usuario);
    }

    @Override
    public Usuario obtenerUsuario(String username) {
        return usuarioRepository.findByUsername(username);
    }

    @Override
    public void eliminarUsuario(Long usuarioId) {
        usuarioRepository.deleteById(usuarioId);
    }

    @Override
    public Usuario obtenerUsuarioPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElse(null);
    }


}