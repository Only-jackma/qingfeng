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

php-fpm
Dockerfile
​
1
#php exporter监控
2
COPY ./exporter/php-fpm-exporter /usr/bin/php-fpm-exporter   
3
COPY ./exporter/nginx-status.conf /etc/nginx/conf.d/nginx-status.conf
4
COPY --chmod=0600 ./confd/default-supervisor.conf /etc/supervisor/conf.d/default.conf
5
#开启php监控
6
RUN set-ex \
7
&& sed -i '$apm.status_path = /status'  /etc/php/fpm/php-fpm.conf \
8
&& sed -i '$aping.path = /ping'  /etc/php/fpm/php-fpm.conf
​
nginx
​
1
server {
2
    listen 9999;
3
    server_name  localhost;
4
    location /stub_status {
5
       stub_status on;
6
       access_log off;
7
       allow 127.0.0.1;
8
       deny all;
9
    }
10
    location ~ ^/(status|ping)$ {
11
        fastcgi_pass 127.0.0.1:9000;
12
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
13
        include fastcgi_params;
14
        allow 127.0.0.1;
15
        deny all;
16
}
17
}
​
启动exporter （supervisor）
​
​
k8s配置
​
​
Prometheus
​
​
grafana大盘
​​https://grafana.com/grafana/dashboards/4912-kubernetes-php-fpm/​​

hyperf
通过 Composer 安装组件
​
​
使用 Prometheus 时，在配置文件中的 ​​metric​​ 项增加 Prometheus 的具体配置。

​
​
k8s配置
​
​
Prometheus
​
​
grafana
​​https://github.com/hyperf/metric/blob/master/grafana.json​​