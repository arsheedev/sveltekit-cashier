<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	// Toast state
	let toastMessage = $state<string | null>(null);
	let toastType = $state<'success' | 'error' | null>(null);

	// Cek jika ada message dari action (success atau error dari fail)
	$effect(() => {
		if (page.form?.success && page.form.message) {
			showToast(page.form.message, 'success');
		} else if (page.form?.message) {
			showToast(page.form.message, 'error');
		}
	});

	function showToast(message: string, type: 'success' | 'error') {
		toastMessage = message;
		toastType = type;

		// Otomatis hilang setelah 4 detik
		setTimeout(() => {
			toastMessage = null;
			toastType = null;
		}, 4000);
	}

	function formatCurrency(value: number | null): string {
		return value ? `$${value.toLocaleString()}` : '-';
	}

	function getTypeLabel(type: string): string {
		const labels: Record<string, string> = {
			fixed: 'Fixed Amount',
			percentage: 'Percentage',
			manual_upgrade: 'Manual Upgrade'
		};
		return labels[type.toLowerCase()] || type;
	}
</script>

<svelte:head>
	<title>Vouchers List | Admin</title>
</svelte:head>

<div class="wrapper">
	<div class="card">
		<div class="header">
			<div class="header-left">
				<h1>Vouchers Management</h1>
				<p class="subtitle">All discount codes and promotions</p>
			</div>
			<a href="/admin/dashboard/vouchers/add" class="btn-primary add-btn">
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<line x1="12" y1="5" x2="12" y2="19"></line>
					<line x1="5" y1="12" x2="19" y2="12"></line>
				</svg>
				Add New Voucher
			</a>
		</div>

		<!-- Table & Pagination tetap sama -->
		<div class="table-container">
			<table class="voucher-table">
				<thead>
					<tr>
						<th>Code</th>
						<th>Type</th>
						<th>Discount</th>
						<th>Points</th>
						<th>Description</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#if data.vouchers.length === 0}
						<tr>
							<td colspan="6" class="empty-state">
								<div class="empty-icon">📋</div>
								<p>No vouchers available yet</p>
								<a
									href="/admin/dashboard/vouchers/add"
									class="btn-primary"
									style="margin-top: 24px;"
								>
									Add Your First Voucher
								</a>
							</td>
						</tr>
					{:else}
						{#each data.vouchers as voucher (voucher.id)}
							<tr>
								<td><div class="code-badge">{voucher.code}</div></td>
								<td><span class="type-badge {voucher.type}">{getTypeLabel(voucher.type)}</span></td>
								<td><strong>{formatCurrency(voucher.discountValue as number)}</strong></td>
								<td>{voucher.pointsRequired || 0}</td>
								<td class="description-cell">{voucher.description}</td>
								<td>
									<div class="action-buttons">
										<a
											href={`/admin/dashboard/vouchers/edit?id=${voucher.id}`}
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

										<form method="POST" use:enhance>
											<input type="hidden" name="id" value={voucher.id} />
											<button
												type="submit"
												class="btn-delete"
												title="Delete"
												onclick={(e) => {
													if (
														!confirm('Are you sure you want to delete this voucher permanently?')
													) {
														e.preventDefault();
													}
												}}
											>
												<svg
													width="18"
													height="18"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
												>
													<path d="M3 6h18"></path>
													<path
														d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
													></path>
												</svg>
											</button>
										</form>
									</div>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
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
	:global(body) {
		margin: 0;
		padding: 0;
		font-family:
			'Inter',
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			sans-serif;
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
		max-width: 1400px;
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

	.alert {
		padding: 20px 28px;
		border-radius: 16px;
		margin-bottom: 32px;
		font-size: 16px;
		font-weight: 500;
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
	}

	.alert.success {
		background: #ecfdf5;
		color: #065f46;
		border: 2px solid #86efac;
	}
	.alert.error {
		background: #fef2f2;
		color: #991b1b;
		border: 2px solid #fca5a5;
	}

	.table-container {
		overflow-x: auto;
		border-radius: 20px;
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
	}

	.voucher-table {
		width: 100%;
		border-collapse: collapse;
		background: white;
	}

	.voucher-table th {
		background: linear-gradient(135deg, #f0fdf4, #dcfce7);
		color: #065f46;
		font-weight: 700;
		padding: 20px 24px;
		text-align: left;
		font-size: 15px;
		border-bottom: 3px solid #86efac;
	}

	.voucher-table td {
		padding: 20px 24px;
		border-bottom: 1px solid #e5e7eb;
		vertical-align: middle;
	}

	.voucher-table tr:hover {
		background: #f0fdf4;
	}

	.code-badge {
		background: linear-gradient(135deg, #10b981, #059669);
		color: white;
		padding: 8px 16px;
		border-radius: 25px;
		font-weight: 700;
		font-size: 14px;
		display: inline-block;
		box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
	}

	.type-badge {
		padding: 6px 16px;
		border-radius: 20px;
		font-size: 13px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.type-badge.fixed {
		background: #dcfce7;
		color: #065f46;
	}
	.type-badge.percentage {
		background: #fef3c7;
		color: #d97706;
	}
	.type-badge.manual_upgrade {
		background: #dbeafe;
		color: #1e40af;
	}

	.description-cell {
		max-width: 300px;
		color: #4b5563;
		word-break: break-word;
	}

	.action-buttons {
		display: flex;
		gap: 8px;
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

	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 12px;
		margin-top: 40px;
		padding: 24px;
		background: rgba(255, 255, 255, 0.7);
		border-radius: 16px;
	}

	.page-btn {
		padding: 12px 20px;
		border: 2px solid #d1fae5;
		background: white;
		color: #059669;
		border-radius: 12px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.page-btn:hover:not(:disabled) {
		background: #10b981;
		color: white;
		border-color: #10b981;
		transform: translateY(-2px);
	}

	.page-btn.active {
		background: #10b981;
		color: white;
		border-color: #10b981;
	}

	.page-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	@media (max-width: 768px) {
		.wrapper {
			padding: 16px;
		}
		.card {
			padding: 32px 24px;
			border-radius: 20px;
		}
		.header {
			flex-direction: column;
			text-align: center;
		}
		.voucher-table th,
		.voucher-table td {
			padding: 16px 12px;
			font-size: 14px;
		}
		.action-buttons {
			justify-content: center;
		}
		.pagination {
			flex-wrap: wrap;
		}
	}
</style>
