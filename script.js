let cords = ['scrollX','scrollY'];
const urlParams = new URLSearchParams(window.location.search);


const alertParam = urlParams.get("alert");
if (alertParam != null){
	createModal("Увага", alertParam)
}

const tabContainer = document.querySelector(".tab-container");
let tabChildrens = [];

settings = loadSettings()
let css = `table img:hover {z-index: 10;border-radius: 2px;transform: scale(${settings.imageScale});}`;
let style = document.createElement("style");
if (style.styleSheet) {
    style.styleSheet.cssText = css;
} else {
    style.appendChild(document.createTextNode(css));
}
document.getElementsByTagName('head')[0].appendChild(style);


let data = {}

axios.get(`${settings.apiUrl}/attendance`)
.then(function (response) {
	const data = response.data
	const grades = Object.keys(data);
	let activeTab = sessionStorage.getItem("activeTab");
	if (!activeTab) {
		activeTab = grades[0]
	}
	sessionStorage.setItem("activeTab", activeTab)
	createTabs(data, grades, activeTab)
	createStudentsTable(data, grades)
	document.querySelector(`#grade-${activeTab}`).classList.remove("is-hidden")
	window.scroll(...cords.map(cord => localStorage[cord]));
})


const statuses = [
	["si-check", "green", "В ліцеї"],
	["si-rocket", "black", "В дорозі"],
	["si-clock", "blue", "Запізниться"],
	["si-x", "red", "Вдома"],
]

function createTabs(data, grades, activeTab) {
	grades.forEach(function(e, i) {
		let tab = document.createElement("a")
		tab.innerText = `${e}-ті класи`
		tab.setAttribute("id", e)
		tab.classList.add("tab", "has-text-center", "has-h-8", "navlink")
		tab.setAttribute("style", "padding-top: 5px; padding-bottom: 0px;")
		if (e == activeTab) {
			tab.classList.add("active", "has-bg-white", "has-text-primary")
		}
		tab.addEventListener("click",  function() { setTab(tab, tabChildrens, grades, e); }, false)
		tabChildrens.push(tab)
		tabContainer.appendChild(tab)

	});
}


function setTab(target, allElements, grades, currentGrade) {
	if (!target.classList.contains("active")){
		allElements.forEach(function(e) {
			if (e.classList.contains("active")) {
				e.classList.remove("active", "has-bg-white", "has-text-primary")
			}
		});
		target.classList.add("active", "has-bg-white", "has-text-primary")
		grades.forEach(function(element, i) {
			block = document.querySelector(`#grade-${element}`)
			if (element == currentGrade){
				block.classList.remove("is-hidden");
				sessionStorage.setItem("activeTab", currentGrade)

			} else {
				if (!block.classList.contains("is-hidden")) {
					block.classList.add("is-hidden");
				}
			}
		});
	}

}


function createStudentsTable(data, grades) {
	grades.forEach(function(grade) {
		let section = createSection(grade)
		let gradeData = data[grade]
		let groupNames = Object.keys(gradeData)
		groupNames.forEach(function(group) {
			let table = createTable(group)
			let tbody = table.querySelector("tbody")
			let studentsData = gradeData[group]
			let studentNames = Object.keys(studentsData)
			studentNames.forEach(function(student, num) {
				let name = studentsData[student]["name"]
				let status = studentsData[student]["status"]
				let message = studentsData[student]["message"]
				let avatarUrl = studentsData[student]["avatar_url"]
				let row = createRow(num + 1, student, status, message, avatarUrl, settings)

				tbody.appendChild(row)
			});
			section.appendChild(table)
		});
		document.querySelector("body").appendChild(section)
	});
}


function createSection(grade) {
	let section = document.createElement("div")

	section.setAttribute("id", `grade-${grade}`)
	section.classList.add("table-container", "columns", "is-hidden", "has-w-full", "has-ml-0", "has-mr-0")

	return section
}


