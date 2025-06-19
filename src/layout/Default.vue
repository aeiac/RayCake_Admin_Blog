<script setup>
	import {
		ref,
		defineAsyncComponent
	} from 'vue'
	import Menubar from '../components/menubar/Index.vue'
	import WindowBox from '../components/window/WindowBox.vue'

	const windows = ref([])
	let idCount = 0
	const clickedIndices = ref([])

	const pageMap = {
		0: {
			title: '文章管理',
			component: defineAsyncComponent(() => import('../views/Article/Index.vue'))
		},
		1: {
			title: 'Xx管理',
			component: defineAsyncComponent(() => import('../views/Article/Index.vue'))
		}
	}

	function findWindowByIndex(index) {
		const page = pageMap[index]
		return windows.value.find(w => w.title === page?.title)
	}

	function findIndexByTitle(title) {
		return Object.entries(pageMap).find(([index, page]) => page.title === title)?.[0]
	}

	function toggleWindow(index) {
		const page = pageMap[index]
		if (!page) return

		const existing = findWindowByIndex(index)
		if (existing) {
			closeWindow(existing.id)
		} else {
			// 新窗口位置，左偏移起点 7vw + 每打开窗口10vw递增，top 每开一个窗口下移2vh
			const leftOffset = 80 + windows.value.length * 20
			const topOffset = 80 + windows.value.length * 50

			windows.value.push({
				id: ++idCount,
				title: page.title,
				component: page.component,
				left: leftOffset,
				top: topOffset,
				maximized: false
			})

			if (!clickedIndices.value.includes(index)) {
				clickedIndices.value.push(index)
			}
		}
	}

	function closeWindow(id) {
		const win = windows.value.find(w => w.id === id)
		if (!win) return

		const index = findIndexByTitle(win.title)
		if (index !== undefined) {
			clickedIndices.value = clickedIndices.value.filter(i => i !== Number(index))
		}
		windows.value = windows.value.filter(w => w.id !== id)
	}

	function bringToFront(id) {
		const idx = windows.value.findIndex(w => w.id === id)
		if (idx === -1) return
		const win = windows.value.splice(idx, 1)[0]
		windows.value.push(win)
	}

	function toggleMaximize(id) {
		windows.value.forEach(w => {
			if (w.id === id) {
				w.maximized = !w.maximized
			} else {
				w.maximized = false
			}
		})
	}
</script>

<template>
	<div v-for="win in windows" :key="win.id" class="window-box-wrapper" :style="{ zIndex: windows.indexOf(win) + 1 }">
		<WindowBox :title="win.title" :component="win.component" :left="win.left" :top="win.top"
			:maximized="win.maximized" @close="closeWindow(win.id)" @toggle-maximize="toggleMaximize(win.id)"
			@mousedown.native="bringToFront(win.id)" :style="{ zIndex: windows.indexOf(win) + 1 }" />
	</div>

	<Menubar :clickedIndices="clickedIndices" @icon-click="toggleWindow" @icon-close="closeWindow" />
</template>
<style>
	html,
	body,
	#app {
		height: 100%;
		margin: 0;
		padding: 0;
		overflow: hidden;
		background: url("https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/flowers.jpg") center center;
		background-size: 400px;
	}
</style>