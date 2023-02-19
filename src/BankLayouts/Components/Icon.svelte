<script>
	import { ITEM_MAP } from "../Utility/stores"

	export let id;

	const getIconURL = (id) => $ITEM_MAP[id] ? $ITEM_MAP[id].icon : Object.values($ITEM_MAP).find(x => x.placeholderId === id).icon;
	
</script>

<img src={getIconURL(id)} alt={id} />

<style>
	img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
</style>
