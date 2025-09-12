<script lang="ts">
    const baseUrl = "/api/v2/pokemon/"
	let { id } = $props();
    let detailurl = baseUrl + id
    console.log(id)
    let responseTXT = $state("");
    const fetchData = () => {
        fetch(detailurl)
        .then((response: Response) => {
        return response.json();
      })
      .then((data: any) => {

        responseTXT =JSON.stringify(data, null, 2)
      })
      .catch((err) => { console.warn(err)});
    }

    fetchData();
</script>

<pre id="json-display">
    {responseTXT}
</pre>
