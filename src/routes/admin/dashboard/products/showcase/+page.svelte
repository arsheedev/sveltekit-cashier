<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import { invalidateAll, goto } from '$app/navigation';

  let { data, form }: { 
    data: { stuff: any[] }, 
    form: { success?: boolean, message?: string } 
  } = $props();
  
  const products = data.stuff;
  
  let currentPage = $state(1);
  const itemsPerPage = 12;

  // Modal state
  let showDeleteModal = $state(false);
  let productToDelete = $state<{id: number, name: string} | null>(null);
  let isDeleting = $state(false);

  // Toast state
  let toastMessage = $state<string | null>(null);
  let toastType = $state<'success' | 'error' | null>(null);

  let totalPages = $derived(Math.ceil(products.length / itemsPerPage));
  let paginatedProducts = $derived(
    products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  );

  // Fungsi untuk format price dari cents ke SGD
  function formatPrice(cents: number): string {
    return (cents / 100).toFixed(2);
  }

  // Handle form success/error messages
  $effect(() => {
    if ($page.url.searchParams.get('success')) {
      showToast($page.url.searchParams.get('success') || 'Product deleted successfully', 'success');
      
      setTimeout(() => {
        goto('/admin/dashboard/products/showcase', { 
          invalidateAll: true,
          replaceState: true,
          noScroll: true 
        });
      }, 1500);
    }
    
    if (form?.success && form.message) {
      showToast(form.message, 'success');
    } else if (form?.message && !form.success) {
      showToast(form.message, 'error');
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

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function openDeleteModal(product: {id: number, name: string}) {
    productToDelete = product;
    showDeleteModal = true;
  }

  function closeDeleteModal() {
    if (!isDeleting) {
      showDeleteModal = false;
      productToDelete = null;
    }
  }

  async function handleManualDelete() {
    if (!productToDelete) return;
    
    isDeleting = true;
    
    try {
      const formData = new FormData();
      formData.append('id', productToDelete.id.toString());
      formData.append('action', 'delete');
      
      const response = await fetch('?/delete', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        showToast('Product deleted successfully', 'success');
        
        setTimeout(() => {
          location.reload();
        }, 1500);
        
      } else {
        const result = await response.json();
        showToast(result.message || 'Failed to delete product', 'error');
      }
      
    } catch (error) {
      console.error('Delete error:', error);
      showToast('Network error occurred', 'error');
    } finally {
      isDeleting = false;
      showDeleteModal = false;
      productToDelete = null;
    }
  }
</script>

<svelte:head>
  <title>Product Showcase | Admin</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
</svelte:head>

<div class="showcase-container">
  <header class="showcase-header">
    <h1 class="showcase-title">Product Showcase</h1>
    <p class="showcase-subtitle">Manage all your products easily and quickly</p>
  </header>

  {#if paginatedProducts.length === 0}
    <div class="empty-state">
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="60" fill="#f0fdf4"/>
        <path d="M60 35L80 60H40L60 35Z" fill="#10b981"/>
        <path d="M50 85H70V105H50V85Z" fill="#10b981"/>
      </svg>
      <h3>No Products Yet</h3>
      <p>Create your first product to get started!</p>
      <a href="/admin/dashboard/products/add" class="btn-primary" style="margin-top: 24px;">
        Add Your First Product
      </a>
    </div>
  {:else}
    <div class="stats-bar">
      <span class="stats-text">
        Showing {((currentPage - 1) * itemsPerPage) + 1} -
        {Math.min(currentPage * itemsPerPage, products.length)} of
        {products.length} products
      </span>
    </div>

    <div class="product-grid">
      {#each paginatedProducts as product (product.id)}
        <div class="product-card">
          <div class="image-container">
            {#if product.imageUrl}
              <img src={product.imageUrl} alt={product.name} loading="lazy" />
            {:else}
              <div class="placeholder-image">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="120" height="120" rx="12" fill="#f0fdf4"/>
                  <text x="60" y="70" dominant-baseline="middle" text-anchor="middle" fill="#059669" font-size="14" font-weight="500">No Image</text>
                </svg>
              </div>
            {/if}
          </div>

          <div class="card-content">
            <h3 class="product-name">{product.name}</h3>
            <div class="product-type">
              <span class="type-badge">{product.type}</span>
            </div>
            <!-- HARGA YANG SUDAH DIKONVERSI DARI CENTS KE SGD -->
            <p class="product-price">S$ {formatPrice(product.price)}</p>
          </div>

          <div class="card-actions">
            <a href={`/admin/dashboard/products/edit?id=${product.id}`} class="btn-edit">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Edit
            </a>
            
            <button 
              class="btn-delete" 
              onclick={() => openDeleteModal({id: product.id, name: product.name})}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
              Delete
            </button>
          </div>
        </div>
      {/each}
    </div>

    {#if totalPages > 1}
      <div class="pagination">
        <button onclick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} class="page-btn {currentPage === 1 ? 'btn-disabled' : ''}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          Previous
        </button>

        {#each Array(Math.min(7, totalPages)) as _, i (i)}
          <button onclick={() => goToPage(i + 1)} class="page-btn {currentPage === i + 1 ? 'active' : ''}">
            {i + 1}
          </button>
        {/each}

        {#if totalPages > 7}
          <span class="page-ellipsis">...</span>
          <button onclick={() => goToPage(totalPages)} class="page-btn {currentPage === totalPages ? 'active' : ''}">
            {totalPages}
          </button>
        {/if}

        <button onclick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} class="page-btn {currentPage === totalPages ? 'btn-disabled' : ''}">
          Next
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>
    {/if}
  {/if}
</div>

<!-- Delete Confirmation Modal -->
{#if showDeleteModal}
  <div class="modal-overlay" onclick={closeDeleteModal}>
    <div class="modal-content" onclick={(e) => e.stopPropagation()}>
      <div class="modal-header">
        <div class="modal-icon danger">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h2 class="modal-title">Delete Product</h2>
        <p class="modal-description">
          Are you sure you want to delete "<strong>{productToDelete?.name}</strong>"? This action cannot be undone.
        </p>
      </div>
      
      <div class="modal-actions">
        <button
          class="btn-cancel"
          onclick={closeDeleteModal}
          disabled={isDeleting}
        >
          Cancel
        </button>
        <button
          class="btn-delete-modal"
          onclick={handleManualDelete}  
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

<!-- Toast Notification -->
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
    font-family: 'Inter', system-ui, -apple-system, sans-serif; 
    background: linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%);
    min-height: 100vh;
  }

  .showcase-container {
    padding: 40px 20px;
    min-height: 100vh;
  }

  .showcase-header { 
    text-align: center; 
    margin-bottom: 48px; 
  }
  
  .showcase-title { 
    font-size: 40px;
    font-weight: 800; 
    color: #065f46; 
    margin: 0 0 12px 0; 
  }
  
  .showcase-subtitle { 
    font-size: 18px; 
    color: #059669; 
    max-width: 600px; 
    margin: 0 auto; 
    font-weight: 500;
  }

  .stats-bar { 
    max-width: 1400px; 
    margin: 0 auto 32px; 
    padding: 0 20px; 
  }
  
  .stats-text { 
    color: #065f46; 
    font-weight: 500; 
    font-size: 16px;
  }

  .product-grid { 
    display: grid; 
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
    gap: 28px; 
    max-width: 1400px; 
    margin: 0 auto; 
  }

  .product-card { 
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 24px; 
    overflow: hidden; 
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); 
    border: 1px solid rgba(255, 255, 255, 0.3); 
    display: flex; 
    flex-direction: column; 
    transition: all 0.4s ease; 
  }
  
  .product-card:hover { 
    box-shadow: 0 30px 60px rgba(16, 185, 129, 0.2); 
    border-color: #86efac; 
    transform: translateY(-8px);
  }

  .image-container { 
    height: 280px; 
    padding: 24px; 
    background: #f0fdf4; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
  }
  
  .image-container img { 
    width: 100%; 
    height: 100%; 
    object-fit: contain; 
    border-radius: 16px; 
    box-shadow: 0 4px 12px rgba(0,0,0,0.08); 
    background: white; 
  }

  .placeholder-image { 
    width: 100%; 
    height: 100%; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
  }

  .card-content { 
    padding: 24px; 
    flex-grow: 1; 
    display: flex; 
    flex-direction: column; 
  }
  
  .product-name { 
    font-size: 20px; 
    font-weight: 700; 
    color: #065f46; 
    margin: 0 0 12px 0; 
  }
  
  .type-badge { 
    background: #dcfce7; 
    color: #065f46; 
    padding: 6px 14px; 
    border-radius: 999px; 
    font-size: 14px; 
    font-weight: 600; 
    display: inline-block;
  }
  
  .product-price { 
    font-size: 28px; 
    font-weight: 800; 
    color: #10b981; 
    margin-top: auto; 
    margin-bottom: 0;
  }

  .card-actions { 
    padding: 0 24px 24px; 
    display: flex; 
    gap: 12px; 
  }
  
  .card-actions a, .card-actions button { 
    flex: 1; 
    padding: 12px; 
    border: none; 
    border-radius: 16px; 
    font-weight: 600; 
    cursor: pointer; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    gap: 8px; 
    transition: all 0.3s ease; 
    text-decoration: none;
    font-size: 15px;
  }

  .btn-edit { 
    background: linear-gradient(135deg, #86efac, #22c55e); 
    color: white; 
    box-shadow: 0 8px 20px rgba(34,197,94,0.3); 
  }
  
  .btn-edit:hover { 
    background: linear-gradient(135deg, #75e09a, #1ea54c); 
    transform: translateY(-4px); 
    box-shadow: 0 12px 24px rgba(34,197,94,0.4); 
  }

  .btn-delete { 
    background: linear-gradient(135deg, #fca5a5, #ef4444); 
    color: white; 
    box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3); 
  }
  
  .btn-delete:hover { 
    background: linear-gradient(135deg, #f87171, #dc2626); 
    transform: translateY(-4px); 
    box-shadow: 0 12px 24px rgba(239, 68, 68, 0.4); 
  }

  .empty-state { 
    text-align: center; 
    padding: 80px 20px; 
    max-width: 500px; 
    margin: 0 auto; 
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
  
  .empty-state h3 { 
    color: #065f46; 
    font-size: 24px; 
    margin: 24px 0 8px; 
  }
  
  .empty-state p { 
    color: #059669; 
    font-size: 16px;
  }
  
  .btn-primary {
    display: inline-block;
    padding: 14px 28px;
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    font-weight: 600;
    border-radius: 16px;
    text-decoration: none;
    box-shadow: 0 12px 24px rgba(16, 185, 129, 0.3);
    transition: all 0.3s ease;
  }
  
  .btn-primary:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 36px rgba(16, 185, 129, 0.4);
  }

  .pagination { 
    display: flex; 
    justify-content: center; 
    align-items: center; 
    gap: 8px; 
    margin: 60px auto 40px; 
    flex-wrap: wrap; 
  }
  
  .page-btn { 
    padding: 12px 18px; 
    border: 2px solid #d1fae5; 
    background: rgba(255, 255, 255, 0.95); 
    color: #065f46; 
    border-radius: 16px; 
    font-weight: 600; 
    cursor: pointer; 
    display: flex; 
    align-items: center; 
    gap: 6px; 
    transition: all 0.3s ease; 
    font-size: 15px;
  }
  
  .page-btn:hover:not(:disabled):not(.active) { 
    background: #f0fdf4; 
    border-color: #86efac; 
    transform: translateY(-2px);
  }
  
  .page-btn.active { 
    background: linear-gradient(135deg, #10b981, #059669); 
    color: white; 
    border: none; 
    box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4); 
  }
  
  .page-btn.btn-disabled { 
    opacity: 0.5; 
    cursor: not-allowed; 
  }
  
  .page-ellipsis { 
    padding: 0 8px; 
    color: #059669; 
    font-weight: 500; 
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
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes progress {
    from { width: 100%; }
    to { width: 0%; }
  }

  @media (max-width: 768px) {
    .product-grid { 
      grid-template-columns: 1fr; 
      gap: 20px; 
    }
    
    .image-container { 
      height: 240px; 
      padding: 20px; 
    }
    
    .card-content, .card-actions { 
      padding: 20px; 
    }
    
    .pagination { 
      gap: 6px; 
      margin-top: 40px; 
    }
    
    .showcase-title {
      font-size: 32px;
    }
    
    .product-price {
      font-size: 24px;
    }
  }

  @media (max-width: 480px) {
    .showcase-container {
      padding: 24px 16px;
    }
    
    .modal-content {
      padding: 24px;
      width: 95%;
    }
    
    .modal-actions {
      flex-direction: column;
    }
    
    .btn-cancel, .btn-delete-modal {
      width: 100%;
    }
    
    .toast {
      top: 16px;
      right: 16px;
      left: 16px;
    }
    
    .toast-content {
      padding: 12px 16px;
    }
  }
</style>