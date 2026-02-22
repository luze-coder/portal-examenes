package com.sistema.examenes.modelo;

import javax.persistence.*;

@Entity
@Table(name = "solicitud_examen")
public class SolicitudExamen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    private Usuario alumno;

    @ManyToOne(fetch = FetchType.EAGER)
    private Examen examen;

    // estados: PENDIENTE / ACEPTADA / RECHAZADA
    private String estado = "PENDIENTE";

    public SolicitudExamen() {}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Usuario getAlumno() {
		return alumno;
	}

	public void setAlumno(Usuario alumno) {
		this.alumno = alumno;
	}

	public Examen getExamen() {
		return examen;
	}

	public void setExamen(Examen examen) {
		this.examen = examen;
	}

	public String getEstado() {
		return estado;
	}

	public void setEstado(String estado) {
		this.estado = estado;
	}

    
   
}
