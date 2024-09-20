<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios'

let grades = ref([])

axios.get("https://lybotapi.onrender.com/attendance")
  .then(response => {
    grades.value = Object.keys(response.data)
    console.log(grades)
    grades.value.forEach(grade => {
      tabs.value.push({
        grade: grade,
        isActive: false
      })
    })

    setActiveTab(tabs.value[0].grade)
})


function a() {
  alert("a")
}


let tabs = ref([])


const setActiveTab = (grade) => {
  tabs.value.forEach(tab => {
    tab.isActive = tab.grade === grade
  })
}

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
    <a v-for="tab in tabs" :key="tab.grade" @click="setActiveTab(tab.grade)" :id="tab.grade"
      class="tab has-text-center has-h-8 navlink" :class="getTabClass(tab.grade)">
      {{ tab.grade + "-ті класи" }}
    </a>
  </div>
</template>
