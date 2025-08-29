import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <section class="space-y-4">
      <h2 class="text-xl font-semibold">Halo 👋</h2>

      <div class="grid grid-cols-2 gap-3">
        <button class="rounded-xl bg-indigo-600 text-white px-4 py-3 text-sm font-medium active:scale-[0.99]">Mulai</button>
        <button class="rounded-xl border border-gray-200 dark:border-neutral-800 px-4 py-3 text-sm font-medium bg-white dark:bg-neutral-900">Lihat Keluarga</button>
      </div>

      <div class="mt-2 rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden">
        <div class="p-4 bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white">
          <p class="text-sm font-medium">Tips</p>
          <p class="text-xs opacity-90">Gunakan bottom tab untuk navigasi cepat.</p>
        </div>
        <ul class="divide-y divide-gray-200 dark:divide-neutral-800">
          <li class="p-4 text-sm">Anggota keluarga terbaru</li>
          <li class="p-4 text-sm">Acara keluarga terdekat</li>
          <li class="p-4 text-sm">Catatan penting</li>
        </ul>
      </div>
    </section>
  `,
})
export class HomeComponent {}

