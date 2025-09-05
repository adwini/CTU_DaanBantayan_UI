/**
 * Test file to verify authentication flow
 * Run this in the browser console to test the authentication status checking
 */

// Test function to check authentication status
async function testAuthFlow() {
  console.log("🧪 Testing authentication flow...");

  // First, let's see what's in localStorage
  const savedState = localStorage.getItem("auth_state");
  console.log("💾 Saved auth state:", savedState);

  // Test the auth service directly
  try {
    const response = await fetch("/api/profiles/me", {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(
      "📄 /api/profiles/me response:",
      response.status,
      await response.text()
    );
  } catch (error) {
    console.log("❌ /api/profiles/me error:", error);
  }

  // Test teachers endpoint
  try {
    const response = await fetch("/api/teachers", {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(
      "👩‍🏫 /api/teachers response:",
      response.status,
      await response.json()
    );
  } catch (error) {
    console.log("❌ /api/teachers error:", error);
  }

  // Test subjects endpoint
  try {
    const response = await fetch("/api/subjects", {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(
      "📚 /api/subjects response:",
      response.status,
      await response.json()
    );
  } catch (error) {
    console.log("❌ /api/subjects error:", error);
  }
}

// Test login
async function testLogin() {
  console.log("🔐 Testing login...");

  try {
    const response = await fetch("/api/auth/session", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "admin@admin.com",
        password: "admin123",
      }),
    });

    const data = await response.json();
    console.log("✅ Login response:", response.status, data);

    // Now test auth flow after login
    await testAuthFlow();
  } catch (error) {
    console.log("❌ Login error:", error);
  }
}

// Export functions for browser console use
window.testAuthFlow = testAuthFlow;
window.testLogin = testLogin;

console.log(
  "🧪 Test functions loaded. Use testLogin() or testAuthFlow() in console."
);
