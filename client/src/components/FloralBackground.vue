<template>
  <svg
    class="floral-background"
    viewBox="0 0 1920 1080"
    preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- Flower 1: Rose-like -->
    <g :transform="`translate(150, 200) rotate(${rotations[0]})`" opacity="0.3">
      <circle cx="0" cy="0" r="12" fill="#E91E63" />
      <circle cx="8" cy="-8" r="10" fill="#E91E63" />
      <circle cx="12" cy="0" r="10" fill="#EC407A" />
      <circle cx="8" cy="8" r="10" fill="#E91E63" />
      <circle cx="0" cy="12" r="10" fill="#EC407A" />
      <circle cx="-8" cy="8" r="10" fill="#E91E63" />
      <circle cx="-12" cy="0" r="10" fill="#EC407A" />
      <circle cx="-8" cy="-8" r="10" fill="#E91E63" />
      <circle cx="0" cy="0" r="6" fill="#C2185B" />
    </g>

    <!-- Flower 2: Sunflower-like -->
    <g :transform="`translate(350, 100) rotate(${rotations[1]})`" opacity="0.3">
      <circle cx="0" cy="0" r="15" fill="#FFB300" />
      <circle cx="18" cy="0" r="8" fill="#FFC107" />
      <circle cx="13" cy="13" r="8" fill="#FFC107" />
      <circle cx="0" cy="18" r="8" fill="#FFC107" />
      <circle cx="-13" cy="13" r="8" fill="#FFC107" />
      <circle cx="-18" cy="0" r="8" fill="#FFC107" />
      <circle cx="-13" cy="-13" r="8" fill="#FFC107" />
      <circle cx="0" cy="-18" r="8" fill="#FFC107" />
      <circle cx="13" cy="-13" r="8" fill="#FFC107" />
      <circle cx="0" cy="0" r="8" fill="#FF8F00" />
    </g>

    <!-- Flower 3: Tulip-like -->
    <g :transform="`translate(800, 250) rotate(${rotations[2]})`" opacity="0.3">
      <ellipse cx="0" cy="-8" rx="6" ry="12" fill="#9C27B0" />
      <ellipse cx="-8" cy="0" rx="6" ry="12" fill="#AB47BC" />
      <ellipse cx="8" cy="0" rx="6" ry="12" fill="#9C27B0" />
      <circle cx="0" cy="8" r="5" fill="#6A1B9A" />
    </g>

    <!-- Flower 4: Daisy-like -->
    <g
      :transform="`translate(1200, 150) rotate(${rotations[3]})`"
      opacity="0.3"
    >
      <circle cx="0" cy="0" r="10" fill="#FFD54F" />
      <circle cx="15" cy="0" r="6" fill="#FFFFFF" />
      <circle cx="11" cy="11" r="6" fill="#FFFFFF" />
      <circle cx="0" cy="15" r="6" fill="#FFFFFF" />
      <circle cx="-11" cy="11" r="6" fill="#FFFFFF" />
      <circle cx="-15" cy="0" r="6" fill="#FFFFFF" />
      <circle cx="-11" cy="-11" r="6" fill="#FFFFFF" />
      <circle cx="0" cy="-15" r="6" fill="#FFFFFF" />
      <circle cx="11" cy="-11" r="6" fill="#FFFFFF" />
    </g>

    <!-- Flower 5: Orchid-like -->
    <g
      :transform="`translate(1650, 350) rotate(${rotations[4]})`"
      opacity="0.3"
    >
      <ellipse cx="0" cy="-10" rx="8" ry="10" fill="#BA68C8" />
      <ellipse cx="9" cy="-5" rx="8" ry="10" fill="#CE93D8" />
      <ellipse cx="9" cy="5" rx="8" ry="10" fill="#BA68C8" />
      <ellipse cx="0" cy="10" rx="8" ry="10" fill="#CE93D8" />
      <ellipse cx="-9" cy="5" rx="8" ry="10" fill="#BA68C8" />
      <ellipse cx="-9" cy="-5" rx="8" ry="10" fill="#CE93D8" />
      <circle cx="0" cy="0" r="5" fill="#8E24AA" />
    </g>

    <!-- Flower 6: Hibiscus-like -->
    <g :transform="`translate(500, 700) rotate(${rotations[5]})`" opacity="0.3">
      <circle cx="0" cy="0" r="14" fill="#FF6F00" />
      <circle cx="16" cy="0" r="9" fill="#FF8F00" />
      <circle cx="12" cy="11" r="9" fill="#FF6F00" />
      <circle cx="-4" cy="16" r="9" fill="#FF8F00" />
      <circle cx="-14" cy="6" r="9" fill="#FF6F00" />
      <circle cx="-14" cy="-6" r="9" fill="#FF8F00" />
      <circle cx="0" cy="0" r="7" fill="#E65100" />
    </g>

    <!-- Flower 7: Cherry blossom-like -->
    <g
      :transform="`translate(1100, 850) rotate(${rotations[6]})`"
      opacity="0.3"
    >
      <circle cx="0" cy="-12" r="7" fill="#F06292" />
      <circle cx="11" cy="-4" r="7" fill="#F48FB1" />
      <circle cx="7" cy="10" r="7" fill="#F06292" />
      <circle cx="-7" cy="10" r="7" fill="#F48FB1" />
      <circle cx="-11" cy="-4" r="7" fill="#F06292" />
      <circle cx="0" cy="0" r="6" fill="#EC407A" />
    </g>

    <!-- Flower 8: Lily-like -->
    <g :transform="`translate(300, 900) rotate(${rotations[7]})`" opacity="0.3">
      <ellipse cx="0" cy="-10" rx="7" ry="14" fill="#FF4081" />
      <ellipse cx="9" cy="-3" rx="7" ry="14" fill="#FF1744" />
      <ellipse cx="5" cy="12" rx="7" ry="14" fill="#FF4081" />
      <ellipse cx="-5" cy="12" rx="7" ry="14" fill="#FF1744" />
      <ellipse cx="-9" cy="-3" rx="7" ry="14" fill="#FF4081" />
      <circle cx="0" cy="0" r="5" fill="#C2185B" />
    </g>

    <!-- Flower 9: Lavender-like -->
    <g
      :transform="`translate(1650, 650) rotate(${rotations[8]})`"
      opacity="0.3"
    >
      <circle cx="0" cy="0" r="3" fill="#9575CD" />
      <circle cx="0" cy="-6" r="3" fill="#9575CD" />
      <circle cx="0" cy="-12" r="3" fill="#7E57C2" />
      <circle cx="0" cy="-18" r="3" fill="#9575CD" />
      <circle cx="5" cy="-3" r="3" fill="#7E57C2" />
      <circle cx="-5" cy="-3" r="3" fill="#9575CD" />
      <circle cx="6" cy="-10" r="3" fill="#9575CD" />
      <circle cx="-6" cy="-10" r="3" fill="#7E57C2" />
    </g>

    <!-- Flower 10: Peony-like -->
    <g :transform="`translate(700, 50) rotate(${rotations[9]})`" opacity="0.3">
      <circle cx="0" cy="0" r="13" fill="#E91E63" />
      <circle cx="10" cy="-7" r="11" fill="#EC407A" />
      <circle cx="14" cy="2" r="11" fill="#E91E63" />
      <circle cx="8" cy="13" r="11" fill="#EC407A" />
      <circle cx="-5" cy="14" r="11" fill="#E91E63" />
      <circle cx="-13" cy="6" r="11" fill="#EC407A" />
      <circle cx="-12" cy="-7" r="11" fill="#E91E63" />
      <circle cx="0" cy="0" r="7" fill="#880E4F" />
    </g>

    <!-- Flower 11: Lotus-like -->
    <g
      :transform="`translate(1400, 500) rotate(${rotations[10]})`"
      opacity="0.3"
    >
      <circle cx="0" cy="-14" r="6" fill="#4DD0E1" />
      <circle cx="13" cy="-5" r="6" fill="#26C6DA" />
      <circle cx="8" cy="11" r="6" fill="#4DD0E1" />
      <circle cx="-8" cy="11" r="6" fill="#26C6DA" />
      <circle cx="-13" cy="-5" r="6" fill="#4DD0E1" />
      <circle cx="0" cy="0" r="5" fill="#00838F" />
    </g>

    <!-- Flower 12: Rose-like (variant) -->
    <g
      :transform="`translate(900, 750) rotate(${rotations[11]})`"
      opacity="0.3"
    >
      <circle cx="0" cy="0" r="11" fill="#FF7043" />
      <circle cx="8" cy="-7" r="9" fill="#FF8A65" />
      <circle cx="11" cy="1" r="9" fill="#FF7043" />
      <circle cx="6" cy="10" r="9" fill="#FF8A65" />
      <circle cx="-6" cy="10" r="9" fill="#FF7043" />
      <circle cx="-11" cy="1" r="9" fill="#FF8A65" />
      <circle cx="-8" cy="-7" r="9" fill="#FF7043" />
      <circle cx="0" cy="0" r="5" fill="#D84315" />
    </g>

    <!-- Flower 13: Poppy with striped petals -->
    <g
      :transform="`translate(600, 300) rotate(${rotations[12]})`"
      opacity="0.3"
    >
      <circle cx="0" cy="0" r="10" fill="#000000" />
      <ellipse cx="0" cy="-12" rx="7" ry="10" fill="#FF1493" />
      <ellipse cx="10" cy="-6" rx="7" ry="10" fill="#FF69B4" />
      <ellipse cx="10" cy="6" rx="7" ry="10" fill="#FF1493" />
      <ellipse cx="0" cy="12" rx="7" ry="10" fill="#FF69B4" />
      <ellipse cx="-10" cy="6" rx="7" ry="10" fill="#FF1493" />
      <ellipse cx="-10" cy="-6" rx="7" ry="10" fill="#FF69B4" />
    </g>

    <!-- Flower 14: Iris with layered petals -->
    <g
      :transform="`translate(1500, 200) rotate(${rotations[13]})`"
      opacity="0.3"
    >
      <circle cx="0" cy="0" r="8" fill="#4A148C" />
      <ellipse cx="0" cy="-14" rx="6" ry="8" fill="#7B1FA2" />
      <ellipse cx="12" cy="-7" rx="6" ry="8" fill="#9C27B0" />
      <ellipse cx="12" cy="7" rx="6" ry="8" fill="#7B1FA2" />
      <ellipse cx="0" cy="14" rx="6" ry="8" fill="#9C27B0" />
      <ellipse cx="-12" cy="7" rx="6" ry="8" fill="#7B1FA2" />
      <ellipse cx="-12" cy="-7" rx="6" ry="8" fill="#9C27B0" />
    </g>

    <!-- Flower 15: Star-shaped Clematis -->
    <g
      :transform="`translate(1000, 100) rotate(${rotations[14]})`"
      opacity="0.3"
    >
      <polygon
        points="0,-15 4,-4 14,-2 7,5 9,15 0,9 -9,15 -7,5 -14,-2 -4,-4"
        fill="#FF00FF"
        stroke="#FF69B4"
        stroke-width="0.5"
      />
      <circle cx="0" cy="0" r="4" fill="#FFB6C1" />
    </g>

    <!-- Flower 16: Carnation with ruffled petals -->
    <g
      :transform="`translate(400, 500) rotate(${rotations[15]})`"
      opacity="0.3"
    >
      <circle cx="0" cy="0" r="9" fill="#8B0000" />
      <circle cx="0" cy="-13" r="6" fill="#DC143C" />
      <circle cx="1" cy="-12" r="5" fill="#FF0000" />
      <circle cx="11" cy="-7" r="6" fill="#DC143C" />
      <circle cx="10" cy="-6" r="5" fill="#FF0000" />
      <circle cx="11" cy="3" r="6" fill="#DC143C" />
      <circle cx="10" cy="4" r="5" fill="#FF0000" />
      <circle cx="0" cy="13" r="6" fill="#DC143C" />
      <circle cx="1" cy="12" r="5" fill="#FF0000" />
      <circle cx="-11" cy="3" r="6" fill="#DC143C" />
      <circle cx="-10" cy="4" r="5" fill="#FF0000" />
      <circle cx="-11" cy="-7" r="6" fill="#DC143C" />
      <circle cx="-10" cy="-6" r="5" fill="#FF0000" />
    </g>

    <!-- Flower 17: Bluebell cluster -->
    <g
      :transform="`translate(1300, 800) rotate(${rotations[16]})`"
      opacity="0.3"
    >
      <circle cx="0" cy="0" r="2" fill="#4169E1" />
      <circle cx="0" cy="-6" r="3" fill="#4169E1" />
      <circle cx="5" cy="-3" r="3" fill="#6495ED" />
      <circle cx="5" cy="3" r="3" fill="#4169E1" />
      <circle cx="0" cy="6" r="3" fill="#6495ED" />
      <circle cx="-5" cy="3" r="3" fill="#4169E1" />
      <circle cx="-5" cy="-3" r="3" fill="#6495ED" />
    </g>

    <!-- Flower 18: Magnolia with thick petals -->
    <g
      :transform="`translate(200, 600) rotate(${rotations[17]})`"
      opacity="0.3"
    >
      <circle cx="0" cy="0" r="6" fill="#DAA520" />
      <ellipse cx="0" cy="-14" rx="8" ry="12" fill="#F5DEB3" />
      <ellipse cx="12" cy="-7" rx="8" ry="12" fill="#FFE4B5" />
      <ellipse cx="12" cy="7" rx="8" ry="12" fill="#F5DEB3" />
      <ellipse cx="0" cy="14" rx="8" ry="12" fill="#FFE4B5" />
      <ellipse cx="-12" cy="7" rx="8" ry="12" fill="#F5DEB3" />
      <ellipse cx="-12" cy="-7" rx="8" ry="12" fill="#FFE4B5" />
    </g>

    <!-- Flower 19: Marigold dense petals -->
    <g
      :transform="`translate(1100, 300) rotate(${rotations[18]})`"
      opacity="0.3"
    >
      <circle cx="0" cy="0" r="8" fill="#FF8C00" />
      <circle cx="8" cy="0" r="6" fill="#FFA500" />
      <circle cx="6" cy="6" r="6" fill="#FF8C00" />
      <circle cx="0" cy="8" r="6" fill="#FFA500" />
      <circle cx="-6" cy="6" r="6" fill="#FF8C00" />
      <circle cx="-8" cy="0" r="6" fill="#FFA500" />
      <circle cx="-6" cy="-6" r="6" fill="#FF8C00" />
      <circle cx="0" cy="-8" r="6" fill="#FFA500" />
      <circle cx="6" cy="-6" r="6" fill="#FF8C00" />
    </g>

    <!-- Flower 20: Zinna spiral -->
    <g
      :transform="`translate(700, 400) rotate(${rotations[19]})`"
      opacity="0.3"
    >
      <circle cx="0" cy="0" r="7" fill="#FF1493" />
      <circle cx="7" cy="0" r="5" fill="#FF69B4" />
      <circle cx="5" cy="5" r="5" fill="#FF1493" />
      <circle cx="0" cy="7" r="5" fill="#FF69B4" />
      <circle cx="-5" cy="5" r="5" fill="#FF1493" />
      <circle cx="-7" cy="0" r="5" fill="#FF69B4" />
      <circle cx="-5" cy="-5" r="5" fill="#FF1493" />
      <circle cx="0" cy="-7" r="5" fill="#FF69B4" />
    </g>

    <!-- Flower 21: Forget-me-not -->
    <g
      :transform="`translate(450, 150) rotate(${rotations[20]})`"
      opacity="0.3"
    >
      <circle cx="0" cy="0" r="2" fill="#FFD700" />
      <circle cx="0" cy="-6" r="3" fill="#87CEEB" />
      <circle cx="5" cy="-2" r="3" fill="#87CEEB" />
      <circle cx="3" cy="5" r="3" fill="#87CEEB" />
      <circle cx="-3" cy="5" r="3" fill="#87CEEB" />
      <circle cx="-5" cy="-2" r="3" fill="#87CEEB" />
    </g>

    <!-- Flower 22: Camellia -->
    <g
      :transform="`translate(1750, 450) rotate(${rotations[21]})`"
      opacity="0.3"
    >
      <circle cx="0" cy="0" r="10" fill="#FFD700" />
      <circle cx="0" cy="-13" r="8" fill="#FFB6C1" />
      <circle cx="11" cy="-6" r="8" fill="#FF69B4" />
      <circle cx="7" cy="11" r="8" fill="#FFB6C1" />
      <circle cx="-7" cy="11" r="8" fill="#FF69B4" />
      <circle cx="-11" cy="-6" r="8" fill="#FFB6C1" />
    </g>
  </svg>
</template>

<script setup>
import { ref, onMounted } from "vue";

const rotations = ref([
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
]);

onMounted(() => {
  // Initialize random rotations for each flower
  rotations.value = rotations.value.map(() => Math.random() * 360);
});
</script>

<style scoped>
.floral-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
  opacity: 0.3;
}
</style>
