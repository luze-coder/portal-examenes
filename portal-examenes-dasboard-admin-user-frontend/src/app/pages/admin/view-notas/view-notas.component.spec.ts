import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNotasComponent } from './view-notas.component';

describe('ViewNotasComponent', () => {
  let component: ViewNotasComponent;
  let fixture: ComponentFixture<ViewNotasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewNotasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewNotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
