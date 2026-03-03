package com.sistema.examenes.modelo;

import com.fasterxml.jackson.databind.ObjectMapper;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Entity
@Table(name = "preguntas")
public class Pregunta {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long preguntaId;

    @Column(length = 5000)
    private String contenido;

    private String imagen;
    private String opcion1;
    private String opcion2;
    private String opcion3;
    private String opcion4;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String opcionesJson;

    @Transient
    private List<String> opciones = new ArrayList<>();

    @Transient
    private String respuestaDada;

    private String respuesta;

    @ManyToOne(fetch = FetchType.EAGER)
    private Examen examen;

    @PrePersist
    @PreUpdate
    private void sincronizarOpcionesAntesDeGuardar() {
        if (opciones == null || opciones.isEmpty()) {
            opciones = construirOpcionesDesdeCamposLegacy();
        }

        opciones = limpiarOpciones(opciones);

        opcion1 = opciones.size() > 0 ? opciones.get(0) : null;
        opcion2 = opciones.size() > 1 ? opciones.get(1) : null;
        opcion3 = opciones.size() > 2 ? opciones.get(2) : null;
        opcion4 = opciones.size() > 3 ? opciones.get(3) : null;

        try {
            opcionesJson = OBJECT_MAPPER.writeValueAsString(opciones);
        } catch (Exception e) {
            opcionesJson = "[]";
        }
    }

    @PostLoad
    private void cargarOpcionesAlLeer() {
        if (opcionesJson != null && !opcionesJson.trim().isEmpty()) {
            try {
                List<String> opcionesDesdeJson = OBJECT_MAPPER.readValue(
                        opcionesJson,
                        OBJECT_MAPPER.getTypeFactory().constructCollectionType(List.class, String.class)
                );
                opciones = limpiarOpciones(opcionesDesdeJson);
                return;
            } catch (Exception ignored) {
            }
        }

        opciones = construirOpcionesDesdeCamposLegacy();
    }

    private List<String> construirOpcionesDesdeCamposLegacy() {
        return limpiarOpciones(Arrays.asList(opcion1, opcion2, opcion3, opcion4));
    }

    private List<String> limpiarOpciones(List<String> origen) {
        if (origen == null) {
            return new ArrayList<>();
        }

        return origen.stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .distinct()
                .collect(Collectors.toCollection(ArrayList::new));
    }

    public Long getPreguntaId() {
        return preguntaId;
    }

    public void setPreguntaId(Long preguntaId) {
        this.preguntaId = preguntaId;
    }

    public String getContenido() {
        return contenido;
    }

    public void setContenido(String contenido) {
        this.contenido = contenido;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public String getOpcion1() {
        return opcion1;
    }

    public void setOpcion1(String opcion1) {
        this.opcion1 = opcion1;
    }

    public String getOpcion2() {
        return opcion2;
    }

    public void setOpcion2(String opcion2) {
        this.opcion2 = opcion2;
    }

    public String getOpcion3() {
        return opcion3;
    }

    public void setOpcion3(String opcion3) {
        this.opcion3 = opcion3;
    }

    public String getOpcion4() {
        return opcion4;
    }

    public void setOpcion4(String opcion4) {
        this.opcion4 = opcion4;
    }

    public List<String> getOpciones() {
        return opciones == null ? Collections.emptyList() : opciones;
    }

    public void setOpciones(List<String> opciones) {
        this.opciones = limpiarOpciones(opciones);
    }

    public Examen getExamen() {
        return examen;
    }

    public void setExamen(Examen examen) {
        this.examen = examen;
    }

    public String getRespuestaDada() {
        return respuestaDada;
    }

    public void setRespuestaDada(String respuestaDada) {
        this.respuestaDada = respuestaDada;
    }

    public String getRespuesta() {
        return respuesta;
    }

    public void setRespuesta(String respuesta) {
        this.respuesta = respuesta;
    }

    public Pregunta() {
    }
}