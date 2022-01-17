(function () {
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
        static container: HTMLElement;
        /**
         * 通知样式
         */
        static style: HTMLElement;
        /**
         * 判定`body`是否存在
         */
        static check: boolean;
        /**
         * 未呈现通知计数
         */
        static count: number = 0;
        /**
         * 动画呈现帧数
         */
        static sence: number = 60;
        /**
         * 自定义节点
         */
        static root: ToastContainer;
        static flag: boolean;
        static init() {
            this.root = <ToastContainer>document.createElement("toast-container");
            this.container = document.createElement("div");
            this.style = document.createElement("style");
            this.container.setAttribute("id", "tsaot-container");
            this.container.setAttribute("class", "toast-top-right");
            this.style.textContent = API.getModule("toastr.css");
            this.root.shadow.appendChild(this.style);
            this.root.shadow.appendChild(this.container);
        }
        static show(type: "info" | "success" | "warning" | "error", ...msg: string[]) {
            if (!document.body) {
                if (this.check) return;
                return setTimeout(() => { this.check = true; this.show(type, ...msg) });
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
                if (this.count > 0) this.count--;
                item = this.container.insertBefore(item, this.container.firstChild);
                item.appendChild(this.msg(...msg));
                this.come(item);
                setTimeout(() => this.quit(item), 4 * 1000);
            }, this.count * 250);
            this.count++;
        }
        static come(item: HTMLDivElement, i: number = 0) {
            let height = item.clientHeight;
            item.setAttribute("style", "display: none;");
            let timer = setInterval(() => {
                i++;
                item.setAttribute("style", "padding-top: " + i / 4 + "px;padding-bottom: " + i / 4 + "px;height: " + i / 60 * height + "px;");
                if (i === this.sence) {
                    clearInterval(timer);
                    item.removeAttribute("style");
                }
            })
        }
        static quit(item: HTMLDivElement, i: number = this.sence) {
            let height = item.clientHeight;
            let timer = setInterval(() => {
                i--;
                item.setAttribute("style", "padding-top: " + i / 4 + "px;padding-bottom: " + i / 4 + "px;height: " + i / 60 * height + "px;");
                if (i === 0) {
                    clearInterval(timer);
                    item.remove();
                }
            })
        }
        static msg(...msg: string[]) {
            let div = document.createElement("div");
            div.setAttribute("class", "toast-message");
            div.innerHTML = msg.reduce((s: string, d, i) => {
                s = s + (i ? "<br />" : "") + String(d);
                return s;
            }, "");
            return div;
        }
    }
    Toast.init();
    // @ts-ignore
    API.toast = (...msg: string[]) => { Toast.show("info", ...msg) };
    Reflect.set(Reflect.get(API, "toast"), "info", (...msg: string[]) => Toast.show("info", ...msg));
    Reflect.set(Reflect.get(API, "toast"), "success", (...msg: string[]) => Toast.show("success", ...msg));
    Reflect.set(Reflect.get(API, "toast"), "warning", (...msg: string[]) => Toast.show("warning", ...msg));
    Reflect.set(Reflect.get(API, "toast"), "error", (...msg: string[]) => Toast.show("error", ...msg));
})();
declare const toast: {
    (...msg: string[]): void;
    info(...msg: string[]): void;
    success(...msg: string[]): void;
    warning(...msg: string[]): void;
    error(...msg: string[]): void;
}