3D Weather Widget by Muhammad Sajid

A beautiful, interactive 3D weather widget built with modern web technologies. This project combines real-time weather data with immersive 3D visuals and a refined user interface, offering a seamless and informative weather experience.



✨ Created by

👨‍💻 Muhammad SajidFull-Stack Web Developer | AI Integrator | Ethical Hacker🔗 Portfolio | 🌐 GitHub

With several full-stack projects built from scratch, I bring professional-level experience in web design, backend architecture, API integrations, and real-time applications. This weather widget demonstrates my skills in 3D rendering with Three.js, API consumption, and responsive UI development using Tailwind CSS.

🌟 Features

🌤️ Real-time weather data from OpenWeatherMap API

☁️ Interactive 3D cloud animation with dynamic rain effects

🔍 Location search with autocomplete using OpenWeatherMap Geocoding

📱 Fully responsive design for all screen sizes

🎨 Glassmorphism-based elegant UI

🌈 Dynamic weather icons and condition-based animations

📊 Detailed weather information:

Current temperature

Humidity & wind speed

Precipitation chance

Sunrise/sunset & day length

4-day forecast

⚙️ Technologies Used

HTML5, CSS3 (Tailwind CSS)

JavaScript (ES6+)

Three.js for 3D cloud & rain animations

Particles.js for elegant background effects

OpenWeatherMap API for real-time data

🚀 Getting Started

✅ Prerequisites

A modern web browser (Chrome, Firefox, Edge)

An OpenWeatherMap API key→ Get one here: https://openweathermap.org/

📦 Installation

Clone the Repository

git clone https://github.com/yourusername/3d-weather-widget.git
cd 3d-weather-widget

Insert Your API Key
Open main.js and replace the placeholder:

const API_KEY = 'YOUR_API_KEY';

Run Locally

# With Python
python -m http.server 8000

# Or with Node.js
npx serve

🔧 Usage

The widget loads weather for New York by default

Use the search bar to look up other cities

Click on 3D clouds to toggle rain

Hover on elements to view more weather details

🎨 Customization

Change Default Location

In main.js, replace the New York coordinates:

updateWeather(40.7128, -74.0060); // Change to your desired city

Style and UI

Edit Tailwind classes in index.html or use custom styles in style.css.

3D Cloud Settings

Modify the createDetailedCloud, animate, and createRaindropsForCloud functions in main.js to tweak 3D behavior.

🔌 API Reference

All endpoints from OpenWeatherMap:

GET /data/2.5/weather — Current weather

GET /data/2.5/forecast — 5-day forecast

GET /geo/1.0/direct — Geocoding (for city search)

🤝 Contributing

I welcome pull requests and suggestions.Let’s make weather more interactive together!

📄 License

MIT License – see the LICENSE file for full details.

🙏 Acknowledgments

OpenWeatherMap

Three.js

Tailwind CSS

Particles.js

📘 FAQ

Q: Weather not loading?A: Make sure your API key is valid and added to main.js.

Q: 3D clouds not showing?A: Ensure your browser supports WebGL and hardware acceleration is enabled.

Q: Change temperature unit?A: Edit the units parameter in API calls:metric for Celsius, imperial for Fahrenheit.