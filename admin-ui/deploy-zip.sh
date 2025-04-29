#!/bin/bash

# 第一步：运行生产环境构建
pnpm run build


# 第二步：将 dist 目录下的内容复制到 ../src/main/resources/static/admin/ 目录下
rm -rf ../src/main/resources/static/admin/*
cp -r dist/* ../src/main/resources/static/admin/