<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import type { PageData } from './$types';

  const { data }: PageData = $props();

  let toastMessage = $state<string | null>(null);
  let toastType = $state<'success' | 'error' | null>(null);

  let showDeleteModal = $state(false);
  let categoryToDelete = $state<{id: number, name: string} | null>(null);
  let isDeleting = $state(false);

  $effect(() => {
    if ($page.form?.success && $page.form.message) {
      showToast($page.form.message, 'success');
    } else if ($page.form?.message) {
      showToast($page.form.message, 'error');
    }
  });

  function showToast(message: string, type: 'success' | 'error') {
    toastMessage = message;
    toastType = type;
    setTimeout(() => {
      toastMessage = null;
      toastType = null;
    }, 4000);
  }

  function openDeleteModal(item: {id: number, name: string}) {
    categoryToDelete = item;
    showDeleteModal = true;
  }

  function closeDeleteModal() {
    if (!isDeleting) {
      showDeleteModal = false;
      categoryToDelete = null;
    }
  }

  function handleDelete() {
    if (categoryToDelete) {
      isDeleting = true;
      
      const form = document.querySelector(`form[data-category-id="${categoryToDelete.id}"]`) as HTMLFormElement;
      if (form) {
        form.requestSubmit();
      }
      
      setTimeout(() => {
        showDeleteModal = false;
        categoryToDelete = null;
        isDeleting = false;
      }, 500);
    }
  }
</script>

<svelte:head>
  <title>Stuff Categories | Admin</title>
</svelte:head>

