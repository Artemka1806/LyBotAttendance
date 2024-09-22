<script setup>
import axios from 'axios'
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'

const statuses = [
  ["si-check", "green", "В ліцеї"],
  ["si-rocket", "black", "В дорозі"],
  ["si-clock", "blue", "Запізниться"],
  ["si-x", "red", "Вдома"],
]

const API_URL = import.meta.env.VITE_API_URL

let grades = ref([])
let tabs = ref([])
let intervalId = null
let settingsModal = ref(false)
let modalData = ref({
  header: "",
  body: "",
  isActive: false
})

const fetchData = async () => {
  try {
    const response = await axios.get(API_URL + "/attendance")
    grades.value = Object.keys(response.data)
    tabs.value = []
    grades.value.forEach(grade => {
      let data = response.data[grade]
      Object.keys(data).forEach(gradeData => {
        gradeData = data[gradeData]
        Object.keys(gradeData).forEach((student, i) => {
          student = gradeData[student]
          student.number = i + 1
        })
      })
      tabs.value.push({
        grade: grade,
        isActive: false,
        data: data
      })
    })

    let activeTab = sessionStorage.getItem("activeTab")
    if (!activeTab) {
      activeTab = tabs.value[0].grade
    }

    setActiveTab(activeTab)
  } catch (error) {
    console.error("Помилка при отриманні даних:", error)
  }
}

const setActiveTab = (grade) => {
  tabs.value.forEach(tab => {
    tab.isActive = tab.grade === grade
  })
  sessionStorage.setItem("activeTab", grade)
}


const startAutoUpdate = () => {
  intervalId = setInterval(() => {
    fetchData()
  }, 10000)
}

onMounted(() => {
  fetchData()
  startAutoUpdate()
})

onBeforeUnmount(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})

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
  <div class="scrim" v-if="modalData.isActive">
    <div class="modal">
      <div class="is-flex has-items-center">
        <h4 class="has-mb-none has-mt-none">{{ modalData.header }}</h4>
        <div class="close has-ml-auto" @click="modalData.isActive = false"></div>
      </div>
      <div class="has-pt-6" v-html="modalData.body"></div>
    </div>
  </div>

  <div class="scrim setting" v-if="settingsModal">
    <div class="modal">
      <div class="is-flex has-items-center">
        <h4 class="has-mb-none has-mt-none">Налаштування</h4>
        <div class="close has-ml-auto" @click="settingsModal = false"></div>
      </div>
      <div class="has-pt-6">
        Налаштування
      </div>
    </div>
  </div>

  <div class="tab-container is-flex has-direction-column-mobile has-bg-muted has-p-1">
    <a v-for="tab in tabs" :key="tab.grade" @click="setActiveTab(tab.grade)" :id="tab.grade"
      class="tab has-text-center has-h-8 navlink" :class="getTabClass(tab.grade)">
      {{ tab.grade + "-ті класи" }}
    </a>

    <a @click="settingsModal = true" style="width: 50px; margin-left: 5px;"
      class="tab has-text-center has-h-8 navlink has-bg-white has-text-primary">
      <i class="si-hamburger"></i>
    </a>

  </div>
  <div v-for="tab in tabs" :id="'grade-' + tab.grade" class="table-container columns has-w-full has-ml-0 has-mr-0"
    :class="{ 'is-hidden': !tab.isActive }">
    <table v-for="groupName in Object.keys(tab.data)" class="column has-mb-0">
      <thead>
        <tr>
          <th class="has-p-2">№</th>
          <th class="has-p-2">{{ groupName }}</th>
          <th class="has-p-2">Статус</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in tab.data[groupName]">
          <td class="has-p-2">{{ student.number }}</td>
          <td class="has-p-2" style="display: flex; align-items: center;">
            {{ student.name }}
          </td>
          <td class="has-p-2 has-text-center tooltip">
            <i :class="statuses[student.status][0]" style="font-size: 20px;"
              :style="{ 'color': statuses[student.status][1] }"></i>
            <span class="tooltiptext">{{ statuses[student.status][2] }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
