package com.sistema.examenes.controladores;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sistema.examenes.modelo.Examen;
import com.sistema.examenes.modelo.ExamenAlumno;
import com.sistema.examenes.modelo.Usuario;
import com.sistema.examenes.servicios.ExamenAlumnoService;
import com.sistema.examenes.servicios.ExamenService;
import com.sistema.examenes.servicios.UsuarioService;

@RestController
@RequestMapping("/api/examen-alumno")
@CrossOrigin("*")
public class ExamenAlumnoController {

    @Autowired
    private ExamenAlumnoService examenAlumnoService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private ExamenService examenService;

    @PostMapping("/guardar")
    public ResponseEntity<?> guardarResultado(@RequestBody Map<String, Object> data) {

        Long alumnoId = Long.valueOf(data.get("alumnoId").toString());
        Long examenId = Long.valueOf(data.get("examenId").toString());
        Double nota = Double.valueOf(data.get("nota").toString());

        Usuario alumno = usuarioService.obtenerUsuarioPorId(alumnoId);
        Examen examen = examenService.obtenerExamen(examenId);

        Optional<ExamenAlumno> existente = examenAlumnoService.obtenerPorAlumnoYExamen(alumno, examen);

        if (existente.isPresent() && existente.get().isRealizado()) {
            Map<String, Object> conflicto = new HashMap<>();
            conflicto.put("mensaje", "El examen ya fue realizado por este alumno.");
            conflicto.put("notaObtenida", existente.get().getNotaObtenida());
            conflicto.put("fechaRealizacion", existente.get().getFechaRealizacion());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(conflicto);
        }

        ExamenAlumno ea = existente.orElseGet(ExamenAlumno::new);
        ea.setUsuario(alumno);
        ea.setExamen(examen);
        ea.setNotaObtenida(nota);
        ea.setHabilitado(true);
        ea.setRealizado(true);
        ea.setFechaRealizacion(LocalDateTime.now().toString());

        ExamenAlumno guardado = examenAlumnoService.guardar(ea);

        return ResponseEntity.ok(guardado);
    }

    @GetMapping("/alumno/{id}")
    public ResponseEntity<List<ExamenAlumno>> listarPorAlumno(@PathVariable Long id) {
        Usuario u = new Usuario();
        u.setId(id);
        return ResponseEntity.ok(examenAlumnoService.listarPorAlumno(u));
    }

    @GetMapping("/alumno/{id}/notas")
    public ResponseEntity<List<ExamenAlumno>> listarNotasPorAlumno(@PathVariable Long id) {
        Usuario u = new Usuario();
        u.setId(id);
        return ResponseEntity.ok(examenAlumnoService.listarNotasPorAlumno(u));
    }

    @GetMapping("/estado/{alumnoId}/{examenId}")
    public ResponseEntity<?> estadoAlumnoExamen(@PathVariable Long alumnoId, @PathVariable Long examenId) {
        Usuario alumno = usuarioService.obtenerUsuarioPorId(alumnoId);
        Examen examen = examenService.obtenerExamen(examenId);

        Optional<ExamenAlumno> existente = examenAlumnoService.obtenerPorAlumnoYExamen(alumno, examen);

        Map<String, Object> estado = new HashMap<>();

        if (existente.isEmpty()) {
            estado.put("existe", false);
            estado.put("realizado", false);
            estado.put("puedeRendir", true);
            return ResponseEntity.ok(estado);
        }

        ExamenAlumno ea = existente.get();
        estado.put("existe", true);
        estado.put("realizado", ea.isRealizado());
        estado.put("puedeRendir", !ea.isRealizado());
        estado.put("notaObtenida", ea.getNotaObtenida());
        estado.put("fechaRealizacion", ea.getFechaRealizacion());

        return ResponseEntity.ok(estado);
    }

    @GetMapping("/examen/{id}")
    public ResponseEntity<List<ExamenAlumno>> listarPorExamen(@PathVariable Long id) {
        Examen e = new Examen();
        e.setExamenId(id);
        return ResponseEntity.ok(examenAlumnoService.listarPorExamen(e));
    }
}