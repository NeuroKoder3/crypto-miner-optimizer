cmake_minimum_required(VERSION 3.21)

project(CryptoMinerOptimizer LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(Qt6 REQUIRED COMPONENTS Core Gui Widgets WebEngineWidgets)

qt_standard_project_setup()

add_executable(CryptoMinerOptimizer
    src/main.cpp
)

target_link_libraries(CryptoMinerOptimizer PRIVATE
    Qt6::Core
    Qt6::Gui
    Qt6::Widgets
    Qt6::WebEngineWidgets
)
