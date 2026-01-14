<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import { fade, slide } from 'svelte/transition';
	import type { PageProps } from './$types';

	let creatingSession = $state(false);

	async function createCheckoutSession() {
		if (cart.length === 0) return;
		creatingSession = true;

		try {
			const res = await fetch(`${PUBLIC_API_URL}/api/orders/checkout`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					itemIds: cart.map((item) => item.id),
					itemQuantity: cart.map((item) => item.quantity),
					customerName: 'Guest User', // rubahen dewe gae username
					customerPhone: '0812345678' // karo nomor hp ne
				})
			});

			const data = await res.json();
			if (data.url) {
				window.location.href = data.url;
			}
		} catch (err) {
			console.error('Checkout error:', err);
		} finally {
			creatingSession = false;
		}
	}

	let { data }: PageProps = $props();
	const products = data.products || [];

	let activeCategory = $state<'all' | 'food' | 'beverages'>('all');
	let currentPage = $state(1);
	let searchQuery = $state('');
	const itemsPerPage = 8;

	// CART STATE
	type CartItem = {
		id: number;
		name: string;
		price: number;
		quantity: number;
		imageUrl: string;
	};

	let cart = $state<CartItem[]>([]);
	let showCartPopup = $state(false);

	let cartTotalItems = $derived(cart.reduce((sum, item) => sum + item.quantity, 0));

	let cartTotalPrice = $derived(cart.reduce((sum, item) => sum + item.price * item.quantity, 0));

	function addToCart(product: (typeof products)[0]) {
		const existing = cart.find((item) => item.id === product.id);
		if (existing) {
			existing.quantity += 1;
		} else {
			cart = [
				...cart,
				{
					id: product.id,
					name: product.name,
					price: product.price,
					quantity: 1,
					imageUrl: product.imageUrl || ''
				}
			];
		}
	}

	function updateQuantity(id: number, delta: number) {
		const item = cart.find((i) => i.id === id);
		if (item) {
			item.quantity += delta;
			if (item.quantity <= 0) cart = cart.filter((i) => i.id !== id);
		}
	}

	function toggleCart() {
		showCartPopup = !showCartPopup;
	}

	function clearSearch() {
		searchQuery = '';
	}

	let filteredItems = $derived(
		products.filter((item) => {
			const matchesCategory = activeCategory === 'all' || item.type === activeCategory;
			const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
			return matchesCategory && matchesSearch;
		})
	);

	let totalPages = $derived(Math.ceil(filteredItems.length / itemsPerPage));

	let currentItems = $derived(
		filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
	);

	let pageNumbers = $derived(() => {
		const pages: number[] = [];
		const maxVisible = 5;
		let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
		let end = Math.min(totalPages, start + maxVisible - 1);
		if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
		for (let i = start; i <= end; i++) pages.push(i);
		return pages;
	});

	$effect(() => {
		activeCategory || searchQuery;
		currentPage = 1;
	});

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages) currentPage = page;
	}
</script>

