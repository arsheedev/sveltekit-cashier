<!-- src/routes/admin/dashboard/stuff/add/+page.svelte -->
<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageProps } from './$types';

  const { form, data }: PageProps = $props();

  let previewUrl = $state<string | null>(null);
  let fileInput: HTMLInputElement;
  let loading = $state(false);

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
  <title>Add New Stuff | Admin</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
</svelte:head>

<div class="form-container">
  <div class="form-card">
    <h1 class="form-title">Add New Stuff</h1>
    <p class="form-subtitle">Fill in the details below to create a new item</p>

    {#if (form as any)?.success}
      <div class="success-message">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
        {(form as any).message || 'Stuff created successfully!'}
      </div>
    {:else if (form as any)?.message}
      <div class="error-message-box">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#dc2626">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        {(form as any).message || 'Failed to create stuff'}
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
                <rect width="120" height="120" rx="16" fill="#f0fdf4"/>
                <path d="M30 45L45 30L75 60L90 45V90H30V45Z" fill="#d1fae5" stroke="#86efac" stroke-width="2"/>
                <circle cx="45" cy="45" r="8" fill="#10b981"/>
                <text x="60" y="105" dominant-baseline="middle" text-anchor="middle" fill="#059669" font-size="12" font-weight="500">Upload Image</text>
              </svg>
              <p class="upload-hint">Click to upload image (optional)</p>
            </div>
          {/if}
        </button>

        <button type="button" class="change-image-btn" onclick={triggerFileInput}>
          {previewUrl ? 'Change Image' : 'Upload Image'}
        </button>
      </div>

      <!-- KANAN: Form Fields -->
      <div class="fields-section">
        <form 
          method="post" 
          use:enhance={() => {
            loading = true;
            return ({ update }) => {
              loading = false;
              update();
            };
          }}
          enctype="multipart/form-data" 
          class="product-form"
        >
          <input
            bind:this={fileInput}
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onchange={handleFileChange}
            class="hidden-input"
          />

          <div class="field-group">
            <label for="name">Stuff Name <span class="required">*</span></label>
            <input 
              id="name" 
              name="name" 
              type="text" 
              placeholder="e.g. MacBook Pro M2" 
              class:error={hasError('name')} 
              required 
            />
            {#if hasError('name')}
              <span class="error-message">{getErrorMessage('name')}</span>
            {/if}
          </div>

         <div class="field-group">
  <label for="type">Category <span class="required">*</span></label>
  <div class="select-wrapper">
    <select 
      id="type" 
      name="type" 
      class:error={hasError('type')} 
      required
    >
      <option value="" disabled selected>Select category</option>
      {#each data.categories as category}
        <!-- Kirim nama kategori sebagai value -->
        <option value={category.name}>{category.name}</option>
      {/each}
    </select>
    <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </div>
  {#if hasError('type')}
    <span class="error-message">{getErrorMessage('type')}</span>
  {/if}
</div>

          <div class="field-group">
             <label for="price">
              Price <span class="required">*</span>
              <span class="input-note">(Enter cents, e.g., 120 for 120 cents = S$ 1.20)</span>
            </label>
            <div class="input-with-prefix">
              <span class="prefix">S$</span>
              <input 
                id="price" 
                name="price" 
                type="number" 
                min="0" 
                step="0.01" 
                placeholder="e.g. 1500.00" 
                class:error={hasError('price')} 
                required 
              />
            </div>
            {#if hasError('price')}
              <span class="error-message">{getErrorMessage('price')}</span>
            {/if}
          </div>

          <button type="submit" class="submit-btn" disabled={loading}>
            {#if loading}
              <span class="spinner"></span>
              Saving...
            {:else}
              Submit Stuff
            {/if}
          </button>
        </form>
      </div>
    </div>
  </div>
</div>

<style>
  :global(body) { 
    margin: 0; 
    padding: 0;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    background: linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%);
    min-height: 100vh;
  }

  .prefix {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: #059669;
    font-weight: 600;
    font-size: 16px;
}

  .input-with-prefix input {
      padding-left: 45px;
  }

  .form-container { 
    min-height: 100vh; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    padding: 24px; 
  }

  .form-card { 
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 24px; 
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2); 
    border: 1px solid rgba(255, 255, 255, 0.3); 
    width: 100%; 
    max-width: 1100px; 
    padding: 48px 40px; 
  }

  .form-title { 
    font-size: 40px;
    font-weight: 800; 
    color: #065f46; 
    margin: 0 0 8px 0; 
    text-align: center; 
  }
  
  .form-subtitle { 
    color: #059669; 
    text-align: center; 
    margin-bottom: 40px; 
    font-size: 18px;
    font-weight: 500;
  }

  .success-message { 
    display: flex; 
    align-items: center; 
    gap: 12px; 
    background: #ecfdf5; 
    color: #065f46; 
    padding: 16px 20px; 
    border-radius: 16px; 
    border: 1px solid #86efac; 
    margin-bottom: 32px; 
    font-weight: 500; 
  }

  .error-message-box {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #fef2f2;
    color: #dc2626;
    padding: 16px 20px;
    border-radius: 16px;
    border: 1px solid #fca5a5;
    margin-bottom: 32px;
    font-weight: 500;
  }

  /* Layout Side-by-Side */
  .form-layout { 
    display: grid; 
    grid-template-columns: 1fr 1.2fr; 
    gap: 48px; 
    align-items: start; 
  }

  .preview-section { 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    gap: 20px; 
  }

  .preview-button {
    all: unset; 
    cursor: pointer; 
    width: 100%; 
    max-width: 380px; 
    aspect-ratio: 1/1; 
    background: #f0fdf4; 
    border-radius: 20px; 
    overflow: hidden; 
    box-shadow: 0 8px 24px rgba(0,0,0,0.08); 
    border: 2px dashed #86efac; 
    transition: all 0.3s ease; 
    display: flex; 
    align-items: center; 
    justify-content: center;
  }
  
  .preview-button:hover, .preview-button:focus-visible { 
    border-color: #10b981; 
    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2); 
    background: #dcfce7;
  }

  .preview-image { 
    width: 100%; 
    height: 100%; 
    object-fit: cover; 
  }

  .placeholder-preview { 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    gap: 20px; 
    color: #059669; 
    text-align: center; 
    padding: 30px; 
  }
  
  .upload-hint { 
    font-size: 16px; 
    font-weight: 500; 
    margin: 0; 
  }

  .change-image-btn { 
    padding: 14px 24px; 
    background: #f0fdf4; 
    color: #065f46; 
    border: 2px solid #86efac; 
    border-radius: 14px; 
    font-weight: 600; 
    cursor: pointer; 
    transition: all 0.3s ease; 
    width: 100%; 
    max-width: 380px; 
    font-size: 16px;
  }
  
  .change-image-btn:hover { 
    background: #dcfce7; 
    border-color: #10b981; 
    transform: translateY(-2px);
  }

  .fields-section { 
    display: flex; 
    flex-direction: column; 
    gap: 24px; 
  }

  .product-form { 
    display: flex; 
    flex-direction: column; 
    gap: 28px; 
    width: 100%; 
  }

  .field-group { 
    display: flex; 
    flex-direction: column; 
    gap: 10px; 
  }
  
  .field-group label { 
    font-weight: 600; 
    color: #065f46; 
    font-size: 16px; 
  }
  
  .required {
    color: #dc2626;
  }
  
  .field-group input, .field-group select { 
    padding: 16px 20px; 
    border: 2px solid #d1fae5; 
    border-radius: 16px; 
    font-size: 16px; 
    background: white; 
    transition: all 0.3s ease; 
  }
  
  .field-group input:focus, .field-group select:focus { 
    outline: none; 
    border-color: #10b981; 
    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15); 
  }
  
  .field-group input.error, .field-group select.error { 
    border-color: #dc2626; 
    background: #fef2f2; 
  }

  /* Custom Select Styling */
  .select-wrapper {
    position: relative;
  }
  
  select {
    appearance: none;
    -webkit-appearance: none;
    width: 100%;
    padding: 16px 48px 16px 20px;
    color: #065f46;
    cursor: pointer;
  }
  
  .arrow-icon {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    width: 24px;
    height: 24px;
    pointer-events: none;
    color: #059669;
  }
  
  /* Price Input with Prefix */
  .input-with-prefix {
    position: relative;
  }
  
  .prefix {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: #059669;
    font-weight: 600;
    font-size: 16px;
  }
  
  .input-with-prefix input {
    padding-left: 50px;
  }

  .submit-btn { 
    padding: 18px 24px; 
    background: linear-gradient(135deg, #10b981, #059669); 
    color: white; 
    font-size: 17px; 
    font-weight: 700; 
    border: none; 
    border-radius: 16px; 
    cursor: pointer; 
    box-shadow: 0 12px 30px rgba(16, 185, 129, 0.4); 
    transition: all 0.3s ease; 
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-top: 20px;
  }
  
  .submit-btn:hover:not(:disabled) { 
    background: linear-gradient(135deg, #0da271, #047857); 
    transform: translateY(-4px); 
    box-shadow: 0 18px 40px rgba(16, 185, 129, 0.5); 
  }
  
  .submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .error-message { 
    color: #dc2626; 
    font-size: 14px; 
    font-weight: 500; 
  }

  .hidden-input { 
    display: none; 
  }

  .spinner {
    width: 22px;
    height: 22px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top: 3px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* RESPONSIVE: Stack vertically di mobile */
  @media (max-width: 900px) {
    .form-layout { 
      grid-template-columns: 1fr; 
      gap: 40px; 
    }
    
    .preview-section { 
      order: -1; 
    }
    
    .preview-button { 
      max-width: 320px; 
    }
    
    .change-image-btn { 
      max-width: 320px; 
    }
    
    .form-card { 
      padding: 40px 24px; 
    }
  }

  @media (max-width: 480px) {
    .preview-button { 
      max-width: 280px; 
    }
    
    .change-image-btn { 
      max-width: 280px; 
    }
    
    .form-title {
      font-size: 32px;
    }
  }
</style>