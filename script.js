const tabContainer = document.querySelector(".tab-container");
let tabChildrens = [];


let data = {}

axios.get("data.json")
.then(function (response) {
	const data = response.data
	const grades = Object.keys(data);
	let activeTab = grades[0]

	createTabs(data, grades, activeTab)
	createStudentsTable(data, grades)
	document.querySelector(`#grade-${activeTab}`).classList.remove("is-hidden")
})


const statuses = [
	["si-check", "green", "В ліцеї"],
	["si-location", "pink", "В дорозі"],
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
		tab.addEventListener("click",  function() { setTab(tab, tabChildrens, grades); }, false)
		tabChildrens.push(tab)
		tabContainer.appendChild(tab)

	});
}


function setTab(target, allElements, grades) {
	if (!target.classList.contains("active")){
		allElements.forEach(function(e) {
			if (e.classList.contains("active")) {
				e.classList.remove("active", "has-bg-white", "has-text-primary")
			}
		});
		target.classList.add("active", "has-bg-white", "has-text-primary")
		grades.forEach(function(element, i) {
			block = document.querySelector(`#grade-${element}`)
			if (!block.classList.contains("is-hidden")) {
				block.classList.add("is-hidden");
			} else {
				block.classList.remove("is-hidden");
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
			studentNames.forEach(function(student) {
				let status = studentsData[student]
				let row = createRow(student, status)

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
                <th class="has-p-2">${groupName}</th>
                <th class="has-p-2">Статус</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;
    
    return table;
}


function createRow(name, status) {
    let row = document.createElement("tr");
    row.innerHTML = `
        <td class="has-p-2">${name}</td>
        <td class="has-p-2 has-text-center tooltip">
            <i class="${statuses[status][0]}" style="font-size: 20px; color: ${statuses[status][1]};"></i>
            <span class="tooltiptext">${statuses[status][2]}</span>
        </td>
    `;
    return row;
}

