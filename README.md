
# Prajwal Thapa - Personal Portfolio

A modern, responsive personal portfolio website built with Flask, featuring 3D graphics, theme switching, and contact functionality.

## 🌟 Features

- **3D Interactive Landing Page**: Three.js guitar model with ambient audio
- **Responsive Design**: Works perfectly on all devices
- **Dark/Light Theme**: System preference detection with manual toggle
- **Contact Form**: Functional email contact system
- **CV Download**: Direct PDF download functionality
- **Modern UI**: Clean, professional design with smooth animations

## 🚀 Quick Deploy on Replit

### Method 1: Fork This Repository
1. **Fork the project** on Replit
2. **Click the Run button** - That's it! Your site will be live instantly.

### Method 2: Manual Setup
1. **Create a new Flask Repl** on Replit
2. **Upload your files** to the new Repl
3. **Click Run** to start your portfolio

## 🔧 Configuration

### Environment Variables (Optional)
For the contact form to work, set these in Replit Secrets:
- `SENDER_EMAIL`: Your Gmail address
- `SENDER_PASSWORD`: Your Gmail app password
- `SESSION_SECRET`: Random secret key for sessions

### Email Setup
1. Go to your **Google Account settings**
2. Enable **2-Factor Authentication**
3. Generate an **App Password** for Gmail
4. Add the credentials to Replit Secrets

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

## 🎯 Deployment Steps

### On Replit (Recommended)
1. **Run Locally**: Click the Run button to test
2. **Deploy**: Click Deploy → Autoscale → Set up deployment
3. **Configure**:
   - Machine: 1vCPU, 2 GiB RAM (default)
   - Max machines: 3 (default)
   - Choose your domain name
   - Run command: `gunicorn --bind 0.0.0.0:5000 main:app`
4. **Deploy**: Click Deploy button

Your portfolio will be live in minutes!

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
