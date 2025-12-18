<script>
    let phone = '';
    let selectedMode = 'member'; // Default: member
    const countryCode = '+60';
    const minLength = 9;

    function handleDigit(digit) {
        if (phone.length < 12) {
            phone += digit;
        }
    }

    function handleDelete() {
        phone = phone.slice(0, -1);
    }

    function handleSubmit() {
        if (phone.length >= minLength || selectedMode === 'non-member') {
            const fullNumber = countryCode + phone;
            console.log(`${selectedMode === 'member' ? 'Member' : 'Non-Member'} login attempt:`, fullNumber);
            // Logic lanjut ke OTP atau cashier mode
        }
    }

    $: isValid = phone.length >= minLength;
</script>

<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="container">
    <div class="left-side">
        <div class="login-box">

            <div class="mode-selector">
                <button
                    class="mode-btn"
                    class:active={selectedMode === 'member'}
                    on:click={() => selectedMode = 'member'}
                >
                    Member
                </button>
                <button
                    class="mode-btn"
                    class:active={selectedMode === 'non-member'}
                    on:click={() => selectedMode = 'non-member'}
                >
                    Non-Member
                </button>
            </div>

            {#if selectedMode === 'member'}
                <p class="subtitle">Enter your mobile number</p>
                <div class="phone-display">
                    <span class="country-code">{countryCode}</span>
                    <span class="phone-number">{phone || 'xx'}</span>
                </div>

                <div class="keypad">
                    {#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as num}
                        <button class="key" on:click={() => handleDigit(num)}>{num}</button>
                    {/each}
                    <div class="key empty"></div>
                    <button class="key" on:click={() => handleDigit(0)}>0</button>
                    <button class="key delete" on:click={handleDelete}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/>
                            <line x1="18" y1="9" x2="12" y2="15"/>
                            <line x1="12" y1="9" x2="18" y2="15"/>
                        </svg>
                    </button>
                </div>

                <button
                    class="btn-login"
                    class:disabled={!isValid}
                    on:click={handleSubmit}
                >
                    Continue
                </button>

                <p class="signup-text">
                    Don't have an account? <a href="/signup">Sign up</a>
                </p>
            {:else}
                <div class="non-member-content">
                    <p class="guest-message">You are logging in as a guest.</p>
                    <button class="btn-login guest" on:click={handleSubmit}>
                        Continue as Non-Member
                    </button>
                </div>
            {/if}
        </div>
    </div>

    <div class="right-side">
        <div class="image-container">
            <div class="spotlight-effect"></div>
            <div class="logo-container">
                <div class="aw-logo">Generational Coffee & Tea</div>
            </div>
        </div>
    </div>
</div>

<style>
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
        max-width: 380px;
        text-align: center;
    }

    .mode-selector {
        display: flex;
        background: #f0f0f0;
        border-radius: 50px;
        padding: 6px;
        margin-bottom: 40px;
        width: fit-content;
        margin-left: auto;
        margin-right: auto;
        box-shadow: inset 0 2px 10px rgba(0,0,0,0.05);
    }

    .mode-btn {
        padding: 10px 32px;
        border: none;
        border-radius: 50px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        background: transparent;
        color: #666;
    }

    .mode-btn.active {
        background: #000;
        color: white;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }

    .subtitle {
        color: #000;
        font-size: 16px;
        margin-bottom: 40px;
        opacity: 0.8;
    }

    .phone-display {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 12px;
        margin-bottom: 48px;
        font-size: 32px;
        font-weight: 500;
    }

    .country-code {
        color: #000;
        opacity: 0.9;
    }

    .phone-number {
        letter-spacing: 4px;
        color: #000;
        opacity: 0.8;
    }

    .keypad {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        max-width: 300px;
        margin: 0 auto 40px auto;
    }

    .key {
        aspect-ratio: 1;
        border-radius: 20px;
        border: none;
        font-size: 28px;
        font-weight: 500;
        color: #333;
        cursor: pointer;
        transition: all 0.3s ease;
        background: rgba(255, 255, 255, 0.25);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .key:hover { 
        transform: translateY(-6px); 
        background: rgba(255, 255, 255, 0.4); 
        box-shadow: 0 15px 35px rgba(0, 195, 255, 0.2); 
    }

    .key:active { transform: translateY(-2px); }

    .key.delete { 
        color: #ff6b6b; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
    }

    .key.empty { 
        background: transparent; 
        border: none; 
        box-shadow: none; 
        cursor: default; 
    }

    .btn-login {
        width: 100%;
        padding: 18px;
        background: linear-gradient(to right, #00c3ff, #007bff);
        color: white;
        border: none;
        border-radius: 50px;
        font-size: 18px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
    }

    .btn-login.guest {
        background: #333;
    }

    .btn-login.disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .btn-login:hover:not(.disabled) {
        transform: translateY(-3px);
        box-shadow: 0 15px 30px rgba(0, 123, 255, 0.4);
    }

    .non-member-content {
        margin-top: 60px;
    }

    .guest-message {
        font-size: 18px;
        color: #000;
        margin-bottom: 40px;
        opacity: 0.9;
    }

    .signup-text {
        margin-top: 40px;
        color: #000;
        font-size: 15px;
        opacity: 0.8;
    }

    .signup-text a {
        color: #00c3ff;
        text-decoration: none;
        font-weight: 500;
    }

    .signup-text a:hover { text-decoration: underline; }

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
        background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 30%, rgba(0,0,0,0.1) 70%, rgba(0,0,0,0.3) 100%);
        z-index: 1;
    }

    .logo-container {
        position: absolute;
        bottom: 40px;
        right: 40px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        z-index: 3;
    }

    .aw-logo {
        font-size: 60px;
        font-weight: bold;
        color: white;
        text-shadow: 0 2px 10px rgba(0,0,0,0.4);
    }

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

        .phone-display {
            font-size: 28px;
        }

        .keypad {
            gap: 15px;
            max-width: 280px;
        }

        .key {
            font-size: 24px;
        }

        .mode-btn {
            padding: 8px 24px;
            font-size: 15px;
        }

        .aw-logo {
            font-size: 40px;
        }

        .subtitle, .guest-message {
            font-size: 15px;
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

        .phone-display {
            font-size: 24px;
        }

        .keypad {
            gap: 12px;
        }

        .key {
            font-size: 22px;
        }

        .mode-selector {
            margin-bottom: 30px;
        }

        .aw-logo {
            font-size: 36px;
        }
    }
</style>