<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';

  // Ambil data dari form action (error message atau success)
  export let form: ActionData;

  // State untuk disable button sementara submit
  let submitting = false;
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" >
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="container">
  <div class="left-side">
    <div class="login-box">
      <h1 class="title">Admin Login</h1>
      <p class="subtitle">Sign in to access Generational Coffee & Tea dashboard</p>

      <!-- Tampilkan error jika login gagal -->
      {#if form?.success === false}
        <p class="error-message">{form.message || 'Login gagal, periksa username dan password'}</p>
      {/if}

      <form
        method="POST"
        use:enhance={() => {
          submitting = true;
          return async ({ result }) => {
            submitting = false;
            // Jika redirect dari server, enhance akan handle otomatis
          };
        }}
      >
        <div class="input-group">
          <label for="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Enter your username"
            autocomplete="username"
            required
            disabled={submitting}
          />
        </div>

        <div class="input-group">
          <label for="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            autocomplete="current-password"
            required
            disabled={submitting}
          />
        </div>

        <button
          type="submit"
          class="btn-login"
          class:disabled={submitting}
          disabled={submitting}
        >
          {submitting ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p class="forgot-text">
        Forgot password? <a href="#">Contact IT</a>
      </p>
    </div>
  </div>

  <div class="right-side">
    <div class="image-container">
      <div class="spotlight-effect"></div>
      <div class="logo-container">
        <div class="aw-logo">Generational<br />Coffee & Tea</div>
      </div>
    </div>
  </div>
</div>

<style>
  /* Semua style kamu tetap sama, saya copy-paste utuh */
  :global(body, html) {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: hidden;
    font-family: 'Poppins', sans-serif;
  }
  .container {
    display: flex;
    flex-direction: row;
    height: 100vh;
    width: 100%;
  }
  .left-side {
    flex: 1;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 20px;
  }
  .login-box {
    width: 100%;
    max-width: 420px;
    text-align: center;
  }
  .title {
    font-size: 2.2rem;
    font-weight: 700;
    color: #2d2d2d;
    margin-bottom: 8px;
  }
  .subtitle {
    color: #666;
    font-size: 1.1rem;
    margin-bottom: 48px;
    opacity: 0.9;
  }
  .input-group {
    margin-bottom: 24px;
    text-align: left;
  }
  .input-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #333;
    font-size: 1rem;
  }
  .input-group input {
    width: 100%;
    padding: 16px 20px;
    border: 2px solid #e0e0e0;
    border-radius: 16px;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    background-color: #f9f9f9;
    box-sizing: border-box;
  }
  .input-group input:focus {
    outline: none;
    border-color: #22c55e;
    background-color: white;
    box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.15);
  }
  .btn-login {
    width: 100%;
    padding: 18px;
    background: #22c55e;
    color: white;
    border: none;
    border-radius: 50px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 16px;
  }
  .btn-login:hover:not(.disabled) {
    background: #16a34a;
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(34, 197, 94, 0.3);
  }
  .btn-login.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .forgot-text {
    margin-top: 32px;
    color: #666;
    font-size: 15px;
  }
  .forgot-text a {
    color: #22c55e;
    text-decoration: none;
    font-weight: 600;
  }
  .forgot-text a:hover {
    text-decoration: underline;
  }
  .right-side {
    flex: 1;
    background: #f8f8f8;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .image-container {
    position: relative;
    width: 90%;
    height: 90%;
    border-radius: 30px;
    overflow: hidden;
    background: url('https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2942&q=80') center/cover no-repeat;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  }
  .spotlight-effect {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 40%, rgba(0,0,0,0.2) 100%);
    z-index: 1;
  }
  .logo-container {
    position: absolute;
    bottom: 40px;
    right: 40px;
    z-index: 3;
  }
  .aw-logo {
    font-size: 52px;
    font-weight: 700;
    color: white;
    text-shadow: 0 4px 15px rgba(0,0,0,0.5);
    line-height: 1.2;
    text-align: right;
  }

  /* Error message style */
  .error-message {
    background-color: #fee2e2;
    color: #dc2626;
    padding: 12px 16px;
    border-radius: 12px;
    margin-bottom: 24px;
    font-size: 0.95rem;
    border: 1px solid #fecaca;
  }

  /* Responsive sama seperti aslinya */
  @media (max-width: 1024px) {
    .container {
      flex-direction: column;
    }
    .left-side {
      flex: 1;
      padding: 60px 20px;
    }
    .right-side {
      flex: 1;
      min-height: 40vh;
    }
    .aw-logo {
      font-size: 48px;
    }
  }
  @media (max-width: 768px) {
    .right-side {
      display: none;
    }
    .left-side {
      padding: 40px 20px;
    }
    .title {
      font-size: 2rem;
    }
    .subtitle {
      font-size: 1rem;
    }
    .input-group input {
      padding: 14px 18px;
      font-size: 1rem;
    }
    .btn-login {
      padding: 16px;
      font-size: 17px;
    }
  }
  @media (max-width: 480px) {
    .login-box {
      max-width: 100%;
      padding: 0 10px;
    }
    .title {
      font-size: 1.8rem;
    }
    .aw-logo {
      font-size: 40px;
    }
  }
</style>