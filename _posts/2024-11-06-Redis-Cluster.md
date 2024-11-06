---
title: 'Redis Cluster'
date: 2024-11-06
permalink: /posts/2024/11/Redis-Cluster/
tags:
  - cool posts
  - category1
  - category2
---

# Redis Cluster
### 部署3台Centos7.8服务器，Redis版本：3.2.9 端口：为7001、7002、7003、7004、7005、7006

	| 服务端口  | IP            | 配置文件         |
	| -------- | ------------- | --------------- |
	| 7001     | 192.168.1.48 | redis-7001.conf |
	| 7002     | 192.168.1.48 | redis-7001.conf |
	| 7003     | 192.168.1.49 | redis-7002.conf |
	| 7004     | 192.168.1.49 | redis-7002.conf |
	| 7005     | 192.168.1.50 | redis-7003.conf |
	| 7006     | 192.168.1.50 | redis-7003.conf |

##  安装Redis篇
## 下载并安装Redis3.2.9 

    wget http://download.redis.io/releases/redis-3.2.9.tar.gz
	tar zxvf redis-3.2.9.tar.gz
	cd redis-3.2.9
	make install PREFIX=/data/software/redis-3.2.9

## Redis 配置文件
<details>
<summary>展开查看</summary>
<pre><code>
	daemonize yes
	port 7001
	tcp-backlog 511
	bind 192.168.31.48
	timeout 0
	tcp-keepalive 0
	loglevel notice
	logfile ""
	databases 16
	save 900 1
	save 300 10
	save 60 10000
	stop-writes-on-bgsave-error yes
	rdbcompression yes
	rdbchecksum yes
	dbfilename dump-7001.rdb
	dir /data/databases/redis/700
	slave-serve-stale-data yes
	slave-read-only yes
	repl-diskless-sync no
	repl-diskless-sync-delay 5
	repl-ping-slave-period 1
	repl-timeout 10
	repl-disable-tcp-nodelay no
	slave-priority 100
	appendonly no
	appendfilename "appendonly-7001.aof"
	appendfsync everysec
	no-appendfsync-on-rewrite no
	auto-aof-rewrite-percentage 100
	auto-aof-rewrite-min-size 64mb
	aof-load-truncated yes
	lua-time-limit 5000
	cluster-enabled yes
	cluster-node-timeout 3000
	cluster-slave-validity-factor 0
	slowlog-log-slower-than 10000
	slowlog-max-len 128
	notify-keyspace-events ""
	hash-max-ziplist-entries 512
	hash-max-ziplist-value 64
	list-max-ziplist-entries 512
	list-max-ziplist-value 64
	set-max-intset-entries 512
	zset-max-ziplist-entries 128
	zset-max-ziplist-value 64
	hll-sparse-max-bytes 3000
	activerehashing yes
	client-output-buffer-limit normal 0 0 0
	client-output-buffer-limit slave 256mb 64mb 60
	client-output-buffer-limit pubsub 32mb 8mb 60
	hz 10
	aof-rewrite-incremental-fsync yes
