<script>
	import { Field, Input, Icon, Switch, Collapse } from 'svelma';
    import { SHOW_CATALOG_PANEL, VISIBLE_LAYOUT_CATALOG_ITEMS, VISIBLE_TAG_CATALOG_ITEMS, ITEM_TAG_CATALOG, VISIBLE_ITEM_TAG_CATALOG_ITEMS , LAYOUT_CATALOG, TAG_CATALOG, ACTIVE_CATALOG_TAB, DROP_TABLE_TAG_CATALOG } from "../Utility/stores";

    import Fuse from 'fuse.js';
    import queryString from 'query-string';
    import { tick } from 'svelte';

    const tags = [];

    $LAYOUT_CATALOG.forEach((layout) => {
        layout.tags.forEach(tag => {
            if (tags.filter(x  => x.tag === tag).length < 1)
                tags.push({tag: tag, enabled: false})
        })
    });


    $TAG_CATALOG.forEach((tag) => {
        tag.tags.forEach(tag => {
            if (tags.filter(x  => x.tag === tag).length < 1)
                tags.push({tag: tag, enabled: false})
        })
    });


    const parsed = queryString.parse(location.search);
    
    let layoutCreatorFuse;
    let tagCreatorFuse;
    let itemTagFuse;

    const updateVisibleCatalog = (result) => {

        if (!result) return;

        switch($ACTIVE_CATALOG_TAB) {
            case 0:
                $VISIBLE_TAG_CATALOG_ITEMS = [];
                
                for (let i = 0; i < result.length; i++) 
                    $VISIBLE_TAG_CATALOG_ITEMS.push(result[i].item)
                break;

            case 1:
                $VISIBLE_ITEM_TAG_CATALOG_ITEMS = [];
                    
                for (let i = 0; i < result.length; i++) 
                    $VISIBLE_ITEM_TAG_CATALOG_ITEMS.push(result[i].item)
                break;

            case 2:
                $VISIBLE_LAYOUT_CATALOG_ITEMS = [];
                
                for (let i = 0; i < result.length; i++) 
                    $VISIBLE_LAYOUT_CATALOG_ITEMS.push(result[i].item)
                break;
        }

        layoutCreatorFuse = null;
        tagCreatorFuse = null;
        itemTagFuse = null;
    }

    const nameSearch = text => { 
        if (text == "") {
            if (creatorSearchText != "") {
                creatorSearch(creatorSearchText)
            } else {
                $VISIBLE_LAYOUT_CATALOG_ITEMS = $LAYOUT_CATALOG
                $VISIBLE_TAG_CATALOG_ITEMS = $TAG_CATALOG
            }
        } else {
            switch($ACTIVE_CATALOG_TAB) {
                case 0:
                    const catalogNameFuse = new Fuse(Object.values($TAG_CATALOG), { keys: ['name', 'description'], useExtendedSearch: true });

                    updateVisibleCatalog(catalogNameFuse.search(`'${text}`))
                    break;

                case 1:
                    const itemTagNameFuse = new Fuse(Object.values($ITEM_TAG_CATALOG), { keys: ['name', 'description'], useExtendedSearch: true });

                    updateVisibleCatalog(itemTagNameFuse.search(`'${text}`))
                    break;

                case 2:
                    const layoutNameFuse = new Fuse(Object.values($LAYOUT_CATALOG), { keys: ['name', 'description'], useExtendedSearch: true });

                    updateVisibleCatalog(layoutNameFuse.search(`'${text}`))
                    break;
            }
        }
    }

    const creatorSearch = text => { 
        if (text == "") {
            if (nameSearchText != "") {
                nameSearch(nameSearchText);
            } else {
                $VISIBLE_LAYOUT_CATALOG_ITEMS = $LAYOUT_CATALOG
                TagChecked();
            }
        } else {
            switch($ACTIVE_CATALOG_TAB) {
                case 0:
                    tagCreatorFuse = new Fuse($VISIBLE_TAG_CATALOG_ITEMS == $TAG_CATALOG ? Object.values($TAG_CATALOG) : Object.values($VISIBLE_TAG_CATALOG_ITEMS), { keys: ['creator'] });
                    updateVisibleCatalog(tagCreatorFuse.search(`'${text}`))
                    break;
                
                case 1:
                    itemTagFuse = new Fuse($VISIBLE_ITEM_TAG_CATALOG_ITEMS == $ITEM_TAG_CATALOG ? Object.values($ITEM_TAG_CATALOG) : Object.values($VISIBLE_ITEM_TAG_CATALOG_ITEMS), { keys: ['creator'] });
                    updateVisibleCatalog(itemTagFuse.search(`'${text}`))
                    break;

                case 2:
                    layoutCreatorFuse = new Fuse($VISIBLE_LAYOUT_CATALOG_ITEMS == $LAYOUT_CATALOG ? Object.values($LAYOUT_CATALOG) : Object.values($VISIBLE_LAYOUT_CATALOG_ITEMS), { keys: ['creator'] });
                    updateVisibleCatalog(layoutCreatorFuse.search(`'${text}`))
                    break;
            }
        }
    }

    const dropTableSearch = text => { 
        if (text == "") {
            $VISIBLE_LAYOUT_CATALOG_ITEMS = $LAYOUT_CATALOG
            TagChecked();
        } else {
            const dropTableFuse = new Fuse(Object.values($DROP_TABLE_TAG_CATALOG), { keys: ['name'], useExtendedSearch: true });

            updateVisibleCatalog(dropTableFuse.search(`'${text}`))
        }
    }

    const TagChecked = () => {
        let enabledTags = tags.filter(tag => tag.enabled === true);

        switch($ACTIVE_CATALOG_TAB) {
            // BANK TAGS
            case 0:
                if (enabledTags.length == 0) {
                    $VISIBLE_TAG_CATALOG_ITEMS = $TAG_CATALOG;

                    if (nameSearchText != "") {
                        nameSearch(nameSearchText)
                    } else if (creatorSearchText != "") {
                        creatorSearch(creatorSearchText)
                    }

                    return;
                }

                $VISIBLE_TAG_CATALOG_ITEMS = [];
                
                enabledTags.forEach(tag => {
                    let tagsWithTags = $TAG_CATALOG.filter(x => x.tags.includes(tag.tag));

                    tagsWithTags.forEach(_tag => {
                        if ($VISIBLE_TAG_CATALOG_ITEMS.includes(tag)) return;
                        $VISIBLE_TAG_CATALOG_ITEMS.push(_tag);
                    })
                });
                break;
            // ITEM TAGS
            case 1:
                if (enabledTags.length == 0) {
                        $VISIBLE_ITEM_TAG_CATALOG_ITEMS = $ITEM_TAG_CATALOG;

                        if (nameSearchText != "") {
                            nameSearch(nameSearchText)
                        } else if (creatorSearchText != "") {
                            creatorSearch(creatorSearchText)
                        }

                        return;
                    }

                    $VISIBLE_ITEM_TAG_CATALOG_ITEMS = [];
                    
                    enabledTags.forEach(tag => {
                        let tagsWithTags = $ITEM_TAG_CATALOG.filter(x => x.tags.includes(tag.tag));

                        tagsWithTags.forEach(_tag => {
                            if ($VISIBLE_ITEM_TAG_CATALOG_ITEMS.includes(tag)) return;
                            $VISIBLE_ITEM_TAG_CATALOG_ITEMS.push(_tag);
                        })
                    });
                break;

            // BANK LAYOUTS
            case 2:
                if (enabledTags.length == 0) {
                    $VISIBLE_LAYOUT_CATALOG_ITEMS = $LAYOUT_CATALOG

                    if (nameSearchText != "") {
                        nameSearch(nameSearchText)
                    } else if (creatorSearchText != "") {
                        creatorSearch(creatorSearchText)
                    }

                    return;
                }

                $VISIBLE_LAYOUT_CATALOG_ITEMS = [];
                
                enabledTags.forEach(tag => {
                    let layoutsWithTag = $LAYOUT_CATALOG.filter(layout => layout.tags.includes(tag.tag));

                    layoutsWithTag.forEach(layout => {
                        if ($VISIBLE_LAYOUT_CATALOG_ITEMS.includes(layout)) return;
                        $VISIBLE_LAYOUT_CATALOG_ITEMS.push(layout);
                    })
                });
                break;
        }

        if (nameSearchText != "") {
            nameSearch(nameSearchText)
        } else if (creatorSearchText != "") {
            creatorSearch(creatorSearchText)
        }
    }

    const CheckParameters = async () => {
        if (parsed) {
            switch(true) {
                case parsed.creator != null:
                    await tick();
                    creatorSearchText = parsed.creator;
                    break;
            }
        }
    }

    let nameSearchText = "";
    $: nameSearch(nameSearchText);

    let creatorSearchText = "";
    $: creatorSearch(creatorSearchText);

    let dropTableTagSearchText = "";
    $: dropTableSearch(dropTableTagSearchText)

    $: TagChecked(tags)
    
    $: CheckParameters(parsed)

