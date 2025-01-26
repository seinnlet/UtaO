const noteElements = document.querySelectorAll('.note');
const frequencyDisplay = document.getElementById('frequency');
const pitchDisplay = document.getElementById('pitch');
const keyDisplay = document.getElementById('current-key');
const startButton = document.getElementById('btn-doremi-start');
const lowKeyButton = document.getElementById('btn-low-key');
const highKeyButton = document.getElementById('btn-high-key');

const pitches = [
	'C0', 'C#0', 'D0', 'D#0', 'E0', 'F0', 'F#0', 'G0', 'G#0', 'A0', 'A#0', 'B0',  // 0
	'C1', 'C#1', 'D1', 'D#1', 'E1', 'F1', 'F#1', 'G1', 'G#1', 'A1', 'A#1', 'B1',  // 1
	'C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2',  // 2
	'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',  // 3
	'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',  // 4
	'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5',  // 5
	'C6', 'C#6', 'D6', 'D#6', 'E6', 'F6', 'F#6', 'G6', 'G#6', 'A6', 'A#6', 'B6',  // 6
	'C7', 'C#7', 'D7', 'D#7', 'E7', 'F7', 'F#7', 'G7', 'G#7', 'A7', 'A#7', 'B7',  // 7
	'C8', 'C#8', 'D8', 'D#8', 'E8', 'F8', 'F#8', 'G8', 'G#8', 'A8', 'A#8', 'B8',  // 8
];

let frequencies = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];

let audioContext, analyser, sourceNode, rafId;
let currentKey = 4, minKey = 2, maxKey = 4;

/**
 * スタートタンをクリックする
 */
startButton.addEventListener('click', async () => {
	try {
		audioContext = new (window.AudioContext || window.webkitAudioContext)();
		analyser = audioContext.createAnalyser();
		analyser.fftSize = 2048;

		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		sourceNode = audioContext.createMediaStreamSource(stream);
		sourceNode.connect(analyser);

		startButton.innerText = "練習中";
		startButton.disabled = true;

		detectPitch();
	} catch (err) {
		console.error('マイクアクセスエラー:', err);
	}
});

/**
 * ピッチ検出
 */
function detectPitch() {
	const bufferLength = analyser.fftSize;
	const dataArray = new Float32Array(bufferLength);
	analyser.getFloatTimeDomainData(dataArray);

	const pitch = autoCorrelate(dataArray, audioContext.sampleRate);

	if (pitch !== -1) {
		frequencyDisplay.textContent = pitch.toFixed(2) + ' Hz';
		const noteName = frequencyToPitch(pitch);
		pitchDisplay.textContent = noteName;
		updateNotes(pitch);
	} else {
		frequencyDisplay.textContent = '----';
		pitchDisplay.textContent = '--';
	}

	rafId = requestAnimationFrame(detectPitch);
}

/**
 * 周波数を音名に変換
 */
function frequencyToPitch(frequency) {
	if (frequency < 20 || frequency > 5000) return '-';

	const noteIndex = Math.round( 12 * (Math.log( frequency / 440 )/Math.log(2) )) + 69;
	return pitches[noteIndex - 12] || '-';
}

/**
 * ドレミファソラシド色更新
 */
function updateNotes(pitch) {
	frequencies.forEach((freq, index) => {
		const noteElement = noteElements[index];
		if (Math.abs(pitch - freq) < 5) {
			noteElement.classList.add('matched');
		} else {
			noteElement.classList.remove('matched');
		}
	});
}

/**
 * ピッチを検出するための自己相関関数
 */
function autoCorrelate(buffer, sampleRate) {
	const SIZE = buffer.length;
	let rms = 0;

	for (let i = 0; i < SIZE; i++) {
		rms += buffer[i] * buffer[i];
	}
	rms = Math.sqrt(rms / SIZE);
	if (rms < 0.01) return -1;

	let r1 = 0,
		r2 = SIZE - 1,
		thres = 0.2;
	for (let i = 0; i < SIZE / 2; i++) {
		if (Math.abs(buffer[i]) < thres) {
			r1 = i;
			break;
		}
	}
	for (let i = 1; i < SIZE / 2; i++) {
		if (Math.abs(buffer[SIZE - i]) < thres) {
			r2 = SIZE - i;
			break;
		}
	}

	buffer = buffer.slice(r1, r2);
	const newSize = buffer.length;
	const c = new Array(newSize).fill(0);

	for (let i = 0; i < newSize; i++) {
		for (let j = 0; j < newSize - i; j++) {
			c[i] = c[i] + buffer[j] * buffer[j + i];
		}
	}

	let d = 0;
	while (c[d] > c[d + 1]) d++;
	let maxval = -1,
		maxpos = -1;
	for (let i = d; i < newSize; i++) {
		if (c[i] > maxval) {
			maxval = c[i];
			maxpos = i;
		}
	}

	const T0 = maxpos;
	return sampleRate / T0;
}

const whiteKeys = document.querySelectorAll('.white-note');

whiteKeys.forEach((key, index) => {
	key.addEventListener('click', () => {
		console.log(index)

		noteElements[index].classList.add('matched');
		setTimeout(() => {
				noteElements[index].classList.remove('matched'); 
		}, 700);
		
		if (audioContext) {
			playNote(frequencies[index]);
		}
	});
});

function playNote(frequency) {
	const oscillator = audioContext.createOscillator();
	const gainNode = audioContext.createGain();

	oscillator.type = 'triangle';
	oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

	gainNode.gain.setValueAtTime(0, audioContext.currentTime);
	gainNode.gain.linearRampToValueAtTime(0.96, audioContext.currentTime + 0.02);
	gainNode.gain.linearRampToValueAtTime(0.7, audioContext.currentTime + 0.2);
	gainNode.gain.setValueAtTime(0.6, audioContext.currentTime + 0.2);
	gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.7);

	oscillator.connect(gainNode);
	gainNode.connect(audioContext.destination);

	oscillator.start();
	oscillator.stop(audioContext.currentTime + 0.7);
}

/**
 * キーを変える
 */
lowKeyButton.addEventListener('click', function() {
	if (currentKey > minKey) {
		currentKey-=1;
		setFrequencies(currentKey);
	}
});

highKeyButton.addEventListener('click', function() {
	if (currentKey < maxKey) {
		currentKey+=1;
		setFrequencies(currentKey);
	}
});

function setFrequencies(key) {
	keyDisplay.textContent = `C${key} ~ C${++key}`;
	key--;
	const baseFrequency = 261.63; // C4
	const octaveMultiplier = Math.pow(2, key - 4);
	const stepRatio = Math.pow(2, 1 / 12);

	// C, D, E, F, G, A, B, C の順で計算
	const semitoneSteps = [0, 2, 4, 5, 7, 9, 11, 12];

	frequencies = semitoneSteps.map((step) => {
		const freq = baseFrequency * octaveMultiplier * Math.pow(stepRatio, step);
		return Math.round(freq * 100) / 100; // 小数点以下2桁に丸める
	});

	console.log(frequencies)
	return frequencies;
}