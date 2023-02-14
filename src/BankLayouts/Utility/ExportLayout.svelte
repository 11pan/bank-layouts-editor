<script>
	import { SLOTS, TAG_NAME } from '../Utility/stores.js'
    import { Toast } from 'svelma';

	let exportTextLayout = '';
	let exportTextTag = '';

	let tagOrLayout = 1;

    let exportText = '';
	let exportType = 'Layout';

    const setExportText = (tagOrLayout) => {
		exportText = (tagOrLayout == 0 ? exportTextTag : exportTextLayout);
		exportType = (tagOrLayout == 0 ? 'Tag' : 'Layout');

       return [exportType, exportText]
	}
	$: setExportText(tagOrLayout);

	export const ExportLayout = e => {
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

			return setExportText(tagOrLayout);
		} catch (e) {
			Toast.create({ message: 'Error exporting layout: ' + e.message, type: 'is-danger', position: 'is-bottom-left'});
		}
	}
</script>