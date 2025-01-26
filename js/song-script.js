const btnStart = document.getElementById('btn-start');
const btnPlay = document.getElementById('btn-play');
const btnReset = document.getElementById('btn-reset');
btnPlay.onclick = start;

const canvas = document.getElementById('pitch-canvas');
canvas.width = window.innerHeight;
canvas.height = window.innerWidth;
let canvasCtx = canvas.getContext('2d', { willReadFrequently: true });

const startLine = document.getElementById('start-line');
const lyricsElement = document.getElementById('lyrics');
const rangeArea = document.getElementById('range-detected');
const waveLines = document.getElementsByClassName("wave-line");
const findPitchArea = document.getElementById("find-pitch");

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

let lowerKeys = [
	{ note: 'C3', freq: 130.81 },
	{ note: 'D3', freq: 146.83 },
	{ note: 'E3', freq: 164.81 },
	{ note: 'F3', freq: 174.61 },
	{ note: 'G3', freq: 196.00 },
	{ note: 'A3', freq: 220.00 },
	{ note: 'B3', freq: 246.94 },
	{ note: 'C4', freq: 261.63 },
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

let songLyrics = [
	{ lyrics: '', duration: 4.8 },
	{ lyrics: '♪ Twinkle Twinkle, Little Star', duration: 7.2 },
	{ lyrics: '♪ How I wonder what you are', duration: 6.4 },
	{ lyrics: '♪ Up above the world so high', duration: 6.4 },
	{ lyrics: '♪ Like a diamond in the sky', duration: 6.4 },
	{ lyrics: '♪ Twinkle Twinkle Little Star', duration: 6.4 },
	{ lyrics: '♪ How I wonder what you are!', duration: 8.0 },
	{ lyrics: '', duration: 0.8 },
];

function start() {
	navigator.mediaDevices
		.getUserMedia({ audio: true })
		.then((stream) => {
			main(stream);
			checkKey();
			playSong();
			displayLyrics();
		})
		.catch(console.log);
}

function checkKey() {
	if (currentKey == 3) {
		keys = lowerKeys;
		song = song.map(noteObj => {
			let newNote = noteObj.note.replace(/\d$/, match => parseInt(match) - 1);
			return { note: newNote, duration: noteObj.duration };
		});
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

	for (let i = 0; i < 8; i++) {
		playMetronome(audioCtx, currentTime, i < 4 ? 0 : 0.6);
		currentTime += 0.8; // 0.8秒ごとにメトロノーム音を再生
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
	btnReset.style.display = "inline-block";
	canvas.style.display = "block";

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
	
	let isStart = false;
	let startLineDistance = 0;

	function draw() {
		analyser.getByteFrequencyData(frequencyData);

		// 音声入力の周波数解析
		let frequency = getFrequencyFromFFT(frequencyData, audioCtx.sampleRate);
		let nearestKey = findNearestKey(frequency);

		drawPiano(nearestKey);

		// スペクトログラムをスクロール
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
		const spectrogramHeightStart = Math.floor(canvas.height * 0.25);
		const spectrogramHeight = canvas.height;
		const imageData = canvasCtx.getImageData(0, 0, canvas.width, spectrogramHeight);

		canvasCtx.putImageData(imageData, 0, -1);
		canvasCtx.clearRect(0, spectrogramHeight - 1, canvas.width, 1);

		totalShiftedPixels += 1; // 1フレームで1ピクセル移動

		// フレームごとの時間を計測
		const currentFrameTime = performance.now();
		const deltaTime = (currentFrameTime - lastFrameTime) / 800; // 秒に変換

		if (deltaTime >= 1 && !isStart) {
			pixelsPerSecond = totalShiftedPixels / deltaTime; // 0.8秒あたりの移動距離
			// console.log(`1秒間の移動距離: ${pixelsPerSecond.toFixed(2)} ピクセル`);
			isStart = true;
			startLine.style.opacity = "1";
			startLine.style.right = pixelsPerSecond.toFixed(2) * 8 + "px";

			startLineDistance = pixelsPerSecond.toFixed(2) * 8;

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
				// const offset = ((spectrogramHeight - 1) * canvas.width + x) * 4;
				canvasCtx.fillStyle = color;
				canvasCtx.fillRect(x, (color == "#4CAF50" ? voiceStartHeight : spectrogramHeight) - 1, 1, 1);
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
    for (var key = 0; key < 9; key++) {
      if (key !== 2 && key !== 6) {
        canvasCtx.fillRect(
          whiteKeyWidth * key + leftOffset,
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
const pitchData = [];
const sampleNotes = [
	{ name: "Do", frequency: 261.63 }, // C4
	{ name: "Re", frequency: 293.66 },
	{ name: "Mi", frequency: 329.63 },
];
let audioContext;
let analyser;
let microphone;
let dataArray;
let bufferLength;

btnStart.addEventListener('click', async () => {
	try {
			// Initialize audio context and microphone input
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
				oscillator.stop(currentTime + 0.8);
				currentTime += 0.8;
			});

			setTimeout(() => {
				detectPitch();
			}, sampleNotes.length * 0.8 * 1000);

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

  if (frequency > 65.41 && frequency < 523.25) {
    pitchData.push(frequency);
  }

  if (pitchData.length >= 100) { 
    stopDetection();
    analyzePitchData();
  } else {
    requestAnimationFrame(detectPitch);
  }
}

function stopDetection() {
  microphone.getTracks().forEach(track => track.stop());
	for (let i = 0; i < waveLines.length; i++) {
		waveLines[i].style.animation = "none";
		waveLines[i].style.webkitAnimation = "none";
	}
	btnStart.style.display = "none";
	btnPlay.style.display = "inline-block";
}

function analyzePitchData() {
  const ranges = {
    "C4-C5": { min: 261.63, max: 523.25, count: 0 },
    "C3-C4": { min: 130.81, max: 261.63, count: 0 },
    "C2-C3": { min: 65.41, max: 130.81, count: 0 },
  };

  pitchData.forEach(frequency => {
    for (const range in ranges) {
      if (frequency >= ranges[range].min && frequency < ranges[range].max) {
        ranges[range].count++;
        break;
      }
    }
  });

  let maxCount = 0;
  let detectedRange = "";
	let index = 4;
  for (const range in ranges) {
    if (ranges[range].count > maxCount) {
      maxCount = ranges[range].count;
      detectedRange = range;
			currentKey = index;
    }
		index--;
  }

	console.log(pitchData)
	console.log(ranges)
	console.log(currentKey)
	rangeArea.innerText = `私の音域は: ${detectedRange}`;
}