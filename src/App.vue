<script setup>
	import zhCn from 'element-plus/es/locale/lang/zh-cn'
</script>

<template>
	<el-config-provider :locale="zhCn">
		<router-view />
	</el-config-provider>
</template>

<style>
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