```markdown
# 🌤️ 3D Weather Widget by Muhammad Sajid

A beautiful, interactive 3D weather widget built with modern web technologies. This project combines real-time weather data with immersive 3D visuals and a refined UI for a delightful weather experience.

![Weather Widget Preview](preview.png)

---

## 👨‍💻 Created by

**Muhammad Sajid**  
Full-Stack Developer | AI Integrator | Ethical Hacker  
🌐 [Portfolio](https://sajid09.netlify.app/) • 💻 [GitHub](https://github.com/sajid09)

> With a background in building full-stack applications from scratch, I specialize in modern UI/UX, backend architecture, and interactive experiences. This project reflects my skillset in 3D visualization, real-time API usage, and responsive design.

---

## 🌟 Features

- 🌦️ Real-time weather via OpenWeatherMap API
- ☁️ Interactive 3D clouds with toggleable rain
- 📍 Location search with autocomplete
- 📱 Responsive design for all devices
- ✨ Elegant glassmorphism UI
- 🌈 Animated weather icons and effects
- 📊 Displays:
  - Temperature
  - Humidity & Wind Speed
  - Precipitation Chance
  - Sunrise / Sunset & Day Length
  - 4-Day Forecast

---

## 🛠️ Tech Stack

- HTML5, CSS3 with **Tailwind CSS**
- **JavaScript (ES6+)**
- **Three.js** (3D clouds and animation)
- **Particles.js** (background effects)
- **OpenWeatherMap API**

---

## 🚀 Getting Started

### ✅ Prerequisites

- A modern web browser
- An [OpenWeatherMap API Key](https://openweathermap.org/api)

### 📥 Installation

```bash
git clone https://github.com/yourusername/3d-weather-widget.git
cd 3d-weather-widget
```

### 🔑 Add Your API Key

Edit `main.js`:

```js
const API_KEY = 'YOUR_API_KEY';
```

### 🖥️ Run the App

```bash
# Python (v3+)
python -m http.server 8000

# OR Node.js
npx serve
```

---

## ⚙️ Usage

- Weather defaults to **New York**
- Use the **search bar** to find other cities
- **Click** clouds to toggle rain animation
- **Hover** elements to see detailed info

---

## 🎨 Customization

### Change Default Location

Edit the coordinates in `main.js`:

```js
updateWeather(40.7128, -74.0060); // New York -> your desired location
```

### Modify UI

- Tailwind utility classes are in `index.html`
- Global styles in `style.css`

### Adjust 3D Effects

In `main.js`, tweak:
- `createDetailedCloud`
- `animate`
- `createRaindropsForCloud`

---

## 🔌 API Reference

Uses **OpenWeatherMap** endpoints:

- `GET /data/2.5/weather`
- `GET /data/2.5/forecast`
- `GET /geo/1.0/direct` (location search)

---

## 🤝 Contributing

Pull requests, feature ideas, and bug reports are welcome!  
Let’s make weather more magical together 🌩️

---

## 📜 License

This project is licensed under the **MIT License** — see [`LICENSE`](LICENSE) for details.

---

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/)
- [Three.js](https://threejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Particles.js](https://vincentgarreau.com/particles.js/)

---

## 💬 FAQ

**Q: Weather not loading?**  
A: Make sure your API key is valid and added to `main.js`.

**Q: 3D clouds not visible?**  
A: Ensure browser supports **WebGL** and hardware acceleration is on.

**Q: Change temperature units?**  
A: Modify `units` param:
```js
units=metric     // Celsius
units=imperial   // Fahrenheit
```

---

## 🛣️ Roadmap

- [ ] More metrics (UV, pressure, visibility)
- [ ] Light/Dark theme toggle 🌗
- [ ] Multi-language support 🌍
- [ ] Weather alerts integration 🔔
- [ ] Weather radar/map overlays 🗺️
- [ ] Weather history viewer 📅

---

## 📬 Contact

Need help or want to collaborate?  
📧 Reach out via [Portfolio](https://sajid09.netlify.app/) or GitHub [Issues](https://github.com/yourusername/3d-weather-widget/issues)

---
