
from app import app

if __name__ == '__main__':
    # Use environment variables for deployment flexibility
    import os
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)
