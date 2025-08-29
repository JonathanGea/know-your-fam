import { Component, ElementRef, HostListener, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Person } from './person.model';
import { TreeNodeRefDirective } from './tree-node-ref.directive';

 

@Component({
  selector: 'app-tree',
  standalone: true,
  imports: [CommonModule, TreeNodeRefDirective],
  templateUrl: './tree.component.html',
  
})
export class TreeComponent {
  viewRoot!: Person;
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
          {
            id: 'c1',
            name: 'Anak 1',
            spouse: { id: 'c1s', name: 'Pasangan Anak 1' },
            spouseStatus: 'married',
            children: [
              { id: 'gc1a', name: 'Cucu 1A' },
              { id: 'gc1b', name: 'Cucu 1B', adopted: true }
            ]
          },
          {
            id: 'c2',
            name: 'Anak 2',
            spouse: { id: 'c2s', name: 'Pasangan Anak 2' },
            spouseStatus: 'married',
            children: [
              {
                id: 'gc1',
                name: 'Cucu 1',
                spouse: { id: 'gc1s', name: 'Pasangan Cucu 1' },
                spouseStatus: 'married',
                children: [
                  { id: 'ggc1a', name: 'Cicit 1A' },
                  { id: 'ggc1b', name: 'Cicit 1B' }
                ]
              },
              { id: 'gc2', name: 'Cucu 2' }
            ]
          },
          {
            id: 'c3',
            name: 'Anak 3',
            spouse: { id: 'c3s', name: 'Mantan' },
            spouseStatus: 'divorced',
            children: [
              { id: 'gc3a', name: 'Cucu 3' }
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
          { id: 'uc1', name: 'Sepupu 1' },
          {
            id: 'uc2',
            name: 'Sepupu A',
            spouse: { id: 'uc2s', name: 'Pasangan Sepupu A' },
            spouseStatus: 'married',
            children: [
              { id: 'u2c1', name: 'Keponakan 1' }
            ]
          }
        ]
      },
      {
        id: 'a1',
        name: 'Tante',
        spouse: { id: 'a1s', name: 'Om' },
        spouseStatus: 'married',
        children: [
          {
            id: 'ac1',
            name: 'Sepupu 2',
            spouse: { id: 'ac1s', name: 'Pasangan Sepupu 2' },
            spouseStatus: 'married'
          },
          {
            id: 'ac2',
            name: 'Sepupu 3',
            spouse: { id: 'ac2s', name: 'Pasangan Sepupu 3' },
            spouseStatus: 'married',
            children: [
              { id: 'ac2c1', name: 'Keponakan 2', adopted: true }
            ]
          }
        ]
      },
      {
        id: 'b1',
        name: 'Bungsu',
        spouse: { id: 'b1s', name: 'Istri Bungsu' },
        spouseStatus: 'married',
        children: [
          { id: 'b1c1', name: 'Sepupu 4' }
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
  @ViewChild('gesture', { static: true }) private gesture?: ElementRef<HTMLElement>;
  @ViewChildren(TreeNodeRefDirective) private nodeRefs?: QueryList<TreeNodeRefDirective>;

  connectors: { d: string; color: string; w?: number; dash?: string }[] = [];
  canvasW = 0;
  canvasH = 0;
  spouseColor = '#fb7185';
  spouseDivorcedColor = '#9ca3af';

  constructor() {
    this.viewRoot = this.root;
    // recalc after initial render on next macrotask to avoid NG0100
    setTimeout(() => this.recalc());
    // restore collapsed state
    try {
      const raw = localStorage.getItem('tree:collapsed');
      if (raw) {
        const arr = JSON.parse(raw) as string[];
        this.collapsed = new Set(arr);
      }
    } catch {}
    // restore zoom or keep smaller default
    try {
      const rawZoom = localStorage.getItem('tree:zoom');
      if (rawZoom != null) this.zoom = Math.max(0.5, Math.min(2, parseFloat(rawZoom) || this.zoom));
    } catch {}
  }
  private pathToSelected: Person[] = [];

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
    // no persistent rect cache; keep local

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
      const children = this.filteredChildren(p);
      for (const c of children) {
        // Tidak menggambar garis parent→child; hanya teruskan rekursi untuk pasangan di level bawah
        walk(c, depth + 1);
      }
    };
    walk(this.viewRoot, 0);
    this.connectors = paths;
  }

  // selection panel (no focus logic)
  selected: Person | null = null;
  select(p: Person) {
    this.selected = p;
    this.scheduleRecalc();
  }
  findSpouse(p: Person): Person | null { return p.spouse ?? null; }
  findSpouseStatus(p: Person): string | null { return p.spouseStatus ?? null; }
  filteredChildren(node: Person): Person[] {
    return node.children ?? [];
  }
  // focusSelection removed (button deleted)

