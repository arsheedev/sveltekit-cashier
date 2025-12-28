<script lang="ts">
	import { page } from '$app/state';
	import { enhance } from '$app/forms';

	const voucher = $derived(page.data.voucher);
	const form = $derived(page.form ?? {});

	let loading = $state(false);

	let toastMessage = $state<string | null>(null);
	let toastType = $state<'success' | 'error' | null>(null);

	$effect(() => {
		if (form.success && form.message) {
			showToast(form.message, 'success');
		} else if (form.message) {
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
						value={form.code ?? voucher.code}
					/>
				</div>

				<div class="field">
					<label>Voucher Type <span class="required">*</span></label>
					<select name="type" required>
						<option value="fixed" selected={voucher.type === 'fixed' || form.type === 'fixed'}>Fixed Amount</option>
						<option value="percentage" selected={voucher.type === 'percentage' || form.type === 'percentage'}>Percentage (%)</option>
						<option value="manual_upgrade" selected={voucher.type === 'manual_upgrade' || form.type === 'manual_upgrade'}>Manual Upgrade</option>
					</select>
				</div>

				<div class="field">
					<label>Discount Value <small>(optional)</small></label>
					<input
						name="discountValue"
						type="number"
						min="0"
						placeholder="e.g. 50000 or 15"
						value={form.discountValue ?? voucher.discountValue ?? ''}
					/>
				</div>

				<div class="field">
					<label>Points Required</label>
					<input
						name="pointsRequired"
						type="number"
						min="0"
						placeholder="0"
						value={form.pointsRequired ?? voucher.pointsRequired ?? '0'}
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
				>{form.description ?? voucher.description}</textarea>
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
	/* Gunakan CSS premium hijau yang sama seperti Add dan List */
</style>