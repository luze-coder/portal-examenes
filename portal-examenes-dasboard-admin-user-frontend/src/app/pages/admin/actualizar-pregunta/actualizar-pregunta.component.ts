import { PreguntaService } from './../../../services/pregunta.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actualizar-pregunta',
  templateUrl: './actualizar-pregunta.component.html',
  styleUrls: ['./actualizar-pregunta.component.css']
})
export class ActualizarPreguntaComponent implements OnInit {

  preguntaId: any = 0;
  pregunta: any;

  constructor(
    private route: ActivatedRoute,
    private preguntaService: PreguntaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.preguntaId = this.route.snapshot.params['preguntaId'];
    this.preguntaService.obtenerPregunta(this.preguntaId).subscribe(
      (data: any) => {
        this.pregunta = data;
        this.normalizarOpciones();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  trackByIndex(index: number): number {
    return index;
  }

  normalizarOpciones() {
    if (!this.pregunta) {
      return;
    }

    const opciones = (this.pregunta.opciones && this.pregunta.opciones.length > 0)
      ? this.pregunta.opciones
      : [this.pregunta.opcion1, this.pregunta.opcion2, this.pregunta.opcion3, this.pregunta.opcion4];

    this.pregunta.opciones = (opciones || [])
      .map((op: string) => (op || '').trim())
      .filter((op: string) => !!op)
      .filter((op: string, i: number, arr: string[]) => arr.indexOf(op) === i);

    if (this.pregunta.opciones.length < 2) {
      this.pregunta.opciones = [...this.pregunta.opciones, '', ''].slice(0, 2);
    }
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
    return (this.pregunta?.opciones || [])
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

  public actualizarDatosDeLaPregunta() {
    if (!this.pregunta?.contenido || this.pregunta.contenido.trim() === '') {
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

    this.preguntaService.actualizarPregunta(payload).subscribe(
      () => {
        Swal.fire('Pregunta actualizada', 'La pregunta ha sido actualizada con éxito', 'success').then(() => {
          this.router.navigate(['/admin/ver-preguntas/' + this.pregunta.examen.examenId + '/' + this.pregunta.examen.titulo]);
        });
      }
    );
  }
}