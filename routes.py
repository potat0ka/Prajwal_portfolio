from flask import render_template, send_from_directory, abort
from app import app
import os

@app.route('/')
def landing():
    """Landing page with 3D guitar and music"""
    return render_template('landing.html')

@app.route('/portfolio')
def portfolio():
    """Main portfolio page"""
    return render_template('index.html')

@app.route('/cv')
def download_cv():
    """Download CV functionality"""
    try:
        return send_from_directory(
            directory=os.path.join(app.root_path, 'static', 'assets'),
            path='Prajwal_Thapa_CV.pdf',
            as_attachment=True,
            download_name='Prajwal_Thapa_CV.pdf'
        )
    except FileNotFoundError:
        abort(404)

@app.errorhandler(404)
def not_found_error(error):
    """Handle 404 errors"""
    return render_template('base.html', 
                         title="Page Not Found",
                         error_message="The page you're looking for doesn't exist."), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return render_template('base.html',
                         title="Server Error", 
                         error_message="An internal server error occurred."), 500
