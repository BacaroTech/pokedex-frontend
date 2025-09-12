<script>
  import "../../app.css";
  import FakeSessionize from "../../components/FakeSessionize.svelte";
  import SourceFakeSessionize from "../../components/SourceFakeSessionize.svelte";

  function handleFlip() {
	console.log("click")
    const front = document.getElementById("front");

    const back = document.getElementById("back");
	if (front?.classList.contains('flipped')) {
		front?.classList.remove("flipped");
	} else  {
		front?.classList.add("flipped");
	}

	if (back?.classList.contains('flipped')) {
		back?.classList.remove("flipped");
	} else  {
		back?.classList.add("flipped");
	}
  }
</script>

<div class="container">
  <div class="card">
    <div id="back" class="cardBack">
		<button type="button" id="flip-btn" on:click={handleFlip}> 
			CHIUDI 
		</button>
		<SourceFakeSessionize />
	</div>
    <div id="front" class="cardFront">
		<button type="button" id="flip-btn" on:click={handleFlip}> 
			ISPEZIONA
		 </button>
		<FakeSessionize />
	</div>
  </div>
</div>

<style>
 
</style>
