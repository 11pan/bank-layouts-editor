<script>
	import { SLOTS, TAG_NAME } from './stores.js'
    import { Toast } from 'svelma';

	$SLOTS['icon'] = [-1];

    export const LoadLayout = (importText, addToLayout) => {
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

        if (text.includes("New layout")) {
            Toast.create({ message: type + ' created successfully', type: 'is-success', position: 'is-bottom-left' });
        } else {
            Toast.create({ message: type + ' imported successfully', type: 'is-success', position: 'is-bottom-left' });
        }
        } catch (e) {
            console.log(e)
            Toast.create({ message: 'Error importing ' + type + ': ' + e.message, type: 'is-danger', position: 'is-bottom-left'});
        };
    }
</script>