const txtTitle = document.getElementById("txtTitle");
const ckbPauseScreen = document.getElementById("ckbPauseScreen");
const txtEffectWord = document.getElementById("txtEffectWord");
const txtEffectList = document.getElementById("txtEffectList");
const btnApply = document.getElementById("btn-apply");

const startScreen = document.getElementById("start-screen");
const pauseScreen = document.getElementById("pause-screen");

let audioContextStarted = false, isStart = false;

btnApply.onclick = apply;

function apply() {
	document.getElementById("settings").style.display = "none";
	startAudioContextAndRecognition();
	createStartScreen();
}

let song, fft, amplitude
// let mic
let particles = []
let angle = 0

function preload() {
	song = loadSound("audio/約束の手紙.mp3")
}

function setup() {
	createCanvas(windowWidth, windowHeight)
	angleMode(DEGREES)
	// mic = new p5.AudioIn();
	// mic.start();
	fft = new p5.FFT()
	amplitude = new p5.Amplitude();
	// fft.setInput(mic);
}

function draw() {
	background(0);

	// small circle
	let level = amplitude.getLevel();
	let r1 = map(level, 0, 1, 0, 400);
	fill(137, 207, 240, random(10, 255))
	ellipse(width / 2, height / 2, r1, r1);

	stroke(255)
	strokeWeight(3)
	noFill()

	translate(width / 2, height / 2)
	fft.analyze()
	// amp = mic.getLevel()
	amp = fft.getEnergy(20, 200)
	let wave = fft.waveform()

	// wave path
	for (let t = -1; t <= 1; t += 2) {
		beginShape()
		for (let i = 0; i <= 180; i += 0.5) {
			let index = floor(map(i, 0, 180, 0, wave.length - 1))
			let r = map(wave[index], -1, 1, 100, 300)
			let x = r * sin(i) * t
			let y = r * cos(i)
			vertex(x, y)
		}
		endShape()
	}

	angle += 0.1;
	rotate(angle);
	// particle
	let p = new Particle()
	particles.push(p)
	for (let i = particles.length - 1; i >= 0; i--) {
		if (!particles[i].edges()) {
			// particles[i].update(amp > 0.1);
			particles[i].update(amp > 200);
			particles[i].show();
		} else {
			particles.splice(i, 1)
		}
	}

}

function mouseClicked() {
	if (isStart) {
		if (song.isPlaying()) {
			song.pause()
			noLoop()
		} else {
			song.play()
			loop()
		}
	}

}

class Particle {
	constructor() {
		this.pos = p5.Vector.random2D().mult(200)
		this.vel = createVector(0, 0)
		this.acc = this.pos.copy().mult(random(0.0001, 0.00001))

		this.w = random(1, 5)
		this.color = [199, 236, 254, random(25, 255)]
	}
	update(cond) {
		this.vel.add(this.acc)
		this.pos.add(this.vel)
		if (cond) {
			this.pos.add(this.vel)
			this.pos.add(this.vel)
			this.pos.add(this.vel)
		}
	}
	edges() {
		if (this.pos.x < -width / 2 || this.pos.x > width / 2 ||
			this.pos.y < -height / 2 || this.pos.y > height / 2
		) {
			return true
		} else {
			return false
		}
	}
	show() {
		noStroke()
		fill(this.color)
		ellipse(this.pos.x, this.pos.y, this.w)
	}
}

function startAudioContextAndRecognition() {
	if (!audioContextStarted) {
		getAudioContext().resume().then(() => {
			console.log("AudioContextが開始されました。");
			audioContextStarted = true;
			startVoiceRecognition();
		}).catch(error => {
			console.error("AudioContextの再開に失敗しました:", error);
		});
	}
}

function startVoiceRecognition() {
	if (!("webkitSpeechRecognition" in window)) {
		alert("Web Speech APIはこのブラウザでサポートされていません。");
		return;
	}

	const recognition = new webkitSpeechRecognition();
	recognition.lang = "ja-JP";
	recognition.interimResults = false;
	recognition.continuous = true;

	recognition.onresult = (event) => {
		const transcript = event.results[event.results.length - 1][0].transcript.trim();

		if (transcript.includes("スタート")) {
			isStart = true
			startScreen.style.display = "none";
			pauseScreen.style.display = "none"
			setTimeout(() => {
				if (!song.isPlaying()) {
					song.play()
				}
			}, 200);
		}

		if (transcript.includes("休憩") && ckbPauseScreen.checked) {
			isStart = false
			pauseScreen.style.display = "flex"
			song.pause()
		}
	};

	recognition.onerror = (event) => {
		console.error("エラー: ", event.error);
	};

	recognition.start();
}

function createStartScreen() {
	const titleH1 = document.createElement("h1");
	titleH1.innerText = txtTitle.value;
	startScreen.prepend(titleH1);
}