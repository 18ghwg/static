"use strict";
console.log(' %c Theme Cuteen v4.1(20201213) %c https://blog.zwying.com/ ', 'color: #fff; background: #2dce89; padding:5px;', 'background: #1c2b36; padding:5px;');
//----------------------------------------添加、删除Class---------------------------------------
function hasClass(obj, cls) {
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

function addClass(obj, cls) {
    if (!hasClass(obj, cls)) obj.className += "" + cls;
}

function removeClass(obj, cls) {
    if (hasClass(obj, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        obj.className = obj.className.replace(reg, '');
    }
}

function toggleClass(obj, cls) {
    if (hasClass(obj, cls)) {
        removeClass(obj, cls);
    } else {
        addClass(obj, cls);
    }
}


const Cuteen = {
    initTheme: function () {
        new LazyLoad({
            // Your custom settings go here
        });
        //气泡提示
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        })
        // 状态栏hover触发
        if (window.matchMedia("(min-width: 768px)").matches) {
            const dropdown = document.getElementsByClassName('dropdown');
            const dropdownToggle = document.getElementsByClassName('dropdown-toggle');
            const dropdownMenu = document.getElementsByClassName('dropdown-menu');
            for (let i = 0; i < dropdown.length; i++) {
                dropdown[i].onmouseover = function () {
                    dropdownToggle[i].setAttribute("aria-expanded", "true");
                    dropdownToggle[i].classList.add('show');
                    dropdownMenu[i].classList.add('show');
                }
                dropdown[i].onmouseout = function () {
                    dropdownToggle[i].setAttribute("aria-expanded", "false");
                    dropdownToggle[i].classList.remove('show');
                    dropdownMenu[i].classList.remove('show');
                }
            }
        }
        //状态栏下滑消失
        if (Config.NavBarHeadroom === 'yes') {
            const element = document.getElementById("navPC");
            const headroom = new Headroom(element, {
                offset: 150,
            });
            headroom.init();
        }

    },

    mobileAside: function () {
        const attr = document.getElementById('mobileMenu');
        const side = document.getElementById('mobileAside');
        attr.onclick = function () {
            let status = side.getAttribute('mobile-open');
            if (status === 'false') {
                side.setAttribute('mobile-open', 'true')
            } else {
                side.setAttribute('mobile-open', 'false')
            }
        }
    },
    mobileMusicToggle: function () {
        const musicPop = document.getElementById('mobileMusic');
        const box = document.getElementById('musicMobileBox');
        if (musicPop !== null){
            musicPop.onclick = function () {
                if (box.className === 'on') {
                    box.classList.remove('on');
                    Cuteen.maskOff();
                } else {
                    box.classList.add('on');
                    Cuteen.maskOn();
                }
            }
        }
    },
    stopPropagation: function (e) {
        e = e || window.event;
        if (e.stopPropagation) { //W3C阻止冒泡方法
            e.stopPropagation();
        } else {
            e.cancelBubble = true; //IE阻止冒泡方法
        }
    },
    maskOff: function () {
        const side = document.getElementById('mask');
        side.setAttribute('data-mask', 'close')
    },
    maskOn: function () {
        const side = document.getElementById('mask');
        side.setAttribute('data-mask', 'open')
    },
    bodyClose: function () {
        const mask = document.getElementById('mask');
        const side = document.getElementById('mobileAside');
        // mask.onclick = function () {
        side.setAttribute('mobile-open', 'false')
        // }
    },
    navBar: function () {
        if (Config.topImage === 'yes') {
            let b = document.documentElement.scrollTop || document.body.scrollTop,
                d = document.getElementById('navPC'),
                e = document.getElementById('navMobile');
            if (b > 120) {
                d.classList.add('bg-blur');
                d.classList.remove('bg-transparent', 'has-img');
                e.classList.add('bg-blur');
                e.classList.remove('bg-transparent', 'has-img');
            } else {
                d.classList.add('bg-transparent', 'has-img');
                d.classList.remove('bg-blur');
                e.classList.add('bg-transparent', 'has-img');
                e.classList.remove('bg-blur');
            }
        }
    },
    backTop: function () {
        window.scroll({top: 0, left: 0, behavior: 'smooth'});
    },
    randomString: function (len) {
        len = len || 32;
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let res = "";
        for (let i = 0; i < len; i++) {
            res += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return res;
    },
    getCodeFromBlock: function (block) {
        var codeOfBlocks = {};
        if (codeOfBlocks[block.id] !== undefined) {
            return codeOfBlocks[block.id];
        }
        let lines = block.getElementsByClassName('hljs-ln-code');
        let res = "";
        for (let i = 0; i < lines.length - 1; i++) {
            res += lines[i].innerText;
            res += "\n";
        }
        res += lines[lines.length - 1].innerText;
        codeOfBlocks[block.id] = res;
        return res;
    },
    codeLight: function () {
        if (typeof (hljs) == "undefined") {
            return;
        }
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block);
        });
        document.querySelectorAll('code.hljs').forEach((block) => {
            let copyBtnID = "copy_btn_" + Cuteen.randomString();
            hljs.lineNumbersBlock(block, {singleLine: true});
            const el = block.parentNode;
            el.classList.add('hljs-codeblock');
            block.insertAdjacentHTML('afterend', `
<div class="hljs-control hljs-title">
			<div type="button" data-toggle="tooltip" data-placement="bottom" data-original-title="折行" class="hljs-control-toggle-break-line">
						<svg class="icon" aria-hidden="true"><use xlink:href="#align-left"></use></svg>
					</div>
					<div id=` + copyBtnID + ` type="button" data-toggle="tooltip" data-placement="bottom" data-original-title="复制" class="hljs-control-copy">
						<svg class="icon" aria-hidden="true"><use xlink:href="#copy"></use></svg>
					</div>
				</div>`);
            let clipboard = new ClipboardJS("#" + copyBtnID, {
                text: function (trigger) {
                    return Cuteen.getCodeFromBlock(el);
                }
            });
            clipboard.on('success', function (e) {
                Toastify({
                    duration: 1500,
                    position: 'center',
                    text: '<svg class="icon icon-20" aria-hidden="true"><use xlink:href="#check-circle"></use></svg>复制成功!',
                    backgroundColor: "var(--bs-success)",
                    className: "info",
                }).showToast();
            });
            clipboard.on('error', function (e) {
                Toastify({
                    duration: 1500,
                    position: 'center',
                    text: '<svg class="icon icon-20" aria-hidden="true"><use xlink:href="#x-circle"></use></svg>复制失败!',
                    backgroundColor: "var(--bs-danger)",
                    className: "info",
                }).showToast();
            });
        });
    },
    ajaxComment: function () {
        const fm = document.getElementById('comment-form');
        const action = fm.getAttribute('data-action');
        console.log(action);
        fm.onsubmit = function (e) {
            e.preventDefault();
            let fmData = new FormData(fm);
            axios.post(action, fmData)
                .then(function (response) {
                    const parser = new DOMParser();
                    const convert = parser.parseFromString(response.data, "text/html");//字符串转换为dom
                    const error = new RegExp('Typecho_Widget_Exception');
                    if (error.test(response.data)) {
                        Toastify({
                            duration: 3000,
                            position: 'center',
                            text: '<svg class="icon icon-20" aria-hidden="true"><use xlink:href="#x-circle"></use></svg>评论失败!回传参数错误!',
                            backgroundColor: "var(--bs-danger)",
                            className: "info",
                        }).showToast();
                        console.log(response.data);
                    } else {
                        console.log('回复提交成功！');
                        document.getElementById("comment-textarea").value = "";//清空回复
                        window.TypechoComment.cancelReply();//复位回复框
                        const newIdNumber = response.data.match(/id=\"?comment-\d+/g).join().match(/\d+/g).sort(
                            function (a, b) {
                                return a - b;
                            } 
                        ).pop();
                        const newId = 'comment-'.concat(newIdNumber);
                        const oldList = document.getElementsByClassName('comment-list');
                        const newList = convert.getElementsByClassName('comment-list')[0].outerHTML;//获取新列表
                        console.log(oldList)
                        if (oldList.length > 0) {
                            oldList[0].remove();//移除旧列表
                        }
                        document.getElementById('comment-list').insertAdjacentHTML('afterbegin', newList);//插入新列表
                        Toastify({
                            duration: 3000,
                            position: 'center',
                            text: '<svg class="icon icon-20" aria-hidden="true"><use xlink:href="#check-circle"></use></svg>评论成功!',
                            backgroundColor: "var(--bs-success)",
                            className: "info",
                        }).showToast();//提示成功
                        document.getElementById(newId).scrollIntoView({behavior: "smooth"});//滚动到对应锚点
                    }
                })
                .catch(function (error) {
                    Toastify({
                        duration: 3000,
                        position: 'center',
                        text: '<svg class="icon icon-20" aria-hidden="true"><use xlink:href="#x-circle"></use></svg>评论失败!提交错误!',
                        backgroundColor: "var(--bs-danger)",
                        className: "info",
                    }).showToast();
                    console.log(error);
                });
        }
    },
    upStar: function () {
        const like = document.getElementById('like');
        if (like !== null) {
            let dataID = like.dataset.pid,
                num = document.getElementById("num"),
                starValue = Cookies.get('upstar');
            if (dataID === starValue) {
                like.classList.remove('btn-outline-primary');
                like.classList.add('btn-primary');
                Toastify({
                    duration: 3000,
                    position: 'center',
                    text: '<svg class="icon icon-20" aria-hidden="true"><use xlink:href="#check-circle"></use></svg>您已点过赞啦!',
                    backgroundColor: "var(--bs-info)",
                    className: "info",
                }).showToast();//提示已经点过赞
                return '';
            } else {
                axios.post(Config.homeUrl + '/action/cuteen?content', {
                    cid: dataID
                })
                    .then(function (response) {
                        like.classList.remove('btn-outline-primary');
                        like.classList.add('btn-primary');
                        Cookies.set('upstar', dataID, {expires: 7});
                        num.innerText++;
                        Toastify({
                            duration: 3000,
                            position: 'center',
                            text: '<svg class="icon icon-20" aria-hidden="true"><use xlink:href="#check-circle"></use></svg>点赞成功！感谢支持~',
                            backgroundColor: "var(--bs-success)",
                            className: "info",
                        }).showToast();//点赞成功！感谢支持~
                        return '';
                    })
                    .catch(function (error) {
                        Toastify({
                            duration: 3000,
                            position: 'center',
                            text: '<svg class="icon icon-20" aria-hidden="true"><use xlink:href="#x-circle"></use></svg>点赞失败!提交错误!',
                            backgroundColor: "var(--bs-danger)",
                            className: "info",
                        }).showToast();
                        console.log(error);
                    });
            }
        }
        return false;

    },
    enterSearch: function (item) {
        if (event.which === 13) {
            Cuteen.startSearch(item);
        }
    },
    startSearch: function (item) {
        const c = item.value;
        if (!c || c === '') {
            item.setAttribute('placeholder', '你还没有输入任何信息');
            return;
        }
        const model = document.getElementById('closeSearch');
        model.click();
        setTimeout(function () {
            const t = Config.homeUrl + '/search/' + c;
            window.open(t, '_blank');
        }, 100);

    },
    ajaxNext: function () {
        const link = document.getElementsByClassName('next')[0];
        const href = link.getAttribute('href');
        const paras = document.getElementsByClassName('NextLoading');
        document.getElementById('NextButton').remove();
        link.onclick = function (e) {
            if (href !== undefined) {
                axios.interceptors.request.use(config => {
                    if (paras !== null) {
                        while (paras[0]) {
                            paras[0].remove();
                        }
                    }
                    link.insertAdjacentHTML('beforeend', '<button class="btn btn-primary col-3 mx-auto rounded-pill NextLoading" type="button" disabled>加载中...</button>');
                    return config
                }, error => {
                    return Promise.reject(error)
                })
                axios({
                    url: href,
                    method: 'get',
                }).then(function (response) {
                    const parser = new DOMParser();
                    const convert = parser.parseFromString(response.data, "text/html");//字符串转换为dom
                    const error = new RegExp('Typecho_Widget_Exception');
                    if (error.test(response.data)) {
                        Toastify({
                            duration: 3000,
                            position: 'center',
                            text: '<svg class="icon icon-20" aria-hidden="true"><use xlink:href="#x-circle"></use></svg>加载失败!回传参数错误!',
                            backgroundColor: "var(--bs-danger)",
                            className: "info",
                        }).showToast();
                        console.log(response.data);
                    } else {
                        const list = convert.getElementsByClassName('article');//获取新列表
                        const newHrefPosition = convert.getElementsByClassName('next')[0];
                        if (newHrefPosition!==undefined) {
                            var newhref = newHrefPosition.getAttribute('href');
                        }
                        let b = '';
                        for (let v of list) {
                            b += v.outerHTML;
                        }
                        if (paras !== null) {
                            while (paras[0]) {
                                paras[0].remove();
                            }
                        }
                        const insertPosition = document.getElementById('content');
                        if (insertPosition.getElementsByClassName('row').length > 0) {
                            insertPosition.getElementsByClassName('row')[0].insertAdjacentHTML('beforeend', b);//插入新列表卡片模式
                        } else {
                            insertPosition.insertAdjacentHTML('beforeend', b);//插入新列表列表模式
                        }
                        if (newHrefPosition!==undefined) {
                            link.insertAdjacentHTML('beforeend', '<button id="NextButton" onclick="Cuteen.ajaxNext()" class="btn btn-primary col-3 mx-auto rounded-pill">点击加载更多</button>')
                            link.setAttribute('href', newhref);
                        }
                        let lazy = new LazyLoad();
                        lazy.update();
                        return false;
                    }
                }).catch(function (error) {
                    Toastify({
                        duration: 3000,
                        position: 'center',
                        text: '<svg class="icon icon-20" aria-hidden="true"><use xlink:href="#x-circle"></use></svg>加载失败!参数错误',
                        backgroundColor: "var(--bs-danger)",
                        className: "info",
                    }).showToast();
                    console.log(error);
                });
                e.stopPropagation(); // 阻止冒泡到父级的点击事件
            }
            return false;
        }
        return false;
    },
    tocDisplay: function () {
        const tocEle = document.getElementById('TOC-text');
        if (tocEle !== undefined) {
            const headerEl = 'h1,h2,h3,h4,h5,h6', content = '#post';
            tocbot.init({
                tocSelector: '#TOC-text',
                contentSelector: content,
                headingSelector: headerEl,
                headingsOffset: 70
            });
        }
        return false;
    },
    noCopy: function () {
        if (Config.noConsole === 'yes') {
            ((function () {
                var callbacks = [], timeLimit = 50, open = false;
                setInterval(loop, 1);
                return {
                    addListener: function (fn) {
                        callbacks.push(fn);
                    },
                    cancleListenr: function (fn) {
                        callbacks = callbacks.filter(function (v) {
                            return v !== fn;
                        });
                    }
                }

                function loop() {
                    var startTime = new Date();
                    debugger;
                    if (new Date() - startTime > timeLimit) {
                        if (!open) {
                            callbacks.forEach(function (fn) {
                                fn.call(null);
                            });
                        }
                        open = true;
                        window.stop();
                        alert('大佬别再扒了！赶紧买一份吧ヽ(￣ω￣(￣ω￣〃)ゝ');
                        document.body.innerHTML = "";
                    } else {
                        open = false;
                    }
                }
            })()).addListener(function () {
                window.location.reload();
            });
        }
    },
    InitOwO: function () {
        if (document.getElementById('OwO') !== null) {
            new OwO({
                logo: 'OwO表情',
                container: document.getElementById('OwO'),
                target: document.getElementById('comment-textarea'),
                position: 'down',
                width: '100%',
                maxHeight: '250px',
                api: Config.staticUrl + 'emoji/emoji.json'
            });
        }
    },
    darkMode: function () {
        const btn = document.getElementsByTagName('html')[0];
        const svg = document.querySelector('#darkMode use');
        const svg2 = document.querySelector('#mobileDarkMode use');
        const icon = svg.getAttribute('xlink:href');
        const hb = '<div class="Cuteen_DarkSky">\n' +
            '  <div class="Cuteen_DarkPlanet">\n' +
            '  </div>\n' +
            '</div>';
        btn.insertAdjacentHTML('beforeend', hb);
        toggleClass(btn, 'dark-mode');
        const sky = document.getElementsByClassName('Cuteen_DarkSky')[0];
        if (sky !== undefined) {
            const DarkMode = Cookies.get('DarkMode');
            if (DarkMode === '0') {
                Cookies.set('DarkMode', 1, {expires: 3});
                console.log('夜间模式关闭');
            } else {
                Cookies.set('DarkMode', 0, {expires: 3});
                console.log('夜间模式开启')
            }
            setTimeout(function () {
                if (sky.style.opacity !== 0) {
                    var num = 10;
                    var st = setInterval(function () {
                        num--;
                        sky.style.opacity = num / 10;
                        if (num <= 0) {
                            clearInterval(st);
                            sky.remove();
                        }
                    }, 30);
                }
            }, 2e3)

        }
        if (icon === '#moon') {
            svg.setAttribute('xlink:href', '#sun');
            svg2.setAttribute('xlink:href', '#sun');
            document.documentElement.style.setProperty('--bs-light', '#121212');
            document.documentElement.style.setProperty('--bs-dark', 'rgba(255, 255, 255, 0.8)');
        } else {
            svg.setAttribute('xlink:href', '#moon');
            svg2.setAttribute('xlink:href', '#moon');
            document.documentElement.style.removeProperty('--bs-light');
            document.documentElement.style.removeProperty('--bs-dark');
        }

    },
    darkModeCheck: function () {
        const btn = document.getElementsByTagName('html')[0];
        const svg = document.querySelector('#darkMode use');
        const svg2 = document.querySelector('#mobileDarkMode use');
        if (Config.darkSet === '2') {
            svg.setAttribute('xlink:href', '#sun');
            svg2.setAttribute('xlink:href', '#sun');
            document.documentElement.style.setProperty('--bs-light', '#121212');
            document.documentElement.style.setProperty('--bs-dark', 'rgba(255, 255, 255, 0.8)');
            document.documentElement.classList.add('dark-mode');
            return '';
        } else if (Config.darkSet === '1') {
            svg.setAttribute('xlink:href', '#moon');
            svg2.setAttribute('xlink:href', '#moon');
            document.documentElement.style.removeProperty('--bs-light');
            document.documentElement.style.removeProperty('--bs-dark');
            document.documentElement.classList.remove('dark-mode');
            return '';
        }
        if (Config.darkSet === '0' && Cookies.get('DarkMode') === undefined) {
            if (new Date().getHours() >= 20 || new Date().getHours() < 6) {
                svg.setAttribute('xlink:href', '#sun');
                svg2.setAttribute('xlink:href', '#sun');
                document.documentElement.style.setProperty('--bs-light', '#121212');
                document.documentElement.style.setProperty('--bs-dark', 'rgba(255, 255, 255, 0.8)');
                document.documentElement.classList.add('dark-mode');
                console.log('夜间模式开启');
                return '';
            } else {
                svg.setAttribute('xlink:href', '#moon');
                svg2.setAttribute('xlink:href', '#moon');
                document.documentElement.style.removeProperty('--bs-light');
                document.documentElement.style.removeProperty('--bs-dark');
                document.documentElement.classList.remove('dark-mode');
                console.log('夜间模式关闭');
                return '';
            }
        } else {
            if (Cookies.get('DarkMode') === '0') {
                svg.setAttribute('xlink:href', '#moon');
                svg2.setAttribute('xlink:href', '#moon');
                document.documentElement.style.removeProperty('--bs-light');
                document.documentElement.style.removeProperty('--bs-dark');
                document.documentElement.classList.remove('dark-mode');
                return '';
            } else if (Cookies.get('DarkMode') === '1') {
                svg.setAttribute('xlink:href', '#sun');
                svg2.setAttribute('xlink:href', '#sun');
                document.documentElement.style.setProperty('--bs-light', '#121212');
                document.documentElement.style.setProperty('--bs-dark', 'rgba(255, 255, 255, 0.8)');
                document.documentElement.classList.add('dark-mode');
                return '';
            }
        }
    },
    themeColor: function (obj) {
        switch (obj) {
            case 'primary':
                document.documentElement.style.setProperty('--bs-primary', '#0d6efd');
                document.documentElement.style.setProperty('--bs-primary_opacity_1', 'rgba(13, 110, 253, 0.1)');
                document.documentElement.style.setProperty('--bs-primary_opacity_2', 'rgba(13, 110, 253, 0.2)');
                document.documentElement.style.setProperty('--bs-primary_opacity_3', 'rgba(13, 110, 253, 0.3)');
                document.documentElement.style.setProperty('--bs-primary_opacity_4', 'rgba(13, 110, 253, 0.4)');
                document.documentElement.style.setProperty('--bs-primary_opacity_5', 'rgba(13, 110, 253, 0.5)');
                document.documentElement.style.setProperty('--bs-primary_opacity_6', 'rgba(13, 110, 253, 0.6)');
                document.documentElement.style.setProperty('--bs-primary_opacity_7', 'rgba(13, 110, 253, 0.7)');
                document.documentElement.style.setProperty('--bs-primary_opacity_8', 'rgba(13, 110, 253, 0.8)');
                document.documentElement.style.setProperty('--bs-primary_opacity_9', 'rgba(13, 110, 253, 0.9)');
                Cookies.set('themeColor', 'primary', {expires: 3});
                break;
            case 'danger':
                document.documentElement.style.setProperty('--bs-primary', '#dc3545');
                document.documentElement.style.setProperty('--bs-primary_opacity_1', 'rgba(220, 53, 69, 0.1)');
                document.documentElement.style.setProperty('--bs-primary_opacity_2', 'rgba(220, 53, 69, 0.2)');
                document.documentElement.style.setProperty('--bs-primary_opacity_3', 'rgba(220, 53, 69, 0.3)');
                document.documentElement.style.setProperty('--bs-primary_opacity_4', 'rgba(220, 53, 69, 0.4)');
                document.documentElement.style.setProperty('--bs-primary_opacity_5', 'rgba(220, 53, 69, 0.5)');
                document.documentElement.style.setProperty('--bs-primary_opacity_6', 'rgba(220, 53, 69, 0.6)');
                document.documentElement.style.setProperty('--bs-primary_opacity_7', 'rgba(220, 53, 69, 0.7)');
                document.documentElement.style.setProperty('--bs-primary_opacity_8', 'rgba(220, 53, 69, 0.8)');
                document.documentElement.style.setProperty('--bs-primary_opacity_9', 'rgba(220, 53, 69, 0.9)');
                Cookies.set('themeColor', 'danger', {expires: 3});
                break;
            case 'info':
                document.documentElement.style.setProperty('--bs-primary', '#17a2b8');
                document.documentElement.style.setProperty('--bs-primary_opacity_1', 'rgba(23, 162, 184, 0.1)');
                document.documentElement.style.setProperty('--bs-primary_opacity_2', 'rgba(23, 162, 184, 0.2)');
                document.documentElement.style.setProperty('--bs-primary_opacity_3', 'rgba(23, 162, 184, 0.3)');
                document.documentElement.style.setProperty('--bs-primary_opacity_4', 'rgba(23, 162, 184, 0.4)');
                document.documentElement.style.setProperty('--bs-primary_opacity_5', 'rgba(23, 162, 184, 0.5)');
                document.documentElement.style.setProperty('--bs-primary_opacity_6', 'rgba(23, 162, 184, 0.6)');
                document.documentElement.style.setProperty('--bs-primary_opacity_7', 'rgba(23, 162, 184, 0.7)');
                document.documentElement.style.setProperty('--bs-primary_opacity_8', 'rgba(23, 162, 184, 0.8)');
                document.documentElement.style.setProperty('--bs-primary_opacity_9', 'rgba(23, 162, 184, 0.9)');
                Cookies.set('themeColor', 'info', {expires: 3});
                break;
            case 'success':
                document.documentElement.style.setProperty('--bs-primary', '#28a745');
                document.documentElement.style.setProperty('--bs-primary_opacity_1', 'rgba(40, 167, 69, 0.1)');
                document.documentElement.style.setProperty('--bs-primary_opacity_2', 'rgba(40, 167, 69, 0.2)');
                document.documentElement.style.setProperty('--bs-primary_opacity_3', 'rgba(40, 167, 69, 0.3)');
                document.documentElement.style.setProperty('--bs-primary_opacity_4', 'rgba(40, 167, 69, 0.4)');
                document.documentElement.style.setProperty('--bs-primary_opacity_5', 'rgba(40, 167, 69, 0.5)');
                document.documentElement.style.setProperty('--bs-primary_opacity_6', 'rgba(40, 167, 69, 0.6)');
                document.documentElement.style.setProperty('--bs-primary_opacity_7', 'rgba(40, 167, 69, 0.7)');
                document.documentElement.style.setProperty('--bs-primary_opacity_8', 'rgba(40, 167, 69, 0.8)');
                document.documentElement.style.setProperty('--bs-primary_opacity_9', 'rgba(40, 167, 69, 0.9)');
                Cookies.set('themeColor', 'success', {expires: 3});
                break;
            case 'warning':
                document.documentElement.style.setProperty('--bs-primary', '#ffc107');
                document.documentElement.style.setProperty('--bs-primary_opacity_1', 'rgba(255, 193, 7, 0.1)');
                document.documentElement.style.setProperty('--bs-primary_opacity_2', 'rgba(255, 193, 7, 0.2)');
                document.documentElement.style.setProperty('--bs-primary_opacity_3', 'rgba(255, 193, 7, 0.3)');
                document.documentElement.style.setProperty('--bs-primary_opacity_4', 'rgba(255, 193, 7, 0.4)');
                document.documentElement.style.setProperty('--bs-primary_opacity_5', 'rgba(255, 193, 7, 0.5)');
                document.documentElement.style.setProperty('--bs-primary_opacity_6', 'rgba(255, 193, 7, 0.6)');
                document.documentElement.style.setProperty('--bs-primary_opacity_7', 'rgba(255, 193, 7, 0.7)');
                document.documentElement.style.setProperty('--bs-primary_opacity_8', 'rgba(255, 193, 7, 0.8)');
                document.documentElement.style.setProperty('--bs-primary_opacity_9', 'rgba(255, 193, 7, 0.9)');
                Cookies.set('themeColor', 'warning', {expires: 3});
                break;
            default:

        }
    },
    themeColorCheck: function () {
        const themeColor = Cookies.get('themeColor');
        if (themeColor === 'primary') {
            this.themeColor('primary');
            document.querySelector('.btn-check[value="primary"]').setAttribute('checked', 'checked');
        } else if (themeColor === 'warning') {
            this.themeColor('warning');
            document.querySelector('.btn-check[value="warning"]').setAttribute('checked', 'checked');
        } else if (themeColor === 'success') {
            this.themeColor('success');
            document.querySelector('.btn-check[value="success"]').setAttribute('checked', 'checked');
        } else if (themeColor === 'info') {
            document.querySelector('.btn-check[value="info"]').setAttribute('checked', 'checked');
            this.themeColor('info');
        } else if (themeColor === 'danger') {
            this.themeColor('danger');
            document.querySelector('.btn-check[value="danger"]').setAttribute('checked', 'checked');
        }
    }
}

function PjaxLoad() {
    Cuteen.initTheme();
    Cuteen.darkModeCheck();
    Cuteen.mobileAside();
    Cuteen.mobileMusicToggle();
    Cuteen.tocDisplay();
    Cuteen.noCopy();
    Cuteen.codeLight();
    Cuteen.InitOwO();
}

document.addEventListener('DOMContentLoaded', function (event) {
    Cuteen.themeColorCheck();
    PjaxLoad();
});
window.onscroll = function () {
    Cuteen.navBar();
};




