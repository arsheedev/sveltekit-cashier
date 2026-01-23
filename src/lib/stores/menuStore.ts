import { writable } from 'svelte/store';

export const activeCategory = writable<'all' | 'food' | 'beverages'>('all');