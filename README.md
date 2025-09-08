# CashTrack

A smart expense tracking application with beautiful analytics and insights, featuring a modern React frontend and a powerful Jaseci backend.

## Project Structure

This project is organized as a monorepo with separate frontend and backend components:

- **[Frontend (FE)](./FE/README.md)** - React-based web application with TypeScript, Tailwind CSS, and shadcn-ui
- **[Backend (BE)](./BE/README.md)** - Jaseci-powered API server for data management and business logic

## Features

- 📊 Expense and income tracking
- 📈 Beautiful charts and analytics
- 👤 User profile management
- 🔐 Authentication and authorization
- 💼 Category-based organization
- 📱 Responsive design

## Quick Start

### Prerequisites

- Node.js & npm (for frontend)
- Python 3.12+ (for backend)

### Development Setup

1. **Clone the repository:**
```bash
git clone <YOUR_GIT_URL>
cd CashTrack
```

2. **Start the backend:**
```bash
cd BE
pip install -r requirements.txt
jac serve main.jac
```

3. **Start the frontend (in a new terminal):**
```bash
cd FE
npm install
npm run dev
```

## Technology Stack

### Frontend
- React with TypeScript
- Vite (build tool)
- Tailwind CSS
- shadcn-ui components
- Victory charts for data visualization

### Backend
- Jaseci programming language
- jac-cloud for deployment
- RESTful API architecture

## Documentation

For detailed setup and development instructions, please refer to the individual README files:

- [Frontend Documentation](./FE/README.md)
- [Backend Documentation](./BE/README.md)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.