# Quick Reference - Test Auth for MCP

Quick reference for AI/MCP autonomous UI checking.

## 🔗 Test Auth Endpoints

**IMPORTANT: Backend runs on HTTPS port 7164**

### Get Admin Token

```bash
GET https://localhost:7164/api/testauth/admin
```

### Get User Token

```bash
GET https://localhost:7164/api/testauth/user
```

### Custom Token

```bash
POST https://localhost:7164/api/testauth/token?role=Admin&email=custom@test.com
```

## 🎯 Available Roles

- `Trial` - Limited access
- `User` - Regular user
- `ContentModerator` - Moderator
- `Admin` - Full access

## 🤖 MCP Usage Pattern (WORKING)

```typescript
// 1. Get token from test endpoint (HTTPS!)
const page = await browser.newPage();
await page.goto("https://localhost:7164/api/testauth/admin");

// 2. Extract token from JSON response
const tokenData = await page.evaluate(() => {
  return JSON.parse(document.body.textContent);
});
const token = tokenData.token;

// 3. Navigate to app
await page.goto("http://localhost:5173");

// 4. Inject token into localStorage
await page.evaluate((t) => {
  localStorage.setItem("requestToken", t);
}, token);

// 5. MUST reload for auth context to initialize
await page.reload();

// 6. Navigate to target and verify
await page.goto("http://localhost:5173/exercise-library");
await page.waitForTimeout(2000); // Wait for content
await page.screenshot({ path: "verify.png", fullPage: true });
```

## 📦 Configuration

### Backend

- Runs on **HTTPS port 7164** (not HTTP 5000)
- [appsettings.Development.json](../Workout%20Tracker%20BE/workoutTrackerAPI/appsettings.Development.json):

```json
{
  "ApplicationUrl": "https://localhost:7164",
  "TestAuthSettings": {
    "Enabled": true
  }
}
```

## 🔒 Security

- ✅ Development-only (checks `IsDevelopment()`)
- ✅ Requires config flag (`TestAuthSettings.Enabled`)
- ✅ Returns 404 in production
- ✅ Real JWT tokens (12 hour expiration)

## ⚠️ Known Limitations

- **Theme rendering**: Playwright MCP may display light theme when app uses dark
- **Auth timing**: Manual token injection can have timing issues
- **Always verify in real browser** for final approval

## 📚 Full Documentation

See [README.md](./README.md) for detailed information.
