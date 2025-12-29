<script lang="ts">
	import { page } from '$app/stores';
	import favicon from '$lib/assets/favicon.svg';
	import { derived } from 'svelte/store';

	let { children } = $props();

	const currentPath = derived(page, ($page) => $page.url.pathname);

	let openSubmenu = $state<string | null>(null);

	const menuItems = [
		{
			title: 'Products',
			icon: `<path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>`,
			href: '/admin/dashboard/products/showcase',
			submenus: [
				{ title: 'Add Product', href: '/admin/dashboard/products/add' },
				{ title: 'Product Showcase', href: '/admin/dashboard/products/showcase' }
			]
		},
		{
			title: 'Vouchers',
			icon: `<path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>`,
			href: '/admin/dashboard/vouchers/list',
			submenus: [
				{ title: 'Add Voucher', href: '/admin/dashboard/vouchers/add' },
				{ title: 'Voucher List', href: '/admin/dashboard/vouchers' }
			]
		}
	];

	const logoutItem = {
		title: 'Logout',
		icon: `<path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>`,
		href: '/admin/logout'
	};

	function toggleSubmenu(title: string) {
		openSubmenu = openSubmenu === title ? null : title;
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="admin-layout">
	<aside class="sidebar">
		<div class="sidebar-header">
			<div class="logo">Generational<br />Coffee & Tea</div>
			<p class="admin-text">Admin Panel</p>
		</div>

		<nav class="sidebar-nav">
			{#each menuItems as item}
				<div class="menu-item-wrapper">
					{#if item.submenus}
						<button
							type="button"
							class="menu-item"
							class:active={$currentPath.includes('/products') ||
								$currentPath.includes('/vouchers')}
							onclick={() => toggleSubmenu(item.title)}
						>
							<svg
								class="menu-icon"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								{@html item.icon}
							</svg>
							<span>{item.title}</span>
							<svg
								class="chevron"
								class:rotated={openSubmenu === item.title}
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<path d="M19 9l-7 7-7-7"></path>
							</svg>
						</button>
					{:else}
						<a href={item.href} class="menu-item" class:active={$currentPath.startsWith(item.href)}>
							<svg
								class="menu-icon"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								{@html item.icon}
							</svg>
							<span>{item.title}</span>
						</a>
					{/if}

					{#if item.submenus && openSubmenu === item.title}
						<div class="submenu">
							{#each item.submenus as sub}
								<a href={sub.href} class="submenu-item" class:active={$currentPath === sub.href}>
									{sub.title}
								</a>
							{/each}
						</div>
					{/if}
				</div>
			{/each}
		</nav>

		<div class="logout-section">
			<form action="/admin/logout" method="post">
				<button
					type="submit"
					class="logout-button menu-item"
					class:active={$currentPath.startsWith(logoutItem.href)}
				>
					<svg
						class="menu-icon"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						{@html logoutItem.icon}
					</svg>
					<span>{logoutItem.title}</span>
				</button>
			</form>
		</div>
	</aside>

	<main class="main-content">
		{@render children()}
	</main>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
	* {
		font-family: 'Poppins', sans-serif;
	}

	.admin-layout {
		display: flex;
		min-height: 100vh;
		background-color: #f9fafb;
	}

	.sidebar {
		width: 280px;
		background-color: #ffffff;
		border-right: 1px solid #e5e7eb;
		display: flex;
		flex-direction: column;
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		z-index: 1000;
		overflow-y: auto;
	}

	.sidebar-header {
		padding: 2rem 1.5rem;
		border-bottom: 1px solid #e5e7eb;
		text-align: center;
	}
	.logo {
		font-size: 1.8rem;
		font-weight: 700;
		color: #22c55e;
		line-height: 1.2;
	}
	.admin-text {
		font-size: 0.9rem;
		color: #666;
		margin-top: 0.5rem;
		font-weight: 500;
	}

	.sidebar-nav {
		padding: 1rem 0;
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.menu-item,
	.menu-item-wrapper > button {
		width: 100%;
		display: flex;
		align-items: center;
		padding: 0.9rem 1.5rem;
		color: #374151;
		background: none;
		border: none;
		cursor: pointer;
		text-align: left;
		text-decoration: none;
		transition: all 0.3s ease;
	}

	.menu-item:hover,
	.menu-item-wrapper > button:hover {
		background-color: #f3f4f6;
		color: #22c55e;
	}

	.menu-item.active,
	.menu-item-wrapper > button.active {
		background-color: #ecfdf5;
		color: #22c55e;
		font-weight: 600;
		border-left: 4px solid #22c55e;
	}

	.menu-icon {
		width: 1.4rem;
		height: 1.4rem;
		margin-right: 1rem;
		flex-shrink: 0;
	}
	.chevron {
		width: 1rem;
		height: 1rem;
		margin-left: auto;
		transition: transform 0.3s ease;
	}
	.chevron.rotated {
		transform: rotate(180deg);
	}

	.submenu {
		background-color: #f9fafb;
	}
	.submenu-item {
		display: block;
		padding: 0.75rem 1.5rem 0.75rem 4.5rem;
		color: #555;
		text-decoration: none;
		font-size: 0.95rem;
		transition: all 0.2s ease;
	}
	.submenu-item:hover {
		background-color: #ecfdf5;
		color: #22c55e;
		padding-left: 5rem;
	}
	.submenu-item.active {
		color: #22c55e;
		font-weight: 600;
		background-color: #ecfdf5;
	}

	.logout-section {
		margin-top: auto;
		border-top: 1px solid #e5e7eb;
		padding: 1rem 0;
	}

	.logout-button {
		color: #dc2626 !important;
	}

	.logout-button:hover {
		background-color: #fef2f2 !important;
		color: #dc2626 !important;
	}

	.logout-button.active {
		background-color: #fef2f2 !important;
		color: #dc2626 !important;
		border-left: 4px solid #dc2626 !important;
	}

	.main-content {
		flex: 1;
		margin-left: 280px;
		padding: 2rem;
	}

	@media (max-width: 1024px) {
		.sidebar {
			width: 80px;
		}
		.main-content {
			margin-left: 80px;
		}
		.logo,
		.admin-text,
		.menu-item span,
		.submenu-item,
		.chevron {
			display: none;
		}
		.menu-item,
		.menu-item-wrapper > button {
			justify-content: center;
			padding: 1rem;
		}
		.menu-icon {
			margin-right: 0;
		}
		.logout-section {
			border-top: 1px solid #e5e7eb;
		}
	}
</style>
