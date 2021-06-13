import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';

@Component({
  selector: 'app-root',
  template: ` 
              <app-layout></app-layout>
              <footer class="d-flex justify-content-center pt-4 pb-4 footer">
                <span>Copyright @ Anh Nguyen Real Estate. All Rights Reserverd.</span>
              </footer>
            `
})
export class AppComponent implements OnInit {
  title = 'Anh Nguyen Real Estate';

  idleState = 'Not started.';
  lastPing?: Date = undefined;

  constructor(private idle: Idle, private keepalive: Keepalive, private router: Router, private auth: AngularFireAuth) {

  }

  ngOnInit() {
    // this.idle.setIdle(5);
    // this.idle.setTimeout(0);
    // // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    // this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    // this.idle.onTimeout.subscribe(() => {
    //   this.idleState = 'Timed out!';
    //   this.auth.signOut();
    //   this.router.navigate(['/']);
    // });
    // // sets the ping interval to 15 seconds
    // this.keepalive.interval(15);
    // this.keepalive.onPing.subscribe(() => this.lastPing = new Date());
    // this.idle.watch();
  }
}
