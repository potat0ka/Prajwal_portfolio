
# Prajwal Thapa - Personal Portfolio

A modern, responsive personal portfolio website built with Flask, featuring 3D graphics, theme switching, and contact functionality.

## 🌟 Features

- **3D Interactive Landing Page**: Three.js guitar model with ambient audio
- **Responsive Design**: Works perfectly on all devices
- **Dark/Light Theme**: System preference detection with manual toggle
- **Contact Form**: Functional email contact system
- **CV Download**: Direct PDF download functionality
- **Modern UI**: Clean, professional design with smooth animations

## 📁 Project Structure

```
├── app.py              # Main Flask application
├── main.py             # Application entry point
├── routes.py           # URL routing and views
├── requirements.txt    # Python dependencies
├── Procfile           # Deployment configuration
├── templates/         # HTML templates
│   ├── base.html      # Base template
│   ├── landing.html   # 3D landing page
│   └── index.html     # Portfolio page
├── static/
│   ├── css/           # Stylesheets
│   ├── js/            # JavaScript files
│   └── assets/        # Images, CV, 3D models
└── .replit           # Replit configuration
```

## 🛠️ Customization

### Update Personal Information
- Edit `templates/index.html` for portfolio content
- Replace `static/assets/prajwal_photo_1751055075554.png` with your photo
- Update `static/assets/Prajwal_Thapa_CV.pdf` with your CV

### Change Colors/Theme
- Modify `static/css/variables.css` for color schemes
- Update `static/css/components.css` for UI components

### Add New Sections
- Create new routes in `routes.py`
- Add corresponding templates in `templates/`

## 🎵 3D Model & Audio
- Guitar model: `static/assets/acoustic_guitar_1751054814347.glb`
- Background music: `static/assets/acoustic-guitar-melody-2-358291_1750913948630_1751055328318.mp3`

Replace these files to customize the landing page experience.

## 📧 Contact Form
The contact form sends emails to `prajwalthapa780@gmail.com`. Update the recipient email in `routes.py`:

```python
recipient_email = "your_email@gmail.com"  # Change this
```

## 🔍 Troubleshooting

### Common Issues
1. **Contact form not working**: Check email credentials in Secrets
2. **3D model not loading**: Ensure GLB file is in correct path
3. **Theme not persisting**: Check JavaScript console for errors

### Logs
Check the Console tab in Replit for error messages and debugging info.

## 🚀 Performance
- **Lightweight**: Optimized for fast loading
- **Responsive**: Mobile-first design
- **SEO-friendly**: Proper meta tags and structure

## 📱 Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🔐 Security
- Environment variables for sensitive data
- Secure session management
- Input validation on forms

## 📄 License
This project is open source. Feel free to use it as inspiration for your own portfolio!

---

**Ready to deploy?** Just click the Run button and your portfolio will be live! 🎉

For any issues, check the Replit console or contact support.
