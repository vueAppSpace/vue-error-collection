import { ConfigEnv, loadEnv, UserConfig } from "vite";
import { createVuePlugin } from "vite-plugin-vue2";
// 如果编辑器提示 path 模块找不到，则可以安装一下 @types/node -> pnpm i @types/node -D
import { resolve } from "path";
import legacy from "@vitejs/plugin-legacy";
import viteCompression from "vite-plugin-compression";
import checkEnv from "./version";
import { getTicket, getIPAddress } from "./get-ticket";

export default async ({ command, mode }: ConfigEnv): Promise<UserConfig> => {
  const env: Partial<ImportMetaEnv> = loadEnv(mode, process.cwd());
  const lkProject = checkEnv(env);
  const ticket = await getTicket();
  const ipAddress = getIPAddress();

  printProjectURL(ticket, ipAddress);

  return {
    plugins: [
      createVuePlugin({
        vueTemplateOptions: {}
      }),
      // 兼容性配置
      legacy({
        targets: ["> 0.5%", "last 2 versions", "not ie <= 8", "not dead"],
        // 为空时使用默认配置
        polyfills: [],
        // 切换是否使用了browserslist配置源。
        // https://babeljs.io/docs/en/babel-preset-env#ignorebrowserslistconfig
        ignoreBrowserslistConfig: false
      }),
      /** 该插件会导致vite控制台报错:no such file or directory, rename xxx
       *  https://github.com/vitejs/vite/issues/9986
       */
      viteCompression({
        algorithm: "gzip", // 压缩算法
        threshold: 10240, // 只有大小大于该值的资源会被处理 10240
        verbose: true, // 是否在控制台输出压缩结果
        disable: command === "serve", // serve本机启动时禁用
        ext: ".gz", // 生成的压缩包后缀
        deleteOriginFile: false // 删除原文件
      })
    ],
    css: {
      // 预处理器配置项
      preprocessorOptions: {
        scss: {
          // additionalData: '@import "./src/style/scss/variable.scss";',
          // javascriptEnabled: true,
        },
        less: {},
        sass: {}
      }
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"), // 设置 `@` 指向 `src` 目录
        "@img": resolve(__dirname, "src/assets/images") // 设置@img指向images目录
      },
      // 忽略后缀名的配置选项, 添加 .vue 选项时要记得原本默认忽略的选项也要手动写入
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"]
    },
    base: "/report/", // 设置打包路径
    server: {
      port: 9080, // 端口号
      // open: true, // 是否自动打开浏览器
      open: `health?ticket=${ticket}`,
      cors: true // 允许跨域
      // 代理
      // proxy: {
      //   "/proxy": {
      //     target: "http://10.1.1.31:8084",
      //     changeOrigin: true,
      //     secure: false,
      //     rewrite: (path) => path.replace("^/proxy", ""),
      //   },
      // },
    },
    build: {
      chunkSizeWarningLimit: 800,
      sourcemap: JSON.parse(env.VITE_BUILD_SOURCEMAP)
      // rollupOptions: {
      //   output: {
      //     manualChunks(id) {
      //       if (id.includes('node_modules')) {
      //         return id.toString().split('node_modules/')[1].split('/')[0].toString()
      //       }
      //     },
      //   },
      // },
    },
    // optimizeDeps: {
    //   entries: ["introjs"]
    // },
    define: {
      "process.env": env,
      LK_PROJECT: lkProject
    }
  };
};

function printProjectURL(ticket, ipAddress) {
  console.log("\n==================== icome 项目链接 start ====================");
  console.log(`本地开发: http://localhost:9080/report/health?ticket=${ticket}`);
  console.log(`本地远程: http://${ipAddress}:9080/report/health?ticket=${ticket}`);
  console.log(`qa环境: https://c-qa.op.laikang.com/report/health?ticket=${ticket}`);
  console.log("==================== icome 项目链接 end ====================\n");
}
