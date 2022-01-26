<script>
	import { Field, Input, Icon, Toast } from 'svelma';
	import ItemSlot from './ItemSlot.svelte';

	import { SLOTS, TAG_NAME } from './stores.js'
	import { itemContainer } from "./container";

	$SLOTS['icon'] = [-1];





	export const importLayout = e => {
		navigator.clipboard.readText()
			.then(text => {
				var bankLayoutItems = text.substring(text.indexOf("banktaglayoutsplugin:") + 1, text.indexOf(",banktag"));
				bankLayoutItems = bankLayoutItems.split(",");
				$TAG_NAME = bankLayoutItems[0].split(":")[1];

				var banktagItems = text.substring(text.indexOf("banktag:") + 1);
				banktagItems = banktagItems.split(',');
				$SLOTS['icon'][0] = parseInt(banktagItems[1]);

				var layoutItems = new Set();

				$SLOTS['grid'].fill(-1);
				for (var i = 1; i < bankLayoutItems.length; i++) {
					var parsed = bankLayoutItems[i].split(':');
					var item = parseInt(parsed[0]);
					var idx  = parseInt(parsed[1]);
					
					$SLOTS['grid'][idx] = item;
					layoutItems.add(item);
				}

				var tagItems = new Set();

				for (var i = 2; i < banktagItems.length; i++) {
					var item = parseInt(banktagItems[i]);
					if (!layoutItems.has(item))
						tagItems.add(item);
				}

				$SLOTS['taggedItems'] = [...tagItems];


				Toast.create({ message: 'Layout imported successfully', type: 'is-success', position: 'is-bottom-left' });
			}).catch(e => {
				Toast.create({ message: 'Error importing layout: ' + e.message, type: 'is-danger', position: 'is-bottom-left'});
			});
	}

	export const exportLayout = e => {
		try {
			var out = "";

			out += "banktaglayoutsplugin:" + $TAG_NAME + ",";

			for (var i = 0; i < $SLOTS['grid'].length; i++) 
				if ($SLOTS['grid'][i] >= 0) {
					out += ($SLOTS['grid'][i] + ":" + i + ",");
				}
			
			out += "banktag:" + $TAG_NAME + "," + ($SLOTS['icon'][0] >= 0 ? $SLOTS['icon'][0] : 0) + ',';
			out += $SLOTS['items'].filter(x => (x >= 0)).join(',');

			navigator.clipboard.writeText(out);

			Toast.create({ message: 'Layout exported successfully', type: 'is-success', position: 'is-bottom-left' });
		} catch (e) {
			Toast.create({ message: 'Error exporting layout: ' + e.message, type: 'is-danger', position: 'is-bottom-left'});
		}
	}








</script>

<div class='card'>
	<div class='card-content'>
		<div class='columns is-mobile'>

			<div class='column item' use:itemContainer
				on:drop = { e => { $SLOTS['icon'][0] = e.detail.itemID; }}
			>
				<ItemSlot container={"icon"} itemID={$SLOTS['icon'][0]} slotID={0} />
			</div>

			<div class='column is-two-thirds item'>
				<Field label='Tag Name'>
					<Input placeholder='' bind:value={$TAG_NAME}/>
				</Field>
			</div>
		</div>
	</div>

	<div class='card-footer'>
		<a on:click={importLayout} class='card-footer-item'><Icon pack="fas" icon="file-import" />&nbsp; Import</a>
		<a on:click={exportLayout} class='card-footer-item'><Icon pack="fas" icon="file-export" />&nbsp; Export</a>
	</div>
</div>


<style>
	.item {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin-top: auto;
	}
</style>
