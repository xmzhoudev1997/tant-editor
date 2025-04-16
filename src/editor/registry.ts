import { RC_EDITOR_TOOL, registerEditor } from "@tant/rc-editor";
import ThemeVitesseLight from 'theme-vitesse/themes/vitesse-light.json';
import ThemeVitesseDark from 'theme-vitesse/themes/vitesse-dark.json';
import { language as sqlLanguage } from 'monaco-editor/esm/vs/basic-languages/mysql/mysql';

export default async (
    locale: string,
    url: string,
    callback: (tool: RC_EDITOR_TOOL) => void = () => { },
) => {
    await registerEditor(locale as any, url, async (tool) => {
        ThemeVitesseLight.colors["editor.background"] = '#F9F9FB';
        ThemeVitesseLight.colors["editorLineNumber.foreground"] = '#d0d7d9';
        ThemeVitesseLight.colors["editor.lineHighlightBackground"] = '#B9BECF33';
        ThemeVitesseLight.colors["editor.inactiveSelectionBackground"] = '#B9BECF4D';
        ThemeVitesseLight.colors["editor.wordHighlightBackground"] = '#B9BECF4D';
        ThemeVitesseLight.colors["editor.wordHighlightStrongBackground"] = '#B9BECF4D';

        ThemeVitesseLight.rules.unshift({
            token: 'tant-variable',
            foreground: '#915AFF',
        });
        ThemeVitesseLight.rules.unshift({
            token: 'tant-variable-bracket',
            foreground: '#C0A9FF',
        });

        ThemeVitesseDark.colors["editor.background"] = '#1F1E24';
        ThemeVitesseDark.colors["editorLineNumber.foreground"] = '#DBD7CA4D';
        ThemeVitesseDark.colors["editor.lineHighlightBackground"] = '#B9BECF1A';
        ThemeVitesseDark.colors["editor.inactiveSelectionBackground"] = '#B9BECF33';
        ThemeVitesseDark.colors["editor.wordHighlightBackground"] = '#B9BECF33';
        ThemeVitesseDark.colors["editor.wordHighlightStrongBackground"] = '#B9BECF33';

        ThemeVitesseDark.rules.unshift({
            token: 'tant-variable',
            foreground: '#915AFF',
        });
        ThemeVitesseDark.rules.unshift({
            token: 'tant-variable-bracket',
            foreground: '#C0A9FF',
        });

        tool.editor.defineTheme('tant-light', ThemeVitesseLight as any);
        tool.editor.defineTheme('tant-dark', ThemeVitesseDark as any);


        sqlLanguage.tokenizer.root.unshift([/(\$\{)(.*?)(\:*?)(.*?)(\})/, ['tant-variable-bracket', 'tant-variable', 'tant-variable-bracket', 'tant-variable', 'tant-variable-bracket']]);
        sqlLanguage.tokenizer.root.unshift([/(["'`]+)([^"'`]*?)(\$\{)(.*?)(\:*?)(.*?)(\})(^"'`]*?)(["'`]+)/, ['string', 'string', 'tant-variable-bracket', 'tant-variable', 'tant-variable-bracket', 'tant-variable', 'tant-variable-bracket', 'string', 'string']]);
 
        tool.languages.setMonarchTokensProvider('mysql', sqlLanguage);

        await callback(tool);
    })
}