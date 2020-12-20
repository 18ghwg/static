"use strict";

function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}

function _classCallCheck(instance, Constructor) {
    if (!_instanceof(instance, Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}

function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}

var Util = {
    leftDistance: function leftDistance(el) {
        var left = el.offsetLeft;
        var scrollLeft;

        while (el.offsetParent) {
            el = el.offsetParent;
            left += el.offsetLeft;
        }

        scrollLeft = document.body.scrollLeft + document.documentElement.scrollLeft;
        return left - scrollLeft;
    },
    timeFormat: function timeFormat(time) {
        var tempMin = parseInt(time / 60);
        var tempSec = parseInt(time % 60);
        var curMin = tempMin < 10 ? '0' + tempMin : tempMin;
        var curSec = tempSec < 10 ? '0' + tempSec : tempSec;
        return curMin + ':' + curSec;
    },
    percentFormat: function percentFormat(percent) {
        return (percent * 100).toFixed(2) + '%';
    },
    ajax: function ajax(option) {
        option.beforeSend && option.beforeSend();
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    option.success && option.success(xhr.responseText);
                } else {
                    option.fail && option.fail(xhr.status);
                }
            }
        };
        xhr.open('GET', option.url);
        xhr.send(null);
    }
};
var instance = false;
var baseUrl = Config.themeUrl + '/inc/music.php';

