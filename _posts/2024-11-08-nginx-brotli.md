---
title: 'Nginx Brotli 升级'
date: 2024-11-06
permalink: /posts/2024/11/nginx-brotli/
tags:
  - cool posts
  - category1
  - category2
---

# 升级ubuntu镜像，踩到nginx的坑

## 嫌字多的话，直接看下面吧

在一个风和日丽的上午，我突发奇想，我升级了Ubuntu OS镜像，这是一个既充满挑战又令人期待的过程。

在我们的系统中，Nginx是通过`apt-get install -y nginx`命令安装的。升级完成后，Nginx也顺利升级到了1.26.2版本。然而，当我在Nginx+PHP模式下重新构建容器时，却遇到了一系列令人头疼的问题。

突然，我收到了一堆告警信息，显示容器在不断重启。我迅速切换到Kubernetes（k8s）控制台，查看日志以排查问题。经过一番努力，我发现监控使用的Nginx status页面无法访问，这立刻让我意识到Nginx可能出现了问题。

为了验证我的猜想，我使用`docker run`命令进入容器，并执行`nginx -t`命令进行测试。结果正如我所料，Nginx报出了“unknown directive 'brotli'”的错误。这让我有些困惑，因为我已经安装了相应的依赖包，为什么还会出现这种情况呢？

我立即开始排查问题，并尝试使用`apt-get install libnginx-mod-http-brotli`命令重新安装Brotli模块。然而，即使安装完成后，`nginx -t`测试仍然无法通过。

就在我一筹莫展之际，我在GitHub上找到了一个相关的issue。上面写道：“The full-upgrade removed the old brotli package”（全面升级移除了旧的brotli包）。我这才恍然大悟，原来是包名发生了变更！

新包名叫做`libnginx-mod-http-brotli-filter`。我二话不说，立即安装了新包，并再次进行了测试。这次，Nginx终于顺利通过了测试，业务也恢复了正常。

通过这次经历，我深刻体会到了在升级系统时可能会遇到的各种挑战和不确定性。但正是这些挑战，让我们不断成长和进步。我相信，在未来的日子里，我们会更加谨慎和高效地处理类似的问题。

### nginx -t 报错，unknown directive "brotli" in /etc/nginx/nginx.conf:155 。

```
The full-upgrade removed the old brotli package:
Removing libnginx-mod-brotli (1.25.3-1+ubuntu22.04.1+deb.sury.org+2) ...
```

### 解决办法

```
apt-get install libnginx-mod-http-brotli-filter
```

### Nginx 版本  1.26.2

参考：

https://github.com/oerdnj/deb.sury.org/issues/2089

https://github.com/oerdnj/deb.sury.org/issues/2086

https://packages.debian.org/sid/libnginx-mod-http-brotli-filter