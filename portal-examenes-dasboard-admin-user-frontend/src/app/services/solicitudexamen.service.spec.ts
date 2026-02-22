import { TestBed } from '@angular/core/testing';

import { SolicitudexamenService } from './solicitudexamen.service';

describe('SolicitudexamenService', () => {
  let service: SolicitudexamenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitudexamenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
