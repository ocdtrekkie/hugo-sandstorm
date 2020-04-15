<template>
  <main>
    <nuxt/>
  </main>
</template>

<style>
  body {
    padding: 50px;
    font: 14px "Lucida Grande", Helvetica, Arial, sans-serif;
  }

  a {
    color: #00B7FF;
  }

  table {
    text-align: left;
  }

  td {
    padding: 0 10 0 10;
  }

  .button {
    display: inline-block;
    padding: 0.5rem;
    border: solid #aaa 1px;
    background-color: #eee;
    color: #000;
    border-radius: 3px;
    margin: 0 1rem;
    text-decoration: none;
    cursor: pointer;
  }

  .button.disabled {
    color: #555;
    background-color: #aaa;
    cursor: not-allowed;
  }
</style>
