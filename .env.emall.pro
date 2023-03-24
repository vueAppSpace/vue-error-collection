###
 # @Description: e商服 生产环境配置
 # @Author: IFLS
 # @Date: 2023-03-17 11:28:32
 # @LastEditTime: 2023-03-24 11:32:18
### 
# 在运行pnpm run build:emallpro时被载入

# 网站前缀
VITE_BASE_URL = /

# 环境
VITE_ENV = emallpro

# API
# TODO: 需改为e商服api 生产环境地址
VITE_APP_API_URL = 'https://cloud-pro.op.laikang.com/v1'

# 是否在打包时生成 sourcemap
VITE_BUILD_SOURCEMAP = false
