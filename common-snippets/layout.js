export function getBreakPoint(windowInnerWidth) {
	return(!windowInnerWidth || windowInnerWidth < 576) ? 'xs' :
		(windowInnerWidth < 768) ? 'sm' :
		(windowInnerWidth < 992) ? 'md' :
		(windowInnerWidth < 1200) ? 'lg' :
		(windowInnerWidth < 1400)  ? 'xl' : 'xxl';
}
