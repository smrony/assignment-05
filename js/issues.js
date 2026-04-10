async function loadIssuesFromAPI() {
  const spinner = document.getElementById("spinner");
  spinner.classList.remove("hidden");

  try {
    const res = await fetch(
      "https://phi-lab-server.vercel.app/api/v1/lab/issues",
    );

    const data = await res.json();

    allIssues = data.data || data;

    currentIssues = allIssues;
    console.log(currentIssues);

    renderIssues(allIssues);
  } catch (error) {
    console.error("API error", error);
  }

  spinner.classList.add("hidden");
}
function getPriorityBadgeClass(priority) {
  const statusMap = {
    high: "red",
    medium: "yellow",
    low: "gray",
  };
  return statusMap[priority?.toLowerCase()] || "green"; // default if unknown
}

function getLabelsBadgeClass(labels) {
  const statusMap = {
    bug: "red",
    "help wanted": "yellow",
    enhancement: "green",
  };
  return statusMap[labels?.toLowerCase()] || "gray"; // default if unknown
}

function renderIssues(ls) {
  const container = document.getElementById("issue-list");
  container.innerHTML = "";
  console.log(ls.length);
  ls.forEach((issue) => {
    const card = document.createElement("div");
    if (issue.status === "open") {
      card.className = "issue-card open";
    } else {
      card.className = "issue-card";
    }

    card.innerHTML = `
        <div class="card-head">
              ${
                issue.status === "open"
                  ? `<span class="open-issue">
                    <i class="fa-solid fa-spinner"></i>
                  </span>`
                  : `<span class="closed-issue">
                    <i class="fa-regular fa-circle-check"></i>
                  </span>`
              } 
              <span class="button ${getPriorityBadgeClass(issue.priority)}">${issue.priority}</span>
               
            </div>
            <div class="card-body">
         
              <h2 class="card-title">${issue.title}</h2>
              <p class="text-gray text-sm mb-10">
                ${issue.description}
              </p>
               ${issue.labels
                 .slice(0, 3)
                 .map(
                   (label) =>
                     `<span class="button ${getLabelsBadgeClass(label)}">${label}</span>`,
                 )
                 .join("")} 
            </div>
            <div class="card-foot">
              <p class="text-gray text-sm mb-10">${issue.author}</p>
              <p class="text-gray text-sm">${issue.createdAt}</p>
            </div>
    `;
    card.onclick = () => showIssueDetails(issue);
    container.appendChild(card);
  });
  document.getElementById("issue-counter").innerHTML = `
      <span class="">${ls.length}</span> Issues
      `;
}

// Filter Functions
function filterByStatus(btn) {
  document.querySelectorAll(".tabs ul li").forEach((b) => {
    b.classList.remove("active");
  });
  btn.classList.add("active");

  const status = btn.getAttribute("data-status");
  let filtered = allIssues;

  if (status !== "all") {
    filtered = allIssues.filter((issue) => {
      if (status === "open" && issue.status === "open") return true;
      if (status === "closed" && issue.status === "closed") return true;
      return false;
    });
  }
  renderIssues(filtered);
}
function search() {
  const term = document.getElementById("search-input").value.toLowerCase();
  const filtered = allIssues.filter(
    (issue) =>
      issue.title.toLowerCase().includes(term) ||
      issue.description.toLowerCase().includes(term) ||
      issue.status.toLowerCase().includes(term) ||
      issue.priority.toLowerCase().includes(term) ||
      issue.labels.some((s) => s.toLowerCase().includes(term)),
  );
  renderIssues(filtered);
}
// Show issue Details in Modal
function showModal() {
  document.querySelectorAll(".issue_modal").forEach((b) => {
    b.classList.add("show");
  });
}
function showIssueDetails(issue) {
  document.querySelectorAll(".issue_modal").forEach((b) => {
    b.classList.add("show");
  });
  const modal = document.getElementById("issue_modal");
  const content = document.getElementById("modal-content");

  content.innerHTML = `
  <h1 class="card-title">${issue.title}</h1>
          <div class="mb-10">
            <span class="button green">${issue.status}</span>
            <span class="text-gray text-sm mb-10"
              ><i class="fa-solid fa-circle"></i> ${issue.author}</span
            >
            <span class="text-gray text-sm">
              <i class="fa-solid fa-circle"></i>${issue.createdAt}</span
            >
          </div>
          <div class="mb-10">
            ${issue.labels
              .slice(0, 3)
              .map(
                (label) =>
                  `<span class="button ${getLabelsBadgeClass(label)}">${label}</span>`,
              )
              .join("")} 
          </div>
          <p class="text-gray mb-10">
           ${issue.description}
          </p>
          <div class="modal-footer">
            <div class="width-1-2">
              <p class="text-gray">Assignee:</p>
              <p class=""><strong>${issue.assignee}</strong></p>
            </div>
            <div class="width-1-2">
              <p class="text-gray">Priority:</p>
              <button class="button solid-red">${issue.priority}</button>
            </div>
          </div>
  `;
}
function closeModal() {
  document.querySelectorAll(".issue_modal").forEach((b) => {
    b.classList.remove("show");
  });
}
loadIssuesFromAPI();
