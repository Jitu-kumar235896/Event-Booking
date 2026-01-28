## About

This project was built by following a (JavaScript Mastery) YouTube tutorial to understand
Next.js, MongoDB, and authentication.

I started from a tutorial to learn the basics, then refactored the back-end to be compatible with the latest Mongoose and TypeScript best practices, fixed async middleware issues, added proper indexing and validation, and made the schemas production-ready.

### 1️⃣ Updated the project to **latest Mongoose (v9) best practices**

**Before (typical tutorials):**

- Interfaces extend `Document`
    
- Middleware uses `next()`
    
- Mixed async + callback styles
    

**What I changed:**

- Stopped extending `Document`
    
- Used `HydratedDocument<T>` for correct typing
    
- Converted all middleware to **async-safe style**
    
- Removed `next()` and used `throw error`
    

> Prevents subtle runtime bugs and TypeScript errors in modern Mongoose projects.

### 2️⃣ Fixed a real **TypeScript error** most tutorials ignore

```
This expression is not callable.
Type 'SaveOptions' has no call signatures.

```

- Identified incorrect middleware signatures
    
- Fixed how Mongoose infers types
    
- Aligned hooks with Mongoose v9 expectations

