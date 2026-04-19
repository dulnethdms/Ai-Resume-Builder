document.addEventListener("DOMContentLoaded", () => {
	const createResumeBtn = document.getElementById("createResumeBtn");
	const logoutBtn = document.getElementById("logoutBtn");

	if (createResumeBtn) {
		createResumeBtn.addEventListener("click", () => {
			window.location.href = "create-cv.html";
		});
	}

	if (logoutBtn) {
		logoutBtn.addEventListener("click", () => {
			localStorage.removeItem("token");
			localStorage.removeItem("user");
			window.location.href = "login.html";
		});
	}
});
