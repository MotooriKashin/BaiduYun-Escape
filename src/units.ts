/**
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
    }
    class BaiduYunAPI {
        /**
         * 检索被选择的文件
         * @returns 被选文件数据
         */
        static getFile() {
            try {
                let files: BaiduYunFile[] = require('system-core:context/context.js').instanceForSystem.list.getSelected();
                //window.require("disk-system:widget/pageModule/list/listInit.js").getCheckedItems();
                files = files.filter(d => d.isdir === 0);
                return files;
            } catch (e) {
                return this.makeFilePath();
            }
        }
        static makeFilePath() {
            const item = document.querySelector(".nd-table__body-row.selected");
            if (item) {
                const a = item.querySelector<HTMLAnchorElement>(".nd-list-name__title-text");
                if (a) {
                    const obj = this.urlObj(location.href);
                    let path = obj.path ? obj.path.replace(/%2F/g, "/") : "/";
                    path = path.endsWith("/") ? path : path + "/";
                    return [{ path: decodeURIComponent(path) + a.title }]
                }
            }
            return [];
        }
        /**
         * 获取被选择的文件
         * @param {[]} files 文件数组
         */
        static async getUrl(files: BaiduYunFile[]) {
            let datas = await Promise.all(files.reduce((d, i) => {
                toast(`文件：${i.path}`);
                d.push(xhr.get(this.objUrl("https://pan.baidu.com/api/mediainfo", Object.assign(search, { path: encodeURIComponent(i.path) }))));
                return d;
            }, []));
            datas = datas.reduce((d, i) => {
                d.push(JSON.parse(i));
                return d;
            }, []);
            return <Mediainfo[]>datas;
        }
        /**
         * search参数对象拼合回URL
         * @param url URL主体，可含search参数
         * @param obj search参数对象
         * @returns 拼合的URL
         */
        static objUrl(url: string, obj: { [name: string]: string }) {
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
            if (url) url = url + "?" + arr.join("&");
            else url = arr.join("&");
            if (url.charAt(url.length - 1) == "?") url = url.split("?")[0];
            return url;
        }
        /**
         * 提取URL search参数对象
         * @param url 原URL
         * @returns search参数对象
         */
        static urlObj(url: string = "") {
            return url.split('?').reduce((s, d) => {
                d.split('&').forEach(d => {
                    d.includes("=") && (d = d.split("#")[0]) && (s[d.split('=')[0]] = d.split('=')[1] || "");
                });
                return s
            }, <Record<string, string>>{});
        }
    }
    Reflect.set(API, "Yunapi", BaiduYunAPI);
})();
declare function require(module: string): Record<string, any>;
interface BaiduYunFile {
    path: string;
    isdir: number;
    category: number;
    extent_tinyint7: number;
    fs_id: number;
    isWp: boolean;
    local_ctime: number;
    local_mtime: number;
    md5: string;
    oper_id: number;
    owner_id: number;
    owner_type: number;
    pl: number;
    real_category: string;
    server_atime: number;
    server_ctime: number;
    server_filename: string;
    server_mtime: number;
    share: string;
    size: number;
    tkbind_id: string;
    unlist: number;
    wpfile: number;
}
interface Mediainfo {
    errno: number;
    error_code: number;
    info: {
        dlink: string;
        md5: string;
        server_ctime: number;
        size: number;
        subtitle: number;
    };
    request_id: number;
}
declare namespace API {
    class Yunapi {
        static getFile(): BaiduYunFile[];
        static getUrl(files: BaiduYunFile[]): Promise<Mediainfo[]>;
        static objUrl(url: string, obj: Record<string, string>): string;
        static urlObj(url?: string): Record<string, string>;
    }
}