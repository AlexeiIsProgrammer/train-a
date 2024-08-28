declare interface Env {
    readonly NG_APP_ADMINS: string;
    readonly NG_APP_ADMIN_SHORT_NAME: string;
}

declare interface ImportMeta {
    readonly env: Env;
}
