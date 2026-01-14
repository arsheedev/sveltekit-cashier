<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import type { ActionResult } from '@sveltejs/kit';

  interface FormData {
    success?: boolean;
    message?: string;
    errors?: Record<string, string[]>;
  }

  let form: FormData = $props();
  let isSubmitting = $state(false);

  const handleSubmit = () => {
    isSubmitting = true;
    return async ({ result, update }: { 
      result: ActionResult, 
      update: (options: { reset: boolean }) => Promise<void> 
    }) => {
      isSubmitting = false;

      if (result.type === 'redirect') {
        await goto(result.location, { invalidateAll: true });
        return;
      }

      await update({ reset: false });
    };
  };

  function hasError(field: string): boolean {
    return !!(form?.errors?.[field] || (field === 'general' && form?.message && !form?.success));
  }

  function getErrorMessage(field: string): string {
    if (field === 'general') return (form?.message as string) || '';
    return (form?.errors?.[field]?.[0] as string) ?? '';
  }
</script>

<svelte:head>
  <title>Add New Category</title>
</svelte:head>

<div class="container">
  <div class="card">
    <div class="header">
      <h1>Add New Category</h1>
      <p class="subtitle">Create a new category to organize your products</p>
    </div>

    {#if form?.message && !form?.success}
      <div class="error-message-box">
        {getErrorMessage('general')}
      </div>
    {/if}

    <form method="POST" use:enhance={handleSubmit} class="form">
      <div class="form-group">
        <label for="name">Category Name</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="e.g. Food, Beverages, Snacks, Clothing..."
          class:error={hasError('name')}
          required
          disabled={isSubmitting}
        />
        {#if hasError('name')}
          <span class="field-error">{getErrorMessage('name')}</span>
        {/if}
      </div>

      <div class="form-actions">
        <a 
          href="/admin/dashboard/stuff-categories/list" 
          class="btn secondary"
          aria-disabled={isSubmitting}
        >
          Cancel
        </a>
        <button 
          type="submit" 
          class="btn primary"
          disabled={isSubmitting}
        >
          {#if isSubmitting}
            <span class="spinner"></span>
            Saving...
          {:else}
            Save Category
          {/if}
        </button>
      </div>
    </form>
  </div>
</div>


<style>
  .container {
    min-height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f0fdf4 0%, #f8fafc 100%);
    padding: 1.5rem;
  }

  .card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.08);
    padding: 2rem;
    width: 100%;
    max-width: 420px;
    border: 1px solid #e6f4ea;
  }

  .header h1 {
    font-size: 1.75rem;
    font-weight: 700;
    color: #166534;
    margin: 0 0 0.25rem;
    text-align: center;
  }

  .subtitle {
    color: #64748b;
    text-align: center;
    margin-bottom: 1.75rem;
    font-size: 0.95rem;
  }

  .error-message-box {
    background: #fee2e2;
    color: #991b1b;
    padding: 0.875rem;
    border-radius: 10px;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  label {
    font-weight: 600;
    color: #166534;
    font-size: 0.9rem;
  }

  input {
    padding: 0.875rem 1.125rem;
    border: 2px solid #d1fae5;
    border-radius: 10px;
    font-size: 1rem;
    transition: all 0.2s ease;
  }

  input:focus {
    outline: none;
    border-color: #22c55e;
    box-shadow: 0 0 0 3px rgba(34,197,94,0.15);
  }

  input.error {
    border-color: #ef4444;
    background: #fef2f2;
  }

  .field-error {
    color: #ef4444;
    font-size: 0.8rem;
  }

  .form-actions {
    display: flex;
    gap: 1rem;
  }

  .btn {
    flex: 1;
    padding: 0.875rem;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
    text-decoration: none;
  }

  .btn.primary {
    background: #22c55e;
    color: white;
    border: none;
  }

  .btn.primary:hover:not(:disabled) {
    background: #16a34a;
  }

  .btn.secondary {
    background: white;
    color: #166534;
    border: 2px solid #d1fae5;
  }

  .btn.secondary:hover:not(:disabled) {
    background: #ecfdf5;
  }

  .spinner {
    width: 18px;
    height: 18px;
    border: 3px solid rgba(255,255,255,0.3);
    border-top: 3px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    display: inline-block;
    margin-right: 8px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @media (max-width: 480px) {
    .form-actions { flex-direction: column; }
  }
</style>