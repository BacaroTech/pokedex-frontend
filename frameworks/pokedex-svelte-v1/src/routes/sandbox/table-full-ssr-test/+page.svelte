<script>
  
  import TableFullPrerender from "$lib/components/TableFullPrerender.svelte";
  const { data } = $props();
  const { tableData, colHeaders } = data;
</script>
<h1>hello SSR</h1>
<TableFullPrerender  {tableData} {colHeaders} />