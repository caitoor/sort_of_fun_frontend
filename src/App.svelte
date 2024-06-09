<script>
  import { onMount } from 'svelte';
  import { games } from './store';
  import { loadGames } from './fetchGames';

  onMount(() => {
      loadGames();
  });

  let gameList = [];
  games.subscribe(value => {
      gameList = value;
  });
</script>

<main>
  <h1>Meine BGG Sammlung</h1>
  <table>
      <thead>
          <tr>
              <th>Thumbnail</th>
              <th>Name</th>
              <th>Jahr</th>
              <th>Min Spieler</th>
              <th>Max Spieler</th>
              <th>Spielzeit</th>
              <th>Min Spielzeit</th>
              <th>Max Spielzeit</th>
          </tr>
      </thead>
      <tbody>
          {#each gameList as game}
              <tr>
                  <td><img src={game.thumbnail} alt="Thumbnail" width="50"></td>
                  <td>{game.name}</td>
                  <td>{game.year}</td>
                  <td>{game.minPlayers}</td>
                  <td>{game.maxPlayers}</td>
                  <td>{game.playingTime}</td>
                  <td>{game.minPlayTime}</td>
                  <td>{game.maxPlayTime}</td>
              </tr>
          {/each}
      </tbody>
  </table>
</main>

<style>
  table {
      width: 100%;
      border-collapse: collapse;
  }

  th, td {
      border: 1px solid #ddd;
      padding: 8px;
  }

  th {
      background-color: #f2f2f2;
  }

  img {
      max-width: 50px;
      height: auto;
  }
</style>
