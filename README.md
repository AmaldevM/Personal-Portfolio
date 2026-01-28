# Amaldev M - Portfolio Website

A modern, responsive portfolio website showcasing my skills, experience, and projects as a Full Stack Developer.

## Features

- **Modern Design**: Premium dark theme with glassmorphism effects and smooth animations
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **Interactive Elements**: 
  - Typing animation for job titles
  - Smooth scroll navigation
  - Hover effects and micro-animations
  - Mobile-friendly hamburger menu
- **SEO Optimized**: Proper meta tags and semantic HTML structure

## Sections

1. **Hero Section**: Eye-catching introduction with animated typing text
2. **About**: Professional summary and key highlights
3. **Skills**: Technical skills organized by category with interactive tags
4. **Experience**: Timeline of work experience and internships
5. **Projects**: Featured projects with tech stack badges
6. **Education**: Academic background
7. **Contact**: Contact form and social links

## How to Use

### Opening Locally

Simply double-click `index.html` to open the portfolio in your default browser.

### Customization

#### Update Personal Information

Edit `index.html` to update:
- Your name and title
- Contact information
- LinkedIn and GitHub URLs
- Project descriptions
- Work experience details

#### Change Colors

Edit `style.css` root variables:
```css
:root {
    --primary-hue: 250;  /* Change for different primary color */
    --accent-hue: 280;   /* Change for different accent color */
}
```

#### Add Profile Picture

Replace the icon in the profile card section with your image:
```html
<!-- Replace this: -->
<i class="fas fa-user-circle"></i>

<!-- With this: -->
<img src="your-photo.jpg" alt="Your Name">
```

### Deployment

#### Option 1: Netlify (Recommended)

1. Create account at [netlify.com](https://netlify.com)
2. Drag and drop the VCARD folder
3. Your site will be live instantly!

#### Option 2: Vercel

1. Create account at [vercel.com](https://vercel.com)
2. Import your folder
3. Deploy

#### Option 3: GitHub Pages

1. Create a GitHub repository
2. Upload all files
3. Enable GitHub Pages in repository settings
4. Your site will be at `username.github.io/repository-name`

## Contact Form

The contact form currently uses a `mailto:` link which opens the user's email client. 

For production use, consider integrating:
- **Formspree** (free tier available)
- **EmailJS** (free tier available)
- **Netlify Forms** (if deployed on Netlify)

## Tech Stack

- **HTML5**: Semantic structure
- **CSS3**: Modern styling with custom properties
- **Vanilla JavaScript**: Interactive functionality
- **Font Awesome**: Icons
- **Google Fonts**: Inter font family

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Feel free to use this template for your own portfolio. Just update it with your information!

## Author

**Amaldev M**
- Email: amaldevm.dev@gmail.com
- Phone: 6282237472
- Location: Malappuram, Kerala

---

Built with ❤️ by Amaldev M
