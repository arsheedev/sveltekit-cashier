<script lang="ts">
  import favicon from '$lib/assets/favicon.svg';
  let { children } = $props();
  const cartCount = 3;
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<nav class="navbar">
  <div class="logo">
    Generational<br />Coffee & Tea
  </div>

  <div class="search-container">
    <input type="text" placeholder="Cari menu..." class="search-input" />
    <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  </div>

  <button class="cart-button" aria-label="Keranjang">
    <div class="cart-wrapper">
      <svg class="cart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
      {#if cartCount > 0}
        <span class="cart-badge">{cartCount}</span>
      {/if}
    </div>
  </button>
</nav>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
  * {
    font-family: 'Poppins', sans-serif;
  }

  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #ffffff;
    padding: 1rem 4%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    position: sticky;
    top: 0;
    z-index: 1000;
  }

  .logo {
    font-size: 1.6rem;
    font-weight: 700;
    color: #2d2d2d;
    white-space: nowrap;
    line-height: 1.2;
  }

  .search-container {
    flex: 1;
    max-width: 720px;
    margin: 0 2rem;
    position: relative;
  }

  .search-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.8rem;
    border: 1px solid #e0e0e0;
    border-radius: 30px;
    font-size: 1rem;
    outline: none;
    transition: all 0.3s ease;
    background-color: #f9f9f9;
  }

  .search-input:focus {
    border-color: #22c55e;
    box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.15);
    background-color: #ffffff;
  }

  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1.3rem;
    height: 1.3rem;
    color: #777;
    transition: color 0.3s ease;
  }

  .search-input:focus ~ .search-icon {
    color: #22c55e;
  }

  .cart-button {
    background: none;
    border: none;
    padding: 0.75rem;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .cart-button:hover {
    background-color: #f5f5f5;
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .cart-button:hover .cart-icon {
    stroke-width: 2.5;
    color: #111;
  }

  .cart-wrapper {
    position: relative;
  }

  .cart-icon {
    width: 1.7rem;
    height: 1.7rem;
    color: #333;
    transition: all 0.3s ease;
  }

  .cart-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: #22c55e;
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    min-width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
  }

  @media (max-width: 768px) {
    .navbar {
      padding: 1rem 5%;
    }
    .search-container {
      display: none; 
    }
    .logo {
      font-size: 1.4rem;
    }
  }
</style>

{@render children()}