package com.sistema.examenes.modelo;

import javax.persistence.*;


@Entity
@Table(name = "examen_alumno")
public class ExamenAlumno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // alumno
    @ManyToOne(fetch = FetchType.EAGER)
    private Usuario usuario;

    // examen
    @ManyToOne(fetch = FetchType.EAGER)
    private Examen examen;

    private boolean habilitado = false;   // si el alumno está autorizado
    private boolean realizado = false;    // si ya lo hizo
    private Double notaObtenida;
    private String fechaRealizacion;

    public ExamenAlumno() {}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Usuario getUsuario() {
		return usuario;
	}

	public void setUsuario(Usuario usuario) {
		this.usuario = usuario;
	}

	public Examen getExamen() {
		return examen;
	}

	public void setExamen(Examen examen) {
		this.examen = examen;
	}

	public boolean isHabilitado() {
		return habilitado;
	}

	public void setHabilitado(boolean habilitado) {
		this.habilitado = habilitado;
	}

	public boolean isRealizado() {
		return realizado;
	}

	public void setRealizado(boolean realizado) {
		this.realizado = realizado;
	}

	public Double getNotaObtenida() {
		return notaObtenida;
	}

	public void setNotaObtenida(Double notaObtenida) {
		this.notaObtenida = notaObtenida;
	}

	public String getFechaRealizacion() {
		return fechaRealizacion;
	}

	public void setFechaRealizacion(String fechaRealizacion) {
		this.fechaRealizacion = fechaRealizacion;
	}
    
    
}

