export interface Props {
    value?: string;
    onChange?: (v: string) => Promise<void> | void;
    className?: string;
}