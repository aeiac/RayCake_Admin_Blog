<script setup>
	import zhCn from 'element-plus/es/locale/lang/zh-cn'
</script>

<template>
	<el-config-provider :locale="zhCn">
		<router-view />
	</el-config-provider>
</template>

<style>
	html,
	body,
	#app {
		height: 100%;
		margin: 0;
		padding: 0;
		overflow: hidden;
		background: url("https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/flowers.jpg")
		  center center;
		background-size: 400px;
		
	}

	/* 全局隐藏滚动条 */
	::-webkit-scrollbar {
		width: 0px;
		height: 0px;
	}

	body {
		-ms-overflow-style: none;
		/* IE 和 Edge */
		scrollbar-width: none;
		/* Firefox */
		overflow-y: scroll;
	}

	body::-webkit-scrollbar {
		display: none;
	}
	
	
</style>