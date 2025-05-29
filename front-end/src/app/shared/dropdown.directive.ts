import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  constructor(private el: ElementRef) {}

  @HostListener('document:click', ['$event'])
  toggleOpen(event: Event) {
    const dropdown = this.el.nativeElement.querySelector('.dropdown-menu');
    if (this.el.nativeElement.contains(event.target)) {
      dropdown.classList.toggle('show');
    } else {
      dropdown.classList.remove('show');
    }
}
}