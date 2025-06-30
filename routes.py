from flask import render_template, send_from_directory, abort, request, flash, redirect, url_for
from app import app, mail
from flask_mail import Message
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
        # Use absolute path for deployment compatibility
        static_dir = os.path.abspath(os.path.join(app.root_path, 'static', 'assets'))
        return send_from_directory(
            directory=static_dir,
            path='Prajwal_Thapa_CV.pdf',
            as_attachment=True,
            download_name='Prajwal_Thapa_CV.pdf'
        )
    except FileNotFoundError:
        app.logger.error("CV file not found")
        abort(404)

@app.route('/send_message', methods=['POST'])
def send_message():
    """Handle contact form submission"""
    try:
        name = request.form.get('name')
        email = request.form.get('email')
        message_body = request.form.get('message')
        
        # Validate required fields
        if not name or not email or not message_body:
            flash('Please fill in all required fields.', 'error')
            return redirect(url_for('portfolio'))
        
        # Create message
        subject = f"Portfolio Contact Form - Message from {name}"
        recipient = "prajwalthapa780@gmail.com"
        
        # Email body
        body = f"""
        New message from your portfolio website:
        
        Name: {name}
        Email: {email}
        
        Message:
        {message_body}
        """
        
        msg = Message(subject, recipients=[recipient], body=body)
        
        # Send email
        mail.send(msg)
        
        flash('Thank you for your message! I\'ll get back to you soon.', 'success')
        return redirect(url_for('portfolio'))
        
    except Exception as e:
        app.logger.error(f"Error sending email: {e}")
        flash('Sorry, there was an error sending your message. Please try again.', 'error')
        return redirect(url_for('portfolio'))

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
