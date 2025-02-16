const btnStart = document.getElementById('btn-start');
const btnPlay = document.getElementById('btn-play');
const btnLowKeyPlay = document.getElementById('btn-low-key-play');
const btnReset = document.getElementById('btn-reset');
btnPlay.onclick = start;
btnLowKeyPlay.onclick = start;

const canvas = document.getElementById('pitch-canvas');
canvas.width = window.innerHeight;
canvas.height = window.innerWidth;
let canvasCtx = canvas.getContext('2d', { willReadFrequently: true });

const startLine = document.getElementById('start-line');
const lyricsElement = document.getElementById('lyrics');
const rangeArea = document.getElementById('range-detected');
const waveLines = document.getElementsByClassName("wave-line");
const findPitchArea = document.getElementById("find-pitch");

const sparkleAudio = new Audio('./audio/きらきら輝く.mp3');

let song = [
	{ note: 'C4', duration: 0.7 },
	{ note: 'C4', duration: 0.7 },
	{ note: 'G4', duration: 0.7 },
	{ note: 'G4', duration: 0.7 },
	{ note: 'A4', duration: 0.7 },
	{ note: 'A4', duration: 0.7 },
	{ note: 'G4', duration: 1.4 },
	{ note: 'F4', duration: 0.7 },
	{ note: 'F4', duration: 0.7 },
	{ note: 'E4', duration: 0.7 },
	{ note: 'E4', duration: 0.7 },
	{ note: 'D4', duration: 0.7 },
	{ note: 'D4', duration: 0.7 },
	{ note: 'C4', duration: 1.4 },
	{ note: 'G4', duration: 0.7 },
	{ note: 'G4', duration: 0.7 },
	{ note: 'F4', duration: 0.7 },
	{ note: 'F4', duration: 0.7 },
	{ note: 'E4', duration: 0.7 },
	{ note: 'E4', duration: 0.7 },
	{ note: 'D4', duration: 1.4 },
	{ note: 'G4', duration: 0.7 },
	{ note: 'G4', duration: 0.7 },
	{ note: 'F4', duration: 0.7 },
	{ note: 'F4', duration: 0.7 },
	{ note: 'E4', duration: 0.7 },
	{ note: 'E4', duration: 0.7 },
	{ note: 'D4', duration: 1.4 },
	{ note: 'C4', duration: 0.7 },
	{ note: 'C4', duration: 0.7 },
	{ note: 'G4', duration: 0.7 },
	{ note: 'G4', duration: 0.7 },
	{ note: 'A4', duration: 0.7 },
	{ note: 'A4', duration: 0.7 },
	{ note: 'G4', duration: 1.4 },
	{ note: 'F4', duration: 0.7 },
	{ note: 'F4', duration: 0.7 },
	{ note: 'E4', duration: 0.7 },
	{ note: 'E4', duration: 0.7 },
	{ note: 'D4', duration: 0.7 },
	{ note: 'D4', duration: 0.7 },
	{ note: 'C4', duration: 1.4 }
];

let songLowKeys = [
	{ note: 'G3', duration: 0.7 },
	{ note: 'G3', duration: 0.7 },
	{ note: 'D4', duration: 0.7 },
	{ note: 'D4', duration: 0.7 },
	{ note: 'E4', duration: 0.7 },
	{ note: 'E4', duration: 0.7 },
	{ note: 'D4', duration: 1.4 },
	{ note: 'C4', duration: 0.7 },
	{ note: 'C4', duration: 0.7 },
	{ note: 'B3', duration: 0.7 },
	{ note: 'B3', duration: 0.7 },
	{ note: 'A3', duration: 0.7 },
	{ note: 'A3', duration: 0.7 },
	{ note: 'G3', duration: 1.4 },
	{ note: 'D4', duration: 0.7 },
	{ note: 'D4', duration: 0.7 },
	{ note: 'C4', duration: 0.7 },
	{ note: 'C4', duration: 0.7 },
	{ note: 'B3', duration: 0.7 },
	{ note: 'B3', duration: 0.7 },
	{ note: 'A3', duration: 1.4 },
	{ note: 'D4', duration: 0.7 },
	{ note: 'D4', duration: 0.7 },
	{ note: 'C4', duration: 0.7 },
	{ note: 'C4', duration: 0.7 },
	{ note: 'B3', duration: 0.7 },
	{ note: 'B3', duration: 0.7 },
	{ note: 'A3', duration: 1.4 },
	{ note: 'G3', duration: 0.7 },
	{ note: 'G3', duration: 0.7 },
	{ note: 'D4', duration: 0.7 },
	{ note: 'D4', duration: 0.7 },
	{ note: 'E4', duration: 0.7 },
	{ note: 'E4', duration: 0.7 },
	{ note: 'D4', duration: 1.4 },
	{ note: 'C4', duration: 0.7 },
	{ note: 'C4', duration: 0.7 },
	{ note: 'B3', duration: 0.7 },
	{ note: 'B3', duration: 0.7 },
	{ note: 'A3', duration: 0.7 },
	{ note: 'A3', duration: 0.7 },
	{ note: 'G3', duration: 1.4 }
];

