(() => {
    // --- Helper Functions ---
    function formatTime(date) {
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const mm = minutes.toString().padStart(2, '0');
      return `${hours}:${mm} ${ampm}`;
    }
  
    function getMockNoiseData() {
      const data = {};
      for (let i = 1; i <= 50; i++) {
        data[`room${i}`] = Math.random() * 100;
      }
      return data;
    }
  
    function getHeatColor(value) {
      if (value > 66)    return '#F44336';  // loud → red
      if (value > 33)    return '#FFEB3B';  // moderate → yellow
      return '#4CAF50';                    // quiet → green
    }
  
    // --- Core Logic ---
    function updateNoiseLevels(data) {
      const svgEl = document.querySelector('#floor-canvas svg');
      if (!svgEl) return;
  
      Object.entries(data).forEach(([roomId, value]) => {
        const room = svgEl.getElementById(roomId);
        if (room) room.setAttribute('fill', getHeatColor(value));
      });
  
      document.getElementById('lastUpdated').textContent =
        `Last updated: ${formatTime(new Date())}`;
    }
  
    function switchFloor(floorName) {
      const titleEl = document.getElementById('floor-title');
      const container = document.getElementById('floor-canvas');
  
      titleEl.textContent = floorName.toUpperCase().replace(/_/g, '.');
      container.innerHTML = '<p>Loading floor plan…</p>';
  
      fetch(`./assets/${floorName}.svg`)
      .then(res => {
        if (!res.ok) throw new Error('SVG not found');
        return res.text();
      })
      .then(svgText => {
        // Inject raw SVG markup so we can edit its internal shapes
        container.innerHTML = svgText;
        const svg = container.querySelector('svg');
        if (!svg) return;
  
        // Remove any fixed dimensions and make responsive
        svg.removeAttribute('width');
        svg.removeAttribute('height');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  
        // Remove the black background rectangle if present
        // We assume the first <rect> is the full-canvas background
        const bgRect = svg.querySelector('rect');
        if (bgRect) {
          bgRect.setAttribute('fill', 'none');
        }
      })
      .catch(err => {
        container.innerHTML =
          `<p style="color:red; padding:1rem;">Error loading floor: ${err.message}</p>`;
        console.error(err);
      });
  
    }
  
    // --- DOM Ready ---
    document.addEventListener('DOMContentLoaded', () => {
      // Nav links
      document.getElementById('navHistory').addEventListener('click', e => {
        e.preventDefault();
        alert('Navigate to History view');
      });
      document.getElementById('navSettings').addEventListener('click', e => {
        e.preventDefault();
        alert('Navigate to Settings view');
      });
  
      // Floor navigation buttons (navigate to different HTML files)
      document.querySelectorAll('#button-container button')
      .forEach(btn => {
        btn.addEventListener('click', () => {
          const label = btn.textContent.trim(); // e.g. "TQ4.2"
          const fileName = `${label}-floor.html`; // e.g. "TQ4.2-floor.html"
          window.location.href = fileName; // Navigate to correct file
        });
      });
  
      // Initial load + polling
      const file = window.location.pathname.split('/').pop();           // "TQ4.2-floor.html"
      const base = file.replace(/-floor\.html$/, '');                   // "TQ4.2"
      const floorName = 'floor_' + base.replace(/\./g, '_').toLowerCase(); // "floor_tq4_2"
      switchFloor(floorName);
  
      updateNoiseLevels(getMockNoiseData());
      setInterval(() => updateNoiseLevels(getMockNoiseData()), 3000);
    });
  })();
  
  /*TQ4.2*/
  
  const topRow = document.getElementById('top-row');
  const middleRow = document.getElementById('middle-row');
  const bottomRow = document.getElementById('bottom-row');
  
  function getRandomNoiseColor() {
  const levels = ['green', 'yellow', 'red'];
  return levels[Math.floor(Math.random() * levels.length)];
  }
  
  function createRoom(x, y, id) {
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  group.setAttribute('id', `room-${id}`);
  group.setAttribute('class', 'room-group');
  
  const mainCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  mainCircle.setAttribute('cx', x);
  mainCircle.setAttribute('cy', y);
  mainCircle.setAttribute('r', 25);
  mainCircle.setAttribute('class', 'room-circle');
  mainCircle.setAttribute('fill', getRandomNoiseColor());
  
  const pulse = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  pulse.setAttribute('cx', x);
  pulse.setAttribute('cy', y);
  pulse.setAttribute('r', 40);
  pulse.setAttribute('class', 'pulse-circle');
  pulse.setAttribute('fill', mainCircle.getAttribute('fill'));
  
  group.appendChild(pulse);
  group.appendChild(mainCircle);
  return group;
  }
  
  function renderRooms() {
  let x = 40;
  for (let i = 0; i < 16; i++) {
    topRow.appendChild(createRoom(x, 0, i));
    x += 110;
  }
  
  x = 150;
  for (let i = 20; i < 30; i++) {
    middleRow.appendChild(createRoom(x, 0, i));
    x += 210;
  }
  
  x = 40;
  for (let i = 30; i < 46; i++) {
    bottomRow.appendChild(createRoom(x, 0, i));
    x += 110;
  }
  }
  
  function updateNoiseLevels() {
  for (let i = 0; i < 50; i++) {
    const group = document.getElementById(`room-${i}`);
    if (group) {
      const mainCircle = group.querySelector('.room-circle');
      const pulse = group.querySelector('.pulse-circle');
      const newColor = getRandomNoiseColor();
  
      // animate fill transition
      mainCircle.style.transition = 'fill 3s';
      pulse.style.transition = 'fill 3s';
  
      mainCircle.setAttribute('fill', newColor);
      pulse.setAttribute('fill', newColor);
  
      // retrigger animation
      pulse.classList.remove('animate');
      void pulse.offsetWidth; // trigger reflow
      pulse.classList.add('animate');
    }
  }
  }
  
  renderRooms();
  setInterval(updateNoiseLevels, 2000); // update every 2 seconds
  
  
  
  function setRowPosition(rowId, x, y) {
    const row = document.getElementById(rowId);
    if (row) {
      row.setAttribute('transform', `translate(${x}, ${y})`);
    }
  }
  setRowPosition('top-row', 450, 100);
  setRowPosition('middle-row', 150, 320);
  setRowPosition('bottom-row', 430, 550);
  
  