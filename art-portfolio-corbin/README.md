
# Art Portfolio Starter (React + Vite)

A clean, component-based portfolio site for visual artists. Built with **React** and **Vite**, inspired by minimalist layouts (similar spirit to melokwo.com), and kept intentionally plain so you can style later.

## ✨ Features
- Simple pages: **Home**, **Gallery**, **About**, **Contact**
- Reusable components: **Navbar**, **Footer**, **GalleryGrid**, **ArtworkCard**, **Hero**
- Drop images in `public/assets` and list them in `src/data/artworks.json`
- No backend required

## 🚀 Quick start
```bash
# 1) Use Node.js 18+ recommended
npm install

# 2) Start dev server
npm run dev

# 3) Build for production
npm run build
npm run preview
```

## 🖼️ Add artwork
1. Put your images in `public/assets/` (e.g. `public/assets/painting-01.jpg`).
2. Edit `src/data/artworks.json` to point to them, e.g.:
```json
{
  "id": "painting-01",
  "title": "Reflections",
  "year": "2024",
  "medium": "Oil on canvas",
  "size": "18 × 24 in",
  "image": "/assets/painting-01.jpg"
}
```
3. That’s it—images will show up in **Home** (first 6) and **Gallery** (all).

## 🧩 Customize
- Change “Artist Name” in `src/components/Navbar.jsx` and footer in `src/components/Footer.jsx`.
- Replace About & Contact copy in `src/pages/AboutPage.jsx` and `src/pages/ContactPage.jsx`.
- Adjust grid, spacing, and colors in `src/index.css`.

## 📁 Structure
```
.
├── public
│   └── assets
│       └── placeholder.svg
├── src
│   ├── components
│   │   ├── ArtworkCard.jsx
│   │   ├── Footer.jsx
│   │   ├── GalleryGrid.jsx
│   │   ├── Hero.jsx
│   │   ├── Layout.jsx
│   │   └── Navbar.jsx
│   ├── data
│   │   └── artworks.json
│   ├── pages
│   │   ├── AboutPage.jsx
│   │   ├── ContactPage.jsx
│   │   ├── Gallery.jsx
│   │   └── Home.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🛠️ Optional ideas
- Add a lightbox modal for viewing images larger.
- Add categories/filters (e.g., Paintings, Sketches, Photography).
- Wire a contact form to a service like Formspree or a tiny server.

MIT License.
