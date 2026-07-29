# Implementation Plan: Photographer Site Refactor

## Overview

Refactor the Esteban Argerich photography portfolio from a React 17 CRA application into a modern React 18 Vite application with CSS Modules, full Firebase stack (Auth, Firestore, Storage, Hosting), admin panel, optimized image delivery, and a new workshops section. Implementation uses JavaScript with JSX.

## Tasks

- [x] 1. Migrate build tooling from CRA to Vite and upgrade React
  - [x] 1.1 Initialize Vite project structure and migrate configuration
    - Remove `react-scripts` dependency and CRA boilerplate
    - Install Vite with `@vitejs/plugin-react`
    - Create `vite.config.js` with SPA routing support and path aliases
    - Move `public/index.html` to project root and update for Vite conventions
    - Update `package.json` scripts (dev, build, preview)
    - _Requirements: 10.1, 10.2_

  - [x] 1.2 Upgrade React to v18 and update entry point
    - Install `react@18` and `react-dom@18`
    - Replace `ReactDOM.render` with `createRoot` in `src/index.js`
    - Remove MUI, Emotion, and styled-components dependencies
    - Install `react-router-dom@6` (keep version, ensure compatibility)
    - _Requirements: 10.1, 10.6_

  - [x] 1.3 Set up CSS Modules, global styles, and design tokens
    - Create `src/styles/variables.css` with CSS custom properties (color palette, spacing, font family, transitions)
    - Create `src/styles/global.css` with reset, base typography, and utility classes
    - Create `src/styles/mixins.css` with responsive breakpoint patterns
    - Enforce limited color palette (max 3 primary + white/black), sans-serif font, 48px+ section spacing
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [x] 2. Set up Firebase services and authentication context
  - [x] 2.1 Configure Firebase SDK with all required services
    - Create `src/services/firebase.js` initializing Firebase App, Auth, Firestore, and Storage
    - Use environment variables for Firebase config values
    - _Requirements: 10.2_

  - [x] 2.2 Implement AuthContext and useAuth hook
    - Create `src/context/AuthContext.jsx` providing auth state to the app
    - Create `src/hooks/useAuth.js` with `user`, `loading`, `signIn`, `signOut`, `isAdmin`
    - Listen to `onAuthStateChanged` for persistent sessions
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 2.3 Implement ProtectedRoute component
    - Create `src/components/common/ProtectedRoute/ProtectedRoute.jsx`
    - Redirect unauthenticated users to `/admin/login`
    - Show loading spinner while auth state resolves
    - _Requirements: 4.5_

- [x] 3. Implement layout components (Header, Footer, Navigation)
  - [x] 3.1 Implement responsive Navigation component with hamburger menu
    - Create `src/components/layout/Navigation/Navigation.jsx` and `Navigation.module.css`
    - Display links to Home, Gallery, Workshops, About
    - Collapse into hamburger menu below 768px with slide animation
    - Inline horizontal layout at 768px and above
    - Fixed position at top of viewport during scrolling
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 3.2 Implement Footer component
    - Create `src/components/layout/Footer/Footer.jsx` and `Footer.module.css`
    - Display copyright with dynamic current year
    - Display social media icon links opening in new tabs
    - _Requirements: 11.1, 11.2, 11.3_

  - [x] 3.3 Implement main App layout with React Router and lazy-loaded routes
    - Set up React Router with all public routes (/, /gallery, /workshops, /about)
    - Set up admin routes (/admin/login, /admin, /admin/gallery, /admin/workshops) wrapped in ProtectedRoute
    - Use `React.lazy` and `Suspense` for admin route code-splitting
    - Add loading spinner as Suspense fallback
    - _Requirements: 10.3, 10.5, 10.6_

- [x] 4. Checkpoint - Verify foundation
  - Ensure the Vite dev server starts, routing works, navigation renders on all breakpoints, and auth context provides state. Ask the user if questions arise.

- [x] 5. Implement Gallery feature (public display)
  - [x] 5.1 Implement galleryService with Firestore queries
    - Create `src/services/galleryService.js` with `getPhotos(category?)`, `getCategories()`, `getPhotoById(id)`
    - Query Firestore `photos` collection with optional category filter
    - Return sorted results by `order` field
    - _Requirements: 3.8_

  - [x] 5.2 Implement OptimizedImage component with progressive loading
    - Create `src/components/common/OptimizedImage/OptimizedImage.jsx` and CSS module
    - Render `<picture>` with WebP source and fallback
    - Support `loading="lazy"`, blur-up from thumbnail placeholder
    - _Requirements: 3.7, 10.4_

  - [x] 5.3 Implement MasonryGrid component
    - Create `src/components/gallery/MasonryGrid/MasonryGrid.jsx` and CSS module
    - CSS Grid-based masonry layout (no MUI dependency)
    - Responsive columns: 1 (< 768px), 2 (768-1199px), 3 (≥ 1200px)
    - Configurable gap, accepts `onPhotoClick` callback
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 5.4 Implement Lightbox component
    - Create `src/components/gallery/Lightbox/Lightbox.jsx` and CSS module
    - Full-screen overlay with close button
    - Keyboard navigation (Escape to close, ArrowLeft/Right for prev/next)
    - Touch swipe gestures for mobile navigation
    - Preload adjacent images
    - _Requirements: 3.5, 3.6_

  - [x] 5.5 Implement CategoryFilter component
    - Create `src/components/gallery/CategoryFilter/CategoryFilter.jsx` and CSS module
    - Display category buttons, highlight active selection
    - Support "All" option to clear filter
    - _Requirements: 3.1_

  - [x] 5.6 Implement Gallery page combining all gallery components
    - Create `src/pages/Gallery/Gallery.jsx` and CSS module
    - Fetch photos via galleryService, manage category filter state
    - Render CategoryFilter, MasonryGrid, and Lightbox
    - Show loading skeleton during data fetch
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 10.5_

