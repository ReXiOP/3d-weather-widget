import * as THREE from "https://esm.sh/three";
import { OrbitControls } from "https://esm.sh/three/examples/jsm/controls/OrbitControls.js";

const dateTimeEl = document.getElementById('dateTime');

function updateDateTime() {
    const now = new Date();
    const optionsDate = { weekday: 'long' };
    const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: false };
    if (dateTimeEl) {
        dateTimeEl.textContent = `${now.toLocaleDateString(undefined, optionsDate)}, ${now.toLocaleTimeString([], optionsTime)}`;
    }
}
updateDateTime();
setInterval(updateDateTime, 60000);

const container = document.getElementById('cloud-container');

if (container) {
    const containerRect = container.getBoundingClientRect();
    const scene = new THREE.Scene();
    const cameraAspect = (containerRect.width > 0 && containerRect.height > 0) ? containerRect.width / containerRect.height : 1;
    const camera = new THREE.PerspectiveCamera(60, cameraAspect, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(containerRect.width, containerRect.height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    camera.position.set(0, 0.5, 4.5);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
    directionalLight.position.set(2, 3, 2);
    scene.add(directionalLight);
    const pointLight = new THREE.PointLight(0xaabbee, 0.8, 15);
    pointLight.position.set(-1, 1, 3);
    scene.add(pointLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.rotateSpeed = 0.8;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI / 3;
    controls.maxPolarAngle = Math.PI / 1.8;
    controls.target.set(0, 0, 0);

    const cloudGroup = new THREE.Group();
    scene.add(cloudGroup);

    const cloudMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xf0f8ff,
        transparent: true, opacity: 0.85, roughness: 0.6, metalness: 0.0,
        transmission: 0.1,
        ior: 1.3,
        specularIntensity: 0.2,
        sheen: 0.2, sheenColor: 0xffffff, sheenRoughness: 0.5,
        clearcoat: 0.05, clearcoatRoughness: 0.3,
    });

    function createCloudPart(radius, position) {
        const geometry = new THREE.SphereGeometry(radius, 20, 20);
        const mesh = new THREE.Mesh(geometry, cloudMaterial);
        mesh.position.copy(position);
        return mesh;
    }

    function createDetailedCloud(x, y, z, scale) {
        const singleCloudGroup = new THREE.Group();
        singleCloudGroup.position.set(x, y, z);
        singleCloudGroup.scale.set(scale, scale, scale);
        const parts = [
            { radius: 0.8, position: new THREE.Vector3(0, 0, 0) }, { radius: 0.6, position: new THREE.Vector3(0.7, 0.2, 0.1) },
            { radius: 0.55, position: new THREE.Vector3(-0.6, 0.1, -0.2) }, { radius: 0.7, position: new THREE.Vector3(0.1, 0.4, -0.3) },
            { radius: 0.5, position: new THREE.Vector3(0.3, -0.3, 0.2) }, { radius: 0.6, position: new THREE.Vector3(-0.4, -0.2, 0.3) },
            { radius: 0.45, position: new THREE.Vector3(0.8, -0.1, -0.2) }, { radius: 0.5, position: new THREE.Vector3(-0.7, 0.3, 0.3) },
        ];
        parts.forEach(part => singleCloudGroup.add(createCloudPart(part.radius, part.position)));
        singleCloudGroup.userData = {
            isRaining: false, rainColor: Math.random() > 0.5 ? 0x87CEFA : 0xB0E0E6,
            originalPosition: singleCloudGroup.position.clone(), bobOffset: Math.random() * Math.PI * 2,
            bobSpeed: 0.0005 + Math.random() * 0.0003, bobAmount: 0.15 + Math.random() * 0.1,
        };
        return singleCloudGroup;
    }

    const cloud1 = createDetailedCloud(-0.7, 0.2, 0, 1.0);
    const cloud2 = createDetailedCloud(0.7, -0.1, 0.3, 0.9);
    cloudGroup.add(cloud1, cloud2);
    cloudGroup.position.y = -0.2;
    let autoRotateSpeed = 0.002;

    function createRaindropsForCloud(cloud) {
        const rainGroup = new THREE.Group();
        cloud.add(rainGroup);
        cloud.userData.rainGroup = rainGroup;
        const raindropMaterial = new THREE.MeshBasicMaterial({ color: cloud.userData.rainColor, transparent: true, opacity: 0.7 });
        const localRaindrops = [];
        for (let i = 0; i < 30; i++) {
            const raindropGeom = new THREE.CylinderGeometry(0.015, 0.015, 0.25, 6);
            const raindrop = new THREE.Mesh(raindropGeom, raindropMaterial);
            raindrop.position.set( (Math.random() - 0.5) * 1.8, -0.8 - Math.random() * 1.5, (Math.random() - 0.5) * 1.8 );
            raindrop.userData = { originalY: raindrop.position.y - Math.random() * 0.5, speed: 0.08 + Math.random() * 0.05 };
            localRaindrops.push(raindrop);
            rainGroup.add(raindrop);
        }
        rainGroup.visible = false;
        return localRaindrops;
    }

    const raindrops1 = createRaindropsForCloud(cloud1);
    const raindrops2 = createRaindropsForCloud(cloud2);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    renderer.domElement.addEventListener('click', (event) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(cloudGroup.children, true);

        if (intersects.length > 0) {
            let clickedObj = intersects[0].object;
            let physicallyClickedCloud = null;
            while (clickedObj.parent && clickedObj.parent !== cloudGroup) {
                clickedObj = clickedObj.parent;
            }

            if (clickedObj.parent === cloudGroup) {
                physicallyClickedCloud = clickedObj;

                const isCloud1Raining = cloud1.userData.isRaining;
                const isCloud2Raining = cloud2.userData.isRaining;

                let newGlobalRainState;
                if (isCloud1Raining && isCloud2Raining) {
                    newGlobalRainState = false;
                } else {
                    newGlobalRainState = true;
                }

                cloud1.userData.isRaining = newGlobalRainState;
                if (cloud1.userData.rainGroup) {
                    cloud1.userData.rainGroup.visible = newGlobalRainState;
                }

                cloud2.userData.isRaining = newGlobalRainState;
                if (cloud2.userData.rainGroup) {
                    cloud2.userData.rainGroup.visible = newGlobalRainState;
                }

                if (physicallyClickedCloud) {
                    const originalScale = physicallyClickedCloud.scale.clone();
                    physicallyClickedCloud.scale.multiplyScalar(1.15);
                    setTimeout(() => {
                        physicallyClickedCloud.scale.copy(originalScale);
                    }, 150);
                }
            }
        }
    });

    const tooltip = document.getElementById('cloud-tooltip');
    setTimeout(() => {
        if (tooltip) tooltip.classList.add('opacity-100');
        setTimeout(() => { if (tooltip) tooltip.classList.remove('opacity-100'); }, 3500);
    }, 1500);

    function animate() {
        requestAnimationFrame(animate);
        const time = Date.now();
        cloudGroup.rotation.y += autoRotateSpeed;

        [cloud1, cloud2].forEach(cloud => {
            if (cloud) {
                cloud.position.y = cloud.userData.originalPosition.y + Math.sin(time * cloud.userData.bobSpeed + cloud.userData.bobOffset) * cloud.userData.bobAmount;

                if (cloud.userData.isRaining && cloud.userData.rainGroup) {
                    const currentRaindrops = cloud === cloud1 ? raindrops1 : raindrops2;
                    currentRaindrops.forEach(raindrop => {
                        raindrop.position.y -= raindrop.userData.speed;
                        if (raindrop.position.y < -5) {
                            raindrop.position.y = -0.8;
                            raindrop.position.x = (Math.random() - 0.5) * 1.8 * cloud.scale.x;
                            raindrop.position.z = (Math.random() - 0.5) * 1.8 * cloud.scale.z;
                        }
                    });
                }
            }
        });
        controls.update();
        renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
        const newRect = container.getBoundingClientRect();
        if (newRect.width > 0 && newRect.height > 0) {
            camera.aspect = newRect.width / newRect.height;
            camera.updateProjectionMatrix();
            renderer.setSize(newRect.width, newRect.height);
        }
    });

    animate();

} else {
    console.error("Cloud container (id: 'cloud-container') not found! 3D cloud animation will not be initialized.");
}

