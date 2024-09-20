<script setup>
import axios from 'axios'
import { ref, reactive } from 'vue'

const statuses = [
	["si-check", "green", "В ліцеї"],
	["si-rocket", "black", "В дорозі"],
	["si-clock", "blue", "Запізниться"],
	["si-x", "red", "Вдома"],
]

const API_URL = import.meta.env.VITE_API_URL

let grades = ref([])
let tabs = ref([])



axios.get(API_URL + "/attendance")
  .then(response => {
    grades.value = Object.keys(response.data)
    grades.value.forEach(grade => {
      tabs.value.push({
        grade: grade,
        isActive: false,
        data: response.data[grade]
      })
    })

    let activeTab = sessionStorage.getItem("activeTab")
    if (!activeTab) {
      activeTab = tabs.value[0].grade
    }

    setActiveTab(activeTab)
  })


const setActiveTab = (grade) => {
  tabs.value.forEach(tab => {
    tab.isActive = tab.grade === grade
  })
  sessionStorage.setItem("activeTab", grade)
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
  <!-- <button class="settings-button" @click="alert('a')">
    <i class="si-hamburger"></i>
  </button> -->
  <div class="tab-container is-flex has-direction-column-mobile has-bg-muted has-p-1">
    <a v-for="tab in tabs" :key="tab.grade" @click="setActiveTab(tab.grade)" :id="tab.grade"
      class="tab has-text-center has-h-8 navlink" :class="getTabClass(tab.grade)">
      {{ tab.grade + "-ті класи" }}
    </a>
  </div>
  <div v-for="tab in tabs" :id="'grade-' + tab.grade" class="table-container columns has-w-full has-ml-0 has-mr-0"
    :class="{ 'is-hidden': !tab.isActive }">
    <table v-for="groupName in Object.keys(tab.data)" class="column is-full-mobile has-mb-0 is-one-fifth">
      <thead>
        <tr>
          <th class="has-p-2">№</th>
          <th class="has-p-2">{{ groupName }}</th>
          <th class="has-p-2">Статус</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(student, index) in tab.data[groupName]">
          <td class="has-p-2">{{ Object.keys(tab.data[groupName]).indexOf(index) + 1 }}</td>
          <td class="has-p-2" style="display: flex; align-items: center;">{{ student.name }}</td>
          <td class="has-p-2 has-text-center tooltip">
            <i :class="statuses[student.status][0]" style="font-size: 20px;" :style="{'color': statuses[student.status][1]}"></i>
            <span class="tooltiptext">{{ statuses[student.status][2] }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
