<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageProps } from './$types';
    import { slide } from 'svelte/transition';

    const { form }: PageProps = $props();

    let loading = $state(false);
    let type = $state<'fixed' | 'percentage' | 'manual_upgrade' | ''>('');
</script>

<svelte:head>
    <title>Add New Voucher | Admin</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="wrapper">
    <div class="card">
        <div class="header">
            <h1>Add New Voucher</h1>
            <p class="subtitle">Create a special discount code for your loyal customers</p>
        </div>

        {#if form?.success}
            <div class="alert success">
                <strong>Success!</strong> {form.message}
            </div>
        {:else if form?.message}
            <div class="alert error">
                <strong>Error:</strong> {form.message}
            </div>
        {/if}

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
                    <input name="code" type="text" required placeholder="e.g. WELCOME50" />
                </div>

                <div class="field">
                    <label>Voucher Type <span class="required">*</span></label>
                    <div class="select-wrapper">
                        <select name="type" bind:value={type} required>
                            <option value="" disabled selected>Select type</option>
                            <option value="fixed">Fixed Amount</option>
                            <option value="percentage">Percentage (%)</option>
                            <option value="manual_upgrade">Manual Upgrade</option>
                        </select>
                        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                </div>

                <!-- Discount Value Field -->
                <div class="field discount-field">
                    {#if type === 'fixed' || type === 'percentage'}
                        <div transition:slide={{ duration: 400 }}>
                            <label>
                                Discount Value
                                {#if type === 'fixed'}
                                    (in SGD, e.g. 50.00)
                                {:else if type === 'percentage'}
                                    (in %, e.g. 15, max 100)
                                {/if}
                                <span class="required">*</span>
                            </label>
                            <input
                                name="discountValue"
                                type="number"
                                min={type === 'percentage' ? 1 : 0.01}
                                max={type === 'percentage' ? 100 : undefined}
                                step={type === 'fixed' ? 0.01 : 1}
                                required
                                placeholder={type === 'fixed' ? 'e.g. 50.00' : 'e.g. 15'}
                            />
                        </div>
                    {:else if type === 'manual_upgrade'}
                        <div transition:slide={{ duration: 400 }} class="disabled-hint">
                            <em>Discount value not applicable for Manual Upgrade</em>
                        </div>
                        <input name="discountValue" type="hidden" value="0" />
                    {:else}
                        <div class="placeholder-hint">
                            <em>Select a voucher type to configure discount</em>
                        </div>
                    {/if}
                </div>

                <div class="field">
                    <label>Points Required <small>(optional, default 0)</small></label>
                    <input name="pointsRequired" type="number" min="0" placeholder="0" />
                </div>
            </div>

            <div class="field full">
                <label>Voucher Description <span class="required">*</span></label>
                <textarea
                    name="description"
                    rows="5"
                    required
                    placeholder="Describe the benefits, terms, and validity period of this voucher..."
                ></textarea>
            </div>

            <div class="actions">
                <button type="submit" class="btn-primary" disabled={loading}>
                    {#if loading}
                        <span class="spinner"></span>
                    {:else}
                        Save Voucher
                    {/if}
                </button>
                <a href="/admin/dashboard/vouchers" class="btn-secondary">Back</a>
            </div>
        </form>
    </div>
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        font-family: 'Poppins', 'Segoe UI', system-ui, sans-serif;
        background: linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%);
        min-height: 100vh;
    }

    .wrapper {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    }

    .card {
        background: rgba(255, 255, 255, 0.92);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border-radius: 24px;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        width: 100%;
        max-width: 960px;
        padding: 48px;
        border: 1px solid rgba(255, 255, 255, 0.4);
    }

    .header {
        text-align: center;
        margin-bottom: 40px;
    }

    h1 {
        font-size: 36px;
        font-weight: 700;
        color: #065f46;
        margin: 0 0 12px 0;
    }

    .subtitle {
        color: #059669;
        font-size: 17px;
        margin: 0;
        opacity: 0.9;
    }

    .alert {
        padding: 16px 24px;
        border-radius: 14px;
        margin-bottom: 32px;
        font-size: 15px;
        font-weight: 500;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
    }

    .alert.success { background: #ecfdf5; color: #065f46; border: 1px solid #86efac; }
    .alert.error { background: #fef2f2; color: #991b1b; border: 1px solid #fca5a5; }

    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 28px;
        margin-bottom: 32px;
    }

    .field {
        display: flex;
        flex-direction: column;
    }

    label {
        font-size: 15px;
        font-weight: 600;
        color: #065f46;
        margin-bottom: 10px;
    }

    .required { color: #ef4444; }
    small { font-weight: 400; color: #6b7280; }

    input, textarea {
        padding: 15px 20px;
        font-size: 16px;
        border: 2px solid #d1fae5;
        border-radius: 14px;
        background: #ffffff;
        transition: all 0.3s ease;
    }

    input:focus, textarea:focus {
        outline: none;
        border-color: #10b981;
        box-shadow: 0 0 0 5px rgba(16, 185, 129, 0.15);
        transform: translateY(-2px);
    }

    textarea {
        resize: vertical;
        min-height: 130px;
    }

    /* Premium Custom Select */
    .select-wrapper {
        position: relative;
    }

    select {
        appearance: none;
        -webkit-appearance: none;
        width: 100%;
        padding: 15px 48px 15px 20px;
        font-size: 16px;
        font-weight: 500;
        color: #065f46;
        border: 2px solid #d1fae5;
        border-radius: 14px;
        background: #ffffff;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    select:hover {
        border-color: #86efac;
    }

    select:focus {
        outline: none;
        border-color: #10b981;
        box-shadow: 0 0 0 5px rgba(16, 185, 129, 0.15);
        transform: translateY(-2px);
    }

    .arrow-icon {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        width: 24px;
        height: 24px;
        pointer-events: none;
        color: #059669;
        transition: transform 0.3s ease;
    }

    select:focus + .arrow-icon {
        transform: translateY(-50%) rotate(180deg);
    }

    /* Hint styles */
    .disabled-hint, .placeholder-hint {
        font-style: italic;
        color: #6b7280;
        font-size: 14px;
        margin-top: 8px;
        padding: 15px 20px;
        background: #f8fafc;
        border-radius: 14px;
        border: 2px dashed #d1fae5;
    }

    .actions {
        display: flex;
        gap: 20px;
        margin-top: 40px;
        justify-content: flex-end;
        flex-wrap: wrap;
    }

    .btn-primary, .btn-secondary {
        padding: 15px 36px;
        font-size: 17px;
        font-weight: 600;
        border: none;
        border-radius: 14px;
        cursor: pointer;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        transition: all 0.3s ease;
        min-width: 160px;
    }

    .btn-primary {
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
    }

    .btn-primary:hover:not(:disabled) {
        transform: translateY(-4px);
        box-shadow: 0 15px 35px rgba(16, 185, 129, 0.4);
    }

    .btn-primary:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .btn-secondary {
        background: #f0fdf4;
        color: #065f46;
        border: 2px solid #86efac;
    }

    .btn-secondary:hover {
        background: #dcfce7;
        transform: translateY(-3px);
    }

    .spinner {
        width: 22px;
        height: 22px;
        border: 3px solid rgba(255,255,255,0.3);
        border-top: 3px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    @media (max-width: 640px) {
        .card { padding: 32px; margin: 16px; border-radius: 20px; }
        h1 { font-size: 30px; }
        .actions { flex-direction: column; }
        .btn-primary, .btn-secondary { width: 100%; }
    }
</style>