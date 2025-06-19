# TypeConquer 🧠⌨️

<div align="center">

![TypeConquer Logo](https://img.shields.io/badge/Type-Conquer-blue?style=for-the-badge&logo=keyboard&logoColor=white)

**A full-stack typing practice and challenge platform built with modern web technologies**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-typeconquer.vercel.app-success?style=for-the-badge)](https://typeconquer.vercel.app)
[![GitHub Issues](https://img.shields.io/github/issues/prabalesh/typeconquer?style=for-the-badge)](https://github.com/prabalesh/typeconquer/issues)
[![GitHub Stars](https://img.shields.io/github/stars/prabalesh/typeconquer?style=for-the-badge)](https://github.com/prabalesh/typeconquer/stargazers)
[![License](https://img.shields.io/badge/License-ISC-yellow?style=for-the-badge)](./LICENSE)

</div>

---

## 🚀 About TypeConquer

TypeConquer is a comprehensive typing practice platform designed to help users improve their typing speed, accuracy, and consistency through lessons, interactive challenges, and friendly competitions. Whether you're a beginner looking to learn touch typing or an expert aiming to break speed records, TypeConquer has something for everyone.

### ✨ Key Highlights

- 🎯 **Learning**: Adaptive lessons tailored to your skill level
- 🏆 **Competitive Environment**: Challenge friends
- 📊 **Detailed Analytics**: Track your progress with comprehensive statistics
- 🔒 **Secure Authentication**: Google OAuth integration for seamless login
- 🌐 **Real-time Features**: Live notifications and updates

---

## 🧩 Features

<table>
<tr>
<td width="50%">

### 📝 **Practice & Learning**
- Dynamic paragraph generation
- Structured learning modules
- Progressive difficulty levels
- Custom word banks and exercises

</td>
<td width="50%">

### 🤝 **Social Features**
- Friend system with invitations
- Real-time typing challenges
- Leaderboards and rankings
- Achievement system

</td>
</tr>
<tr>
<td width="50%">

### 📊 **Analytics & Tracking**
- Detailed performance metrics
- Historical progress tracking
- WPM and accuracy statistics
- Personal best records

</td>
<td width="50%">

### 🔐 **Security & Auth**
- Google OAuth 2.0 integration
- JWT-based authentication
- Secure user data handling
- Session management

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

### Backend Technologies
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

### Authentication & Security
![Google OAuth](https://img.shields.io/badge/Google_OAuth-4285F4?style=for-the-badge&logo=google&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

### Development Tools
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Nodemon](https://img.shields.io/badge/NODEMON-76D04B?style=for-the-badge&logo=nodemon&logoColor=white)

</div>

---

## 📁 Project Structure

```
typeconquer/
├── 📂 src/                    # TypeScript source code
│   ├── 📂 config/             # Application configuration
│   ├── 📂 db/                 # Database connection setup
│   ├── 📂 middlewares/        # Authentication middleware
│   ├── 📂 module/             # Feature modules
│   │   ├── 📂 auth/           # Authentication & user management
│   │   ├── 📂 challenge/      # Typing challenges system
│   │   ├── 📂 friendship/     # Friend requests & management
│   │   ├── 📂 home/           # Base application routes
│   │   ├── 📂 learning/       # Educational modules & lessons
│   │   ├── 📂 notifications/  # Real-time notification system
│   │   └── 📂 typingtests/    # Typing test logic & scoring
│   ├── 📂 utils/              # Utility functions & helpers
│   └── 📄 server.ts           # Application entry point
├── 📂 dist/                   # Compiled JavaScript output
├── 📄 package.json            # Project dependencies & scripts
├── 📄 tsconfig.json           # TypeScript configuration
├── 📄 eslint.config.mjs       # ESLint rules & settings
└── 📄 README.md               # Project documentation
```

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** instance or MongoDB Atlas URI - [Get Started](https://www.mongodb.com/)
- **Google OAuth 2.0** credentials - [Setup Guide](https://developers.google.com/identity/protocols/oauth2)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/prabalesh/typeconquer.git
   cd typeconquer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment configuration**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
   ```

4. **Development server**
   ```bash
   npm run dev
   ```

5. **Production build**
   ```bash
   npm run build
   npm start
   ```

---

## 🔗 API Documentation

All API endpoints are prefixed with `/api`. Here's a comprehensive overview:

<table>
<thead>
<tr>
<th>Endpoint</th>
<th>Method</th>
<th>Description</th>
<th>Auth Required</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>/api</code></td>
<td>GET</td>
<td>Application health check</td>
<td>❌</td>
</tr>
<tr>
<td><code>/api/auth</code></td>
<td>POST</td>
<td>User authentication & registration</td>
<td>❌</td>
</tr>
<tr>
<td><code>/api/typingtests</code></td>
<td>GET/POST</td>
<td>Typing test results & leaderboards</td>
<td>✅</td>
</tr>
<tr>
<td><code>/api/friends</code></td>
<td>GET/POST</td>
<td>Friend system management</td>
<td>✅</td>
</tr>
<tr>
<td><code>/api/challenges</code></td>
<td>GET/POST</td>
<td>Typing challenges between users</td>
<td>✅</td>
</tr>
<tr>
<td><code>/api/notifications</code></td>
<td>GET</td>
<td>User notifications & alerts</td>
<td>✅</td>
</tr>
<tr>
<td><code>/api/learning</code></td>
<td>GET/POST</td>
<td>Learning modules & progress tracking</td>
<td>✅</td>
</tr>
</tbody>
</table>

---

## 📈 Roadmap & Development Status

<details>
<summary><strong>Click to view detailed roadmap</strong></summary>

### ✅ Completed Features
- [x] JWT and Google OAuth authentication system
- [x] Comprehensive typing test with result tracking
- [x] Learning modules with structured lessons
- [x] Challenge system between friends
- [x] Friend request and management system
- [x] Real-time notifications
- [x] Performance analytics and leaderboards

### 🚧 In Development
- [ ] Real-time multiplayer typing races (WebSocket integration)
- [ ] Advanced analytics dashboard
- [ ] Mobile application (React Native)
- [ ] API rate limiting and caching

### 🔮 Future Plans
- [ ] Admin dashboard for content management
- [ ] Custom typing tests creation
- [ ] Tournament system
- [ ] AI-powered typing recommendations
- [ ] Multi-language support

</details>

---

## 🤝 Contributing

We welcome contributions from developers of all skill levels! Here's how you can get involved:

### Getting Started

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
4. **Make** your changes
5. **Commit** your changes (`git commit -m 'Add some amazing feature'`)
6. **Push** to the branch (`git push origin feature/amazing-feature`)
7. **Open** a Pull Request

### Contribution Guidelines

- Follow the existing code style and conventions
- Write clear, descriptive commit messages
- Add tests for new features when applicable
- Update documentation as needed
- Be respectful and constructive in discussions

### Areas Where We Need Help

- 🐛 Bug fixes and issue resolution
- ✨ New feature development
- 📚 Documentation improvements
- 🎨 UI/UX enhancements
- 🧪 Test coverage expansion

---

## 📄 License

This project is licensed under the **ISC License**. See the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Contributors**: Thank you to all the developers who have contributed to this project
- **Community**: Special thanks to the typing community for feedback and suggestions
- **Technologies**: Built with amazing open-source technologies

---

## 📞 Support & Contact

<div align="center">

**Found a bug or have a feature request?**

[![GitHub Issues](https://img.shields.io/badge/Report_Issue-GitHub-red?style=for-the-badge&logo=github)](https://github.com/prabalesh/typeconquer/issues)

**Want to contribute or have questions?**

[![GitHub Discussions](https://img.shields.io/badge/Join_Discussion-GitHub-blue?style=for-the-badge&logo=github)](https://github.com/prabalesh/typeconquer/discussions)

</div>

---

<div align="center">

### ✨ Made with ❤️ by [Prabalesh](https://github.com/prabalesh)

**If you found this project helpful, please consider giving it a ⭐!**

[![GitHub Stars](https://img.shields.io/github/stars/prabalesh/typeconquer?style=social)](https://github.com/prabalesh/typeconquer/stargazers)

</div>
