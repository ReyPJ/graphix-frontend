/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '@tinymce/tinymce-react' {
    interface EditorProps {
        apiKey?: string;
        init?: Record<string, any>;
        value?: string;
        onEditorChange?: (content: string) => void;
        onInit?: (event: any, editor: any) => void;
    }
    export class Editor extends React.Component<EditorProps> {}
}