<div class="wrapper">
  <div class="card">
    <div class="header">
      <div class="header-left">
        <h1>Stuff Categories</h1>
        <p class="subtitle">Manage all item categories</p>
      </div>
      <a href="/admin/dashboard/stuff-categories/add" class="btn-primary add-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Add New Category
      </a>
    </div>

    {#if data.typeStuffs?.length === 0}
      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <p>No categories available yet</p>
        <a href="/admin/dashboard/stuff-categories/add" class="btn-primary" style="margin-top: 24px;">
          Create Your First Category
        </a>
      </div>
    {:else}
      <div class="table-container">
        <table class="category-table">
          <thead>
            <tr>
              <th class="w-16 text-center">#</th>
              <th>Category Name</th>
              <th class="w-40 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {#each data.typeStuffs as item, index}
              <tr>
                <td class="text-center font-medium">{index + 1}</td>
                <td class="font-medium">{item.name}</td>
                <td class="text-center">
                  <div class="action-buttons">
                    <a
                      href={`/admin/dashboard/stuff-categories/edit?id=${item.id}`}
                      class="btn-edit"
                      title="Edit"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </a>

                    <!-- Hidden form for delete -->
                    <form 
                      method="POST" 
                      use:enhance
                      data-category-id={item.id}
                      style="display: none;"
                    >
                      <input type="hidden" name="id" value={item.id} />
                      <button type="submit" name="action" value="delete"></button>
                    </form>
                    
                    <!-- Delete button -->
                    <button
                      type="button"
                      class="btn-delete"
                      title="Delete Category"
                      on:click={() => openDeleteModal(item)}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>

{#if showDeleteModal}
  <div class="modal-overlay" on:click={closeDeleteModal}>
    <div class="modal-content" on:click|stopPropagation>
      <div class="modal-header">
        <div class="modal-icon danger">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h2 class="modal-title">Delete Category</h2>
        <p class="modal-description">
          Are you sure you want to delete "<strong>{categoryToDelete?.name}</strong>"? This action cannot be undone.
        </p>
      </div>
      
      <div class="modal-actions">
        <button
          class="btn-cancel"
          on:click={closeDeleteModal}
          disabled={isDeleting}
        >
          Cancel
        </button>
        <button
          class="btn-delete-modal"
          on:click={handleDelete}
          disabled={isDeleting}
        >
          {#if isDeleting}
            <svg class="spinner" width="20" height="20" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" stroke-dasharray="31.4 31.4" />
            </svg>
            Deleting...
          {:else}
            Yes, Delete
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}

{#if toastMessage}
  <div class="toast {toastType}">
    <div class="toast-content">
      {#if toastType === 'success'}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      {:else}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      {/if}
      <span>{toastMessage}</span>
    </div>
    <div class="toast-progress"></div>
  </div>
{/if}

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    background: linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%);
    min-height: 100vh;
  }

  .wrapper {
    min-height: 100vh;
    padding: 24px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }

  .card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 1200px;
    padding: 48px;
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    flex-wrap: wrap;
    gap: 20px;
  }

  .header-left h1 {
    font-size: 40px;
    font-weight: 800;
    color: #065f46;
    margin: 0 0 8px 0;
  }

  .subtitle {
    color: #059669;
    font-size: 18px;
    margin: 0;
    font-weight: 500;
  }

  .add-btn {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 16px 32px;
    font-size: 16px;
    font-weight: 600;
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    border-radius: 16px;
    text-decoration: none;
    box-shadow: 0 12px 30px rgba(16, 185, 129, 0.4);
    transition: all 0.3s ease;
  }

  .add-btn:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 40px rgba(16, 185, 129, 0.5);
  }

  .table-container {
    overflow-x: auto;
    border-radius: 20px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  }

  .category-table {
    width: 100%;
    border-collapse: collapse;
    background: white;
  }

  .category-table th {
    background: linear-gradient(135deg, #f0fdf4, #dcfce7);
    color: #065f46;
    font-weight: 700;
    padding: 20px 24px;
    text-align: left;
    font-size: 15px;
    border-bottom: 3px solid #86efac;
  }

  .category-table td {
    padding: 20px 24px;
    border-bottom: 1px solid #e5e7eb;
    vertical-align: middle;
  }

  .category-table tr:hover {
    background: #f0fdf4;
  }

  .action-buttons {
    display: flex;
    gap: 12px;
    justify-content: center;
  }

  .btn-edit,
  .btn-delete {
    width: 44px;
    height: 44px;
    border: none;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    background: transparent;
    text-decoration: none;
  }

  .btn-edit {
    background: #dcfce7;
    color: #065f46;
  }

  .btn-edit:hover {
    background: #86efac;
    transform: translateY(-2px);
  }

  .btn-delete {
    background: #fee2e2;
    color: #dc2626;
  }

  .btn-delete:hover {
    background: #fecaca;
    transform: translateY(-2px);
  }

  .empty-state {
    text-align: center;
    padding: 80px 20px;
    color: #6b7280;
  }

  .empty-icon {
    font-size: 64px;
    margin-bottom: 20px;
  }

  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.3s ease;
  }

  .modal-content {
    background: white;
    border-radius: 24px;
    width: 90%;
    max-width: 480px;
    padding: 40px;
    box-shadow: 0 40px 80px rgba(0, 0, 0, 0.25);
    animation: modalSlideUp 0.4s ease;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .modal-header {
    text-align: center;
    margin-bottom: 32px;
  }

  .modal-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
  }

  .modal-icon.danger {
    background: linear-gradient(135deg, #fef2f2, #fee2e2);
    color: #dc2626;
  }

  .modal-title {
    font-size: 28px;
    font-weight: 700;
    color: #111827;
    margin: 0 0 12px 0;
  }

  .modal-description {
    color: #6b7280;
    font-size: 16px;
    line-height: 1.6;
    margin: 0;
  }

  .modal-actions {
    display: flex;
    gap: 16px;
    justify-content: flex-end;
    margin-top: 32px;
  }

  .btn-cancel {
    padding: 14px 28px;
    border: 2px solid #e5e7eb;
    background: white;
    color: #374151;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-cancel:hover:not(:disabled) {
    background: #f9fafb;
    border-color: #d1d5db;
  }

  .btn-cancel:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-delete-modal {
    padding: 14px 28px;
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
  }

  .btn-delete-modal:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
  }

  .btn-delete-modal:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .spinner {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes modalSlideUp {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Toast styles */
  .toast {
    position: fixed;
    top: 24px;
    right: 24px;
    z-index: 9999;
    animation: slideIn 0.4s ease-out;
  }

  .toast-content {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 24px;
    border-radius: 16px;
    background: white;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    color: #333;
  }

  .toast.success .toast-content {
    background: #ecfdf5;
    color: #065f46;
  }

  .toast.error .toast-content {
    background: #fef2f2;
    color: #991b1b;
  }

  .toast-progress {
    height: 4px;
    background: currentColor;
    opacity: 0.3;
    border-radius: 2px;
    margin-top: 8px;
    animation: progress 4s linear forwards;
  }

  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to   { transform: translateX(0); opacity: 1; }
  }

  @keyframes progress {
    from { width: 100%; }
    to   { width: 0%; }
  }
</style>