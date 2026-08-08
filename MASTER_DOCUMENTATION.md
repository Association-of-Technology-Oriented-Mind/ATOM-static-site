# 📚 ATOM Club Website - Master Documentation & User Guide

> **⚠️ Outdated (2026-08-08).** This guide predates the Firebase migration and
> still describes the localStorage CMS and the hardcoded `admin` / `atomcms`
> login, neither of which exists any more. See `docs/architecture.md`,
> `docs/API.md`, and `docs/setup.md` for current behaviour.


**Complete Guide for Everyone - From Newcomers to Advanced Users**

---

## 📖 Table of Contents

### Getting Started
1. [Introduction](#introduction)
2. [Quick Start (5 Minutes)](#quick-start)
3. [Understanding the Website](#understanding-the-website)

### For Content Managers & Users
4. [Navigating the Website](#navigating-the-website)
5. [Admin Panel Guide](#admin-panel-guide)
6. [Managing Events](#managing-events)
7. [Managing Team Members](#managing-team-members)
8. [Managing Photo Gallery](#managing-photo-gallery)
9. [Managing Clubs](#managing-clubs)

### For Developers
10. [Technology Stack](#technology-stack)
11. [Project Structure](#project-structure)
12. [Development Workflow](#development-workflow)
13. [Component Architecture](#component-architecture)
14. [Customization Guide](#customization-guide)

### For Technical Leads
15. [System Architecture](#system-architecture)
16. [Data Architecture](#data-architecture)
17. [Authentication System](#authentication-system)
18. [Performance Optimization](#performance-optimization)
19. [Security Considerations](#security-considerations)

### Operations & Maintenance
20. [Regular Maintenance Tasks](#regular-maintenance-tasks)
21. [Update Procedures](#update-procedures)
22. [Backup & Restore](#backup-and-restore)
23. [Troubleshooting](#troubleshooting)

### Deployment & Production
24. [Build for Production](#build-for-production)
25. [Deployment Options](#deployment-options)
26. [Post-Deployment](#post-deployment)

### Reference
27. [Best Practices](#best-practices)
28. [FAQ](#frequently-asked-questions)
29. [Tips & Tricks](#tips-and-tricks)

---

# Getting Started

## Introduction

### What is ATOM Club Website?

The ATOM Club website is a modern, fully-featured web application built with cutting-edge technologies. It serves as the digital hub for:
- Showcasing club activities and achievements
- Managing events and registrations
- Highlighting team members and coordinators
- Displaying photo galleries
- Managing sub-clubs and their activities

### Who is this documentation for?

- **New Team Members**: Learn how to use and maintain the website
- **Content Managers**: Update events, photos, and team information
- **Developers**: Understand the codebase and contribute
- **Technical Leads**: Understand architecture and make decisions
- **Club Members**: Navigate and use the website effectively

### Key Features

- ✨ Modern, animated UI with smooth transitions
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🔐 Secure admin panel with authentication
- 🖼️ Image upload and gallery management
- 📝 Event creation and management
- 👥 Team member profiles
- 🎨 Sub-club showcases
- ⚡ High-performance optimization
- ♿ Accessibility features

---

## Quick Start

### Prerequisites

- **Node.js**: Version 18.x or higher
- **npm** or **bun**: Package manager
- **Git**: Version control
- **Code Editor**: VS Code recommended

### Installation (5 Minutes)

```bash
# 1. Clone repository
git clone <repository-url>
cd Atom_Standalone

# 2. Install dependencies
npm install
# OR
bun install

# 3. Start development server
npm run dev
# OR
bun dev

# 4. Open browser
# Visit: http://localhost:5173
```

### Admin Access

```
URL:      http://localhost:5173/login
Username: <removed>
   Password: <removed>

⚠️ CHANGE THESE BEFORE DEPLOYING!
```

### Available Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run linter
```

### First Steps After Installation

1. **Review configuration files**
   - `vite.config.ts`: Build configuration
   - `tailwind.config.ts`: Styling configuration
   - `src/config/admin-credentials.ts`: Admin login

2. **Change admin credentials**
   ```typescript
   // src/config/admin-credentials.ts
   export const ADMIN_CREDENTIALS = {
     username: 'your_username',
     password: 'your_secure_password'
   };
   ```

3. **Configure EmailJS** (for contact forms)
   - Sign up at [EmailJS](https://www.emailjs.com/)
   - Edit `src/config/emailjs.ts`
   - Add your service ID, template ID, and public key

---

## Understanding the Website

### Website Structure

The website has two main parts:

#### 1. Public Website (Anyone can view)
- No login required
- View events, team, photos
- Read about the club
- Contact the club

#### 2. Admin Panel (For club managers only)
- Requires login
- Add/edit/delete content
- Upload photos
- Manage events and team info

### Public Website Sections

When you visit the website, you'll see these sections:

**1. Hero Section** (Top)
- Big ATOM logo
- Club tagline
- Animated background
- "Learn More" button

**2. About Section**
- What ATOM Club is
- Mission and vision
- Club description

**3. Achievements Section**
- Accomplishments showcase
- Statistics
- Award badges

**4. Events Section**
- Upcoming events (future)
- Past events (history)
- Event details and registration

**5. Team Coordinators**
- Photos of team members
- Names and roles
- Auto-scrolling carousel
- Click for full profiles

**6. Photo Gallery**
- 6 recent photos preview
- Event photos
- Click to view full gallery

**7. Sub-Clubs Section**
- HackHive (Competitive Programming)
- UnBias (AI/ML)
- Career Guidance
- DotDev (Web Development)
- RnD (Research)

**8. Contact Section**
- Contact form
- Email, phone, address

---

# For Content Managers & Users

## Navigating the Website

### Top Navigation Menu

At the top of every page:
- **Home**: Go back to main page
- **Events**: Jump to events section
- **Team**: Jump to coordinators
- **Gallery**: Jump to photos
- **Contact**: Jump to contact form
- **Admin**: Login to admin panel (managers only)

### How to Use Each Section

#### Hero Section
- Read the introduction
- Click "Learn More" to scroll down

#### Events Section
- Click event cards for details
- Click "Register Now" to sign up
- View past events timeline

#### Team Section
- Hover to pause auto-scroll
- Click any person for full profile
- Click "View All" for grid view

#### Photo Gallery
- Hover over photos (they zoom!)
- Click any photo to view full gallery
- Click "View Complete Gallery" button

#### Sub-Clubs
- Click any club card to learn more
- View club events
- Access social media links

---

## Admin Panel Guide

### How to Login

1. **Go to Login Page**:
   - Click "Admin" in navigation menu
   - Or visit: `yourwebsite.com/login`

2. **Enter Credentials**:
   ```
   Username: <removed>
   Password: <removed>
   ```

3. **Click "Login"**

4. **You're In!** You'll see the admin dashboard

### Dashboard Overview

After logging in, you'll see:

**Statistics (4 boxes)**:
- 📅 Total Events
- 👥 Total Coordinators  
- 🏢 Total Clubs
- 🖼️ Total Photos

**Left Sidebar Menu**:
- 📊 Dashboard (overview)
- 📅 Events (manage events)
- 👥 Coordinators (manage team)
- 🏢 Clubs (manage sub-clubs)
- 🖼️ Gallery (manage photos)
- 🚪 Logout (exit admin panel)

### Important Tips

✅ **Always logout when done**  
✅ **Don't share login credentials**  
✅ **Make changes carefully** - You can't undo deletions  
✅ **Test after changes** - View website to verify updates  

---

## Managing Events

### Adding a New Event

**Step 1: Click "Events" in sidebar**

**Step 2: Click "Add New Event" button**

**Step 3: Fill out the form**

| Field | What to Enter | Example |
|-------|---------------|---------|
| **Title** | Event name | "Web Development Workshop" |
| **Description** | What the event is about | "Learn HTML, CSS, and JavaScript basics" |
| **Date** | When it happens | "2024-03-15" |
| **Time** | What time | "10:00 AM - 2:00 PM" |
| **Location** | Where it is | "Room 301, Computer Lab" |
| **Image URL** | Link to event poster | "https://example.com/poster.jpg" |
| **Type** | Free or Paid | Select from dropdown |
| **Registration Link** | Sign-up form URL | "https://forms.google.com/..." |
| **Status** | Upcoming or Past | "Upcoming" for future events |
| **Club** | Which sub-club | Select if applicable (optional) |

**Step 4: Click "Save Event"**

### Getting an Image URL

**Option 1: Upload to Image Hosting** (Recommended)
1. Go to [imgur.com](https://imgur.com) or [imgbb.com](https://imgbb.com)
2. Upload your event poster
3. Copy the image link
4. Paste in "Image URL" field

**Option 2: Use Existing URL**
- Right-click image
- Select "Copy Image Address"
- Paste in "Image URL" field

### Editing an Event

1. Find event in the list
2. Click **"Edit"** button
3. Change any fields
4. Click **"Update Event"**

### Deleting an Event

⚠️ **Warning**: This permanently removes the event!

1. Find event in the list
2. Click **"Delete"** button
3. Confirm deletion
4. Event is removed

**When to delete**:
- Event created by mistake
- Duplicate event
- Very old past events (cleanup)

---

## Managing Team Members

### Adding a New Coordinator

**Step 1: Click "Coordinators" in sidebar**

**Step 2: Click "Add New Coordinator"**

**Step 3: Fill out the form**

| Field | What to Enter | Example |
|-------|---------------|---------|
| **Name** | Full name | "John Doe" |
| **Role** | Position/title | "Technical Lead" |
| **Bio** | Short description | "Passionate about web development" |
| **Image URL** | Profile photo link | "https://imgur.com/abc123.jpg" |
| **LinkedIn** | LinkedIn profile | "linkedin.com/in/johndoe" |
| **Email** | Contact email | "john.doe@example.com" |

**Step 4: Click "Save Coordinator"**

### Photo Tips

**Good Photos**:
✅ Professional headshot
✅ Clear face visible
✅ Good lighting
✅ Plain background
✅ Square format (1:1 ratio)

**Avoid**:
❌ Group photos
❌ Blurry images
❌ Dark/bad lighting
❌ Sunglasses
❌ Inappropriate content

**Recommended Size**: 400x400 pixels or larger

### Writing Good Bios

**Formula**: 
```
[Name] is a [role] specializing in [area]. [One achievement or interest].
```

**Example**:
```
"Sarah is a Final Year CS student passionate about AI and Machine Learning. 
She has participated in 5+ hackathons and loves mentoring juniors."
```

**Keep it**: 2-3 sentences, under 100 words

---

## Managing Photo Gallery

### Uploading Photos

**Method 1: Drag and Drop** (Easiest!)
1. Open **Gallery** section
2. Find photos on your computer
3. **Drag** them into upload area
4. **Drop** them
5. Wait for "Upload Complete"
6. Done!

**Method 2: Click to Browse**
1. Click **"Browse Files"** button
2. Select photos
3. Hold **Ctrl** (Windows) or **Cmd** (Mac) for multiple
4. Click **"Open"**
5. Wait for upload

### Photo Guidelines

**File Types**:
- ✅ JPG/JPEG
- ✅ PNG
- ✅ GIF

**Size Limits**:
- Maximum: 5 MB per photo

**Recommended**:
- Width: 1200-2000 pixels
- Format: JPEG
- Aspect ratio: 4:3 or 16:9

**Content**:
✅ Event photos
✅ Team activities
✅ Club meetings
✅ Workshop sessions

❌ Personal/unrelated photos
❌ Low quality/blurry
❌ Inappropriate content

### Deleting Photos

1. Find photo in gallery
2. Click **"Delete"** button
3. Confirm deletion
4. Photo removed

---

## Managing Clubs

### Adding/Editing a Club

**Step 1: Click "Clubs" in sidebar**

**Step 2: Click "Add New Club" or "Edit"**

**Step 3: Fill out form**

| Field | What to Enter |
|-------|---------------|
| **Name** | Club name |
| **Description** | What the club does (2-3 sentences) |
| **Icon** | Icon name from Lucide icons |
| **Image** | Club logo/banner URL |
| **Website** | Club website (optional) |
| **Events** | Associated events |

**Step 4: Click "Save Club"**

---

# For Developers

## Technology Stack

### Core Technologies

**Frontend Framework**
- **React 18.3.1** - UI library
- **TypeScript 5.8.3** - Type safety
- **Vite 5.4.19** - Build tool

**Styling**
- **Tailwind CSS 3.4.17** - Utility CSS
- **PostCSS** - CSS processing
- **Custom CSS** - Additional styles

**Animation**
- **Framer Motion 12** - UI animations
- **GSAP 3** - Advanced animations
- **OGL 1.0** - WebGL 3D effects

**Routing & State**
- **React Router DOM 6.30** - Client routing
- **React Context API** - Global state
- **TanStack Query 5** - Server state

**Forms & Validation**
- **React Hook Form 7** - Form handling
- **Zod 3** - Schema validation

**UI Components**
- **Shadcn/ui** - Component library
- **Radix UI** - Primitives
- **Lucide React** - Icons

**Additional Libraries**
- **EmailJS** - Email integration
- **Date-fns** - Date manipulation
- **React Markdown** - Markdown rendering

---

## Project Structure

```
Atom_Standalone/
├── public/                      # Static assets
│   ├── 404.html
│   ├── index.html
│   ├── robots.txt
│   └── EVENTS/                 # Event images
│
├── src/                         # Source code
│   ├── assets/                 # Media files
│   │   ├── HACKHIVE/
│   │   ├── PHOTOS/            # Gallery images
│   │   └── UNBIAS/
│   │
│   ├── components/             # React components
│   │   ├── About.tsx
│   │   ├── Achievements.tsx
│   │   ├── Clubs.tsx
│   │   ├── Coordinators.tsx
│   │   ├── EventsSection.tsx
│   │   ├── Hero.tsx
│   │   ├── Navigation.tsx
│   │   ├── PhotoGallerySection.tsx
│   │   ├── ThreeDBackground.tsx
│   │   │
│   │   ├── admin/             # Admin components
│   │   │   ├── ClubsManager.tsx
│   │   │   ├── CoordinatorsManager.tsx
│   │   │   ├── EventsManager.tsx
│   │   │   ├── GalleryManager.tsx
│   │   │   └── ImageUpload.tsx
│   │   │
│   │   ├── events/            # Event components
│   │   │   ├── EventCard.tsx
│   │   │   ├── FeaturedEventCard.tsx
│   │   │   ├── ModernEventModal.tsx
│   │   │   └── PastEventTimeline.tsx
│   │   │
│   │   └── ui/                # UI components (40+)
│   │
│   ├── config/                 # Configuration
│   │   ├── admin-credentials.ts
│   │   └── emailjs.ts
│   │
│   ├── constants/              # Data constants
│   │   ├── events.ts
│   │   ├── coordinators.ts
│   │   ├── clubs.ts
│   │   └── ... (sub-club data)
│   │
│   ├── contexts/               # React contexts
│   │   └── AuthContext.tsx
│   │
│   ├── hooks/                  # Custom hooks
│   │   ├── use-mobile.tsx
│   │   ├── use-toast.ts
│   │   ├── useImageProtection.ts
│   │   └── usePerformanceMonitor.ts
│   │
│   ├── lib/                    # Utilities
│   │   └── utils.ts
│   │
│   ├── pages/                  # Page components
│   │   ├── Admin.tsx
│   │   ├── Index.tsx          # Home page
│   │   ├── Login.tsx
│   │   ├── FullPhotoGallery.tsx
│   │   └── NotFound.tsx
│   │
│   ├── styles/                 # CSS files
│   │   ├── events.css
│   │   ├── event-enhancements.css
│   │   └── image-protection.css
│   │
│   ├── utils/                  # Utility functions
│   │   ├── dataService.ts     # Data management
│   │   ├── imageOptimization.ts
│   │   └── api.ts
│   │
│   ├── App.tsx                 # Root component
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
│
├── vite.config.ts              # Vite configuration
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript config
├── package.json                # Dependencies
└── README.md                   # Project readme
```

---

## Development Workflow

### Starting Development

```bash
# Start dev server
npm run dev

# Visit http://localhost:5173
# Changes auto-reload
```

### Code Style Guidelines

**TypeScript**:
- Use TypeScript for all files
- Define interfaces for data
- Avoid `any` type

**React**:
- Use functional components
- Implement custom hooks for logic
- Keep components small and focused

**CSS**:
- Use Tailwind utility classes
- Create custom classes in index.css
- Follow BEM naming for custom CSS

**File Naming**:
- Components: PascalCase (e.g., `EventCard.tsx`)
- Utilities: camelCase (e.g., `dataService.ts`)
- Constants: camelCase (e.g., `events.ts`)

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add: new feature description"

# Push to remote
git push origin feature/new-feature

# Create pull request
```

**Commit Message Format**:
- `Add:` New feature
- `Fix:` Bug fix
- `Update:` Modify existing
- `Refactor:` Code restructuring
- `Docs:` Documentation

### Testing Checklist

- [ ] Test on desktop browser
- [ ] Test on mobile devices
- [ ] Check responsive design
- [ ] Verify animations work
- [ ] Test admin panel
- [ ] Check console for errors
- [ ] Verify links work
- [ ] Test forms
- [ ] Check image loading

---

## Component Architecture

### Component Hierarchy

```
App.tsx
├── Navigation
├── Routes
│   ├── Index (Home)
│   │   ├── Hero
│   │   ├── About
│   │   ├── Achievements
│   │   ├── EventsSection
│   │   ├── Coordinators
│   │   ├── PhotoGallerySection
│   │   ├── Clubs
│   │   └── ThreeDBackground
│   ├── Login
│   ├── Admin (Protected)
│   │   ├── EventsManager
│   │   ├── CoordinatorsManager
│   │   ├── ClubsManager
│   │   └── GalleryManager
│   └── FullPhotoGallery
```

### Component Patterns

**Presentational Components**:
```typescript
// Pure UI, no logic
export const EventCard = ({ event }: { event: Event }) => {
  return (
    <Card>
      <CardTitle>{event.title}</CardTitle>
      <CardDescription>{event.description}</CardDescription>
    </Card>
  );
};
```

**Container Components**:
```typescript
// Handle data and logic
export const EventsSection = () => {
  const events = getEvents();
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  return (
    <section>
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </section>
  );
};
```

**Custom Hooks**:
```typescript
// Reusable logic
export const useImageProtection = (options) => {
  useEffect(() => {
    // Implementation
  }, [options]);
};
```

---

## Customization Guide

### Changing Colors

**Edit**: `tailwind.config.ts`

```typescript
colors: {
  'atom-primary': '#4A90E2',      // Main blue
  'atom-secondary': '#7B68EE',    // Purple
  'atom-metallic': '#C0C0C0',     // Silver
  'electric': '#00D9FF',          // Cyan
  // Add your colors
}
```

**Usage**:
```tsx
<div className="bg-atom-primary text-white">
  Content
</div>
```

### Changing Fonts

**Edit**: `src/index.css`

```css
@import url('https://fonts.googleapis.com/css2?family=Your+Font:wght@400;700&display=swap');

body {
  font-family: 'Your Font', sans-serif;
}
```

### Adding New Sections

1. **Create Component**:
```tsx
// src/components/NewSection.tsx
export const NewSection = () => {
  return (
    <section className="py-20">
      <h2>New Section</h2>
    </section>
  );
};
```

2. **Import in Page**:
```tsx
// src/pages/Index.tsx
import { NewSection } from '@/components/NewSection';

<NewSection />
```

### Modifying Animations

```tsx
<motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ 
    duration: 0.8,      // Animation length
    delay: 0.2,         // Start delay
    ease: "easeOut"     // Easing function
  }}
>
  Content
</motion.div>
```

---

# For Technical Leads

## System Architecture

### Architecture Pattern

**Single Page Application (SPA)** with client-side routing

```
┌─────────────────────────────────────┐
│      User Interface Layer           │
│  (React + Framer Motion)            │
├─────────────────────────────────────┤
│     Application Logic Layer         │
│  (Hooks + Context + Utils)          │
├─────────────────────────────────────┤
│       Data Storage Layer            │
│  (Local Storage + Constants)        │
├─────────────────────────────────────┤
│     External Services Layer         │
│  (EmailJS + Image Hosting)          │
└─────────────────────────────────────┘
```

### Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
Data Service Function
    ↓
Local Storage / Constants
    ↓
State Update
    ↓
UI Re-render
```

---

## Data Architecture

### Storage Strategy

**Local Storage** (Browser):
```javascript
- events: Array<Event>
- coordinators: Array<Coordinator>
- clubs: Array<Club>
- gallery: Array<Image>
```

**Constants** (Static Data):
```javascript
- src/constants/events.ts
- src/constants/coordinators.ts
- src/constants/clubs.ts
```

### Data Models

**Event Model**:
```typescript
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location: string;
  image: string;
  type: 'free' | 'paid';
  registrationLink: string;
  status: 'upcoming' | 'past';
  club?: string;
  featured?: boolean;
}
```

**Coordinator Model**:
```typescript
interface Coordinator {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin: string;
  email?: string;
}
```

**Club Model**:
```typescript
interface Club {
  id: string;
  name: string;
  description: string;
  icon: string;
  image: string;
  website?: string;
  github?: string;
  events: string[];
}
```

---

## Authentication System

### Auth Flow

```
Login Page
    ↓
Validate credentials
    ↓
Store auth state in Context
    ↓
Redirect to Admin Dashboard
    ↓
Protected Route checks auth
    ↓
Allow/Deny access
```

### Implementation

**Auth Context**:
```typescript
interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}
```

**Protected Route**:
```typescript
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
}
```

### Security Considerations

✅ **Implemented**:
- Basic authentication
- Input validation (Zod)
- Image right-click protection
- XSS prevention (React escaping)

⚠️ **Needs Improvement**:
- No password hashing
- Client-side auth only
- No rate limiting
- No CSRF protection

**Recommendation**: Implement backend auth for production

---

## Performance Optimization

### Strategies Implemented

**1. Code Splitting**:
```typescript
const Admin = lazy(() => import('./pages/Admin'));
const FullPhotoGallery = lazy(() => import('./pages/FullPhotoGallery'));
```

**2. Image Optimization**:
- Lazy loading images
- Intersection Observer
- Proper image formats

**3. Memoization**:
```typescript
const MemoizedEventCard = memo(EventCard);

const sortedEvents = useMemo(
  () => events.sort((a, b) => new Date(b.date) - new Date(a.date)),
  [events]
);
```

**4. Asset Optimization**:
- Image compression
- Vite bundle optimization
- Tree shaking
- Minification

### Target Metrics

- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.8s
- Cumulative Layout Shift (CLS): < 0.1

---

## Security Considerations

### Current Security

✅ **Implemented**:
- Basic authentication
- Input validation
- Image protection
- XSS prevention

⚠️ **Needs Improvement**:
- Backend authentication
- Password hashing
- Rate limiting
- CSRF protection
- Security headers

### Recommended Enhancements

**1. Backend Authentication**:
- JWT tokens
- Password hashing (bcrypt)
- Secure session management

**2. API Security**:
- Rate limiting
- CORS configuration
- Input sanitization

**3. Content Security**:
- CSP headers
- HTTPS only
- Secure cookies

---

# Operations & Maintenance

## Regular Maintenance Tasks

### Daily Tasks
- [ ] Check website accessibility
- [ ] Monitor error reports
- [ ] Review contact form submissions

### Weekly Tasks
- [ ] Update upcoming events
- [ ] Upload new photos
- [ ] Check admin panel functionality
- [ ] Backup local storage data

### Monthly Tasks
- [ ] Update dependencies
- [ ] Review security updates
- [ ] Clean up old past events
- [ ] Optimize image gallery
- [ ] Check site performance
- [ ] Review user feedback

### Quarterly Tasks
- [ ] Major dependency updates
- [ ] Design review
- [ ] Feature improvements
- [ ] Comprehensive testing
- [ ] Content audit
- [ ] SEO review

---

## Update Procedures

### Updating Dependencies

```bash
# Check for updates
npm outdated

# Update specific package
npm update package-name

# Update all
npm update

# Update to latest (major versions)
npm install package-name@latest
```

### Update Checklist

- [ ] Development server runs
- [ ] No console errors
- [ ] All pages load
- [ ] Admin panel works
- [ ] Forms submit correctly
- [ ] Images load properly
- [ ] Animations work
- [ ] Production build succeeds

---

## Backup and Restore

### Manual Backup

**Export Local Storage**:
```javascript
// In browser console
const backup = {
  events: localStorage.getItem('events'),
  coordinators: localStorage.getItem('coordinators'),
  clubs: localStorage.getItem('clubs'),
  gallery: localStorage.getItem('gallery'),
  date: new Date().toISOString()
};

console.log(JSON.stringify(backup));
// Copy output to file
```

**Save to File**:
- Create: `backup-YYYY-MM-DD.json`
- Store securely

### Restoring Data

```javascript
// In browser console
const backup = {
  /* Your backup data */
};

// Restore
localStorage.setItem('events', backup.events);
localStorage.setItem('coordinators', backup.coordinators);
localStorage.setItem('clubs', backup.clubs);
localStorage.setItem('gallery', backup.gallery);

// Refresh
location.reload();
```

---

## Troubleshooting

### Common Issues

#### Website Not Loading

**Solutions**:
```bash
# Clear browser cache
Ctrl + Shift + Delete

# Rebuild
npm run build

# Check hosting service
```

#### Images Not Loading

**Check**:
- Image URL is correct
- Image exists
- CORS settings
- Image hosting service

#### Can't Login

**Solutions**:
1. Verify credentials in config
2. Clear browser cache/cookies
3. Try incognito mode
4. Check browser console

#### Slow Performance

**Diagnosis**:
```bash
# Check bundle size
npm run build

# Run Lighthouse audit
```

**Solutions**:
- Optimize images
- Enable lazy loading
- Split code bundles
- Remove unused dependencies

---

# Deployment & Production

## Build for Production

```bash
# Create optimized build
npm run build

# Output in 'dist' folder
```

### Build Checklist

- [ ] No TypeScript errors
- [ ] No console errors
- [ ] All tests pass
- [ ] Environment variables set
- [ ] Admin credentials changed
- [ ] Images optimized
- [ ] Meta tags updated

---

## Deployment Options

### Option 1: Vercel (Recommended)

```bash
# Install CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts
```

### Option 2: Netlify

1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy

### Option 3: Firebase Hosting

```bash
# Install CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Deploy
firebase deploy
```

### Option 4: Traditional Hosting

1. Build: `npm run build`
2. Upload `dist` folder
3. Configure web server
4. Set up SSL

---

## Post-Deployment

### Verification Checklist

- [ ] All pages load
- [ ] Images display
- [ ] Forms work
- [ ] Admin panel accessible
- [ ] Responsive design works
- [ ] Different browsers tested
- [ ] Loading speed acceptable
- [ ] SSL certificate active
- [ ] Links verified
- [ ] Analytics working (if configured)

---

# Reference

## Best Practices

### Performance

**Do's** ✅:
- Compress images before upload
- Use lazy loading
- Implement code splitting
- Minimize bundle size
- Use CDN for assets

**Don'ts** ❌:
- Don't upload large images
- Don't load everything at once
- Don't skip optimization

### Security

**Do's** ✅:
- Change default passwords
- Use HTTPS only
- Validate all inputs
- Regular security audits
- Keep dependencies updated

**Don'ts** ❌:
- Don't expose credentials
- Don't skip validation
- Don't ignore updates

### Content Management

**Do's** ✅:
- Keep content fresh
- Use high-quality images
- Write clear descriptions
- Test before publishing
- Backup regularly

**Don'ts** ❌:
- Don't delete without backup
- Don't use poor quality images
- Don't skip proofreading

---

## Frequently Asked Questions

### General

**Q: Do I need technical skills?**  
A: No! The user guide covers everything. If you can use social media, you can manage this website.

**Q: Can I undo changes?**  
A: Deletions are permanent, but you can edit anything multiple times.

**Q: How long do changes take to appear?**  
A: Instantly! Changes are live as soon as you save.

**Q: Can multiple people edit at once?**  
A: Yes, but coordinate to avoid overwriting each other's changes.

### Login Issues

**Q: I forgot the password**  
A: Contact technical lead to reset it in the code.

**Q: Login page won't load**  
A: Check internet connection, refresh page, or try different browser.

### Image Problems

**Q: My image won't upload**  
A: Check file size (< 5MB), format (JPG/PNG/GIF), and internet connection.

**Q: Image URL doesn't work**  
A: Ensure URL starts with "https://", is publicly accessible, and goes directly to image.

**Q: Photos look blurry**  
A: Upload higher resolution images (at least 1200px wide).

### Event Issues

**Q: Event not showing on website**  
A: Check that you clicked "Save", status is correct, and browser cache is clear.

**Q: Can I schedule events to publish later?**  
A: Add as "Past" first, then change to "Upcoming" when ready.

---

## Tips and Tricks

### Time-Saving Tips

1. **Batch upload photos** - Upload all at once using drag & drop
2. **Duplicate events** - Copy details from similar events
3. **Use templates** - Keep event description templates
4. **Bookmark admin panel** - Quick access when needed

### Quality Tips

**Before Publishing**:
- [ ] Title is clear
- [ ] Date/time correct
- [ ] Image loads
- [ ] Links work
- [ ] No spelling errors

### Common Mistakes to Avoid

❌ Using broken image links  
❌ Forgetting to logout  
❌ Deleting instead of editing  
❌ Not checking on website  
❌ Using poor quality images  

---

## Quick Reference

### Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build production
npm run preview      # Preview build
npm run lint         # Check code

# Git
git add .            # Stage changes
git commit -m ""     # Commit
git push             # Push to remote

# Dependencies
npm install          # Install all
npm update           # Update all
```

### Important URLs

```
Development:  http://localhost:5173
Login:        /login
Admin:        /admin
Gallery:      /full-gallery
```

### Admin Credentials

```
Username: <removed>
   Password: <removed>

⚠️ CHANGE IN PRODUCTION!
```

### File Locations

```
Admin Config:    src/config/admin-credentials.ts
Email Config:    src/config/emailjs.ts
Events Data:     src/constants/events.ts
Team Data:       src/constants/coordinators.ts
Gallery Images:  src/assets/PHOTOS/
```

---

## Version Information

**Documentation Version**: 1.0.0  
**Last Updated**: October 2025  
**Website Version**: 1.0.0  
**Maintained By**: ATOM Club Technical Team

---

## Contact & Support

**For Technical Issues**: Contact technical lead  
**For Content Issues**: Contact content manager  
**GitHub**: [Repository URL]  
**Email**: atom.club@example.com

---

## Changelog

### Version 1.0.0 (October 2025)
- Initial complete documentation
- All features documented
- User guides included
- Technical documentation
- Maintenance procedures
- Best practices

---

**Thank you for using ATOM Club Website! 🚀**

*This is a living document. Keep it updated as the website evolves.*
