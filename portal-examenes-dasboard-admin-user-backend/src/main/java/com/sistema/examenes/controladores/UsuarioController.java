package com.sistema.examenes.controladores;

import com.sistema.examenes.excepciones.UsuarioFoundException;
import com.sistema.examenes.modelo.Rol;
import com.sistema.examenes.modelo.Usuario;
import com.sistema.examenes.modelo.UsuarioRol;
import com.sistema.examenes.servicios.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin("*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @PostMapping("/")
    public ResponseEntity<?> guardarUsuario(@RequestBody Usuario usuario) throws Exception {
        try {
            usuario.setPerfil("default.png");
            usuario.setPassword(this.bCryptPasswordEncoder.encode(usuario.getPassword()));

            Set<UsuarioRol> usuarioRoles = new HashSet<>();

            Rol rol = new Rol();
            rol.setRolId(2L);
            rol.setRolNombre("NORMAL");

            UsuarioRol usuarioRol = new UsuarioRol();
            usuarioRol.setUsuario(usuario);
            usuarioRol.setRol(rol);

            usuarioRoles.add(usuarioRol);
            Usuario guardado = usuarioService.guardarUsuario(usuario, usuarioRoles);
            return ResponseEntity.ok(guardado);
        } catch (UsuarioFoundException ex) {
            Map<String, String> respuesta = new HashMap<>();
            respuesta.put("mensaje", ex.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(respuesta);
        }
    }


    @GetMapping("/{username}")
    public Usuario obtenerUsuario(@PathVariable("username") String username){
        return usuarioService.obtenerUsuario(username);
    }

    @DeleteMapping("/{usuarioId}")
    public void eliminarUsuario(@PathVariable("usuarioId") Long usuarioId){
        usuarioService.eliminarUsuario(usuarioId);
    }

    @GetMapping("/id/{usuarioId}")
    public Usuario obtenerUsuarioPorId(@PathVariable Long usuarioId) {
        return usuarioService.obtenerUsuarioPorId(usuarioId);
    }


}