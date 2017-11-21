"use strict";

module.exports = PearDownloader;

var inherits = require('inherits');
var Worker = require('./worker');

inherits(PearDownloader, Worker);

var fuck = require('../dist/pear-downloader.min.js');

function PearDownloader(urlStr, token, opts) {
    var self = this;
    if (!(self instanceof PearDownloader)) return new PearDownloader(urlStr, token, opts);
    // if (!(self instanceof PearPlayer)) return new PearPlayer(selector, opts);
    if (typeof token === 'object') return PearDownloader(urlStr, '', token);
    Worker.call(self, urlStr, token, opts);
}

class  PearDownloaderTag extends HTMLElement {
  constructor() {
    super();
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

    let downloader = new fuck("https://qq.webrtc.win/picture/Fog.jpg", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9", {
      algorithm: 'firstaid',      //核心算法,默认firstaid
      interval: 5000,             //滑动窗口的时间间隔,单位毫秒,默认10s
      slideInterval: 20,          //当前播放时间与已缓冲时间小于这个数值时触发窗口滑动,单位秒,默认20s
      useDataChannel: true,       //是否开启data channel,默认true
      dataChannels: 10,            //创建data channel的最大数量,默认2
      useTorrent: true,
      useMonitor: true,             //是否开启monitor,会稍微影响性能,默认false
      ordered: true
    });
    console.warn(downloader);
    downloader.on("exception", function (prog) {
      let percent = (prog * 100).toFixed(1) + '%';
      console.warn(percent, '!!!!!!!!');
    });
    return downloader;
  }

  downloaderLifeCycle() {
    // console.warn(typeof(this.dataset.progress), '****');
    // if (this.dataset.progress) {
      // console.warn(this.downloader, '****');
      // this.downloader.on("progress", function (prog) {
      //   let percent = (prog * 100).toFixed(1) + '%';
      //   console.warn(percent, '****');
        // this.dataset.progress(percent);
        // let ev = new CustomEvent("onProgress");
        // this.addEventListener("onProgress", function (ev) {
        //   console.warn(typeof(ev), ev, '****');
        // });
        // this.dispatchEvent(ev);
      // });
  }
}

if (!window.customElements.get('pear-downloader')) {
  window.customElements.define('pear-downloader', PearDownloaderTag);
}
