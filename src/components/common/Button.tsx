type ButtonProps = {
    children: React.ReactNode
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    className?: string
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void // Function returns void
}

export const Button: React.FC<ButtonProps> = ({
    children,
    disabled,
    type = 'button',
    className,
    onClick,
}) => (
    <button
        type={type}
        disabled={disabled}
        className={className}
        onClick={onClick}
    >
        {children}
    </button>
)
