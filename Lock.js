// Detect when the user tries to inspect the webpage
document.addEventListener("contextmenu", function(event) {
    event.preventDefault();
    showProtectionAlert();
});

document.addEventListener("keydown", function(event) {
    if (event.key === "F12" || (event.ctrlKey && event.shiftKey && event.key === "I")) {
        event.preventDefault();
        showProtectionAlert();
    }
});

function showProtectionAlert() {
    // Create a full-screen overlay
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "#fff";
    overlay.style.zIndex = "9999";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.flexDirection = "column";

    // Create alert text
    const alertText = document.createElement("h1");
    alertText.textContent = "This website is protected.";
    overlay.appendChild(alertText);

    // Create reload button
    const reloadButton = document.createElement("button");
    reloadButton.textContent = "Reload Website";
    reloadButton.onclick = function() {
        window.location.reload();
    };
    overlay.appendChild(reloadButton);

    // Add overlay to the page
    document.body.appendChild(overlay);
}


// Disable right-click
document.addEventListener("contextmenu", function(e) {
    e.preventDefault();
}, false);

// Disable keyboard shortcuts
window.addEventListener("keydown", function(e) {
    if (e.ctrlKey && e.shiftKey && e.keyCode == 73) { // Ctrl + Shift + I
        e.preventDefault();
    } else if (e.ctrlKey && e.shiftKey && e.keyCode == 74) { // Ctrl + Shift + J
        e.preventDefault();
    } else if (e.ctrlKey && e.keyCode == 85) { // Ctrl + U
        e.preventDefault();
    }
}, false);

// Disable developer tools
window.addEventListener("keydown", function(e) {
    if (e.ctrlKey && e.shiftKey && e.keyCode == 75) { // Ctrl + Shift + K
        e.preventDefault();
    }
}, false);

// Disable view source
window.addEventListener("keydown", function(e) {
    if (e.ctrlKey && e.keyCode == 83) { // Ctrl + S
        e.preventDefault();
    }
}, false);

// Disable F12 key
window.addEventListener("keydown", function(e) {
    if (e.keyCode == 123) { // F12
        e.preventDefault();
    }
}, false);

// ===== MAIN PROTECTION ===== //
(function() {
    // 1. Block Right-Click (Context Menu)
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showWarning("Right-click is disabled!");
    });

    // 2. Block Ctrl+C, Ctrl+X, Ctrl+A, Ctrl+Shift+I, F12
    document.addEventListener('keydown', function(e) {
        // Block Ctrl+C / Ctrl+X
        if (e.ctrlKey && (e.key === 'c' || e.key === 'C' || e.key === 'x' || e.key === 'X')) {
            e.preventDefault();
            showWarning("Copying is not allowed!");
        }
        // Block Ctrl+A (Select All)
        else if (e.ctrlKey && (e.key === 'a' || e.key === 'A')) {
            e.preventDefault();
            showWarning("Selecting all text is disabled!");
        }
        // Block DevTools (Ctrl+Shift+I, F12)
        else if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i'))) {
            e.preventDefault();
            showWarning("Developer tools are restricted!");
        }
    });

    // 3. Block Copy/Paste Events
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        showWarning("Copying content is disabled!");
    });

    document.addEventListener('cut', function(e) {
        e.preventDefault();
        showWarning("Cutting text is not allowed!");
    });

    document.addEventListener('paste', function(e) {
        e.preventDefault();
        showWarning("Pasting is blocked!");
    });

    // 4. Disable Text Selection via JavaScript (Fallback if CSS fails)
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        showWarning("Text selection is disabled!");
    });

    // 5. Show Warning Message (Visual Deterrent)
    function showWarning(message) {
        // Create or reuse warning element
        let warning = document.getElementById('copyWarning');
        if (!warning) {
            warning = document.createElement('div');
            warning.id = 'copyWarning';
            warning.style.position = 'fixed';
            warning.style.top = '20px';
            warning.style.right = '20px';
            warning.style.background = '#ff4444';
            warning.style.color = 'white';
            warning.style.padding = '10px 20px';
            warning.style.borderRadius = '5px';
            warning.style.zIndex = '99999';
            document.body.appendChild(warning);
        }
        
        warning.textContent = message;
        warning.style.display = 'block';
        
        // Hide after 2 seconds
        setTimeout(() => {
            warning.style.display = 'none';
        }, 2000);
    }

    // 6. Extra: Protect Against Inspect Element (Limited Effectiveness)
    setInterval(() => {
        if (document.documentElement.getAttribute('oncontextmenu') !== 'return false;') {
            document.documentElement.setAttribute('oncontextmenu', 'return false;');
        }
   },1000);
})();
                              
