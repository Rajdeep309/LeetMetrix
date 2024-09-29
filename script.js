document.addEventListener("DOMContentLoaded", function() {
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");

    // Function to validate username input
    function validateUsername(username) {
        if (username.trim() === "") {
            alert("Username should not be empty");
            return false;
        }
        const rgx = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatch = rgx.test(username);
        if (!isMatch) {
            alert("Invalid Username");
        }
        return isMatch;
    }

    // Function to update progress circles
    function updateProgress(solved, total, label, circle) {
        const per = (solved / total) * 100;
        circle.parentElement.style.setProperty("--progress-degree", `${per}%`);
        label.textContent = `${solved}/${total}`;
    }

    // Function to display user data
    function displayUserData(parsedData) {
        const totalEasys = parsedData.totalEasy;
        const totalMediums = parsedData.totalMedium;
        const totalHards = parsedData.totalHard;

        const easySolveds = parsedData.easySolved;
        const mediumSolveds = parsedData.mediumSolved;
        const hardSolveds = parsedData.hardSolved;

        // Update progress circles
        updateProgress(easySolveds, totalEasys, easyLabel, easyProgressCircle);
        updateProgress(mediumSolveds, totalMediums, mediumLabel, mediumProgressCircle);
        updateProgress(hardSolveds, totalHards, hardLabel, hardProgressCircle);

        // Display total submissions and user rank
        const totalSubmissionsElement = document.getElementById('total-submissions');
        const userRankElement = document.getElementById('user-rank');
        totalSubmissionsElement.textContent = `Total Submissions: ${parsedData.totalSolved}`;
        userRankElement.textContent = `Rank: ${parsedData.ranking}`;
    }

    // Function to fetch user data from the API
    async function fetchUserDetails(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Unable to fetch user details");
            }
            const parsedData = await response.json();
            console.log("Logging data: ", parsedData);

            displayUserData(parsedData);
        } catch (error) {
            const statsContainer = document.querySelector(".stats-container");
            statsContainer.innerHTML = `<p>No data found</p>`;
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    // Event listener for search button click
    searchButton.addEventListener('click', function() {
        const username = usernameInput.value;
        if (validateUsername(username)) {
            fetchUserDetails(username);
        }
    });
});
