export default function PostTag({ children, fontSize }) {
    return (
        <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded" style={{ fontSize: fontSize }}>
            {children}
        </span>
    )
}