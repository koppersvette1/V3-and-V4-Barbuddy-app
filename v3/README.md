# MixMaster v3

The initial feature-complete version of MixMaster with core cocktail browsing and discovery features.

## Features

- **TheCocktailDB Integration** - 636+ verified cocktail recipes with images
- **"What Can I Make?"** - Find cocktails based on ingredients you have
- **Advanced Search** - Search by name, ingredient, or category
- **Filters** - Sort by alcoholic/non-alcoholic, category
- **My Bar** - Track your ingredient inventory
- **Favorites** - Save your go-to cocktails
- **Mobile-First Design** - Bottom navigation, responsive layout

## Running v3

```bash
npm install
npm start
```

The app will open at `http://localhost:3000`

## API Key

This version uses TheCocktailDB's free test API key. For production use, get your own key at https://www.thecocktaildb.com/api.php

## Tech Notes

- Built with React and functional components
- Uses fetch API for cocktail data
- State managed with useState hooks
- Responsive Tailwind-style inline styling
