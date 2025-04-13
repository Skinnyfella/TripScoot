# 🌍 TripScout - Discover Your Next Adventure

TripScout is a modern web application that helps travelers and locals discover exciting places around them. With a sleek glass-morphic design and intuitive interface, users can easily find hotels, restaurants, and fun activities in any location.


## ✨ Features

- 🎯 Intuitive location-based search
- 🗺️ Automatic GPS location detection
- 🏨 Find nearby hotels and accommodations
- 🍽️ Discover local restaurants and eateries
- 🎪 Explore entertainment venues and activities
- 🛍️ Locate shopping centers and malls
- 🎨 Modern glass-morphic UI design
- 📱 Fully responsive on all devices
- ⚡ Fast and efficient with caching
- 🔒 Secure API with rate limiting

## 🛠️ Technology Stack

### Frontend
- **React 18** - Latest React features
- **Vite** - Next generation frontend tooling
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **React Router** - Navigation
- **Heroicons** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Winston** - Logging
- **Node-Cache** - Memory caching
- **CORS** - Cross-Origin Resource Sharing
- **Helmet** - Security headers
- **Rate Limiting** - API protection

## 🚀 Live Demo

Visit the live application: [TripScout](https://trip-scout.vercel.app/)

## 📱 Mobile Responsiveness

TripScout is designed to work seamlessly across all devices:
- 💻 Desktop browsers
- 📱 Mobile phones
- 📟 Tablets

## 🔧 Local Development

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Geoapify API key

### Setting Up the Project

1. Clone the repository
\`\`\`bash
git clone https://github.com/Skinnyfella/TripScoot.git
cd tripscout
\`\`\`

2. Install dependencies
\`\`\`bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
\`\`\`

3. Environment Setup

Create .env files:

Frontend (.env):
\`\`\`env
VITE_API_URL=http://localhost:5000
\`\`\`

Backend (.env):
\`\`\`env
PORT=5000
GEOAPIFY_API_KEY=your_api_key_here
NODE_ENV=development
\`\`\`

4. Start the development servers

Backend:
\`\`\`bash
cd backend
npm run dev
\`\`\`

Frontend:
\`\`\`bash
cd frontend
npm run dev
\`\`\`

## 🔒 Security Features

- ⚔️ CORS protection
- 🛡️ Helmet security headers
- 🚫 Rate limiting
- 📝 Request logging
- 🔐 Environment variable protection

## 🌟 Key Features in Detail

### Location Detection
- Automatic GPS location detection
- Fallback to IP-based location
- Manual location search option

### Place Discovery
- Comprehensive hotel listings
- Local restaurant discovery
- Entertainment venue search
- Shopping mall locations

### User Experience
- Intuitive search interface
- Fast loading times
- Smooth animations
- Responsive design
- Error handling

## 👤 Author

- GitHub: [@Skinnyfella](https://github.com/Skinnyfella)
- Live Demo: [TripScout](https://trip-scout.vercel.app/)

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Geoapify](https://www.geoapify.com/) - Location and places data
- [Vercel](https://vercel.com/) - Hosting platform
- [Render](https://render.com/) - Backend hosting
- [OpenStreetMap](https://www.openstreetmap.org/) - Geocoding service