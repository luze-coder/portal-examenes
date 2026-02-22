package com.sistema.examenes.controladores;

import java.security.Principal;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sistema.examenes.modelo.Examen;
import com.sistema.examenes.modelo.SolicitudExamen;
import com.sistema.examenes.modelo.Usuario;
import com.sistema.examenes.servicios.ExamenService;
import com.sistema.examenes.servicios.SolicitudExamenService;
import com.sistema.examenes.servicios.UsuarioService;


@RestController
@RequestMapping("/solicitud-examen")
@CrossOrigin("*")
public class SolicitudExamenController {

    @Autowired
    private SolicitudExamenService solicitudService;

    @Autowired
    private ExamenService examenService;

    @Autowired
    private UsuarioService usuarioService;

    // Alumno envía solicitud
    @PostMapping("/enviar/{examenId}")
    public ResponseEntity<?> enviar(@PathVariable Long examenId, Principal principal) {
        Usuario alumno = usuarioService.obtenerUsuario(principal.getName());
        Examen examen = examenService.obtenerExamen(examenId);

        SolicitudExamen s = new SolicitudExamen();
        s.setAlumno(alumno);
        s.setExamen(examen);
        s.setEstado("PENDIENTE");

        return ResponseEntity.ok(solicitudService.enviarSolicitud(s));
    }

    @GetMapping("/pendientes")
    public ResponseEntity<?> obtenerPendientes() {
        return ResponseEntity.ok(solicitudService.solicitudesPendientes());
    }


    // Profesor acepta o rechaza
    @PutMapping("/resolver/{solicitudId}/{estado}")
    public ResponseEntity<?> resolver(
            @PathVariable Long solicitudId,
            @PathVariable String estado // ACEPTADA | RECHAZADA
    ) {
        SolicitudExamen s = solicitudService.actualizarEstado(solicitudId, estado);
        return ResponseEntity.ok(s);
    }
    
 // Saber si un alumno está habilitado para cierto examen
    @GetMapping("/habilitado/{examenId}/{alumnoId}")
    public ResponseEntity<?> estaHabilitado(@PathVariable Long examenId, @PathVariable Long alumnoId) {
        Usuario alumno = usuarioService.obtenerUsuarioPorId(alumnoId);
        Examen examen = examenService.obtenerExamen(examenId);

        List<SolicitudExamen> solicitudes = solicitudService.buscarPorAlumnoYExamen(alumno, examen);

        if (solicitudes.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                "existe", false,
                "estado", "NULO",
                "habilitado", false
            ));
        }

        SolicitudExamen s = solicitudes.get(0);

        boolean habilitado = s.getEstado().equals("ACEPTADA");

        return ResponseEntity.ok(Map.of(
            "existe", true,
            "estado", s.getEstado(),
            "habilitado", habilitado
        ));
    }

    @GetMapping("/mis-solicitudes")
    public ResponseEntity<?> solicitudesProfesor(Principal principal){
        Usuario profesor = usuarioService.obtenerUsuario(principal.getName());
        return ResponseEntity.ok(solicitudService.solicitudesDeProfesor(profesor));
    }

    @GetMapping("/pendientes/mias")
    public ResponseEntity<?> pendientesProfesor(Principal principal){
        Usuario profesor = usuarioService.obtenerUsuario(principal.getName());
        return ResponseEntity.ok(solicitudService.solicitudesPendientesDeProfesor(profesor));
    }

}