let keys = [
	{ note: 'C4', freq: 261.63 },
	{ note: 'D4', freq: 293.66 },
	{ note: 'E4', freq: 329.63 },
	{ note: 'F4', freq: 349.23 },
	{ note: 'G4', freq: 392.00 },
	{ note: 'A4', freq: 440.00 },
	{ note: 'B4', freq: 493.88 },
	{ note: 'C5', freq: 523.25 },
];

let lowKeys = [
	{ note: 'G3', freq: 196.00 },
	{ note: 'A3', freq: 220.00 },
	{ note: 'B3', freq: 246.94 },
	{ note: 'C4', freq: 261.63 },
	{ note: 'D4', freq: 293.66 },
	{ note: 'E4', freq: 329.63 },
	{ note: 'F4', freq: 349.23 },
	{ note: 'G4', freq: 392.00 }
];

let songLyrics = [
	{ lyrics: '', duration: 5.6 },
	{ lyrics: '♪ Twinkle Twinkle, Little Star', duration: 6.3 },
	{ lyrics: '♪ How I wonder what you are', duration: 5.6 },
	{ lyrics: '♪ Up above the world so high', duration: 5.6 },
	{ lyrics: '♪ Like a diamond in the sky', duration: 5.6 },
	{ lyrics: '♪ Twinkle Twinkle Little Star', duration: 5.6 },
	{ lyrics: '♪ How I wonder what you are!', duration: 7.0 },
	{ lyrics: '', duration: 0.7 },
];

function start() {
	checkKeys(this.dataset.song)
	navigator.mediaDevices
		.getUserMedia({ audio: true })
		.then((stream) => {
			main(stream);
			playSong();
			displayLyrics();
		})
		.catch(console.log);
}

function checkKeys(songKey) {
	if (songKey == "low") {
		keys = lowKeys;
		song = songLowKeys;
	}
}

function playMetronome(audioCtx, currentTime, startVolume) {
	const oscillator = audioCtx.createOscillator();
	const gainNode = audioCtx.createGain();

	oscillator.type = 'square';
	oscillator.frequency.value = 800;

	gainNode.gain.setValueAtTime(startVolume, currentTime);
	gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.1);

	oscillator.connect(gainNode);
	gainNode.connect(audioCtx.destination);

	oscillator.start(currentTime);
	oscillator.stop(currentTime + 0.1);
}

function playSong() {
	const audioCtx = new window.AudioContext();
	let currentTime = audioCtx.currentTime;

	for (let i = 0; i < 10; i++) {
		playMetronome(audioCtx, currentTime, i < 6 ? 0 : 0.6);
		currentTime += 0.7; // 0.7秒ごとにメトロノーム音を再生
	}

	song.forEach(note => {
		const key = keys.find(k => k.note === note.note);

		const oscillator = audioCtx.createOscillator();
		const gainNode = audioCtx.createGain();
		oscillator.type = 'sine';
		oscillator.frequency.value = key.freq;

		gainNode.gain.setValueAtTime(0.5, currentTime);

		oscillator.connect(gainNode);
		gainNode.connect(audioCtx.destination);

		oscillator.start(currentTime);
		gainNode.gain.setValueAtTime(1, currentTime);
		gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + note.duration);

		oscillator.stop(currentTime + note.duration);
		currentTime += note.duration;
	});

	const songEndTime = currentTime;
	setTimeout(() => {
    sparkleInterval = setInterval(addStar, 50);
		sparkleAudio.play();
		sparkleAudio.addEventListener('ended', function() {
      clearInterval(sparkleInterval);
    });
  }, songEndTime * 1000 + 1000);
}

