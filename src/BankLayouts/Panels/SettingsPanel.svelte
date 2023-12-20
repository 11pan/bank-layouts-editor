<script>
	import { Field, Input, Icon, Toast, Tab, Tabs, Switch, Tag } from 'svelma';
	import ItemSlot from '../Components/ItemSlot.svelte';

	import { SLOTS, TAG_NAME, SHOW_CATALOG_PANEL } from '../Utility/stores.js'
	import { itemContainer } from "../Utility/container";
	import ModalCard from '../Components/ModalCard.svelte';
	import { compressLayoutStr } from "../Utility/compress";

	import { LoadLayout } from "../Utility/LoadLayout"
	import { ExportLayout } from "../Utility/ExportLayout"


	let importModalActive = false;
	let exportModalActive = false;

	let importText = '';
	let exportTextLayout = '';

	let tagOrLayout = 1;

	let exportText = '';
	let exportType = 'Layout';
	let exportInputField = ''
	let addToLayout = true;

	let shareButtonText = "Share";

	$: updateInputField(tagOrLayout)

	const updateInputField = (text) => {

		if (tagOrLayout == 0) {
			exportInputField = exportText.substring(exportText.indexOf("banktag:") + 8);
		} else {
			exportInputField = exportText;
		}
	}

	const getShareUrl = (e) => {
		let compressedString = compressLayoutStr(exportText);
		navigator.clipboard.writeText(`${window.location.href.split('?')[0]}?layout=${compressedString}`);
		Toast.create({ message: 'Link to layout copied successfully', type: 'is-success', position: 'is-bottom-left' });
	}

	export const ExportText = (layoutInfo) => {
		exportType = layoutInfo[0];
		exportText = layoutInfo[1];
		exportTextLayout = layoutInfo[1]
		exportInputField = exportText
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
		<a href={null} on:click={(e) => {importModalActive=true}} class='card-footer-item'><Icon pack="fas" icon="file-import" />&nbsp; Import</a>
		<a href={null} on:click={(e) => {exportModalActive=true; ExportText(ExportLayout(e)); }} class='card-footer-item'><Icon pack="fas" icon="file-export" />&nbsp; Export</a>
		<a href={null} on:click={(e) => { ExportText(ExportLayout(e)); getShareUrl(e) ; shareButtonText = "Copied!"; setInterval(function() { shareButtonText = "Share"}, 2000)}} class='card-footer-item'><Icon pack="fas" icon="share" />{shareButtonText}</a>
	</div>
	<div class='card-footer'>
		<a href={null} on:click={(e) => {$SHOW_CATALOG_PANEL = !$SHOW_CATALOG_PANEL}} class='card-footer-item'><Icon pack="fas" icon="list" />Browse layouts</a>
	</div>
</div>

<ModalCard bind:active={importModalActive} title='Import' successName='Import' on:success={LoadLayout(importText, addToLayout)}>
	<span>On Runelite, right click the bank tag tab you want to import and press "Export tag tab with layout" and paste the layout here.</span>
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
		var text;
		var type = exportType;

		if (tagOrLayout == 0) {
			text = exportText.substring(exportText.indexOf("banktag:") + 8)
		} else {
			text = exportText;
		}

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
	<Input type='textarea' bind:value={exportInputField} readonly/>

</ModalCard>

<style>
	.item {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin-top: auto;
	}
</style>
