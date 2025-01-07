const btnStart = document.getElementById('btn-start');
btnStart.onclick = start;

const canvas = document.getElementById("pitch-canvas");
canvas.width = 1080;
canvas.height = 1920;
let canvasCtx = canvas.getContext('2d');

let song = [
	{ note: 'C4', duration: 0.8 },
	{ note: 'C4', duration: 0.8 },
	{ note: 'G4', duration: 0.8 },
	{ note: 'G4', duration: 0.8 },
	{ note: 'A4', duration: 0.8 },
	{ note: 'A4', duration: 0.8 },
	{ note: 'G4', duration: 1.6 },
	{ note: 'F4', duration: 0.8 },
	{ note: 'F4', duration: 0.8 },
	{ note: 'E4', duration: 0.8 },
	{ note: 'E4', duration: 0.8 },
	{ note: 'D4', duration: 0.8 },
	{ note: 'D4', duration: 0.8 },
	{ note: 'C4', duration: 1.6 },
	{ note: 'G4', duration: 0.8 },
	{ note: 'G4', duration: 0.8 },
	{ note: 'F4', duration: 0.8 },
	{ note: 'F4', duration: 0.8 },
	{ note: 'E4', duration: 0.8 },
	{ note: 'E4', duration: 0.8 },
	{ note: 'D4', duration: 1.6 },
	{ note: 'G4', duration: 0.8 },
	{ note: 'G4', duration: 0.8 },
	{ note: 'F4', duration: 0.8 },
	{ note: 'F4', duration: 0.8 },
	{ note: 'E4', duration: 0.8 },
	{ note: 'E4', duration: 0.8 },
	{ note: 'D4', duration: 1.6 },
	{ note: 'C4', duration: 0.8 },
	{ note: 'C4', duration: 0.8 },
	{ note: 'G4', duration: 0.8 },
	{ note: 'G4', duration: 0.8 },
	{ note: 'A4', duration: 0.8 },
	{ note: 'A4', duration: 0.8 },
	{ note: 'G4', duration: 1.6 },
	{ note: 'F4', duration: 0.8 },
	{ note: 'F4', duration: 0.8 },
	{ note: 'E4', duration: 0.8 },
	{ note: 'E4', duration: 0.8 },
	{ note: 'D4', duration: 0.8 },
	{ note: 'D4', duration: 0.8 },
	{ note: 'C4', duration: 1.6 }
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

function start() {
	navigator.mediaDevices
		.getUserMedia({ audio: true })
		.then((stream) => {
			main(stream);
			playSong(song);
		})
		.catch(console.log);
}

function playSong(song) {
	const audioCtx = new window.AudioContext();
	let currentTime = audioCtx.currentTime;

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
}

function main(stream) {
	var audioCtx = new window.AudioContext();
	var realAudioInput = audioCtx.createMediaStreamSource(stream);
	var analyser = audioCtx.createAnalyser();
	realAudioInput.connect(analyser);
	analyser.fftSize = 2048;

	var bufferLength = analyser.frequencyBinCount;
	var frequencyData = new Uint8Array(bufferLength);

	function findNearestKey(frequency) {
		const tolerance = 12; // 許容範囲（Hz）
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

	function draw() {
		analyser.getByteFrequencyData(frequencyData);

		// 音声入力の周波数解析
		let frequency = getFrequencyFromFFT(frequencyData, audioCtx.sampleRate);
		let nearestKey = findNearestKey(frequency);

		// スペクトログラムをスクロール
		shiftSpectrogram();

		// 現在の音程を描画
		if (nearestKey) {
			drawSpectrogramKey(nearestKey, "#4CAF50");
		}

		// 曲のキーを描画
		updateSongSpectrogram();
		drawPiano(nearestKey);

		requestAnimationFrame(draw);
	}

	function shiftSpectrogram() {
		const spectrogramHeight = Math.floor(canvas.height * 0.74);
		const imageData = canvasCtx.getImageData(0, 0, canvas.width, spectrogramHeight);

		canvasCtx.putImageData(imageData, 0, -1);
		canvasCtx.clearRect(0, spectrogramHeight - 1, canvas.width, 1);
	}

	function drawSpectrogramKey(activeKey, color) {
		const spectrogramHeight = Math.floor(canvas.height * 0.74);
		const whiteKeyWidth = Math.floor(canvas.width / keys.length);
		const keyIndex = keys.findIndex(key => key.note === activeKey.note);

		if (keyIndex >= 0) {
			const xFrom = whiteKeyWidth * keyIndex;
			const xTo = whiteKeyWidth * (keyIndex + 1);

			for (let x = xFrom; x < xTo; x++) {
				const offset = ((spectrogramHeight - 1) * canvas.width + x) * 4;
				canvasCtx.fillStyle = color;
				canvasCtx.fillRect(x, spectrogramHeight - 1, 1, 1);
			}
		}
	}

	let currentNoteIndex = 0;
	let currentNoteStartTime = audioCtx.currentTime;

	function updateSongSpectrogram() {
		const currentTime = audioCtx.currentTime;

		// 現在再生中のノートを確認
		if (currentNoteIndex < song.length) {
			const note = song[currentNoteIndex];
			const noteDuration = note.duration;

			if (currentTime - currentNoteStartTime >= noteDuration) {
				currentNoteIndex++;
				currentNoteStartTime += noteDuration;
			}
		}

		// スペクトログラムに曲のキーを描画
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
		let keyTop = canvas.height - keyHeight;
		
		canvasCtx.clearRect(0, keyTop, canvas.width, canvas.height);

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
        keys[i].note, // 描画するテキスト
        rectX + whiteKeyWidth / 2, // 矩形の中央X座標
        rectY + keyHeight / 2 // 矩形の中央Y座標
    	);
			alpha += 0.1;
		}

		canvasCtx.stroke();
	}
	draw();
}
