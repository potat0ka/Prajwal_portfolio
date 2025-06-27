# Prajwal Thapa Personal Portfolio

## Overview

This is a personal portfolio website for Prajwal Thapa, a third-year Bachelor of Arts in Social Work (BASW) student at Saraswati Multiple Campus. The application is built using Flask (Python) for the backend and features a modern, responsive design with 3D graphics, theme switching, and interactive elements.

## System Architecture

The application follows a modular Flask architecture with clear separation of concerns:

### Backend Architecture
- **Flask Framework**: Lightweight Python web framework serving as the application core
- **Route-based Navigation**: Clean URL routing for different portfolio sections
- **Static File Management**: Organized static assets including CSS, JavaScript, images, and documents
- **Template System**: Jinja2 templating with base template inheritance for consistent layouts

### Frontend Architecture
- **Modular CSS Architecture**: Organized into separate files (variables, base, components, typography, layout, navigation, forms, sections, responsive)
- **Three.js Integration**: 3D guitar model rendering for the landing page experience
- **Theme System**: Comprehensive dark/light mode support with system preference detection
- **Responsive Design**: Mobile-first approach with progressive enhancement

## Key Components

### Core Application Files
- **app.py**: Flask application initialization and configuration
- **routes.py**: URL routing and view functions
- **main.py**: Application entry point

### Frontend Components
- **Landing Page**: Interactive 3D guitar experience with Three.js
- **Portfolio Pages**: About, Experience, Certificates, Contact sections
- **Theme Manager**: JavaScript class for theme switching and persistence
- **Navigation System**: Responsive navigation with mobile support

### Template Structure
- **base.html**: Base template with common elements and meta tags
- **landing.html**: 3D guitar landing page
- **index.html**: Main portfolio page
- Extends base template for consistent layout

## Data Flow

1. **Request Routing**: Flask routes handle incoming requests and determine appropriate templates
2. **Template Rendering**: Jinja2 processes templates with dynamic content
3. **Static Asset Delivery**: CSS, JavaScript, and media files served directly
4. **Client-Side Interactions**: JavaScript handles theme switching, 3D rendering, and UI interactions
5. **File Downloads**: CV download functionality through Flask file serving

## External Dependencies

### Python Dependencies
- Flask: Web framework
- Werkzeug: WSGI utilities (ProxyFix middleware)

### Frontend Libraries
- Three.js: 3D graphics and guitar model rendering
- Font Awesome: Icon library
- Google Fonts: Inter and Poppins font families

### CDN Resources
- Three.js library and loaders (GLTFLoader, OrbitControls)
- Font Awesome CSS
- Google Fonts API

## Deployment Strategy

The application is configured for flexible deployment:

### Development
- Flask development server on port 5000
- Debug mode enabled
- Hot reloading for template and static file changes

### Production Considerations
- ProxyFix middleware configured for reverse proxy deployment
- Environment-based secret key configuration
- Logging configuration set to DEBUG level
- Host binding to 0.0.0.0 for container compatibility

### Static File Serving
- Organized static directory structure
- Efficient CSS and JavaScript organization
- Asset optimization ready (fonts, images, 3D models)

## Changelog

- June 27, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.