var skPlayer = /*#__PURE__*/function () {
    function skPlayer(option) {
        var _this = this;

        _classCallCheck(this, skPlayer);

        if (instance) {
            console.error('SKPlayer只能存在一个实例！');
            return Object.create(null);
        } else {
            instance = true;
        }

        var defaultOption = {
            element: document.getElementById('musicPop'),
            mobileElement: document.getElementById('musicMobileBox'),
            autoplay: false,
            //true/false
            mode: 'listloop',
            //singleloop/listloop
            listshow: true //true/false

        }; // this.option = Object.assign({},defaultOption,option);

        for (var defaultKey in defaultOption) {
            if (!option.hasOwnProperty(defaultKey)) {
                option[defaultKey] = defaultOption[defaultKey];
            }
        }

        this.option = option;

        if (!(this.option.music && this.option.music.type && this.option.music.source)) {
            console.error('请正确配置对象！');
            return Object.create(null);
        }


        this.type = this.option.music.type;
        this.music = this.option.music.source;
        this.media = this.option.music.media;
        this.isMobile = /mobile/i.test(window.navigator.userAgent);
        this.toggle = this.toggle.bind(this);
        this.toggleList = this.toggleList.bind(this);
        this.toggleMute = this.toggleMute.bind(this);
        this.switchMode = this.switchMode.bind(this);

        this.root = this.isMobile ? this.option.mobileElement : this.option.element;

        if (this.type === 'file') {
            this.root.innerHTML = this.template();
            this.init();
            this.bind();
        } else if (this.type === 'cloud') {
            this.root.innerHTML = '<p class="music-tip-loading">LOADING</p>';

            axios.get(baseUrl + '?type=collect&media=' + this.media + "&id=" + this.music)
            .then(function (response) {
                _this.music = response.data;
                    console.log('歌单拉取成功！');
                    _this.root.innerHTML = _this.template();

                    _this.init();

                    _this.bind();
              
            })
            .catch(function (error) {
                console.error('歌单拉取失败！ 错误码：' + error);
            });
        }
    }

    _createClass(skPlayer, [{
        key: "template",
        value: function template() {
            var html = `
            <audio class="music-source" src="${this.type === 'file' ? this.music[0].src : ''}" preload="auto" crossOrigin="anonymous"></audio>
            <div class="music-picture">
                <img class="music-cover" src="${this.music[0].cover}" alt="">
                <div class="controls d-inline-flex align-items-center">
            <span class="music-prev-btn d-inline-flex rounded-circle mr-1" onclick="player.prev();">
                <svg class="icon text-secondary m-2" aria-hidden="true"><use xlink:href="#prev"></use></svg>
            </span>
                <span class="music-play-btn d-inline-flex rounded-circle">
                <svg class="icon icon-20 text-secondary" aria-hidden="true"><use id="play-btn-icon" xlink:href="#bofang"></use></svg>
            </span>
                <span class="music-next-btn d-inline-flex rounded-circle ml-1" onclick="player.next();">
                <svg class="icon text-secondary m-2" aria-hidden="true"><use xlink:href="#next"></use></svg>
            </span>
            </div>
            </div>
            <div class="music-control">
                <p class="music-name">${this.music[0].name}</p>
                <p class="music-author">${this.music[0].author}</p>
                <div class="music-percent">
                    <div class="music-line-loading"></div>
                    <div class="music-line"></div>
                </div>
                <p class="music-time">
                    <span class="music-cur">${'00:00'}</span>/<span class="music-total">${'00:00'}</span>
                </p>
                <div class="music-volume" style="${this.isMobile ? 'display:none;' : ''}">
                    <i class="music-icon"></i>
                    <div class="music-percent">
                        <div class="music-line"></div>
                    </div>
                </div>
                <div class="music-list-switch">
                    <i class="music-list-icon"></i>
                </div>
                <i class="${this.option.mode === 'singleloop' ? 'music-mode music-mode-loop' : 'music-mode'}"></i>
            </div>
            <ul class="music-list">
        `;
            for (var index in this.music) {
                html += `
                <li data-index="${index}">
                    <i class="music-list-sign"></i>
                    <span class="music-list-index">${parseInt(index) + 1}</span>
                    <span class="music-list-name" title="${this.music[index].name}">${this.music[index].name}</span>
                    <span class="music-list-author" title="${this.music[index].author}">${this.music[index].author}</span>
                </li>
            `;
            }

            html += "</ul>";
            return html;
        }
    }, {
        key: "init",
        value: function init() {
            var _this2 = this;
            this.dom = {
                cover: this.root.querySelector('.music-cover'),
                playbutton: this.root.querySelector('.music-play-btn'),
                name: this.root.querySelector('.music-name'),
                author: this.root.querySelector('.music-author'),
                timeline_total: this.root.querySelector('.music-percent'),
                timeline_loaded: this.root.querySelector('.music-line-loading'),
                timeline_played: this.root.querySelector('.music-percent .music-line'),
                timetext_total: this.root.querySelector('.music-total'),
                timetext_played: this.root.querySelector('.music-cur'),
                volumebutton: this.root.querySelector('.music-icon'),
                volumeline_total: this.root.querySelector('.music-volume .music-percent'),
                volumeline_value: this.root.querySelector('.music-volume .music-line'),
                switchbutton: this.root.querySelector('.music-list-switch'),
                modebutton: this.root.querySelector('.music-mode'),
                musiclist: this.root.querySelector('.music-list'),
                musicitem: this.root.querySelectorAll('.music-list li')
            };
            this.audio = this.root.querySelector('.music-source');
            if (this.option.listshow) {
                this.root.className = 'music-list-on';
            }

            if (this.option.mode === 'singleloop') {
                this.audio.loop = true;
            }

            this.dom.musicitem[0].className = 'music-curMusic';

            if (this.type === 'cloud') {
                Util.ajax({
                    url: baseUrl + "?type=song&media=" + this.media + "&id=" + this.music[0].song_id,
                    beforeSend: function beforeSend() {
                        console.log('SKPlayer正在努力的拉取歌曲 ...');
                    },
                    success: function success(data) {
                        var url = JSON.parse(data).url;

                        if (url !== null) {
                            console.log('歌曲拉取成功！');
                            _this2.audio.src = url;
                        } else {
                            console.log('歌曲拉取失败！ 资源无效！');

                            if (_this2.music.length !== 1) {
                                _this2.next();
                            }
                        }
                    },
                    fail: function fail(status) {
                        console.error('歌曲拉取失败！ 错误码：' + status);
                    }
                });
            }
        }
    }, {
        key: "bind",
        value: function bind() {
            var _this3 = this;

            this.updateLine = function () {
                var percent = _this3.audio.buffered.length ? _this3.audio.buffered.end(_this3.audio.buffered.length - 1) / _this3.audio.duration : 0;
                _this3.dom.timeline_loaded.style.width = Util.percentFormat(percent);
            };

            this.audio.addEventListener('durationchange', function (e) {
                _this3.dom.timetext_total.innerHTML = Util.timeFormat(_this3.audio.duration);

                _this3.updateLine();
            });
            this.audio.addEventListener('progress', function (e) {
                _this3.updateLine();
            });
            this.audio.addEventListener('canplay', function (e) {
                if (_this3.option.autoplay && !_this3.isMobile) {
                    _this3.play();
                }
            });
            this.audio.addEventListener('timeupdate', function (e) {
                var percent = _this3.audio.currentTime / _this3.audio.duration;
                _this3.dom.timeline_played.style.width = Util.percentFormat(percent);
                _this3.dom.timetext_played.innerHTML = Util.timeFormat(_this3.audio.currentTime);
            });
            this.audio.addEventListener('seeked', function (e) {
                _this3.play();
            });
            this.audio.addEventListener('ended', function (e) {
                _this3.next();
            });
            this.dom.playbutton.addEventListener('click', this.toggle);
            this.dom.switchbutton.addEventListener('click', this.toggleList);

            if (!this.isMobile) {
                this.dom.volumebutton.addEventListener('click', this.toggleMute);
            }

            this.dom.modebutton.addEventListener('click', this.switchMode);
            this.dom.musiclist.addEventListener('click', function (e) {
                Cuteen.stopPropagation();
                var target, index, curIndex;
                if (e.target.tagName.toUpperCase() === 'LI') {
                    target = e.target;
                } else if (e.target.parentElement.tagName.toUpperCase() === 'LI') {
                    target = e.target.parentElement;
                } else {
                    return;
                }

                index = parseInt(target.getAttribute('data-index'));
                curIndex = parseInt(_this3.dom.musiclist.querySelector('.music-curMusic').getAttribute('data-index'));

                if (index === curIndex) {
                    _this3.play();
                } else {
                    _this3.switchMusic(index + 1);
                }
                //return false;
            });
            this.dom.timeline_total.addEventListener('click', function (event) {
                var e = event || window.event;

                var percent = (e.clientX - Util.leftDistance(_this3.dom.timeline_total)) / _this3.dom.timeline_total.clientWidth;

                if (!isNaN(_this3.audio.duration)) {
                    _this3.dom.timeline_played.style.width = Util.percentFormat(percent);
                    _this3.dom.timetext_played.innerHTML = Util.timeFormat(percent * _this3.audio.duration);
                    _this3.audio.currentTime = percent * _this3.audio.duration;
                }
            });

            if (!this.isMobile) {
                this.dom.volumeline_total.addEventListener('click', function (event) {
                    var e = event || window.event;

                    var percent = (e.clientX - Util.leftDistance(_this3.dom.volumeline_total)) / _this3.dom.volumeline_total.clientWidth;

                    _this3.dom.volumeline_value.style.width = Util.percentFormat(percent);
                    _this3.audio.volume = percent;

                    if (_this3.audio.muted) {
                        _this3.toggleMute();
                    }
                });
            }
        }
    }, {
        key: "prev",
        value: function prev() {
            Cuteen.stopPropagation();
            var index = parseInt(this.dom.musiclist.querySelector('.music-curMusic').getAttribute('data-index'));

            if (index === 0) {
                if (this.music.length === 1) {
                    this.play();
                } else {
                    this.switchMusic(this.music.length - 1 + 1);
                }
            } else {
                this.switchMusic(index - 1 + 1);
            }
        }
    }, {
        key: "next",
        value: function next() {
            Cuteen.stopPropagation();
            var index = parseInt(this.dom.musiclist.querySelector('.music-curMusic').getAttribute('data-index'));

            if (index === this.music.length - 1) {
                if (this.music.length === 1) {
                    this.play();
                } else {
                    this.switchMusic(0 + 1);
                }
            } else {
                this.switchMusic(index + 1 + 1);
            }
        }
    }, {
        key: "switchMusic",
        value: function switchMusic(index) {
            var _this4 = this;

            if (typeof index !== 'number') {
                console.error('请输入正确的歌曲序号！');
                return;
            }

            index -= 1;

            if (index < 0 || index >= this.music.length) {
                console.error('请输入正确的歌曲序号！');
                return;
            }

            if (index === this.dom.musiclist.querySelector('.music-curMusic').getAttribute('data-index')) {
                this.play();
                return;
            } //if(!this.isMobile){
            //    this.audio.pause();
            //    this.audio.currentTime = 0;
            //}


            this.dom.musiclist.querySelector('.music-curMusic').classList.remove('music-curMusic');
            this.dom.musicitem[index].classList.add('music-curMusic');
            this.dom.name.innerHTML = this.music[index].name;
            this.dom.author.innerHTML = this.music[index].author;
            this.dom.cover.src = this.music[index].cover;

            if (this.type === 'file') {
                this.audio.src = this.music[index].src;
                this.play();
            } else if (this.type === 'cloud') {
                Util.ajax({
                    url: baseUrl + "?type=song&media=" + this.media + "&id=" + this.music[index].song_id,
                    beforeSend: function beforeSend() {
                        console.log('SKPlayer正在努力的拉取歌曲 ...');
                    },
                    success: function success(data) {
                        var url = JSON.parse(data).url;

                        if (url !== null) {
                            console.log('歌曲拉取成功！');
                            _this4.audio.src = url;
                            _this4.play(); //暂存问题，移动端兼容性

                        } else {
                            console.log('歌曲拉取失败！ 资源无效！');

                            if (_this4.music.length !== 1) {
                                _this4.next();
                            }
                        }
                    },
                    fail: function fail(status) {
                        console.error('歌曲拉取失败！ 错误码：' + status);
                    }
                });
            }
        }
    }, {
        key: "play",
        value: function play() {
            Cuteen.stopPropagation();
            if (this.audio.paused) {
                this.audio.play();
                document.getElementById('play-btn-icon').setAttribute("xlink:href", "#pause");
                document.getElementById('musicSvg').classList.add('on');
                this.dom.cover.classList.add('music-pause');
            }
        }
    }, {
        key: "pause",
        value: function pause() {
            Cuteen.stopPropagation();
            if (!this.audio.paused) {
                this.audio.pause();
                document.getElementById('play-btn-icon').setAttribute("xlink:href", "#bofang");
                this.dom.cover.classList.remove('music-pause');
                document.getElementById('musicSvg').classList.remove('on');
            }
        }
    }, {
        key: "toggle",
        value: function toggle() {
            this.audio.paused ? this.play() : this.pause();
        }
    }, {
        key: "toggleList",
        value: function toggleList() {
            this.root.classList.contains('music-list-on') ? this.root.classList.remove('music-list-on') : this.root.classList.add('music-list-on');
        }
    }, {
        key: "toggleMute",
        value: function toggleMute() {
            //暂存问题，移动端兼容性
            if (this.audio.muted) {
                this.audio.muted = false;
                this.dom.volumebutton.classList.remove('music-quiet');
                this.dom.volumeline_value.style.width = Util.percentFormat(this.audio.volume);
            } else {
                this.audio.muted = true;
                this.dom.volumebutton.classList.add('music-quiet');
                this.dom.volumeline_value.style.width = '0%';
            }
        }
    }, {
        key: "switchMode",
        value: function switchMode() {
            if (this.audio.loop) {
                this.audio.loop = false;
                this.dom.modebutton.classList.remove('music-mode-loop');
            } else {
                this.audio.loop = true;
                this.dom.modebutton.classList.add('music-mode-loop');
            }
        }
    }, {
        key: "destroy",
        value: function destroy() {
            instance = false;
            this.audio.pause();
            this.root.innerHTML = '';

            for (var prop in this) {
                delete this[prop];
            }

            console.log('该实例已销毁，可重新配置 ...');
        }
    }]);
    return skPlayer;
}();

var player = new skPlayer({
    autoplay: false,
    listshow: false,
    mode: 'listloop',
    music: {
        type: 'cloud',
        source: Config.musicId,
        media: Config.musicMedia,
    }
});