/**
 * 本模块是脚本模块主入口
 */
(function () {
    // @ts-expect-error 接收模块字符串
    const modules = MODULES;
    /**
     * 已载入模块
     */
    const modulesLoaded: Record<string, any> = [];
    const shadow = new Proxy(API, {
        get: (t, p) => {
            return (Reflect.has(window, p) && typeof window[p] !== "function") ? Reflect.get(window, p) : (Reflect.get(t, p) || (
                Reflect.has(modules["apply.json"], p) ? (
                    importModule(modules["apply.json"][p], {}),
                    Reflect.get(t, p)
                ) : undefined));
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
    function importModule(name?: string, args: Record<string, any> = {}, force?: boolean) {
        if (!name) return Object.keys(modules);
        if (modulesLoaded.includes(name) && !force) return modulesLoaded;
        if (Reflect.has(modules, name)) {
            !modulesLoaded.includes(name) && modulesLoaded.push(name);
            new Function("API", "xhr", "toast", "importModule", ...Object.keys(args), Reflect.get(modules, name))
                (shadow, Reflect.get(shadow, "xhr"), Reflect.get(shadow, "toast"), importModule, ...Object.keys(args).reduce((s: object[], d) => {
                    s.push(args[d]);
                    return s;
                }, []))
        }
    }
    Reflect.set(shadow, "importModule", importModule);
    Reflect.set(shadow, "getModule", (name: string) => Reflect.get(modules, name));

    new Function("API", Reflect.get(modules, "toast.js"))(shadow);
    new Function("API", Reflect.get(modules, "xhr.js"))(shadow);
    importModule("ui.js");
    Reflect.set(window, "API", API);
})();
declare namespace API {
    /**
     * 获取模块内容
     * @param name 模块名字
     * @returns json直接返回格式化对象，其他返回字符串
     */
    function getModule(name: string): any;
}