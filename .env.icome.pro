###
 # @Description: icome 生产环境配置
 # @Author: IFLS
 # @Date: 2023-03-17 11:28:36
 # @LastEditTime: 2023-03-24 11:32:27
### 
# 在运行pnpm run build或pnpm run build:icomepro时被载入

# 网站前缀
VITE_BASE_URL = /

# 环境
VITE_ENV = icomepro

# API
VITE_APP_API_URL = 'https://cloud-pro.op.laikang.com/v1'

# 是否在打包时生成 sourcemap
VITE_BUILD_SOURCEMAP = false
