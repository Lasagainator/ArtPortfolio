# Portfolio Website

A modern, interactive portfolio website showcasing digital art, 3D modeling, game development, and animation work. Built with **React**, **Vite**, and **Framer Motion** for smooth animations and engaging user experiences.

## ✨ Features

### Pages & Navigation
- **Home** - Hero section with featured project thumbnails and interactive media
- **Gallery** - Dynamic project browsing with category filtering
- **Individual Project Pages** - Detailed views with process documentation, videos, and image galleries
- **About** - Artist biography and background
- **Contact** - Contact form with social media integration

### Interactive Components
- **MediaMosaic** - Animated grid layout for featured projects with hover effects
- **PhotoCarousel** - Smooth image carousel for project galleries
- **InteractiveScroll** - Custom scroll-based animations and transitions
- **AutoScroll** - Automatic scrolling functionality for long content
- **ErrorBoundary** - Graceful error handling for better UX

### Media Support
- Image galleries with multiple formats (PNG, JPG)
- YouTube video embedding for animation showcases
- Responsive thumbnail system for project previews
- Organized asset management by project category

## 🚀 Quick Start

```bash
# Prerequisites: Node.js 18+ recommended

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dev server will start at `http://localhost:5173/`

## 🎨 Project Structure

```
portfolio-website/
├── public/
│   └── assets/
│       ├── _A_Hungry_Hamster_Side_Scroller_Game_(Piece_1)/
│       ├── _Drowsy_Cinematic_Nature_Scene_(Piece_2)/
│       ├── _Resting_Point_Scene-_Stylized_3D_Models_(Piece_3)/
│       ├── _Will_You_Be_My_Friend_Concept_Art_(Pieces_4)/
│       ├── _Reminisce_City_Scene_(Piece_5)/
│       ├── _Nerve_Game_Concept_Group_Project_(Piece_6)/
│       └── Piece Thumbnails for Front Page!!!!/
├── src/
│   ├── components/
│   │   ├── ArtworkCard.jsx          # Individual artwork display cards
│   │   ├── AutoScroll.jsx           # Auto-scrolling functionality
│   │   ├── ErrorBoundary.jsx        # Error handling wrapper
│   │   ├── Footer.jsx               # Site footer with links
│   │   ├── GalleryGrid.jsx          # Grid layout for gallery
│   │   ├── Hero.jsx                 # Homepage hero section
│   │   ├── InteractiveScrollSimple.jsx  # Scroll animations
│   │   ├── Layout.jsx               # Main layout wrapper
│   │   ├── MediaMosaic.jsx          # Animated project grid
│   │   ├── Navbar.jsx               # Navigation bar
│   │   ├── PhotoCarousel.jsx        # Image carousel
│   │   ├── RouterErrorPage.jsx      # 404 error page
│   │   └── ScrollToTop.jsx          # Scroll restoration utility
│   ├── data/
│   │   └── artworks.json            # Project and artwork metadata
│   ├── pages/
│   │   ├── AboutPage.jsx            # About page
│   │   ├── ContactPage.jsx          # Contact form page
│   │   ├── Gallery.jsx              # Gallery browsing page
│   │   ├── Home.jsx                 # Homepage
│   │   └── ProjectPage.jsx          # Individual project view
│   ├── utils/
│   │   └── media.js                 # Media handling utilities
│   ├── App.jsx                      # Main app component with routing
│   ├── index.css                    # Global styles
│   └── main.jsx                     # App entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🖼️ Managing Artwork & Projects

### Adding New Projects

1. **Organize Assets**: Create a new folder in `public/assets/` with your project files
   ```
   public/assets/_Your_Project_Name/
   ├── process pic 1.png
   ├── process pic 2.png
   └── final render.png
   ```

2. **Update artworks.json**: Add entries for your project in `src/data/artworks.json`
   ```json
   {
     "id": "unique-id",
     "title": "Project Title",
     "year": "2025",
     "medium": "3D Animation / Digital Art",
     "size": "HD",
     "image": "assets/_Your_Project_Name/image.png",
     "thumbnail": "assets/_Your_Project_Name/thumbnail.png",
     "category": "Your Project Category",
     "youtube": "https://youtu.be/VIDEO_ID",
     "description": "Detailed description of the work...",
     "galleryDescription": "Context and background..."
   }
   ```

### Project Entry Fields

- **id**: Unique identifier (required)
- **title**: Display title (required)
- **category**: Used for grouping and filtering (required)
- **image**: Path to main image (optional if youtube provided)
- **thumbnail**: Path to thumbnail for gallery/home display
- **youtube**: YouTube video embed link
- **year**: Creation year
- **medium**: Art medium/technique
- **size**: Dimensions or resolution
- **description**: Short description for gallery cards
- **galleryDescription**: Detailed context for project pages
- **subcaption**: Array of additional captions/credits

## 🛠️ Tech Stack

- **React 18.3** - UI framework
- **Vite 5.4** - Build tool and dev server
- **React Router 6.26** - Client-side routing
- **Framer Motion 12.28** - Animation library
- **CSS3** - Styling with modern features

## 🎯 Key Features Explained

### Category-Based Filtering
Projects are automatically grouped by their `category` field. The Gallery page displays all unique categories as filter buttons.

### Dynamic Routing
Individual project pages are generated dynamically using React Router with the category name as the URL parameter (`/project/:category`).

### Responsive Design
All components are built mobile-first with responsive breakpoints for optimal viewing on any device.

### Performance Optimization
- Lazy loading for images
- Vite's build optimization
- Component-level code splitting
- Error boundaries for stability

## 📝 Customization

### Branding
- Update artist name in [Navbar.jsx](src/components/Navbar.jsx)
- Modify footer content in [Footer.jsx](src/components/Footer.jsx)
- Adjust page titles in [index.html](index.html)

### Styling
- Global styles: [index.css](src/index.css)
- Component-specific: Each component's CSS file
- Colors, fonts, spacing can all be customized

### Content
- About page: [AboutPage.jsx](src/pages/AboutPage.jsx)
- Contact info: [ContactPage.jsx](src/pages/ContactPage.jsx)
- Project data: [artworks.json](src/data/artworks.json)

## 🚢 Deployment

Build the production bundle:
```bash
npm run build
```

The optimized site will be in the `dist/` folder, ready to deploy to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

## 📄 License

This project is private and proprietary.

---

*Last updated: January 2026*
