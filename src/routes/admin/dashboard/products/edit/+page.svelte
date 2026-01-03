<script lang="ts">
  import type { PageProps } from './$types';
  let { data, form }: PageProps = $props();

  const errors = form?.errors || {};
</script>

<svelte:head>
  <title>Edit Product | Admin</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="edit-container">
  <header class="edit-header">
    <h1 class="edit-title">Edit Product</h1>
    <p class="edit-subtitle">Update product details below</p>
  </header>

  <div class="edit-card">
    <div class="edit-layout">
      <!-- Kolom Kiri: Preview Gambar -->
      <div class="image-section">
        <h3 class="section-title">Product Image</h3>
        <div class="image-preview">
          {#if data.product.imageUrl}
            <img src={data.product.imageUrl} alt={data.product.name} loading="lazy" />
          {:else}
            <div class="placeholder-image">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="120" height="120" rx="12" fill="#f3f4f6"/>
                <text x="60" y="70" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-size="14" font-weight="500">
                  No Image
                </text>
              </svg>
            </div>
          {/if}
        </div>
        <p class="image-hint">Upload a new image to replace the current one</p>
      </div>

      <!-- Kolom Kanan: Form Edit -->
      <div class="form-section">
        <h3 class="section-title">Product Details</h3>
        <form method="post" enctype="multipart/form-data" class="edit-form">
          <div class="form-group">
            <label for="name">Product Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={data.product.name ?? ''}
              class="form-input"
              placeholder="Enter product name"
              required
            />
            {#if errors.name}<span class="error-text">{errors.name}</span>{/if}
          </div>

          <div class="form-group">
            <label for="type">Type</label>
            <input
              id="type"
              name="type"
              type="text"
              value={data.product.type ?? ''}
              class="form-input"
              placeholder="e.g. Electronics, Clothing"
              required
            />
            {#if errors.type}<span class="error-text">{errors.type}</span>{/if}
          </div>

          <div class="form-group">
            <label for="price">Price (SGD)</label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={data.product.price ?? ''}
              class="form-input"
              placeholder="0.00"
              required
            />
            {#if errors.price}<span class="error-text">{errors.price}</span>{/if}
          </div>

          <div class="form-group">
            <label for="image">Change Image</label>
            <input id="image" name="image" type="file" accept="image/*" class="file-input" />
            <p class="input-hint">Leave empty to keep current image</p>
          </div>

          <div class="form-actions">
            <a href="/admin/dashboard/products" class="btn-cancel">Cancel</a>
            <button type="submit" class="btn-save">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  {#if form}
    <pre class="debug">{JSON.stringify(form, null, 2)}</pre>
  {/if}
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: 'Poppins', sans-serif;
    background: #f7fafc;
  }

  .edit-container {
    background: linear-gradient(135deg, #f0fdf4 0%, #f7fafc 100%);
    min-height: 100vh;
    padding: 40px 20px;
  }

  .edit-header {
    text-align: center;
    margin-bottom: 48px;
  }

  .edit-title {
    font-size: clamp(2rem, 5vw, 2.5rem);
    font-weight: 800;
    color: #166534;
    margin: 0 0 12px 0;
  }

  .edit-subtitle {
    font-size: 1.125rem;
    color: #4b5563;
    max-width: 600px;
    margin: 0 auto;
  }

  .edit-card {
    max-width: 1100px;
    margin: 0 auto;
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
    border: 1px solid #e6f4ea;
  }

  .edit-layout {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    min-height: 600px;
  }

  .image-section {
    background: #f7fafc;
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-right: 1px solid #e6f4ea;
  }

  .section-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #166534;
    margin-bottom: 24px;
    text-align: center;
  }

  .image-preview {
    width: 100%;
    max-width: 380px;
    height: 420px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  }

  .image-preview img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 12px;
  }

  .placeholder-image {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .image-hint {
    margin-top: 20px;
    color: #6b7280;
    font-size: 0.95rem;
    text-align: center;
  }

  .form-section {
    padding: 40px;
    display: flex;
    flex-direction: column;
  }

  .edit-form {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .form-group {
    margin-bottom: 24px;
  }

  .form-group label {
    display: block;
    font-weight: 600;
    color: #166534;
    margin-bottom: 8px;
  }

  .form-input {
    width: 100%;
    padding: 14px 16px;
    border: 1px solid #d1fae5;
    border-radius: 12px;
    font-size: 1rem;
    background: #f8fffb;
    transition: all 0.3s ease;
  }

  .form-input:focus {
    outline: none;
    border-color: #86efac;
    box-shadow: 0 0 0 3px rgba(34,197,94,0.2);
  }

  .file-input {
    width: 100%;
    padding: 12px;
    border: 2px dashed #86efac;
    border-radius: 12px;
    background: #f0fdfa;
    cursor: pointer;
  }

  .input-hint {
    font-size: 0.875rem;
    color: #6b7280;
    margin-top: 8px;
  }

  .error-text {
    display: block;
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 6px;
  }

  .form-actions {
    display: flex;
    gap: 16px;
    margin-top: auto;
  }

  .form-actions a,
  .form-actions button {
    flex: 1;
    padding: 14px;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.3s ease;
    text-decoration: none;
  }

  .btn-cancel {
    background: #f3f4f6;
    color: #4b5563;
  }

  .btn-cancel:hover {
    background: #e5e7eb;
  }

  .btn-save {
    background: linear-gradient(135deg, #86efac 0%, #22c55e 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(34,197,94,0.3);
  }

  .btn-save:hover {
    background: linear-gradient(135deg, #75e09a 0%, #1ea54c 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(34,197,94,0.4);
  }

  .debug {
    max-width: 1100px;
    margin: 40px auto;
    background: #1e293b;
    color: #f0fdf4;
    padding: 20px;
    border-radius: 12px;
  }

  /* Responsive */
  @media (max-width: 992px) {
    .edit-layout {
      grid-template-columns: 1fr;
    }
    .image-section {
      border-right: none;
      border-bottom: 1px solid #e6f4ea;
      padding: 32px;
    }
    .image-preview {
      height: 360px;
    }
  }

  @media (max-width: 576px) {
    .form-section,
    .image-section {
      padding: 24px;
    }
    .form-actions {
      flex-direction: column;
    }
  }
</style>