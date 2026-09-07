

const Button = ({ children, isPending, ...props }) => {
    return (
        <button disabled={!!isPending} {...props}>
            {isPending ? 'loading...' : children}
        </button>
    )
}

export default Button