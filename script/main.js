document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".link");
  const currentPage = window.location.pathname.split("/").pop().toLowerCase();

  links.forEach(link => {
    const href = link.getAttribute("href");
    if (!href) return;

    const linkPage = href.split("/").pop().toLowerCase();

    if (currentPage === linkPage || (currentPage === "" && linkPage.includes("index"))) {
      const rootStyles = getComputedStyle(document.documentElement);
      const activeColor = rootStyles.getPropertyValue("--active-color").trim();
      const textColor = rootStyles.getPropertyValue("--text-color").trim();
      const textShadow = rootStyles.getPropertyValue("--text-shadow-color").trim();

      link.style.background = activeColor;
      link.style.borderBottom = `2px solid ${textColor}`;
      link.style.color = textColor;
      link.style.textShadow = `0 0 8px ${textShadow}`;
      link.style.transition = "all 0.3s ease";
      link.classList.add("active");
    }
  });
});
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let w, h;
let particles = [];
let mouse = { x: null, y: null, radius: 150 };
let gridLines = [];

function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    init();
}

class Particle {
    constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Mouse interaction
        if (mouse.x && mouse.y) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < mouse.radius) {
                const force = (mouse.radius - dist) / mouse.radius;
                this.x -= dx / dist * force * 2;
                this.y -= dy / dist * force * 2;
            }
        }

        // Wrap around edges
        if (this.x < 0) this.x = w;
        if (this.x > w) this.x = 0;
        if (this.y < 0) this.y = h;
        if (this.y > h) this.y = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(102, 126, 234, ${this.opacity})`;
        ctx.fill();
        
        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(102, 126, 234, 0.5)';
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

class GridLine {
    constructor(isVertical) {
        this.isVertical = isVertical;
        if (isVertical) {
            this.x = Math.random() * w;
            this.speed = (Math.random() - 0.5) * 0.3;
        } else {
            this.y = Math.random() * h;
            this.speed = (Math.random() - 0.5) * 0.3;
        }
        this.opacity = Math.random() * 0.1 + 0.05;
    }

    update() {
        if (this.isVertical) {
            this.x += this.speed;
            if (this.x < 0) this.x = w;
            if (this.x > w) this.x = 0;
        } else {
            this.y += this.speed;
            if (this.y < 0) this.y = h;
            if (this.y > h) this.y = 0;
        }
    }

    draw() {
        ctx.strokeStyle = `rgba(99, 102, 241, ${this.opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        if (this.isVertical) {
            ctx.moveTo(this.x, 0);
            ctx.lineTo(this.x, h);
        } else {
            ctx.moveTo(0, this.y);
            ctx.lineTo(w, this.y);
        }
        ctx.stroke();
    }
}

function init() {
    particles = [];
    gridLines = [];
    
    // Create particles
    const particleCount = Math.min(Math.floor((w * h) / 15000), 150);
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Create grid lines
    for (let i = 0; i < 8; i++) {
        gridLines.push(new GridLine(true));
        gridLines.push(new GridLine(false));
    }
}

