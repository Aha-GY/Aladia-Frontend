<template>
  <div class="lds-spinner">
    <div v-for="n in 12" :key="n" />
  </div>
</template>

<style scoped>
.lds-spinner,
.lds-spinner div,
.lds-spinner div:after {
  box-sizing: border-box;
}
.lds-spinner {
  position: relative;
  height: 1px;
  width: 5rem;
}
.lds-spinner div {
  transform-origin: 1.5625rem 1.5625rem;
  animation: lds-spinner 1.2s linear infinite;
  left: 0.95rem;
  position: absolute;
}
.lds-spinner div:after {
  content: '';
  position: absolute;
  top: 0.2625rem;
  left: 1.175rem;
  width: 0.2125rem;
  height: 0.6625rem;
  border-radius: 30%;
  background: #808080;
}
.lds-spinner div:nth-child(1) {
  transform: rotate(0deg);
  animation-delay: -1.1s;
}
.lds-spinner div:nth-child(2) {
  transform: rotate(30deg);
  animation-delay: -1s;
}
.lds-spinner div:nth-child(3) {
  transform: rotate(60deg);
  animation-delay: -0.9s;
}
.lds-spinner div:nth-child(4) {
  transform: rotate(90deg);
  animation-delay: -0.8s;
}
.lds-spinner div:nth-child(5) {
  transform: rotate(120deg);
  animation-delay: -0.7s;
}
.lds-spinner div:nth-child(6) {
  transform: rotate(150deg);
  animation-delay: -0.6s;
}
.lds-spinner div:nth-child(7) {
  transform: rotate(180deg);
  animation-delay: -0.5s;
}
.lds-spinner div:nth-child(8) {
  transform: rotate(210deg);
  animation-delay: -0.4s;
}
.lds-spinner div:nth-child(9) {
  transform: rotate(240deg);
  animation-delay: -0.3s;
}
.lds-spinner div:nth-child(10) {
  transform: rotate(270deg);
  animation-delay: -0.2s;
}
.lds-spinner div:nth-child(11) {
  transform: rotate(300deg);
  animation-delay: -0.1s;
}
.lds-spinner div:nth-child(12) {
  transform: rotate(330deg);
  animation-delay: 0s;
}
@keyframes lds-spinner {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
