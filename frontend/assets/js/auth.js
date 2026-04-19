document.addEventListener("DOMContentLoaded", () => {
	const loginForm = document.getElementById("loginForm");
	const loginError = document.getElementById("loginError");

	if (!loginForm) {
		return;
	}

	const API_BASE =
		window.API_BASE ||
		localStorage.getItem("API_BASE") ||
		"http://localhost:5000/api";

	loginForm.addEventListener("submit", async (event) => {
		event.preventDefault();
		loginError.classList.add("hidden");
		loginError.textContent = "";

		const email = document.getElementById("email").value.trim();
		const password = document.getElementById("password").value;

		try {
			const response = await fetch(`${API_BASE}/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			const payload = await response.json().catch(() => ({}));

			if (!response.ok) {
				throw new Error(payload.message || "Login failed");
			}

			localStorage.setItem("token", payload.token);
			localStorage.setItem("user", JSON.stringify(payload.user));

			window.location.href = "dashboard.html";
		} catch (error) {
			loginError.textContent = error.message || "Login failed";
			loginError.classList.remove("hidden");
		}
	});
});
