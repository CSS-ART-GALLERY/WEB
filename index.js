class LeafletMap {
    constructor(containerId, center, zoom) {
        this.map = L.map(containerId).setView(center, zoom);
        this.initTileLayer();
        this.handleResize();  // Ensure map resizes after it's initialized
    }

    initTileLayer() {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
    }

    addMarker(lat, lng, message) {
        const marker = L.marker([lat, lng]).addTo(this.map);
        marker.bindPopup(message);
    }

    loadMarkersFromJson(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                data.forEach(marker => {
                    this.addMarker(marker.latitude, marker.longitude, marker.message);
                });
            })
            .catch(error => console.error('Error loading markers:', error));
    }

    // Function to handle resizing of the map
    handleResize() {
        // Use the load event and additional checks to ensure the container is ready
        window.addEventListener('load', () => {
            // Force the map to recalculate size after all content (including images, etc.) are loaded
            setTimeout(() => {
                this.map.invalidateSize();  // Ensure Leaflet properly recalculates the map's size
            }, 1000); // Increased delay to handle complex layouts
        });

        // Recalculate size on window resize
        window.addEventListener('resize', () => {
            this.map.invalidateSize();
        });
    }
}

// Initialize the map
const myMap = new LeafletMap('map', [8.360004, 124.868419], 14);

// Load markers from JSON
myMap.loadMarkersFromJson('index.json');
