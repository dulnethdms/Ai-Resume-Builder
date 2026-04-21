document.addEventListener("DOMContentLoaded", () => {
	const loginForm = document.getElementById("loginForm");
	const loginError = document.getElementById("loginError");

	if (!loginForm) {
		return;
	}

	const resolveApiBase = () => {
		if (window.API_BASE) return window.API_BASE;

		const storedApiBase = localStorage.getItem("API_BASE");
		const { hostname, origin } = window.location;
		const isLocalHost = hostname === "localhost" || hostname === "127.0.0.1";

		if (storedApiBase) {
			try {
				const parsed = new URL(storedApiBase);
				const storedIsLocal = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";

				// Ignore stale local API_BASE values when running from a deployed URL.
				if (!(storedIsLocal && !isLocalHost)) {
					return storedApiBase;
				}

				localStorage.removeItem("API_BASE");
			} catch {
				localStorage.removeItem("API_BASE");
			}
		}

		if (isLocalHost) {
			return `http://${hostname}:5000/api`;
		}

		return `${origin}/api`;
	};

	const API_BASE = resolveApiBase();
	const SAME_ORIGIN_API_BASE = `${window.location.origin}/api`;

	loginForm.addEventListener("submit", async (event) => {
		event.preventDefault();
		loginError.classList.add("hidden");
		loginError.textContent = "";

		const email = document.getElementById("email").value.trim();
		const password = document.getElementById("password").value;

		try {
			let response;
			try {
				response = await fetch(`${API_BASE}/login`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, password }),
				});
			} catch (networkError) {
				const shouldRetryWithSameOrigin =
					API_BASE !== SAME_ORIGIN_API_BASE &&
					window.location.hostname !== "localhost" &&
					window.location.hostname !== "127.0.0.1";

				if (!shouldRetryWithSameOrigin) {
					throw networkError;
				}

				response = await fetch(`${SAME_ORIGIN_API_BASE}/login`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, password }),
				});
			}

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
