<script>
	import { Field, Input, Icon, Toast, Button, Tab, Tabs, Switch } from 'svelma';
	import ItemSlot from './ItemSlot.svelte';

	import { SLOTS, TAG_NAME } from './stores.js'
	import { itemContainer } from "./container";
	import ModalCard from './ModalCard.svelte';

	$SLOTS['icon'] = [-1];


	let importModalActive = false;
	let exportModalActive = false;

	let importText = '';
	let exportTextLayout = '';
	let exportTextTag = '';

	let tagOrLayout = 1;

	let exportText = '';
	let exportType = 'Layout';
	let addToLayout = true;

	const setExportText = (tagOrLayout) => {
		exportText = (tagOrLayout == 0 ? exportTextTag : exportTextLayout);
		exportType = (tagOrLayout == 0 ? 'Tag' : 'Layout');
	}
	$: setExportText(tagOrLayout);

	export const importLayout = e => {
		try {
			var text = importText;
			var type = '';

			if (text.includes('banktaglayoutsplugin')) {
				type = 'Layout';

				// Load bank layout
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
			} else {
				type = 'Tag';

				// Load bank tag
				var banktagItems = text.split(',');
				$SLOTS['icon'][0] = parseInt(banktagItems[1]);
				$TAG_NAME = banktagItems[0];
				$SLOTS['grid'].fill(-1);

				var items = [];
				for (var i = 2; i < banktagItems.length; i++)
					items.push(parseInt(banktagItems[i]));

				if (addToLayout) {
					for (var i = 0; i < items.length; i++)
						$SLOTS['grid'][i] = items[i];
				} else {
					$SLOTS['taggedItems'] = [...items];
				}
			}

			Toast.create({ message: type + ' imported successfully', type: 'is-success', position: 'is-bottom-left' });
		} catch (e) {
			Toast.create({ message: 'Error importing ' + type + ': ' + e.message, type: 'is-danger', position: 'is-bottom-left'});
		};
	}

	export const exportLayout = e => {
		try {
			var out = "";

			out += "banktaglayoutsplugin:" + $TAG_NAME + ",";

			for (var i = 0; i < $SLOTS['grid'].length; i++) 
				if ($SLOTS['grid'][i] >= 0) {
					out += ($SLOTS['grid'][i] + ":" + i + ",");
				}
			
			out += "banktag:"
			var banktag = $TAG_NAME + "," + ($SLOTS['icon'][0] >= 0 ? $SLOTS['icon'][0] : 0) + ',';
			banktag += $SLOTS['items'].filter(x => (x >= 0)).join(',');


			exportTextLayout = out + banktag;
			exportTextTag = banktag;

			setExportText(tagOrLayout);
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
		<a on:click={(e) => {importModalActive=true}} class='card-footer-item'><Icon pack="fas" icon="file-import" />&nbsp; Import</a>
		<a on:click={(e) => {exportModalActive=true; exportLayout(e); }} class='card-footer-item'><Icon pack="fas" icon="file-export" />&nbsp; Export</a>
	</div>
</div>

<ModalCard bind:active={importModalActive} title='Import' successName='Import' on:success={importLayout}>
	<span>Paste your Tag or Layout code here</span>
	<Field>
		<Input type='textarea' bind:value={importText}/>
	</Field>
	<div class='is-pulled-right'>
		<Switch bind:checked={addToLayout}>Add to Layout</Switch>
	</div>
</ModalCard>


<ModalCard
	bind:active={exportModalActive}
	title='Export'
	successName='Copy to Clipboard'
	on:success={(e) => {
		var text = exportText;
		var type = exportType;

		try {
			navigator.clipboard.writeText(text);
			Toast.create({ message: type + ' copied successfully', type: 'is-success', position: 'is-bottom-left' });
		} catch (e) {
			Toast.create({ message: 'Error copying ' + type + ': ' + e.message, type: 'is-danger', position: 'is-bottom-left'});
		}
	}}>
	<Tabs bind:active={tagOrLayout} style="is-fullwidth">
		<Tab label='Tag' icon='tag'></Tab>
		<Tab label='Layout' icon='th-large'></Tab>
	</Tabs>
	<Input type='textarea' bind:value={exportText} readonly/>
</ModalCard>


<style>
	.item {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin-top: auto;
	}
</style>
