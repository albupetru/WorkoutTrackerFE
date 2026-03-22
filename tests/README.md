# Test Authentication for AI/MCP Autonomous UI Checking

Documentation for test authentication endpoints used by AI agents (like GitHub Copilot) to autonomously check UI changes using Playwright MCP tools.

**This is for MCP autonomous testing only** - For CI/CD pipeline tests, use a demo account with saved auth state.

## 🔐 Test Authentication System

### Security Features

✅ **Development-only** - Completely disabled in production  
✅ **Explicit opt-in** - Requires config flag in appsettings  
✅ **Returns 404 outside Development** - Can't be accidentally deployed  
✅ **Real JWT tokens** - Same generation logic as production login

### Available Roles

- **Trial** - Limited access
- **User** - Regular user
- **ContentModerator** - Can moderate content
- **Admin** - Full access

## 🛠️ Backend API Endpoints

**CRITICAL: Backend runs on HTTPS port 7164, not HTTP 5000**

### POST `/api/testauth/token`

```bash
POST https://localhost:7164/api/testauth/token?role=Admin
```

**Query Parameters:**

- `role` - User role (Trial, User, ContentModerator, Admin)
- `userId` - Optional custom user ID
- `email` - Optional email
- `name` - Optional display name

### GET `/api/testauth/{role}`

Quick shorthand:

```bash
GET https://localhost:7164/api/testauth/admin
GET https://localhost:7164/api/testauth/user
```

## 🤖 For AI/MCP Autonomous Checking

When I (GitHub Copilot) make UI changes, I can autonomously verify them:

### Workflow

1. **Make changes** to your UI code
2. **Generate test token** via `https://localhost:7164/api/testauth/admin` (HTTPS!)
3. **Use Playwright MCP** to:
   - Navigate to auth endpoint
   - Extract token from JSON response
   - Inject token into localStorage
   - **MUST reload page** for auth to initialize
   - Take screenshots and verify
4. **Report findings** with specific fixes if needed

### Correct MCP Pattern (WORKING)

```typescript
// 1. Get token from HTTPS endpoint
await page.goto("https://localhost:7164/api/testauth/admin");
const tokenData = await page.evaluate(() =>
  JSON.parse(document.body.textContent),
);

// 2. Navigate and inject
await page.goto("http://localhost:5173");
await page.evaluate((t) => {
  localStorage.setItem("requestToken", t);
}, tokenData.token);

// 3. RELOAD for auth context
await page.reload();

// 4. Navigate to target and verify
await page.goto("http://localhost:5173/exercise-library");
await page.waitForTimeout(2000);
await page.screenshot({ path: "check.png", fullPage: true });
```

### Known Limitations

- **Theme differences**: Playwright may render light theme when app uses dark
- **Auth timing**: Components checking `userLoaded` may take time to render
- **Always verify in real browser** for accurate visual confirmation

## 🔒 Security

✅ **Development-only** - Checks `IsDevelopment()` environment  
✅ **Explicit opt-in** - Requires `TestAuthSettings.Enabled: true`  
✅ **Returns 404 in production** - Can't be accidentally deployed

**For CI/CD:** Use a real demo account with saved auth state, not this test endpoint.

## 📁 Files in This Directory

- **[SETUP.md](./SETUP.md)** - Quick reference guide
- **Backend:** [TestAuthController.cs](../../Workout%20Tracker%20BE/workoutTrackerAPI/Controllers/TestAuthController.cs)

## 🚀 Quick Reference

See [SETUP.md](./SETUP.md) for endpoint URLs and MCP usage patterns.
