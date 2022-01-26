<script>
	export let id;

	const item_icons_url = "https://raw.githubusercontent.com/osrsbox/osrsbox-db/master/docs/items-icons/";
	const getIconURL = (id) => item_icons_url + id + ".png";
</script>

<img src={getIconURL(id)} alt={id} />

<style>
	img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
</style>
