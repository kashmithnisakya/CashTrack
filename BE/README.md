# CashTrack Backend

The backend API for CashTrack expense tracking application, built with Jaseci.

## Overview

This backend provides REST API endpoints for managing expenses, income, user profiles, and authentication for the CashTrack application.

## Technology Stack

- **Jaseci**: A programming language and platform for building AI-powered applications
- **jac-cloud**: Cloud deployment framework for Jaseci applications

## Development Setup

### Prerequisites

- Python 3.8+
- pip package manager

### Installation

1. Navigate to the backend directory:
```bash
cd BE
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the application:
```bash
jac serve main.jac
```

## API Structure

The backend is organized into several modules:

- `main.jac` - Main application entry point
- `auth.jac` - Authentication and authorization
- `user.jac` - User management
- `expense.jac` - Expense tracking functionality
- `income.jac` - Income management
- `profile.jac` - User profile management
- `nodes.jac` - Data models and node definitions

## Deployment

The application is designed to work with jac-cloud for deployment. Refer to the jac-cloud documentation for deployment instructions.