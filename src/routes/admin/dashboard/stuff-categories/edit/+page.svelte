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
	<title>Edit Category | Admin</title>
</svelte:head>

<div class="wrapper">
	<div class="card">
		<div class="header">
			<h1>Edit Category</h1>
			<p class="subtitle">Update category details</p>
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
			<div class="field">
				<label>Category Name <span class="required">*</span></label>
				<input
					name="name"
					type="text"
					required
					placeholder="e.g. Electronics, Clothing, Furniture"
					value={data.category.name}
				/>
			</div>

			<div class="actions">
				<button type="submit" class="btn-primary" disabled={loading}>
					{#if loading}
						<span class="spinner"></span>
						Updating...
					{:else}
						Update Category
					{/if}
				</button>
				<a href="/admin/dashboard/stuff-categories" class="btn-secondary">Cancel</a>
			</div>
		</form>
	</div>
</div>

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
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: 'Inter', system-ui, -apple-system, sans-serif;
		background: linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%);
		min-height: 100vh;
	}

	.wrapper {
		min-height: 90vh;
		padding: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.card {
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(20px);
		border-radius: 24px;
		box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
		width: 100%;
		max-width: 480px;
		padding: 48px;
		border: 1px solid rgba(255, 255, 255, 0.3);
	}

	.header {
		text-align: center;
		margin-bottom: 40px;
	}

	.header h1 {
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

	.field {
		margin-bottom: 32px;
	}

	.field label {
		display: block;
		margin-bottom: 12px;
		font-weight: 600;
		color: #065f46;
		font-size: 16px;
	}

	.required {
		color: #dc2626;
	}

	input {
		width: 100%;
		padding: 16px 20px;
		border: 2px solid #d1fae5;
		border-radius: 16px;
		font-size: 16px;
		transition: all 0.2s ease;
		background: white;
		box-sizing: border-box;
	}

	input:focus {
		outline: none;
		border-color: #10b981;
		box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15);
	}

	.actions {
		display: flex;
		gap: 16px;
		margin-top: 40px;
	}

	.btn-primary,
	.btn-secondary {
		flex: 1;
		padding: 16px;
		border-radius: 16px;
		font-size: 16px;
		font-weight: 600;
		text-align: center;
		text-decoration: none;
		cursor: pointer;
		transition: all 0.3s ease;
		border: none;
	}

	.btn-primary {
		background: linear-gradient(135deg, #10b981, #059669);
		color: white;
		box-shadow: 0 12px 30px rgba(16, 185, 129, 0.4);
	}

	.btn-primary:hover:not(:disabled) {
		transform: translateY(-4px);
		box-shadow: 0 18px 40px rgba(16, 185, 129, 0.5);
	}

	.btn-primary:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.btn-secondary {
		background: white;
		color: #374151;
		border: 2px solid #e5e7eb;
	}

	.btn-secondary:hover {
		background: #f9fafb;
		border-color: #d1d5db;
	}

	.spinner {
		width: 20px;
		height: 20px;
		border: 3px solid rgba(255, 255, 255, 0.3);
		border-top: 3px solid white;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		display: inline-block;
		margin-right: 8px;
		vertical-align: middle;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

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
		from {
			transform: translateX(100%);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}

	@keyframes progress {
		from {
			width: 100%;
		}
		to {
			width: 0%;
		}
	}
</style>