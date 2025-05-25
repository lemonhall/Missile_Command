#!/bin/bash

echo "========================================"
echo "        导弹指挥官游戏启动器"
echo "========================================"
echo
echo "正在启动本地服务器..."
echo "游戏将在浏览器中自动打开"
echo
echo "按 Ctrl+C 停止服务器"
echo "========================================"
echo

# 检查Python是否可用
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "错误: 未找到Python环境"
    echo "请安装Python后重试"
    exit 1
fi

# 在后台启动服务器
$PYTHON_CMD -m http.server 8000 &
SERVER_PID=$!

# 等待服务器启动
sleep 2

# 尝试打开浏览器
if command -v open &> /dev/null; then
    # macOS
    open "http://localhost:8000"
elif command -v xdg-open &> /dev/null; then
    # Linux
    xdg-open "http://localhost:8000"
else
    echo "请手动在浏览器中打开: http://localhost:8000"
fi

echo "服务器已启动，进程ID: $SERVER_PID"
echo "游戏地址: http://localhost:8000"
echo "按 Ctrl+C 停止服务器"

# 等待用户中断
trap "echo; echo '正在停止服务器...'; kill $SERVER_PID 2>/dev/null; exit 0" INT
wait $SERVER_PID 