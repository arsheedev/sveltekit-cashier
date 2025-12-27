<script lang="ts">
  import { fade } from 'svelte/transition';

  let activeCategory: 'all' | 'food' | 'beverages' = 'all';
  let currentPage = 1;
  const itemsPerPage = 8;

  const menuItems = [
    { id: 1, category: 'food', name: 'Cheesy Burger', desc: 'Juicy beef patty with melted cheddar cheese', price: 11.99, img: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800&q=80' },
    { id: 2, category: 'food', name: 'Spicy Chicken Wings', desc: 'Crispy wings tossed in spicy sauce', price: 7.99, img: 'https://media.istockphoto.com/id/835903320/photo/baked-chicken-wings-with-sesame-seeds-and-sweet-chili-sauce-on-white-wooden-board.jpg?w=800&q=80' },
    { id: 3, category: 'food', name: 'Classic French Fries', desc: 'Crispy golden fries with dipping sauce', price: 3.21, img: 'https://thumbs.dreamstime.com/b/french-fries-ketchup-mustard-wooden-background-side-dish-traditional-american-food-french-fries-ketchup-mustard-176193582.jpg?w=800&q=80' },
    { id: 4, category: 'beverages', name: 'Espresso', desc: 'Rich and bold single shot espresso', price: 3.50, img: 'https://media.istockphoto.com/id/1358132613/photo/refreshing-hot-cup-of-coffee-at-a-cafe.jpg?w=800&q=80' },
    { id: 5, category: 'beverages', name: 'Iced Latte', desc: 'Smooth espresso with cold milk and ice', price: 4.99, img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80' },
    { id: 6, category: 'beverages', name: 'Cappuccino', desc: 'Espresso with steamed milk foam and art', price: 4.50, img: 'https://media.istockphoto.com/id/1365835656/photo/a-cup-of-coffee-latte-on-a-wooden-table.jpg?w=800&q=80' },
    { id: 7, category: 'food', name: 'Grilled Cheese Sandwich', desc: 'Toasted bread with melted cheese', price: 6.99, img: 'https://images.unsplash.com/photo-1559314809-0f31657e9e39?w=800&q=80' },
    { id: 8, category: 'food', name: 'Chicken Nuggets', desc: 'Crispy golden chicken bites', price: 5.49, img: 'https://images.unsplash.com/photo-1606853731005-19e3b3c32c0a?w=800&q=80' },
    { id: 9, category: 'beverages', name: 'Hot Chocolate', desc: 'Rich chocolate with marshmallows', price: 4.25, img: 'https://images.unsplash.com/photo-1572492047507-e0e9fa9e4d18?w=800&q=80' },
    { id: 10, category: 'beverages', name: 'Green Tea', desc: 'Fresh brewed green tea', price: 3.25, img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&q=80' },
    { id: 11, category: 'food', name: 'Onion Rings', desc: 'Crispy battered onion rings', price: 4.75, img: 'https://images.unsplash.com/photo-1551218808-94e220e084d0?w=800&q=80' },
    { id: 12, category: 'food', name: 'Caesar Salad', desc: 'Fresh greens with caesar dressing', price: 8.99, img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80' },
  ];

  $: filteredItems = menuItems.filter(item =>
    activeCategory === 'all' || item.category === activeCategory
  );

  $: totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  $: currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  $: activeCategory, (currentPage = 1);

  $: pageNumbers = (() => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  })();

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) currentPage = page;
  }

  function nextPage() {
    if (currentPage < totalPages) currentPage += 1;
  }

  function prevPage() {
    if (currentPage > 1) currentPage -= 1;
  }
</script>

<div class="menu-container">
  <!-- Sidebar Kiri -->
  <aside class="sidebar">
    <h1 class="menu-title">Our Menu</h1>
    <div class="category-tabs-vertical">
      <button class="tab-button-v" class:active={activeCategory === 'all'} on:click={() => activeCategory = 'all'}>All</button>
      <button class="tab-button-v" class:active={activeCategory === 'food'} on:click={() => activeCategory = 'food'}>Food</button>
      <button class="tab-button-v" class:active={activeCategory === 'beverages'} on:click={() => activeCategory = 'beverages'}>Beverages</button>
    </div>
  </aside>

  <!-- Grid Menu Kanan -->
  <div class="menu-content">
    <div class="menu-grid">
      {#each currentItems as item (item.id)}
        <div
          class="menu-card"
          in:fade={{ duration: 300 }}
          out:fade={{ duration: 200 }}
        >
          <img src={item.img} alt={item.name} class="menu-image" />
          <div class="card-content">
            <h3 class="item-name">{item.name}</h3>
            <p class="item-desc">{item.desc}</p>
            <div class="card-footer">
              <span class="price">${item.price.toFixed(2)}</span>
              <button class="add-button" aria-label="Add to cart">+</button>
            </div>
          </div>
        </div>
      {/each}
    </div>

    <!-- Pagination -->
    {#if totalPages > 1}
      <div class="pagination">
        <button class="pagination-btn" class:disabled={currentPage === 1} on:click={prevPage} aria-label="Previous page">
          ←
        </button>

        {#each pageNumbers as page}
          {#if page === currentPage}
            <button class="pagination-btn active">{page}</button>
          {:else}
            <button class="pagination-btn" on:click={() => goToPage(page)}>{page}</button>
          {/if}
        {/each}

        {#if totalPages > pageNumbers[pageNumbers.length - 1] && pageNumbers.length < totalPages}
          <span class="ellipsis">...</span>
        {/if}

        <button class="pagination-btn" class:disabled={currentPage === totalPages} on:click={nextPage} aria-label="Next page">
          →
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
  * { font-family: 'Poppins', sans-serif; }

  .menu-container {
    display: flex;
    min-height: 100vh;
    background: #fff;
  }

  /* Sidebar Kiri */
  .sidebar {
    width: 280px;
    padding: 2rem 1.5rem;
    border-right: 1px solid #eee;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
    flex-shrink: 0;
  }

  .menu-title {
    font-size: 2rem;
    font-weight: 700;
    color: #2d2d2d;
    margin-bottom: 2rem;
  }

  .category-tabs-vertical {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .tab-button-v {
    padding: 1rem 1.5rem;
    font-size: 1.1rem;
    font-weight: 600;
    text-align: left;
    border: none;
    border-radius: 12px;
    background-color: #f0f0f0;
    color: #555;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .tab-button-v:hover {
    background-color: #e0e0e0;
  }

  .tab-button-v.active {
    background-color: #22c55e;
    color: white;
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
  }

  /* Content Kanan */
  .menu-content {
    flex: 1;
    padding: 2rem 5%;
    display: flex;
    flex-direction: column;
  }

  .menu-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 380px));
    gap: 2rem;
    max-width: 1600px;
    margin: 0 auto;
    flex-grow: 1;
    justify-content: start;
  }

  .menu-card {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    max-width: 380px;
    margin: 0 auto;
  }

  .menu-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  }

  .menu-image {
    width: 100%;
    height: 240px;
    object-fit: cover;
  }

  .card-content {
    padding: 1.5rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .item-name {
    font-size: 1.4rem;
    font-weight: 600;
    color: #2d2d2d;
    margin: 0 0 0.75rem;
  }

  .item-desc {
    font-size: 1rem;
    color: #666;
    margin: 0 0 auto;
    line-height: 1.5;
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.5rem;
  }

  .price {
    font-size: 1.5rem;
    font-weight: 700;
    color: #22c55e;
  }

  .add-button {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: #22c55e;
    color: white;
    font-size: 1.8rem;
    font-weight: bold;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .add-button:hover {
    background-color: #16a34a;
    transform: scale(1.15);
  }

  /* Pagination */
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin-top: 3rem;
    padding: 1rem 0;
  }

  .pagination-btn {
    width: 44px;
    height: 44px;
    border: 2px solid #e0e0e0;
    background: white;
    color: #666;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pagination-btn:hover:not(.disabled) {
    border-color: #22c55e;
    color: #22c55e;
    background-color: #f0fdf4;
  }

  .pagination-btn.active {
    border-color: #22c55e;
    background-color: #22c55e;
    color: white;
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
  }

  .pagination-btn.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    color: #ccc;
  }

  .ellipsis {
    color: #999;
    font-size: 1.1rem;
    padding: 0 1rem;
  }

  /* Responsive */
  @media (max-width: 992px) {
    .menu-container {
      flex-direction: column;
    }
    .sidebar {
      width: 100%;
      height: auto;
      position: static;
      border-right: none;
      border-bottom: 1px solid #eee;
      padding: 1.5rem 5%;
    }
    .category-tabs-vertical {
      flex-direction: row;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .tab-button-v {
      padding: 0.8rem 1.8rem;
      font-size: 1rem;
    }
    .menu-content {
      padding: 2rem 5%;
    }
  }

  @media (max-width: 768px) {
    .menu-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1.2rem;
      justify-content: center;
    }
    .menu-card {
      max-width: none;
    }
    .menu-image {
      height: 160px;
    }
    .card-content {
      padding: 1rem;
    }
    .item-name {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
    }
    .item-desc {
      font-size: 0.9rem;
      line-height: 1.3;
      margin-bottom: 0.8rem;
    }
    .card-footer {
      margin-top: 0.8rem;
    }
    .price {
      font-size: 1.25rem;
    }
    .add-button {
      width: 40px;
      height: 40px;
      font-size: 1.4rem;
    }
    .pagination {
      margin-top: 2rem;
      gap: 0.4rem;
    }
    .pagination-btn {
      width: 36px;
      height: 36px;
      font-size: 0.9rem;
    }
  }

  @media (max-width: 480px) {
    .menu-grid {
      gap: 1rem;
    }
    .menu-image {
      height: 150px;
    }
    .card-content {
      padding: 0.9rem;
    }
    .item-name {
      font-size: 1.05rem;
    }
    .price {
      font-size: 1.2rem;
    }
    .add-button {
      width: 38px;
      height: 38px;
    }
  }
</style>