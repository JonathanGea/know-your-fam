import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  template: `
    <section class="space-y-4">
      <h2 class="text-xl font-semibold">Profil</h2>
      <div class="flex items-center gap-3">
        <div class="size-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">KF</div>
        <div>
          <p class="text-sm font-medium">Nama Pengguna</p>
          <p class="text-xs text-gray-600 dark:text-gray-300">user@example.com</p>
        </div>
      </div>

      <div class="rounded-xl border border-gray-200 dark:border-neutral-800 divide-y divide-gray-200 dark:divide-neutral-800">
        <button class="w-full text-left p-4 text-sm hover:bg-gray-50 dark:hover:bg-neutral-900">Edit Profil</button>
        <button class="w-full text-left p-4 text-sm hover:bg-gray-50 dark:hover:bg-neutral-900">Pengaturan</button>
        <button class="w-full text-left p-4 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">Keluar</button>
      </div>
    </section>
  `,
})
export class ProfileComponent {}

