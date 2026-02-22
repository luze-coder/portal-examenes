import { TestBed } from '@angular/core/testing';

import { ExamenAlumnoService } from './examen-alumno.service';

describe('ExamenAlumnoService', () => {
  let service: ExamenAlumnoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExamenAlumnoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
