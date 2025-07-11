<div align="center">
  <img src="https://raw.githubusercontent.com/poyrazavsever/PixelSinav-Frontend/refs/heads/master/public/logo/logo.png" alt="Pixel Exam Logo" width="200">
  <h1>Pixel Exam</h1>
  <p>
    <a href="README.md">Türkçe</a> |
    <a href="README-EN.md">English</a>
  </p>
</div>

# Pixel Exam Backend

Hello! I'm developing this project as part of my learning journey. I started this project to learn modern web technologies in depth and create solutions to real-world problems.

## About the Project

This is the backend part of a platform that aims to make the online exam experience more interactive and enjoyable for students. I'm aiming to develop a modern and scalable API using the NestJS framework.

## Technologies Used

<div align="center">
  <p>
    <img src="https://skillicons.dev/icons?i=ts" alt="TypeScript" title="TypeScript" />
    <img src="https://skillicons.dev/icons?i=nodejs" alt="Node.js" title="Node.js" />
    <img src="https://skillicons.dev/icons?i=nestjs" alt="NestJS" title="NestJS" />
    <img src="https://skillicons.dev/icons?i=mongodb" alt="MongoDB" title="MongoDB" />
    <img src="https://skillicons.dev/icons?i=jest" alt="Jest" title="Jest" />
    <img src="https://skillicons.dev/icons?i=docker" alt="Docker" title="Docker" />
  </p>
</div>

## Technical Details

- **Framework**: NestJS - For modern, scalable Node.js web applications
- **Language**: TypeScript - For type safety and better developer experience
- **Database**: MongoDB - Flexible and scalable NoSQL database
- **Authentication**: JWT (JSON Web Tokens) - For secure user sessions
- **API Documentation**: Swagger/OpenAPI - For API documentation
- **Testing**: Jest - For unit and integration tests
- **Package Manager**: pnpm - Fast and disk-space efficient package management

## Features

- [x] JWT-based user authentication
- [x] Email verification system
- [x] User profile management
- [ ] Exam creation and management
- [ ] Result analysis and reporting
- [ ] Real-time notifications
- [ ] Admin panel

## Learning Goals

Topics I'm trying to learn in this project:

1. NestJS best practices
2. Clean Architecture principles
3. Microservice architecture
4. Test Driven Development (TDD)
5. CI/CD pipeline setup
6. Docker containerization
7. MongoDB aggregation framework

## Getting Started

