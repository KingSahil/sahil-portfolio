# Sahil's Portfolio Website

A modern, responsive portfolio website showcasing your projects from GitHub. Built with vanilla HTML, CSS, and JavaScript.

## 🌟 Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional design with smooth animations
- **Dynamic Project Loading**: Automatically displays your featured GitHub projects
- **Interactive Navigation**: Smooth scrolling with active section highlighting
- **Contact Form**: Functional contact form with validation
- **Performance Optimized**: Fast loading with optimized assets
- **SEO Friendly**: Proper meta tags and semantic HTML

## 🚀 Live Demo

Open `index.html` in your browser to see your portfolio in action!

## 📁 Project Structure

```
sahil portfolio/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## 🎨 Sections

### 1. Hero Section
- Your name and title with typing animation
- Professional introduction
- Call-to-action buttons
- Your GitHub profile picture

### 2. About Section
- Personal background and story
- Your location (Amritsar)
- Key statistics from your GitHub

### 3. Skills Section
- **Frontend**: HTML5, CSS3, JavaScript, TypeScript, React, Next.js
- **Backend**: Node.js, Python, Express, MongoDB, SQL
- **Game Development**: Godot Engine, GDScript, GDShader
- **Tools**: Git, GitHub, VS Code, Shell Scripting

### 4. Projects Section
Featured projects from your GitHub:
- **GNDU Attendance System** (JavaScript) - ⭐ 2 stars
- **The Science Lab** (GDScript) - ⭐ 2 stars
- **Godot 4.4 Liquid Shader** (GDShader) - ⭐ 2 stars
- **Automated Attendance System** (JavaScript) - ⭐ 1 star
- **GNDU Attendance System (Next.js)** (TypeScript) - ⭐ 1 star
- **Gamified Education Platform** (HTML/CSS/JS) - ⭐ 1 star

### 5. Contact Section
- Contact form with validation
- Your location and GitHub link
- Professional contact information

## 🛠️ Customization

### Update Personal Information
Edit the following in `index.html`:
- Your name and title in the hero section
- About section content
- Contact information

### Add New Projects
Edit the `projects` array in `script.js`:
```javascript
const projects = [
    {
        title: "Your Project Name",
        description: "Project description",
        tech: ["JavaScript", "React"],
        stars: 0,
        forks: 0,
        githubUrl: "https://github.com/KingSahil/your-repo",
        featured: true
    }
];
```

### Modify Styling
Edit `styles.css` to:
- Change color scheme (update CSS variables in `:root`)
- Modify fonts and typography
- Adjust spacing and layout
- Add new animations

### Color Scheme
Current colors are defined in CSS variables:
```css
:root {
    --primary-color: #3b82f6;      /* Blue */
    --secondary-color: #1e293b;    /* Dark gray */
    --accent-color: #f59e0b;       /* Orange */
    --text-primary: #1e293b;       /* Dark text */
    --text-secondary: #64748b;     /* Light text */
}
```

## 📱 Responsive Design

The portfolio is fully responsive with breakpoints at:
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px

## ⚡ Performance Features

- **Optimized Images**: Compressed and properly sized
- **Minimal Dependencies**: Only uses Font Awesome for icons
- **Efficient CSS**: Uses CSS Grid and Flexbox for layouts
- **Smooth Animations**: Hardware-accelerated CSS animations
- **Lazy Loading**: Content appears as you scroll

## 🌐 Deployment Options

### 1. GitHub Pages
1. Create a new repository named `username.github.io`
2. Upload all files to the repository
3. Enable GitHub Pages in repository settings
4. Your site will be live at `https://username.github.io`

### 2. Netlify
1. Drag and drop the folder to Netlify
2. Your site will be live instantly with a custom URL

### 3. Vercel
1. Connect your GitHub repository to Vercel
2. Deploy with one click

## 🔧 Local Development

1. Clone or download the files
2. Open `index.html` in your browser
3. Make changes and refresh to see updates
4. Use a local server for better development experience:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```

## 📄 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

Feel free to fork this project and customize it for your own portfolio! If you make improvements, pull requests are welcome.

## 📞 Contact

- **GitHub**: [@KingSahil](https://github.com/KingSahil)
- **Location**: Amritsar, India

---

**Built with ❤️ using HTML, CSS, and JavaScript**