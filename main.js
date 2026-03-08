const issuesContainer = document.getElementById("issuesContainer");
const issueCount = document.getElementById("issueCount");
const spinner = document.getElementById("spinner");
const emptyState = document.getElementById("emptyState");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const allTabs = document.querySelectorAll("[data-tab]");

const issueModal = document.getElementById("issueModal");
const modalTitle = document.getElementById("modalTitle");
const modalStatus = document.getElementById("modalStatus");
const modalCategory = document.getElementById("modalCategory");
const modalPriority = document.getElementById("modalPriority");
const modalDescription = document.getElementById("modalDescription");
const modalAuthor = document.getElementById("modalAuthor");
const modalCreatedAt = document.getElementById("modalCreatedAt");
const modalLabel = document.getElementById("modalLabel");
const modalPriorityText = document.getElementById("modalPriorityText");

let allIssues = [];
let activeTab = "all";

// ================= SHOW SPINNER =================
function showSpinner() {
  spinner.classList.remove("hidden");
}

// ================= HIDE SPINNER =================
function hideSpinner() {
  spinner.classList.add("hidden");
}

// ================= STATUS TEXT =================
function getStatusText(status) {
  return String(status || "").trim().toLowerCase();
}

// ================= BORDER COLOR =================
function getBorderClass(status) {
  const statusText = getStatusText(status);

  if (statusText === "open") {
    return "border-t-[4px] border-[#10B981]";
  }

  if (statusText === "closed") {
    return "border-t-[4px] border-[#A855F7]";
  }

  return "border-t-[4px] border-slate-300";
}

// ================= STATUS ICON =================
function getStatusIcon(status) {
  const statusText = getStatusText(status);

  if (statusText === "open") {
    return `
      <div class="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center overflow-hidden">
        <img src="./assets/Open-Status.png" alt="Open Status" class="w-6 h-6 object-contain">
      </div>
    `;
  }

  if (statusText === "closed") {
    return `
      <div class="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center overflow-hidden">
        <img src="./assets/closed-status.png" alt="Closed Status" class="w-6 h-6 object-contain">
      </div>
    `;
  }

  return `
    <div class="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
      <span class="text-[10px] text-slate-400">?</span>
    </div>
  `;
}

// ================= PRIORITY BADGE =================
function getPriorityBadge(priority) {
  const text = String(priority || "medium").trim().toLowerCase();

  if (text === "high") {
    return `<span class="text-[11px] font-medium uppercase px-4 py-[6px] rounded-full bg-red-100 text-red-400">HIGH</span>`;
  }

  if (text === "medium") {
    return `<span class="text-[11px] font-medium uppercase px-4 py-[6px] rounded-full bg-amber-100 text-amber-500">MEDIUM</span>`;
  }

  return `<span class="text-[11px] font-medium uppercase px-4 py-[6px] rounded-full bg-slate-100 text-slate-400">LOW</span>`;
}

// ================= LABELS =================
function getLabels(issue) {
  let labelsHtml = "";

  const firstLabel = issue.labels?.[0] || "bug";
  const secondLabel = issue.labels?.[1] || "help wanted";

  labelsHtml += `
    <span class="inline-flex items-center gap-1 text-[11px] px-3 py-[4px] rounded-full border border-red-300 text-red-400 bg-red-50">
      ${firstLabel}
    </span>
  `;

  labelsHtml += `
    <span class="inline-flex items-center gap-1 text-[11px] px-3 py-[4px] rounded-full border border-amber-300 text-amber-500 bg-amber-50">
      ${secondLabel}
    </span>
  `;

  return labelsHtml;
}

// ================= DATE FORMAT =================
function formatDate(dateText) {
  if (!dateText) return "No Date";

  const date = new Date(dateText);

  if (isNaN(date)) {
    return dateText;
  }

  return date.toLocaleDateString("en-US");
}