\`\`\`bash
# Clone the project
git clone https://github.com/yourusername/pixelsinav-backend.git

# Install dependencies
pnpm install

# Run in development mode
pnpm run start:dev
\`\`\`

## API Documentation
<details>
<summary><strong>📚 View API Documentation</strong></summary>

### Authentication Endpoints
<details>
<summary><strong>🔐 Authentication API Endpoints</strong></summary>

#### \`POST /auth/register\`
Creates a new user registration.
\`\`\`json
// Request
{
  "email": "user@example.com",
  "password": "secure_password",
  "name": "User Name",
  "roles": ["user"]  // Optional, default: ["user"]
}

// Response - 201 Created
{
  "message": "User successfully created",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "roles": ["user"]
  }
}
\`\`\`

#### \`POST /auth/login\`
Authenticates user and returns JWT token.
\`\`\`json
// Request
{
  "email": "user@example.com",
  "password": "secure_password"
}

// Response - 200 OK
{
  "message": "Login successful",
  "access_token": "jwt_token",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "roles": ["user"]
  }
}
\`\`\`

#### \`PUT /auth/update\`
Updates user information. Requires JWT token.
\`\`\`json
// Header
Authorization: Bearer jwt_token

// Request
{
  "name": "New Name",
  "password": "new_password"  // Optional
}

// Response - 200 OK
{
  "message": "User information updated",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "New Name"
  }
}
\`\`\`

#### \`POST /auth/verify-email\`
Verifies email address.
\`\`\`json
// Request
{
  "token": "verification_token"
}

// Response - 200 OK
{
  "message": "Email successfully verified"
}
\`\`\`

</details>

### Lessons Endpoints
<details>
<summary><strong>📚 Lessons API Endpoints</strong></summary>

#### \`POST /lessons\`
Creates a new lesson. Requires teacher role.
\`\`\`json
// Header
Authorization: Bearer jwt_token

// Request
{
  "title": "Lesson Title",
  "category": "backend-development",
  "difficultyLevel": "INTERMEDIATE",
  "tags": ["nodejs", "typescript"],
  "image": "image_url",
  "description": "Lesson description",
  "sections": [
    {
      "title": "Section 1",
      "content": "Markdown content",
      "description": "Section description",
      "order": 1,
      "xpPoints": 1000
    }
  ]
}

// Response - 201 Created
{
  "message": "Lesson successfully created",
  "lesson": {
    "id": "lesson_id",
    "title": "Lesson Title",
    // ... other fields
  }
}
\`\`\`

#### \`GET /lessons\`
Lists all lessons.
\`\`\`json
// Response - 200 OK
{
  "message": "Lessons successfully retrieved",
  "lessons": [
    {
      "id": "lesson_id",
      "title": "Lesson Title",
      // ... other fields
    }
  ]
}
\`\`\`

#### \`GET /lessons/:id\`
Gets details of a specific lesson.
\`\`\`json
// Response - 200 OK
{
  "message": "Lesson successfully retrieved",
  "lesson": {
    "id": "lesson_id",
    "title": "Lesson Title",
    // ... all lesson details
  }
}
\`\`\`

</details>

### Validation Rules
<details>
<summary><strong>✅ Validation Rules</strong></summary>

#### Lesson Creation/Update
- \`title\`: 3-100 characters
- \`description\`: 10-2000 characters
- \`category\`: Required
- \`difficultyLevel\`: BEGINNER, INTERMEDIATE, ADVANCED
- \`tags\`: At least 1 tag
- \`sections\`: At least 1 section
  - \`title\`: 3-100 characters
  - \`content\`: Minimum 10 characters (Markdown)
  - \`description\`: 10-1000 characters
  - \`order\`: Minimum 1
  - \`xpPoints\`: 0-5000 range

</details>

### Error Codes
<details>
<summary><strong>❌ Error Codes</strong></summary>

- \`400 Bad Request\`: Invalid request format or validation error
- \`401 Unauthorized\`: Authentication error
- \`403 Forbidden\`: Authorization error
- \`404 Not Found\`: Resource not found
- \`500 Internal Server Error\`: Server error

</details>

### Authorization
<details>
<summary><strong>🔒 Authorization</strong></summary>

Most endpoints require JWT-based authentication. Send token in header:
\`\`\`http
Authorization: Bearer your_jwt_token
\`\`\`

</details>

### Rate Limiting
<details>
<summary><strong>⚡ Rate Limiting</strong></summary>

API rate limiting is implemented:
- Anonymous requests: 100 requests/hour
- Authenticated requests: 1000 requests/hour

</details>

## Contributing

As this is a learning project, I'm open to any feedback! Please open an issue or submit a pull request for improvements, suggestions, or new ideas.

## Learning Resources

Resources I've used while developing this project:

- [NestJS Official Documentation](https://docs.nestjs.com/)
- [MongoDB University](https://university.mongodb.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [JWT.io](https://jwt.io/)

## Contact

Feel free to reach out for questions, suggestions, or collaboration:

- LinkedIn: [https://www.linkedin.com/in/poyrazavsever]
- Email: poyrazavsever@gmail.com

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for details.

---

  ⭐ If you like this project, please give it a star!
  🌱 This is a stop in my continuous learning and development journey... If you'd like to mentor, support, or give advice, reach out to me [here](https://www.pavsever.com).
