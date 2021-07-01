# 特性
- 多页架构
- 需要基本环境依赖：npm >= 5.28.0 node >= 10.13.0
- vue单页应用路由暂不支持history模式，只能使用hash模式
- 默认页面配置了px转换vw，可以根据开发的页面所属环境是否pc，在postcss.config.js中的exclude中设置相应的目录
- 本架构是纯csr架构
- 因为升级至vue3.x，不再兼容ie浏览器，如果需要继续兼容，请切换到master分支查看vue2版本架构。

# nginx部署
```
server {
  listen 80;
  root /var/www/html;
  index index.html $uri/index.html index/index.html;

  location ~ / {
    try_files $uri /$uri/index.html @fallback;
  }
  location @fallback {
    rewrite ^.*$ /index/index.html;
  }
}
```


# 开发须知
## 1、安装依赖及运行
```
npm i
# 运行
npm run dev
# 构建
npm run build
```


