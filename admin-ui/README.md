# 服务器后台系统管理


# 安装 pnpm
npm install pnpm -g

# 设置镜像源(可忽略)
pnpm config set registry https://registry.npmmirror.com

# 安装依赖
pnpm install

# 启动运行
pnpm run dev
```
## 项目简介

[vue3-element-admin](https://gitcode.com/youlai/vue3-element-admin) 是基于 Vue3 + Vite5+ TypeScript5 + Element-Plus + Pinia 等主流技术栈构建


## 项目部署

```bash
# 项目打包
pnpm run build

# 上传文件至远程服务器
将本地打包生成的 dist 目录下的所有文件拷贝至服务器的 /usr/share/nginx/html 目录。

# nginx.cofig 配置
server {
	listen     80;
	server_name  localhost;
	location / {
			root /usr/share/nginx/html;
			index index.html index.htm;
	}
	# 反向代理配置
	location /prod-api/ {
      # api.youlai.tech 替换后端API地址，注意保留后面的斜杠 /
      proxy_pass http://api.youlai.tech/; 
	}
}
```



### 注意事项

- 测试环境需要单独配置请求地址
- deploy-zip-test.sh和deploy-zip.sh属于离线部署脚本，测试环境和生产环境，可以选择使用
