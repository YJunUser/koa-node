---
title: Nginx
date: 2021/9/4
tags: Nginx
categories: 运维
introduction: nginx的安装、常用命令和配置，自己记录下学习过程，学的并不深，从实践角度出发，用到啥就学啥
---



## Nginx安装、常用命令和配置文件

安装：<code>brew install nginx</code>

```shell
nginx -v

nginx

ps -ef | grep nginx

nginx -s stop

nginx -s reload

tail -f /usr/local/var/log/access.log

tail -f /usr/local/var/log/error.log

// 关闭master进程相当于stop
kill -QUIT ${pid} || kill -TERM ${pid}

// after update
nginx -t
nginx -s reload
```



```shell
默认情况：
/usr/local/etc/nginx/nginx.conf
/usr/local/Cellar/nginx
/usr/local/var/log

brew:
/opt/homebrew/etc/nginx/nginx.conf
/opt/homebrew/Cellar/nginx
/opt/homebrew/var/log/nginx/access.log
```



## Nginx配置文件详解

```shell
## first component 影响整体运行的配置指令
include main.conf;
user nobody;
master_process off | on;
worker_processes 1;

error_log logs/error.log

pid logs/nginx.pid;

## second component 影响nginx服务器和用户连接
events {
	accept_mutex: on;
	multi_accept: on;
	worker_connection: 1024;
}

## third componet http

http {
	include mime.type;
	default_type: application/octet-stream;
	
	# log_format ...
	# access_log
	
	sendfile on;
	keepalive_timout 65;
	# gzip on
	
	# 负载均衡 轮询（默认）
	upstream myserver {
			# ip_hash; nginx记住访问的ip，以后这个ip只能访问初次访问的，解决session
      server 127.0.0.1:3000 weight=10;
      server 127.0.0.1:3001 weight=10;
   }
	
	server {
		listen 8080;
		server_name localhost;
		access__log logs/mylog.log # 就近原则
		
		location / {
			root html;
			index index.html; # root资源目录下的index.html;
		}
		
		location /proxy/ {
			# 反向代理
			proxy_pass http://192.167.2.1:3000/;
		}
		
		location /get_text {
			default_type text/html;
			access_log logs/text.log;
			return 200 "this is nginx's text";
		}
		
		# 功能和不包含正则表达式一样，不同点在于匹配到之后就不会继续向下匹配
		location ^~/abc {
			default_type text/plain;
			return 200 "access success";
		}
		
		# 模糊匹配，/abc, /abced
		location /abc {
			default_type text/plain;
			return 200 "access success";
		}
		
		# ~表示包含正则并区分大小写，~*不区分
		location ~/abc {
			default_type text/plain;
			return 200 "access success";
		}
		
		# 精确匹配，但是query是不影响的
		location = /abc {
			default_type text/plain;
			return 200 "access success";
		}
		
		error_page 500 502 503 504 /50x.html;
		location = /50.html {
			root html;
		}
	}
}
```

## 配置SSl

https://cloud.tencent.com/document/product/400/35244