function connectParticles() {
    const maxDist = 120;
    
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < maxDist) {
                const opacity = (1 - dist / maxDist) * 0.3;
                ctx.strokeStyle = `rgba(102, 126, 234, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function drawRadialGradient() {
    const gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) / 2);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.03)');
    gradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.01)');
    gradient.addColorStop(1, 'rgba(10, 10, 15, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
}

function drawScanLine() {
    const time = Date.now() * 0.001;
    const y = (Math.sin(time * 0.5) + 1) * h / 2;
    
    const gradient = ctx.createLinearGradient(0, y - 50, 0, y + 50);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0)');
    gradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.1)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, y - 50, w, 100);
}

function animate() {
    // Clear with fade effect
    ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
    ctx.fillRect(0, 0, w, h);

    // Draw effects
    drawRadialGradient();
    drawScanLine();

    // Update and draw grid
    gridLines.forEach(line => {
        line.update();
        line.draw();
    });

    // Update and draw particles
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    // Connect particles
    connectParticles();

    requestAnimationFrame(animate);
}

// Mouse tracking
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

// Touch support
window.addEventListener('touchmove', (e) => {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
});

window.addEventListener('touchend', () => {
    mouse.x = null;
    mouse.y = null;
});

window.addEventListener('resize', resize);

resize();
animate();



var mainImage = document.getElementById("mainImage")
var colorBlack = document.getElementById("black")
var colorBlue = document.getElementById("blue")
var colorRed = document.getElementById("red")
var colorGreen = document.getElementById("gray")
colorBlack.onclick = function(){
    mainImage.src = "assets/image_2025-11-10_20-03-29.png"
}
colorBlue.onclick = function(){
    mainImage.src = "assets/blue.png"
}
colorRed.onclick = function(){
    mainImage.src = "assets/pink.png"
}
colorGreen.onclick = function(){
    mainImage.src = "assets/gray.png"
}
// Data from the table
const tableData = [
    { area: 10, duration: 157 },      // 2 min 37 s
    { area: 16, duration: 226 },      // 3 min 46 s
    { area: 25, duration: 368 },      // 6 min 8 s
    { area: 50, duration: 1063 }      // 17 min 43 s
];

// Extract areas and durations
const areas = tableData.map(item => item.area);
const durations = tableData.map(item => item.duration);

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Get canvas element
    const ctx = document.getElementById('myChart').getContext('2d');

    // Create the chart
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: areas,
            datasets: [{
                label: 'Duration (seconds)',
                data: durations,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 8,
                pointBackgroundColor: '#667eea',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        font: {
                            size: 14
                        },
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    callbacks: {
                        label: function(context) {
                            const seconds = context.parsed.y;
                            const minutes = Math.floor(seconds / 60);
                            const secs = seconds % 60;
                            return `Duration: ${minutes} min ${secs} s`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Area (m²)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        font: { size: 12 }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Duration (seconds)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        font: { size: 12 }
                    },
                    beginAtZero: true
                }
            }
        }
    });

    // Mobile touch support
    const canvas = document.getElementById('myChart');
    
    canvas.addEventListener('touchstart', function(e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const y = e.touches[0].clientY - rect.top;
        
        const canvasPosition = Chart.helpers.getRelativePosition(e, myChart);
        const dataX = myChart.scales.x.getValueForPixel(canvasPosition.x);
        const dataY = myChart.scales.y.getValueForPixel(canvasPosition.y);
        
        // Trigger tooltip manually
        myChart.tooltip.setActiveElements([{datasetIndex: 0, index: Math.round(dataX / 10)}], {x: x, y: y});
        myChart.draw();
    }, false);

    canvas.addEventListener('touchend', function() {
        myChart.tooltip.setActiveElements([], {x: 0, y: 0});
        myChart.draw();
    }, false);
});

// Calculator Logic
// Calculate linear interpolation for any area value
function calculateDuration(area) {
    if (area <= 10) {
        return tableData[0].duration;
    }
    if (area >= 50) {
        // Linear extrapolation for values above 50
        const slope = (tableData[3].duration - tableData[2].duration) / (tableData[3].area - tableData[2].area);
        return tableData[2].duration + slope * (area - tableData[2].area);
    }
    
    // Find the two points to interpolate between
    for (let i = 0; i < tableData.length - 1; i++) {
        if (area >= tableData[i].area && area <= tableData[i + 1].area) {
            const x1 = tableData[i].area;
            const y1 = tableData[i].duration;
            const x2 = tableData[i + 1].area;
            const y2 = tableData[i + 1].duration;
            
            // Linear interpolation formula
            const duration = y1 + ((area - x1) / (x2 - x1)) * (y2 - y1);
            return duration;
        }
    }
    return 0;
}

// Convert seconds to minutes and seconds
function formatDuration(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.round(totalSeconds % 60);
    return `${minutes} min ${seconds} s`;
}

// Initialize calculator
document.addEventListener('DOMContentLoaded', function() {
    const areaInput = document.getElementById('areaInput');
    const calcButton = document.getElementById('calcButton');
    const calcResult = document.getElementById('calcResult');
    const resultArea = document.getElementById('resultArea');
    const resultDuration = document.getElementById('resultDuration');
    
    // Calculate on button click
    calcButton.addEventListener('click', function() {
        const area = parseFloat(areaInput.value);
        
        if (!area || area <= 0) {
            alert('Please enter a valid area value');
            return;
        }
        
        const duration = calculateDuration(area);
        const formattedDuration = formatDuration(duration);
        
        resultArea.textContent = `${area} m²`;
        resultDuration.textContent = formattedDuration;
        calcResult.classList.remove('hidden');
    });
    
    // Calculate on Enter key press
    areaInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calcButton.click();
        }
    });
    
    // Real-time calculation on input change (optional)
    areaInput.addEventListener('input', function() {
        if (this.value && parseFloat(this.value) > 0) {
            const area = parseFloat(this.value);
            const duration = calculateDuration(area);
            const formattedDuration = formatDuration(duration);
            
            resultArea.textContent = `${area} m²`;
            resultDuration.textContent = formattedDuration;
            calcResult.classList.remove('hidden');
        }
    });
});