</code></pre>
</details>

	[配置详解](https://cloud.tencent.com/developer/article/1178736 "Redis.conf")
## 启动redis实例
	脚本启动redis
		#!/bin/sh
		REDIS_HOME=/data/software/redis-3.2.9
		$REDIS_HOME/bin/redis-server $REDIS_HOME/conf/redis-7001.conf
		$REDIS_HOME/bin/redis-server $REDIS_HOME/conf/redis-7002.conf

## 创建和启动Redis cluster
### 安装ruby
	安装命令：yum -y install ruby 
	查看版本：ruby --version
			ruby 2.0.0p648 (2015-12-16) [x86_64-linux]
### 安装rubygems 
	安装命令：yum -y install rubygems
### 安装redis-3.0.0.gem
	安装命令：gem install -l redis-3.0.0.gem

	redis-3.0.0.gem下载网址：https://rubygems.org/downloads/redis-3.0.0.gem 
### redis-trib.rb
	redis-trib.rb是redis官方提供的redis cluster管理工具，使用ruby实现。 
##创建和启动redis集群 
### 复制redis-trib.rb 
 	将redis源代码的src目录下的集群管理程序redis-trib.rb复制到/data/redis/bin目录，并将bin目录加入到环境变量PATH中，以简化后续的操作。 
### 创建redis cluster 
	./redis-trib.rb create --replicas 1 192.168.31.48:7001 192.168.31.49:7003 192.168.31.50:7005 192.168.31.48:7002 192.168.31.49:7004 192.168.31.50:7006
#### 执行成功结果
<details>
<summary>展开查看</summary>
<pre><code>
>>> Performing Cluster Check (using node 192.168.31.48:7001)
M: 7183bc79d2e7b6f05603975ccd8edbd8f6862c94 192.168.1.48:7001
   slots:0-5460 (5461 slots) master
   1 additional replica(s)
M: 7a3659fadabdfd33fdb34f9ef4c8b8033d197e3a 192.168.1.49:7003
   slots:5461-10922 (5462 slots) master
   1 additional replica(s)
S: 8096d1e0d152c13276531970179fc84aee27af89 192.168.1.48:7002
   slots: (0 slots) slave
   replicates 7a3659fadabdfd33fdb34f9ef4c8b8033d197e3a
S: 47667da1855b59a5f49e6b61809e5aa0d76a66d1 192.168.1.50:7006
   slots: (0 slots) slave
   replicates fbeb65ba782d802c05d6e10b392f786b96e792ee
M: fbeb65ba782d802c05d6e10b392f786b96e792ee 192.168.1.50:7005
   slots:10923-16383 (5461 slots) master
   1 additional replica(s)
S: 00dc515e14849eb4a4c1d89fa44c79a3a869ea5c 192.168.1.49:7004
   slots: (0 slots) slave
   replicates 7183bc79d2e7b6f05603975ccd8edbd8f6862c94
[OK] All nodes agree about slots configuration.
>>> Check for open slots...
>>> Check slots coverage...
[OK] All 16384 slots covered.

</code></pre>
</details>

### Redis Cluster验证
	redis-cli -c -h 192.168.1.48 -p 7001 （使用Cluster 需要加 -c 参数）
	192.168.31.48:7001> cluster nodes
	7a3659fadabdfd33fdb34f9ef4c8b8033d197e3a 192.168.1.49:7003 master - 0 1594276821903 8 connected 5461-10922
	8096d1e0d152c13276531970179fc84aee27af89 192.168.1.48:7002 slave 7a3659fadabdfd33fdb34f9ef4c8b8033d197e3a 0 1594276822905 8 connected
	47667da1855b59a5f49e6b61809e5aa0d76a66d1 192.168.1.50:7006 slave fbeb65ba782d802c05d6e10b392f786b96e792ee 0 1594276822905 6 connected
	fbeb65ba782d802c05d6e10b392f786b96e792ee 192.168.1.50:7005 master - 0 1594276821903 3 connected 10923-16383
	7183bc79d2e7b6f05603975ccd8edbd8f6862c94 192.168.1.48:7001 myself,master - 0 0 1 connected 0-5460
	00dc515e14849eb4a4c1d89fa44c79a3a869ea5c 192.168.1.49:7004 slave 7183bc79d2e7b6f05603975ccd8edbd8f6862c94 0 1594276821903 5 connected
### 查看集群信息
	192.168.1.48:7001> CLUSTER INFO
	cluster_state:ok
	cluster_slots_assigned:16384
	cluster_slots_ok:16384
	cluster_slots_pfail:0
	cluster_slots_fail:0
	cluster_known_nodes:6
	cluster_size:3
	cluster_current_epoch:8
	cluster_my_epoch:1
	cluster_stats_messages_sent:77328
	cluster_stats_messages_received:70420

## 禁止执行命令
		KEYS命令很耗时，FLUSHDB和FLUSHALL命令可能导致误删除数据，所以线上环境最好禁止使用，可以在Redis配置文件增加如下配置： 
	rename-command KEYS ""
	rename-command FLUSHDB ""
	rename-command FLUSHALL ""

