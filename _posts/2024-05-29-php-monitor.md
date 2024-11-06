---
title: 'php prometheus monitor'
date: 2024-11-06
permalink: /posts/2024/05/php-monitor/
tags:
  - cool posts
  - category1
  - category2
---
服务监控
微服务治理的一个核心需求便是服务可观察性。作为微服务的牧羊人，要做到时刻掌握各项服务的健康状态，并非易事。云原生时代这一领域内涌现出了诸多解决方案。本组件对可观察性当中的重要支柱遥测与监控进行了抽象，方便使用者与既有基础设施快速结合，同时避免供应商锁定。
​

#php exporter监控
```
COPY ./exporter/php-fpm-exporter /usr/bin/php-fpm-exporter   
COPY ./exporter/nginx-status.conf /etc/nginx/conf.d/nginx-status.conf
COPY --chmod=0600 ./confd/default-supervisor.conf /etc/supervisor/conf.d/default.conf
#开启php监控
RUN set-ex \
&& sed -i '$apm.status_path = /status'  /etc/php/fpm/php-fpm.conf \
&& sed -i '$aping.path = /ping'  /etc/php/fpm/php-fpm.conf
​```
#nginx
​```
server {
    listen 9999;
    server_name  localhost;
    location /stub_status {
       stub_status on;
       access_log off;
       allow 127.0.0.1;
       deny all;
    }
    location ~ ^/(status|ping)$ {
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
        allow 127.0.0.1;
        deny all;
}
}
​```
PHP FPM配置
```
pm.status_path = /status
ping.path = /ping
```
#启动exporter （supervisor）
​```
[program:nginx-exporter]
command = /usr/bin/nginx-exporter -nginx.scrape-uri "http://127.0.0.1:9999/stub_status"
autostart=true
autorestart=true
priority=992
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stdout
stderr_logfile_maxbytes=0

[program:php-fpm-exporter]
command = /usr/bin/php-fpm-exporter --addr="0.0.0.0:9114" --endpoint="http://127.0.0.1:9999/status"
autostart=true
autorestart=true
priority=992
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stdout
stderr_logfile_maxbytes=0
```

#Dcokerfile
```
#开启php status/ping状态配置
 sed -i '$apm.status_path = /status'  /etc/php/fpm/php-fpm.conf \
 sed -i '$aping.path = /ping'  /etc/php/fpm/php-fpm.conf
#新增Nginx PHP Status.conf & exporter
COPY ./monitor/nginx-status.conf /etc/nginx/conf.d/nginx-status.conf
COPY ./monitor/nginx-exporter /usr/bin/nginx-exporter
COPY ./monitor/php-fpm-exporter /usr/bin/php-fpm-exporter   
```
​
#k8s配置
​```
  template:
    metadata:
    # 添加部分
      annotations:
        prometheus.io/port: "9999" # 对应启动命令中的--addr 参数
        prometheus.io/scrape: php-fpm
```

​
#Prometheus
​```
- job_name: 'kubernetes-php-fpm'
  kubernetes_sd_configs:
  - role: pod
  relabel_configs:
  - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
    action: keep
    regex: php-fpm
  - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
    action: replace
    target_label: __metrics_path__
    regex: (.+)
  - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
    action: replace
    regex: ([^:]+)(?::\d+)?;(\d+)
    replacement: $1:$2
    target_label: __address__
  - action: labelmap
    regex: __meta_kubernetes_pod_label_(.+)
  - source_labels: [__meta_kubernetes_namespace]
    action: replace
    target_label: namespace
  - source_labels: [__meta_kubernetes_pod_name]
    action: replace
    target_label: pod
```
​#Nginx监控指标
```
监控指标	指标含义
nginx_connections_accepted	接受的客户端连接总数
nginx_connections_active	当前客户端连接数
nginx_connections_handled	Handled状态的连接数
nginx_connections_reading	读取客户端的连接数
nginx_connections_waiting	等待中的客户端连接数
nginx_connections_writing	回写客户端的连接数
nginx_http_requests_total	客户端请求总数
nginx_up	Nginx Exporter是否正常运行
nginxexporter_build_info	Nginx Exporter的构建信息
```
#FPM监控指标
```
监控指标	指标含义
phpfpm_accepted_connections_total	pool接收的请求数量
phpfpm_active_max_processes	最大活跃进程数
phpfpm_listen_queue_connections	已发起但尚未接受的连接数
phpfpm_listen_queue_length_connections	最大挂起连接数
phpfpm_listen_queue_max_connections	监听队列最大连接数
phpfpm_max_children_reached_total	达到进程限制的次数
phpfpm_processes_total{state="active"}	总进程数中活跃连接
phpfpm_processes_total{state="idle"}	总进程数中空闲连接
phpfpm_scrape_failures_total	抓取php fpm时的错误数
"phpfpm_slow_requests_total 0
"	超时request_slowlog_timeout的请求数
phpfpm_up	php fpm exporter是否正常
```



#grafana大盘
​​https://grafana.com/grafana/dashboards/4912-kubernetes-php-fpm/​​

#hyperf
通过 Composer 安装组件
​```
composer require hyperf/metric
```

​