function main(stream) {

	var audioCtx = new window.AudioContext();
	var realAudioInput = audioCtx.createMediaStreamSource(stream);
	var analyser = audioCtx.createAnalyser();
	realAudioInput.connect(analyser);
	analyser.fftSize = 2048;

	var bufferLength = analyser.frequencyBinCount;
	var frequencyData = new Uint8Array(bufferLength);

	findPitchArea.style.display = "none";
	btnPlay.style.display = "none";
	btnLowKeyPlay.style.display = "none";
	btnReset.style.display = "inline-block";
	canvas.style.display = "block";

	function findNearestKey(frequency) {
		const tolerance = 14; // 許容範囲（Hz）
		let nearestKey = null;
		let minDiff = Infinity;

		for (let key of keys) {
			let diff = Math.abs(frequency - key.freq);
			if (diff < minDiff && diff <= tolerance) {
				minDiff = diff;
				nearestKey = key;
			}
		}
		return nearestKey;
	}

	function getFrequencyFromFFT(data, sampleRate) {
		let maxVal = -Infinity;
		let maxIndex = -1;

		for (let i = 1; i < data.length / 2; i++) {
			if (data[i] > maxVal) {
				maxVal = data[i];
				maxIndex = i;
			}
		}
		let frequency = (maxIndex * sampleRate) / analyser.fftSize;
		return frequency;
	}

	let isStart = false;
	let startLineDistance = 0;

	function draw() {
		analyser.getByteFrequencyData(frequencyData);

		let frequency = getFrequencyFromFFT(frequencyData, audioCtx.sampleRate);
		let nearestKey = findNearestKey(frequency);

		drawPiano(nearestKey);
		shiftSpectrogram();

		// 現在の音程を描画
		if (nearestKey && isStart) {
			drawSpectrogramKey(nearestKey, "#4CAF50");
		}
		// 曲のキーを描画
		updateSongSpectrogram();
		requestAnimationFrame(draw);
	}

	let lastFrameTime = performance.now();
	let totalShiftedPixels = 0;
	let pixelsPerSecond = 0;

	function shiftSpectrogram() {
		const spectrogramHeight = canvas.height;
		const imageData = canvasCtx.getImageData(0, 0, canvas.width, spectrogramHeight);

		canvasCtx.putImageData(imageData, 0, -1);
		canvasCtx.clearRect(0, spectrogramHeight - 1, canvas.width, 1);

		totalShiftedPixels += 1; // 1フレームで1ピクセル移動
		const currentFrameTime = performance.now();
		const deltaTime = (currentFrameTime - lastFrameTime) / 700; // 秒に変換

		if (deltaTime >= 1 && !isStart) {
			pixelsPerSecond = totalShiftedPixels / deltaTime;

			isStart = true;
			startLine.style.opacity = "1";
			startLine.style.right = pixelsPerSecond.toFixed(2) * 10 + "px";

			startLineDistance = pixelsPerSecond.toFixed(2) * 10;

			totalShiftedPixels = 0; // リセット
			lastFrameTime = currentFrameTime; // 時間をリセット
		}
	}

	function drawSpectrogramKey(activeKey, color) {
		const spectrogramHeight = canvas.height;
		const voiceStartHeight = canvas.height - startLineDistance;
		const whiteKeyWidth = Math.floor(canvas.width / keys.length);
		const keyIndex = keys.findIndex(key => key.note === activeKey.note);

		if (keyIndex >= 0) {
			const xFrom = whiteKeyWidth * keyIndex;
			const xTo = whiteKeyWidth * (keyIndex + 1);

			for (let x = xFrom; x < xTo; x++) {
				canvasCtx.fillStyle = color;
				canvasCtx.fillRect(x, (color == "#4CAF50" ? voiceStartHeight : spectrogramHeight) - 1, 1, 1);
			}
		}
	}

	let currentNoteIndex = 0;
	let currentNoteStartTime = audioCtx.currentTime;

	function updateSongSpectrogram() {
		const currentTime = audioCtx.currentTime;

		if (currentNoteIndex < song.length) {
			const note = song[currentNoteIndex];
			const noteDuration = note.duration;

			if (currentTime - currentNoteStartTime >= noteDuration) {
				currentNoteIndex++;
				currentNoteStartTime += noteDuration;
			}
		}

		if (currentNoteIndex < song.length) {
			const note = song[currentNoteIndex];
			const key = keys.find(k => k.note === note.note);
			if (key) {
				drawSpectrogramKey(key, "rgba(12, 12, 12, 0.3)");
			}
		}
	}


	function drawPiano(activeKey) {
		let keyHeight = canvas.height / 4;
		let whiteKeyWidth = canvas.width / keys.length;
		let keyTop = 0;

		canvasCtx.clearRect(0, keyTop, canvas.width, keyHeight);

		canvasCtx.textAlign = "center";
		canvasCtx.textBaseline = "middle";
		canvasCtx.font = "bold 20px 'M PLUS Rounded 1c'";

		let alpha = 0.1;
		canvasCtx.fillStyle = `rgba(249, 240, 122, ${alpha})`;
		for (let i = 0; i < keys.length; i++) {
			if (activeKey && activeKey.note === keys[i].note) {
				canvasCtx.fillStyle = '#4CAF50';
			} else {
				canvasCtx.fillStyle = `rgba(249, 240, 122, ${alpha})`;
			}

			const rectX = whiteKeyWidth * i;
			const rectY = keyTop;

			canvasCtx.fillRect(
				rectX,
				rectY,
				whiteKeyWidth - 1,
				keyHeight
			);

			canvasCtx.fillStyle = "#0c0c0c";
			canvasCtx.fillText(
				keys[i].note,
				rectX + whiteKeyWidth / 2,
				rectY + keyHeight / 2
			);
			alpha += 0.1;
		}

		var blackKeyWidth = whiteKeyWidth / 2;
		var leftOffset = whiteKeyWidth * 0.75;
		keyHeight = keyHeight * 0.25;

		canvasCtx.fillStyle = '#22282f';
		for (let i = 0; i < keys.length; i++) {
			if (keys[0].note !== "C4") {
				canvasCtx.fillRect(
					0,
					keyTop,
					blackKeyWidth / 2,
					keyHeight
				);
			}
			if (keys[i].note !== "B3" && keys[i].note !== "E4" && keys[i].note !== "B4") {
				canvasCtx.fillRect(
					whiteKeyWidth * i + leftOffset,
					keyTop,
					blackKeyWidth,
					keyHeight
				);
			}
		}

		canvasCtx.stroke();
	}
	draw();
}

