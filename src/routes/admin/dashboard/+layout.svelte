<script lang="ts">
	import { page } from '$app/stores';
	import favicon from '$lib/assets/favicon.svg';
	import { derived } from 'svelte/store';

	let { children } = $props();

	const currentPath = derived(page, ($page) => $page.url.pathname);

	let openSubmenu = $state<string | null>(null);
	let isCollapsed = $state(false);

	const menuItems = [
		{
			title: 'Stuff Categories',
			icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M4 7V5C4 4.44772 4.44772 4 5 4H8C8.55228 4 9 4.44772 9 5V7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
				<path d="M9 7H4V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V7H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M15 4H19C19.5523 4 20 4.44772 20 5V7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
				<rect x="7" y="11" width="10" height="2" rx="1" fill="currentColor"/>
				<rect x="7" y="15" width="6" height="2" rx="1" fill="currentColor"/>
			</svg>`,
			href: '/admin/dashboard/stuff-categories',
			submenus: [
				{ title: 'Category List', href: '/admin/dashboard/stuff-categories/list', icon: '📋' },
				{ title: 'Add Category', href: '/admin/dashboard/stuff-categories/add', icon: '➕' }
			]
		},
		{
			title: 'Products',
			icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org2000/svg">
				<rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
				<path d="M3 9H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
				<circle cx="8" cy="6" r="1" fill="currentColor"/>
				<circle cx="8" cy="12" r="1" fill="currentColor"/>
				<circle cx="8" cy="18" r="1" fill="currentColor"/>
			</svg>`,
			href: '/admin/dashboard/products/showcase',
			submenus: [
				{ title: 'Product Showcase', href: '/admin/dashboard/products/showcase', icon: '🖼️' },
				{ title: 'Add Product', href: '/admin/dashboard/products/add', icon: '➕' }
			]
		},
		{
			title: 'Vouchers',
			icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<rect x="3" y="8" width="18" height="12" rx="2" stroke="currentColor" stroke-width="2"/>
				<path d="M3 12H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
				<path d="M8 8V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
				<circle cx="12" cy="15" r="1" fill="currentColor"/>
			</svg>`,
			href: '/admin/dashboard/vouchers',
			submenus: [
				{ title: 'Voucher List', href: '/admin/dashboard/vouchers', icon: '📜' },
				{ title: 'Add Voucher', href: '/admin/dashboard/vouchers/add', icon: '➕' }
			]
		}
	];

	const logoutItem = {
		title: 'Logout',
		icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M16 17L21 12L16 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
			<path d="M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
			<path d="M9 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
		</svg>`,
		href: '/admin/logout'
	};

	$effect(() => {
		const path = $currentPath;
		for (const item of menuItems) {
			if (item.submenus) {
				const isActive = item.submenus.some(sub => sub.href === path);
				if (isActive) {
					openSubmenu = item.title;
					break;
				}
			}
		}
	});

	function toggleSubmenu(title: string) {
		openSubmenu = openSubmenu === title ? null : title;
	}

	function toggleSidebar() {
		isCollapsed = !isCollapsed;
		if (isCollapsed) {
			openSubmenu = null; 
		}
	}

	function isMenuItemActive(item: any): boolean {
		if (item.submenus) {
			return item.submenus.some((sub: any) => $currentPath === sub.href);
		}
		return $currentPath.startsWith(item.href);
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="admin-layout">
	<aside class="sidebar {isCollapsed ? 'collapsed' : ''}">
		<div class="sidebar-header">
			<div class="logo-section">
				<div class="logo-avatar">A</div>
				{#if !isCollapsed}
					<div class="logo-text">
						<span class="logo-title">Generational</span>
						<span class="logo-subtitle">Coffee & Tea</span>
					</div>
				{/if}
			</div>
			<button class="sidebar-toggle" onclick={toggleSidebar} aria-label="Toggle sidebar">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M15 18l-6-6 6-6"></path>
				</svg>
			</button>
		</div>

		<nav class="sidebar-nav">
			{#each menuItems as item}
				<div class="menu-item-wrapper">
					<button
						type="button"
						class="menu-item {isMenuItemActive(item) ? 'active' : ''} {isCollapsed ? 'collapsed' : ''}"
						onclick={() => toggleSubmenu(item.title)}
						title={isCollapsed ? item.title : ''}
					>
						<div class="menu-icon">
							{@html item.icon}
						</div>
						{#if !isCollapsed}
							<span class="menu-title">{item.title}</span>
							<svg 
								class="chevron {openSubmenu === item.title ? 'rotated' : ''}"
								viewBox="0 0 24 24" 
								fill="none" 
								stroke="currentColor" 
								stroke-width="2"
							>
								<path d="M6 9l6 6 6-6"></path>
							</svg>
						{/if}
					</button>
					
					{#if openSubmenu === item.title && !isCollapsed && item.submenus}
						<div class="submenu">
							{#each item.submenus as sub}
								<a 
									href={sub.href} 
									class="submenu-item {$currentPath === sub.href ? 'active' : ''}"
								>
									<span class="submenu-icon">{sub.icon}</span>
									<span class="submenu-title">{sub.title}</span>
								</a>
							{/each}
						</div>
					{/if}
				</div>
			{/each}
		</nav>

		<div class="logout-section {isCollapsed ? 'collapsed' : ''}">
			<form action="/logout" method="post">
				<button
					type="submit"
					class="logout-button {isCollapsed ? 'collapsed' : ''}"
					title={isCollapsed ? 'Logout' : ''}
				>
					<div class="menu-icon">
						{@html logoutItem.icon}
					</div>
					{#if !isCollapsed}
						<span class="menu-title">{logoutItem.title}</span>
					{/if}
				</button>
			</form>
		</div>
	</aside>

	<main class="main-content {isCollapsed ? 'collapsed' : ''}">
		{@render children()}
	</main>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
	
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: 'Inter', system-ui, -apple-system, sans-serif;
		background: linear-gradient(135deg, #f0fdf4 0%, #f7fafc 100%);
	}

	.admin-layout {
		display: flex;
		min-height: 100vh;
		background: linear-gradient(135deg, #f0fdf4 0%, #f7fafc 100%);
	}

	.sidebar {
		width: 280px;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(20px);
		border-right: 1px solid rgba(16, 185, 129, 0.1);
		display: flex;
		flex-direction: column;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 4px 0 20px rgba(0, 0, 0, 0.05);
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		z-index: 1000;
		overflow-y: auto;
		overflow-x: hidden;
	}

	.sidebar.collapsed {
		width: 80px;
	}

	.sidebar-header {
		padding: 24px 20px;
		border-bottom: 1px solid rgba(16, 185, 129, 0.1);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.logo-section {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.logo-avatar {
		width: 48px;
		height: 48px;
		background: linear-gradient(135deg, #10b981, #059669);
		color: white;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 20px;
		box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
	}

	.logo-text {
		display: flex;
		flex-direction: column;
	}

	.logo-title {
		font-size: 20px;
		font-weight: 800;
		color: #065f46;
		line-height: 1.2;
	}

	.logo-subtitle {
		font-size: 14px;
		color: #059669;
		font-weight: 500;
		opacity: 0.9;
	}

	.sidebar-toggle {
		width: 36px;
		height: 36px;
		border: 2px solid #d1fae5;
		background: white;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.3s ease;
		color: #059669;
	}

	.sidebar-toggle:hover {
		background: #f0fdf4;
		border-color: #86efac;
		transform: rotate(180deg);
	}

	.sidebar-toggle svg {
		width: 20px;
		height: 20px;
	}

	.sidebar.collapsed .sidebar-toggle svg {
		transform: rotate(180deg);
	}

	.sidebar-nav {
		padding: 20px 0;
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.menu-item-wrapper {
		position: relative;
	}

	.menu-item {
		width: 100%;
		display: flex;
		align-items: center;
		padding: 16px 20px;
		color: #374151;
		background: transparent;
		border: none;
		cursor: pointer;
		text-decoration: none;
		transition: all 0.3s ease;
		gap: 12px;
		position: relative;
		overflow: hidden;
	}

	.menu-item:hover {
		background: #f0fdf4;
		color: #065f46;
		transform: translateX(4px);
	}

	.menu-item.active {
		background: linear-gradient(90deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));
		color: #065f46;
		font-weight: 600;
	}

	.menu-item.active::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 4px;
		background: linear-gradient(to bottom, #10b981, #059669);
		border-radius: 0 4px 4px 0;
	}

	.menu-item.collapsed {
		justify-content: center;
		padding: 16px;
	}

	.menu-icon {
		width: 24px;
		height: 24px;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.menu-icon svg {
		width: 100%;
		height: 100%;
		color: currentColor;
	}

	.menu-title {
		flex: 1;
		font-size: 15px;
		font-weight: 500;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: left;
	}

	.chevron {
		width: 20px;
		height: 20px;
		flex-shrink: 0;
		transition: transform 0.3s ease;
	}

	.chevron.rotated {
		transform: rotate(180deg);
	}

	/* Submenu */
	.submenu {
		background: rgba(240, 253, 244, 0.5);
		border-radius: 0 0 12px 12px;
		overflow: hidden;
		margin: 0 20px 8px;
		animation: slideDown 0.3s ease;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.submenu-item {
		display: flex;
		align-items: center;
		padding: 12px 20px;
		color: #4b5563;
		text-decoration: none;
		font-size: 14px;
		transition: all 0.2s ease;
		gap: 12px;
	}

	.submenu-item:hover {
		background: rgba(16, 185, 129, 0.1);
		color: #065f46;
		padding-left: 24px;
	}

	.submenu-item.active {
		background: rgba(16, 185, 129, 0.15);
		color: #065f46;
		font-weight: 600;
	}

	.submenu-icon {
		font-size: 16px;
		width: 24px;
		text-align: center;
	}

	.submenu-title {
		flex: 1;
	}

	.logout-section {
		margin-top: auto;
		padding: 20px;
		border-top: 1px solid rgba(16, 185, 129, 0.1);
	}

	.logout-button {
		width: 100%;
		display: flex;
		align-items: center;
		padding: 16px 20px;
		background: linear-gradient(135deg, #fee2e2, #fecaca);
		color: #dc2626;
		border: none;
		border-radius: 12px;
		cursor: pointer;
		font-weight: 600;
		transition: all 0.3s ease;
		gap: 12px;
		box-shadow: 0 4px 12px rgba(239, 68, 68, 0.1);
	}

	.logout-button:hover {
		background: linear-gradient(135deg, #fecaca, #fca5a5);
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(239, 68, 68, 0.2);
	}

	.logout-button.collapsed {
		justify-content: center;
		padding: 16px;
	}

	.main-content {
		flex: 1;
		margin-left: 280px;
		padding: 24px;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		min-height: 100vh;
	}

	.main-content.collapsed {
		margin-left: 80px;
	}

	.menu-item[title]:hover::after,
	.logout-button[title]:hover::after {
		content: attr(title);
		position: absolute;
		left: calc(100% + 10px);
		top: 50%;
		transform: translateY(-50%);
		background: #065f46;
		color: white;
		padding: 8px 12px;
		border-radius: 8px;
		font-size: 13px;
		font-weight: 500;
		white-space: nowrap;
		z-index: 1001;
		pointer-events: none;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.menu-item[title]:hover::before,
	.logout-button[title]:hover::before {
		content: '';
		position: absolute;
		left: 100%;
		top: 50%;
		transform: translateY(-50%);
		border: 5px solid transparent;
		border-right-color: #065f46;
		z-index: 1002;
	}

	@media (max-width: 1024px) {
		.sidebar {
			transform: translateX(-100%);
		}
		
		.sidebar.collapsed {
			transform: translateX(0);
			width: 80px;
		}
		
		.main-content {
			margin-left: 0;
		}
		
		.main-content.collapsed {
			margin-left: 80px;
		}
	}

	@media (max-width: 768px) {
		.sidebar {
			width: 280px;
			transform: translateX(-100%);
		}
		
		.sidebar.collapsed {
			transform: translateX(0);
			width: 280px;
		}
		
		.main-content.collapsed {
			margin-left: 0;
		}
	}

	.sidebar::-webkit-scrollbar {
		width: 6px;
	}

	.sidebar::-webkit-scrollbar-track {
		background: rgba(16, 185, 129, 0.05);
		border-radius: 10px;
	}

	.sidebar::-webkit-scrollbar-thumb {
		background: linear-gradient(135deg, #86efac, #10b981);
		border-radius: 10px;
	}

	.sidebar::-webkit-scrollbar-thumb:hover {
		background: linear-gradient(135deg, #10b981, #059669);
	}
</style>