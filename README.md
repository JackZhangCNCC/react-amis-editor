# 根据amis-editor-demo改造的,只保留一个编辑器界面,且提供初始化amis_json配置和保存方法,便于二次开发


**用最简单的方式使用amis-editor**


请看src/index.html的例子,提供对外的接口

如果要调整编辑器界面,请修改route/Editor.tsx文件

注意如果要调整打包后的资源引用路径,请修改amis.config.js,目前设置为/amis-editor/  也就是在编辑器打开的时候所有的资源路径都相对于,当前域名/amis-editor/

官方的amis-editor-demo地址

https://github.com/aisuda/amis-editor-demo


如果不想自己编译,可以直接复制amis-eidtor目录到你的项目中,注意,这个目录名称不要修改,如果要修改,需要自己重新打包项目,


访问路径为 http://ip:port/amis-editor/index.html

##