function displayLyrics() {
	let currentTime = 0;

	songLyrics.forEach(line => {
		setTimeout(() => {
			lyricsElement.innerText = line.lyrics;
		}, currentTime * 1000);

		currentTime += line.duration;
	});
}

// Detecting Pitch
const pitchDataA3 = [];
const pitchDataA4 = [];
const sampleNotes = [
	{ name: "A3", frequency: 220.00 },
	{ name: "A4", frequency: 440.00 }
];
let audioContext;
let analyser;
let microphone;
let dataArray;
let bufferLength;
let currentPhase = "A3";
let timeoutId;

btnStart.addEventListener('click', async () => {
	try {

		audioContext = new (window.AudioContext || window.webkitAudioContext)();
		analyser = audioContext.createAnalyser();
		analyser.fftSize = 2048;
		bufferLength = analyser.frequencyBinCount;
		dataArray = new Float32Array(bufferLength);

		microphone = await navigator.mediaDevices.getUserMedia({ audio: true });
		const source = audioContext.createMediaStreamSource(microphone);
		source.connect(analyser);

		btnStart.innerText = "判定中";
		btnStart.disabled = true;
		rangeArea.innerText = `音を聞いてね`;

		for (let i = 0; i < waveLines.length; i++) {
			waveLines[i].style.animationPlayState = "running";
			waveLines[i].style.webkitAnimationPlayState = "running";
		}

		let currentTime = audioContext.currentTime;
		sampleNotes.forEach(note => {
			const oscillator = audioContext.createOscillator();
			oscillator.frequency.setValueAtTime(note.frequency, currentTime);
			oscillator.connect(audioContext.destination);
			oscillator.start(currentTime);
			oscillator.stop(currentTime + 2);
			currentTime += 2;
		});

		setTimeout(() => {
			timeoutId = setTimeout(() => {
				stopDetection();
				analyzePitchData();
			}, 6000);

			detectPitch();
			rangeArea.classList.add("animate-duration");
			rangeArea.innerText = `低い「ラ」`;
			console.log(currentPhase)

			setTimeout(() => {
				currentPhase = "A4";
				rangeArea.innerText = `高い「ラ」`;
				console.log(currentPhase)
			}, 3000);

		}, 4000);

	} catch (err) {
		console.error('Error accessing microphone:', err);
	}
});

