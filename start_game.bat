@echo off
title 导弹指挥官游戏启动器
color 0A

echo ========================================
echo          导弹指挥官游戏启动器
echo ========================================
echo.
echo 正在检查Python环境...

where python >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到Python环境
    echo 请安装Python后重试
    echo.
    pause
    exit /b 1
)

echo Python环境检查通过!
echo.
echo 正在启动本地服务器...
echo 游戏将在浏览器中自动打开
echo.
echo 服务器地址: http://localhost:8000
echo 按 Ctrl+C 停止服务器
echo ========================================
echo.

REM 启动浏览器
start "" "http://localhost:8000"

REM 启动Python服务器
python -m http.server 8000

echo.
echo 服务器已停止
pause 