  // pan/zoom (drag to scroll; Ctrl+wheel to zoom)
  zoom = 0.85; // perkecil saat pertama kali dibuka
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
      try { localStorage.setItem('tree:zoom', String(this.zoom)); } catch {}
    }
  }
  // Touch pinch-zoom and pan
  private activePointers = new Map<number, { x: number; y: number }>();
  private pinchLastDistance = 0;
  private isTouchPanning = false;
  private touchPanStart = { x: 0, y: 0, sl: 0, st: 0 };

  @HostListener('pointerdown', ['$event'])
  onPointerDown(ev: PointerEvent) {
    if (ev.pointerType !== 'touch' || !this.gesture || !this.scrollBox) return;
    const target = ev.target as HTMLElement;
    if (!this.gesture.nativeElement.contains(target)) return;
    ev.preventDefault();
    this.gesture.nativeElement.setPointerCapture(ev.pointerId);
    this.activePointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    if (this.activePointers.size === 1) {
      const sb = this.scrollBox.nativeElement;
      this.isTouchPanning = true;
      this.touchPanStart = { x: ev.clientX, y: ev.clientY, sl: sb.scrollLeft, st: sb.scrollTop };
    } else if (this.activePointers.size === 2) {
      const [a, b] = Array.from(this.activePointers.values());
      this.pinchLastDistance = Math.hypot(b.x - a.x, b.y - a.y);
      this.isTouchPanning = false;
    }
  }

  @HostListener('pointermove', ['$event'])
  onPointerMove(ev: PointerEvent) {
    if (ev.pointerType !== 'touch' || !this.scrollBox || !this.gesture) return;
    const target = ev.target as HTMLElement;
    if (!this.gesture.nativeElement.contains(target)) return;
    const rec = this.activePointers.get(ev.pointerId);
    if (!rec) return;
    this.activePointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });

    if (this.activePointers.size === 2) {
      ev.preventDefault();
      const [a, b] = Array.from(this.activePointers.values());
      const currDist = Math.hypot(b.x - a.x, b.y - a.y);
      if (this.pinchLastDistance === 0) this.pinchLastDistance = currDist;
      const factor = currDist / this.pinchLastDistance || 1;
      const midX = (a.x + b.x) / 2;
      const midY = (a.y + b.y) / 2;
      const sb = this.scrollBox.nativeElement;
      const prevZoom = this.zoom;
      const nextZoom = Math.max(0.5, Math.min(2, prevZoom * factor));
      if (nextZoom !== prevZoom) {
        const focusX = (sb.scrollLeft + midX) / prevZoom;
        const focusY = (sb.scrollTop + midY) / prevZoom;
        this.zoom = nextZoom;
        sb.scrollLeft = focusX * this.zoom - midX;
        sb.scrollTop = focusY * this.zoom - midY;
        this.scheduleRecalc();
        try { localStorage.setItem('tree:zoom', String(this.zoom)); } catch {}
      }
      this.pinchLastDistance = currDist;
    } else if (this.isTouchPanning && this.activePointers.size === 1) {
      ev.preventDefault();
      const sb = this.scrollBox.nativeElement;
      const dx = ev.clientX - this.touchPanStart.x;
      const dy = ev.clientY - this.touchPanStart.y;
      sb.scrollLeft = this.touchPanStart.sl - dx;
      sb.scrollTop = this.touchPanStart.st - dy;
    }
  }

  @HostListener('pointerup', ['$event'])
  @HostListener('pointercancel', ['$event'])
  onPointerUp(ev: PointerEvent) {
    if (ev.pointerType !== 'touch') return;
    this.activePointers.delete(ev.pointerId);
    if (this.activePointers.size < 2) this.pinchLastDistance = 0;
    if (this.activePointers.size === 0) this.isTouchPanning = false;
  }
  private isPanning = false;
  private panStart = { x: 0, y: 0, sl: 0, st: 0 };
  @HostListener('mousedown', ['$event'])
  onDown(ev: MouseEvent) {
    if (!this.scrollBox || !this.gesture) return;
    const target = ev.target as HTMLElement;
    // only start panning when interacting inside gesture area (the canvas)
    if (!this.gesture.nativeElement.contains(target)) return;
    // ignore interactive controls
    if (target.closest('button,select,input,textarea,a,[role="button"],[role="listbox"]')) return;
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

  // Toolbar actions
  expandAll() {
    const visit = (p: Person) => { if (p.children) p.children.forEach(visit); };
    this.collapsed.clear();
    visit(this.root);
    this.scheduleRecalc();
  }
  collapseAll() {
    const visit = (p: Person) => { if (p.children && p.children.length) { this.collapsed.add(p.id); p.children.forEach(visit); } };
    this.collapsed.clear();
    visit(this.root);
    this.scheduleRecalc();
  }
  // centerOnRoot removed: only vertical layout without centering control
}
