package com.sistema.examenes.controladores;

import com.sistema.examenes.modelo.Categoria;
import com.sistema.examenes.modelo.Examen;
import com.sistema.examenes.modelo.Usuario;
import com.sistema.examenes.servicios.ExamenService;
import com.sistema.examenes.servicios.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/examen")
@CrossOrigin("*")
public class ExamenController {

    @Autowired
    private ExamenService examenService;

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/")
    public ResponseEntity<Examen> guardarExamen(@RequestBody Examen examen, Principal principal){
        Usuario usuario = usuarioService.obtenerUsuario(principal.getName());
        examen.setUsuario(usuario);

        if(examen.getTipoHabilitacion() == null){
            examen.setTipoHabilitacion(0);
        }

        if (examen.getTiempoMaximoMinutos() == null || examen.getTiempoMaximoMinutos() < 0) {
            examen.setTiempoMaximoMinutos(0);
        }

        return ResponseEntity.ok(examenService.agregarExamen(examen));
    }

    @PutMapping("/")
    public ResponseEntity<Examen> actualizarExamen(@RequestBody Examen examen){
        if(examen.getTipoHabilitacion() == null){
            examen.setTipoHabilitacion(0);
        }

        if (examen.getTiempoMaximoMinutos() == null || examen.getTiempoMaximoMinutos() < 0) {
            examen.setTiempoMaximoMinutos(0);
        }

        return ResponseEntity.ok(examenService.actualizarExamen(examen));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> listarExamenes(Principal principal){
        Usuario usuario = usuarioService.obtenerUsuario(principal.getName());
        return ResponseEntity.ok(examenService.obtenerExamenesDeUsuario(usuario));
    }

    @GetMapping("/{examenId}")
    public Examen listarExamen(@PathVariable Long examenId){
        return examenService.obtenerExamen(examenId);
    }

    @DeleteMapping("/{examenId}")
    public void eliminarExamen(@PathVariable Long examenId){
        examenService.eliminarExamen(examenId);
    }

    @GetMapping("/categoria/{categoriaId}")
    public List<Examen> listarExamenesDeUnaCategoria(
            @PathVariable Long categoriaId,
            Principal principal)
    {
        Usuario usuario = usuarioService.obtenerUsuario(principal.getName());
        return examenService.obtenerExamenesDeUsuario(usuario)
                .stream()
                .filter(e -> e.getCategoria().getCategoriaId().equals(categoriaId))
                .toList();
    }

    @GetMapping("/publicados")
    public List<Examen> listarPublicados(){
        return examenService.obtenerExamenesPublicados();
    }

    @GetMapping("/publicados-restringidos/categoria/{categoriaId}")
    public List<Examen> listarPublicadosYRestringidosDeUnaCategoria(@PathVariable Long categoriaId) {
        Categoria c = new Categoria();
        c.setCategoriaId(categoriaId);
        return examenService.obtenerExamenesPublicadosYRestrDeUnaCategoria(c);
    }

    @GetMapping("/restringidos")
    public List<Examen> listarRestringidos(){
        return examenService.obtenerExamenesRestringidos();
    }
}