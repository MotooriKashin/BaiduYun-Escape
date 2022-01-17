/**
 * 脚本主体，负责提供脚本与模块间沟通的桥梁
 */
(function () {
    const modules: Record<string, any> = {};
    /* 模块占位 */
    class API {
        GM = GM;
        Name: string = GM.info.script.name;
        Virsion: string = GM.info.script.version;
        Handler: string = [GM.info.scriptHandler, GM.info.version].join(" ");
    }
    new Function("API", "MODULES", Reflect.get(modules, "modules.js"))(new API(), modules);
})();

declare namespace API {
    /**
     * 脚本名字
     */
    let Name: string;
    /**
     * 脚本版本
     */
    let Virsion: string;
    /**
     * 脚本管理器名字
     */
    let Handler: string;
}
declare namespace GM {
    const info: {
        downloadMode: string;
        isFirstPartyIsolation: boolean;
        isIncognito: boolean;
        scriptHandler: string;
        scriptMetaStr: string;
        scriptSource: string;
        scriptUpdateURL: string;
        scriptWillUpdate: string;
        version: string;
        script: {
            antifeatures: {};
            author: string;
            blockers: [];
            copyright: string;
            description: string;
            description_i18n: {};
            evilness: number;
            excludes: [];
            grant: [];
            header: string;
            homepage: string;
            icon: string;
            icon64: string;
            includes: [];
            lastModified: number;
            matches: [];
            name: string;
            name_i18n: [];
            namespace: string;
            options: {
                check_for_updates: boolean;
                comment: string;
                compat_foreach: boolean;
                compat_metadata: boolean;
                compat_prototypes: boolean;
                compat_wrappedjsobject: boolean;
                compatopts_for_requires: boolean;
                noframes: boolean;
                override: {
                    merge_connects: boolean;
                    merge_excludes: boolean;
                    merge_includes: boolean;
                    merge_matches: boolean;
                    orig_connects: [];
                    orig_excludes: [];
                    orig_includes: [];
                    orig_matches: [];
                    orig_noframes: boolean;
                    orig_run_at: string;
                    use_blockers: [];
                    use_connects: [];
                    use_excludes: [];
                    use_includes: [];
                    use_matches: [];
                }
                run_at: string;
            }
            position: number;
            requires: [];
            resources: [{ [name: string]: string }];
            "run-at": string;
            supportURL: string;
            sync: { imported: string };
            unwrap: boolean;
            updateURL: string;
            uuid: string;
            version: string;
            webRequest: string;
        }
    }
}