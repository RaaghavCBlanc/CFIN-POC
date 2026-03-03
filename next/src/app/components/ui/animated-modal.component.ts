import { Component, Injectable, Input, Output, EventEmitter, signal, effect, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ButtonComponent } from '../elements/button.component';
import { cn } from '../../utils/utils';

@Injectable({ providedIn: 'root' })
export class ModalService {
  open = signal(false);
  setOpen(val: boolean) { this.open.set(val); }
}

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  template: `<ng-content />`,
  providers: [ModalService],
})
export class ModalComponent {
  constructor(public modalService: ModalService) {}
}

@Component({
  selector: 'app-modal-trigger',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <app-button (click)="onTrigger()" [className]="className || ''">
      <ng-content />
    </app-button>
  `,
})
export class ModalTriggerComponent {
  @Input() className?: string;
  @Output() triggerClick = new EventEmitter<void>();

  constructor(private modalService: ModalService) {}

  onTrigger() {
    this.modalService.setOpen(true);
    this.triggerClick.emit();
  }
}

@Component({
  selector: 'app-modal-body',
  standalone: true,
  template: `
    @if (modalService.open()) {
      <div class="fixed [perspective:800px] [transform-style:preserve-3d] inset-0 h-full w-full flex items-center justify-center z-50">
        <div (click)="modalService.setOpen(false)" class="fixed inset-0 h-full w-full bg-black bg-opacity-50 z-50 backdrop-blur-sm"></div>
        <div
          #modalRef
          [class]="bodyClass"
          class="modal-body-enter"
        >
          <button (click)="modalService.setOpen(false)" class="absolute top-4 right-4 group z-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="text-black h-4 w-4 group-hover:scale-125 group-hover:rotate-3 transition duration-200">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M18 6l-12 12" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
          <ng-content />
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-body-enter {
      animation: modalIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes modalIn {
      from { opacity: 0; transform: scale(0.5) rotateX(40deg) translateY(40px); }
      to { opacity: 1; transform: scale(1) rotateX(0) translateY(0); }
    }
  `],
})
export class ModalBodyComponent implements OnInit, OnDestroy {
  @Input() className?: string;

  constructor(public modalService: ModalService) {}

  get bodyClass() {
    return cn(
      'min-h-[50%] max-h-[90%] md:max-w-[40%] bg-white border border-transparent md:rounded-2xl relative z-50 flex flex-col flex-1 overflow-hidden',
      this.className
    );
  }

  ngOnInit() {
    if (typeof document !== 'undefined' && this.modalService.open()) {
      document.body.style.overflow = 'hidden';
    }
  }

  ngOnDestroy() {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'auto';
    }
  }
}

@Component({
  selector: 'app-modal-content',
  standalone: true,
  template: `
    <div [class]="contentClass">
      <ng-content />
    </div>
  `,
})
export class ModalContentComponent {
  @Input() className?: string;
  get contentClass() {
    return cn('flex flex-col flex-1 p-8 md:p-10', this.className);
  }
}

@Component({
  selector: 'app-modal-footer',
  standalone: true,
  template: `
    <div [class]="footerClass">
      <ng-content />
    </div>
  `,
})
export class ModalFooterComponent {
  @Input() className?: string;
  get footerClass() {
    return cn('flex justify-end p-4 bg-gray-100', this.className);
  }
}
