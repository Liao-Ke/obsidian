---
来自: "https://www.qichiyu.com/724.html"
收藏时间: 2025年11月28日 五 20:08:51
tags:
  - "网页收藏"
---
> [!note] 摘要
> Smart智能组及AI模型训练
> 
> Smart核心项目地址：
> https://github.com/vernesong/OpenClash/releases/tag/mihomo
> 
> 所需文件下载地址：
> https://github.com/qichiyuhub/rule/tree/main/config/mihomo/AI
> 
> Smart智能组参数（一个分组最好同一国家）：
> [Smart智能组参数内容]
> 
> AI模型训练步骤：
> [AI模型训练步骤内容]
> 
> ------------- Finis -------------
> 


## Smart智能组及AI模型训练

2025-07-01 七尺宇

![](https://www.youtube.com/watch?v=ZPrIhaS8FX4)

## Smart核心项目地址：

## 所需文件下载地址：

[https://github.com/qichiyuhub/rule/tree/main/config/mihomo/AI](https://github.com/qichiyuhub/rule/tree/main/config/mihomo/AI)

## Smart智能组参数（一个分组最好同一国家）：

```shell
shell
proxy-groups:

name: 智能分组

  type: smart

  ##附加权重项，优先级设置，<1 表示较低优先级，>1 表示较高优先级，默认是 1

  policy-priority: "Premium:0.9;SG:1.3" 

  ##是否使用 LightGBM 模型预测权重

  uselightgbm: false

  ##是否收集数据用于模型训练

  collectdata: false

  ##分组内代理选择策略，可选 'sticky-sessions' 或 'round-robin'，不支持 'consistent-hashing'

  ##默认是 'sticky-sessions'，散列 ，在收集数据时具有更稳定、平滑的节点切换逻辑

  strategy: sticky-sessions
```
```markdown
markdown
正则表达式如下：

 

1. SG            匹配节点里包含SG的节点，区分大小写，可匹配SG01、PSG, 不能匹配Sg、Sng等

2. (?i)SG        匹配节点里包含SG的节点，不区分大小写,可匹配SG Sg

3. ^SG$          精准匹配，只能匹配节点名字为SG的，其他不能

4. (?i)^SG$      忽略大小写地精确匹配 SG

   

其他需求自行AI (搜索需求后面备注golang正则表达式语法即可)

 

如果没有匹配到正则，比如语法错误 （SG  就会回退到关键词匹配，也就是匹配到包含SG的节点。
```

## AI模型训练步骤：

## 第一步：准备食材

你需要准备一个专门的文件夹，用来存放我们所有的工具和数据。就在你的电脑上，比如在桌面上创建一个名为 Mihomo-AI-Trainer 的文件夹。

然后，你需要把以下4个文件放进这个文件夹里：

1.smart\_weight\_data.csv - 这是你过去一段时间的网络使用记录，是训练模型最核心的“原材料”

2.[transform.go](https://github.com/vernesong/mihomo/blob/9c1477d84ad004c3f9f8c53c63ae4a94bd31b384/component/smart/lightgbm/transform.go) - 官方说明书-定义了模型需要哪些特征，菜谱。

3.go\_parser.py - 解析器脚本-用来读取 transform.go 文件

4.train\_flexible.py - 厨师---自动训练脚本，调用以上素材训练并生成模型文件

## 第二步：搭建“厨房”（准备环境）

1.安装 [Python](https://www.python.org/downloads/)

Windows用户切记: 安装时一定勾选 “ **Add Python to PATH** ”

2.安装依赖和工具

```shell
undefinedpip install pandas==2.2.3 scikit-learn==1.7.0 lightgbm==3.3.5 joblib==1.5.1 numpy==2.3.1
```

**注意：如果你之前有使用过python，请卸载以前版本的pip依赖工具，然后重新安装以上指定版本，否则可能报错！**

小白一键全部卸载命令，高手请自行解决。

```shell
undefined
pip freeze > requirements.txt

pip uninstall -y -r requirements.txt
```

## 第三步：开始“烹饪”（运行训练）

```bash
bashcd Desktop/Mihomo-AI-Trainer
```
```shell
undefinedpython train_flexible.py
```

## 第四步：享用“大餐”（部署模型）

训练成功后，你的 Mihomo-AI-Trainer 文件夹里会出现一个新文件： **Model.bin** 。这就是你的专属AI模型！