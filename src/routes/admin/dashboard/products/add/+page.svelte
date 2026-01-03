<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData } from '$app/forms'; 

  let form: ActionData = $props();

  let previewUrl = $state<string | null>(null);
  let fileInput: HTMLInputElement;

  function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      previewUrl = URL.createObjectURL(input.files[0]);
    }
  }

  function triggerFileInput() {
    fileInput?.click();
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      triggerFileInput();
    }
  }

  function hasError(field: string): boolean {
    return !!(form as any)?.errors?.[field];
  }

  function getErrorMessage(field: string): string {
    return (form as any)?.errors?.[field]?.[0] ?? '';
  }

  import { onDestroy } from 'svelte';
  onDestroy(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  });
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
</svelte:head>

<div class="form-container">
  <div class="form-card">
    <h1 class="form-title">Add New Product</h1>
    <p class="form-subtitle">Fill in the details below to create a new product</p>

    {#if (form as any)?.success}
      <div class="success-message">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
        {(form as any).message || 'Product created successfully!'}
      </div>
    {/if}

    <div class="form-layout">
      <!-- KIRI: Preview Gambar -->
      <div class="preview-section">
        <button
          type="button"
          class="preview-button"
          onclick={triggerFileInput}
          onkeydown={handleKeyDown}
          aria-label="Upload or change product image"
        >
          {#if previewUrl}
            <img src={previewUrl} alt="Product preview" class="preview-image" />
          {:else}
            <div class="placeholder-preview">
              <svg width="100" height="100" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="120" height="120" rx="16" fill="#f3f4f6"/>
                <text x="60" y="75" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-size="14" font-weight="500">No Image</text>
              </svg>
              <p class="upload-hint">Click to upload image</p>
            </div>
          {/if}
        </button>

        <button type="button" class="change-image-btn" onclick={triggerFileInput}>
          {previewUrl ? 'Change Image' : 'Upload Image'}
        </button>
      </div>

      <!-- KANAN: Form Fields -->
      <div class="fields-section">
        <form method="post" use:enhance enctype="multipart/form-data" class="product-form">
          <input
            bind:this={fileInput}
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onchange={handleFileChange}
            class="hidden-input"
          />

          {#if hasError('image')}
            <span class="error-message">{getErrorMessage('image')}</span>
          {/if}

          <div class="field-group">
            <label for="name">Product Name</label>
            <input id="name" name="name" type="text" placeholder="Enter product name" class:error={hasError('name')} required />
            {#if hasError('name')}<span class="error-message">{getErrorMessage('name')}</span>{/if}
          </div>

          <div class="field-group">
            <label for="price">Price (SGD)</label>
            <input id="price" name="price" type="number" min="0" step="0.01" placeholder="0.00" class:error={hasError('price')} required />
            {#if hasError('price')}<span class="error-message">{getErrorMessage('price')}</span>{/if}
          </div>

          <div class="field-group">
            <label for="type">Type</label>
            <input id="type" name="type" type="text" placeholder="e.g. food, drink, snack" class:error={hasError('type')} required />
            {#if hasError('type')}<span class="error-message">{getErrorMessage('type')}</span>{/if}
          </div>

          <button type="submit" class="submit-btn">Submit Product</button>
        </form>
      </div>
    </div>
  </div>
</div>

<style>
  :global(body) { margin: 0; font-family: 'Poppins', sans-serif; background: #f7fafc; }

  .form-container { min-height: 100vh; background: linear-gradient(135deg, #f0fdf4 0%, #f7fafc 100%); display: flex; align-items: center; justify-content: center; padding: 24px; }

  .form-card { background: white; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.1); border: 1px solid #e6f4ea; width: 100%; max-width: 1100px; padding: 48px 40px; }

  .form-title { font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 800; color: #166534; margin: 0 0 8px 0; text-align: center; }
  .form-subtitle { color: #4b5563; text-align: center; margin-bottom: 40px; font-size: 1.05rem; }

  .success-message { display: flex; align-items: center; gap: 8px; background: #dcfce7; color: #166534; padding: 12px 16px; border-radius: 12px; border: 1px solid #bbf7d0; margin-bottom: 32px; font-weight: 500; }

  /* Layout Side-by-Side */
  .form-layout { display: grid; grid-template-columns: 1fr 1.2fr; gap: 48px; align-items: start; }

  .preview-section { display: flex; flex-direction: column; align-items: center; gap: 20px; }

  .preview-button {
    all: unset; cursor: pointer; width: 100%; max-width: 380px; aspect-ratio: 1/1; background: #f7fafc; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.08); border: 2px dashed #d1fae5; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center;
  }
  .preview-button:hover, .preview-button:focus-visible { border-color: #22c55e; box-shadow: 0 0 0 4px rgba(34,197,94,0.2); }

  .preview-image { width: 100%; height: 100%; object-fit: cover; }

  .placeholder-preview { display: flex; flex-direction: column; align-items: center; gap: 20px; color: #9ca3af; text-align: center; padding: 30px; }
  .upload-hint { font-size: 1.1rem; font-weight: 500; margin: 0; }

  .change-image-btn { padding: 14px 24px; background: #f8fafc; color: #166534; border: 2px solid #d1fae5; border-radius: 14px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; width: 100%; max-width: 380px; }
  .change-image-btn:hover { background: #ecfdf5; border-color: #86efac; }

  .fields-section { display: flex; flex-direction: column; gap: 24px; }

  .product-form { display: flex; flex-direction: column; gap: 24px; width: 100%; }

  .field-group { display: flex; flex-direction: column; gap: 8px; }
  .field-group label { font-weight: 600; color: #166534; font-size: 0.95rem; }
  .field-group input { padding: 16px 18px; border: 2px solid #d1fae5; border-radius: 14px; font-size: 1rem; background: #fafbff; transition: all 0.3s ease; }
  .field-group input:focus { outline: none; border-color: #22c55e; box-shadow: 0 0 0 4px rgba(34,197,94,0.15); }
  .field-group input.error { border-color: #ef4444; background: #fef2f2; }

  .submit-btn { padding: 18px 24px; background: linear-gradient(135deg, #86efac 0%, #22c55e 100%); color: white; font-size: 1.1rem; font-weight: 700; border: none; border-radius: 14px; cursor: pointer; box-shadow: 0 8px 24px rgba(34,197,94,0.3); transition: all 0.3s ease; }
  .submit-btn:hover { background: linear-gradient(135deg, #4ade80 0%, #16a34a 100%); transform: translateY(-2px); box-shadow: 0 16px 40px rgba(34,197,94,0.4); }

  .error-message { color: #dc2626; font-size: 0.875rem; margin-top: 4px; font-weight: 500; }

  .hidden-input { display: none; }

  .debug { margin-top: 40px; background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; font-size: 0.8rem; }
  .debug summary { cursor: pointer; font-weight: 600; color: #475569; }

  /* RESPONSIVE: Stack vertically di mobile */
  @media (max-width: 900px) {
    .form-layout { grid-template-columns: 1fr; gap: 40px; }
    .preview-section { order: -1; } /* Preview di atas di mobile */
    .preview-button { max-width: 320px; }
    .change-image-btn { max-width: 320px; }
    .form-card { padding: 40px 24px; }
  }

  @media (max-width: 480px) {
    .preview-button { max-width: 280px; }
    .change-image-btn { max-width: 280px; }
  }
</style>