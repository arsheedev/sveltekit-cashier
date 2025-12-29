<script lang="ts">
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<form method="post" enctype="multipart/form-data">
	<label for="name">Name</label>
	<input id="name" type="text" name="name" defaultvalue={data.product.name} />
	<label for="price">Price</label>
	<input id="price" type="price" name="price" defaultvalue={data.product.price} />
	<label for="type">Type</label>
	<input id="type" type="type" name="type" defaultvalue={data.product.type} />
	<label for="image">Image</label>
	<input id="image" type="file" name="image" />
	<button type="submit">Submit</button>
</form>

<pre>{JSON.stringify(form, null, 2)}</pre>
