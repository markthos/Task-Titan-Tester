document.addEventListener("DOMContentLoaded", () => {
    const logoutLink = document.getElementById("logout-link");

    if (logoutLink) {
        logoutLink.addEventListener("click", async (event) => {
            event.preventDefault();
            console.log("logout clicked");

            try {
                const response = await fetch("/api/users/logout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                });
                console.log("logout response", response);

                if (response.ok) {
                    // Redirect to the login page
                    localStorage.setItem('toastMessage', 'logged out');
                    window.location.replace("/");
                } else {
                    alert(response.statusText);
                }
            } catch (err) {
                console.error("logout error", err);
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const mobilelogoutLink = document.getElementById("mobile-logout-link");

    if (mobilelogoutLink) {
        mobilelogoutLink.addEventListener("click", async (event) => {
            event.preventDefault();
            console.log("logout clicked");

            try {
                const response = await fetch("/api/users/logout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                });
                console.log("logout response", response);

                if (response.ok) {
                    // Redirect to the login page
                    localStorage.setItem('toastMessage', 'logged out');
                    window.location.replace("/");
                } else {
                    alert(response.statusText);
                }
            } catch (err) {
                console.error("logout error", err);
            }
        });
    }
});