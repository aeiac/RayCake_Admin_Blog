<template>	
	<svg style="display: none">
		<filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
			<feTurbulence type="fractalNoise" baseFrequency="0.001 0.005" numOctaves="1" seed="17"
				result="turbulence" />
			<feComponentTransfer in="turbulence" result="mapped">
				<feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
				<feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
				<feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
			</feComponentTransfer>
			<feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
			<feSpecularLighting in="softMap" surfaceScale="5" specularConstant="1" specularExponent="100"
				lighting-color="white" result="specLight">
				<fePointLight x="-200" y="-200" z="300" />
			</feSpecularLighting>
			<feComposite in="specLight" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litImage" />
			<feDisplacementMap in="SourceGraphic" in2="softMap" scale="200" xChannelSelector="R" yChannelSelector="G" />
		</filter>
	</svg>

	<div class="wrapper">
		<a :href="link" target="_blank">
			<div class="liquidGlass-wrapper">
				<div class="liquidGlass-inner">
					<div class="liquidGlass-effect"></div>
					<div class="liquidGlass-tint"></div>
					<div class="liquidGlass-shine"></div>
					<div class="liquidGlass-text">
						<div class="dock">
							<img v-for="(icon, index) in icons" :key="index" :src="icon" alt="App Icon"   @click="goToArticle"/>
						</div>
					</div>
				</div>
			</div>
		</a>
	</div>
</template>

<script setup>
	import {ref} from 'vue';
	import { useRouter } from 'vue-router'
	const router = useRouter()
	
	function goToArticle() {
		  router.push('/article')
	}
	const props = defineProps({
		
		icons: {
			type: Array,
			default: () => [
				'https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/finder.png',
				'https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/map.png',
				'https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/messages.png',
				'https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/notes.png',
				'https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/notes.png',
				'https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/notes.png',
				'https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/notes.png',
				'https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/notes.png',
				'https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/notes.png',
				'https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/notes.png',
			],
		},
	});
</script>

<style scoped>
	.liquidGlass-wrapper {
		position: relative;
		display: flex;
		font-weight: 600;
		color: black;
		cursor: pointer;
		box-shadow: 0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1);
		transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 2.2);
		width: auto;
		border-radius: 0 20px 20px 0;
		overflow: visible;
		z-index: 1;
	}

	.liquidGlass-effect,
	.liquidGlass-tint,
	.liquidGlass-shine {
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 0;
		border-radius: 0 20px 20px 0;
	}

	.liquidGlass-effect {
		backdrop-filter: blur(3px);
		filter: url(#glass-distortion);
	}

	.liquidGlass-tint {
		background: rgba(255, 255, 255, 0.25);
	}

	.liquidGlass-shine {
		box-shadow: inset 2px 2px 1px 0 rgba(255, 255, 255, 0.5),
			inset -1px -1px 1px 1px rgba(255, 255, 255, 0.5);
	}

	.liquidGlass-text {
		z-index: 1;
		font-size: 2rem;
		color: black;
	}

	.wrapper {
		position: fixed;
		bottom: 20px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 25px;
		z-index: 1000;
	}

	.dock {
		display: flex;
		align-items: flex-end;
		justify-content: center;
		user-select: none;
		padding: 0.5rem;
		gap: 30px;
		touch-action: pan-x;
		max-width: 90vw;
	}

	.dock img {
		width: 50px;
		position: relative;
		border-radius: 1rem;
		transition: transform 0.3s ease, filter 0.3s ease;
		will-change: transform, filter;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
		z-index: 1;
	}

	.dock img:hover {
		transform: scale(1.6) translateY(-20px);
		filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.3));
		z-index: 10;
	}
</style>