// ==UserScript==
// @name         就不装云管家
// @namespace    MotooriKashin
// @version      0.0.1
// @description  网页端百度云直接下载文件，就是不装百度云管家，哼！
// @author       MotooriKashin
// @homepage     https://github.com/MotooriKashin/BaiduYun-Escape
// @supportURL   https://github.com/MotooriKashin/BaiduYun-Escape/issues
// @icon         https://pan.baidu.com/ppres/static/images/favicon.ico
// @match        *://pan.baidu.com/disk/home*
// @match        *://pan.baidu.com/disk/main*
// @grant        none
// @license      MIT
// ==/UserScript==

/**
 * 脚本主体，负责提供脚本与模块间沟通的桥梁
 */
(function () {
    const modules = {};
    
/**/modules["index.js"] = /*** ./dist/index.js ***/
`/**
 * 脚本主体，负责提供脚本与模块间沟通的桥梁
 */
(function () {
    const modules = {};
    /* 模块占位 */
    class API {
        GM = GM;
        Name = GM.info.script.name;
        Virsion = GM.info.script.version;
        Handler = [GM.info.scriptHandler, GM.info.version].join(" ");
    }
    new Function("API", "MODULES", Reflect.get(modules, "modules.js"))(new API(), modules);
})();

//# sourceURL=API://@BaiduYun-Escape/index.js`;
/*!***********************!*/
/**/modules["modules.js"] = /*** ./dist/modules.js ***/
`/**
 * 本模块是脚本模块主入口
 */
(function () {
    // @ts-expect-error 接收模块字符串
    const modules = MODULES;
    /**
     * 已载入模块
     */
    const modulesLoaded = [];
    const shadow = new Proxy(API, {
        get: (t, p) => {
            return (Reflect.has(window, p) && typeof window[p] !== "function") ? Reflect.get(window, p) : (Reflect.get(t, p) || (Reflect.has(modules["apply.json"], p) ? (importModule(modules["apply.json"][p], {}),
                Reflect.get(t, p)) : undefined));
        },
        set: (t, p, value) => {
            (Reflect.has(window, p) && typeof window[p] !== "function") ? Reflect.set(window, p, value) : Reflect.set(t, p, value);
            return true;
        }
    });
    /**
     * 载入模块
     * @param name 模块名字
     * @param args 传递给对方的全局变量：格式{变量名：变量值}
     * @param force 是否强制载入，一般模块只会载入一次，需要二次载入请将本值设为真
     */
    function importModule(name, args = {}, force) {
        if (!name)
            return Object.keys(modules);
        if (modulesLoaded.includes(name) && !force)
            return modulesLoaded;
        if (Reflect.has(modules, name)) {
            !modulesLoaded.includes(name) && modulesLoaded.push(name);
            new Function("API", "xhr", "toast", "importModule", ...Object.keys(args), Reflect.get(modules, name))(shadow, Reflect.get(shadow, "xhr"), Reflect.get(shadow, "toast"), importModule, ...Object.keys(args).reduce((s, d) => {
                s.push(args[d]);
                return s;
            }, []));
        }
    }
    Reflect.set(shadow, "importModule", importModule);
    Reflect.set(shadow, "getModule", (name) => Reflect.get(modules, name));
    new Function("API", Reflect.get(modules, "toast.js"))(shadow);
    new Function("API", Reflect.get(modules, "xhr.js"))(shadow);
    importModule("ui.js");
    Reflect.set(window, "API", API);
})();

//# sourceURL=API://@BaiduYun-Escape/modules.js`;
/*!***********************!*/
/**/modules["toast.js"] = /*** ./dist/toast.js ***/
`(function () {
    class ToastContainer extends HTMLElement {
        shadow = this.attachShadow({ mode: "closed" });
        constructor() {
            super();
        }
    }
    customElements.define("toast-container", ToastContainer);
    class Toast {
        /**
         * 通知节点
         */
        static container;
        /**
         * 通知样式
         */
        static style;
        /**
         * 判定\`body\`是否存在
         */
        static check;
        /**
         * 未呈现通知计数
         */
        static count = 0;
        /**
         * 动画呈现帧数
         */
        static sence = 60;
        /**
         * 自定义节点
         */
        static root;
        static flag;
        static init() {
            this.root = document.createElement("toast-container");
            this.container = document.createElement("div");
            this.style = document.createElement("style");
            this.container.setAttribute("id", "tsaot-container");
            this.container.setAttribute("class", "toast-top-right");
            this.style.textContent = API.getModule("toastr.css");
            this.root.shadow.appendChild(this.style);
            this.root.shadow.appendChild(this.container);
        }
        static show(type, ...msg) {
            if (!document.body) {
                if (this.check)
                    return;
                return setTimeout(() => { this.check = true; this.show(type, ...msg); });
            }
            if (!this.flag) {
                document.body.appendChild(this.root);
                this.flag = true;
            }
            let item = document.createElement("div");
            item.setAttribute("class", "toast toast-" + type);
            item.setAttribute("aria-live", "assertive");
            item.setAttribute("style", "visibility: hidden;position: absolute");
            setTimeout(() => {
                if (this.count > 0)
                    this.count--;
                item = this.container.insertBefore(item, this.container.firstChild);
                item.appendChild(this.msg(...msg));
                this.come(item);
                setTimeout(() => this.quit(item), 4 * 1000);
            }, this.count * 250);
            this.count++;
        }
        static come(item, i = 0) {
            let height = item.clientHeight;
            item.setAttribute("style", "display: none;");
            let timer = setInterval(() => {
                i++;
                item.setAttribute("style", "padding-top: " + i / 4 + "px;padding-bottom: " + i / 4 + "px;height: " + i / 60 * height + "px;");
                if (i === this.sence) {
                    clearInterval(timer);
                    item.removeAttribute("style");
                }
            });
        }
        static quit(item, i = this.sence) {
            let height = item.clientHeight;
            let timer = setInterval(() => {
                i--;
                item.setAttribute("style", "padding-top: " + i / 4 + "px;padding-bottom: " + i / 4 + "px;height: " + i / 60 * height + "px;");
                if (i === 0) {
                    clearInterval(timer);
                    item.remove();
                }
            });
        }
        static msg(...msg) {
            let div = document.createElement("div");
            div.setAttribute("class", "toast-message");
            div.innerHTML = msg.reduce((s, d, i) => {
                s = s + (i ? "<br />" : "") + String(d);
                return s;
            }, "");
            return div;
        }
    }
    Toast.init();
    // @ts-ignore
    API.toast = (...msg) => { Toast.show("info", ...msg); };
    Reflect.set(Reflect.get(API, "toast"), "info", (...msg) => Toast.show("info", ...msg));
    Reflect.set(Reflect.get(API, "toast"), "success", (...msg) => Toast.show("success", ...msg));
    Reflect.set(Reflect.get(API, "toast"), "warning", (...msg) => Toast.show("warning", ...msg));
    Reflect.set(Reflect.get(API, "toast"), "error", (...msg) => Toast.show("error", ...msg));
})();

//# sourceURL=API://@BaiduYun-Escape/toast.js`;
/*!***********************!*/
/**/modules["ui.js"] = /*** ./dist/ui.js ***/
`/**
 * 建立UI相关控件
 */
(function () {
    class DownloadIcon extends HTMLElement {
        shadow = this.attachShadow({ mode: "closed" });
        constructor() {
            super();
            const div = DownloadIcon.addElement("div", { class: "stage" }, this.shadow, API.getModule("icon.txt"));
            DownloadIcon.addCss(API.getModule("ui.css"), "", this.shadow);
            div.onmouseover = () => div.style.opacity = "0.8";
            setTimeout(() => {
                div.style.opacity = "0";
                div.onmouseout = () => div.style.opacity = "0";
            }, 2e3);
        }
        /**
         * 创建HTML节点
         * @param tag 节点名称
         * @param attribute 节点属性对象
         * @param innerHTML 节点的innerHTML
         * @param top 是否在父节点中置顶
         * @param replaced 替换节点而不是添加，被替换的节点，将忽略父节点相关参数
         */
        static addElement(tag, attribute, parrent, innerHTML, top, replaced) {
            let element = document.createElement(tag);
            attribute && (Object.entries(attribute).forEach(d => element.setAttribute(d[0], d[1])));
            parrent = parrent || document.body;
            innerHTML && (element.innerHTML = innerHTML);
            replaced ? replaced.replaceWith(element) : top ? parrent.insertBefore(element, parrent.firstChild) : parrent.appendChild(element);
            return element;
        }
        /**
         * 添加css样式
         * @param txt css文本
         * @param id 样式ID，用于唯一标记
         * @param parrent 添加到的父节点，默认为head
         */
        static async addCss(txt, id, parrent) {
            parrent = parrent || document.head;
            const style = document.createElement("style");
            style.setAttribute("type", "text/css");
            id && !parrent.querySelector(\`#\${id}\`) && style.setAttribute("id", id);
            style.appendChild(document.createTextNode(txt));
            parrent.appendChild(style);
        }
    }
    customElements.define('download-icon', DownloadIcon);
    const div = document.createElement("download-icon");
    div.addEventListener("click", async (e) => {
        const files = API.Yunapi.getFile();
        !files[0] && toast.warning(\`Are you kidding me?!\`, "请选择且只选择一个文件 →_→");
        const urls = await API.Yunapi.getUrl(files);
        if (urls[0] && urls[0].info.dlink) {
            toast.success("ef2：尝试拉起IDM~");
            const ef2 = (await import("https://cdn.jsdelivr.net/gh/MotooriKashin/ef2/dist/ef2.js")).default;
            ef2.sendLinkToIDM({
                url: urls[0].info.dlink
            });
        }
        else
            toast.error(\`未获取到下载链接，你确定选择的是一个文件？\`);
    });
    document.body.appendChild(div);
})();

//# sourceURL=API://@BaiduYun-Escape/ui.js`;
/*!***********************!*/
/**/modules["units.js"] = /*** ./dist/units.js ***/
`/**
 * 百度云相关API
 */
(function () {
    const search = {
        apn_id: "1_0",
        /**
         * 250528（官方）、498065、309847、778750
         */
        app_id: "778750",
        channel: "android_6.0.1_oppo%20R11_bd-netdisk_1018849x",
        clienttype: "1",
        dlink: "1",
        freeisp: "0",
        media: "1",
        network_type: "wifi",
        nom3u8: "1",
        origin: "dlna",
        queryfree: "0",
        type: "M3U8_FLV_264_480",
        version: "9.6.73"
    };
    class BaiduYunAPI {
        /**
         * 检索被选择的文件
         * @returns 被选文件数据
         */
        static getFile() {
            try {
                let files = require('system-core:context/context.js').instanceForSystem.list.getSelected();
                //window.require("disk-system:widget/pageModule/list/listInit.js").getCheckedItems();
                files = files.filter(d => d.isdir === 0);
                return files;
            }
            catch (e) {
                return this.makeFilePath();
            }
        }
        static makeFilePath() {
            const item = document.querySelector(".nd-table__body-row.selected");
            if (item) {
                const a = item.querySelector(".nd-list-name__title-text");
                if (a) {
                    const obj = this.urlObj(location.href);
                    let path = obj.path ? obj.path.replace(/%2F/g, "/") : "/";
                    path = path.endsWith("/") ? path : path + "/";
                    return [{ path: decodeURIComponent(path) + a.title }];
                }
            }
            return [];
        }
        /**
         * 获取被选择的文件
         * @param {[]} files 文件数组
         */
        static async getUrl(files) {
            let datas = await Promise.all(files.reduce((d, i) => {
                toast(\`文件：\${i.path}\`);
                d.push(xhr.get(this.objUrl("https://pan.baidu.com/api/mediainfo", Object.assign(search, { path: encodeURIComponent(i.path) }))));
                return d;
            }, []));
            datas = datas.reduce((d, i) => {
                d.push(JSON.parse(i));
                return d;
            }, []);
            return datas;
        }
        /**
         * search参数对象拼合回URL
         * @param url URL主体，可含search参数
         * @param obj search参数对象
         * @returns 拼合的URL
         */
        static objUrl(url, obj) {
            let data = this.urlObj(url);
            obj = typeof obj === "object" ? obj : {};
            data = Object.assign(data, obj);
            let arr = [], i = 0;
            for (let key in data) {
                if (data[key] !== undefined && data[key] !== null) {
                    arr[i] = key + "=" + data[key];
                    i++;
                }
            }
            if (url)
                url = url + "?" + arr.join("&");
            else
                url = arr.join("&");
            if (url.charAt(url.length - 1) == "?")
                url = url.split("?")[0];
            return url;
        }
        /**
         * 提取URL search参数对象
         * @param url 原URL
         * @returns search参数对象
         */
        static urlObj(url = "") {
            return url.split('?').reduce((s, d) => {
                d.split('&').forEach(d => {
                    d.includes("=") && (d = d.split("#")[0]) && (s[d.split('=')[0]] = d.split('=')[1] || "");
                });
                return s;
            }, {});
        }
    }
    Reflect.set(API, "Yunapi", BaiduYunAPI);
})();

//# sourceURL=API://@BaiduYun-Escape/units.js`;
/*!***********************!*/
/**/modules["xhr.js"] = /*** ./dist/xhr.js ***/
`(function () {
    class Xhr {
        static catches = [];
        static log = () => this.catches;
        /**
         * \`XMLHttpRequest\`的\`Promise\`封装
         * @param details 以对象形式传递的参数，注意\`onload\`回调会覆盖Promise结果
         * @returns \`Promise\`托管的请求结果或者报错信息，\`async = false\` 时除外，直接返回结果
         */
        static xhr(details) {
            details.method == "POST" && (details.headers = details.headers || {}, !details.headers["Content-Type"] && Reflect.set(details.headers, "Content-Type", "application/x-www-form-urlencoded"));
            if (details.hasOwnProperty("async") && Boolean(details.async) === false) {
                let xhr = new XMLHttpRequest();
                xhr.open(details.method || 'GET', details.url, false);
                details.responseType && (xhr.responseType = details.responseType);
                details.credentials && (xhr.withCredentials = true);
                details.headers && (Object.entries(details.headers).forEach(d => xhr.setRequestHeader(d[0], d[1])));
                details.timeout && (xhr.timeout = details.timeout);
                xhr.send(details.data);
                return xhr.response;
            }
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                xhr.open(details.method || 'GET', details.url);
                details.responseType && (xhr.responseType = details.responseType);
                details.headers && (Object.entries(details.headers).forEach(d => xhr.setRequestHeader(d[0], d[1])));
                details.credentials && (xhr.withCredentials = true);
                details.timeout && (xhr.timeout = details.timeout);
                xhr.onabort = details.onabort || ((ev) => reject(ev));
                xhr.onerror = details.onerror || ((ev) => reject(ev));
                details.onloadstart && (xhr.onloadstart = details.onloadstart);
                details.onprogress && (xhr.onprogress = details.onprogress);
                details.onreadystatechange && (xhr.onreadystatechange = details.onreadystatechange);
                xhr.ontimeout = details.ontimeout || ((ev) => reject(ev));
                xhr.onload = details.onload || (() => resolve(xhr.response));
                xhr.send(details.data);
            });
        }
        /**
         * \`XMLHttpRequest\`的GET方法的快捷模式
         * 将url独立为第一个参数，剩余参数放在第二个参数，方便快速发送ajax
         * **注意本方法默认带上了cookies，如需禁用请在details中提供headers对象并将其credentials属性置为false**
         * @param url url链接
         * @param details url外的参数对象
         * @returns \`Promise\`托管的请求结果或者报错信息，\`async = false\` 时除外，直接返回结果
         */
        static get(url, details = {}) {
            !Reflect.has(details, "credentials") && (details.credentials = true);
            // @ts-ignore
            return this.xhr({ url: url, ...details });
        }
        /**
         * \`XMLHttpRequest\`的POST方法的快捷模式
         * 将url、data，Content-Type分别独立为参数，剩余参数放在末尾，方便快速发送ajax
         * **注意本方法默认带上了cookies，如需禁用请在details中提供headers对象并将其credentials属性置为false**
         * @param url url链接
         * @param data post数据
         * @param contentType 发送数据使用的编码，默认"application/x-www-form-urlencoded"
         * @param details url、data外的参数对象
         * @returns \`Promise\`托管的请求结果或者报错信息，\`async = false\` 时除外，直接返回结果
         */
        static post(url, data, contentType = "application/x-www-form-urlencoded", details = {}) {
            !Reflect.has(details, "credentials") && (details.credentials = true);
            details.headers = { "Content-Type": contentType, ...details.headers };
            // @ts-ignore
            return this.xhr({ url: url, method: "POST", data: data, ...details });
        }
    }
    Reflect.set(API, "xhr", new Proxy(Xhr.xhr, { get: (t, p) => Xhr[p] }));
})();

//# sourceURL=API://@BaiduYun-Escape/xhr.js`;
/*!***********************!*/
/**/modules["apply.json"] = /*** ./assets/apply.json ***/
{
    "Yunapi": "units.js",
    "observerAddedNodes": "nodeObserver.js",
    "removeObserver": "nodeObserver.js"
}
/*!***********************!*/
/**/modules["icon.txt"] = /*** ./assets/icon.txt ***/
`<svg viewBox="0 0 24 24"><g><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"></path></g></svg>`;
/*!***********************!*/
/**/modules["toastr.css"] = /*** ./assets/toastr.css ***/
`/*
 * Note that this is toastr v2.1.3, the "latest" version in url has no more maintenance,
 * please go to https://cdnjs.com/libraries/toastr.js and pick a certain version you want to use,
 * make sure you copy the url from the website since the url may change between versions.
 * */
.toast-title {
  font-weight: bold;
}
.toast-message {
  -ms-word-wrap: break-word;
  word-wrap: break-word;
}
.toast-message a,
.toast-message label {
  color: #FFFFFF;
}
.toast-message a:hover {
  color: #CCCCCC;
  text-decoration: none;
}
.toast-close-button {
  position: relative;
  right: -0.3em;
  top: -0.3em;
  float: right;
  font-size: 20px;
  font-weight: bold;
  color: #FFFFFF;
  -webkit-text-shadow: 0 1px 0 #ffffff;
  text-shadow: 0 1px 0 #ffffff;
  opacity: 0.8;
  -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=80);
  filter: alpha(opacity=80);
  line-height: 1;
}
.toast-close-button:hover,
.toast-close-button:focus {
  color: #000000;
  text-decoration: none;
  cursor: pointer;
  opacity: 0.4;
  -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=40);
  filter: alpha(opacity=40);
}
.rtl .toast-close-button {
  left: -0.3em;
  float: left;
  right: 0.3em;
}
/*Additional properties for button version
 iOS requires the button element instead of an anchor tag.
 If you want the anchor version, it requires \`href="#"\`.*/
button.toast-close-button {
  padding: 0;
  cursor: pointer;
  background: transparent;
  border: 0;
  -webkit-appearance: none;
}
.toast-top-center {
  top: 0;
  right: 0;
  width: 100%;
}
.toast-bottom-center {
  bottom: 0;
  right: 0;
  width: 100%;
}
.toast-top-full-width {
  top: 0;
  right: 0;
  width: 100%;
}
.toast-bottom-full-width {
  bottom: 0;
  right: 0;
  width: 100%;
}
.toast-top-left {
  top: 12px;
  left: 12px;
}
.toast-top-right {
  top: 12px;
  right: 12px;
}
.toast-bottom-right {
  right: 12px;
  bottom: 12px;
}
.toast-bottom-left {
  bottom: 12px;
  left: 12px;
}
#tsaot-container {
  position: fixed;
  z-index: 999999;
  pointer-events: none;
  /*overrides*/
}
#tsaot-container * {
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
#tsaot-container > div {
  position: relative;
  pointer-events: auto;
  overflow: hidden;
  margin: 0 0 6px;
  padding: 15px 15px 15px 50px;
  width: 300px;
  -moz-border-radius: 3px 3px 3px 3px;
  -webkit-border-radius: 3px 3px 3px 3px;
  border-radius: 3px 3px 3px 3px;
  background-position: 15px center;
  background-repeat: no-repeat;
  -moz-box-shadow: 0 0 12px #999999;
  -webkit-box-shadow: 0 0 12px #999999;
  box-shadow: 0 0 12px #999999;
  color: #FFFFFF;
  opacity: 0.8;
  -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=80);
  filter: alpha(opacity=80);
}
#tsaot-container > div.rtl {
  direction: rtl;
  padding: 15px 50px 15px 15px;
  background-position: right 15px center;
}
#tsaot-container > div:hover {
  -moz-box-shadow: 0 0 12px #000000;
  -webkit-box-shadow: 0 0 12px #000000;
  box-shadow: 0 0 12px #000000;
  opacity: 1;
  -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);
  filter: alpha(opacity=100);
  cursor: pointer;
}
#tsaot-container > .toast-info {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGwSURBVEhLtZa9SgNBEMc9sUxxRcoUKSzSWIhXpFMhhYWFhaBg4yPYiWCXZxBLERsLRS3EQkEfwCKdjWJAwSKCgoKCcudv4O5YLrt7EzgXhiU3/4+b2ckmwVjJSpKkQ6wAi4gwhT+z3wRBcEz0yjSseUTrcRyfsHsXmD0AmbHOC9Ii8VImnuXBPglHpQ5wwSVM7sNnTG7Za4JwDdCjxyAiH3nyA2mtaTJufiDZ5dCaqlItILh1NHatfN5skvjx9Z38m69CgzuXmZgVrPIGE763Jx9qKsRozWYw6xOHdER+nn2KkO+Bb+UV5CBN6WC6QtBgbRVozrahAbmm6HtUsgtPC19tFdxXZYBOfkbmFJ1VaHA1VAHjd0pp70oTZzvR+EVrx2Ygfdsq6eu55BHYR8hlcki+n+kERUFG8BrA0BwjeAv2M8WLQBtcy+SD6fNsmnB3AlBLrgTtVW1c2QN4bVWLATaIS60J2Du5y1TiJgjSBvFVZgTmwCU+dAZFoPxGEEs8nyHC9Bwe2GvEJv2WXZb0vjdyFT4Cxk3e/kIqlOGoVLwwPevpYHT+00T+hWwXDf4AJAOUqWcDhbwAAAAASUVORK5CYII=") !important;
}
#tsaot-container > .toast-error {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHOSURBVEhLrZa/SgNBEMZzh0WKCClSCKaIYOED+AAKeQQLG8HWztLCImBrYadgIdY+gIKNYkBFSwu7CAoqCgkkoGBI/E28PdbLZmeDLgzZzcx83/zZ2SSXC1j9fr+I1Hq93g2yxH4iwM1vkoBWAdxCmpzTxfkN2RcyZNaHFIkSo10+8kgxkXIURV5HGxTmFuc75B2RfQkpxHG8aAgaAFa0tAHqYFfQ7Iwe2yhODk8+J4C7yAoRTWI3w/4klGRgR4lO7Rpn9+gvMyWp+uxFh8+H+ARlgN1nJuJuQAYvNkEnwGFck18Er4q3egEc/oO+mhLdKgRyhdNFiacC0rlOCbhNVz4H9FnAYgDBvU3QIioZlJFLJtsoHYRDfiZoUyIxqCtRpVlANq0EU4dApjrtgezPFad5S19Wgjkc0hNVnuF4HjVA6C7QrSIbylB+oZe3aHgBsqlNqKYH48jXyJKMuAbiyVJ8KzaB3eRc0pg9VwQ4niFryI68qiOi3AbjwdsfnAtk0bCjTLJKr6mrD9g8iq/S/B81hguOMlQTnVyG40wAcjnmgsCNESDrjme7wfftP4P7SP4N3CJZdvzoNyGq2c/HWOXJGsvVg+RA/k2MC/wN6I2YA2Pt8GkAAAAASUVORK5CYII=") !important;
}
#tsaot-container > .toast-success {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADsSURBVEhLY2AYBfQMgf///3P8+/evAIgvA/FsIF+BavYDDWMBGroaSMMBiE8VC7AZDrIFaMFnii3AZTjUgsUUWUDA8OdAH6iQbQEhw4HyGsPEcKBXBIC4ARhex4G4BsjmweU1soIFaGg/WtoFZRIZdEvIMhxkCCjXIVsATV6gFGACs4Rsw0EGgIIH3QJYJgHSARQZDrWAB+jawzgs+Q2UO49D7jnRSRGoEFRILcdmEMWGI0cm0JJ2QpYA1RDvcmzJEWhABhD/pqrL0S0CWuABKgnRki9lLseS7g2AlqwHWQSKH4oKLrILpRGhEQCw2LiRUIa4lwAAAABJRU5ErkJggg==") !important;
}
#tsaot-container > .toast-warning {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGYSURBVEhL5ZSvTsNQFMbXZGICMYGYmJhAQIJAICYQPAACiSDB8AiICQQJT4CqQEwgJvYASAQCiZiYmJhAIBATCARJy+9rTsldd8sKu1M0+dLb057v6/lbq/2rK0mS/TRNj9cWNAKPYIJII7gIxCcQ51cvqID+GIEX8ASG4B1bK5gIZFeQfoJdEXOfgX4QAQg7kH2A65yQ87lyxb27sggkAzAuFhbbg1K2kgCkB1bVwyIR9m2L7PRPIhDUIXgGtyKw575yz3lTNs6X4JXnjV+LKM/m3MydnTbtOKIjtz6VhCBq4vSm3ncdrD2lk0VgUXSVKjVDJXJzijW1RQdsU7F77He8u68koNZTz8Oz5yGa6J3H3lZ0xYgXBK2QymlWWA+RWnYhskLBv2vmE+hBMCtbA7KX5drWyRT/2JsqZ2IvfB9Y4bWDNMFbJRFmC9E74SoS0CqulwjkC0+5bpcV1CZ8NMej4pjy0U+doDQsGyo1hzVJttIjhQ7GnBtRFN1UarUlH8F3xict+HY07rEzoUGPlWcjRFRr4/gChZgc3ZL2d8oAAAAASUVORK5CYII=") !important;
}
#tsaot-container.toast-top-center > div,
#tsaot-container.toast-bottom-center > div {
  width: 300px;
  margin-left: auto;
  margin-right: auto;
}
#tsaot-container.toast-top-full-width > div,
#tsaot-container.toast-bottom-full-width > div {
  width: 96%;
  margin-left: auto;
  margin-right: auto;
}
.toast {
  background-color: #030303;
}
.toast-success {
  background-color: #51A351;
}
.toast-error {
  background-color: #BD362F;
}
.toast-info {
  background-color: #2F96B4;
}
.toast-warning {
  background-color: #F89406;
}
.toast-progress {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 4px;
  background-color: #000000;
  opacity: 0.4;
  -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=40);
  filter: alpha(opacity=40);
}
/*Responsive Design*/
@media all and (max-width: 240px) {
  #tsaot-container > div {
    padding: 8px 8px 8px 50px;
    width: 11em;
  }
  #tsaot-container > div.rtl {
    padding: 8px 50px 8px 8px;
  }
  #tsaot-container .toast-close-button {
    right: -0.2em;
    top: -0.2em;
  }
  #tsaot-container .rtl .toast-close-button {
    left: -0.2em;
    right: 0.2em;
  }
}
@media all and (min-width: 241px) and (max-width: 480px) {
  #tsaot-container > div {
    padding: 8px 8px 8px 50px;
    width: 18em;
  }
  #tsaot-container > div.rtl {
    padding: 8px 50px 8px 8px;
  }
  #tsaot-container .toast-close-button {
    right: -0.2em;
    top: -0.2em;
  }
  #tsaot-container .rtl .toast-close-button {
    left: -0.2em;
    right: 0.2em;
  }
}
@media all and (min-width: 481px) and (max-width: 768px) {
  #tsaot-container > div {
    padding: 15px 15px 15px 50px;
    width: 25em;
  }
  #tsaot-container > div.rtl {
    padding: 15px 50px 15px 15px;
  }
}`;
/*!***********************!*/
/**/modules["ui.css"] = /*** ./assets/ui.css ***/
`.stage {
  position: fixed;
  right: 40px;
  bottom: 60px;
  height: 20px;
  width: 20px;
  border: 1px solid #e9eaec;
  border-radius: 50%;
  box-shadow: 0 0 12px 4px rgb(106, 115, 133, 22%);
  padding: 10px;
  cursor: pointer;
  animation: roll 1s ease-out;
  transition: opacity 0.3s ease-out;
  background: none;
  z-index: 11110;
}
@keyframes roll {
  30%,
  60%,
  90% {
    transform: scale(1) rotate(0deg);
  }
  10%,
  40%,
  70% {
    transform: scale(1.11) rotate(-180deg);
  }
  20%,
  50%,
  80% {
    transform: scale(0.9) rotate(-360deg);
  }
}
`;
/*!***********************!*/
    class API {
        GM = GM;
        Name = GM.info.script.name;
        Virsion = GM.info.script.version;
        Handler = [GM.info.scriptHandler, GM.info.version].join(" ");
    }
    new Function("API", "MODULES", Reflect.get(modules, "modules.js"))(new API(), modules);
})();