// ================= RENDER ISSUES =================
function renderIssues(issues) {
  issuesContainer.innerHTML = "";
  issueCount.innerText = issues.length;

  if (issues.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  } else {
    emptyState.classList.add("hidden");
  }

  for (let i = 0; i < issues.length; i++) {
    const issue = issues[i];

    const card = document.createElement("div");
    card.className =
      "bg-white rounded-[10px] border border-slate-200 overflow-hidden shadow-sm cursor-pointer " +
      getBorderClass(issue.status);

    card.innerHTML = `
      <div class="p-5">
        <div class="flex items-start justify-between gap-3 mb-4">
          <div>
            ${getStatusIcon(issue.status)}
          </div>

          <div>
            ${getPriorityBadge(issue.priority)}
          </div>
        </div>

        <h3 class="font-semibold text-[#1E293B] text-[15px] leading-[22px] min-h-[48px]">
          ${issue.title || "No Title"}
        </h3>

        <p class="text-[13px] leading-[22px] text-slate-500 mt-3 min-h-[66px]">
          ${(issue.description || "No description available").slice(0, 95)}...
        </p>

        <div class="mt-4 flex flex-wrap gap-2">
          ${getLabels(issue)}
        </div>
      </div>

      <div class="border-t border-slate-200 bg-slate-50 px-5 py-4">
        <p class="text-[13px] text-slate-500">#${issue.id || i + 1} by ${issue.author || "john_doe"}</p>
        <p class="text-[13px] text-slate-500 mt-2">${formatDate(issue.createdAt)}</p>
      </div>
    `;

    card.addEventListener("click", function () {
      openModal(issue);
    });

    issuesContainer.appendChild(card);
  }
}

// ================= OPEN MODAL =================
function openModal(issue) {
  const statusText = getStatusText(issue.status);

  modalTitle.innerText = issue.title || "No Title";

  if (statusText === "open") {
    modalStatus.className = "badge bg-green-100 text-green-700 border-0";
    modalStatus.innerText = "Open";
  } else if (statusText === "closed") {
    modalStatus.className = "badge bg-violet-100 text-violet-700 border-0";
    modalStatus.innerText = "Closed";
  } else {
    modalStatus.className = "badge bg-slate-100 text-slate-700 border-0";
    modalStatus.innerText = "Unknown";
  }

  modalCategory.innerText = issue.labels?.[0] || "bug";
  modalPriority.innerText = issue.priority || "Medium";
  modalDescription.innerText = issue.description || "No Description";
  modalAuthor.innerText = issue.author || "Unknown Author";
  modalCreatedAt.innerText = formatDate(issue.createdAt);
  modalLabel.innerText = issue.labels ? issue.labels.join(", ") : "No Label";
  modalPriorityText.innerText = issue.priority || "Medium";

  issueModal.showModal();
}

// ================= LOAD ALL ISSUES =================
async function loadAllIssues() {
  showSpinner();

  const url = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

  try {
    const res = await fetch(url);
    const data = await res.json();

    allIssues = data.data || data || [];
    filterByTab(activeTab);
  } catch (error) {
    console.log(error);
  } finally {
    hideSpinner();
  }
}

// ================= FILTER BY TAB =================
function filterByTab(tabName) {
  activeTab = tabName;

  let filteredIssues = [];

  if (tabName === "all") {
    filteredIssues = allIssues;
  }

  if (tabName === "open") {
    filteredIssues = allIssues.filter(function (issue) {
      return getStatusText(issue.status) === "open";
    });
  }

  if (tabName === "closed") {
    filteredIssues = allIssues.filter(function (issue) {
      return getStatusText(issue.status) === "closed";
    });
  }

  renderIssues(filteredIssues);
}

// ================= TAB BUTTON CLICK =================
for (let i = 0; i < allTabs.length; i++) {
  allTabs[i].addEventListener("click", function () {
    for (let j = 0; j < allTabs.length; j++) {
      allTabs[j].classList.remove("tab-active");
    }

    this.classList.add("tab-active");

    const tabName = this.getAttribute("data-tab");
    filterByTab(tabName);
  });
}

// ================= SEARCH =================
async function searchIssues() {
  const searchText = searchInput.value.trim();

  if (searchText === "") {
    filterByTab(activeTab);
    return;
  }

  showSpinner();

  const url = `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const searchedIssues = data.data || data || [];
    renderIssues(searchedIssues);
  } catch (error) {
    console.log(error);
  } finally {
    hideSpinner();
  }
}

searchBtn.addEventListener("click", function () {
  searchIssues();
});

searchInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    searchIssues();
  }
});

// ================= START =================
loadAllIssues();