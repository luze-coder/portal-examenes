import { PreguntaService } from './../../../services/pregunta.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-pregunta',
  templateUrl: './add-pregunta.component.html',
  styleUrls: ['./add-pregunta.component.css']
})
export class AddPreguntaComponent implements OnInit {

  examenId: any;
  titulo: any;
  cupo: any = null;
  pregunta: any = {
    examen: {},
    contenido: '',
    opciones: ['', ''],
    respuesta: ''
  };

  constructor(
    private route: ActivatedRoute,
    private preguntaService: PreguntaService) { }

  ngOnInit(): void {
    this.examenId = this.route.snapshot.params['examenId'];
    this.titulo = this.route.snapshot.params['titulo'];
    this.pregunta.examen['examenId'] = this.examenId;
    this.cargarCupo();
  }

  cargarCupo() {
    this.preguntaService.obtenerCupoPreguntas(this.examenId).subscribe(
      (data: any) => {
        this.cupo = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  trackByIndex(index: number): number {
    return index;
  }

  agregarOpcion() {
    this.pregunta.opciones.push('');
  }

  eliminarOpcion(index: number) {
    if (this.pregunta.opciones.length <= 2) {
      return;
    }

    const opcionEliminada = this.pregunta.opciones[index];
    this.pregunta.opciones.splice(index, 1);

    if (this.pregunta.respuesta === opcionEliminada) {
      this.pregunta.respuesta = '';
    }
  }

  obtenerOpcionesValidas(): string[] {
    return (this.pregunta.opciones || [])
      .map((op: string) => (op || '').trim())
      .filter((op: string) => op.length > 0)
      .filter((op: string, i: number, arr: string[]) => arr.indexOf(op) === i);
  }

  construirPayload() {
    const opciones = this.obtenerOpcionesValidas();

    return {
      ...this.pregunta,
      opciones,
      opcion1: opciones[0] || null,
      opcion2: opciones[1] || null,
      opcion3: opciones[2] || null,
      opcion4: opciones[3] || null
    };
  }

  formSubmit() {
    if (this.cupo && !this.cupo.puedeAgregar) {
      Swal.fire('Límite alcanzado', 'No se pueden agregar más preguntas a este examen.', 'info');
      return;
    }

    if (!this.pregunta.contenido || this.pregunta.contenido.trim() === '') {
      return;
    }

    const opciones = this.obtenerOpcionesValidas();

    if (opciones.length < 2) {
      Swal.fire('Atención', 'La pregunta debe tener al menos 2 opciones válidas.', 'warning');
      return;
    }

    if (!this.pregunta.respuesta || this.pregunta.respuesta.trim() === '') {
      Swal.fire('Atención', 'Debe seleccionar una respuesta correcta.', 'warning');
      return;
    }

    if (!opciones.includes(this.pregunta.respuesta.trim())) {
      Swal.fire('Atención', 'La respuesta correcta debe coincidir con una opción válida.', 'warning');
      return;
    }

    const payload = this.construirPayload();

    this.preguntaService.guardarPregunta(payload).subscribe(
      () => {
        Swal.fire('Pregunta guardada', 'La pregunta ha sido agregada con éxito', 'success');
        this.pregunta.contenido = '';
        this.pregunta.opciones = ['', ''];
        this.pregunta.respuesta = '';
        this.cargarCupo();
      }, (error) => {
        if (error?.status === 409) {
          Swal.fire('Límite alcanzado', error?.error?.mensaje || 'No se pueden agregar más preguntas a este examen.', 'info');
          this.cargarCupo();
          return;
        }

        Swal.fire('Error', 'Error al guardar la pregunta en la base de datos', 'error');
        console.log(error);
      }
    );
  }

}