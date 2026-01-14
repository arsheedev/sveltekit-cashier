<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	const { data, form }: PageProps = $props();

	let loading = $state(false);

	let toastMessage = $state<string | null>(null);
	let toastType = $state<'success' | 'error' | null>(null);

	$effect(() => {
		if (form?.message) {
			showToast(form.message, 'success');
		} else if (form?.message) {
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
</script>

<svelte:head>
	<title>Edit Voucher | Admin</title>
</svelte:head>

<div class="wrapper">
	<div class="card">
		<div class="header">
			<h1>Edit Voucher</h1>
			<p class="subtitle">Update voucher details</p>
		</div>

		<form
			method="POST"
			use:enhance={() => {
				loading = true;
				return ({ update }) => {
					loading = false;
					update();
				};
			}}
		>
			<div class="grid">
				<div class="field">
					<label>Voucher Code <span class="required">*</span></label>
					<input
						name="code"
						type="text"
						required
						placeholder="e.g. WELCOME50"
						value={data.voucher.code}
					/>
				</div>

				<div class="field">
					<label>Voucher Type <span class="required">*</span></label>
					<select name="type" required>
						<option value="fixed" selected={data.voucher.type === 'fixed'}>Fixed Amount</option>
						<option value="percentage" selected={data.voucher.type === 'percentage'}
							>Percentage (%)</option
						>
						<option value="manual_upgrade" selected={data.voucher.type === 'manual_upgrade'}
							>Manual Upgrade</option
						>
					</select>
				</div>

				<div class="field">
					<label>Discount Value <small>(optional)</small></label>
					<input
						name="discountValue"
						type="number"
						min="0"
						placeholder="e.g. 50000 or 15"
						value={data.voucher.discountValue ?? ''}
					/>
				</div>

				<div class="field">
					<label>Points Required</label>
					<input
						name="pointsRequired"
						type="number"
						min="0"
						placeholder="0"
						value={data.voucher.pointsRequired ?? '0'}
					/>
				</div>
			</div>

			<div class="field full">
				<label>Voucher Description <span class="required">*</span></label>
				<textarea
					name="description"
					rows="5"
					required
					placeholder="Describe the benefits, terms, and validity..."
					>{data.voucher.description}</textarea
				>
			</div>

			<div class="actions">
				<button type="submit" class="btn-primary" disabled={loading}>
					{#if loading}
						<span class="spinner"></span>
					{:else}
						Update Voucher
					{/if}
				</button>
				<a href="/admin/vouchers" class="btn-secondary">Cancel</a>
			</div>
		</form>
	</div>
</div>

<!-- Toast Notification -->
{#if toastMessage}
	<div class="toast {toastType}">
		<div class="toast-content">
			{#if toastType === 'success'}
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
					<polyline points="22 4 12 14.01 9 11.01"></polyline>
				</svg>
			{:else}
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
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
	.container {
    min-height: 100vh;
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