function createTable(groupName) {
    let table = document.createElement("table");
    table.classList.add("column", "is-full-mobile", "has-mb-0", "is-one-fifth");

    table.innerHTML = `
        <thead>
            <tr>
            	<th class="has-p-2">№</th>
                <th class="has-p-2">${groupName}</th>
                <th class="has-p-2">Статус</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;
    
    return table;
}


function createRow(num, name, status, message, avatarUrl) {
	let messageElement = ""
	if (message) {
		messageElement = `<i class="si-message" style="color: blue;" onclick="createModal('Причина запізнення', '${message}')"></i> `
	}
    let row = document.createElement("tr");
    row.innerHTML = `
    	<td class="has-p-2">${num}</td>
        <td class="has-p-2" style="display: flex; align-items: center;"><img src="${avatarUrl}"><span style="margin-left: 5px;">${messageElement}${name}</span></td>
        <td class="has-p-2 has-text-center tooltip">
            <i class="${statuses[status][0]}" style="font-size: 20px; color: ${statuses[status][1]};"></i>
            <span class="tooltiptext">${statuses[status][2]}</span>
        </td>
    `;
    return row;
}


function createModal(header, text) {
	let scrim = document.createElement("div")
	scrim.classList.add("scrim")
	let modal = document.createElement("div")
	modal.classList.add("modal")
	modal.innerHTML = `
    <div class="is-flex has-items-center">
        <h4 class="has-mb-none has-mt-none">${header}</h4>
        <div class="close has-ml-auto" onclick="deleteModal()"></div>
    </div>
    <div class="has-pt-6">
        ${text}
    </div>
    `;
    scrim.appendChild(modal)
    document.querySelector("body").appendChild(scrim)
    return modal

}

function deleteModal() {
	let modal = document.querySelector("div.scrim")
	if (modal) {
		modal.remove()
	}
}


function openSettings() {
	let isAutoUpdate = ""
	if (settings.autoUpdate===true || settings.autoUpdate===null) {
		isAutoUpdate = "checked"
	}
	let modalContent = `
	<label class="label" for="autoUpdate">
	    <span class="has-mr-2">Автоматичне оновлення</span>
	    <input type="checkbox" id="autoUpdate" class="checkbox" ${isAutoUpdate} />
	</label>
	<label class="label" for="imageScale">Збільшувати зображення профіля в стільки разів:</label>
	<input class="input" type="number" value="${settings.imageScale}" id="imageScale">
	<label class="label" for="apiUrl">API URL:</label>
	<input class="input" type="text" value="${settings.apiUrl}" id="apiUrl">
	<button class="button is-full" style="margin: auto; margin-top: 32px; display: block" onclick="saveSettings()">Оке</button>
	`;
	createModal("Налаштування", modalContent)
}


function saveSettings() {
	let checkboxValue = document.querySelector("#autoUpdate").checked;
	localStorage.setItem("autoUpdate", checkboxValue);
	let imageScaleValue = document.querySelector("#imageScale").value;
	localStorage.setItem("imageScale", imageScaleValue);
	let apiUrlValue = document.querySelector("#apiUrl").value;
	localStorage.setItem("apiUrl", apiUrlValue);
	deleteModal()
	window.location.reload()
}


function loadSettings() {
	let autoUpdate = localStorage.getItem("autoUpdate")
	if (autoUpdate===true || autoUpdate===null){
		setTimeout("window.location.reload()",10000)
	}
	let imageScale = localStorage.getItem("imageScale")
	if (!imageScale) {
		imageScale = 3
	}
	let apiUrl = localStorage.getItem("apiUrl")
	if (!apiUrl) {
		apiUrl = "https://lybotapi.onrender.com"
	}
	return {
		autoUpdate: autoUpdate,
		imageScale: imageScale,
		apiUrl: apiUrl
	}

}

window.addEventListener('unload', e => cords.forEach(cord => localStorage[cord] = window[cord]));
document.addEventListener("keydown", function(event) { if (event.key == "Escape") {deleteModal()}})

