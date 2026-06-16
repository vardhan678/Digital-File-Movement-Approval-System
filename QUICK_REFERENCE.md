# 🔒 HttpOnly Cookie Authentication - Quick Reference

## Installation (Do This First!)
```bash
cd backend
npm install
npm run dev

# In another terminal:
cd frontend  
npm run dev
```

## What Changed
| Aspect | Before | After |
|--------|--------|-------|
| Token Storage | localStorage | HttpOnly Cookie |
| Token Access | JavaScript readable | JavaScript blocked ✅ |
| Redux Persist | Token + User | Nothing |
| API Header | Authorization header | Automatic cookie |
| User Data | From localStorage | Fetched from DB |
| Security | Vulnerable to XSS | CSRF & XSS protected ✅ |

## File Changes (No breaking changes!)
```
Backend (4 files):
✅ server.js - Added cookie-parser
✅ package.json - Added dependency
✅ authController.js - Set/clear cookies
✅ authMiddleware.js - Read from cookies

Frontend (8 files):
✅ api.js - withCredentials: true
✅ store/index.js - Empty whitelist
✅ authSlice.js - Fixed response extraction
✅ App.jsx - Always fetchMe on mount
✅ ProtectedRoute.jsx - Check user only
✅ Navbar.jsx - Already correct
✅ LoginPage.jsx - Already correct
✅ RegisterPage.jsx - Already correct
```

## Cookie Details
```javascript
Cookie Name: authToken
HttpOnly: YES (JavaScript blocked)
Secure: YES (HTTPS in production)
SameSite: STRICT (CSRF protected)
Expiration: 7 days
Sent with: Every API request (automatic)
```

## Testing
```
✅ Login → See dashboard
✅ Logout → See login page
✅ Refresh → Still logged in
✅ DevTools → Cookie visible, HttpOnly checked
✅ Console → document.cookie → Empty (correct!)
✅ Network → See cookie in requests
```

## Emergency Fixes
```bash
# If cookie-parser not installed
cd backend
npm install cookie-parser

# If stuck in login loop
1. Clear browser cookies
2. Clear browser cache
3. Refresh page
4. Login again

# If API requests failing
1. Check Network tab for cookie
2. Verify withCredentials: true in api.js
3. Check backend logs
4. Verify CORS credentials: true
```

## API Response Structure
```javascript
// Backend returns:
{
  success: true,
  message: "Login successful",
  data: {
    _id: "...",
    name: "John",
    email: "john@example.com",
    role: "employee",
    department: "IT"
    // NO token here
  }
}

// Cookie sent separately via Set-Cookie header
Set-Cookie: authToken=<jwt>; HttpOnly; Secure; SameSite=Strict
```

## Security Wins
✅ XSS: Token in HttpOnly cookie (JavaScript blocked)
✅ CSRF: SameSite=Strict prevents cross-site
✅ localStorage: No sensitive data stored
✅ Automatic: Browser handles cookie lifecycle
✅ Session: User data always from DB (fresh)

## Deployment Checklist
- [ ] `npm install` in backend
- [ ] Test all auth flows locally
- [ ] Verify no console errors
- [ ] Check Network tab for cookies
- [ ] Test role-based access
- [ ] Test file operations
- [ ] Clear browser cookies before deploy
- [ ] Set NODE_ENV=production on server

---

**Everything works the same. Now it's secure!** 🔒
