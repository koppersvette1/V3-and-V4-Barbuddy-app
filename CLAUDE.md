# CLAUDE.md - AI Assistant Guide for MixMaster

This document provides comprehensive guidance for AI assistants working with the MixMaster codebase. Read this file carefully before making any changes to ensure consistency and understanding of the project architecture.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Repository Structure](#repository-structure)
3. [Architecture & Design Patterns](#architecture--design-patterns)
4. [Tech Stack & Dependencies](#tech-stack--dependencies)
5. [Code Organization](#code-organization)
6. [State Management](#state-management)
7. [API Integration](#api-integration)
8. [Styling Approach](#styling-approach)
9. [Development Workflow](#development-workflow)
10. [Key Conventions](#key-conventions)
11. [Common Tasks](#common-tasks)
12. [Important Constraints](#important-constraints)
13. [Future Enhancements](#future-enhancements)

---

## Project Overview

**Project Name:** MixMaster (formerly Barbuddy)
**Type:** Single Page Application (SPA)
**Purpose:** Modern cocktail recipe discovery app with advanced features

### What This App Does

- Browse 636+ verified cocktail recipes from TheCocktailDB
- Search and filter cocktails by various criteria
- Track personal bar inventory
- Match ingredients to find makeable cocktails ("What Can I Make?")
- Save favorite cocktails
- **v4 only:** Smoker Lab with wood profiles and timers
- **v4 only:** People profiles for personalized recommendations

### Version Philosophy

This repository contains **two parallel versions** of the same app:

- **v3:** Initial feature-complete version with core functionality
- **v4:** Enhanced version with advanced features and polished UI

Both versions are **maintained separately** and do not share code. Changes to one version should not automatically be applied to the other without explicit request.

---

## Repository Structure

```
/V3-and-V4-Barbuddy-app/
├── README.md                    # Main project documentation
├── GITHUB_UPLOAD_GUIDE.md       # Git workflow guide
├── CLAUDE.md                    # This file
├── .gitignore                   # Git ignore patterns
├── v3/                          # Version 3 application
│   ├── package.json             # Dependencies and scripts
│   ├── public/
│   │   └── index.html           # HTML template
│   └── src/
│       ├── index.js             # React entry point
│       ├── index.css            # Global CSS reset
│       └── App.js               # Main application component
└── v4/                          # Version 4 application
    ├── package.json             # Dependencies and scripts
    ├── public/
    │   └── index.html           # HTML template
    └── src/
        ├── index.js             # React entry point
        ├── index.css            # Global CSS reset
        └── App.js               # Main application component
```

### Key Files

- **App.js** - Monolithic component containing all application logic
- **index.js** - React DOM rendering entry point
- **index.css** - Global CSS reset and base styles
- **index.html** - HTML template with Tailwind CDN
- **package.json** - Dependencies, scripts, and configuration

---

## Architecture & Design Patterns

### Architectural Style

**Monolithic Single Component Architecture**

Both v3 and v4 use a single `App.js` component that contains:
- All state management
- All business logic
- All UI components (nested inside App)
- All event handlers
- All API calls

### Why This Pattern?

This architecture was chosen for:
- Simplicity and quick development
- Easy understanding for beginners
- No need for complex routing
- Single source of truth for state
- Fast prototyping

### Component Structure

```javascript
function App() {
  // 1. State declarations (useState hooks)
  // 2. Side effects (useEffect hooks)
  // 3. Helper functions (API calls, business logic)
  // 4. Nested component definitions (CocktailCard, Modal, etc.)
  // 5. Main render with conditional rendering
  // 6. Bottom navigation
}

// Styles object defined outside component
const styles = { ... }
```

### State-Driven UI

The app uses **tab-based navigation** controlled by `activeTab` state:
- `'cocktails'` - Browse and search cocktails
- `'mybar'` - Manage ingredient inventory
- `'favorites'` - View saved cocktails

Only one tab's content is rendered at a time using conditional rendering.

---

## Tech Stack & Dependencies

### Core Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-scripts": "5.0.1"
}
```

**Note:** Despite README claiming React 19, package.json shows React 18.2.0

### Build System

- **Create React App** - Zero-config build setup
- **react-scripts** - Handles webpack, Babel, ESLint configuration
- **Tailwind CDN** - Loaded via CDN in index.html (not npm package)

### No Additional Libraries

This project intentionally uses **no additional dependencies**:
- No routing library (single page, tab-based navigation)
- No state management library (pure React hooks)
- No UI component library (custom components)
- No HTTP library (native fetch API)
- No date/time library
- No form library

---

## Code Organization

### File Organization

Each version (v3/v4) follows this structure:

```
src/
├── index.js        # React.StrictMode + ReactDOM.createRoot
├── index.css       # CSS reset only
└── App.js          # Everything else
```

### App.js Internal Organization

**1. State Variables** (lines 4-11)
```javascript
const [activeTab, setActiveTab] = useState('cocktails');
const [cocktails, setCocktails] = useState([]);
const [searchTerm, setSearchTerm] = useState('');
const [myBar, setMyBar] = useState([]);
const [favorites, setFavorites] = useState([]);
const [selectedCocktail, setSelectedCocktail] = useState(null);
const [filterCategory, setFilterCategory] = useState('all');
const [loading, setLoading] = useState(true);
```

**2. Effects** (lines 14-16)
```javascript
useEffect(() => {
  fetchCocktails(); // Load data on mount
}, []);
```

**3. API Functions** (lines 18-46)
- `fetchCocktails()` - Get all cocktails
- `searchCocktails(term)` - Search by name

**4. Business Logic** (lines 48-87)
- `toggleFavorite(cocktail)` - Add/remove favorite
- `toggleBarIngredient(ingredient)` - Add/remove bar ingredient
- `canMakeCocktail(cocktail)` - Check if all ingredients available
- `filteredCocktails` - Computed filtered list

**5. Nested Components** (lines 89-159)
- `CocktailCard` - Displays cocktail preview
- `CocktailModal` - Shows full cocktail details

**6. Main Render** (lines 161-314)
- Header with search
- Main content area (conditionally renders based on activeTab)
- Bottom navigation
- Modal overlay

**7. Styles Object** (lines 317-573)
- JavaScript object with inline style definitions

---

## State Management

### State Overview

All state is managed with `useState` hooks at the top level of the App component. No external state management library is used.

### State Variables Explained

| State Variable | Type | Purpose | Persistence |
|----------------|------|---------|-------------|
| `activeTab` | string | Current navigation tab | None |
| `cocktails` | array | All cocktails from API | None (refetch on reload) |
| `searchTerm` | string | Current search query | None |
| `myBar` | array | User's ingredient inventory | None (lost on reload) |
| `favorites` | array | User's saved cocktails | None (lost on reload) |
| `selectedCocktail` | object/null | Currently viewing cocktail | None |
| `filterCategory` | string | Active filter ('all', 'alcoholic', 'nonAlcoholic', 'canMake') | None |
| `loading` | boolean | Loading state for API calls | None |

### Important State Characteristics

**No Persistence:** All state is ephemeral. Refreshing the page loses:
- User's bar inventory
- Favorite cocktails
- Search terms
- Current filter selection

**No Local Storage:** The app does not use localStorage or sessionStorage.

**No Backend:** There is no database or backend service for user data.

### State Update Patterns

**Toggle Pattern** (Favorites & Bar Ingredients)
```javascript
const toggleFavorite = (cocktail) => {
  const isFavorite = favorites.some(fav => fav.idDrink === cocktail.idDrink);
  if (isFavorite) {
    setFavorites(favorites.filter(fav => fav.idDrink !== cocktail.idDrink));
  } else {
    setFavorites([...favorites, cocktail]);
  }
};
```

**Search Pattern** (Immediate API call on input change)
```javascript
onChange={(e) => {
  setSearchTerm(e.target.value);
  searchCocktails(e.target.value);
}}
```

**Loading Pattern** (try-finally with loading state)
```javascript
const fetchCocktails = async () => {
  try {
    setLoading(true);
    // ... API call
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};
```

---

## API Integration

### TheCocktailDB API

**Base URL:** `https://www.thecocktaildb.com/api/json/v1/1/`

**API Key:** Uses free test API key (key "1")

### Endpoints Used

1. **Search all cocktails**
   ```
   GET /search.php?s=
   ```
   Returns all cocktails (used for initial load and empty search)

2. **Search by name**
   ```
   GET /search.php?s={term}
   ```
   Returns cocktails matching the search term

### API Response Structure

```javascript
{
  "drinks": [
    {
      "idDrink": "11007",
      "strDrink": "Margarita",
      "strCategory": "Ordinary Drink",
      "strAlcoholic": "Alcoholic",
      "strGlass": "Cocktail glass",
      "strInstructions": "...",
      "strDrinkThumb": "https://...",
      "strIngredient1": "Tequila",
      "strMeasure1": "1 1/2 oz",
      // ... up to strIngredient15/strMeasure15
    }
  ]
}
```

### Important API Details

**Ingredient Structure:** Ingredients are stored as numbered properties (strIngredient1 through strIngredient15, not an array)

**Null Handling:** API returns `null` for drinks array when no results found

**No Authentication:** Free tier requires no API key in headers

**Rate Limiting:** Unknown, but no rate limiting handling implemented

### Parsing Ingredients

The app uses a loop to extract ingredients:

```javascript
const ingredients = [];
for (let i = 1; i <= 15; i++) {
  if (cocktail[`strIngredient${i}`]) {
    ingredients.push({
      name: cocktail[`strIngredient${i}`],
      measure: cocktail[`strMeasure${i}`] || ''
    });
  }
}
```

### Error Handling

- Errors are logged to console
- No user-facing error messages
- Failed requests show "No cocktails found"
- No retry logic

---

## Styling Approach

### CSS-in-JS with Inline Styles

The entire app uses **inline styles** via JavaScript objects. No CSS files are used except for the minimal reset in index.css.

### Style Object Pattern

```javascript
const styles = {
  componentName: {
    property: 'value',
    // ...
  }
};

// Usage in JSX
<div style={styles.componentName}>
```

### Style Composition

**Single styles:**
```javascript
<div style={styles.cocktailCard}>
```

**Merged styles:**
```javascript
<button style={{
  ...styles.filterButton,
  ...(filterCategory === 'all' ? styles.filterButtonActive : {})
}}>
```

**Conditional inline properties:**
```javascript
<button style={{
  ...styles.navButton,
  color: activeTab === tab.id ? '#f59e0b' : '#6b7280'
}}>
```

### Color Palette

**Background Colors:**
- Primary: `#0f172a` (slate-900)
- Secondary: `#1e293b` (slate-800)
- Tertiary: `#334155` (slate-700)

**Text Colors:**
- Primary: `#fff` (white)
- Secondary: `#94a3b8` (slate-400)
- Muted: `#cbd5e1` (slate-300)

**Accent Colors:**
- Primary: `#f59e0b` (amber-500) - active states, highlights
- Danger: `#f87171` (red-400) - remove buttons
- Secondary: `#9ca3af` (gray-400) - inactive states

### Typography

- Headings: Bold weights (600-700)
- Body: System font stack
- Font sizes: 12px to 28px

### Responsive Approach

- Mobile-first design
- Grid layout: `gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))'`
- Fixed bottom navigation
- Sticky header
- No media queries (CSS-in-JS doesn't easily support them)

### Tailwind CDN

Loaded in index.html but **not actively used** in components:
```html
<script src="https://cdn.tailwindcss.com"></script>
```

The app primarily uses inline JavaScript styles instead of Tailwind classes.

---

## Development Workflow

### Initial Setup

```bash
# Navigate to desired version
cd v3  # or cd v4

# Install dependencies
npm install

# Start development server
npm start
```

### Available Scripts

```bash
npm start      # Start dev server at http://localhost:3000
npm build      # Create production build in /build
npm test       # Run test runner (no tests currently)
npm eject      # Eject from Create React App (irreversible)
```

### Development Server

- **Port:** 3000
- **Hot Reload:** Automatic on file save
- **Browser:** Opens automatically

### Making Changes

**To modify v3:**
1. Navigate to `/v3`
2. Edit files in `/v3/src/`
3. Changes reflect immediately in browser

**To modify v4:**
1. Navigate to `/v4`
2. Edit files in `/v4/src/`
3. Changes reflect immediately in browser

### Building for Production

```bash
cd v3  # or v4
npm run build
```

Creates optimized build in `/v3/build` or `/v4/build`

### Git Workflow

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "Description of changes"

# Push to remote
git push
```

---

## Key Conventions

### Naming Conventions

**State Variables:**
- camelCase
- Descriptive names
- Boolean states prefixed with `is`/`has`/`can` (not used in this project)

**Functions:**
- camelCase
- Verb-based names (toggle, fetch, search, can)

**Components:**
- PascalCase (CocktailCard, CocktailModal)
- Nested inside App component

**Style Objects:**
- camelCase for keys
- kebab-case converted to camelCase (`border-radius` → `borderRadius`)

### Code Style

**Async/Await:**
```javascript
const fetchCocktails = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();
  } catch (error) {
    console.error('Error:', error);
  }
};
```

**Array Methods:**
- `.map()` for rendering lists
- `.filter()` for filtering lists
- `.some()` for checking existence
- `.every()` for validation

**Event Handlers:**
- Inline arrow functions in JSX
- Named functions for complex logic
- `e.stopPropagation()` to prevent event bubbling

### Component Patterns

**Nested Components:**
```javascript
function App() {
  const CocktailCard = ({ cocktail }) => {
    // Component logic
    return <div>...</div>;
  };

  return (
    <div>
      {cocktails.map(c => <CocktailCard key={c.idDrink} cocktail={c} />)}
    </div>
  );
}
```

**Conditional Rendering:**
```javascript
{loading ? (
  <div>Loading...</div>
) : (
  <div>Content</div>
)}

{items.length === 0 && <div>No items</div>}

{activeTab === 'cocktails' && <CocktailsView />}
```

### Key Generation

**Use idDrink for cocktail keys:**
```javascript
{cocktails.map(cocktail => (
  <CocktailCard key={cocktail.idDrink} cocktail={cocktail} />
))}
```

**Use index for ingredients (no unique ID available):**
```javascript
{ingredients.map((ing, idx) => (
  <div key={idx}>{ing.name}</div>
))}
```

---

## Common Tasks

### Adding a New Feature

1. **Add state if needed**
   ```javascript
   const [newFeature, setNewFeature] = useState(initialValue);
   ```

2. **Add handler functions**
   ```javascript
   const handleNewFeature = (data) => {
     // Logic here
   };
   ```

3. **Add UI in appropriate tab section**
   ```javascript
   {activeTab === 'newtab' && (
     <div>New feature UI</div>
   )}
   ```

4. **Add navigation if new tab**
   ```javascript
   { id: 'newtab', emoji: '🎯', label: 'New Tab' }
   ```

### Adding a New Tab

1. Add to navigation array:
   ```javascript
   [
     { id: 'cocktails', emoji: '🍸', label: 'Cocktails' },
     { id: 'newtab', emoji: '🎯', label: 'New Tab' } // Add here
   ]
   ```

2. Add tab content rendering:
   ```javascript
   {activeTab === 'newtab' && (
     <div style={styles.content}>
       <h2 style={styles.tabTitle}>New Tab</h2>
       {/* Tab content */}
     </div>
   )}
   ```

3. Add styles if needed:
   ```javascript
   const styles = {
     // ... existing styles
     newTabContainer: {
       // New styles
     }
   };
   ```

### Modifying Styles

1. Locate style in `styles` object at bottom of App.js
2. Modify properties directly
3. Changes apply immediately (hot reload)

Example:
```javascript
const styles = {
  header: {
    padding: '20px',      // Change to '30px'
    backgroundColor: '#1e293b', // Change color
  }
};
```

### Adding API Endpoints

1. Create new async function:
   ```javascript
   const fetchNewData = async (params) => {
     try {
       setLoading(true);
       const response = await fetch(`https://api.url/${params}`);
       const data = await response.json();
       setStateVariable(data);
     } catch (error) {
       console.error('Error:', error);
     } finally {
       setLoading(false);
     }
   };
   ```

2. Call from useEffect or event handler

### Filtering/Searching Logic

Follow existing pattern:
```javascript
const filteredItems = items.filter(item => {
  if (someCondition) {
    return checkCondition(item);
  }
  return true; // Default: show all
});
```

---

## Important Constraints

### What This App CANNOT Do (Currently)

1. **Persist Data**
   - No localStorage
   - No database
   - All data lost on refresh

2. **User Accounts**
   - No authentication
   - No user profiles
   - No cloud sync

3. **Advanced Routing**
   - No URL routing
   - No deep linking
   - Tab state not in URL

4. **Offline Support**
   - No service worker
   - No offline caching
   - Requires internet for API

5. **Real-time Updates**
   - No WebSocket
   - No push notifications
   - No live data sync

### Performance Limitations

- **No Virtualization** - All cocktails rendered at once
- **No Pagination** - Single API call loads all data
- **No Memoization** - Components re-render on every state change
- **No Code Splitting** - Single bundle file

### Browser Compatibility

- **Requires Modern Browser** - Uses ES6+, fetch API, React 18
- **No IE Support** - Modern JavaScript features
- **Mobile Tested** - Designed mobile-first

---

## Future Enhancements

### Planned Features (from README)

1. **Persistent Storage**
   - Supabase or Firebase integration
   - Save favorites and bar inventory
   - User accounts

2. **Custom Recipes**
   - Create own cocktails
   - Share with community
   - Rate and review

3. **Social Features**
   - Share cocktails
   - Follow friends
   - Activity feed

4. **Native Apps**
   - React Native conversion
   - iOS and Android apps
   - App store distribution

### Suggested Improvements (Not Yet Planned)

1. **Code Organization**
   - Split App.js into separate components
   - Create custom hooks for business logic
   - Implement proper component hierarchy

2. **Performance**
   - Add React.memo for expensive components
   - Implement virtual scrolling
   - Add pagination

3. **Error Handling**
   - User-facing error messages
   - Retry logic for failed requests
   - Network status detection

4. **Testing**
   - Unit tests for business logic
   - Component tests with React Testing Library
   - E2E tests with Cypress

5. **Accessibility**
   - ARIA labels
   - Keyboard navigation
   - Screen reader support

6. **State Management**
   - Consider Context API for shared state
   - Or Redux for complex state needs

---

## Working with AI Assistants

### Before Making Changes

1. **Identify the version** - Are you working on v3 or v4?
2. **Understand the scope** - Is this a new feature or bug fix?
3. **Read relevant sections** - Review state management, styling, etc.
4. **Check constraints** - Ensure change is possible with current architecture

### When Adding Features

1. **Follow existing patterns** - Match coding style and conventions
2. **Keep it monolithic** - Don't split into separate files unless requested
3. **Use inline styles** - Don't add new CSS files
4. **No new dependencies** - Use vanilla React unless explicitly needed
5. **Test both states** - Verify with data and empty states

### When Fixing Bugs

1. **Locate the issue** - Search in App.js (everything is there)
2. **Understand state flow** - Check which state variables are involved
3. **Preserve existing behavior** - Don't change unrelated functionality
4. **Test edge cases** - Empty arrays, null values, API failures

### Communication Guidelines

When explaining changes to users:
- Reference line numbers (e.g., "in App.js around line 48")
- Explain state implications
- Note if changes affect v3, v4, or both
- Highlight any breaking changes

### Code Review Checklist

Before completing a task, verify:
- [ ] Code follows existing naming conventions
- [ ] Inline styles added to `styles` object
- [ ] State updates use proper React patterns
- [ ] No new dependencies added (unless approved)
- [ ] Error cases handled (even if just console.error)
- [ ] Arrays use appropriate keys
- [ ] Event handlers prevent propagation where needed
- [ ] Loading states shown during async operations
- [ ] Empty states handled gracefully
- [ ] Changes don't break other tabs/features

---

## Quick Reference

### File Locations

```
App.js location:
- v3: /v3/src/App.js (576 lines)
- v4: /v4/src/App.js (576 lines - similar structure)

Entry point:
- v3: /v3/src/index.js (12 lines)
- v4: /v4/src/index.js (12 lines)

HTML template:
- v3: /v3/public/index.html
- v4: /v4/public/index.html
```

### State at a Glance

```javascript
activeTab: 'cocktails' | 'mybar' | 'favorites'
cocktails: Array<CocktailObject>
searchTerm: string
myBar: Array<string>
favorites: Array<CocktailObject>
selectedCocktail: CocktailObject | null
filterCategory: 'all' | 'alcoholic' | 'nonAlcoholic' | 'canMake'
loading: boolean
```

### API Endpoints

```
Base: https://www.thecocktaildb.com/api/json/v1/1/

GET /search.php?s=           # All cocktails
GET /search.php?s={term}     # Search by name
```

### npm Scripts

```bash
npm start      # Dev server
npm build      # Production build
npm test       # Test runner
npm eject      # Eject from CRA
```

---

## Document Maintenance

**Last Updated:** 2026-01-06
**Codebase Version:** v3 and v4
**React Version:** 18.2.0
**Maintainer:** AI Assistant (Claude)

### When to Update This Document

- New features added
- Architecture changes
- New dependencies added
- Coding conventions change
- New best practices established

---

## Questions or Issues?

If this document doesn't answer your question:
1. Read the code in App.js - it's well-structured and readable
2. Check the README.md for user-facing documentation
3. Review the GITHUB_UPLOAD_GUIDE.md for git workflows
4. Examine the actual implementation for current patterns

Remember: When in doubt, **follow the existing patterns** in the codebase. Consistency is more important than perfection.
