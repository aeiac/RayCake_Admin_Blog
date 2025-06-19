<script setup>
	import zhCn from 'element-plus/es/locale/lang/zh-cn'
</script>

<template>
	<el-config-provider :locale="zhCn">
		<router-view />
	</el-config-provider>
</template>

<style>
	
	::-webkit-scrollbar {
		width: 0px;
		height: 0px;
	}

	body {
		-ms-overflow-style: none;
		scrollbar-width: none;
		overflow-y: scroll;
	}

	body::-webkit-scrollbar {
		display: none;
	}
	
	
</style>