- [x] 6. Implement Home and About pages
  - [x] 6.1 Implement Home page with hero section
    - Create `src/pages/Home/Home.jsx` and CSS module
    - Full-viewport hero section with background photograph
    - Photographer name and tagline overlay
    - Mobile-optimized hero image cropping below 768px
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 6.2 Implement About page
    - Create `src/pages/About/About.jsx` and CSS module
    - Display professional photograph and biography text
    - Display contact information and social media links
    - Stack layout on mobile (< 768px), side-by-side on desktop (≥ 768px)
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 7. Implement Workshops feature (public display)
  - [x] 7.1 Implement workshopService with Firestore queries
    - Create `src/services/workshopService.js` with `getWorkshops(filters?)`, `getWorkshopById(id)`
    - Query Firestore `workshops` collection, filter by status
    - _Requirements: 6.6_

  - [x] 7.2 Implement WorkshopCard component
    - Create `src/components/workshops/WorkshopCard/WorkshopCard.jsx` and CSS module
    - Display title, description, date, location, cover image
    - _Requirements: 6.2_

  - [x] 7.3 Implement Workshops page
    - Create `src/pages/Workshops/Workshops.jsx` and CSS module
    - Fetch workshops via workshopService
    - Display cards in single column (< 768px) or 2-3 column grid (≥ 768px)
    - Show "no workshops" message when list is empty
    - Show loading skeleton during fetch
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 10.5_

- [x] 8. Checkpoint - Verify public site
  - Ensure all public pages render correctly, gallery loads from Firestore, responsive layouts work across breakpoints. Ask the user if questions arise.

- [x] 9. Implement Admin Authentication page
  - [x] 9.1 Implement Admin Login page
    - Create `src/pages/admin/Login/Login.jsx` and CSS module
    - Email/password form with validation
    - Call `signIn` from useAuth on submit
    - Display error messages on invalid credentials
    - Redirect to /admin on successful login
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 9.2 Implement Admin Dashboard layout
    - Create `src/components/layout/AdminLayout/AdminLayout.jsx` and CSS module
    - Admin-specific navigation sidebar with links to Gallery Manager, Workshop Manager
    - Logout button calling `signOut` from useAuth, redirecting to Home
    - _Requirements: 4.4_

- [x] 10. Implement Gallery Management (Admin)
  - [x] 10.1 Implement image upload to Firebase Storage with useStorage hook
    - Create `src/hooks/useStorage.js` with `uploadImage(file)` returning `{ url, thumbnailUrl }`
    - Validate file type (JPEG, PNG, WebP) and size (max 10MB) before upload
    - Store in `photos/originals/{id}.webp` path
    - _Requirements: 5.2, 5.5, 5.6, 5.7_

  - [x] 10.2 Implement GalleryManager admin page
    - Create `src/pages/admin/GalleryManager/GalleryManager.jsx` and CSS module
    - Display all gallery images with delete buttons
    - Upload form accepting image files with validation feedback
    - Confirmation dialog before deletion
    - On upload: store image in Firebase Storage, create Firestore document with metadata
    - On delete: remove from Storage and Firestore
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

- [x] 11. Implement Workshop Management (Admin)
  - [x] 11.1 Implement WorkshopManager admin page
    - Create `src/pages/admin/WorkshopManager/WorkshopManager.jsx` and CSS module
    - Display all workshops with edit and delete options
    - Workshop creation form: title, description, date, location, duration, cover image
    - Edit form pre-filled with existing workshop data
    - Confirmation dialog before deletion
    - On create/edit: save to Firestore, upload cover image to Storage
    - On delete: remove Firestore document and Storage cover image
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [x] 12. Implement Firebase security rules and hosting configuration
  - [x] 12.1 Write Firestore and Storage security rules
    - Create/update `firestore.rules` with public read, authenticated write for photos, workshops, categories, siteConfig
    - Create/update `storage.rules` with public read, authenticated write for photos, workshops, site paths
    - _Requirements: 4.5, 5.2, 5.4_

  - [x] 12.2 Update Firebase Hosting configuration for Vite SPA
    - Update `firebase.json` with `build` as public directory (Vite output)
    - Configure SPA rewrites (all routes to index.html)
    - Add cache headers for static assets
    - _Requirements: 10.2_

- [x] 13. Final checkpoint - Full integration verification
  - Ensure all tests pass, all public pages render, admin CRUD flows work end-to-end, responsive design is correct across breakpoints, and Firebase rules are deployed. Ask the user if questions arise.

## Notes

- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- The design does not include a Correctness Properties section, so no property-based tests are included
- CSS Modules are used throughout instead of styled-components or MUI for styling
- Admin routes are code-split with React.lazy to minimize public bundle size
- All image uploads should validate format and size client-side before sending to Firebase Storage

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2"] },
    { "id": 2, "tasks": ["1.3", "2.1"] },
    { "id": 3, "tasks": ["2.2", "2.3"] },
    { "id": 4, "tasks": ["3.1", "3.2"] },
    { "id": 5, "tasks": ["3.3"] },
    { "id": 6, "tasks": ["5.1", "6.1", "6.2", "7.1"] },
    { "id": 7, "tasks": ["5.2", "5.5", "7.2"] },
    { "id": 8, "tasks": ["5.3", "5.4"] },
    { "id": 9, "tasks": ["5.6", "7.3"] },
    { "id": 10, "tasks": ["9.1", "9.2"] },
    { "id": 11, "tasks": ["10.1"] },
    { "id": 12, "tasks": ["10.2", "11.1"] },
    { "id": 13, "tasks": ["12.1", "12.2"] }
  ]
}
```
