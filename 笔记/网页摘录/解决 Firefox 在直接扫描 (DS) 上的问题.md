---
来自: "https://gitlab.gnome.org/tuxor1337/hidetopbar/-/issues?sort=created_date&state=opened&page_before=eyJjcmVhdGVkX2F0IjoiMjAyMC0wNC0yNSAwODoyNDowOS4wMDAwMDAwMDAgKzAwMDAiLCJpZCI6IjE2NTg1MyJ9&show=eyJpaWQiOiI0MjMiLCJmdWxsX3BhdGgiOiJ0dXhvcjEzMzcvaGlkZXRvcGJhciIsImlkIjoyMTMxODh9"
摘录时间: 2025年11月07日 五 20:31:15
网页标题: "Issues · Thomas / hidetopbar · GitLab"
tags:
  - "网页摘录"
---
> [!note] 摘要
> 这个错误是由于称为“直接扫描”的 Gnome 功能造成的，对于全屏的 Wayland 应用程序，这可以绕过合成器复制路径并直接向 GPU 发送信号。Firefox 最近在 DS 上遇到了一些问题，这就是它“有效”的原因（不再有性能优化）。您可以按 ALT+F2 完全禁用 DS，键入“lg”，单击“标志”并选中“DISABLE_DIRECT_SCANOUT”。


这个错误是由于称为“直接扫描”的 Gnome 功能造成的，对于全屏的 Wayland 应用程序，这可以绕过合成器复制路径并直接向 GPU 发送信号。Firefox 最近在 DS 上遇到了一些问题，这就是它“有效”的原因（不再有性能优化）。您可以按 ALT+F2 完全禁用 DS，键入“lg”，单击“标志”并选中“DISABLE\_DIRECT\_SCANOUT”。