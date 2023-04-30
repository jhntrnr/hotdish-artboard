import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtboardContainerComponent } from './artboard-container.component';

describe('ArtboardContainerComponent', () => {
  let component: ArtboardContainerComponent;
  let fixture: ComponentFixture<ArtboardContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtboardContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtboardContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
