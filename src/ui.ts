/**
 * 建立UI相关控件
 */
(function () {
    class DownloadIcon extends HTMLElement {
        shadow = this.attachShadow({ mode: "closed" })
        constructor() {
            super();
            const div = DownloadIcon.addElement("div", { class: "stage" }, this.shadow, API.getModule("icon.txt"));
            DownloadIcon.addCss(API.getModule("ui.css"), "", this.shadow);
            div.onmouseover = () => div.style.opacity = "0.8";
            setTimeout(() => {
                div.style.opacity = "0";
                div.onmouseout = () => div.style.opacity = "0"
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
        static addElement<T extends keyof HTMLElementTagNameMap>(tag: T, attribute?: { [name: string]: string }, parrent?: Node, innerHTML?: string, top?: boolean, replaced?: Element): HTMLElementTagNameMap[T] {
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
        static async addCss(txt: string, id?: string, parrent?: Node) {
            parrent = parrent || document.head;
            const style = document.createElement("style");
            style.setAttribute("type", "text/css");
            id && !(<HTMLElement>parrent).querySelector(`#${id}`) && style.setAttribute("id", id);
            style.appendChild(document.createTextNode(txt));
            parrent.appendChild(style);
        }
    }
    customElements.define('download-icon', DownloadIcon);

    const div = document.createElement("download-icon");
    div.addEventListener("click", async e => {
        const files = API.Yunapi.getFile();
        !files[0] && toast.warning(`Are you kidding me?!`, "请选择且只选择一个文件 →_→")
        const urls = await API.Yunapi.getUrl(files);
        if (urls[0] && urls[0].info.dlink) {
            toast.success("ef2：尝试拉起IDM~")
            const ef2: Ef2 = (await import(<any>"https://cdn.jsdelivr.net/gh/MotooriKashin/ef2/dist/ef2.js")).default;
            ef2.sendLinkToIDM({
                url: urls[0].info.dlink
            });
        } else toast.error(`未获取到下载链接，你确定选择的是一个文件？`)
    });
    document.body.appendChild(div);
})();
interface EF2Data {
    /**
     * URL
     */
    url: string;
    /**
     * 文件名（含拓展名）
     */
    out?: string;
    /**
     * user-agent
     */
    userAgent?: string;
    /**
     * referer
     */
    referer?: string;
    /**
     * 文件保存目录
     */
    directory?: string;
    /**
     * cookies
     * 一般还是免了吧，有些cookie无法在js环境中获取到
     */
    cookies?: string;
    /**
     * 用于send的参数并改用POST方法下载
     * 一般都是GET，没见过要求POST的
     */
    postDate?: string;
    /**
     * 用于http身份校验的账户，与password配对
     * 从来没见过+1
     * **并非注册的网站账户！**
     */
    userName?: string;
    /**
     * 用于http身份校验的密钥，与userName配对
     * 从来没见过+1
     * **并非注册的网站密码！**
     */
    password?: string;
    /**
     * 禁用IDM下载前的询问弹窗，其中可以选择修改文件名及保存目录等信息
     */
    toastDisabled?: true;
    /**
     * 把下载链接添加到下载列表但是不立即开始下载，需要下载时再手动到IDM里开始
     */
    sendToList?: true;
}
declare class Ef2 {
    /**
     * 编码下载数据为ef2协议链接，用法同http协议链接
     * @param data 下载配置对象
     * @returns ef2协议链接
     */
    encode(data: EF2Data): string;
    /**
     * 解码ef2协议为对象
     * @param ef2ptl ef2协议链接
     * @returns 下载配置对象
     */
    decode(ef2ptl: string): EF2Data;
    /**
     * encode的封装，直接发起下载
     * 未安装ef2.exe将没有任何效果
     * @param data 下载配置对象
     */
    sendLinkToIDM(data: EF2Data): void;
}