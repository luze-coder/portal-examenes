package com.sistema.examenes.controladores;

import com.sistema.examenes.modelo.Categoria;
import com.sistema.examenes.modelo.Usuario;
import com.sistema.examenes.servicios.CategoriaService;
import com.sistema.examenes.servicios.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/categoria")
@CrossOrigin("*")
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/")
    public ResponseEntity<Categoria> guardarCategoria(@RequestBody Categoria categoria, Principal principal){
        Usuario usuario = usuarioService.obtenerUsuario(principal.getName());
        categoria.setUsuario(usuario);

        Categoria categoriaGuardada = categoriaService.agregarCategoria(categoria);
        return ResponseEntity.ok(categoriaGuardada);
    }

    @GetMapping("/{categoriaId}")
    public Categoria listarCategoriaPorId(@PathVariable("categoriaId") Long categoriaId){
        return categoriaService.obtenerCategoria(categoriaId);
    }

    @GetMapping("/")
    public ResponseEntity<?> listarCategorias(Principal principal){
        Usuario usuario = usuarioService.obtenerUsuario(principal.getName());
        return ResponseEntity.ok(categoriaService.obtenerCategoriasDeUsuario(usuario));
    }

    @GetMapping("/todas")
    public ResponseEntity<?> listarTodasLasCategorias() {
        return ResponseEntity.ok(categoriaService.listarCategorias());
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> listarCategoriasPorUsuario(@PathVariable Long usuarioId) {
        Usuario usuario = new Usuario();
        usuario.setId(usuarioId);   
        return ResponseEntity.ok(categoriaService.obtenerCategoriasDeUsuario(usuario));
    }

    @PutMapping("/")
    public Categoria actualizarCategoria(@RequestBody Categoria categoria){
        return categoriaService.actualizarCategoria(categoria);
    }

    @DeleteMapping("/{categoriaId}")
    public void eliminarCategoria(@PathVariable("categoriaId") Long categoriaId){
        categoriaService.eliminarCategoria(categoriaId);
    }
}

