# Modern Issue Tracker

A full-stack issue tracking system built with Node.js, Express, MongoDB, and Bootstrap 5, featuring a RESTful API and comprehensive test coverage.

## 🚀 Features

- **RESTful API**: Full CRUD operations for issue management
- **Real-time Updates**: Dynamic UI updates using jQuery and AJAX
- **Responsive Design**: Mobile-first approach using Bootstrap 5
- **Data Persistence**: MongoDB integration with Mongoose ODM
- **Comprehensive Testing**: Complete test coverage using Chai and Mocha
- **Modern UI**: Clean interface with tabbed navigation and modal dialogs

## 🛠️ Technical Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Chai (Testing)
- Mocha (Testing Framework)

### Frontend
- Bootstrap 5
- jQuery
- Font Awesome
- Prism.js (Code highlighting)

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/issues/{project}` | Retrieve all issues (with optional filters) |
| POST   | `/api/issues/{project}` | Create a new issue |
| PUT    | `/api/issues/{project}` | Update an existing issue |
| DELETE | `/api/issues/{project}` | Delete an issue |

### Query Parameters
- `open`: Filter by issue status (boolean)
- `assigned_to`: Filter by assignee

## 💻 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/issue-tracker.git

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB connection string

# Run tests
npm test

# Start the server
npm start
```

## 🧪 Testing

The application includes comprehensive test cases covering:

- API endpoint functionality
- Database operations
- Input validation
- Error handling

Run tests using:
```bash
npm test
```

## 📝 Issue Structure

```typescript
interface Issue {
  _id: string;
  issue_title: string;
  issue_text: string;
  created_on: Date;
  updated_on: Date;
  created_by: string;
  assigned_to: string;
  open: boolean;
  status_text: string;
}
```

## 🔐 Environment Variables

```
MONGODB_URI=your_mongodb_connection_string
PORT=3000
NODE_ENV=development
```

## 📚 Documentation

Detailed API documentation is available in the application's API tab. The documentation includes:
- Endpoint descriptions
- Request/Response formats
- Query parameter options
- Example responses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📜 License

MIT License

---
Built with ❤️ using modern web technologies