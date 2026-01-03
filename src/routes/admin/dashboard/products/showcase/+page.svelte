<script lang="ts">
  import type { PageProps } from '../$types';

  let { data }: PageProps = $props();
  const products = data.stuff;

  let currentPage = $state(1);
  const itemsPerPage = 12;

  let totalPages = $derived(Math.ceil(products.length / itemsPerPage));
  let paginatedProducts = $derived(
    products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  );

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function editProduct(id: number) {
    window.location.href = `/admin/dashboard/products/edit?id=${id}`;
  }

  function deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      alert(`Delete product ID: ${id}`);
    }
  }
</script>

<svelte:head>
  <title>Product Showcase | Admin</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
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
        <path d="M60 35L80 60H40L60 35Z" fill="#22c55e"/>
        <path d="M50 85H70V105H50V85Z" fill="#22c55e"/>
      </svg>
      <h3>No Products Yet</h3>
      <p>Create your first product to get started!</p>
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
                  <rect width="120" height="120" rx="12" fill="#f3f4f6"/>
                  <text x="60" y="70" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-size="14" font-weight="500">No Image</text>
                </svg>
              </div>
            {/if}
          </div>

          <div class="card-content">
            <h3 class="product-name">{product.name}</h3>
            <div class="product-type">
              <span class="type-badge">{product.type}</span>
            </div>
            <p class="product-price">SGD {product.price.toFixed(2)}</p>
          </div>

          <div class="card-actions">
            <a href={`/admin/dashboard/products/edit?id=${product.id}`} class="btn-edit">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Edit
            </a>
            <button class="btn-delete" onclick={() => deleteProduct(product.id)}>
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
        <button onclick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} class="page-btn" class:btn-disabled={currentPage === 1}>
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

        <button onclick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} class="page-btn" class:btn-disabled={currentPage === totalPages}>
          Next
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>
    {/if}
  {/if}
</div>

<style>
  :global(body) { margin: 0; font-family: 'Poppins', sans-serif; background: #f7fafc; }

  .showcase-container {
    background: linear-gradient(135deg, #f0fdf4 0%, #f7fafc 100%);
    padding: 40px 20px;
  }

  .showcase-header { text-align: center; margin-bottom: 48px; }
  .showcase-title { font-size: clamp(2rem, 5vw, 2.5rem); font-weight: 800; color: #166534; margin: 0 0 12px 0; }
  .showcase-subtitle { font-size: 1.125rem; color: #4b5563; max-width: 600px; margin: 0 auto; }

  .stats-bar { max-width: 1400px; margin: 0 auto 32px; padding: 0 20px; }
  .stats-text { color: #6b7280; font-weight: 500; }

  .product-grid { 
    display: grid; 
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
    gap: 28px; 
    max-width: 1400px; 
    margin: 0 auto; 
  }

  .product-card { 
    background: white; 
    border-radius: 20px; 
    overflow: hidden; 
    box-shadow: 0 4px 24px rgba(0,0,0,0.06); 
    border: 1px solid #e6f4ea; 
    display: flex; 
    flex-direction: column; 
    transition: all 0.4s ease; 
  }
  .product-card:hover { box-shadow: 0 20px 40px rgba(34,197,94,0.15); border-color: #86efac; }

  .image-container { height: 300px; padding: 20px; background: #f7fafc; display: flex; align-items: center; justify-content: center; }
  .image-container img { width: 100%; height: 100%; object-fit: contain; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); background: white; }

  .placeholder-image { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }

  .card-content { padding: 24px; flex-grow: 1; display: flex; flex-direction: column; }
  .product-name { font-size: 1.375rem; font-weight: 700; color: #166534; margin: 0 0 8px 0; }
  .type-badge { background: #dcfce7; color: #166534; padding: 6px 14px; border-radius: 999px; font-size: 0.875rem; font-weight: 600; text-transform: capitalize; }
  .product-price { font-size: 1.75rem; font-weight: 800; color: #16a34a; margin-top: auto; }

  .card-actions { padding: 0 24px 24px; display: flex; gap: 12px; }
  /* Update styling untuk link edit */
  .card-actions a, .card-actions button { 
    flex: 1; 
    padding: 12px; 
    border: none; 
    border-radius: 12px; 
    font-weight: 600; 
    cursor: pointer; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    gap: 8px; 
    transition: all 0.3s ease; 
    text-decoration: none;
  }

  .btn-edit { 
    background: linear-gradient(135deg, #86efac 0%, #22c55e 100%); 
    color: white; 
    box-shadow: 0 4px 12px rgba(34,197,94,0.3); 
  }
  .btn-edit:hover { 
    background: linear-gradient(135deg, #75e09a 0%, #1ea54c 100%); 
    transform: translateY(-2px); 
    box-shadow: 0 8px 20px rgba(34,197,94,0.4); 
  }

  .btn-delete { 
    background: linear-gradient(135deg, #fca5a5 0%, #ef4444 100%); 
    color: white; 
  }
  .btn-delete:hover { 
    background: linear-gradient(135deg, #f87171 0%, #dc2626 100%); 
  }

  .empty-state { text-align: center; padding: 80px 20px; max-width: 500px; margin: 0 auto; }
  .empty-state h3 { color: #166534; font-size: 1.8rem; margin: 24px 0 8px; }
  .empty-state p { color: #6b7280; }

  .pagination { display: flex; justify-content: center; align-items: center; gap: 8px; margin: 60px auto 40px; flex-wrap: wrap; }
  .page-btn { padding: 10px 16px; border: 1px solid #d1fae5; background: white; color: #166534; border-radius: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.3s ease; }
  .page-btn:hover:not(:disabled) { background: #ecfdf5; border-color: #86efac; }
  .page-btn.active { background: linear-gradient(135deg, #86efac 0%, #22c55e 100%); color: white; border: none; }
  .page-btn.btn-disabled { opacity: 0.5; cursor: not-allowed; }
  .page-ellipsis { padding: 0 8px; color: #9ca3af; font-weight: 500; }

  @media (max-width: 768px) {
    .product-grid { grid-template-columns: 1fr; gap: 20px; }
    .image-container { height: 260px; padding: 16px; }
    .card-content, .card-actions { padding: 20px; }
    .pagination { gap: 6px; margin-top: 40px; }
  }
</style>