// OpenWeatherMap API configuration
const API_KEY = 'ec1c45cd6073f74ecb55684ff6c79f00'; // Your OpenWeatherMap API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// DOM Elements
const elements = {
    temperature: document.getElementById('temperature'),
    location: document.getElementById('location'),
    dateTime: document.getElementById('dateTime'),
    sunriseTime: document.getElementById('sunriseTime'),
    sunsetTime: document.getElementById('sunsetTime'),
    dayLength: document.getElementById('dayLength'),
    precipitationChance: document.getElementById('precipitationChance'),
    humidity: document.getElementById('humidity'),
    windSpeed: document.getElementById('windSpeed'),
    locationInput: document.getElementById('locationInput'),
    searchButton: document.getElementById('searchButton'),
    searchResults: document.getElementById('searchResults'),
    cloudContainer: document.getElementById('cloud-container'),
    cloudTooltip: document.getElementById('cloud-tooltip'),
    feelsLike: document.getElementById('feelsLike'),
    pressure: document.getElementById('pressure'),
    visibility: document.getElementById('visibility'),
    uvIndex: document.getElementById('uvIndex'),
    aqiValue: document.getElementById('aqiValue'),
    aqiMeter: document.getElementById('aqiMeter'),
    pm25: document.getElementById('pm25'),
    pm10: document.getElementById('pm10'),
    o3: document.getElementById('o3'),
    no2: document.getElementById('no2'),
    hourlyForecast: document.querySelector('.hourly-forecast .flex')
};

