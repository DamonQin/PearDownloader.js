module.exports = PearDownloader;

var inherits = require('inherits');
var Worker = require('./worker');

inherits(PearDownloader, Worker);

function PearDownloader(urlStr, token, opts) {
    var self = this;
    if (!(self instanceof PearDownloader)) return new PearDownloader(urlStr, token, opts);
    if (typeof token === 'object') return PearDownloader(urlStr, '', token);
    Worker.call(self, urlStr, token, opts);
}

class  PearDownloaderTag extends HTMLElement {
  constructor() {
    super();
    this.progress = 0;
    this.status = 'ready';
    this.speed = 0;
    this.addEventListener('click', e => {
      if (this.disabled) {
        return;
      }
      this.downloader = this.createDownloader();
      this.downloaderLifeCycle();
    });
  }

  connectedCallback() {
    this.textContent = "卧槽！！！ - ";
  }

  createDownloader() {
    if (!this.hasAttributes('data-src')) {
      console.error('Must set data-src attribuite!');
      return false;
    }

    let downloader = new PearDownloader(this.dataset.src, {
      algorithm: 'firstaid',      //核心算法,默认firstaid
      interval: 5000,             //滑动窗口的时间间隔,单位毫秒,默认10s
      slideInterval: 20,          //当前播放时间与已缓冲时间小于这个数值时触发窗口滑动,单位秒,默认20s
      useDataChannel: true,       //是否开启data channel,默认true
      dataChannels: 10,            //创建data channel的最大数量,默认2
      useTorrent: true,
      useMonitor: true,             //是否开启monitor,会稍微影响性能,默认false
      ordered: true
    })
    return downloader;
  }

  downloaderLifeCycle() {
    this.downloader.on('begin', () => {
      this.status = 'ready';

      let ev = new CustomEvent("progress");
      this.dispatchEvent(ev);
    });

    this.downloader.on("progress", (prog) => {
      let percent = (prog * 100).toFixed(1) + '%';
      this.progress = percent;
      this.status = 'downloading';

      let ev = new CustomEvent("progress");
      this.dispatchEvent(ev);
    });

    this.downloader.on('meanspeed', (speed) => {
      this.speed = Math.round(speed) + ' KB/S';
    });

    this.downloader.on('done', () => {
      this.status = 'done';
      
      let ev = new CustomEvent("progress");
      this.dispatchEvent(ev);
    });
  }
}

if (!window.customElements.get('pear-downloader')) {
  window.customElements.define('pear-downloader', PearDownloaderTag);
}
