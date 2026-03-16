let allIssues = [];
let filteredIssues = [];

function handleLogin() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (user === 'admin' && pass === 'admin123') {
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('main-section').classList.remove('hidden');
        fetchData();
    } else {
        alert("Incorrect username or password!");
    }
}

async function fetchData() {
    const loader = document.getElementById('loader');
    loader.classList.remove('hidden');
    
    try {
        const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
        const data = await res.json();
        allIssues = data.data;
        displayIssues(allIssues);
    } catch (err) {
        console.error("There was a problem loading data.");
    } finally {
        loader.classList.add('hidden');
    }
}

function displayIssues(issues) {
    const container = document.getElementById('issue-container');
    const countTitle = document.getElementById('issue-count-title');
    container.innerHTML = "";
    countTitle.innerText = `${issues.length} Issues`;

    issues.forEach(issue => {
       
        const statusIcon = issue.status.toLowerCase() === 'open' 
        ? 'Open-Status.png'  
        : 'Closed- Status .png'; 

        
        const priority = issue.priority.toLowerCase();
        let priorityClass = "";

        if (priority === 'high') {
            priorityClass = "bg-[#FEECEC] text-[#EF4444]"; 
        } else if (priority === 'low') {
            priorityClass = "bg-[#EEEFF2] text-[#9CA3AF]"; 
        } else {
            priorityClass = "bg-[#FFF6D1] text-[#F59E0B]"; 
        }

        const borderColor = issue.status.toLowerCase() === 'open' ? 'border-t-green-500' : 'border-t-purple-500';
    
        const card = document.createElement('div');
        card.className = `card bg-white shadow-sm border border-t-4 ${borderColor} cursor-pointer hover:shadow-md transition-all`;
        card.onclick = () => showModal(issue.id);
        
        card.innerHTML = `
            <div class="card-body p-4">
                <div class="flex justify-between items-start mb-2">
                    <img src="./assets/${statusIcon}" alt="status icon" class="w-5 h-5 object-contain">
                    
                    <span class="${priorityClass} px-3 py-1 rounded-full font-bold uppercase text-[12px]">
                        ${issue.priority}
                    </span>
                </div>
                
                <h2 class="card-title text-sm font-bold line-clamp-1">${issue.title}</h2>
                <p class="text-xs text-gray-500 line-clamp-2 mt-1">${issue.description}</p>
                
                <div class="flex flex-wrap gap-1 mt-3">
                    <span class="badge badge-outline gap-1 py-3 text-[10px] font-bold text-red-500 border-red-200 bg-red-50">
                        <img src="./assets/bug.png" class="w-3 h-3 object-contain" alt="bug">
                        BUG
                    </span>
                    <span class="badge badge-outline py-3 text-[10px] font-bold text-orange-500 border-orange-200 bg-orange-50">
                       <img src="./assets/help.png" class="w-3 h-3 object-contain mr-1" alt="help">
                        HELP WANTED
                    </span>
                </div>
                
                <div class="divider my-2"></div>
                
                <div class="flex flex-col text-[10px] text-gray-400">
                    <span>By: ${issue.author}</span>
                    <span>Created: ${new Date(issue.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function loadTab(status) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('tab-active', 'bg-indigo-600', 'text-white'));
    const activeTab = document.getElementById(`tab-${status}`);
    activeTab.classList.add('tab-active', 'bg-indigo-600', 'text-white');

    if (status === 'all') {
        displayIssues(allIssues);
    } else {
        const filtered = allIssues.filter(i => i.status === status);
        displayIssues(filtered);
    }
}

function handleSearch() {
    const searchText = document.getElementById('search-box').value.toLowerCase();
    const filtered = allIssues.filter(issue => 
        issue.title.toLowerCase().includes(searchText) || 
        issue.description.toLowerCase().includes(searchText)
    );
    displayIssues(filtered);
}

async function showModal(id) {
    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
    const data = await res.json();
    const issue = data.data;

    const modalBody = document.getElementById('modal-body');

    
    const priority = issue.priority.toLowerCase();
    let priorityClass = priority === 'low' ? "bg-[#EEEFF2] text-[#9CA3AF]" : (priority === 'high' ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600");

    const statusBg = issue.status.toLowerCase() === 'open' ? "bg-[#00B067]" : "bg-[#4F46E5]";

    modalBody.innerHTML = `
        <h3 class="font-bold text-3xl mb-4">${issue.title}</h3>
        <div class="flex items-center gap-2 mb-6">
            <div class="flex items-center gap-1.5 ${statusBg} text-white px-4 py-1 rounded-full text-sm font-medium">
                <span class="capitalize">${issue.status}</span>
            </div>
            <span class="text-gray-400 mx-1">•</span>
            <p class="text-gray-500">
                <span class="font-semibold text-gray-700">${issue.author}</span> 
                on ${new Date(issue.createdAt).toLocaleDateString()}
            </p>
        </div>
        <p class="text-gray-600 text-lg mb-8">${issue.description}</p>
        <div class="bg-gray-50 p-6 rounded-xl flex justify-between items-center border border-gray-100">
            <div>
                <p class="text-xs text-gray-400 uppercase font-bold mb-1">Assignee</p>
                <p class="font-bold text-gray-800 text-lg">Fahim Ahmed</p>
            </div>
            <div class="text-right">
                <p class="text-xs text-gray-400 uppercase font-bold mb-1">Priority</p>
                <span class="${priorityClass} px-4 py-1 rounded-full font-bold text-xs uppercase">
                    ${issue.priority}
                </span>
            </div>
        </div>
    `;
    issue_modal.showModal();
}