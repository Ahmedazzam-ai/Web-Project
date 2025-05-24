document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const showRegister = document.getElementById("show-register");
    const showLogin = document.getElementById("show-login");

    if (showRegister && showLogin) {
        showRegister.addEventListener("click", () => {
            loginForm.style.display = "none";
            registerForm.style.display = "block";
        });

        showLogin.addEventListener("click", () => {
            registerForm.style.display = "none";
            loginForm.style.display = "block";
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.getElementById("login-username").value;
            const password = document.getElementById("login-password").value;
            let users = JSON.parse(localStorage.getItem("users") || "{}");
            if (users[username] === password) {
                localStorage.setItem("user", username);
                window.location.href = "dashboard.html";
            } else {
                alert("Invalid credentials.");
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.getElementById("register-username").value;
            const password = document.getElementById("register-password").value;
            let users = JSON.parse(localStorage.getItem("users") || "{}");
            if (users[username]) {
                alert("User already exists.");
            } else {
                users[username] = password;
                localStorage.setItem("users", JSON.stringify(users));
                alert("Registered successfully!");
                showLogin.click();
            }
        });
    }

    const voteForm = document.getElementById("vote-form");
    if (voteForm) {
        const candidates = JSON.parse(localStorage.getItem("candidates") || "[]");
        candidates.forEach((name, index) => {
            voteForm.innerHTML += `
        <label><input type="radio" name="candidate" value="${index}" /> ${name}</label><br/>
      `;
        });
        voteForm.innerHTML += `<button type="submit">Submit Vote</button>`;

        voteForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const selected = voteForm.querySelector("input[name='candidate']:checked");
            const currentUser = localStorage.getItem("user");
            let votedUsers = JSON.parse(localStorage.getItem("votedUsers") || "{}");

            if (votedUsers[currentUser]) {
                alert("You have already voted!");
                return;
            }

            if (selected) {
                let votes = JSON.parse(localStorage.getItem("votes") || "{}");
                votes[selected.value] = (votes[selected.value] || 0) + 1;
                localStorage.setItem("votes", JSON.stringify(votes));
                votedUsers[currentUser] = true;
                localStorage.setItem("votedUsers", JSON.stringify(votedUsers));

                alert("Your vote has been submitted.");
                window.location.href = "dashboard.html";
            } else {
                alert("Please select a candidate.");
            }
        });
    }

    const resultsList = document.getElementById("results-list");
    if (resultsList) {
        const candidates = JSON.parse(localStorage.getItem("candidates") || "[]");
        const votes = JSON.parse(localStorage.getItem("votes") || "{}");
        resultsList.innerHTML = "";
        candidates.forEach((name, index) => {
            const count = votes[index] || 0;
            resultsList.innerHTML += `<li>${name} - ${count} Votes</li>`;
        });
    }

    const addCandidateForm = document.getElementById("add-candidate-form");
    if (addCandidateForm) {
        addCandidateForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("candidate-name").value;
            let candidates = JSON.parse(localStorage.getItem("candidates") || "[]");
            candidates.push(name);
            localStorage.setItem("candidates", JSON.stringify(candidates));
            alert("Candidate added!");
            document.getElementById("candidate-name").value = "";
        });
    }
});
function renderCandidateList() {
    const candidateList = document.getElementById("candidate-list");
    if (candidateList) {
        candidateList.innerHTML = "";
        let candidates = JSON.parse(localStorage.getItem("candidates") || "[]");

        candidates.forEach((name, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
        ${name}
        <button onclick="removeCandidate(${index})" style="margin-left: 10px; background: red; color: white;">Remove</button>
      `;
            candidateList.appendChild(li);
        });
    }
}

function removeCandidate(index) {
    let candidates = JSON.parse(localStorage.getItem("candidates") || "[]");
    let votes = JSON.parse(localStorage.getItem("votes") || "{}");

    // Remove candidate and associated vote count
    candidates.splice(index, 1);
    delete votes[index];

    // Re-index remaining votes
    const newVotes = {};
    Object.keys(votes).forEach((oldKey) => {
        let oldIdx = parseInt(oldKey);
        if (oldIdx > index) {
            newVotes[oldIdx - 1] = votes[oldKey];
        } else if (oldIdx < index) {
            newVotes[oldIdx] = votes[oldKey];
        }
    });

    localStorage.setItem("candidates", JSON.stringify(candidates));
    localStorage.setItem("votes", JSON.stringify(newVotes));

    renderCandidateList();
    alert("Candidate removed successfully!");
}

document.addEventListener("DOMContentLoaded", () => {
    renderCandidateList();
});
