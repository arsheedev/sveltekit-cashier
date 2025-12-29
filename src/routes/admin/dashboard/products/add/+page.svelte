<script lang="ts">
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<form method="post" enctype="multipart/form-data">
	<label for="name">Name</label>
	<input id="name" type="text" name="name" />
	<label for="price">Price</label>
	<input id="price" type="price" name="price" />
	<label for="type">Type</label>
	<input id="type" type="type" name="type" />
	<label for="image">Image</label>
	<input id="image" type="file" name="image" />
	<button type="submit">Submit</button>
</form>

<pre>{JSON.stringify(form, null, 2)}</pre>
