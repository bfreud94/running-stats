export const metersToMile = (number) => Math.round(100 * (number / 1609.34)) / 100

export const replaceAt = (index, originalString, replacement, afterLeftOffset) => {
	if (index < 0 || index > originalString.length) {
		return originalString
	}
	const before = originalString.substring(0, index)
	const after = originalString.substring(afterLeftOffset + index, originalString.length)
	return before + replacement + after
}