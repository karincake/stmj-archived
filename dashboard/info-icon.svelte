<script>
	export let height = 90;
	export let boxClass;
	export let icon;
	export let label;
	export let value;
</script>

<div class="info-icon {boxClass}" style="height:{height}px;">
	<div class="icon"><i class="{icon}"></i></div>
	<div class="value">{value}</div>
	<div class="label">{label}</div>
</div>

<style>
	.info-icon {
		padding-right:15px;
		position: relative;
	}
	.info-icon .icon {
		font-size:40px;
		position: absolute;
		top: 0px;
		left: 15px;
		color: rgba(255, 255, 255, .5)
	}
	.info-icon .value, .info-icon .label {
		text-align: right;
	}
	.info-icon .value {
		font-size: 40px;
	}
	.info-icon .label {
		position:absolute;
		bottom:10px;
		right:10px;
		left:10px;
		font-size: 16px;
		line-height: 18px;
	}
</style>
