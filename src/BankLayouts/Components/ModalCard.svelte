<script>
	import { onDestroy, onMount, createEventDispatcher } from 'svelte'
	import { chooseAnimation, isEscKey } from 'svelma/src/utils'
  
	export let active = true
	export let title = "Modal Title"
	export let animation = 'scale'
	export let animProps = { start: 1.2 }
	export let size = ''
	export let showClose = true
	export let onBody = true
	export let successName = 'Save changes';
	export let cancelName = 'Cancel';
  
	const dispatch = createEventDispatcher();
	let modal
  
	$: _animation = chooseAnimation(animation)
	$: {
	  if (modal && active && onBody) {
		document.body.appendChild(modal)
	  }
	}
  
	onMount(() => {})
  
	function close() {
	  active = false
	}
  
	function keydown(e) {
	  if (active && isEscKey(e)) {
		close()
	  }
	}
  
	function closeSuccess() {
	  dispatch('success');
	  close();
	}
	function closeFailure() {
	  dispatch('failure');
	  close();
	}
  
  </script>
  
  <svelte:window on:keydown={keydown} />
  
  <div class="modal {size}"  class:is-active={active} bind:this={modal}>
	<div class="modal-background" on:click={close}></div>
	<div class="modal-card" transition:_animation|local={animProps}>
	  <header class="modal-card-head">
		<p class="modal-card-title">{title}</p>
		<button class="delete" aria-label="close" on:click={close} />
	  </header>
	  <section class="modal-card-body">
		<slot />
	  </section>
	  <footer class="modal-card-foot" style='justify-content: flex-end;'>
		<button class="button is-success" on:click={closeSuccess}>{successName}</button>
		<button class="button" on:click={closeFailure}>{cancelName}</button>
	  </footer>
	</div>
  </div>
