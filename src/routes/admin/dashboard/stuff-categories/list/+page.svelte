<!-- src/routes/kategori-stuff/+page.svelte -->
<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData } from './$types';

  export let data: PageData;

  let { typeStuffs, error } = data;

  let isDeleting = false;
  let deleteId: string | null = null;
  let message = '';
  let messageType: 'success' | 'error' = 'success';

  async function handleDelete(id: string) {
    if (!confirm('Yakin ingin menghapus kategori ini?')) return;

    isDeleting = true;
    deleteId = id;
    message = '';

    try {
      const form = new FormData();
      form.append('id', id);

      const response = await fetch('', {
        method: 'POST',
        body: form
      });

      const result = await response.json();

      if (result.success) {
        message = result.message || 'Kategori berhasil dihapus';
        messageType = 'success';
        // Hapus dari list tanpa refresh
        typeStuffs = typeStuffs.filter(item => item.id !== id);
      } else {
        message = result.message || 'Gagal menghapus kategori';
        messageType = 'error';
      }
    } catch (err) {
      message = 'Terjadi kesalahan saat menghapus';
      messageType = 'error';
      console.error(err);
    } finally {
      isDeleting = false;
      deleteId = null;
    }
  }
</script>

<div class="container mx-auto p-6">
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100">
      Kategori Stuff
    </h1>

    <!-- Tombol Tambah (bisa diarahkan ke halaman form terpisah) -->
    <a
      href="/kategori-stuff/tambah"
      class="btn btn-primary px-6 py-2 rounded-lg"
    >
      + Tambah Kategori
    </a>
  </div>

  {#if error}
    <div class="alert alert-error mb-6">
      {error}
    </div>
  {/if}

  {#if message}
    <div
      class="alert mb-6 {messageType === 'success' ? 'alert-success' : 'alert-error'}"
    >
      {message}
    </div>
  {/if}

  {#if typeStuffs?.length === 0}
    <div class="text-center py-12 text-gray-500 dark:text-gray-400">
      Belum ada kategori stuff yang tersedia.
    </div>
  {:else}
    <div class="overflow-x-auto">
      <table class="table table-zebra w-full">
        <thead>
          <tr>
            <th class="w-16 text-center">#</th>
            <th>Nama Kategori</th>
            <th class="w-32 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {#each typeStuffs as item, index}
            <tr>
              <td class="text-center">{index + 1}</td>
              <td class="font-medium">{item.name}</td>
              <td class="text-center">
                <div class="flex gap-2 justify-center">
                  <!-- Edit (opsional - bisa diaktifkan nanti) -->
                  <!-- <a href="/kategori-stuff/edit/{item.id}" class="btn btn-sm btn-outline btn-info">Edit</a> -->

                  <form
                    method="POST"
                    use:enhance
                    on:submit|preventDefault={() => handleDelete(item.id)}
                  >
                    <input type="hidden" name="id" value={item.id} />
                    <button
                      type="submit"
                      class="btn btn-sm btn-outline btn-error"
                      disabled={isDeleting && deleteId === item.id}
                    >
                      {#if isDeleting && deleteId === item.id}
                        <span class="loading loading-spinner loading-xs"></span>
                        Menghapus...
                      {:else}
                        Hapus
                      {/if}
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<style>
  .btn {
    @apply btn-sm px-4 py-2 font-medium rounded transition-colors;
  }
  .btn-primary {
    @apply bg-blue-600 hover:bg-blue-700 text-white;
  }
  .btn-outline {
    @apply border border-current;
  }
  .btn-info {
    @apply text-info hover:bg-info/10;
  }
  .btn-error {
    @apply text-error hover:bg-error/10;
  }
</style>