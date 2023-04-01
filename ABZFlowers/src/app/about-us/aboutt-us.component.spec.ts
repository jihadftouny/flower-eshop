import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbouttUsComponent } from './aboutt-us.component';

describe('AbouttUsComponent', () => {
  let component: AbouttUsComponent;
  let fixture: ComponentFixture<AbouttUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbouttUsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbouttUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
