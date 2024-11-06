---
title: 'Android build'
date: 2024-11-06
permalink: /posts/2024/05/Android-build/
tags:
  - cool posts
  - category1
  - category2
---
拉取代码
​
1
stage('clone') {
2
        steps {
3
        git branch: "$BRANCH", credentialsId: 'dev',  url: 'git@git.alibaba-inc.com:alicloud/nvwa.git'
4
        script {
5
                DATA1 = sh(returnStdout: true, script: 'date +%Y%m%d').trim()
6
               BU_TAG = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
7
        }
8
        }
9
    }
​
build构建
​
1
stage('gradle build') {
2
        steps {
3
        sh '''
4
            export JAVA_HOME=/usr/local/jdk-11/
5
            export JRE_HOME=/usr/local/jdk-11//jre
6
            export CLASSPATH=.:$JAVA_HOME/lib:$JRE_HOME/lib:$CLASSPATH
7
            export PATH=$JAVA_HOME/bin:$JRE_HOME/bin:$PATH
8
            export ANDROID_HOME=/usr/local/sdkmanager
9
            export PATH=${ANDROID_HOME}/tools/bin:${ANDROID_HOME}/tools/bin:${ANDROID_HOME}:${PATH}
10
            export NDK_HOME=/usr/local/android-ndk-r16b
11
            export ANDROID_NDK_HOME=/usr/local/android-ndk-r16b
12
            export PATH=$NDK_HOME:${ANDROID_NDK_HOME}:$PATH
13
            export ANDROID_SDK_ROOT=/usr/local/android-sdk-linux
14
            export PATH=$ANDROID_SDK_ROOT/tools:$PATH
15
            export PATH=$ANDROID_SDK_ROOT/platform-tools:$PATH
16
            /usr/local/gradle-7.6/bin/gradle  clean assembleDebug
17
        '''
18
        }
19
    }
​
上传蒲公英
​
​
发送通知
方法1

​
​
方法2（推荐，官方）

​

​