// State management
let state = {
    currentLocation: null,
    searchTimeout: null,
    isSearching: false,
    lastSearchQuery: '',
    searchResults: []
};

// Utility functions
const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const calculateDayLength = (sunrise, sunset) => {
    const sunriseDate = new Date(sunrise * 1000);
    const sunsetDate = new Date(sunset * 1000);
    const diff = sunsetDate - sunriseDate;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
};

const getWeatherIcon = (code) => {
    const icons = {
        '01d': '☀️', '01n': '🌙',
        '02d': '⛅', '02n': '☁️',
        '03d': '☁️', '03n': '☁️',
        '04d': '☁️', '04n': '☁️',
        '09d': '🌧️', '09n': '🌧️',
        '10d': '🌦️', '10n': '🌧️',
        '11d': '⛈️', '11n': '⛈️',
        '13d': '❄️', '13n': '❄️',
        '50d': '🌫️', '50n': '🌫️'
    };
    return icons[code] || '⛅';
};

// API functions
async function fetchWeatherData(lat, lon) {
    try {
        const response = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}

async function fetchForecast(lat, lon) {
    try {
        const response = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching forecast:', error);
        throw error;
    }
}

async function fetchAirQuality(lat, lon) {
    try {
        const response = await fetch(`${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching air quality:', error);
        throw error;
    }
}

async function searchLocations(query) {
    if (!query || query.length < 2) return [];
    
    try {
        const response = await fetch(`${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error searching locations:', error);
        throw error;
    }
}

// Weather background management
function updateWeatherBackground(weatherCode) {
    const bodyWrapper = document.querySelector('.body-wrapper');
    const weatherParticles = document.querySelector('.weather-particles') || createWeatherParticles();
    
    // Remove all weather classes
    bodyWrapper.classList.remove('clear', 'cloudy', 'rainy', 'snowy');
    
    // Clear existing particles
    weatherParticles.innerHTML = '';
    
    // Determine weather type and set appropriate background
    if (weatherCode >= 200 && weatherCode < 300) {
        // Thunderstorm
        bodyWrapper.classList.add('rainy');
        createRainParticles(weatherParticles, 100);
    } else if (weatherCode >= 300 && weatherCode < 400) {
        // Drizzle
        bodyWrapper.classList.add('rainy');
        createRainParticles(weatherParticles, 50);
    } else if (weatherCode >= 500 && weatherCode < 600) {
        // Rain
        bodyWrapper.classList.add('rainy');
        createRainParticles(weatherParticles, 150);
    } else if (weatherCode >= 600 && weatherCode < 700) {
        // Snow
        bodyWrapper.classList.add('snowy');
        createSnowParticles(weatherParticles, 100);
    } else if (weatherCode >= 700 && weatherCode < 800) {
        // Atmosphere (fog, mist, etc.)
        bodyWrapper.classList.add('cloudy');
        createCloudParticles(weatherParticles, 20);
    } else if (weatherCode === 800) {
        // Clear
        bodyWrapper.classList.add('clear');
    } else if (weatherCode > 800) {
        // Clouds
        bodyWrapper.classList.add('cloudy');
        createCloudParticles(weatherParticles, 30);
    }
}

function createWeatherParticles() {
    const particles = document.createElement('div');
    particles.className = 'weather-particles';
    document.querySelector('.body-wrapper').appendChild(particles);
    return particles;
}

function createCloudParticles(container, count) {
    for (let i = 0; i < count; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud-particle';
        
        // Random size between 50 and 150px
        const size = Math.random() * 100 + 50;
        cloud.style.width = `${size}px`;
        cloud.style.height = `${size}px`;
        
        // Random position
        cloud.style.top = `${Math.random() * 100}%`;
        cloud.style.left = `${Math.random() * 100}%`;
        
        // Random animation delay
        cloud.style.animationDelay = `${Math.random() * 20}s`;
        
        container.appendChild(cloud);
    }
}

function createRainParticles(container, count) {
    for (let i = 0; i < count; i++) {
        const raindrop = document.createElement('div');
        raindrop.className = 'rain-particle';
        
        // Random position
        raindrop.style.left = `${Math.random() * 100}%`;
        raindrop.style.top = `${Math.random() * 100}%`;
        
        // Random animation delay
        raindrop.style.animationDelay = `${Math.random() * 2}s`;
        
        container.appendChild(raindrop);
    }
}

function createSnowParticles(container, count) {
    for (let i = 0; i < count; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snow-particle';
        
        // Random size between 4 and 8px
        const size = Math.random() * 4 + 4;
        snowflake.style.width = `${size}px`;
        snowflake.style.height = `${size}px`;
        
        // Random position
        snowflake.style.left = `${Math.random() * 100}%`;
        snowflake.style.top = `${Math.random() * 100}%`;
        
        // Random animation delay
        snowflake.style.animationDelay = `${Math.random() * 10}s`;
        
        container.appendChild(snowflake);
    }
}

// UI update functions
function updateWeatherUI(data) {
    elements.temperature.textContent = `${Math.round(data.main.temp)}°C`;
    elements.location.textContent = `${data.name}, ${data.sys.country}`;
    elements.dateTime.textContent = formatDate();
    elements.sunriseTime.textContent = formatTime(data.sys.sunrise);
    elements.sunsetTime.textContent = formatTime(data.sys.sunset);
    elements.dayLength.textContent = calculateDayLength(data.sys.sunrise, data.sys.sunset);
    
    const precipitation = data.rain ? data.rain['1h'] || 0 : 0;
    elements.precipitationChance.textContent = `Rain ${Math.round(precipitation * 100)}%`;
    elements.humidity.textContent = `Humidity: ${data.main.humidity}%`;
    elements.windSpeed.textContent = `Wind: ${Math.round(data.wind.speed * 3.6)} km/h`;

    // Update weather icon
    const weatherIcon = document.querySelector('.weather-icon-main');
    if (weatherIcon) {
        weatherIcon.textContent = getWeatherIcon(data.weather[0].icon);
    }

    // Update new weather details
    elements.feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    elements.pressure.textContent = `${data.main.pressure} hPa`;
    elements.visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
    
    // Update UV index if available
    if (data.uvi !== undefined) {
        elements.uvIndex.textContent = data.uvi.toFixed(1);
    }

    // Update hourly forecast
    updateHourlyForecast(data);

    // Update weather background based on weather condition code
    updateWeatherBackground(data.weather[0].id);
}

function updateForecastUI(forecastData) {
    const forecastContainer = document.querySelector('.forecast');
    if (!forecastContainer) return;

    const dailyForecasts = forecastData.list.filter(item => 
        new Date(item.dt * 1000).getHours() === 12
    ).slice(0, 4);

    const forecastDays = forecastContainer.querySelectorAll('.forecast-day');
    forecastDays.forEach((day, index) => {
        if (dailyForecasts[index]) {
            const data = dailyForecasts[index];
            const dayName = index === 0 ? 'Today' : 
                new Date(data.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
            
            day.querySelector('.day-name').textContent = dayName;
            day.querySelector('.forecast-icon').textContent = getWeatherIcon(data.weather[0].icon);
            day.querySelector('.high-temp').textContent = `${Math.round(data.main.temp_max)}°`;
            day.querySelector('.low-temp').textContent = `${Math.round(data.main.temp_min)}°`;
        }
    });
}

function showSearchResults(results) {
    elements.searchResults.innerHTML = '';
    elements.searchResults.style.display = 'block';

    if (results.length === 0) {
        elements.searchResults.innerHTML = `
            <div class="p-3 text-white/70 text-sm">No locations found</div>
        `;
        return;
    }

    results.forEach(result => {
        const div = document.createElement('div');
        div.className = 'search-result-item p-3 hover:bg-white/20 cursor-pointer transition-all duration-200';
        div.textContent = `${result.name}, ${result.country}`;
        div.addEventListener('click', () => {
            state.currentLocation = result;
            updateWeather(result.lat, result.lon);
            elements.searchResults.style.display = 'none';
            elements.locationInput.value = '';
        });
        elements.searchResults.appendChild(div);
    });
}

// Main functions
async function updateWeather(lat, lon) {
    try {
        const [weatherData, forecastData, airQualityData] = await Promise.all([
            fetchWeatherData(lat, lon),
            fetchForecast(lat, lon),
            fetchAirQuality(lat, lon)
        ]);

        updateWeatherUI(weatherData);
        updateForecastUI(forecastData);
        updateAirQuality(airQualityData);
    } catch (error) {
        console.error('Error updating weather:', error);
        elements.location.textContent = 'Error updating weather data';
    }
}

// Event listeners
elements.locationInput.addEventListener('input', async (e) => {
    const query = e.target.value.trim();
    if (query === state.lastSearchQuery) return;
    
    state.lastSearchQuery = query;
    clearTimeout(state.searchTimeout);
    
    if (query.length < 2) {
        elements.searchResults.style.display = 'none';
        return;
    }

    state.searchTimeout = setTimeout(async () => {
        try {
            state.isSearching = true;
            const results = await searchLocations(query);
            showSearchResults(results);
        } catch (error) {
            console.error('Search error:', error);
            elements.searchResults.innerHTML = `
                <div class="p-3 text-red-400 text-sm">Error searching locations</div>
            `;
        } finally {
            state.isSearching = false;
        }
    }, 300);
});

elements.searchButton.addEventListener('click', () => {
    const query = elements.locationInput.value.trim();
    if (query.length >= 2) {
        searchLocations(query).then(showSearchResults).catch(console.error);
    }
});

// Cloud animation
elements.cloudContainer.addEventListener('mouseenter', () => {
    elements.cloudTooltip.style.opacity = '1';
});

elements.cloudContainer.addEventListener('mouseleave', () => {
    elements.cloudTooltip.style.opacity = '0';
});

elements.cloudContainer.addEventListener('click', () => {
    // Add your cloud click animation here
    console.log('Cloud clicked!');
});

// Initialize with default location (New York)
updateWeather(40.7128, -74.0060);

// Update time every minute
setInterval(() => {
    elements.dateTime.textContent = formatDate();
}, 60000);

// Handle clicks outside search results
document.addEventListener('click', (e) => {
    if (!elements.searchResults.contains(e.target) && 
        !elements.locationInput.contains(e.target) && 
        !elements.searchButton.contains(e.target)) {
        elements.searchResults.style.display = 'none';
    }
});

// Add new function to update hourly forecast
function updateHourlyForecast(data) {
    if (!elements.hourlyForecast) return;

    const now = new Date();
    const hourlyData = data.hourly || [];
    
    elements.hourlyForecast.innerHTML = '';
    
    // Show next 12 hours
    for (let i = 0; i < 12; i++) {
        const hourData = hourlyData[i];
        if (!hourData) continue;

        const hour = new Date(hourData.dt * 1000);
        const hourDisplay = i === 0 ? 'Now' : hour.getHours() + ':00';
        
        const hourlyItem = document.createElement('div');
        hourlyItem.className = 'hourly-item bg-white/5 backdrop-blur-sm rounded-xl p-3 min-w-[80px] text-center border border-white/10 shadow-sm';
        hourlyItem.innerHTML = `
            <div class="text-xs opacity-70 mb-1">${hourDisplay}</div>
            <div class="text-xl mb-1">${getWeatherIcon(hourData.weather[0].icon)}</div>
            <div class="text-sm font-medium">${Math.round(hourData.temp)}°</div>
        `;
        
        elements.hourlyForecast.appendChild(hourlyItem);
    }
}

// Add new function to update air quality
function updateAirQuality(data) {
    if (!data || !data.list || !data.list[0]) return;

    const aqi = data.list[0].main.aqi;
    const components = data.list[0].components;

    // Update AQI value and meter
    const aqiText = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'][aqi - 1];
    elements.aqiValue.textContent = aqiText;
    elements.aqiMeter.style.width = `${(aqi / 5) * 100}%`;

    // Update pollutant values
    elements.pm25.textContent = Math.round(components.pm2_5);
    elements.pm10.textContent = Math.round(components.pm10);
    elements.o3.textContent = Math.round(components.o3);
    elements.no2.textContent = Math.round(components.no2);

    // Update meter color based on AQI
    const colors = {
        1: 'from-green-400 to-green-300',
        2: 'from-yellow-400 to-yellow-300',
        3: 'from-orange-400 to-orange-300',
        4: 'from-red-400 to-red-300',
        5: 'from-purple-400 to-purple-300'
    };
    elements.aqiMeter.className = `h-full bg-gradient-to-r ${colors[aqi]}`;
}