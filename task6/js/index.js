window.onload = () => {
	alert('Welcome!!!');
	var audio = new Audio('src/01.mp3');
	audio.oncanplaythrough = function () {
		this.play();
		this.loop = true;
	}
};