import { Component, Directive, ElementRef, HostListener, Input, QueryList, ViewChild, ViewChildren, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';

type Person = {
  id: string;
  name: string;
  born?: number;
  spouse?: Person; // pasangan
  spouseStatus?: 'married' | 'divorced';
  adopted?: boolean; // if adopted relative to parent edge in this tree
  children?: Person[];
};

@Directive({
  selector: '[treeNodeRef]',
  standalone: true,
})
export class TreeNodeRefDirective {
  @Input('treeNodeRef') id!: string;
  constructor(public el: ElementRef<HTMLElement>) {}
}

@Component({
  selector: 'app-tree',
  standalone: true,
  imports: [CommonModule, TreeNodeRefDirective],
  template: `
    <section class="space-y-4">
      <h2 class="text-xl font-semibold">Family Tree</h2>
      <p class="text-xs text-gray-600 dark:text-gray-300">Data dummy untuk demontrasi graph.</p>

      <div #scrollBox class="relative overflow-auto max-w-full max-h-[70svh] rounded-lg border border-gray-200 dark:border-neutral-800">
        <div class="origin-top-left" [ngStyle]="{ transform: 'scale(' + zoom + ')' }">
          <!-- SVG connectors overlay -->
          <svg class="absolute left-0 top-0 pointer-events-none"
               [attr.width]="canvasW" [attr.height]="canvasH">
            <g fill="none">
              <path *ngFor="let c of connectors"
                    [attr.d]="c.d" [attr.stroke]="c.color" [attr.stroke-width]="c.w || 2"
                    [attr.stroke-dasharray]="c.dash || null" stroke-linecap="round" />
            </g>
          </svg>
          <div #content class="min-w-[20rem] relative">
            <ng-container *ngTemplateOutlet="nodeTpl; context: { $implicit: root, depth: 0 }"></ng-container>
          </div>
        </div>
      </div>

      <ng-template #nodeTpl let-node let-depth="depth">
        <div class="relative pl-4" [ngClass]="{ 'pt-3': depth > 0 }">
          <!-- connector line from parent -->
          <div *ngIf="depth > 0" class="absolute left-0 top-0 h-full border-l border-gray-200 dark:border-neutral-800"></div>

          <!-- couple row (node + optional spouse) -->
          <div class="relative z-[1] inline-flex items-center gap-4">
            <!-- person card -->
            <div class="inline-flex items-center gap-3 rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 shadow-sm cursor-pointer select-none"
                 (click)="select(node)" [treeNodeRef]="node.id">
              <div class="size-8 rounded-full bg-indigo-600 text-white grid place-items-center text-xs font-semibold">
                {{ initials(node.name) }}
              </div>
              <div>
                <div class="text-sm font-medium">{{ node.name }}</div>
                <div class="text-[11px] text-gray-500" *ngIf="node.born">b. {{ node.born }}</div>
              </div>
            </div>

            <!-- spouse card (optional) -->
            <ng-container *ngIf="node.spouse as s">
              <div class="h-px w-4 bg-rose-300 dark:bg-rose-400/50" aria-hidden="true"></div>
              <div class="inline-flex items-center gap-3 rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 shadow-sm cursor-pointer select-none"
                   (click)="select(s)" [treeNodeRef]="s.id">
                <div class="size-8 rounded-full bg-fuchsia-600 text-white grid place-items-center text-xs font-semibold">
                  {{ initials(s.name) }}
                </div>
                <div>
                  <div class="text-sm font-medium">{{ s.name }}</div>
                  <div class="text-[11px] text-gray-500" *ngIf="s.born">b. {{ s.born }}</div>
                </div>
              </div>
            </ng-container>

            <!-- expand toggle at end if has children -->
            <button *ngIf="node.children?.length"
              class="ml-1 p-1 rounded hover:bg-gray-100 dark:hover:bg-neutral-800"
              (click)="toggle(node)"
              [attr.aria-expanded]="!isCollapsed(node)"
              aria-label="Toggle children">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                   class="size-5 transition-transform"
                   [ngClass]="{ 'rotate-90': !isCollapsed(node) }">
                <path fill-rule="evenodd" d="M8.03 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06L14.94 12 8.03 5.03a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>

          <!-- children -->
          <div *ngIf="node.children?.length && !isCollapsed(node)" class="pl-6 mt-2 space-y-2">
            <ng-container *ngFor="let child of node.children">
              <ng-container *ngTemplateOutlet="nodeTpl; context: { $implicit: child, depth: depth + 1 }"></ng-container>
            </ng-container>
          </div>
        </div>
      </ng-template>

      <!-- Legend kecil -->
      <div class="mt-3 rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3">
        <div class="text-xs font-medium mb-2">Keterangan</div>
        <div class="grid grid-cols-2 gap-3 text-xs">
          <div class="flex items-center gap-2">
            <svg width="48" height="8"><path [attr.stroke]="spouseColor" stroke-width="3" d="M1 4 L47 4"/></svg>
            <span>Pasangan (menikah)</span>
          </div>
          <div class="flex items-center gap-2">
            <svg width="48" height="8"><path [attr.stroke]="spouseDivorcedColor" stroke-width="3" stroke-dasharray="4 4" d="M1 4 L47 4"/></svg>
            <span>Pasangan (cerai)</span>
          </div>
          <div class="flex items-center gap-2">
            <svg width="48" height="8"><path stroke="#60a5fa" stroke-width="3" d="M1 4 L47 4"/></svg>
            <span>Parent → child</span>
          </div>
          <div class="flex items-center gap-2">
            <svg width="48" height="8"><path stroke="#60a5fa" stroke-width="3" stroke-dasharray="2 6" d="M1 4 L47 4"/></svg>
            <span>Anak adopsi</span>
          </div>
        </div>
        <div class="text-xs font-medium mt-3 mb-1">Warna generasi</div>
        <div class="flex flex-wrap gap-3 text-[11px]">
          <div class="flex items-center gap-2" *ngFor="let c of genColors; let i = index">
            <svg width="48" height="8"><path [attr.stroke]="c" stroke-width="3" d="M1 4 L47 4"/></svg>
            <span>Gen {{ i + 1 }}</span>
          </div>
        </div>
      </div>

      <!-- Details panel -->
      <div *ngIf="selected" class="mt-4 rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
        <div class="flex items-center gap-3">
          <div class="size-10 rounded-full bg-indigo-600 text-white grid place-items-center text-sm font-semibold">
            {{ initials(selected.name) }}
          </div>
          <div>
            <div class="font-semibold">{{ selected.name }}</div>
            <div class="text-xs text-gray-500" *ngIf="selected.born">b. {{ selected.born }}</div>
          </div>
        </div>
        <div class="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div>
            <div class="text-gray-500">Pasangan</div>
            <div>{{ findSpouse(selected)?.name || '-' }}
              <span *ngIf="findSpouseStatus(selected) as st" class="ml-1 px-1.5 py-0.5 rounded bg-gray-100 dark:bg-neutral-800">{{ st }}</span>
            </div>
          </div>
          <div>
            <div class="text-gray-500">Anak</div>
            <div>{{ (selected.children?.length || 0) }}</div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class TreeComponent {
  root: Person = {
    id: 'g1',
    name: 'Kakek',
    spouse: { id: 'g1s', name: 'Nenek' },
    spouseStatus: 'married',
    children: [
      {
        id: 'p1',
        name: 'Ayah',
        spouse: { id: 'p1s', name: 'Ibu' },
        spouseStatus: 'married',
        children: [
          { id: 'c1', name: 'Anak 1' },
          {
            id: 'c2',
            name: 'Anak 2',
            spouse: { id: 'c2s', name: 'Pasangan Anak 2' },
            spouseStatus: 'married',
            children: [
              { id: 'gc1', name: 'Cucu 1' },
              { id: 'gc2', name: 'Cucu 2' }
            ]
          }
        ]
      },
      {
        id: 'u1',
        name: 'Paman',
        spouse: { id: 'u1s', name: 'Bibi' },
        spouseStatus: 'married',
        children: [
          { id: 'uc1', name: 'Sepupu 1' }
        ]
      },
      {
        id: 'a1',
        name: 'Tante',
        spouse: { id: 'a1s', name: 'Om' },
        spouseStatus: 'married',
        children: [
          { id: 'ac1', name: 'Sepupu 2' },
          { id: 'ac2', name: 'Sepupu 3' }
        ]
      }
    ]
  };

  initials(name: string): string {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]!.toUpperCase())
      .join('');
  }

  private collapsed = new Set<string>();

  isCollapsed(node: Person): boolean {
    return this.collapsed.has(node.id);
  }

  toggle(node: Person): void {
    if (this.collapsed.has(node.id)) this.collapsed.delete(node.id);
    else this.collapsed.add(node.id);
    this.scheduleRecalc();
    try { localStorage.setItem('tree:collapsed', JSON.stringify(Array.from(this.collapsed))); } catch {}
  }

  // SVG connectors
  @ViewChild('scrollBox', { static: true }) private scrollBox?: ElementRef<HTMLElement>;
  @ViewChild('content', { static: true }) private content?: ElementRef<HTMLElement>;
  @ViewChildren(TreeNodeRefDirective) private nodeRefs?: QueryList<TreeNodeRefDirective>;

  connectors: { d: string; color: string; w?: number; dash?: string }[] = [];
  canvasW = 0;
  canvasH = 0;
  // colors for legend and drawing
  genColors = ['#94a3b8', '#60a5fa', '#a78bfa', '#34d399', '#fbbf24'];
  spouseColor = '#fb7185';
  spouseDivorcedColor = '#9ca3af';

  constructor() {
    // recalc after initial render
    afterNextRender(() => this.recalc());
    // restore collapsed state
    try {
      const raw = localStorage.getItem('tree:collapsed');
      if (raw) {
        const arr = JSON.parse(raw) as string[];
        this.collapsed = new Set(arr);
      }
    } catch {}
  }

  @HostListener('window:resize') onResize() {
    this.scheduleRecalc();
  }

  private scheduleRecalc() {
    requestAnimationFrame(() => this.recalc());
  }

  private recalc() {
    if (!this.content || !this.scrollBox || !this.nodeRefs) return;
    const contentEl = this.content.nativeElement;
    const box = contentEl.getBoundingClientRect();

    // Set canvas size to content scroll size (unscaled units),
    // SVG and content are scaled together by the same wrapper transform.
    this.canvasW = contentEl.scrollWidth;
    this.canvasH = contentEl.scrollHeight;

    const byId = new Map<string, DOMRect>();
    for (const ref of this.nodeRefs.toArray()) {
      const r = ref.el.nativeElement.getBoundingClientRect();
      // convert to content local coordinates
      const local = new DOMRect(
        (r.left - box.left + contentEl.scrollLeft) / this.zoom,
        (r.top - box.top + contentEl.scrollTop) / this.zoom,
        r.width / this.zoom,
        r.height / this.zoom,
      );
      byId.set(ref.id, local);
    }

    const paths: { d: string; color: string; w?: number; dash?: string }[] = [];

    const getCenterBottom = (id: string): { x: number; y: number } | null => {
      const r = byId.get(id);
      if (!r) return null;
      return { x: r.left + r.width / 2, y: r.top + r.height };
    };

    const getCoupleAnchor = (p: Person): { x: number; y: number } | null => {
      const a = getCenterBottom(p.id);
      if (p.spouse) {
        const b = getCenterBottom(p.spouse.id);
        if (!a || !b) return a || b;
        return { x: (a.x + b.x) / 2, y: Math.max(a.y, b.y) };
      }
      return a;
    };

    const getChildTopCenter = (p: Person): { x: number; y: number } | null => {
      const primary = byId.get(p.id);
      const topY = (() => {
        const top = primary?.top ?? null;
        if (p.spouse) {
          const sr = byId.get(p.spouse.id);
          if (sr && primary) return Math.min(primary.top, sr.top);
          return sr?.top ?? top;
        }
        return top;
      })();
      if (!topY || !primary) return null;
      const x = p.spouse
        ? (() => {
            const a = byId.get(p.id)!;
            const b = byId.get(p.spouse!.id);
            return b ? (a.left + a.width / 2 + b.left + b.width / 2) / 2 : a.left + a.width / 2;
          })()
        : primary.left + primary.width / 2;
      return { x, y: topY };
    };

    const walk = (p: Person, depth = 0) => {
      // spouse connector (horizontal)
      if (p.spouse) {
        const a = byId.get(p.id);
        const b = byId.get(p.spouse.id);
        if (a && b) {
          const y = (a.top + a.height / 2 + b.top + b.height / 2) / 2;
          const d = `M ${a.right} ${y} L ${b.left} ${y}`;
          const divorced = p.spouseStatus === 'divorced';
          paths.push({ d, color: divorced ? this.spouseDivorcedColor : this.spouseColor, w: 2, dash: divorced ? '4 4' : undefined });
        }
      }

      if (!p.children || p.children.length === 0 || this.isCollapsed(p)) return;
      const parentAnchor = getCoupleAnchor(p);
      if (!parentAnchor) return;
      const { x: px, y: py } = parentAnchor;
      const color = this.genColors[depth % this.genColors.length];

      for (const c of p.children) {
        const childTop = getChildTopCenter(c);
        if (!childTop) continue;
        const cx = childTop.x;
        const cy = childTop.y;
        const midY = (py + cy) / 2;
        const d = `M ${px} ${py} L ${px} ${midY} L ${cx} ${midY} L ${cx} ${cy}`;
        const dash = c.adopted ? '2 6' : undefined;
        paths.push({ d, color, w: 2, dash });
        walk(c, depth + 1);
      }
    };
    walk(this.root, 0);
    this.connectors = paths;
  }

  // selection/tooltip panel
  selected: Person | null = null;
  select(p: Person) { this.selected = p; }
  findSpouse(p: Person): Person | null { return p.spouse ?? null; }
  findSpouseStatus(p: Person): string | null { return p.spouseStatus ?? null; }

  // pan/zoom (drag to scroll; Ctrl+wheel to zoom)
  zoom = 1;
  @HostListener('wheel', ['$event'])
  onWheel(ev: WheelEvent) {
    if (!this.scrollBox) return;
    if (ev.ctrlKey) {
      ev.preventDefault();
      const rect = this.scrollBox.nativeElement.getBoundingClientRect();
      const pointerX = ev.clientX - rect.left;
      const pointerY = ev.clientY - rect.top;
      const prevZoom = this.zoom;
      const delta = -ev.deltaY;
      const factor = Math.exp(delta * 0.001);
      this.zoom = Math.max(0.5, Math.min(2, this.zoom * factor));
      const sb = this.scrollBox.nativeElement;
      const focusX = (sb.scrollLeft + pointerX) / prevZoom;
      const focusY = (sb.scrollTop + pointerY) / prevZoom;
      sb.scrollLeft = focusX * this.zoom - pointerX;
      sb.scrollTop = focusY * this.zoom - pointerY;
      this.scheduleRecalc();
    }
  }
  private isPanning = false;
  private panStart = { x: 0, y: 0, sl: 0, st: 0 };
  @HostListener('mousedown', ['$event'])
  onDown(ev: MouseEvent) {
    if (!this.scrollBox) return;
    const target = ev.target as HTMLElement;
    if (target.closest('button')) return; // ignore clicks on controls
    this.isPanning = true;
    this.panStart = { x: ev.clientX, y: ev.clientY, sl: this.scrollBox.nativeElement.scrollLeft, st: this.scrollBox.nativeElement.scrollTop };
    this.scrollBox.nativeElement.style.cursor = 'grabbing';
    ev.preventDefault();
  }
  @HostListener('mousemove', ['$event'])
  onMove(ev: MouseEvent) {
    if (!this.scrollBox || !this.isPanning) return;
    const dx = ev.clientX - this.panStart.x;
    const dy = ev.clientY - this.panStart.y;
    this.scrollBox.nativeElement.scrollLeft = this.panStart.sl - dx;
    this.scrollBox.nativeElement.scrollTop = this.panStart.st - dy;
  }
  @HostListener('mouseup') onUp() { this.endPan(); }
  @HostListener('mouseleave') onLeave() { this.endPan(); }
  private endPan() {
    if (!this.scrollBox) return;
    this.isPanning = false;
    this.scrollBox.nativeElement.style.cursor = '';
  }
}
