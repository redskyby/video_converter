export interface ConvertButtonProps {
    onClick: () => Promise<void>;
    isPending: boolean;
    isDisabled?: boolean;
}