</script>

<div class='card'>
	<div class='card-content'>
		<div class='columns is-mobile'>
			<div class="align">
                <h1 class="title">Search</h1>
                <Field label="Name & Description">
                    <Input bind:value={nameSearchText} placeholder="" />
                </Field>
                    
                <Field label="Creator">
                    <Input bind:value={creatorSearchText} placeholder=""/>
                </Field>

                <Field label="Tags">
                    <Collapse open={false}>
                        <button class="showTagsButton" slot="trigger">
                            Show tags
                        </button>
                        <div class="tags">
                            {#each tags as tag}
                            <div class="tag">
                                <Switch bind:checked={tag.enabled}>{tag.tag}</Switch>
                            </div>
                            {/each}
                        </div>
                    </Collapse>
                </Field>
                {#if $ACTIVE_CATALOG_TAB == 0}
                    <Field label="Drop table tags">
                        <Input bind:value={dropTableTagSearchText} placeholder="NPC name"/>
                    </Field>
                    <small>Drop table tags are only show when searched.<br><br>These tags were generated dynamically and could contain mistakes.<br><br>The catalog currently holds <b>{$DROP_TABLE_TAG_CATALOG.length}</b> drop tables.</small>
                {/if}
			</div>
            <br>
		</div>
	</div>
	<div class='card-footer'>
		<a href={null} on:click={() => { $SHOW_CATALOG_PANEL = !$SHOW_CATALOG_PANEL}} class='card-footer-item'><Icon pack="fas" icon="backward" />&nbsp; Return</a>

	</div>
</div>

<style>
    .align {
        padding-left: 15%;
        margin-bottom: 10px;
        padding-right: 43px;
    }

    .title {
        font-weight: bold;
        text-align: center;
    }

    .showTagsButton {
        background-color: #282f2f;
        border-color: #4d5e5e;
        border-radius: 10px;
        color: #1dd2af;
        margin-bottom: 10px;
    }

    .showTagsButton:active {
        background-color: #2d3030;
        color: #1dd2af;
    }

    .tags {
        text-align: right;
        display: grid;
        gap: 10px;
    }
    
    .tag {
        display: contents;
    }

</style>
