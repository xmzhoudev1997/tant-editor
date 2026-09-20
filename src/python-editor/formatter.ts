import { format as ruffFormat } from '@wasm-fmt/ruff_fmt';

interface PythonFormatOptions {
  /** Python 缩进宽度，默认 4。 */
  indentWidth?: number;
  /** 选中内容所在层级的缩进宽度。 */
  baseIndentWidth?: number;
}

interface DynamicParameterToken {
  /** 格式化期间使用的合法 Python 标识符。 */
  token: string;
  /** 用户原始内容，例如 `${user_id}`。 */
  value: string;
}

const DYNAMIC_PARAMETER_PATTERN = /\$\{[^{}]*\}/g;

const createDynamicParameterPrefix = () => {
  const random = Math.random().toString(36).slice(2, 10);
  return `__TANT_DYNAMIC_PARAM_${random}_`;
};

const replaceDynamicParameters = (code: string, prefix: string) => {
  const tokens: DynamicParameterToken[] = [];

  const replaced = code.replace(DYNAMIC_PARAMETER_PATTERN, (value: string) => {
    const token = `${prefix}${tokens.length}_`;
    tokens.push({ token, value });
    return token;
  });

  return { replaced, tokens };
};

const restoreDynamicParameters = (
  code: string,
  prefix: string,
  tokens: DynamicParameterToken[],
) => {
  if (!tokens.length) {
    return code;
  }

  return code.replace(new RegExp(`${prefix}(\\d+)_`, 'g'), (_, value) => {
    const item = tokens[Number(value)];
    return item ? item.value : '';
  });
};

const removeBaseIndentation = (code: string, indentWidth: number) => {
  if (indentWidth <= 0) {
    return code;
  }

  const indent = ' '.repeat(indentWidth);
  return code.split('\n').map((line) => {
    if (!line.trim() || !line.startsWith(indent)) {
      return line;
    }
    return line.slice(indent.length);
  }).join('\n');
};

const addBaseIndentationExceptFirstLine = (code: string, indentWidth: number) => {
  if (indentWidth <= 0) {
    return code;
  }

  const indent = ' '.repeat(indentWidth);
  return code.split('\n').map((line, index) => {
    if (index === 0 || !line) {
      return line;
    }
    return `${indent}${line}`;
  }).join('\n');
};

/**
 * 格式化 Python 代码。
 *
 * `${xxx}` 是业务里的动态参数，不是标准 Python 语法。格式化前会先替换成
 * 临时标识符，格式化完成后再原样还原，因此它不会导致格式化失败。
 */
export default (code: string, options: PythonFormatOptions = {}) => {
  const indentWidth = options.indentWidth || 4;
  const baseIndentWidth = options.baseIndentWidth || 0;
  const source = removeBaseIndentation(code, baseIndentWidth);
  const prefix = createDynamicParameterPrefix();
  const { replaced, tokens } = replaceDynamicParameters(source, prefix);

  const formatted = ruffFormat(replaced, 'tant-editor.py', {
    indent_style: 'space',
    indent_width: indentWidth,
    line_width: 88,
    quote_style: 'preserve',
    magic_trailing_comma: 'respect',
  });

  const restored = restoreDynamicParameters(formatted, prefix, tokens);
  return addBaseIndentationExceptFirstLine(restored, baseIndentWidth);
};
