    // Show popup when the page loads
	window.onload = function() {
		document.getElementById('popupOverlay').style.display = 'block';
		document.getElementById('popupMessage').style.display = 'block';
	};

	// Close popup function
	function closePopup() {
		document.getElementById('popupOverlay').style.display = 'none';
		document.getElementById('popupMessage').style.display = 'none';
	}
document.addEventListener("mousemove", (event) => {
	const cube = document.querySelector(".cube");
	const { innerWidth: width } = window;
	const mouseX = event.clientX;
	const maxAngle = 40;
	const rotationY = Math.max(
		-maxAngle,
		Math.min(maxAngle, ((mouseX / width) * 2 - 1) * maxAngle)
	);
	cube.style.transform = `rotateY(${rotationY}deg)`;
});

const rangeSlider = document.getElementById("zRange");
const zValueText = document.getElementById("zValue");
const body = document.querySelector("body");

// Start at 31000px
let zTranslation = 22000;

// Update slider if present
if (rangeSlider) {
	rangeSlider.value = zTranslation;
}

function updateCubeZ() {
	const numericValue = zTranslation * 12745 + 10000000;
	const formattedValue = new Intl.NumberFormat("en-US").format(numericValue);
	zValueText.textContent = `-${formattedValue} Years`;

	if (numericValue < 26000000 || numericValue > 240000000) {
		zValueText.classList.remove("visible");
		zValueText.classList.add("hidden");
	} else {
		zValueText.classList.remove("hidden");
		zValueText.classList.add("visible");
	}
	body.style.setProperty("--variable-length", `${zTranslation}px`);
}

window.addEventListener("wheel", (e) => {
	zTranslation += e.deltaY * 5;
	zTranslation = Math.max(0, Math.min(50500, zTranslation));
	updateCubeZ();
	isRotating = false;
});

updateCubeZ();

let isRotating = true;
let rotationYValue = 0;

function rotateCube() {
	if (isRotating) {
		const time = Date.now() * 0.001;
		rotationYValue = Math.sin(time * 0.5) * 5;
		const cube = document.querySelector(".cube");
		cube.style.transform = `rotateY(${rotationYValue}deg)`;
		requestAnimationFrame(rotateCube);
	}
}

rotateCube();

document.addEventListener("DOMContentLoaded", () => {
	const frontMain = document.querySelector(".front.main");

	setTimeout(() => {
		frontMain.classList.add("hidden");
	}, 100);
});

const bottom = document.querySelector(".bottom");
const length = 55000;
const tileSize = 800;
const numTiles = Math.ceil(length / tileSize);

for (let i = 0; i < numTiles; i++) {
	const tile = document.createElement("div");
	tile.className = "tile";
	tile.style.top = `${i * tileSize}px`;
	bottom.appendChild(tile);
}
document.getElementById('toggleNavbar').addEventListener('click', function() {
    document.getElementById('sliderNavbar').classList.toggle('active');
});

document.getElementById('closeNavbar').addEventListener('click', function() {
    document.getElementById('sliderNavbar').classList.remove('active');
});

// Close navbar if user clicks outside
document.addEventListener('click', function(event) {
    const navbar = document.getElementById('sliderNavbar');
    const toggle = document.getElementById('toggleNavbar');
    if (!navbar.contains(event.target) && !toggle.contains(event.target)) {
        navbar.classList.remove('active');
    }
});
const sliderNavbar = document.getElementById('sliderNavbar');
const closeButton = document.getElementById('closeNavbar');
const openButton = document.getElementById('openNavbar');

openButton.addEventListener('click', function() {
    sliderNavbar.classList.add('open');
});

closeButton.addEventListener('click', function() {
    sliderNavbar.classList.remove('open');
});
const image = document.querySelector('.newyork_public');

document.addEventListener('click', (e) => {
  const rect = image.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // Check if the image is within 0–500px from the bottom of the screen (you’re approaching it)
  const distanceFromView = rect.top;

  if (distanceFromView > 0 && distanceFromView < 500) {
	image.classList.add('highlight');
	image.click();
	setTimeout(() => image.classList.remove('highlight'), 400);
  }
});

image.addEventListener('click', () => {
  alert("🎯 You clicked the image from a distance (forward)!");
});
