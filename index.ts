const svgson = require('svgson');
const elementToPath = require('element-to-path');

type ParsedVal = { children: any[]; [key: string]: any };

const parseSVGsonResult = (value: ParsedVal) => {
	const result: string[] = [];
	const handleParsing = (parsed: ParsedVal) => {
		const { children, ...attrs } = parsed;
		const val = elementToPath(attrs) as string;
		if (val) result.push(val);
		if (children.length) {
			children.forEach(handleParsing);
		}
		return result;
	};

	return handleParsing(value);
};

function convertToFAIcon(
	attrs: { attributes: { height?: string; width?: string; viewBox: string } },
	paths: string,
	name?: string,
) {
	let {
		attributes: { height, width, viewBox },
	} = attrs;
	const [, , vbWidth, vbHeight] = viewBox.split(' ');
	height ??= vbHeight;
	width ??= vbWidth;

	return {
		prefix: 'fas',
		iconName: name,
		icon: [
			parseFloat(width),
			parseFloat(height),
			[],
			`f${Math.floor(Math.random() * 9999)}`,
			paths,
		],
	};
}

const defaultName = () => new Date().getTime().toString(16); // generate default Name for icon

/**
 * Convert SVG file asynchronously  string to FontAwesome Icon object to be passed to FontAwesomeIcon Component
 * @constructor
 * @param {string} value - string passed from FileReader or from fs package on nodejs
 * @param {string} name - Name of the icon either passed from FileReader Result 'name' defaults to random string
 * **/
export async function parseSVG(value: string, name: string = defaultName()) {
	const parsed = await svgson.parse(value);
	const paths = parseSVGsonResult(parsed).join(' ');
	return convertToFAIcon(parsed, paths, name);
}

/**
 * Convert SVG file synchronously string to FontAwesome Icon object to be passed to FontAwesomeIcon Component
 * @constructor
 * @param {string} value - string passed from FileReader or from fs package on nodejs
 * @param {string} name - Name of the icon either passed from FileReader Result 'name' defaults to random string
 * **/
export function parseSVGSync(value: string, name: string = defaultName()) {
	const parsed = svgson.parseSync(value);
	const paths = parseSVGsonResult(parsed).join('');
	return convertToFAIcon(parsed, paths, name);
}
