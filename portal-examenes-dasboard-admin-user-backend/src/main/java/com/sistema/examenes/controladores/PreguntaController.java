package com.sistema.examenes.controladores;

import com.sistema.examenes.modelo.Examen;
import com.sistema.examenes.modelo.Pregunta;
import com.sistema.examenes.servicios.ExamenService;
import com.sistema.examenes.servicios.PreguntaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/pregunta")
@CrossOrigin("*")
public class PreguntaController {

    @Autowired
    private PreguntaService preguntaService;

    @Autowired
    private ExamenService examenService;

    @PostMapping("/")
    public ResponseEntity<?> guardarPregunta(@RequestBody Pregunta pregunta) {
        if (pregunta.getExamen() == null || pregunta.getExamen().getExamenId() == null) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", "Debe indicar el examen de la pregunta."));
        }

        Examen examen = examenService.obtenerExamen(pregunta.getExamen().getExamenId());
        int maximoPreguntas = Integer.parseInt(examen.getNumeroDePreguntas());
        int cantidadActual = preguntaService.obtenerPreguntasDelExamen(examen).size();

        if (cantidadActual >= maximoPreguntas) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                    "mensaje", "El examen ya alcanzó el máximo de preguntas configurado.",
                    "cantidadActual", cantidadActual,
                    "cantidadMaxima", maximoPreguntas
            ));
        }

        pregunta.setExamen(examen);
        return ResponseEntity.ok(preguntaService.agregarPregunta(pregunta));
    }

    @PutMapping("/")
    public ResponseEntity<Pregunta> actualizarPregunta(@RequestBody Pregunta pregunta){
        return ResponseEntity.ok(preguntaService.actualizarPregunta(pregunta));
    }

    @GetMapping("/examen/{examenId}")
    public ResponseEntity<?> listarPreguntasDelExamen(@PathVariable("examenId") Long examenId){
        Examen examen = examenService.obtenerExamen(examenId);
        Set<Pregunta> preguntas = examen.getPreguntas();

        List<Pregunta> examenes = new ArrayList<>(preguntas);
        Collections.shuffle(examenes);

        int cantidadConfigurada = Integer.parseInt(examen.getNumeroDePreguntas());
        int limite = Math.min(examenes.size(), cantidadConfigurada);

        return ResponseEntity.ok(examenes.subList(0, limite));
    }

    @GetMapping("/{preguntaId}")
    public Pregunta listarPreguntaPorId(@PathVariable("preguntaId") Long preguntaId){
        return preguntaService.obtenerPregunta(preguntaId);
    }

    @DeleteMapping("/{preguntaId}")
    public void eliminarPregunta(@PathVariable("preguntaId") Long preguntaId){
        preguntaService.eliminarPregunta(preguntaId);
    }

    @GetMapping("/examen/todos/{examenId}")
    public ResponseEntity<?> listarPreguntaDelExamenComoAdministrador(@PathVariable("examenId") Long examenId){
        Examen examen = new Examen();
        examen.setExamenId(examenId);
        Set<Pregunta> preguntas = preguntaService.obtenerPreguntasDelExamen(examen);
        return ResponseEntity.ok(preguntas);
    }

    @GetMapping("/examen/{examenId}/cupo")
    public ResponseEntity<?> obtenerCupoPreguntas(@PathVariable Long examenId) {
        Examen examen = examenService.obtenerExamen(examenId);
        int cantidadMaxima = Integer.parseInt(examen.getNumeroDePreguntas());
        int cantidadActual = preguntaService.obtenerPreguntasDelExamen(examen).size();

        return ResponseEntity.ok(Map.of(
                "examenId", examenId,
                "cantidadActual", cantidadActual,
                "cantidadMaxima", cantidadMaxima,
                "puedeAgregar", cantidadActual < cantidadMaxima
        ));
    }

    @PostMapping("/evaluar-examen")
    public ResponseEntity<?> evaluarExamen(@RequestBody List<Pregunta> preguntas){
        double puntosMaximos = 0;
        Integer respuestasCorrectas = 0;
        Integer intentos = 0;

        for(Pregunta p : preguntas){
            Pregunta pregunta = this.preguntaService.listarPregunta(p.getPreguntaId());
            if(pregunta.getRespuesta().equals(p.getRespuestaDada())){
                respuestasCorrectas ++;
                double puntos = Double.parseDouble(preguntas.get(0).getExamen().getPuntosMaximos())/preguntas.size();
                puntosMaximos += puntos;
            }
            if(p.getRespuestaDada() != null){
                intentos ++;
            }
        }

        Map<String,Object> respuestas = new HashMap<>();
        respuestas.put("puntosMaximos",puntosMaximos);
        respuestas.put("respuestasCorrectas",respuestasCorrectas);
        respuestas.put("intentos",intentos);
        return ResponseEntity.ok(respuestas);
    }
}