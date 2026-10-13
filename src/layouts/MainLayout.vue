<template>
  <q-layout view="lHh Lpr lFf" class="campus-layout">

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
</script>

<style>
html,
body,
#q-app {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100%;
}

body {
  overflow-x: hidden;
}

.campus-layout {
  min-height: 100vh;
  background: #f1f5f9;
}
</style>