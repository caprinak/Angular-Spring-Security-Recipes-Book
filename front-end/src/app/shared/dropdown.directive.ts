import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  constructor(private el: ElementRef) {}

  @HostListener('click')
  onClick() {
    const dropdown = this.el.nativeElement.querySelector('.dropdown-menu');
    const button = this.el.nativeElement.querySelector('.dropdown-toggle');
    
    if (dropdown.classList.contains('show')) {
      dropdown.classList.remove('show');
      button.setAttribute('aria-expanded', 'false');
    } else {
      dropdown.classList.add('show');
      button.setAttribute('aria-expanded', 'true');
    }
}
}