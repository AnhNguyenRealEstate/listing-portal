import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { SessionTimeoutService } from './components/session-timeout/session-timeout.service';

describe('AppComponent', () => {

  let timeoutStub: Partial<SessionTimeoutService>;

  timeoutStub = {
    setTimeout: () => {}
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        [{ provide: SessionTimeoutService, useValue: timeoutStub }]
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Anh Nguyen Real Estate'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Anh Nguyen Real Estate');
  });
});
