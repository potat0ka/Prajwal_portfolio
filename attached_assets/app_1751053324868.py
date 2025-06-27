"""
Personal Portfolio Website - Flask Application
A clean, modular Flask application for a personal portfolio website.
"""

import os
from flask import Flask, render_template

# Initialize Flask application
app = Flask(__name__)

# Configure secret key for session management
app.secret_key = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

# Route definitions
@app.route('/')
def index():
    """
    3D Guitar Landing page route - displays the interactive 3D guitar experience
    with Three.js integration and music controls.
    """
    return render_template('landing.html')

@app.route('/portfolio')
def portfolio():
    """
    Main portfolio page route - displays the complete portfolio with
    about, projects, skills, and contact sections.
    """
    return render_template('portfolio_home.html')

@app.route('/about')
def about():
    """
    About page route - displays detailed information about Prajwal Thapa,
    his background, education, skills, and personal interests.
    """
    return render_template('about.html')

@app.route('/certificates')
def certificates():
    """
    Certificates page route - showcases professional certifications,
    training achievements, and continuous learning journey.
    """
    return render_template('certificates.html')

@app.route('/experience')
def experience():
    """
    Experience page route - displays educational timeline, teaching experience,
    and professional development journey.
    """
    return render_template('experience.html')

@app.route('/projects')
def projects():
    """
    Projects page route - displays portfolio projects and work samples.
    """
    return render_template('projects.html')

@app.route('/contact')
def contact():
    """
    Contact page route - displays contact information and form
    for visitors to reach out to Prajwal Thapa.
    """
    return render_template('contact.html')

# Error handlers
@app.errorhandler(404)
def page_not_found(error):
    """Handle 404 errors by showing a custom error page."""
    return render_template('index.html'), 404

@app.errorhandler(500)
def internal_server_error(error):
    """Handle 500 errors by showing a custom error page."""
    return render_template('index.html'), 500

# Application entry point
if __name__ == '__main__':
    # Run the application in debug mode for development
    app.run(host='0.0.0.0', port=5000, debug=True)