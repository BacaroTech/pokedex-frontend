<script>
  import TableFullPrerender from "$lib/components/TableFullPrerender.svelte";
  const { data } = $props();
  const { tableData, colHeaders } = data;
</script>

<TableFullPrerender {tableData} {colHeaders} />
