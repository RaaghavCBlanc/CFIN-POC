import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { cn } from '../../utils/utils';

@Component({
  selector: 'app-navbar-item',
  standalone: true,
  imports: [RouterLink],
  template: `
    <a
      [routerLink]="href"
      [target]="target || '_self'"
      [class]="computedClass"
    >
      <ng-content />
    </a>
  `,
})
export class NavbarItemComponent {
  @Input() href = '';
  @Input() active = false;
  @Input() target?: string;
  @Input() className?: string;

  get computedClass() {
    return cn(
      'flex items-center justify-center text-sm leading-[110%] px-4 py-2 rounded-md hover:bg-neutral-800 hover:text-white/80 text-white hover:shadow-[0px_1px_0px_0px_var(--neutral-600)_inset] transition duration-200',
      this.active && 'bg-transparent text-white',
      this.className
    );
  }
}
