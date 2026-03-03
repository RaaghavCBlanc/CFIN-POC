import { Component } from '@angular/core';
import { AmbientColorComponent } from '../../components/decorations/ambient-color.component';
import { RegisterComponent } from '../../components/register.component';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [AmbientColorComponent, RegisterComponent],
  template: `
    <div class="relative overflow-hidden">
      <app-ambient-color />
      <app-register />
    </div>
  `,
})
export class SignUpComponent {}
