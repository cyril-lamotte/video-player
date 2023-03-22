export default class VideoPlayer {

  constructor(player, settings = {}) {
    // Merge user's settings.
    this.settings = {
      labels: {
        play: '▶️ <span class="vp--is-hidden">Lire la vidéo</span>',
        pause: '⏸️ <span class="vp--is-hidden">Mettre en pause la vidéo</span>',
        mute: '🔇 <span class="vp--is-hidden">Mettre en sourdine</span>',
        unmute: '🔉 <span class="vp--is-hidden">Activer le son</span>',
        fullscreenOn: '⏫️ <span class="vp--is-hidden">Plein écran</span>',
        fullscreenOff: '⏬️ <span class="vp--is-hidden">Désactiver le plein écran</span>',
        subsOn: 'Afficher CC <span class="vp--is-hidden">Afficher les sous-titres</span>',
        subsOff: 'Masquer CC <span class="vp--is-hidden">Masquer les sous-titres</span>',
        adOn: 'Activer AD',
        adOff: 'Masquer AD',
      },
      ...settings,
    };

    this.player = player;
    this.video = player.querySelector('video');
    this.audioDescription = player.querySelector('audio');

    // Get buttons.
    this.playButton = player.querySelector('.vp__playpause');
    this.muteButton = player.querySelector('.vp__mute');
    this.subsButton = player.querySelector('.vp__subs');
    this.progressBar = player.querySelector('progress');
    this.audioDescButton = player.querySelector('.vp__audiodesc');
    this.fullScreenButton = player.querySelector('.vp__fullscreen');

    this.init();
  }

  /**
   * State and event initialisations.
   *
   * @return {void}
   */
  init() {
    // Hide default controls.
    this.video.controls = false;

    // Set custom controls.s
    this.controls();

    if (this.audioDescription) {
      this.synchronizeAudioDescription();
    }

    this.player.classList.add('vp--is-init');
  }

  controls() {
    this.playback();
    this.volume();
    this.subtitles();
    this.progress();
    this.fullScreen();
    this.toggleAudioDescription();
  }

  /**
   * Toggle video playback.
   *
   * @return {void}
   */
  playback() {
    this.playButton.innerHTML = this.settings.labels.play;

    this.playButton.addEventListener('click', () => {
      if (this.video.paused || this.video.ended) {
        this.video.play();
        this.playButton.innerHTML = this.settings.labels.pause;
      } else {
        this.video.pause();
        this.playButton.innerHTML = this.settings.labels.play;
      }
    });
  }

  /**
   * Toggle video default controls.
   *
   * @return {void}
   */
  subtitles() {
    // Show subtitles by default.
    this.video.textTracks[0].mode = 'showing';
    this.subsButton.innerHTML = this.settings.labels.subsOff;

    this.subsButton.addEventListener('click', () => {
      // Show subtitles by default.
      if (this.video.textTracks[0].mode == 'hidden') {
        this.video.textTracks[0].mode = 'showing';
        this.subsButton.innerHTML = this.settings.labels.subsOff;
      } else {
        this.video.textTracks[0].mode = 'hidden';
        this.subsButton.innerHTML = this.settings.labels.subsOn;
      }
    });
  }

  /**
   * Show video duration.
   *
   * @return {void}
   */
  progress() {
    // this.progressIndicator = this.progressBar.querySelector('span');
    this.video.addEventListener('loadedmetadata', () => {
      this.progressBar.setAttribute('max', this.video.duration);
    });

    this.video.addEventListener('timeupdate', () => {
      this.progressBar.value = this.video.currentTime;
      // this.progressIndicator.style.width = `${Math.floor((this.video.currentTime * 100) / this.video.duration)}%`;
      if (!this.progressBar.getAttribute('max')) {
        this.progressBar.setAttribute('max', this.video.duration);
      }
    });

    this.progressBar.addEventListener('click', (e) => {
      const rect = this.progressBar.getBoundingClientRect();
      const pos = (e.pageX - rect.left) / this.progressBar.offsetWidth;
      this.video.currentTime = pos * this.video.duration;
    });
  }

  /**
   * Toggle fullScreen.
   *
   * @return {void}
   */
  fullScreen() {
    // Hide button if fullscreen API doesn't exist.
    if (!document?.fullscreenEnabled) {
      this.fullScreenButton.style.display = 'none';
    }

    this.fullScreenButton.innerHTML = this.settings.labels.fullscreenOn;

    this.fullScreenButton.addEventListener('click', () => {
      if (document.fullscreenElement !== null) {
        // The document is in fullscreen mode
        document.exitFullscreen();
        this.setFullscreenData(false);
        this.fullScreenButton.innerHTML = this.settings.labels.fullscreenOn;
      } else {
        // The document is not in fullscreen mode
        this.player.requestFullscreen();
        this.setFullscreenData(true);
        this.fullScreenButton.innerHTML = this.settings.labels.fullscreenOff;
      }
    });
  }

  setFullscreenData(state) {
    this.player.setAttribute('data-fullscreen', state);
  }

  /**
   * Toggle volume.
   *
   * @return {void}
   */
  volume() {
    this.muteButton.innerHTML = this.settings.labels.mute;

    this.muteButton.addEventListener('click', () => {
      if (this.video.volume == 0) {
        this.video.volume = 1;
        this.audioDescription.volume = 1;
        this.muteButton.innerHTML = this.settings.labels.mute;
      } else {
        this.video.volume = 0;
        this.audioDescription.volume = 0;
        this.muteButton.innerHTML = this.settings.labels.unmute;
      }
    });
  }

  /**
   * Toggle volume.
   *
   * @return {void}
   */
  toggleAudioDescription() {
    this.audioDescButton.innerHTML = this.settings.labels.adOff;

    this.audioDescButton.addEventListener('click', () => {
      if (this.audioDescription.volume == 0) {
        this.audioDescription.volume = 1;
        this.audioDescButton.innerHTML = this.settings.labels.adOff;
      } else {
        this.audioDescription.volume = 0;
        this.audioDescButton.innerHTML = this.settings.labels.adOn;
      }
    });
  }

  /**
   * Synchronize video playback & audiodescription.
   *
   * @return {void}
   */
  synchronizeAudioDescription() {
    this.video.addEventListener('play', () => {
      this.audioDescription.play();
    });

    this.video.addEventListener('pause', () => {
      this.audioDescription.pause();
    });

    this.video.addEventListener('seeked', () => {
      this.audioDescription.currentTime = this.video.currentTime;
    });
  }
}
