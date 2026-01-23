<script lang="ts">
  import { activeCategory } from '$lib/stores/menuStore';
  import favicon from '$lib/assets/favicon.svg';
  import { fade, slide } from 'svelte/transition';

  let props = $props();
  const typeStuffs = props.data?.typeStuffs || [];
  const children = props.children; 
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="menu-container">
  <!-- Sidebar / Aside -->
  <aside class="sidebar">
    <h1 class="menu-title">Our Menu</h1>
    <div class="category-tabs-vertical">
      <button
        class="tab-button-v"
        class:active={$activeCategory === 'all'}
        onclick={() => $activeCategory = 'all'}
      >
        All Items
      </button>
      {#each typeStuffs as typeStuff}
        <button
          class="tab-button-v"
          class:active={$activeCategory === typeStuff.id.toString()}
          onclick={() => $activeCategory = typeStuff.id.toString()}
        >
          {typeStuff.name}
        </button>
      {/each}
    </div>
  </aside>

  <!-- Konten utama -->
  <div class="menu-content">
    {@render children()}
  </div>
</div>

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
    overflow: hidden;
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
</style>