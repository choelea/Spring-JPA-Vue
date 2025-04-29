#!/bin/bash

# 第一步：运行生产环境构建
pnpm run build

# 第二步：检查并删除现有的 zip 包
if [ -f "dist.zip" ]; then
    rm dist.zip
fi

# 第三步：将 dist 目录打包成 zip 包
zip -r dist.zip dist/
