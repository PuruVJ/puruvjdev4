---
title: Packaging npm module with submodules + TypeScript is...hard 😐
description: Packaging a package with submodules is extremely hard. Here's my experiences with tackling it.
date: 5 Nov, 2021
cover_image: media/packaging-submodules-for-npm--thumbnail.png
---

![Angry cover image](../../static/media/packaging-submodules-for-npm--thumbnail.png)

If you have ever published an npm package, you know how hard it is. You have to make sure to support ESM, CJS, Browser, unpkg, as well as give TypeScript definitions. Then to test if it is working, you have to publish patches and install in another project, or use some tools to proxy it to local npm packages, just to see if it works or not.
