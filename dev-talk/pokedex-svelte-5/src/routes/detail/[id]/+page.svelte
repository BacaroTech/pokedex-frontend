<script lang="ts">
  import PokeFooter from "../../../components/PokeFooter.svelte";
  import PokeDetail from "../../../components/PokeDetail.svelte";
  import PokeHeader from "../../../components/PokeHeader.svelte";
  import { page } from "$app/stores";
  
  

  let id = $page.params.id;

</script>


<PokeHeader></PokeHeader>
<PokeDetail {id}></PokeDetail>
<PokeFooter></PokeFooter>
