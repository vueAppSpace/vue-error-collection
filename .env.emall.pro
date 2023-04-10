###
 # @Description: e商服 生产环境配置
 # @Author: IFLS
 # @Date: 2023-03-17 11:28:32
 # @LastEditTime: 2023-04-10 15:08:26
### 
# 在运行pnpm run build:emallpro时被载入

# 网站前缀
VITE_BASE_URL = /

# 环境
VITE_ENV = emallpro

# 条件编译参数
VITE_IFDEF = EMALL

# API
VITE_APP_API_URL = 'https://cloud-pro.op.laikang.com/v1'

# 是否在打包时生成 sourcemap
VITE_BUILD_SOURCEMAP = false
