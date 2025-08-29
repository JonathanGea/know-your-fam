import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[treeNodeRef]',
  standalone: true,
})
export class TreeNodeRefDirective {
  @Input('treeNodeRef') id!: string;
  constructor(public el: ElementRef<HTMLElement>) {}
}

