import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadGameComponent } from './loadgame.component';

describe('LoadGameComponent', () => {
  let component: LoadGameComponent;
  let fixture: ComponentFixture<LoadGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
