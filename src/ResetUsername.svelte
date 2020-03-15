<script>
  import Cookies from 'js-cookie';
  function resetUsername() {
    Cookies.remove('username');
  }
</script>

<button on:click={resetUsername}>
Reset username
</button>
