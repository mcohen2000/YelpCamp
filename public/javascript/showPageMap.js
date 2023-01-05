const map = L.map("map").setView([40.74844, -95.984559], 4);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

map.setView(camp.coordinates, 10);
const marker = L.marker(camp.coordinates).addTo(map);
marker
  .bindPopup(`<b>${camp.title}</b><br>${camp.location}`)
  .openPopup();

