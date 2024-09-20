<script setup>
import { ref, reactive } from 'vue'

function a() {
  alert("a")
}

let grades = ref([10, 11, 12])
let tabs = ref([])
grades.value.forEach(grade => {
  tabs.value.push({
    grade: grade,
    isActive: false
  })
})

const setActiveTab = (grade) => {
  tabs.value.forEach(tab => {
    tab.isActive = tab.grade === grade
  })
}

setActiveTab(tabs.value[0].grade)

const activeClass = reactive({
  "active": true,
  "has-bg-white": true,
  "has-text-primary": true
})

const getTabClass = (grade) => {
  const tab = tabs.value.find(tab => tab.grade === grade)
  return tab && tab.isActive ? activeClass : ''
}
</script>

<template>
  <button class="settings-button" @click="a">
    <i class="si-hamburger"></i>
  </button>
  <div class="tab-container is-flex has-direction-column-mobile has-bg-muted has-p-1">
    <a v-for="tab in tabs" :key="tab.grade" @click="setActiveTab(tab.grade)" :id="tab.grade" class="tab has-text-center has-h-8 navlink" :class="getTabClass(tab.grade)">
      {{ tab.grade + "-ті класи" }}
    </a>
  </div>
</template>
