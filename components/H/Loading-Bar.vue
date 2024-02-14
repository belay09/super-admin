<script setup></script>

<template>
  <div class="loading-container">
    <div class="loading-line">
      <div class="loading-bar"></div>
    </div>
  </div>
</template>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-line {
  width: 200px; /* Adjust width as needed */
  height: 4px;
  background-color: #ffebeb;
  border-radius: 4px;
  position: relative;
}

.loading-bar {
  width: 50px; /* Adjust width of the bar */
  height: 100%;
  background-color: #d34553; /* Bold color for the bar */
  position: absolute;
  top: 0;
  animation: loading 1s linear infinite;
}

@keyframes loading {
  0% {
    left: 0;
  }
  50% {
    left: calc(100% - 50px);
  } /* Adjust for bar width */
  100% {
    left: 0;
  }
}
</style>
