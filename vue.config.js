const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig(async () => {
    const Components = (await import("unplugin-vue-components/webpack")).default;
    const { PrimeVueResolver } = await import("@primevue/auto-import-resolver");
    return {
        transpileDependencies: true,
        lintOnSave: false,
        configureWebpack: {
            plugins: [
                Components({
                    resolvers: [PrimeVueResolver()],
                }),
            ],
        },
        chainWebpack: (config) => {
            config.plugin('define').tap((args) => {
                args[0]['__VUE_PROD_HYDRATION_MISMATCH_DETAILS__'] = 'false';
                return args;
            });
        },
    };
});
