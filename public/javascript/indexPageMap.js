const map = L.map("map").setView([40.74844, -95.984559], 4);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

for (let campground of allCampgrounds) {
  if (campground.coordinates.length > 0) {
    const marker = L.marker(campground.coordinates).addTo(map);
  marker
    .bindPopup(`<b>${campground.title}</b><br>${campground.location}`)
  }
}