function detectPitch() {
	analyser.getFloatFrequencyData(dataArray);

	let maxAmplitude = -Infinity;
	let pitchIndex = -1;

	for (let i = 0; i < bufferLength; i++) {
		if (dataArray[i] > maxAmplitude) {
			maxAmplitude = dataArray[i];
			pitchIndex = i;
		}
	}

	const nyquist = audioContext.sampleRate / 2;
	const frequency = pitchIndex * nyquist / (bufferLength / 2);

	if (currentPhase === "A3" && isInRange(frequency, 220, 30)) {
		pitchDataA3.push(frequency);
	}
	if (currentPhase === "A4" && isInRange(frequency, 440, 60)) {
		pitchDataA4.push(frequency);
	}

	requestAnimationFrame(detectPitch);
}

function isInRange(value, target, tolerance) {
	return value >= target - tolerance && value <= target + tolerance;
}

function stopDetection() {
	microphone.getTracks().forEach((track) => track.stop());
	btnStart.style.display = "none";
	rangeArea.classList.remove("animate-duration");
	btnPlay.style.display = "inline-block";
	btnLowKeyPlay.style.display = "inline-block";
	for (let i = 0; i < waveLines.length; i++) {
		waveLines[i].style.animation = "none";
		waveLines[i].style.webkitAnimation = "none";
	}
}

function analyzePitchData() {
	const matchRateA3 = (pitchDataA3.length / (pitchDataA3.length + pitchDataA4.length)) * 100;
	const matchRateA4 = (pitchDataA4.length / (pitchDataA3.length + pitchDataA4.length)) * 100;

	console.log(`A3一致率: ${matchRateA3.toFixed(2)}%`);
	console.log(`A4一致率: ${matchRateA4.toFixed(2)}%`);
	console.log(pitchDataA3);
	console.log(pitchDataA4);

	if (matchRateA4 > matchRateA3) {
		rangeArea.innerHTML = `素晴らしい！<br>原曲キーで歌えると思うよ。`;
		btnPlay.classList = "btn btn-song-start";
		btnLowKeyPlay.classList = "btn-outline";
	} else {
		rangeArea.innerText = `いいね！少しキーを下げて歌う？`;
		btnLowKeyPlay.classList = "btn btn-song-start";
		btnPlay.classList = "btn-outline";
	}
}

/**
 * 星エフェクト
 */
function addStar() {
	var s = document.createElement('div')
	s.className = 'star'
	s.style.setProperty('--size', Math.random() * 10 + 3 + 'vmin')
	s.style.left = Math.floor(Math.random() * 100) + '%'
	s.style.top = Math.floor(Math.random() * 100) + '%'
	s.onanimationend = function () { this.remove() }
	document.body.appendChild(s)
}