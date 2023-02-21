<script>
	import { Field, Input, Icon, Switch, Collapse } from 'svelma';
    import { SHOW_CATALOG_PANEL, VISIBLE_LAYOUT_CATALOG_ITEMS, VISIBLE_TAG_CATALOG_ITEMS, LAYOUT_CATALOG, TAG_CATALOG, ACTIVE_CATALOG_TAB } from "../Utility/stores";

    import Fuse from 'fuse.js';

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


    const layoutNameFuse = new Fuse(Object.values($LAYOUT_CATALOG), { keys: ['name', 'description'] });
    const catalogNameFuse = new Fuse(Object.values($TAG_CATALOG), { keys: ['name', 'description'] });
    
    let layoutCreatorFuse;
    let tagCreatorFuse;

    const updateVisibleCatalog = (result) => {
        if (!result) return;
        if ($ACTIVE_CATALOG_TAB == 1) {
            $VISIBLE_LAYOUT_CATALOG_ITEMS = [];
        
            for (let i = 0; i < result.length; i++) 
                $VISIBLE_LAYOUT_CATALOG_ITEMS.push(result[i].item)

        } else {
            $VISIBLE_TAG_CATALOG_ITEMS = [];
        
            for (let i = 0; i < result.length; i++) 
                $VISIBLE_TAG_CATALOG_ITEMS.push(result[i].item)
        }

        layoutCreatorFuse = null;
        tagCreatorFuse = null;
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
            updateVisibleCatalog(($ACTIVE_CATALOG_TAB == 1) ? layoutNameFuse.search(`=${text}`) : catalogNameFuse.search(`=${text}`))
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
            if ($ACTIVE_CATALOG_TAB == 1) {
                layoutCreatorFuse = new Fuse($VISIBLE_LAYOUT_CATALOG_ITEMS == $LAYOUT_CATALOG ? Object.values($LAYOUT_CATALOG) : Object.values($VISIBLE_LAYOUT_CATALOG_ITEMS), { keys: ['creator'] });
                updateVisibleCatalog(layoutCreatorFuse.search(`=${text}`))
            } else {
                tagCreatorFuse = new Fuse($VISIBLE_TAG_CATALOG_ITEMS == $TAG_CATALOG ? Object.values($TAG_CATALOG) : Object.values($VISIBLE_TAG_CATALOG_ITEMS), { keys: ['creator'] });
                updateVisibleCatalog(tagCreatorFuse.search(`=${text}`))
            }
        }
    }

    let nameSearchText = "";
    $: nameSearch(nameSearchText);

    let creatorSearchText = "";
    $: creatorSearch(creatorSearchText);

    const TagChecked = () => {
        let enabledTags = tags.filter(tag => tag.enabled === true);

        if ($ACTIVE_CATALOG_TAB == 1) {
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
                    $VISIBLE_LAYOUT_CATALOG_ITEMS.push(layout);
                })
            });
        } else {
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
                    $VISIBLE_TAG_CATALOG_ITEMS.push(_tag);
                })
            });
        }

        if (nameSearchText != "") {
            nameSearch(nameSearchText)
        } else if (creatorSearchText != "") {
            creatorSearch(creatorSearchText)
        }
    }

    $: TagChecked(tags)

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
