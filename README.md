# SONORA · 音乐流派发展地图

一个基于 Three.js 的交互式 3D 音乐流派时间地图。时间沿垂直方向从远古升至当代；各时代内部以留有中心空隙的环形方式铺开。节点颜色表示人工归纳的声音家族，弧线表示人工整理的示意影响关系。

## 启动

需要可用的网络连接来加载 Three.js 与字体 CDN。请在此目录打开终端并运行：

```bash
python3 -m http.server 8000
```

然后打开 <http://localhost:8000>。

## 操作

- 左键拖动旋转，滚轮缩放，右键拖动平移。
- 搜索流派后按 Enter 定位；点左侧类别切换显示。
- 悬停显示流派名称，点击节点查看年代、类别和相邻示意关系。
- 点击底部时代可将镜头移至该层。

## 数据说明

- `data/catalog-a-c.txt` 是 MusicBrainz 公共流派目录中按字母排列的一段名称快照。
- `data/selected.txt` 是为时间层次和音乐史锚点选取的代表流派清单；名称池与 MusicBrainz 目录快照合并去重。
- 页面优先载入 240 个代表性锚点，再接入目录快照中的名称并去重，随后加入 `data/additional.txt` 中的 100 个额外流派，最终显示 620 个节点。MusicBrainz 的流派条目是一组可扩展的流派标签；它本身没有为所有条目提供“起源年份”、统一分类或发展谱系。
- 页面中的年份是为了把节点放入时代层所作的约略估计。类别为展示用途的归纳。
- `data/relations.json` 与 MusicBrainz 流派名称数据分离，影响边是独立编排的示意关系，不代表 MusicBrainz 自动提供或审核过的谱系。为保证筛选后每个可见节点仍有连线，代码会按同类与年代邻近补足辅助关联；此线只表示分类与年代邻近，不代表已证实的影响关系。

参考：[MusicBrainz 流派目录](https://musicbrainz.org/genres) · [MusicBrainz API 文档](https://musicbrainz.org/doc/MusicBrainz_API)