<svelte:head>
	<title>Menu | Order Food & Beverages</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" />
	<link
		href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="menu-container">
	<!-- Sidebar -->
	<aside class="sidebar">
		<h1 class="menu-title">Our Menu</h1>
		<div class="category-tabs-vertical">
			<button
				class="tab-button-v"
				class:active={activeCategory === 'all'}
				onclick={() => (activeCategory = 'all')}
			>
				All Items
			</button>
			<button
				class="tab-button-v"
				class:active={activeCategory === 'food'}
				onclick={() => (activeCategory = 'food')}
			>
				Food
			</button>
			<button
				class="tab-button-v"
				class:active={activeCategory === 'beverages'}
				onclick={() => (activeCategory = 'beverages')}
			>
				Beverages
			</button>
		</div>
	</aside>

	<!-- Main Content -->
	<div class="menu-content">
		<!-- Search Bar -->
		<div class="search-bar">
			<div class="search-input-wrapper">
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<circle cx="11" cy="11" r="8" />
					<path d="m21 21-4.35-4.35" />
				</svg>
				<input
					type="text"
					placeholder="Search menu items..."
					bind:value={searchQuery}
					class="search-input"
				/>
				{#if searchQuery}
					<button class="clear-search-btn" onclick={clearSearch} aria-label="Clear search">×</button
					>
				{/if}
			</div>
		</div>

		{#if currentItems.length === 0}
			<div class="empty-state">
				<svg width="120" height="120" viewBox="0 0 120 120" fill="none">
					<circle cx="60" cy="60" r="60" fill="#f0fdf4" />
					<path d="M60 35L80 60H40L60 35Z" fill="#22c55e" />
					<path d="M50 85H70V105H50V85Z" fill="#22c55e" />
				</svg>
				<h3>No items found</h3>
				<p>{searchQuery ? 'Try a different search term' : 'Try selecting a different category'}</p>
			</div>
		{:else}
			<div class="stats-bar">
				<span class="stats-text">
					Showing {(currentPage - 1) * itemsPerPage + 1} -
					{Math.min(currentPage * itemsPerPage, filteredItems.length)}
					of {filteredItems.length} items
					{searchQuery ? ` for "${searchQuery}"` : ''}
				</span>
			</div>

			<div class="menu-grid">
				{#each currentItems as item (item.id)}
					<div class="menu-card" in:fade={{ duration: 300 }}>
						<div class="image-wrapper">
							{#if item.imageUrl}
								<img src={item.imageUrl} alt={item.name} class="menu-image" loading="lazy" />
							{:else}
								<div class="placeholder-image">
									<svg width="80" height="80" viewBox="0 0 120 120" fill="none">
										<rect width="120" height="120" rx="16" fill="#f3f4f6" />
										<text
											x="60"
											y="75"
											text-anchor="middle"
											fill="#9ca3af"
											font-size="14"
											font-weight="500">No Image</text
										>
									</svg>
								</div>
							{/if}
						</div>

						<div class="card-content">
							<h3 class="item-name">{item.name}</h3>
							<span class="type-badge">{item.type}</span>
							<div class="card-footer">
								<span class="price">SGD {item.price.toFixed(2)}</span>
								<button
									class="add-button"
									onclick={() => addToCart(item)}
									aria-label="Add {item.name} to cart"
								>
									+
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>

			{#if totalPages > 1}
				<div class="pagination">
					<button
						class="pagination-btn"
						class:disabled={currentPage === 1}
						onclick={() => (currentPage -= 1)}>←</button
					>
					{#each pageNumbers as page}
						<button
							class="pagination-btn {page === currentPage ? 'active' : ''}"
							onclick={() => goToPage(page)}
						>
							{page}
						</button>
					{/each}
					{#if totalPages > pageNumbers[pageNumbers.length - 1]}
						<span class="ellipsis">...</span>
					{/if}
					<button
						class="pagination-btn"
						class:disabled={currentPage === totalPages}
						onclick={() => (currentPage += 1)}>→</button
					>
				</div>
			{/if}
		{/if}
	</div>
</div>

<!-- Floating Cart Button -->
{#if cartTotalItems > 0}
	<button class="floating-cart-btn" onclick={toggleCart} aria-label="Open cart">
		<svg
			width="28"
			height="28"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
		>
			<circle cx="9" cy="21" r="1" />
			<circle cx="20" cy="21" r="1" />
			<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
		</svg>
		<span class="cart-badge">{cartTotalItems}</span>
	</button>
{/if}

<!-- Cart Popup dari Bawah -->
{#if showCartPopup}
	<div
		class="cart-overlay"
		onclick={() => (showCartPopup = false)}
		transition:fade={{ duration: 200 }}
	></div>
	<div class="cart-popup" transition:slide={{ duration: 300 }}>
		<div class="cart-header-popup">
			<h2>Your Cart ({cartTotalItems} items)</h2>
			<button class="close-btn" onclick={() => (showCartPopup = false)} aria-label="Close cart"
				>×</button
			>
		</div>

		<div class="cart-items">
			{#each cart as item (item.id)}
				<div class="cart-item">
					{#if item.imageUrl}
						<img src={item.imageUrl} alt={item.name} class="cart-item-image" />
					{:else}
						<div class="cart-item-placeholder">
							<svg width="40" height="40" viewBox="0 0 120 120" fill="none">
								<rect width="120" height="120" rx="8" fill="#f3f4f6" />
								<text x="60" y="75" text-anchor="middle" fill="#9ca3af" font-size="12"
									>No Image</text
								>
							</svg>
						</div>
					{/if}
					<div class="cart-item-info">
						<h4>{item.name}</h4>
						<span class="cart-item-price">SGD {item.price.toFixed(2)} each</span>
					</div>
					<div class="quantity-control">
						<button onclick={() => updateQuantity(item.id, -1)}>-</button>
						<span>{item.quantity}</span>
						<button onclick={() => updateQuantity(item.id, 1)}>+</button>
					</div>
				</div>
			{/each}
		</div>

		<div class="cart-total-popup">
			<span>Total</span>
			<span class="total-price">SGD {cartTotalPrice.toFixed(2)}</span>
		</div>

		<button
			class="checkout-btn-popup"
			onclick={createCheckoutSession}
			disabled={creatingSession || cart.length === 0}
		>
			{creatingSession ? 'Processing...' : 'Proceed to Checkout'}
		</button>
	</div>
{/if}

<style>
	:global(body) {
		margin: 0;
		font-family: 'Poppins', sans-serif;
		background: #f9fafb;
	}

	.menu-container {
		display: flex;
		min-height: 100vh;
		background: linear-gradient(135deg, #f0fdf4 0%, #f7fafc 100%);
	}

	.sidebar {
		width: 280px;
		padding: 2rem 1.5rem;
		border-right: 1px solid #e6f4ea;
		position: sticky;
		top: 0;
		height: 100vh;
		background: white;
		flex-shrink: 0;
		box-shadow: 2px 0 12px rgba(0, 0, 0, 0.05);
		overflow: hidden; /* Tidak bisa scroll */
	}

	.menu-title {
		font-size: 2rem;
		font-weight: 800;
		color: #166534;
		margin-bottom: 2.5rem;
		text-align: center;
	}

	.category-tabs-vertical {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.tab-button-v {
		padding: 1.25rem 1.5rem;
		font-size: 1.1rem;
		font-weight: 600;
		text-align: left;
		border: none;
		border-radius: 16px;
		background: #f0fdf4;
		color: #4b5563;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.tab-button-v:hover {
		background: #dcfce7;
		transform: translateX(4px);
	}

	.tab-button-v.active {
		background: linear-gradient(135deg, #86efac 0%, #22c55e 100%);
		color: white;
		box-shadow: 0 8px 24px rgba(34, 197, 94, 0.3);
		transform: translateX(4px);
	}

	.menu-content {
		flex: 1;
		padding: 2rem 3%;
		display: flex;
		flex-direction: column;
	}

	.search-bar {
		max-width: 1400px;
		margin: 0 auto 2rem;
		padding: 0 2rem;
	}

	.search-input-wrapper {
		position: relative;
		display: flex;
		align-items: center;
		background: white;
		border-radius: 16px;
		padding: 0.75rem 1.25rem;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
		border: 2px solid #e6f4ea;
		transition: all 0.3s ease;
	}

	.search-input-wrapper:focus-within {
		border-color: #22c55e;
		box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.15);
	}

	.search-input-wrapper svg {
		color: #9ca3af;
		margin-right: 1rem;
		flex-shrink: 0;
	}

	.search-input {
		flex: 1;
		border: none;
		outline: none;
		font-size: 1.1rem;
		color: #2d2d2d;
		background: transparent;
	}

	.search-input::placeholder {
		color: #9ca3af;
	}

	.clear-search-btn {
		background: none;
		border: none;
		font-size: 1.5rem;
		color: #9ca3af;
		cursor: pointer;
		padding: 0.25rem;
		margin-left: 0.5rem;
		border-radius: 50%;
		transition: all 0.2s ease;
	}

	.clear-search-btn:hover {
		background: #f3f4f6;
		color: #6b7280;
	}

	.stats-bar {
		max-width: 1400px;
		margin: 0 auto 2rem;
		padding: 0 2rem;
		color: #6b7280;
		font-weight: 500;
	}

	.menu-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 380px));
		gap: 2rem;
		max-width: 1400px;
		margin: 0 auto;
		justify-content: center;
	}

	.menu-card {
		background: white;
		border-radius: 20px;
		overflow: hidden;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
		border: 1px solid #e6f4ea;
		transition: all 0.4s;
		display: flex;
		flex-direction: column;
	}

	.menu-card:hover {
		transform: translateY(-12px);
		box-shadow: 0 24px 48px rgba(34, 197, 94, 0.15);
		border-color: #86efac;
	}

	.image-wrapper {
		height: 240px;
		background: linear-gradient(135deg, #f7fafc 0%, #f0fdf4 100%);
	}

	.menu-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.placeholder-image {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.card-content {
		padding: 1.75rem;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.item-name {
		font-size: 1.4rem;
		font-weight: 700;
		color: #166534;
		margin: 0;
	}

	.type-badge {
		display: inline-block;
		background: #dcfce7;
		color: #166534;
		padding: 0.4rem 1rem;
		border-radius: 999px;
		font-size: 0.85rem;
		font-weight: 600;
		text-transform: capitalize;
		align-self: flex-start;
	}

	.card-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: auto;
		padding-top: 1rem;
	}

	.price {
		font-size: 1.75rem;
		font-weight: 800;
		color: #16a34a;
	}

	.add-button {
		width: 52px;
		height: 52px;
		border-radius: 50%;
		background: linear-gradient(135deg, #86efac 0%, #22c55e 100%);
		color: white;
		font-size: 1.75rem;
		font-weight: 700;
		border: none;
		cursor: pointer;
		transition: all 0.3s;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
	}

	.add-button:hover {
		background: linear-gradient(135deg, #4ade80 0%, #16a34a 100%);
		transform: scale(1.1);
		box-shadow: 0 8px 20px rgba(34, 197, 94, 0.4);
	}

	/* Floating Cart Button */
	.floating-cart-btn {
		position: fixed;
		bottom: 30px;
		right: 30px;
		width: 64px;
		height: 64px;
		border-radius: 50%;
		background: linear-gradient(135deg, #86efac 0%, #22c55e 100%);
		color: white;
		border: none;
		cursor: pointer;
		box-shadow: 0 8px 24px rgba(34, 197, 94, 0.4);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		transition: all 0.3s ease;
	}

	.floating-cart-btn:hover {
		transform: scale(1.1);
	}

	.cart-badge {
		position: absolute;
		top: -8px;
		right: -8px;
		background: #ef4444;
		color: white;
		font-size: 0.9rem;
		font-weight: 700;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* Cart Popup */
	.cart-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 999;
	}

	.cart-popup {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: white;
		border-top-left-radius: 24px;
		border-top-right-radius: 24px;
		max-height: 80vh;
		overflow-y: auto;
		z-index: 1001;
		box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.15);
	}

	.cart-header-popup {
		padding: 1.5rem 2rem;
		border-bottom: 1px solid #e6f4ea;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: white;
		position: sticky;
		top: 0;
	}

	.cart-header-popup h2 {
		font-size: 1.5rem;
		font-weight: 700;
		color: #166534;
		margin: 0;
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 2rem;
		cursor: pointer;
		color: #6b7280;
	}

	.cart-items {
		padding: 1rem 2rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.cart-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem 0;
		border-bottom: 1px solid #f0fdf4;
	}

	.cart-item-image {
		width: 60px;
		height: 60px;
		object-fit: cover;
		border-radius: 12px;
	}

	.cart-item-placeholder {
		width: 60px;
		height: 60px;
		background: #f3f4f6;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.cart-item-info h4 {
		margin: 0;
		font-size: 1.1rem;
		color: #2d2d2d;
	}

	.cart-item-price {
		color: #16a34a;
		font-weight: 600;
		font-size: 0.95rem;
	}

	.quantity-control {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-left: auto;
	}

	.quantity-control button {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		border: 2px solid #d1fae5;
		background: white;
		color: #166534;
		font-weight: bold;
		cursor: pointer;
	}

	.quantity-control button:hover {
		background: #ecfdf5;
	}

	.cart-total-popup {
		padding: 1.5rem 2rem;
		display: flex;
		justify-content: space-between;
		font-size: 1.4rem;
		font-weight: 700;
		color: #166534;
		border-top: 2px solid #e6f4ea;
		background: #f8fafc;
	}

	.total-price {
		color: #16a34a;
	}

	.checkout-btn-popup {
		width: calc(100% - 4rem);
		margin: 1.5rem 2rem;
		padding: 1.2rem;
		background: linear-gradient(135deg, #86efac 0%, #22c55e 100%);
		color: white;
		border: none;
		border-radius: 16px;
		font-size: 1.2rem;
		font-weight: 700;
		cursor: pointer;
		box-shadow: 0 8px 24px rgba(34, 197, 94, 0.3);
	}

	.checkout-btn-popup:hover {
		background: linear-gradient(135deg, #4ade80 0%, #16a34a 100%);
	}

	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.75rem;
		margin: 4rem auto 2rem;
		flex-wrap: wrap;
	}

	.pagination-btn {
		width: 48px;
		height: 48px;
		border: 2px solid #d1fae5;
		background: white;
		color: #166534;
		border-radius: 50%;
		cursor: pointer;
		font-weight: 600;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.pagination-btn:hover:not(.disabled) {
		background: #ecfdf5;
		border-color: #86efac;
		transform: translateY(-2px);
	}

	.pagination-btn.active {
		background: linear-gradient(135deg, #86efac 0%, #22c55e 100%);
		color: white;
		border: none;
	}

	.pagination-btn.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.ellipsis {
		color: #9ca3af;
		font-weight: 500;
		padding: 0 1rem;
	}

	.empty-state {
		text-align: center;
		padding: 6rem 2rem;
		color: #6b7280;
		max-width: 400px;
		margin: 2rem auto;
	}

	.empty-state h3 {
		color: #166534;
		font-size: 1.5rem;
		margin: 1.5rem 0 0.5rem;
	}

	@media (max-width: 992px) {
		.menu-container {
			flex-direction: column;
		}
		.sidebar {
			width: 100%;
			height: auto;
			position: static;
			border-right: none;
			border-bottom: 1px solid #e6f4ea;
		}
		.category-tabs-vertical {
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: center;
			gap: 1rem;
		}
	}

	@media (max-width: 768px) {
		.floating-cart-btn {
			bottom: 20px;
			right: 20px;
			width: 56px;
			height: 56px;
		}
		.cart-badge {
			width: 20px;
			height: 20px;
			font-size: 0.8rem;
			top: -6px;
			right: -6px;
		}
		.menu-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 1.5rem;
		}
		.image-wrapper {
			height: 180px;
		}
		.price {
			font-size: 1.5rem;
		}
		.add-button {
			width: 44px;
			height: 44px;
			font-size: 1.5rem;
		}
	}
</style>
