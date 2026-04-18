const STORAGE_KEY = 'itms-data-v1'
const SESSION_KEY = 'itms-session-v1'

const defaultState = {
    teamMembers: [],
    duties: [],
    tasks: [],
    tickets: [],
    assets: []
}

const credentials = {
    admin: 'password123'
}

const state = loadState()

const loginView = document.getElementById('loginView')
const dashboardView = document.getElementById('dashboardView')
const activeUser = document.getElementById('activeUser')
const loginError = document.getElementById('loginError')

const memberList = document.getElementById('memberList')
const dutyList = document.getElementById('dutyList')
const taskList = document.getElementById('taskList')
const ticketList = document.getElementById('ticketList')
const assetTableBody = document.getElementById('assetTableBody')

document.getElementById('loginForm').addEventListener('submit', (event) => {
    event.preventDefault()
    const username = document.getElementById('username').value.trim()
    const password = document.getElementById('password').value

    if (credentials[username] === password) {
        sessionStorage.setItem(SESSION_KEY, username)
        loginError.textContent = ''
        showDashboard(username)
    } else {
        loginError.textContent = 'Invalid username or password.'
    }
})

document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.removeItem(SESSION_KEY)
    dashboardView.classList.add('hidden')
    loginView.classList.remove('hidden')
    document.getElementById('loginForm').reset()
})

document.getElementById('memberForm').addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    state.teamMembers.push({
        name: formData.get('name'),
        role: formData.get('role'),
        email: formData.get('email')
    })
    persistAndRender()
    event.target.reset()
})

document.getElementById('dutyForm').addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    state.duties.push({
        owner: formData.get('owner'),
        duty: formData.get('duty'),
        priority: formData.get('priority')
    })
    persistAndRender()
    event.target.reset()
})

document.getElementById('taskForm').addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    state.tasks.push({
        title: formData.get('title'),
        assignee: formData.get('assignee'),
        dueDate: formData.get('dueDate')
    })
    persistAndRender()
    event.target.reset()
})

document.getElementById('ticketForm').addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    state.tickets.push({
        issue: formData.get('issue'),
        requestor: formData.get('requestor'),
        status: formData.get('status')
    })
    persistAndRender()
    event.target.reset()
})

document.getElementById('assetForm').addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    state.assets.push({
        owner: formData.get('owner'),
        hostname: formData.get('hostname'),
        ip: formData.get('ip'),
        mac: formData.get('mac')
    })
    persistAndRender()
    event.target.reset()
})

function loadState() {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return structuredClone(defaultState)

    try {
        return { ...structuredClone(defaultState), ...JSON.parse(raw) }
    } catch {
        return structuredClone(defaultState)
    }
}

function persistAndRender() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    render()
}

function render() {
    memberList.innerHTML = state.teamMembers
        .map((member) => `<li><strong>${member.name}</strong> — ${member.role} (${member.email})</li>`)
        .join('')

    dutyList.innerHTML = state.duties
        .map((duty) => `<li><strong>${duty.owner}</strong>: ${duty.duty} <em>[${duty.priority}]</em></li>`)
        .join('')

    taskList.innerHTML = state.tasks
        .map((task) => `<li><strong>${task.title}</strong> assigned to ${task.assignee} (Due: ${task.dueDate})</li>`)
        .join('')

    ticketList.innerHTML = state.tickets
        .map((ticket) => `<li><strong>${ticket.issue}</strong> — ${ticket.requestor} [${ticket.status}]</li>`)
        .join('')

    assetTableBody.innerHTML = state.assets
        .map(
            (asset) =>
                `<tr><td>${asset.owner}</td><td>${asset.hostname}</td><td>${asset.ip}</td><td>${asset.mac}</td></tr>`
        )
        .join('')
}

function showDashboard(username) {
    loginView.classList.add('hidden')
    dashboardView.classList.remove('hidden')
    activeUser.textContent = username
    render()
}

const loggedInUser = sessionStorage.getItem(SESSION_KEY)
if (loggedInUser) {
    showDashboard(loggedInUser)
}
